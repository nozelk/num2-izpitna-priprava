(() => {
  "use strict";

  const DATA = window.STUDY_DATA;
  const REVIEW = window.REVIEW_3H;
  const ORAL = window.NUM2_ORAL || [];
  const view = document.querySelector("#view");
  const breadcrumb = document.querySelector("#breadcrumb");
  const toastEl = document.querySelector("#toast");
  const sidebar = document.querySelector("#sidebar");
  const sidebarScrim = document.querySelector("#sidebar-scrim");
  const topicById = new Map(DATA.topics.map(topic => [topic.id, topic]));
  const oralById = new Map(ORAL.map(topic => [topic.id, topic]));
  const ORAL_QUICK_INTROS = Object.freeze({
    "oral-01-aproksimacijski-problem": {
      what: "Imamo zahtevno funkcijo in izberemo razred preprostejših funkcij, s katerimi jo bomo nadomestili.",
      solve: "Iščemo približek iz dovoljenega razreda, ki je prvotni funkciji čim bližje po izbranem merilu napake."
    },
    "oral-02-najboljsa-aproksimacija": {
      what: "Med vsemi dovoljenimi približki ne želimo le dobrega, ampak dokazano najboljšega.",
      solve: "Iščemo približek z najmanjšo možno napako; pri enakomerni polinomski aproksimaciji ga prepoznamo po alterniranju napake."
    },
    "oral-03-odsekoma-polinomske-funkcije": {
      what: "Interval razdelimo na manjše dele in na vsakem uporabimo svoj preprost polinom.",
      solve: "Lokalne polinome želimo zlepiti tako, da zadenejo podatke in imajo na stikih zahtevano gladkost."
    },
    "oral-04-bezierjeve-krivulje": {
      what: "To je parametrična polinomska krivulja, katere obliko nadzorujemo s kontrolnimi točkami.",
      solve: "Iz kontrolnega poligona želimo dobiti gladko krivuljo, ki jo lahko predvidljivo rišemo, premikamo in oblikujemo."
    },
    "oral-05-de-casteljau": {
      what: "To je geometrijski algoritem zaporednih linearnih interpolacij med kontrolnimi točkami.",
      solve: "Za izbrani parameter želimo stabilno izračunati točko na Bézierjevi krivulji in po potrebi krivuljo razdeliti."
    },
    "oral-06-zlepek-bezierjevih-krivulj": {
      what: "Več krajših Bézierjevih odsekov povežemo v eno daljšo krivuljo.",
      solve: "Kontrolne točke ob stikih uredimo tako, da ni preskoka ter da se ujemajo tangente oziroma višji odvodi."
    },
    "oral-07-konstrukcija-bezierjevih-zlepkov": {
      what: "Iz podanih točk, tangent ali drugih pogojev moramo dejansko sestaviti kontrolne poligone vseh odsekov.",
      solve: "Določamo neznane kontrolne točke, da zlepek interpolira podatke in izpolni zahtevane pogoje gladkosti."
    },
    "oral-08-pravila-za-odvajanje": {
      what: "Odvod ocenimo iz nekaj bližnjih vrednosti funkcije, ker ga ne poznamo neposredno.",
      solve: "Iz vzorcev funkcije želimo dobiti čim natančnejši približek odvoda ter razumeti red napake in vpliv zaokroževanja."
    },
    "oral-09-newton-cotesova-pravila": {
      what: "Integral nadomestimo z uteženo vsoto vrednosti funkcije v enakomerno razporejenih točkah.",
      solve: "Približujemo ploščino brez iskanja primitivne funkcije ter ocenimo, kako natančna sta trapezno ali Simpsonovo pravilo."
    },
    "oral-10-izboljsana-pravila-integriranja": {
      what: "Več povezanih približkov integrala pametno kombiniramo, da izničimo njihov glavni člen napake.",
      solve: "Z že izračunanimi vrednostmi želimo doseči višjo natančnost z manj dodatnega dela, na primer z Rombergovo ekstrapolacijo."
    },
    "oral-11-enoclenske-runge-kutta": {
      what: "Iz trenutnega približka naredimo en časovni korak; Runge–Kutta znotraj njega preveri več naklonov.",
      solve: "Iz začetnega pogoja korak za korakom gradimo približek rešitve diferencialne enačbe, Butcherjeva tabela pa določa notranje stopnje."
    },
    "oral-12-vecclenske-metode": {
      what: "Novi približek izračunamo iz več že znanih prejšnjih približkov in naklonov.",
      solve: "Z uporabo zgodovine želimo poceni doseči višji red, pri tem pa potrebujemo začetne vrednosti in pazimo na stabilnost."
    },
    "oral-13-posploseni-zacetni-problem": {
      what: "Sistem ali enačbo višjega reda prepišemo kot en vektorski sistem enačb prvega reda.",
      solve: "Sestavimo vektor stanja in nato uporabimo iste Eulerjeve, Runge–Kuttove ali veččlenske metode; to ni robni problem."
    }
  });
  const STORAGE_KEY = "num2LabStateV1";
  let toastTimer;

  const persisted = readStorage();
  const state = {
    completed: new Set(persisted.completed || []),
    oralCompleted: new Set(persisted.oralCompleted || []),
    knownCards: new Set(persisted.knownCards || []),
    lastTopic: persisted.lastTopic || "aproksimacija",
    lastOral: persisted.lastOral || ORAL[0]?.id || "",
    quizBest: persisted.quizBest || 0,
    flashTopic: "core",
    flashDeck: [],
    flashIndex: 0,
    flashFlipped: false,
    quizSession: null,
    currentExamId: persisted.currentExamId || null,
    examSessions: persisted.examSessions || {}
  };

  function readStorage() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function persist() {
    const payload = {
      completed: [...state.completed],
      oralCompleted: [...state.oralCompleted],
      knownCards: [...state.knownCards],
      lastTopic: state.lastTopic,
      lastOral: state.lastOral,
      quizBest: state.quizBest,
      currentExamId: state.currentExamId,
      examSessions: state.examSessions
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }
    catch { /* The app remains usable if storage is unavailable. */ }
    updateProgress();
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function normalize(value = "") {
    return value.toLocaleLowerCase("sl").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function toast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  function routeParts() {
    const raw = location.hash.replace(/^#\/?/, "").split("?")[0];
    return (raw || "domov").split("/").filter(Boolean);
  }

  function setView(html) {
    view.innerHTML = html;
    typesetMath(view);
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function typesetMath(root) {
    if (window.katex) {
      root.querySelectorAll(".js-math[data-tex]:not([data-math-ready])").forEach(node => {
        const fallback = node.innerHTML;
        try {
          window.katex.render(node.dataset.tex, node, {
            displayMode: node.dataset.display === "block",
            output: "htmlAndMathml",
            throwOnError: true,
            strict: "warn",
            trust: false
          });
          node.dataset.mathReady = "true";
        } catch (error) {
          node.innerHTML = fallback;
          node.classList.add("math-fallback");
          console.warn("Math fallback:", node.dataset.tex, error.message);
        }
      });
    }
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(root, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false,
      strict: "ignore",
      ignoredClasses: ["answer-editor", "js-math", "katex", "katex-display"],
      macros: {
        "\\R": "\\mathbb{R}",
        "\\N": "\\mathbb{N}",
        "\\Opt": "\\operatorname{Opt}",
        "\\pp": "\\quad\\text{pri pogojih}\\quad"
      }
    });
  }

  function updateChrome(parts) {
    const base = parts[0] || "domov";
    document.querySelectorAll(".main-nav a").forEach(link => {
      const route = link.dataset.route;
      link.classList.toggle("active", route === base || (base === "teorija" && route === "teorija"));
    });

    const labels = { domov: "Pregled", "na-izi": "Na izi za ustni", "pregled-3h": "3-urni pregled", ustni: "Ustni izpit", teorija: "Teorija", kartice: "Flashcards", kviz: "Kviz", izpit: "Izpit" };
    let current = labels[base] || "Pregled";
    if (base === "teorija" && parts[1] && topicById.has(parts[1])) current = topicById.get(parts[1]).title;
    if (base === "ustni" && parts[1] && oralById.has(parts[1])) current = `Ustno ${oralById.get(parts[1]).number}: ${oralById.get(parts[1]).title}`;
    breadcrumb.innerHTML = `Numerične metode 2 <span>/</span> ${escapeHtml(current)}`;
    document.title = `${current} — NUM2/LAB`;
  }

  function updateProgress() {
    const total = DATA.topics.length + ORAL.length;
    const done = state.completed.size + state.oralCompleted.size;
    const ratio = total ? done / total : 0;
    const percent = Math.round(ratio * 100);
    const orbit = document.querySelector(".orbit-value");
    if (orbit) orbit.style.strokeDashoffset = String(113.1 * (1 - ratio));
    const label = document.querySelector("#sidebar-progress span");
    const copy = document.querySelector("#progress-copy");
    if (label) label.textContent = `${percent}%`;
    if (copy) copy.textContent = `${state.oralCompleted.size}/${ORAL.length} ustnih · ${state.completed.size}/${DATA.topics.length} teorije`;
  }

  function topicCard(topic) {
    const done = state.completed.has(topic.id);
    return `<a class="topic-card ${done ? "done" : ""}" href="#/teorija/${topic.id}" style="--topic-accent:${topic.accent}" data-number="${topic.number}">
      <div class="topic-card-top"><span>${done ? "opravljeno" : `ustno ${topic.oral.join(", ")}`}</span><i class="topic-dot"></i></div>
      <h3>${topic.title}</h3>
      <p>${topic.short}</p>
      <footer>${topic.minutes} min · ${topic.sections.length} sklopov →</footer>
    </a>`;
  }

  function reviewMathPanel(formula, label, tone = "") {
    if (!formula) return "";
    return window.StudyUI.panel(formula.tex, formula.fallback || formula.tex, label, tone);
  }

  function reviewNotation(entries) {
    return `<dl class="review-notation">${entries.map(entry => `
      <div class="review-notation-item ${entry.tex.length > 32 ? "review-notation-wide" : ""}">
        <dt>${window.StudyUI.M(entry.tex, entry.symbol)}</dt>
        <dd>${entry.meaning}</dd>
      </div>`).join("")}</dl>`;
  }

  function reviewExample(example, level) {
    if (!example) return "";
    return `<article class="review-example" data-level="${level}">
      <span>${level === "easy" ? "Lahek primer" : "Malo težji primer"}</span>
      <p class="review-example-prompt">${example.prompt}</p>
      <ol>${(example.work || []).map(step => `<li>${step}</li>`).join("")}</ol>
      <div class="review-example-answer"><strong>Rezultat</strong>${example.answer}</div>
    </article>`;
  }

  function reviewSpoken(spoken, methodId) {
    if (!spoken) return "";
    return `<section class="review-subsection review-spoken">
      <div class="review-subhead"><span>01</span><div><strong>Najprej povej po domače</strong><small>To je odgovor, ki ga lahko dejansko poveš profesorju.</small></div></div>
      <div class="review-professor-question"><span>Profesor vpraša</span><h3>${spoken.question}</h3><button type="button" data-action="review-toggle-answer" aria-expanded="true" aria-controls="spoken-answer-${methodId}">Skrij odgovor</button></div>
      <div class="review-spoken-answer" id="spoken-answer-${methodId}"><span>Začni takole</span>${spoken.answer.map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
      <div class="review-anatomy">${spoken.anatomy.map(item => `<article><span>${item.label}</span><p>${item.text}</p></article>`).join("")}</div>
      <div class="review-recall"><strong>Preveri se</strong><p>Pokrij odgovor in ga povej še enkrat s svojimi besedami. Nato na diagramu pokaži vsak objekt in šele iz njega napiši formulo.</p></div>
    </section>`;
  }

  function reviewVisual(visual) {
    if (!visual) return "";
    return `<section class="review-subsection review-visual">
      <div class="review-subhead"><span>02</span><div><strong>Tako to dejansko izgleda</strong><small>Najprej si oglej objekt, nato preberi njegov matematični zapis.</small></div></div>
      <header class="review-visual-head"><span>Slika zapisa</span><h3>${visual.title}</h3><p>${visual.lead}</p></header>
      <div class="review-visual-stage">${visual.diagram}</div>
      <div class="review-visual-formulas">${visual.formulas.map(formula => `<article><span>${formula.label}</span>${reviewMathPanel(formula, formula.label, "green")}<p>${formula.explain}</p></article>`).join("")}</div>
      <div class="review-visual-callouts">${visual.callouts.map(item => `<article><span>${item.label}</span><p>${item.text}</p></article>`).join("")}</div>
    </section>`;
  }

  const reviewTopicMap = {
    aproksimacija: "aproksimacija",
    remes: "remes-cebisev",
    bezier: "bezier",
    "bezier-stiki": "bezier-zlepki",
    diference: "odvajanje",
    kvadrature: "newton-cotes",
    euler: "euler-trapez",
    "runge-kutta": "runge-kutta",
    zlepki: "zlepki"
  };

  function reviewMethod(method, index) {
    const target = `review-${method.id}`;
    const deepTopic = reviewTopicMap[method.id];
    return `<section class="review-method" id="${target}" data-review-method="${method.id}" style="--review-accent:${method.accent}">
      <header class="review-method-head">
        <span class="review-method-number">${String(index + 1).padStart(2, "0")}</span>
        <div><span class="eyebrow">${method.eyebrow}</span><h2>${method.title}</h2><p>${method.use}</p></div>
        <span class="review-time">≈ ${method.minutes} min</span>
      </header>

      <div class="review-trigger-row">
        <strong>Kdaj jo prepoznaš?</strong>
        ${(method.trigger || []).map(item => `<span>${item}</span>`).join("")}
      </div>

      ${reviewSpoken(method.spoken, method.id)}
      ${reviewVisual(method.visual)}

      <section class="review-subsection">
        <div class="review-subhead"><span>03</span><div><strong>Prevedi simbole v besede</strong><small>Zdaj lahko vsak del zapisa povežeš s pomenom.</small></div></div>
        ${reviewNotation(method.notation || [])}
      </section>

      <section class="review-subsection">
        <div class="review-subhead"><span>04</span><div><strong>Iz besed sestavi matematični zapis</strong><small>Osnovni model in nekoliko močnejši zapis oziroma certifikat.</small></div></div>
        <div class="review-formula-grid">
          <article><span class="review-card-label">Osnovni zapis</span>${reviewMathPanel(method.basic, "osnovni zapis", "green")}<p>${method.basic?.explain || ""}</p></article>
          <article><span class="review-card-label">Naprednejši pogled</span>${reviewMathPanel(method.advanced, "naprednejši zapis", "violet")}<p>${method.advanced?.explain || ""}</p></article>
        </div>
      </section>

      <section class="review-subsection">
        <div class="review-subhead"><span>05</span><div><strong>Algoritem in kaj opazuješ</strong><small>Koraki naj imajo razlog, ne le zaporedne ukaze.</small></div></div>
        <ol class="review-algorithm">${(method.algorithm || []).map(step => `
          <li><div><strong>${step.title}</strong><p>${step.detail}</p>${step.watch ? `<aside><b>Glej:</b> ${step.watch}</aside>` : ""}</div></li>`).join("")}</ol>
        <div class="review-watch"><strong>Preden greš naprej, preveri</strong><ul>${(method.watch || []).map(item => `<li>${item}</li>`).join("")}</ul></div>
      </section>

      <section class="review-subsection">
        <div class="review-subhead"><span>06</span><div><strong>Dva hitra primera</strong><small>Najprej mehanika, nato izbira prave ideje.</small></div></div>
        <div class="review-example-grid">${reviewExample(method.easy, "easy")}${reviewExample(method.hard, "hard")}</div>
      </section>

      <section class="review-subsection review-oral">
        <div class="review-subhead"><span>07</span><div><strong>Na hitro še enkrat</strong><small>Ključne točke za zadnjih trideset sekund odgovora.</small></div></div>
        <ol>${(method.oral || []).map(sentence => `<li>${sentence}</li>`).join("")}</ol>
        <div class="review-pitfall"><strong>Izpitna past</strong><p>${method.pitfall}</p></div>
        ${deepTopic ? `<a class="review-deep-link" href="#/teorija/${deepTopic}">Odpri celotno teorijo in dokaze <span>→</span></a>` : ""}
      </section>
    </section>`;
  }

  function renderLegacyReview() {
    if (!REVIEW) {
      setView(`<div class="empty-state">3-urni pregled se ni naložil.</div>`);
      return;
    }
    const methods = REVIEW.methods || [];
    const jumpButtons = methods.map((method, index) => `
      <button type="button" data-action="scroll-section" data-target="review-${method.id}" style="--review-accent:${method.accent}">
        <b>${String(index + 1).padStart(2, "0")}</b><span>${method.title}</span><small>${method.minutes} min</small>
      </button>`).join("");
    const question = REVIEW.classmateQuestion;

    setView(`
      <header class="review-hero">
        <div class="review-hero-copy"><span class="eyebrow">En krog čez cel predmet</span><h1>${REVIEW.title}</h1><p>${REVIEW.subtitle}</p>
          <div class="hero-actions"><button class="primary-button" type="button" data-action="scroll-section" data-target="review-aproksimacija">Začni: aproksimacijski problem</button><button class="secondary-button" type="button" data-action="scroll-section" data-target="review-study-mode">Kako se učiš s stranjo</button><button class="secondary-button" type="button" data-action="scroll-section" data-target="review-question">Kaj profesor sprašuje</button></div>
        </div>
        <div class="review-hero-score"><strong>3h</strong><span>${methods.length} ključnih sklopov</span><small>${methods.length} diagramov · ${methods.length * 2} primerov</small></div>
      </header>

      <section class="review-schedule" aria-label="Triurni načrt">${REVIEW.timetable.map(item => `
        <article><time>${item.time}</time><strong>${item.title}</strong><p>${item.detail}</p></article>`).join("")}</section>

      <section class="review-study-mode" id="review-study-mode">
        <header><span class="eyebrow">Ne beri pasivno</span><h2>Od odgovora v besedah do formule</h2><p>Pri vsaki metodi naredi isti kratek krog. Tako se učiš razlagati, ne samo prepoznavati zapis.</p></header>
        <div class="review-study-steps">
          <article><b>01</b><div><strong>Preberi na glas</strong><p>Najprej preberi govorjeni odgovor in si predstavljaj, da ga govoriš profesorju.</p></div></article>
          <article><b>02</b><div><strong>Pokrij in ponovi</strong><p>Brez gledanja povej: kaj so podatki, kaj iščemo, kateri pogoji veljajo in kaj dobimo.</p></div></article>
          <article><b>03</b><div><strong>Poglej, kako izgleda</strong><p>Na diagramu pokaži funkcijo, stencil, kontrolni poligon ali časovni korak in s prstom sledi označenim delom.</p></div></article>
          <article><b>04</b><div><strong>Iz slike napiši</strong><p>Iz prikaza sestavi formulo, nato pa razumevanje preveri na lahkem in težjem primeru.</p></div></article>
        </div>
      </section>

      <section class="review-language" id="review-language">
        <header class="review-section-head"><span class="eyebrow">Ko razumeš besede</span><h2>Kako jih prevedeš v matematiko</h2><p>Najprej razloži pomen objektov, nato napiši model, algoritem in na koncu certifikat.</p></header>
        ${reviewNotation(REVIEW.universalNotation)}
        <div class="review-writing-grid">${REVIEW.writingRules.map(rule => `
          <article><span>${rule.title}</span><p class="review-weak"><b>Premalo natančno</b>${rule.weak}</p>${reviewMathPanel({ tex: rule.strong, fallback: rule.strong }, "natančen zapis", "amber")}<p>${rule.why}</p></article>`).join("")}</div>
        <div class="review-answer-template"><strong>Univerzalna zgradba ustnega odgovora</strong><ol>${REVIEW.oralTemplate.map(item => `<li>${item}</li>`).join("")}</ol></div>
      </section>

      <section class="review-question" id="review-question">
        <span class="eyebrow">Vzorec dejanskega izpita</span><h2>${question.title}</h2><p class="review-question-prompt">${question.prompt}</p>
        <div class="review-question-spoken"><span>Vzoren odgovor v besedah</span>${(question.spokenAnswer || []).map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
        <div class="review-question-math-label">Nato dodaj ključne matematične zapise</div>
        <div class="review-question-formulas">${question.formulas.map(formula => reviewMathPanel({ tex: formula.tex, fallback: formula.tex }, formula.label, "violet")).join("")}</div>
        <div class="review-question-plan"><strong>Vrstni red dobrega odgovora</strong><ol>${question.plan.map(item => `<li>${item}</li>`).join("")}</ol></div>
        <p class="review-added-note">Generator vedno sestavi en aktualen problem iz vsakega od štirih izpitnih sklopov.</p>
      </section>

      <section class="review-reserve">
        <header class="review-section-head"><span class="eyebrow">Če ostane 8 minut</span><h2>Rezervne teme, ki jih vseeno prepoznaj</h2><p>Na novejših izpitih so redkejše, vendar sodijo v celotno teorijo. Tukaj potrebuješ vsaj osnovni zapis in idejo postopka.</p></header>
        <div class="review-reserve-grid">${(REVIEW.reserve || []).map(item => `
          <article><span>${item.label}</span><h3>${item.title}</h3><p>${item.text}</p>${reviewMathPanel({ tex: item.tex, fallback: item.tex }, item.label, "amber")}<a href="#/teorija/${item.topic}">Odpri celotno temo <b>→</b></a></article>`).join("")}</div>
      </section>

      <section class="review-map"><header class="review-section-head"><span class="eyebrow">Hitro kazalo</span><h2>Izberi metodo</h2><p>Pri vsaki najprej povej odgovor, nato na diagramu pokaži objekte. Če se izgubiš, se vrni na podatke, neznanko, pogoje in rezultat.</p></header><div class="review-jump-grid">${jumpButtons}</div></section>

      <div class="review-layout">
        <article class="review-methods">${methods.map(reviewMethod).join("")}</article>
        <nav class="review-rail" aria-label="Kazalo metod"><strong>Metode</strong>${jumpButtons}</nav>
      </div>

      <footer class="review-finish"><span class="eyebrow">Zadnjih 15 minut</span><h2>Zapri zapiske in odgovarjaj</h2><p>Brez gledanja povej definicijo, napiši glavno formulo, izvedi en korak in razloži, zakaj postopek deluje.</p><div class="hero-actions"><a class="primary-button" href="#/izpit">Generiraj izpit</a><a class="secondary-button" href="#/kartice">Odpri kartice</a></div></footer>`);
  }

  function oralDeepLinks(topic) {
    return (topic.deepLinks || []).map(link => {
      const id = typeof link === "string" ? link : (link.topic || link.id);
      const target = topicById.get(id);
      if (!target) return "";
      const label = typeof link === "string" ? target.title : (link.label || target.title);
      return `<a href="#/teorija/${id}"><span>↗</span><strong>${label}</strong><small>polna teorija, dokazi in primeri</small></a>`;
    }).join("");
  }

  function oralSection(section, index, compact = false) {
    return `<section class="${compact ? "oral-review-block" : "lesson-block oral-lesson-block"}" data-type="${escapeHtml(section.type || "theory")}">
      <span class="block-label">${section.label || `Korak ${String(index + 1).padStart(2, "0")}`}</span>
      <h${compact ? "3" : "2"}>${section.title}</h${compact ? "3" : "2"}>
      ${section.html}
    </section>`;
  }

  function oralCard(topic) {
    const done = state.oralCompleted.has(topic.id);
    return `<a class="oral-card ${done ? "done" : ""}" href="#/ustni/${topic.id}" style="--oral-accent:${topic.accent}">
      <header><span class="oral-number">${String(topic.number).padStart(2, "0")}</span><span class="oral-status">${done ? "odgovor osvojen" : "uradno vprašanje"}</span></header>
      <h3>${topic.title}</h3>
      <p>${topic.officialPrompt}</p>
      <footer><span>≈ ${topic.minutes || 10} min</span><span>${topic.sections.length} korakov</span><b>Odpri →</b></footer>
    </a>`;
  }

  function renderOralIndex() {
    if (!ORAL.length) {
      setView(`<div class="empty-state">Uradna ustna vprašanja se niso naložila.</div>`);
      return;
    }
    const groups = ORAL.reduce((result, topic) => {
      const found = result.find(group => group.chapter === topic.chapter);
      if (found) found.topics.push(topic); else result.push({ chapter: topic.chapter, topics: [topic] });
      return result;
    }, []);
    const next = ORAL.find(topic => !state.oralCompleted.has(topic.id)) || oralById.get(state.lastOral) || ORAL[0];

    setView(`
      <header class="oral-index-hero">
        <div><span class="eyebrow">Uradni seznam 2025/26</span><h1>13 vprašanj.<br><em>13 pripravljenih odgovorov.</em></h1><p>Vsaka stran sledi profesorjevemu naslovu iz PDF-ja. Dobiš začetek odgovora, legendo oznak, skico oziroma tablo, ključne formule, celotno izpeljavo, primer, podvprašanja in zadnji 30-sekundni povzetek.</p>
          <div class="hero-actions"><a class="primary-button" href="#/ustni/${next.id}">${state.oralCompleted.size ? "Nadaljuj" : "Začni"}: ${next.title}</a><button class="secondary-button" type="button" data-action="oral-random">Naključno vprašanje</button><a class="secondary-button" href="../ustni_izpit_2526.pdf" target="_blank" rel="noopener">Odpri profesorjev PDF ↗</a></div>
        </div>
        <aside class="oral-index-score"><strong>${state.oralCompleted.size}<span>/13</span></strong><p>odgovorov označenih kot osvojenih</p><div><i style="width:${Math.round(state.oralCompleted.size / ORAL.length * 100)}%"></i></div></aside>
      </header>
      <section class="easy-entry"><div><strong>Začni s kratkim odgovorom na glas</strong><p>Tvoje točke, vseh 5 zapisov kolegov, osnovne formule in razlaga po domače.</p></div><a class="primary-button" href="#/na-izi">Na izi za ustni →</a></section>
      <section class="oral-origin"><span>Zakaj ta razdelitev?</span><p><strong>To niso izmišljene kategorije.</strong> Vrstni red in naslovi so neposredno povzeti iz datoteke <code>ustni_izpit_2526.pdf</code>; polna teorija je nato pripeta pod vsako vprašanje kot globlji vir.</p></section>
      ${groups.map((group, index) => `<section class="oral-group"><header><span>${String(index + 1).padStart(2, "0")}</span><div><small>Poglavje</small><h2>${group.chapter}</h2></div><b>${group.topics.length} ${group.topics.length === 1 ? "vprašanje" : "vprašanja"}</b></header><div class="oral-grid">${group.topics.map(oralCard).join("")}</div></section>`).join("")}
      <footer class="oral-index-footer"><div><span class="eyebrow">En neprekinjen krog</span><h2>Želiš skozi vseh 13 v treh urah?</h2><p>Vodeni pregled uporablja iste odgovore, vendar jih zloži v izpitni vrstni red in doda urnik aktivnega priklica.</p></div><a class="primary-button" href="#/pregled-3h">Odpri 3-urni pregled →</a></footer>`);
  }

  function renderOralTopic(topic) {
    state.lastOral = topic.id;
    persist();
    const index = ORAL.findIndex(item => item.id === topic.id);
    const previous = ORAL[index - 1];
    const next = ORAL[index + 1];
    const done = state.oralCompleted.has(topic.id);
    const toc = topic.sections.map((section, sectionIndex) => `<button type="button" data-action="scroll-section" data-target="oral-section-${sectionIndex + 1}">${sectionIndex + 1}. ${section.title}</button>`).join("");
    const blocks = topic.sections.map((section, sectionIndex) => `<div id="oral-section-${sectionIndex + 1}">${oralSection(section, sectionIndex)}</div>`).join("");

    setView(`
      <header class="oral-topic-hero" style="--oral-accent:${topic.accent}">
        <div class="oral-topic-number"><small>Uradno vprašanje</small><strong>${String(topic.number).padStart(2, "0")}</strong><span>od 13</span></div>
        <div><span class="eyebrow">${topic.chapter}</span><h1>${topic.title}</h1><blockquote><span>Profesorjev zapis</span><p>${topic.officialPrompt}</p></blockquote><div class="topic-meta"><span class="pill">≈ ${topic.minutes || 10} min</span><span class="pill">${topic.sections.length} korakov odgovora</span><span class="pill">tabla + govor + primer</span></div></div>
        <aside class="oral-topic-actions"><small>Status odgovora</small><strong>${done ? "Osvojeno" : "Za vajo"}</strong><button class="${done ? "secondary-button" : "primary-button"}" type="button" data-action="toggle-oral" data-oral="${topic.id}">${done ? "Označi za ponovitev" : "Označi kot osvojeno"}</button><a href="../ustni_izpit_2526.pdf" target="_blank" rel="noopener">↗ uradni PDF</a></aside>
      </header>
      <section class="oral-answer-order" aria-label="Vrstni red odgovora"><span>Kako odgovarjaš</span><ol><li><b>1</b> problem in definicija</li><li><b>2</b> oznake in skica</li><li><b>3</b> formula ali izrek</li><li><b>4</b> izpeljava ali algoritem</li><li><b>5</b> primer in zaključek</li></ol></section>
      <div class="topic-layout oral-topic-layout" style="--accent:${topic.accent}">
        <article class="topic-content">${blocks}
          <section class="oral-deep-theory"><span class="eyebrow">Če profesor koplje globlje</span><h2>Povezava s celotno teorijo</h2><div>${oralDeepLinks(topic) || `<a href="#/teorija"><strong>Odpri učni zemljevid</strong><small>vsa teorija, dokazi in primeri</small></a>`}</div></section>
          <footer class="topic-footer">${previous ? `<a class="secondary-button" href="#/ustni/${previous.id}">← ${previous.number}. ${previous.title}</a>` : `<a class="secondary-button" href="#/ustni">← Vseh 13 vprašanj</a>`}${next ? `<a class="primary-button" href="#/ustni/${next.id}">${next.number}. ${next.title} →</a>` : `<a class="primary-button" href="#/pregled-3h">Ponovi vseh 13 →</a>`}</footer>
        </article>
        <nav class="local-toc" aria-label="Kazalo odgovora"><strong>Na tej strani</strong>${toc}</nav>
      </div>`);
  }

  function oralQuickIntro(topic) {
    const intro = ORAL_QUICK_INTROS[topic.id];
    if (!intro) return "";
    return `<aside class="oral-quick-intro" aria-label="Hitra orientacija za ${escapeHtml(topic.title)}">
      <header><span>Čisto na hitro</span><small>Preden greš v formule</small></header>
      <div>
        <article><strong>Kaj je to?</strong><p>${escapeHtml(intro.what)}</p></article>
        <i aria-hidden="true">→</i>
        <article><strong>Kaj tukaj rešujemo?</strong><p>${escapeHtml(intro.solve)}</p></article>
      </div>
    </aside>`;
  }

  function oralReviewQuestion(topic) {
    const done = state.oralCompleted.has(topic.id);
    return `<section class="oral-review-question ${done ? "done" : ""}" id="oral-review-${topic.id}" data-oral-question="${topic.id}" style="--oral-accent:${topic.accent}">
      <header class="oral-review-head">
        <span class="oral-review-number">${String(topic.number).padStart(2, "0")}</span>
        <div><span class="eyebrow">${topic.chapter}</span><h2>${topic.title}</h2><p>${topic.officialPrompt}</p><div><span>≈ ${topic.minutes || 10} min</span><span>${topic.sections.length} korakov</span></div></div>
        <button class="secondary-button" type="button" data-action="oral-toggle-answer" aria-expanded="true">Skrij odgovor</button>
      </header>
      ${oralQuickIntro(topic)}
      <div class="oral-review-answer">
        <div class="oral-review-coach"><strong>Najprej brez gledanja</strong><p>V 30 sekundah povej, kaj je problem, katere objekte uvedeš in kaj je glavni rezultat. Nato odpri spodnji odgovor in ga dopolni ob tabli.</p></div>
        <div class="oral-review-sections">${topic.sections.map((section, index) => oralSection(section, index, true)).join("")}</div>
        <footer><button class="${done ? "secondary-button" : "primary-button"}" type="button" data-action="toggle-oral" data-oral="${topic.id}">${done ? "Označi za ponovitev" : "Ta odgovor znam"}</button><a class="secondary-button" href="#/ustni/${topic.id}">Odpri samostojno stran</a><div class="oral-review-links">${oralDeepLinks(topic)}</div></footer>
      </div>
    </section>`;
  }

  function renderReview() {
    if (!ORAL.length) {
      renderLegacyReview();
      return;
    }
    const jumpButtons = ORAL.map(topic => `<button type="button" data-action="scroll-section" data-target="oral-review-${topic.id}" style="--oral-accent:${topic.accent}"><b>${String(topic.number).padStart(2, "0")}</b><span>${topic.title}</span><small>${topic.minutes || 10} min</small></button>`).join("");
    const schedule = [
      ["00–12", "Postavi odgovor", "Nauči se petdelni vrstni red in način risanja table."],
      ["12–45", "Vprašanja 1–3", "Aproksimacijski problem, najboljša aproksimacija in odsekoma polinomske funkcije."],
      ["45–92", "Vprašanja 4–7", "Bézierjeve krivulje, de Casteljau ter konstrukcija in stiki zlepkov."],
      ["92–100", "Kratek odmor", "Zapri zaslon, voda, nato eno formulo povej brez gledanja."],
      ["100–132", "Vprašanja 8–10", "Numerično odvajanje, Newton–Cotesova in izboljšana integracijska pravila."],
      ["132–172", "Vprašanja 11–13", "Enočlenske, veččlenske metode in posplošeni začetni problem."],
      ["172–180", "Slepa simulacija", "Izžrebaj vprašanje in ga v celoti predstavi brez zapiskov."]
    ];

    setView(`
      <header class="review-hero official-review-hero">
        <div class="review-hero-copy"><span class="eyebrow">Profesorjev seznam 2025/26 · vodena vaja</span><h1>3 ure.<br>Vseh 13 odgovorov.</h1><p>Ta pregled zdaj sledi uradnemu PDF-ju ena proti ena. Pri vsakem vprašanju narediš točno to, kar potrebuješ pri ustnem: poveš uvod, narišeš objekte, napišeš formulo, razložiš izpeljavo ali algoritem in zaključiš s primerom.</p><div class="hero-actions"><button class="primary-button" type="button" data-action="scroll-section" data-target="oral-review-${ORAL[0].id}">Začni z vprašanjem 1</button><button class="secondary-button" type="button" data-action="oral-hide-all">Pokrij vse odgovore</button><a class="secondary-button" href="../ustni_izpit_2526.pdf" target="_blank" rel="noopener">Uradni seznam ↗</a></div></div>
        <div class="review-hero-score"><strong>13</strong><span>uradnih vprašanj</span><small>180 min · govor + tabla + primer</small></div>
      </header>
      <section class="review-schedule official-review-schedule" aria-label="Triurni načrt">${schedule.map(item => `<article><time>${item[0]}</time><strong>${item[1]}</strong><p>${item[2]}</p></article>`).join("")}</section>
      <section class="oral-protocol" id="oral-protocol"><header><span class="eyebrow">Isti sistem pri vsakem vprašanju</span><h2>Od profesorjevega naslova do urejene table</h2><p>Ne začni z naključno formulo. Odgovor zgradi v petih vidnih korakih.</p></header><ol><li><b>01</b><span><strong>Povej problem</strong><small>Kaj je dano in kaj iščemo?</small></span></li><li><b>02</b><span><strong>Uvedi oznake</strong><small>Vsak simbol takoj razloži.</small></span></li><li><b>03</b><span><strong>Nariši objekt</strong><small>Graf, stencil, kontrolni poligon ali korake.</small></span></li><li><b>04</b><span><strong>Napiši jedro</strong><small>Formula, izrek ter ključna izpeljava.</small></span></li><li><b>05</b><span><strong>Zaključi</strong><small>Primer, pogoji, red napake in past.</small></span></li></ol></section>
      <section class="review-map official-review-map"><header class="review-section-head"><span class="eyebrow">Uradno kazalo</span><h2>13 profesorjevih vprašanj</h2><p>Klikni naslov za skok. Če vajo delaš aktivno, najprej pokrij vse odgovore in pri vsakem govori dve do tri minute brez pomoči.</p></header><div class="review-jump-grid oral-jump-grid">${jumpButtons}</div></section>
      <div class="official-review-layout"><article class="oral-review-list">${ORAL.map(oralReviewQuestion).join("")}</article><nav class="review-rail oral-review-rail" aria-label="Kazalo uradnih vprašanj"><strong>13 vprašanj</strong>${jumpButtons}</nav></div>
      <footer class="review-finish official-review-finish"><span class="eyebrow">Zadnjih 8 minut</span><h2>Profesor vpraša. Ti postaviš tablo.</h2><p>Izžrebaj eno od uradnih vprašanj. Brez gledanja naredi petdelni odgovor, nato primerjaj s pripravljeno stranjo in označi samo tisto, kar bi res znal povedati.</p><div class="hero-actions"><button class="primary-button" type="button" data-action="oral-random">Izžrebaj ustno vprašanje</button><a class="secondary-button" href="#/ustni">Pregled vseh 13</a></div></footer>`);
  }

  function renderHome() {
    const nextTopic = topicById.get(state.lastTopic) || DATA.topics.find(topic => !state.completed.has(topic.id)) || DATA.topics[0];
    const nextOral = ORAL.find(topic => !state.oralCompleted.has(topic.id)) || oralById.get(state.lastOral) || ORAL[0];
    const progress = Math.round((state.completed.size + state.oralCompleted.size) / (DATA.topics.length + ORAL.length) * 100);
    const proofCount = DATA.topics.reduce((sum, topic) => sum + topic.sections.filter(section => section.type === "proof").length, 0);
    setView(`
      <section class="hero">
        <span class="eyebrow">Numerične metode 2 / uradni ustni seznam 2025/26</span>
        <h1 class="display-title">Profesor vpraša.<br><em>Ti postaviš tablo.</em></h1>
        <p class="lede">Vseh 13 naslovov iz <code>ustni_izpit_2526.pdf</code> je spremenjenih v odgovore, ki jih lahko dejansko poveš: uvod, oznake, skica, formula, izpeljava, primer in možna podvprašanja.</p>
        <div class="hero-actions">
          <a class="primary-button" href="#/pregled-3h">3 ure · vseh 13 odgovorov</a>
          <a class="secondary-button" href="#/ustni/${nextOral?.id || ""}">${state.oralCompleted.size ? "Nadaljuj ustno" : "Začni ustno"}</a>
          <a class="secondary-button" href="#/teorija/${nextTopic.id}">Celotna teorija</a>
        </div>
      </section>

      <section class="stats-grid" aria-label="Statistika gradiva">
        <article class="stat-card featured"><strong>${ORAL.length}</strong><span>uradnih ustnih vprašanj</span></article>
        <article class="stat-card"><strong>${DATA.topics.length}</strong><span>poglobljenih tem</span></article>
        <article class="stat-card"><strong>${proofCount}</strong><span>izpeljanih dokazov</span></article>
        <article class="stat-card"><strong>${DATA.flashcards.length}</strong><span>flashcards</span></article>
        <article class="stat-card"><strong>${DATA.quizQuestions.length}</strong><span>kviz vprašanj</span></article>
        <article class="stat-card"><strong>${progress}%</strong><span>predelano</span></article>
      </section>

      <section class="easy-entry"><div><strong>Na izi za ustni · pripravljeno zate</strong><p>Kratki odgovori, osnovne formule in skice. Poudarek glede na oba izpita, vseh 5 zapisov kolegov in dodatno teorijo.</p></div><a class="primary-button" href="#/na-izi">Odpri kratke odgovore →</a></section>
      <section class="oral-home-map">
        <header><div><span class="eyebrow">Profesorjev vrstni red</span><h2>Točno teh 13 moraš znati predstaviti</h2><p>Naslovi so iz novega uradnega PDF-ja. Klik te pelje neposredno v pripravljen govorjeni odgovor.</p></div><a class="secondary-button" href="#/ustni">Odpri celoten ustni sklop →</a></header>
        <div>${ORAL.map(topic => `<a href="#/ustni/${topic.id}" class="${state.oralCompleted.has(topic.id) ? "done" : ""}" style="--oral-accent:${topic.accent}"><b>${String(topic.number).padStart(2, "0")}</b><span>${topic.title}</span><small>${state.oralCompleted.has(topic.id) ? "osvojeno" : `${topic.minutes || 10} min`}</small></a>`).join("")}</div>
      </section>

      <div class="section-heading"><div><span class="eyebrow">Učni zemljevid</span><h2>Cel predmet v ${DATA.topics.length} temah</h2></div><p>Jedro sledi štirim stalnim izpitnim sklopom; starejše interpolacijske teme ostanejo v polni teoriji.</p></div>
      <section class="topic-grid">${DATA.topics.map(topicCard).join("")}</section>

      <div class="section-heading"><div><span class="eyebrow">Predlagan tok</span><h2>Od razumevanja do simulacije</h2></div></div>
      <section class="study-path">
        <article class="path-card">
          <span class="eyebrow">Pameten vrstni red</span>
          <h3>180 minut, brez tavanja</h3>
          <div class="path-steps">
            <div class="path-step"><b>1</b><span>Ustna vprašanja 1–3<small>aproksimacija in odsekoma polinomske funkcije</small></span><em>33 min</em></div>
            <div class="path-step"><b>2</b><span>Ustna vprašanja 4–7<small>Bézier, de Casteljau in zlepki</small></span><em>47 min</em></div>
            <div class="path-step"><b>3</b><span>Ustna vprašanja 8–10<small>odvajanje in integriranje</small></span><em>32 min</em></div>
            <div class="path-step"><b>4</b><span>Ustna vprašanja 11–13<small>enočlenske, veččlenske in posplošeni začetni problem</small></span><em>40 min</em></div>
          </div>
        </article>
        <article class="sprint-card">
          <span class="eyebrow" style="color:#111">15-minutni zaključek</span>
          <h3>Zapri teorijo</h3>
          <ul class="sprint-list"><li>4 naključne kartice</li><li>eno vprašanje iz vsakega sklopa</li><li>formulo vedno razloži z besedami</li></ul>
          <button class="secondary-button" type="button" data-action="start-sprint">Začni sprint →</button>
        </article>
      </section>`);
  }

  function renderTheoryIndex() {
    setView(`
      <header><span class="eyebrow">Teorija / celoten predmet</span><h1 class="page-title">Učni zemljevid</h1><p class="page-intro">Vsaka tema je pripravljena za ustni odgovor: definicije, izreki, domača razlaga, algoritem, primer in hiter zaključek. Viri vodijo nazaj do originalnih PDF-jev.</p></header>
      <div class="filter-row">
        <span class="pill">${DATA.topics.length} tem</span><span class="pill">4 stalni izpitni sklopi</span><span class="pill">${state.completed.size} opravljenih</span>
      </div>
      <section class="topic-grid">${DATA.topics.map(topicCard).join("")}</section>`);
  }

  function renderTopic(topic) {
    state.lastTopic = topic.id;
    persist();
    const isDone = state.completed.has(topic.id);
    const sources = topic.pdfs.map(pdf => `<a href="${encodeURI(pdf.file)}" target="_blank" rel="noopener">↗ ${pdf.name}</a>`).join("");
    const blocks = topic.sections.map((section, index) => {
      const id = `sklop-${index + 1}`;
      return `<section class="lesson-block" id="${id}" data-type="${section.type}">
        <span class="block-label">${section.label}</span><h2>${section.title}</h2>${section.html}
      </section>`;
    }).join("");
    const toc = topic.sections.map((section, index) => `<button type="button" data-action="scroll-section" data-target="sklop-${index + 1}">${index + 1}. ${section.title}</button>`).join("");
    const topicIndex = DATA.topics.findIndex(item => item.id === topic.id);
    const previous = DATA.topics[topicIndex - 1];
    const next = DATA.topics[topicIndex + 1];

    setView(`
      <header class="topic-hero" style="--accent:${topic.accent}">
        <div><span class="topic-index">Tema ${topic.number} · ustna vprašanja ${topic.oral.join(", ")}</span><h1>${topic.title}</h1><p>${topic.short} Vsebina je urejena od intuicije do formalnega odgovora, da jo lahko najprej razumeš in nato pravilno poveš.</p>
          <div class="topic-meta"><span class="pill">≈ ${topic.minutes} min</span><span class="pill">${topic.sections.length} sklopov</span><span class="pill">${DATA.flashcards.filter(card => card.topic === topic.id).length} kartic</span></div>
        </div>
        <aside class="topic-scorecard"><small>Status teme</small><strong>${isDone ? "Opravljeno" : "V učenju"}</strong><button class="${isDone ? "secondary-button" : "primary-button"}" type="button" data-action="toggle-complete" data-topic="${topic.id}">${isDone ? "Označi kot nedokončano" : "Označi kot opravljeno"}</button><div class="source-links" style="margin-top:18px">${sources}</div></aside>
      </header>
      <div class="topic-layout" style="--accent:${topic.accent}">
        <article class="topic-content">${blocks}
          <footer class="topic-footer">
            ${previous ? `<a class="secondary-button" href="#/teorija/${previous.id}">← ${previous.title}</a>` : `<a class="secondary-button" href="#/teorija">← Vse teme</a>`}
            ${next ? `<a class="primary-button" href="#/teorija/${next.id}">${next.title} →</a>` : `<a class="primary-button" href="#/izpit">Na izpit →</a>`}
          </footer>
        </article>
        <nav class="local-toc" aria-label="Kazalo teme"><strong>Na tej strani</strong>${toc}</nav>
      </div>`);
  }

  function resetFlashDeck(topic = state.flashTopic, forceShuffle = false) {
    state.flashTopic = topic;
    let deck = DATA.flashcards.filter(card => topic === "all" || (topic === "core" ? card.core : card.topic === topic));
    if (forceShuffle) deck = shuffle(deck);
    state.flashDeck = deck.map(card => card.id);
    state.flashIndex = 0;
    state.flashFlipped = false;
  }

  function renderFlashcards() {
    if (!state.flashDeck.length) resetFlashDeck(state.flashTopic);
    const deck = state.flashDeck.map(id => DATA.flashcards.find(card => card.id === id)).filter(Boolean);
    const card = deck[state.flashIndex] || deck[0];
    if (!card) {
      setView(`<div class="empty-state">Za ta filter ni kartic.</div>`);
      return;
    }
    const topic = topicById.get(card.topic);
    const known = state.knownCards.has(card.id);
    const percentage = deck.length ? (state.flashIndex + 1) / deck.length * 100 : 0;
    setView(`
      <section class="flash-shell">
        <header><span class="eyebrow">Aktivni priklic</span><h1 class="page-title">Flashcards</h1><p class="page-intro">Najprej odgovori na glas. Kartico obrni šele, ko imaš svoj odgovor. Preslednica obrne, puščici menjata kartico.</p></header>
        <div class="filter-row"><div class="field"><label for="flash-topic">Tema</label><select id="flash-topic"><option value="core" ${state.flashTopic === "core" ? "selected" : ""}>3-urni izbor</option><option value="all" ${state.flashTopic === "all" ? "selected" : ""}>Vse teme</option>${DATA.topics.map(item => `<option value="${item.id}" ${item.id === state.flashTopic ? "selected" : ""}>${item.number} — ${item.title}</option>`).join("")}</select></div><button class="secondary-button" type="button" data-action="flash-shuffle">Premešaj</button><span class="pill">${state.knownCards.size} označenih “znam”</span></div>
        <div class="flash-progress"><i style="width:${percentage}%"></i></div>
        <article class="flash-card ${state.flashFlipped ? "flipped" : ""}" data-action="flash-flip" tabindex="0" role="button" aria-label="Obrni kartico">
          <div class="flash-card-inner">
            <section class="flash-face flash-front"><small>${topic.number} / ${topic.title}${known ? " · znam" : ""}</small><div class="flash-question">${card.question}</div><div class="flash-hint">Klikni ali pritisni preslednico za odgovor ↗</div></section>
            <section class="flash-face flash-back"><small>Odgovor / ${topic.title}</small><div class="flash-answer">${card.answer}</div><div class="flash-hint">Odgovor povej še enkrat s svojimi besedami.</div></section>
          </div>
        </article>
        <div class="flash-actions"><button class="danger-button" type="button" data-action="flash-repeat">↺ Ponovi</button><button class="secondary-button" type="button" data-action="flash-prev" aria-label="Prejšnja kartica">←</button><span class="flash-counter">${state.flashIndex + 1} / ${deck.length}</span><button class="secondary-button" type="button" data-action="flash-next" aria-label="Naslednja kartica">→</button><button class="primary-button" type="button" data-action="flash-known">Znam ✓</button></div>
      </section>`);
  }

  function renderQuiz() {
    if (!state.quizSession) {
      setView(`
        <section class="quiz-shell"><header><span class="eyebrow">Hitro preverjanje</span><h1 class="page-title">Kviz</h1><p class="page-intro">Vsako vprašanje ima štiri možnosti. Takoj dobiš razlago, ne samo zelenega ali rdečega polja.</p></header>
          <article class="setup-card"><h2>Sestavi krog</h2><p class="page-intro">Izberi temo ali premešaj celoten predmet.</p><div class="filter-row"><div class="field"><label for="quiz-topic">Tema</label><select id="quiz-topic"><option value="all">Vse teme</option>${DATA.topics.map(topic => `<option value="${topic.id}">${topic.number} — ${topic.title}</option>`).join("")}</select></div><div class="field"><label for="quiz-count">Število vprašanj</label><select id="quiz-count"><option value="5">5</option><option value="10" selected>10</option><option value="20">20</option></select></div></div><button class="primary-button" type="button" data-action="quiz-start">Začni kviz →</button>${state.quizBest ? `<span class="pill" style="margin-left:10px">najbolje ${state.quizBest}%</span>` : ""}</article>
        </section>`);
      return;
    }

    const session = state.quizSession;
    if (session.finished) {
      const percent = Math.round(session.score / session.questions.length * 100);
      const copy = percent >= 85 ? "Odlično — ustna forma." : percent >= 65 ? "Dobra osnova. Ponovi napačne razlage." : "Še en krog teorije, nato poskusi znova.";
      setView(`<section class="quiz-shell"><header><span class="eyebrow">Rezultat</span><h1 class="page-title">Krog zaključen</h1></header><article class="result-card"><div class="score-ring">${percent}%</div><h2 style="text-align:center">${session.score} / ${session.questions.length} pravilno</h2><p class="page-intro" style="text-align:center;margin-inline:auto">${copy}</p><div class="hero-actions" style="justify-content:center"><button class="primary-button" type="button" data-action="quiz-restart">Nov krog</button><a class="secondary-button" href="#/teorija">Nazaj na teorijo</a></div></article></section>`);
      return;
    }

    const item = session.questions[session.index];
    const response = session.responses[session.index];
    const topic = topicById.get(item.topic);
    const progress = (session.index + 1) / session.questions.length * 100;
    setView(`<section class="quiz-shell"><div class="quiz-top"><span>VPRAŠANJE ${session.index + 1} / ${session.questions.length}</span><span>${session.score} pravilno</span></div><div class="flash-progress"><i style="width:${progress}%"></i></div><article class="quiz-card"><span class="eyebrow" style="color:${topic.accent}">${topic.title}</span><h2>${item.prompt}</h2><div class="option-list">${item.shuffledOptions.map((option, index) => {
      const isCorrect = option === item.correctText;
      const selected = response && response.selected === option;
      let className = "";
      if (response && isCorrect) className = "correct";
      else if (response && selected && !isCorrect) className = "wrong";
      return `<button class="option-button ${className}" type="button" data-action="quiz-answer" data-index="${index}" ${response ? "disabled" : ""}><b>${String.fromCharCode(65 + index)}</b><span>${option}</span></button>`;
    }).join("")}</div>${response ? `<div class="quiz-explanation"><strong>${response.correct ? "Pravilno." : "Ne čisto."}</strong> ${item.explanation}</div><div class="quiz-bottom"><button class="primary-button" type="button" data-action="quiz-next">${session.index + 1 === session.questions.length ? "Poglej rezultat" : "Naslednje →"}</button></div>` : ""}</article></section>`);
  }

  function startQuiz() {
    const topic = document.querySelector("#quiz-topic")?.value || "all";
    const requested = Number(document.querySelector("#quiz-count")?.value || 10);
    const pool = DATA.quizQuestions.filter(item => topic === "all" || item.topic === topic);
    const chosen = shuffle(pool).slice(0, Math.min(requested, pool.length)).map(item => {
      const correctText = item.options[item.correct];
      return { ...item, correctText, shuffledOptions: shuffle(item.options) };
    });
    state.quizSession = { questions: chosen, index: 0, responses: [], score: 0, finished: false };
    renderQuiz();
  }

  function generateExam() {
    const previousIds = state.currentExamId && state.examSessions[state.currentExamId]
      ? new Set(state.examSessions[state.currentExamId].questionIds)
      : new Set();
    const questionIds = [1, 2, 3, 4].map(chapter => {
      const pool = DATA.examQuestions.filter(question => question.chapter === chapter);
      if (!pool.length) throw new Error(`Manjkajo izpitna vprašanja za sklop ${chapter}.`);
      const freshPool = pool.filter(question => !previousIds.has(question.id));
      const candidates = freshPool.length ? freshPool : pool;
      return candidates[Math.floor(Math.random() * candidates.length)].id;
    });
    const stamp = new Date();
    const id = `NUM2-${String(stamp.getFullYear()).slice(-2)}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    state.currentExamId = id;
    state.examSessions[id] = { id, created: stamp.toISOString(), questionIds, answers: {} };
    persist();
  }

  function currentExam() {
    if (!state.currentExamId || !state.examSessions[state.currentExamId]) generateExam();
    return state.examSessions[state.currentExamId];
  }

  function renderExam() {
    const exam = currentExam();
    const questions = exam.questionIds.map(id => DATA.examQuestions.find(question => question.id === id)).filter(Boolean);
    const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
    const date = new Date(exam.created).toLocaleString("sl-SI", { dateStyle: "medium", timeStyle: "short" });
    setView(`
      <section class="exam-shell">
        <header class="exam-head"><div><span class="eyebrow">Simulacija / ${exam.id}</span><h1>Izpitni list</h1><div class="exam-meta"><span>${date}</span><span>•</span><span>100 minut</span><span>•</span><span>4 vprašanja</span><span>•</span><span>${totalPoints} točk</span></div></div><div class="exam-actions"><button class="secondary-button" type="button" data-action="exam-new">↻ Nov izpit</button><button class="secondary-button" type="button" data-action="exam-copy">Kopiraj MD</button><button class="primary-button" type="button" data-action="exam-export">Izvozi .md</button></div></header>
        <p class="page-intro" style="margin-top:22px">Vedno dobiš en problem iz aproksimacije, enega iz Bézierja, enega iz odvajanja ali integriranja in enega iz diferencialnih enačb. Odgovori se lokalno shranjujejo, izvoz pa vsebuje vprašanja in tvoje odgovore za pregled z AI.</p>
        <div class="exam-list">${questions.map((question, index) => {
          const topic = topicById.get(question.topic);
          const answer = exam.answers[question.id] || "";
          return `<article class="exam-question" data-question="${question.id}"><header class="exam-question-head"><div class="exam-question-label"><span>Vprašanje ${index + 1} · ${topic.title}</span><span>${question.points} točk · zahtevnost ${question.difficulty}/4</span></div><h2>${question.prompt}</h2></header><div class="editor-toolbar" role="toolbar" aria-label="Oblikovanje odgovora"><button type="button" data-action="editor-command" data-command="bold" title="Krepko"><b>B</b></button><button type="button" data-action="editor-command" data-command="italic" title="Ležeče"><i>I</i></button><button type="button" data-action="editor-command" data-command="insertUnorderedList" title="Seznam">•≡</button><button type="button" data-action="editor-command" data-command="insertOrderedList" title="Oštevilčen seznam">1.</button><button type="button" data-action="editor-formula" title="Vstavi prostor za formulo">∑</button><button type="button" data-action="editor-command" data-command="removeFormat" title="Počisti oblikovanje">Tx</button><span class="editor-words">${wordCount(answer)} besed</span></div><div class="answer-editor" contenteditable="true" role="textbox" aria-multiline="true" spellcheck="true" data-question="${question.id}" data-placeholder="Napiši svoj odgovor …">${answer}</div><details class="hint-box"><summary>Namig za strukturo odgovora</summary><p>${question.hint}</p></details></article>`;
        }).join("")}</div><p class="autosave-note">● odgovori so shranjeni lokalno ob vsakem vnosu</p>
      </section>`);
  }

  function wordCount(html = "") {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = (temp.textContent || "").trim();
    return text ? text.split(/\s+/).length : 0;
  }

  function answerToMarkdown(html = "") {
    if (!html.trim()) return "_Brez odgovora._";
    let value = html
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(div|p|h[1-6])>/gi, "\n\n")
      .replace(/<(div|p)[^>]*>/gi, "")
      .replace(/<h[1-6][^>]*>/gi, "### ")
      .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gis, "**$2**")
      .replace(/<(em|i)[^>]*>(.*?)<\/\1>/gis, "*$2*")
      .replace(/<li[^>]*>(.*?)<\/li>/gis, "- $1\n")
      .replace(/<\/?(ul|ol)[^>]*>/gi, "\n");
    const temp = document.createElement("div");
    temp.innerHTML = value;
    return (temp.textContent || temp.innerText || "").replace(/\n{3,}/g, "\n\n").trim() || "_Brez odgovora._";
  }

  function examMarkdown() {
    const exam = currentExam();
    const questions = exam.questionIds.map(id => DATA.examQuestions.find(question => question.id === id)).filter(Boolean);
    const created = new Date(exam.created).toLocaleString("sl-SI");
    const sections = questions.map((question, index) => {
      const topic = topicById.get(question.topic);
      return `## ${index + 1}. ${question.prompt}\n\n**Tema:** ${topic.title}  \n**Točke:** ${question.points}\n\n### Moj odgovor\n\n${answerToMarkdown(exam.answers[question.id] || "")}`;
    });
    return `# Izpit iz numeričnih metod 2 — ${exam.id}\n\n**Generirano:** ${created}  \n**Navodilo za AI pregled:** Vsak odgovor oceni po štirih merilih: model/formula 25 %, postopek 35 %, rezultat 20 % ter razlaga/utemeljitev 20 %. Pri napaki napiši popravek in eno ciljno ustno podvprašanje.\n\n---\n\n${sections.join("\n\n---\n\n")}\n`;
  }

  async function copyExamMarkdown() {
    const markdown = examMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      toast("Markdown je kopiran v odložišče.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      toast("Markdown je kopiran v odložišče.");
    }
  }

  function exportExamMarkdown() {
    const exam = currentExam();
    const blob = new Blob([examMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${exam.id.toLowerCase()}-odgovori.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Markdown datoteka je pripravljena.");
  }

  function renderNotFound() {
    setView(`<div class="empty-state"><span class="eyebrow">404</span><h1 class="page-title">Tega sklopa ni.</h1><a class="primary-button" href="#/domov">Nazaj na pregled</a></div>`);
  }

  function renderRoute() {
    const parts = routeParts();
    updateChrome(parts);
    closeMobileMenu();
    if (parts[0] === "domov") renderHome();
    else if (parts[0] === "na-izi" && (!parts[1] || window.NUM2_EASY.topics.some(topic => topic.id === parts[1]))) {
      setView(window.NUM2_EASY.render());
      window.NUM2_EASY.bind(view, parts[1]);
    }
    else if (parts[0] === "pregled-3h") renderReview();
    else if (parts[0] === "ustni" && !parts[1]) renderOralIndex();
    else if (parts[0] === "ustni" && oralById.has(parts[1])) renderOralTopic(oralById.get(parts[1]));
    else if (parts[0] === "teorija" && !parts[1]) renderTheoryIndex();
    else if (parts[0] === "teorija" && topicById.has(parts[1])) renderTopic(topicById.get(parts[1]));
    else if (parts[0] === "kartice") renderFlashcards();
    else if (parts[0] === "kviz") renderQuiz();
    else if (parts[0] === "izpit") renderExam();
    else renderNotFound();
    updateProgress();
    requestAnimationFrame(() => view.focus({ preventScroll: true }));
  }

  function showSearch(query) {
    const panel = document.querySelector("#search-results");
    const normalized = normalize(query.trim());
    if (normalized.length < 2) { panel.hidden = true; panel.innerHTML = ""; return; }
    const easyMatches = window.NUM2_EASY.topics.filter(topic => normalize(`${topic.title} ${topic.question} ${topic.speech.join(" ")}`).includes(normalized)).slice(0, 2);
    const oralMatches = ORAL.filter(topic => normalize(`${topic.title} ${topic.officialPrompt} ${topic.chapter} ${topic.sections.map(section => `${section.title} ${section.html}`).join(" ")}`).includes(normalized)).slice(0, 4);
    const topicMatches = DATA.topics.filter(topic => normalize(`${topic.title} ${topic.short} ${topic.sections.map(section => section.title).join(" ")}`).includes(normalized)).slice(0, Math.max(0, 6 - oralMatches.length));
    const questionMatches = DATA.examQuestions.filter(question => normalize(question.prompt).includes(normalized)).slice(0, Math.max(0, 8 - topicMatches.length - oralMatches.length));
    const results = [
      ...easyMatches.map(topic => `<a href="#/na-izi/${topic.id}"><strong>${topic.title}</strong><small>Na izi · kratek odgovor, formula in predstava</small></a>`),
      ...oralMatches.map(topic => `<a href="#/ustni/${topic.id}"><strong>${String(topic.number).padStart(2, "0")} · ${topic.title}</strong><small>Uradno ustno vprašanje · govor, tabla, izpeljava in primer</small></a>`),
      ...topicMatches.map(topic => `<a href="#/teorija/${topic.id}"><strong>${topic.title}</strong><small>Tema ${topic.number} · ${topic.short}</small></a>`),
      ...questionMatches.map(question => `<a href="#/teorija/${question.topic}"><strong>${topicById.get(question.topic).title}</strong><small>${question.prompt}</small></a>`)
    ];
    panel.innerHTML = results.length ? results.join("") : `<div class="search-empty">Ni zadetkov. Poskusi ime izreka ali algoritma.</div>`;
    typesetMath(panel);
    panel.hidden = false;
  }

  function openMobileMenu() {
    sidebar.classList.add("open");
    sidebarScrim.hidden = false;
    document.querySelector("#mobile-menu").setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    sidebar.classList.remove("open");
    sidebarScrim.hidden = true;
    document.querySelector("#mobile-menu").setAttribute("aria-expanded", "false");
  }

  document.querySelector("#mobile-menu").addEventListener("click", () => sidebar.classList.contains("open") ? closeMobileMenu() : openMobileMenu());
  sidebarScrim.addEventListener("click", closeMobileMenu);
  window.addEventListener("hashchange", renderRoute);

  document.querySelector("#global-search").addEventListener("input", event => showSearch(event.target.value));
  document.querySelector("#global-search").addEventListener("keydown", event => {
    if (event.key === "Escape") { event.target.value = ""; showSearch(""); event.target.blur(); }
  });
  document.querySelector("#search-results").addEventListener("click", () => {
    document.querySelector("#search-results").hidden = true;
    document.querySelector("#global-search").value = "";
  });

  document.querySelector("#quick-random").addEventListener("click", () => {
    resetFlashDeck("all", true);
    location.hash = "#/kartice";
    if (routeParts()[0] === "kartice") renderFlashcards();
  });

  view.addEventListener("change", event => {
    if (event.target.id === "flash-topic") { resetFlashDeck(event.target.value); renderFlashcards(); }
  });

  view.addEventListener("input", event => {
    const editor = event.target.closest(".answer-editor");
    if (!editor) return;
    const exam = currentExam();
    exam.answers[editor.dataset.question] = editor.innerHTML;
    const questionCard = editor.closest(".exam-question");
    const count = questionCard.querySelector(".editor-words");
    if (count) count.textContent = `${wordCount(editor.innerHTML)} besed`;
    persist();
  });

  view.addEventListener("click", event => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    const action = trigger.dataset.action;

    if (action === "oral-random") {
      const candidates = ORAL.filter(topic => !state.oralCompleted.has(topic.id));
      const pool = candidates.length ? candidates : ORAL;
      const topic = pool[Math.floor(Math.random() * pool.length)];
      if (topic) location.hash = `#/ustni/${topic.id}`;
      return;
    }
    if (action === "toggle-oral") {
      const oralId = trigger.dataset.oral;
      if (!oralById.has(oralId)) return;
      if (state.oralCompleted.has(oralId)) state.oralCompleted.delete(oralId); else state.oralCompleted.add(oralId);
      persist();
      const question = trigger.closest(".oral-review-question");
      if (question) {
        const done = state.oralCompleted.has(oralId);
        question.classList.toggle("done", done);
        question.querySelectorAll('[data-action="toggle-oral"]').forEach(button => {
          button.textContent = done ? "Označi za ponovitev" : "Ta odgovor znam";
          button.className = done ? "secondary-button" : "primary-button";
        });
      } else renderOralTopic(oralById.get(oralId));
      toast(state.oralCompleted.has(oralId) ? "Ustni odgovor je označen kot osvojen." : "Vprašanje je spet označeno za ponovitev.");
      return;
    }
    if (action === "oral-toggle-answer") {
      const question = trigger.closest(".oral-review-question");
      const hidden = question?.classList.toggle("answer-hidden");
      trigger.textContent = hidden ? "Pokaži odgovor" : "Skrij odgovor";
      trigger.setAttribute("aria-expanded", String(!hidden));
      return;
    }
    if (action === "oral-hide-all") {
      const questions = [...view.querySelectorAll(".oral-review-question")];
      const shouldHide = questions.some(question => !question.classList.contains("answer-hidden"));
      questions.forEach(question => {
        question.classList.toggle("answer-hidden", shouldHide);
        const button = question.querySelector('[data-action="oral-toggle-answer"]');
        if (button) {
          button.textContent = shouldHide ? "Pokaži odgovor" : "Skrij odgovor";
          button.setAttribute("aria-expanded", String(!shouldHide));
        }
      });
      trigger.textContent = shouldHide ? "Pokaži vse odgovore" : "Pokrij vse odgovore";
      toast(shouldHide ? "Odgovori so skriti — zdaj govori brez gledanja." : "Vsi odgovori so spet prikazani.");
      return;
    }
    if (action === "start-sprint") {
      resetFlashDeck("core", true);
      state.flashDeck = state.flashDeck.slice(0, 4);
      location.hash = "#/kartice";
      return;
    }
    if (action === "toggle-complete") {
      const topicId = trigger.dataset.topic;
      if (state.completed.has(topicId)) state.completed.delete(topicId); else state.completed.add(topicId);
      persist(); renderTopic(topicById.get(topicId)); toast(state.completed.has(topicId) ? "Tema je označena kot opravljena." : "Tema je spet v učenju.");
      return;
    }
    if (action === "scroll-section") {
      document.getElementById(trigger.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "review-toggle-answer") {
      const spoken = trigger.closest(".review-spoken");
      const hidden = spoken?.classList.toggle("answer-hidden");
      trigger.textContent = hidden ? "Pokaži odgovor" : "Skrij odgovor";
      trigger.setAttribute("aria-expanded", String(!hidden));
      return;
    }
    if (action === "flash-flip") { state.flashFlipped = !state.flashFlipped; renderFlashcards(); return; }
    if (action === "flash-shuffle") { resetFlashDeck(state.flashTopic, true); renderFlashcards(); return; }
    if (["flash-next", "flash-prev", "flash-known", "flash-repeat"].includes(action)) {
      const currentId = state.flashDeck[state.flashIndex];
      if (action === "flash-known") state.knownCards.add(currentId);
      if (action === "flash-repeat") state.knownCards.delete(currentId);
      if (action === "flash-prev") state.flashIndex = (state.flashIndex - 1 + state.flashDeck.length) % state.flashDeck.length;
      else state.flashIndex = (state.flashIndex + 1) % state.flashDeck.length;
      state.flashFlipped = false; persist(); renderFlashcards();
      return;
    }
    if (action === "quiz-start") { startQuiz(); return; }
    if (action === "quiz-answer") {
      const session = state.quizSession;
      if (!session || session.responses[session.index]) return;
      const item = session.questions[session.index];
      const selected = item.shuffledOptions[Number(trigger.dataset.index)];
      const correct = selected === item.correctText;
      session.responses[session.index] = { selected, correct };
      if (correct) session.score += 1;
      renderQuiz(); return;
    }
    if (action === "quiz-next") {
      const session = state.quizSession;
      if (session.index + 1 >= session.questions.length) {
        session.finished = true;
        const percent = Math.round(session.score / session.questions.length * 100);
        state.quizBest = Math.max(state.quizBest, percent); persist();
      } else session.index += 1;
      renderQuiz(); return;
    }
    if (action === "quiz-restart") { state.quizSession = null; renderQuiz(); return; }
    if (action === "exam-new") { generateExam(); renderExam(); toast("Nov izpit je generiran."); return; }
    if (action === "exam-copy") { copyExamMarkdown(); return; }
    if (action === "exam-export") { exportExamMarkdown(); return; }
    if (action === "editor-command") {
      const editor = trigger.closest(".exam-question").querySelector(".answer-editor");
      editor.focus(); document.execCommand(trigger.dataset.command, false); editor.dispatchEvent(new Event("input", { bubbles: true })); return;
    }
    if (action === "editor-formula") {
      const editor = trigger.closest(".exam-question").querySelector(".answer-editor");
      editor.focus(); document.execCommand("insertText", false, "\\(  \\)"); editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  document.addEventListener("keydown", event => {
    const editable = event.target.matches("input, select, textarea, [contenteditable='true']");
    if (!editable && event.key === "/") { event.preventDefault(); document.querySelector("#global-search").focus(); return; }
    if (editable) return;
    if (routeParts()[0] === "kartice") {
      if (event.code === "Space") { event.preventDefault(); state.flashFlipped = !state.flashFlipped; renderFlashcards(); }
      if (event.key === "ArrowRight") { state.flashIndex = (state.flashIndex + 1) % state.flashDeck.length; state.flashFlipped = false; renderFlashcards(); }
      if (event.key === "ArrowLeft") { state.flashIndex = (state.flashIndex - 1 + state.flashDeck.length) % state.flashDeck.length; state.flashFlipped = false; renderFlashcards(); }
    }
  });

  if (!location.hash) location.hash = "#/domov";
  else renderRoute();
})();
