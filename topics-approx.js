(() => {
  "use strict";

  /*
   * Ta datoteka se naloži pred ui.js, zato namenoma ne kliče window.StudyUI.
   * Majhen lokalni gradnik izdela isti varni HTML-podatkovni model.
   */
  const esc = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const M = (tex, fallback = tex, display = false) => {
    const mode = display ? ' data-display="block"' : "";
    const className = display ? "js-math math-display" : "js-math math-inline";
    return `<span class="${className}" data-tex="${esc(tex)}"${mode}>${esc(fallback)}</span>`;
  };

  const panel = (tex, fallback = tex, label = "zapis", tone = "") => {
    const toneAttr = tone ? ` data-tone="${esc(tone)}"` : "";
    return `<div class="math-panel" data-label="${esc(label)}"${toneAttr}>${M(tex, fallback, true)}</div>`;
  };

  const notation = (intro, entries) => `
    <p>${intro}</p>
    <dl class="notation-grid">
      ${entries.map(entry => `
        <div class="notation-item">
          <dt class="notation-symbol">${M(entry.tex, entry.symbol)}</dt>
          <dd class="notation-meaning"><strong>${entry.name}</strong>${entry.meaning}</dd>
        </div>`).join("")}
    </dl>`;

  const theorem = (name, body) =>
    `<div class="theorem-card" data-name="${esc(name)}">${body}</div>`;

  const sourceNote = (source, note = "") => `
    <div class="source-note"><strong>Vir v gradivu:</strong> ${source}${note ? ` · ${note}` : ""}</div>`;

  const proof = ({ idea, steps, conclusion, source }) => `
    <p class="proof-lead"><strong>Ideja.</strong> ${idea}</p>
    <div class="proof-steps">
      ${steps.map(step => `
        <div class="proof-step">
          <strong>${step.title}</strong>
          <div>${step.body}</div>
          <aside class="proof-reason">
            <strong>Zakaj ta korak velja?</strong>
            <p>${step.reason}</p>
          </aside>
        </div>`).join("")}
    </div>
    <p>${conclusion} <span class="proof-square" aria-label="konec dokaza">□</span></p>
    ${source ? sourceNote(source) : ""}`;

  const section = (type, label, title, html) => ({ type, label, title, html });

  const visual = (aria, inner, caption) => `
    <figure class="review-visual" style="--review-accent:var(--acid)">
      <div class="review-visual-stage">${inner}</div>
      <figcaption style="margin-top:10px;color:#9ca9a1;font-size:12px">${caption}</figcaption>
      <span class="sr-only">${aria}</span>
    </figure>`;

  const worked = (level, title, prompt, steps, answer) => `
    <article class="review-example" data-level="${level}">
      <span>${level === "easy" ? "lahek, popolnoma izpeljan primer" : "težji / izpitni primer"}</span>
      <h3>${title}</h3>
      <p class="review-example-prompt">${prompt}</p>
      <ol>${steps.map(item => `<li>${item}</li>`).join("")}</ol>
      <div class="review-example-answer"><strong>Končni odgovor</strong>${answer}</div>
    </article>`;

  const APRIL = {
    name: "Glavno gradivo · april 2026",
    file: "../../Za izpit/apm_nm2_gradivo.pdf"
  };
  const EXAM_JUNE = {
    name: "1. pisni izpit · 19. 6. 2026",
    file: "../apm_nm2_i1_2526.pdf"
  };
  const EXAM_JULY = {
    name: "2. pisni izpit · 1. 7. 2026",
    file: "../apm_nm2_i2_2526.pdf"
  };

  const topics = [];

  topics.push({
    id: "aproksimacija",
    number: 1,
    title: "Aproksimacijski problem in Bernsteinovi polinomi",
    short: "Kako izberemo prostor približkov, merimo residual in iz vzorčnih vrednosti sestavimo polinom, ki konvergira k zvezni funkciji.",
    accent: "#65e0c2",
    minutes: 17,
    oral: ["aproksimacijski problem", "Bernsteinovi polinomi", "Weierstrass"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 1–5" }, EXAM_JULY],
    sections: [
      section("notation", "00 / legenda", "Najprej poimenuj vse predmete", notation(
        "Aproksimacija ni samo formula. Vedno moramo povedati, <em>kaj</em> aproksimiramo, <em>kje</em> iščemo približek in <em>s čim</em> merimo napako.",
        [
          { tex: "X", symbol: "X", name: "prostor funkcij", meaning: " — običajno prostor zveznih ali večkrat zvezno odvedljivih funkcij." },
          { tex: "C^r([a,b])", symbol: "Cʳ([a,b])", name: "gladkost", meaning: " — funkcije z zveznimi odvodi do reda r na intervalu." },
          { tex: "Y\\subseteq X", symbol: "Y ⊆ X", name: "aproksimacijski podprostor", meaning: " — prostor dovoljenih približkov, npr. polinomi." },
          { tex: "P_n", symbol: "Pₙ", name: "polinomi", meaning: " — vsi realni polinomi stopnje največ n." },
          { tex: "r=f-g", symbol: "r = f − g", name: "residual", meaning: " — funkcija, ki v vsaki točki pove podpisano napako." },
          { tex: "\\|f-g\\|_{\\infty,[a,b]}", symbol: "‖f−g‖∞", name: "enakomerna napaka", meaning: " — največja absolutna napaka na celotnem intervalu." },
          { tex: "\\operatorname{dist}(f,Y)", symbol: "dist(f,Y)", name: "najmanjša možna napaka", meaning: " — infimum napak čez vse dovoljene približke." },
          { tex: "B_i^n", symbol: "Bᵢⁿ", name: "Bernsteinova baza", meaning: " — nenegativne uteži, ki se v vsaki točki seštejejo v ena." },
          { tex: "B_nf", symbol: "Bₙf", name: "Bernsteinov polinom", meaning: " — konkretna polinomska aproksimacija funkcije f." }
        ]
      )),
      section("plain", "01 / povej na glas", "Odgovor, s katerim začneš pri profesorju", `
        <p><strong>»Pri aproksimacijskem problemu imamo funkcijo ${M("f\\in X", "f ∈ X")}, ki jo želimo nadomestiti z enostavnejšo funkcijo ${M("g\\in Y", "g ∈ Y")} iz izbranega podprostora. Razlika ${M("f-g", "f−g")} je residual, njegovo velikost pa merimo z normo. V enakomerni normi gledamo največjo absolutno napako na celotnem intervalu.«</strong></p>
        <p>»Najmanjša napaka, ki jo prostor ${M("Y", "Y")} sploh dopušča, je ${M("\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\|f-g\\|", "dist(f,Y)=inf ‖f−g‖")}. Pomembno je torej ločiti funkcijo, približek, residual in eno samo število — normo residuala.«</p>
        <p>»Pri polinomski aproksimaciji lahko uporabimo Bernsteinovo bazo. Njene funkcije so nenegativne in seštevek je ena, zato je ${M("B_nf(x)", "Bₙf(x)")} uteženo povprečje vzorčnih vrednosti ${M("f(i/n)", "f(i/n)")}. Weierstrassov izrek zagotavlja, da za zvezno funkcijo z višanjem stopnje dobimo poljubno dobro enakomerno aproksimacijo.«</p>
      `),
      section("deep", "02 / nariši", "Funkcija, približek in residual niso ista stvar", visual(
        "Graf funkcije, polinomske aproksimacije in navpične napake",
        `
          <svg viewBox="0 0 760 330" role="img" aria-label="Funkcija, njen približek in residual" style="width:100%;height:auto">
            <rect x="0" y="0" width="760" height="330" rx="18" fill="#0a100d"/>
            <line x1="55" y1="270" x2="710" y2="270" stroke="#789087" stroke-width="2"/>
            <line x1="70" y1="292" x2="70" y2="38" stroke="#789087" stroke-width="2"/>
            <path d="M70 235 C145 45 245 300 345 130 S560 72 700 160" fill="none" stroke="#65e0c2" stroke-width="5"/>
            <path d="M70 220 C205 120 350 137 700 157" fill="none" stroke="#78ddff" stroke-width="4" stroke-dasharray="10 8"/>
            <line x1="215" y1="149" x2="215" y2="178" stroke="#ffb454" stroke-width="4"/>
            <line x1="455" y1="98" x2="455" y2="141" stroke="#ffb454" stroke-width="4"/>
            <circle cx="215" cy="149" r="6" fill="#65e0c2"/><circle cx="215" cy="178" r="6" fill="#78ddff"/>
            <circle cx="455" cy="98" r="6" fill="#65e0c2"/><circle cx="455" cy="141" r="6" fill="#78ddff"/>
            <text x="585" y="88" fill="#65e0c2" font-size="18" font-weight="800">f — original</text>
            <text x="520" y="193" fill="#78ddff" font-size="18" font-weight="800">g — približek</text>
            <text x="465" y="124" fill="#ffbf72" font-size="16">|f(x)−g(x)|</text>
            <text x="615" y="293" fill="#9aaca2" font-size="15">x ∈ [a,b]</text>
          </svg>
        `,
        "Enakomerna norma izbere največjo izmed vseh oranžnih navpičnih razdalj — ne povprečne in ne samo napake v vzorčnih točkah."
      )),
      section("formula", "03 / formalno", "Norma, razdalja in Bernsteinov zapis", `
        ${panel("\\|f\\|_{\\infty,[a,b]}=\\max_{x\\in[a,b]}|f(x)|", "‖f‖∞,[a,b] = max |f(x)|", "enakomerna norma", "green")}
        ${panel("\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\|f-g\\|", "dist(f,Y) = inf ‖f−g‖", "aproksimacijski problem")}
        ${panel("B_i^n(x)=\\binom{n}{i}x^i(1-x)^{n-i},\\qquad B_nf(x)=\\sum_{i=0}^{n}f\\!\\left(\\frac{i}{n}\\right)B_i^n(x)", "Bᵢⁿ(x)=C(n,i)xⁱ(1−x)ⁿ⁻ⁱ; Bₙf=Σf(i/n)Bᵢⁿ", "Bernstein")}
        ${theorem("Weierstrassov izrek", `
          <p>Za vsako ${M("f\\in C([a,b])", "f ∈ C([a,b])")} velja
          ${M("\\lim_{n\\to\\infty}\\operatorname{dist}_{\\infty}(f,P_n)=0", "lim dist∞(f,Pₙ)=0")}.
          Izrek zagotavlja <em>obstoj</em> poljubno dobrih polinomov; ne trdi, da je vsak polinom visoke stopnje dober in ne trdi, da je interpolacija v ekvidistantnih točkah stabilna.</p>
        `)}
        <p><strong>Diskretna past.</strong> ${M("\\max_{x\\in X_h}|f(x)|", "max na Xₕ")} je lahko nič za neničelno funkcijo, zato je na celotnem funkcijskem prostoru le seminorma.</p>
        ${sourceNote("str. 1–5", "definicija 1.1, trditvi 1.1–1.2 in izrek 1.1")}
      `),
      section("algorithm", "04 / postopek", "Kako sestaviš Bernsteinov polinom", `
        <ol>
          <li><strong>Normaliziraj interval.</strong> Če je interval ${M("[a,b]", "[a,b]")}, uvedi ${M("t=(x-a)/(b-a)", "t=(x−a)/(b−a)")}, da delaš na ${M("[0,1]", "[0,1]")}.</li>
          <li><strong>Izberi stopnjo.</strong> Za stopnjo ${M("n", "n")} potrebuješ vzorčne točke ${M("i/n", "i/n")}, kjer je ${M("i=0,\\ldots,n", "i=0,…,n")}.</li>
          <li><strong>Izračunaj podatke.</strong> Zapiši vrednosti ${M("f(i/n)", "f(i/n)")} in bazne polinome ${M("B_i^n", "Bᵢⁿ")}.</li>
          <li><strong>Sestavi uteženo vsoto.</strong> Uporabi ${M("B_nf=\\sum f(i/n)B_i^n", "Bₙf=Σf(i/n)Bᵢⁿ")}.</li>
          <li><strong>Šele nato poenostavi.</strong> Če naloga zahteva potenčno bazo, razširi oklepaje in združi koeficiente.</li>
          <li><strong>Preveri rob.</strong> Vedno mora veljati ${M("B_nf(0)=f(0)", "Bₙf(0)=f(0)")} in ${M("B_nf(1)=f(1)", "Bₙf(1)=f(1)")}.</li>
        </ol>
      `),
      section("example", "05 / lahek primer", "Bernsteinov polinom brez preskoka", worked(
        "easy",
        "Aproksimiraj f(x)=x² s stopnjo 2",
        `Za ${M("f(x)=x^2", "f(x)=x²")} na ${M("[0,1]", "[0,1]")} izračunaj ${M("B_2f", "B₂f")} in njegovo enakomerno napako.`,
        [
          `Vzorčne vrednosti so ${M("f(0)=0,\\ f(1/2)=1/4,\\ f(1)=1", "f(0)=0, f(1/2)=1/4, f(1)=1")}.`,
          `Baza je ${M("B_0^2=(1-x)^2,\\ B_1^2=2x(1-x),\\ B_2^2=x^2", "B₀²=(1−x)², B₁²=2x(1−x), B₂²=x²")}.`,
          `${M("B_2f(x)=0+\\frac14\\,2x(1-x)+x^2=\\frac12x+\\frac12x^2", "B₂f(x)=x/2+x²/2")}.`,
          `Residual je ${M("f-B_2f=-\\frac12x(1-x)", "f−B₂f=−x(1−x)/2")}; absolutna vrednost je največja pri ${M("x=1/2", "x=1/2")}.`
        ],
        `${M("B_2f(x)=\\frac12x+\\frac12x^2,\\qquad \\|f-B_2f\\|_\\infty=\\frac18", "B₂f=x/2+x²/2, ‖f−B₂f‖∞=1/8")}.</p><p>Pomembno: Bernsteinov polinom ni interpolant v notranji točki; uporablja njeno vrednost kot koeficient.</p>`
      )),
      section("example", "06 / težji tip", "Kaj moraš dokazati pri konvergenci", worked(
        "hard",
        "Od lokalne zveznosti do enakomerne ocene",
        `Profesor vpraša: »Zakaj nenegativne uteži in razčlenitev enote sploh pomagajo pri dokazu Weierstrassa?«`,
        [
          `Zapiši ${M("B_nf(x)-f(x)=\\sum_{i=0}^n\\bigl(f(i/n)-f(x)\\bigr)B_i^n(x)", "Bₙf−f=Σ(f(i/n)−f(x))Bᵢⁿ")}.`,
          `Člene razdeli na bližnje ${M("|i/n-x|<\\delta", "|i/n−x|<δ")} in oddaljene.`,
          `Pri bližnjih uporabi enakomerno zveznost; pri oddaljenih omejenost funkcije in drugi moment Bernsteinovih uteži.`,
          `Ocena je neodvisna od ${M("x", "x")}, zato gre za enakomerno, ne zgolj točkovno konvergenco.`
        ],
        "Namen razčlenitve enote je, da napako zapišemo kot povprečje lokalnih razlik. Nenegativnost dovoljuje ocenjevanje absolutne vrednosti člen za člen."
      )),
      section("proof", "07 / cel dokaz", "Bernsteinov dokaz Weierstrassovega izreka na [0,1]", proof({
        idea: "Napako razcepimo na bližnje vzorce, kjer pomaga enakomerna zveznost, in oddaljene vzorce, katerih skupna Bernsteinova utež gre proti nič.",
        steps: [
          {
            title: "Razčlenitev enote pretvori razliko v uteženo napako",
            body: panel("\\left|B_nf(x)-f(x)\\right|\\le \\sum_{i=0}^{n}\\left|f(i/n)-f(x)\\right|B_i^n(x)", "|Bₙf(x)−f(x)| ≤ Σ |f(i/n)−f(x)|Bᵢⁿ(x)", "1. korak"),
            reason: "Odštejemo f(x)·ΣBᵢⁿ(x)=f(x), nato uporabimo trikotniško neenakost in nenegativnost uteži."
          },
          {
            title: "Za bližnje točke velja ista majhna meja",
            body: `Ker je ${M("f", "f")} na kompaktnem intervalu enakomerno zvezna, za vsak ${M("\\varepsilon>0", "ε>0")} obstaja ${M("\\delta>0", "δ>0")}, da iz ${M("|u-v|<\\delta", "|u−v|<δ")} sledi ${M("|f(u)-f(v)|<\\varepsilon/2", "|f(u)−f(v)|<ε/2")}.`,
            reason: "Zvezna funkcija na kompaktnem intervalu je enakomerno zvezna; δ zato ne zavisi od izbrane točke x."
          },
          {
            title: "Oddaljene uteži ocenimo z drugim momentom",
            body: panel("\\sum_{|i/n-x|\\ge\\delta}B_i^n(x)\\le \\frac{1}{\\delta^2}\\sum_{i=0}^n(i/n-x)^2B_i^n(x)=\\frac{x(1-x)}{n\\delta^2}\\le\\frac{1}{4n\\delta^2}", "Σ oddaljenih uteži ≤ 1/(4nδ²)", "2. moment", "violet"),
            reason: "Na oddaljeni množici je 1 ≤ (i/n−x)²/δ². Identiteta za drugi moment sledi iz formul Bₙ1=1, Bₙx=x in Bₙx²=x²+x(1−x)/n."
          },
          {
            title: "Združimo obe oceni",
            body: `Če je ${M("M=\\|f\\|_\\infty", "M=‖f‖∞")}, je oddaljeni del največ ${M("2M/(4n\\delta^2)", "2M/(4nδ²)")}. Zato je ${M("\\|B_nf-f\\|_\\infty\\le\\varepsilon/2+M/(2n\\delta^2)", "‖Bₙf−f‖∞≤ε/2+M/(2nδ²)")}.`,
            reason: "Vsaka razlika |f(i/n)−f(x)| je največ 2M, bližnje uteži pa seštejejo v največ ena."
          },
          {
            title: "Izberemo dovolj velik n",
            body: `Za ${M("n>M/(\\varepsilon\\delta^2)", "n>M/(εδ²)")} je tudi drugi člen manjši od ${M("\\varepsilon/2", "ε/2")}, zato ${M("\\|B_nf-f\\|_\\infty<\\varepsilon", "‖Bₙf−f‖∞<ε")}.`,
            reason: "Meja je enaka za vse x, zato smo dokazali konvergenco v enakomerni normi."
          }
        ],
        conclusion: "Torej Bernsteinovi polinomi enakomerno konvergirajo k vsaki zvezni funkciji na [0,1]. Z afino preslikavo intervala dobimo trditev na poljubnem [a,b].",
        source: "izrek 1.1 na str. 5; gradivo dokaz izpusti, tukaj je standardni Bernsteinov dokaz"
      })),
      section("warning", "08 / pogoste napake", "Ne zamenjaj teh štirih stvari", `
        <ul>
          <li><strong>Residual ni norma.</strong> ${M("f-g", "f−g")} je funkcija; ${M("\\|f-g\\|_\\infty", "‖f−g‖∞")} je število.</li>
          <li><strong>Infimum ni maksimum.</strong> Pri ${M("\\operatorname{dist}(f,Y)", "dist(f,Y)")} minimiziramo po približkih; pri enakomerni normi maksimiziramo po točkah.</li>
          <li><strong>Bernstein ni interpolacija v vseh vozliščih.</strong> Vedno interpolira robova, notranje vrednosti pa so koeficienti utežene vsote.</li>
          <li><strong>Weierstrass ni stabilnost polinomske interpolacije.</strong> Obstoj dobrih polinomov ne prepreči Rungejevega pojava pri slabi izbiri interpolacijskih točk.</li>
          <li><strong>Diskretni maksimum ni avtomatično prava norma.</strong> Med vzorčnimi točkami se lahko skriva večja napaka.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Kaj poveš brez gledanja", `
        <p><strong>Aproksimacijski problem:</strong> iz ${M("Y\\subseteq X", "Y⊆X")} izberemo ${M("g", "g")}, da je norma residuala čim manjša. Enakomerna norma meri najslabšo točko.</p>
        <p><strong>Bernstein:</strong> ${M("B_i^n\\ge0", "Bᵢⁿ≥0")} in ${M("\\sum B_i^n=1", "ΣBᵢⁿ=1")}, zato je ${M("B_nf", "Bₙf")} stabilno uteženo povprečje vzorcev.</p>
        <p><strong>Weierstrass:</strong> vsako zvezno funkcijo na zaprtem intervalu lahko v enakomerni normi poljubno dobro aproksimiramo s polinomi.</p>
      `)
    ]
  });

  topics.push({
    id: "remes-cebisev",
    number: 2,
    title: "Najboljša aproksimacija, Čebišev in Remes",
    short: "Kako alterniranje residuala karakterizira minimaksni polinom in kako ga Remes poišče z zaporedjem linearnih sistemov.",
    accent: "#ffb454",
    minutes: 21,
    oral: ["alterniranje residuala", "Čebišev trik", "Remesov postopek"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 5–10" }, EXAM_JUNE, EXAM_JULY],
    sections: [
      section("notation", "00 / legenda", "Kaj je neznano in kaj je certifikat", notation(
        "Pri tej temi je bistveno ločiti optimalni polinom, trenutni Remesov približek, višino alterniranja in množico menjalnih točk.",
        [
          { tex: "p^*\\in P_n", symbol: "p* ∈ Pₙ", name: "minimaksni polinom", meaning: " — enolična najboljša enakomerna aproksimacija." },
          { tex: "r=f-p", symbol: "r=f−p", name: "residual", meaning: " — podpisana napaka polinoma p." },
          { tex: "M=\\|r\\|_\\infty", symbol: "M=‖r‖∞", name: "prava največja napaka", meaning: " — maksimum na celotnem intervalu." },
          { tex: "E_k=\\{x_0,\\ldots,x_{n+1}\\}", symbol: "Eₖ", name: "menjalna množica", meaning: " — n+2 urejenih točk trenutnega koraka." },
          { tex: "m_k", symbol: "mₖ", name: "višina na Eₖ", meaning: " — skupna podpisana amplituda, dobljena iz linearnega sistema." },
          { tex: "\\sigma\\in\\{-1,1\\}", symbol: "σ ∈ {−1,1}", name: "začetni predznak", meaning: " — določi, ali alterniranje začne zgoraj ali spodaj." },
          { tex: "T_j", symbol: "Tⱼ", name: "polinom Čebiševa", meaning: " — Tⱼ(x)=cos(j arccos x) na [−1,1]." },
          { tex: "\\varepsilon", symbol: "ε", name: "toleranca", meaning: " — dovoljena razlika med pravo napako M in |mₖ|." }
        ]
      )),
      section("plain", "01 / povej na glas", "Naravna razlaga minimaksa", `
        <p><strong>»Iščemo polinom ${M("p^*\\in P_n", "p*∈Pₙ")}, ki minimizira največjo absolutno napako. Izrek o alterniranju pravi, da optimalni residual ni samo majhen, ampak se mora v vsaj ${M("n+2", "n+2")} urejenih točkah izmenično dotakniti vrednosti ${M("+M", "+M")} in ${M("-M", "−M")}. To je hkrati geometrijski certifikat optimalnosti.«</strong></p>
        <p>»Remesov postopek ta certifikat gradi iterativno. Izberem ${M("n+2", "n+2")} točk, zahtevam enako veliko izmenično napako in rešim linearni sistem za koeficiente polinoma ter amplitudo ${M("m", "m")}. Nato poiščem pravi največji ekstrem residuala. Če je večji od ${M("|m|", "|m|")}, z njim zamenjam eno točko, pri tem pa ohranim alterniranje.«</p>
        <p>»Čebišev trik je poseben zaprt primer: če je funkcija polinom stopnje natanko največ ${M("n+1", "n+1")} in jo na ${M("[-1,1]", "[−1,1]")} zapišem v Čebiševi bazi, odstranim samo člen ob ${M("T_{n+1}", "Tₙ₊₁")}. Za splošno zvezno funkcijo ali za več višjih členov ta bližnjica ne velja.«</p>
      `),
      section("deep", "02 / nariši", "Alterniranje je vidni podpis optimuma", visual(
        "Residual, ki se v štirih točkah izmenično dotika plus in minus M",
        `
          <svg viewBox="0 0 760 330" role="img" aria-label="Alternirajoči residual za kvadratično aproksimacijo" style="width:100%;height:auto">
            <rect width="760" height="330" rx="18" fill="#0a100d"/>
            <line x1="55" y1="165" x2="710" y2="165" stroke="#63756b" stroke-width="2"/>
            <line x1="55" y1="74" x2="710" y2="74" stroke="#ffb454" stroke-width="2" stroke-dasharray="9 8"/>
            <line x1="55" y1="256" x2="710" y2="256" stroke="#ffb454" stroke-width="2" stroke-dasharray="9 8"/>
            <path d="M82 74 C145 74 150 256 255 256 S350 74 455 74 S565 256 670 256" fill="none" stroke="#65e0c2" stroke-width="5"/>
            <g fill="#c8ff3d" stroke="#0a100d" stroke-width="4">
              <circle cx="82" cy="74" r="9"/><circle cx="255" cy="256" r="9"/>
              <circle cx="455" cy="74" r="9"/><circle cx="670" cy="256" r="9"/>
            </g>
            <text x="22" y="80" fill="#ffcb86" font-size="17">+M</text>
            <text x="22" y="262" fill="#ffcb86" font-size="17">−M</text>
            <text x="72" y="304" fill="#a7b5ad" font-size="15">x0</text>
            <text x="245" y="304" fill="#a7b5ad" font-size="15">x1</text>
            <text x="445" y="304" fill="#a7b5ad" font-size="15">x2</text>
            <text x="660" y="304" fill="#a7b5ad" font-size="15">x3</text>
            <text x="520" y="138" fill="#65e0c2" font-size="18" font-weight="800">r(x)=f(x)−p(x)</text>
          </svg>
        `,
        "Za p iz P₂ potrebujemo štiri alternirajoče ekstreme. Samo štiri ničle residuala niso dovolj; pomembne so enake ekstremne absolutne vrednosti."
      )),
      section("theorem", "03 / izrek", "Alternacijski certifikat in natančna meja Čebiševega trika", `
        ${theorem("Izrek o alterniranju residuala", `
          <p>Za ${M("f\\in C([a,b])", "f∈C([a,b])")} obstaja enoličen najboljši polinom ${M("p^*\\in P_n", "p*∈Pₙ")}. Zanj obstajajo točke ${M("x_0<\\cdots<x_{n+1}", "x₀<⋯<xₙ₊₁")} in ${M("\\sigma\\in\\{-1,1\\}", "σ∈{−1,1}")}, da
          ${panel("f(x_i)-p^*(x_i)=(-1)^i\\sigma\\,\\|f-p^*\\|_{\\infty,[a,b]}", "f(xᵢ)−p*(xᵢ)=(−1)ⁱσ‖f−p*‖∞", "alterniranje", "amber")}</p>
        `)}
        <h3>Čebiševov poseben primer</h3>
        <p>Če velja <strong>vse troje</strong>:</p>
        <ol>
          <li>ciljni interval je ${M("[-1,1]", "[−1,1]")} ali smo ga tja afino preslikali;</li>
          <li>aproksimiramo iz ${M("P_n", "Pₙ")};</li>
          <li>funkcija je polinom iz ${M("P_{n+1}", "Pₙ₊₁")} z zapisom ${M("f=\\sum_{j=0}^{n+1}\\alpha_jT_j", "f=ΣαⱼTⱼ")};</li>
        </ol>
        <p>potem je</p>
        ${panel("p^*=\\sum_{j=0}^{n}\\alpha_jT_j,\\qquad \\|f-p^*\\|_\\infty=|\\alpha_{n+1}|", "p*=Σ(j=0..n) αⱼTⱼ; napaka=|αₙ₊₁|", "Čebišev trik", "violet")}
        <p><strong>Ne posplošuj:</strong> pri splošni zvezni funkciji, polinomu stopnje več kot ${M("n+1", "n+1")} ali navadni odsekani Čebiševi vrsti samo brisanje višjih členov v splošnem ni minimaksna rešitev.</p>
        ${sourceNote("str. 7–8", "izrek 1.2 in trditev 1.3")}
      `),
      section("formula", "04 / sistem", "Remesov linearni sistem moraš znati sestaviti", `
        <p>V koraku ${M("k", "k")} zapišemo ${M("p_k(x)=a_0+a_1x+\\cdots+a_nx^n", "pₖ=a₀+a₁x+⋯+aₙxⁿ")} in v točkah ${M("E_k", "Eₖ")} zahtevamo ${M("f(x_i)-p_k(x_i)=(-1)^im_k", "f(xᵢ)−pₖ(xᵢ)=(−1)ⁱmₖ")}.</p>
        ${panel("\\begin{bmatrix}1&1&x_0&\\cdots&x_0^n\\\\-1&1&x_1&\\cdots&x_1^n\\\\\\vdots&\\vdots&\\vdots&&\\vdots\\\\(-1)^{n+1}&1&x_{n+1}&\\cdots&x_{n+1}^n\\end{bmatrix}\\begin{bmatrix}m_k\\\\a_0\\\\a_1\\\\\\vdots\\\\a_n\\end{bmatrix}=\\begin{bmatrix}f(x_0)\\\\f(x_1)\\\\\\vdots\\\\f(x_{n+1})\\end{bmatrix}", "[alternirajoči stolpec | Vandermondova matrika]·[m,a₀,…,aₙ]ᵀ=f(Eₖ)", "Remesov sistem")}
        <p>Prvi stolpec ni del polinoma: predstavlja predpisane predznake napake. Po rešitvi sistema je ${M("|m_k|", "|mₖ|")} največja napaka samo na trenutni množici ${M("E_k", "Eₖ")}; pravo napako ${M("M_k=\\|f-p_k\\|_\\infty", "Mₖ=‖f−pₖ‖∞")} moramo šele poiskati.</p>
      `),
      section("algorithm", "05 / algoritem", "En cel Remesov korak", `
        <ol>
          <li>Izberi ${M("n+2", "n+2")} urejenih točk ${M("E_k=\\{x_0,\\ldots,x_{n+1}\\}", "Eₖ={x₀,…,xₙ₊₁}")}.</li>
          <li>Sestavi sistem z alternirajočim prvim stolpcem in ga reši za ${M("m_k,a_0,\\ldots,a_n", "mₖ,a₀,…,aₙ")}.</li>
          <li>Oblikuj residual ${M("r_k=f-p_k", "rₖ=f−pₖ")} in poišči globalni ekstrem ${M("y\\in[a,b]", "y∈[a,b]")} z ${M("|r_k(y)|=\\|r_k\\|_\\infty", "|rₖ(y)|=‖rₖ‖∞")}.</li>
          <li>Če je ${M("\\|r_k\\|_\\infty-|m_k|\\le\\varepsilon", "‖rₖ‖∞−|mₖ|≤ε")}, končaj.</li>
          <li>Sicer najdi interval ${M("x_{j-1}<y<x_j", "xⱼ₋₁<y<xⱼ")}. Če imata ${M("r_k(y)", "rₖ(y)")} in ${M("r_k(x_j)", "rₖ(xⱼ)")} isti predznak, zamenjaj ${M("x_j", "xⱼ")}; sicer ${M("x_{j-1}", "xⱼ₋₁")}.</li>
          <li>Dobljena množica je ${M("E_{k+1}", "Eₖ₊₁")}; ponovi sistem. Izbira zamenjave ohrani alterniranje.</li>
        </ol>
      `),
      section("example", "06 / lahek primer", "Cel minimaksni izračun na treh točkah", worked(
        "easy",
        "Najboljša premica za x²",
        `Za ${M("f(x)=x^2", "f(x)=x²")} poišči ${M("p(x)=a_0+a_1x", "p=a₀+a₁x")}, ki alternira na ${M("E=\\{0,1/2,1\\}", "E={0,1/2,1}")}.`,
        [
          `Zahteve so ${M("-a_0=m", "−a₀=m")}, ${M("1/4-a_0-a_1/2=-m", "1/4−a₀−a₁/2=−m")} in ${M("1-a_0-a_1=m", "1−a₀−a₁=m")}.`,
          `Iz prve je ${M("a_0=-m", "a₀=−m")}; iz tretje nato ${M("a_1=1", "a₁=1")}.`,
          `Druga enačba da ${M("-1/4+m=-m", "−1/4+m=−m")}, zato ${M("m=1/8", "m=1/8")} in ${M("a_0=-1/8", "a₀=−1/8")}.`,
          `Residual ${M("r(x)=x^2-x+1/8=(x-1/2)^2-1/8", "r=(x−1/2)²−1/8")} na celotnem intervalu ostane med ${M("-1/8", "−1/8")} in ${M("1/8", "1/8")}.`
        ],
        `${M("p^*(x)=x-\\frac18,\\qquad \\|f-p^*\\|_\\infty=\\frac18", "p*(x)=x−1/8, napaka=1/8")}. Ker imamo tri alternirajoče ekstreme, je to tudi najboljša premica na celotnem ${M("[0,1]", "[0,1]")}.</p>`
      )),
      section("example", "07 / zadnji izpit", "Remes na izpitu 19. 6. 2026", worked(
        "hard",
        "Parabola za −16x cos(πx)",
        `Za ${M("f(x)=-16x\\cos(\\pi x)", "f(x)=−16x cos(πx)")} in ${M("E=\\{0,1/3,2/3,1\\}", "E={0,1/3,2/3,1}")} napravi en Remesov korak v ${M("P_2", "P₂")}.`,
        [
          `Vrednosti so ${M("f(E)=(0,-8/3,16/3,16)", "f(E)=(0,−8/3,16/3,16)")}.`,
          `Sistem ima vrstice ${M("((-1)^i,1,x_i,x_i^2)", "((−1)ⁱ,1,xᵢ,xᵢ²)")} in neznanke ${M("(m,a_0,a_1,a_2)^T", "(m,a₀,a₁,a₂)ᵀ")}.`,
          `Rešitev je ${M("m=1,\\ a_0=-1,\\ a_1=-12,\\ a_2=30", "m=1, a₀=−1, a₁=−12, a₂=30")}.`,
          `Preverjanje: residuali v štirih točkah so po vrsti ${M("(1,-1,1,-1)", "(1,−1,1,−1)")}.`
        ],
        `${M("p(x)=30x^2-12x-1,\\qquad \\|f-p\\|_{\\infty,E}=1", "p(x)=30x²−12x−1, ‖f−p‖∞,E=1")}.</p><p>To je optimum na končni množici E. Za trditev o celotnem intervalu bi morali še poiskati globalne ekstreme residuala.</p>`
      )),
      section("proof", "08 / cel dokaz", "Zakaj alterniranje res prepreči boljši polinom", proof({
        idea: "Če bi obstajal strogo boljši polinom, bi morala razlika dveh polinomov stopnje največ n zaradi alterniranja spremeniti predznak n+1-krat — to pa je nemogoče.",
        steps: [
          {
            title: "Predpostavimo alternirajoči residual",
            body: `Naj bo ${M("r=f-p", "r=f−p")} in naj v ${M("n+2", "n+2")} točkah velja ${M("r(x_i)=(-1)^i\\sigma M", "r(xᵢ)=(−1)ⁱσM")}, kjer je ${M("M=\\|r\\|_\\infty", "M=‖r‖∞")}.`,
            reason: "To je natančno predpostavka uporabne, zadostne smeri alternacijskega izreka."
          },
          {
            title: "Vzemimo domnevno strogo boljši q",
            body: `Predpostavimo ${M("q\\in P_n", "q∈Pₙ")} z ${M("\\|f-q\\|_\\infty<M", "‖f−q‖∞<M")}. Označimo ${M("s=f-q", "s=f−q")}.`,
            reason: "Dokazujemo optimalnost s protislovjem; strogo boljši pomeni, da je |s(xᵢ)| v vsaki alternacijski točki strogo manjši od M."
          },
          {
            title: "Razlika polinomov alternira",
            body: panel("q(x_i)-p(x_i)=r(x_i)-s(x_i)", "q(xᵢ)−p(xᵢ)=r(xᵢ)−s(xᵢ)", "ključna identiteta"),
            reason: "Ker je |s(xᵢ)|<M=|r(xᵢ)|, ima r(xᵢ)−s(xᵢ) isti predznak kot r(xᵢ). Predznaki q−p se zato v zaporednih točkah izmenjujejo."
          },
          {
            title: "Vmes mora biti n+1 ničel",
            body: `Po izreku o vmesni vrednosti ima ${M("q-p", "q−p")} vsaj eno ničlo v vsakem od ${M("n+1", "n+1")} intervalov ${M("(x_i,x_{i+1})", "(xᵢ,xᵢ₊₁)")}.`,
            reason: "Polinom je zvezen in na krajiščih vsakega intervala ima nasprotna predznaka."
          },
          {
            title: "Protislovje s stopnjo",
            body: `Toda ${M("q-p\\in P_n", "q−p∈Pₙ")} in neničeln polinom stopnje največ ${M("n", "n")} ne more imeti ${M("n+1", "n+1")} različnih ničel.`,
            reason: "Osnovni izrek o številu ničel polinoma omeji število različnih realnih ničel z njegovo stopnjo."
          }
        ],
        conclusion: "Strogo boljšega q ni, zato je p najboljša enakomerna aproksimacija. To je cel dokaz zadostne smeri, ki jo pri Remesu uporabljamo kot certifikat; nujnost in enoličnost sta globlji del izreka.",
        source: "izrek 1.2 na str. 7; gradivo dokaz celotnega karakterizacijskega izreka izpusti"
      })),
      section("warning", "09 / pogoste napake", "Kje se Remes najpogosteje podre", `
        <ul>
          <li><strong>Napačen prvi stolpec:</strong> znaki morajo biti ${M("1,-1,1,-1,\\ldots", "1,−1,1,−1,…")} in pripadajo neznanki ${M("m", "m")}.</li>
          <li><strong>Zamenjan residual:</strong> ves čas uporabljaj isto konvencijo ${M("r=f-p", "r=f−p")}; druga konvencija obrne vse predznake.</li>
          <li><strong>Napaka na E ni napaka na intervalu:</strong> ${M("|m_k|", "|mₖ|")} še ni nujno ${M("\\|r_k\\|_{\\infty,[a,b]}", "‖rₖ‖∞,[a,b]")}.</li>
          <li><strong>Alterniranje niso ničle:</strong> potrebujemo enako velike ekstremne vrednosti z izmeničnim predznakom.</li>
          <li><strong>Čebišev trik ima ozek domet:</strong> velja za en sam najvišji člen ${M("T_{n+1}", "Tₙ₊₁")} pri prehodu iz ${M("P_{n+1}", "Pₙ₊₁")} v ${M("P_n", "Pₙ")} na ${M("[-1,1]", "[−1,1]")}.</li>
        </ul>
      `),
      section("recap", "10 / 30 sekund", "Cel odgovor v treh stavkih", `
        <p><strong>Alterniranje:</strong> minimaksni residual polinoma iz ${M("P_n", "Pₙ")} se v ${M("n+2", "n+2")} točkah izmenično dotakne ${M("\\pm M", "±M")}.</p>
        <p><strong>Remes:</strong> na trenutnih točkah rešimo alternirajoči linearni sistem, poiščemo pravi globalni ekstrem in zamenjamo eno točko tako, da ohranimo predznake.</p>
        <p><strong>Čebišev:</strong> samo pri ${M("f\\in P_{n+1}", "f∈Pₙ₊₁")} na ${M("[-1,1]", "[−1,1]")} odrežemo člen ob ${M("T_{n+1}", "Tₙ₊₁")}; to ni splošni recept za poljubno funkcijo.</p>
      `)
    ]
  });

  topics.push({
    id: "interpolacija",
    number: 3,
    title: "Polinomska interpolacija in deljene diference",
    short: "Iz tabelaričnih podatkov zgradimo enoličen polinom, ga hitro dopolnjujemo v Newtonovi obliki in natančno ocenimo napako.",
    accent: "#70a8ff",
    minutes: 23,
    oral: ["interpolacijski polinom", "Newtonova oblika", "deljene diference", "ocena napake"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 11–13" }, EXAM_JULY],
    sections: [
      section("notation", "00 / legenda", "Kaj pomeni vsak simbol v interpolacijski formuli", notation(
        "Najprej loči <em>podatke</em>, <em>iskani polinom</em> in <em>člen napake</em>.",
        [
          { tex: "x_0,\\ldots,x_n", symbol: "x₀,…,xₙ", name: "interpolacijska vozlišča", meaning: " — med seboj različne točke, v katerih poznamo funkcijo." },
          { tex: "f_i=f(x_i)", symbol: "fᵢ=f(xᵢ)", name: "podatkovne vrednosti", meaning: " — višine, skozi katere mora iti polinom." },
          { tex: "I_nf\\in P_n", symbol: "Iₙf ∈ Pₙ", name: "interpolacijski polinom", meaning: " — polinom stopnje največ n z lastnostjo Iₙf(xᵢ)=f(xᵢ)." },
          { tex: "f[x_i,\\ldots,x_j]", symbol: "f[xᵢ,…,xⱼ]", name: "deljena diferenca", meaning: " — koeficient Newtonove oblike." },
          { tex: "\\omega_{n+1}(x)", symbol: "ωₙ₊₁(x)", name: "vozelni polinom", meaning: " — produkt (x−x₀)⋯(x−xₙ), ki izgine v vseh vozliščih." },
          { tex: "\\xi_x", symbol: "ξₓ", name: "vmesna točka", meaning: " — neka točka med vozlišči in x; praviloma je odvisna od x." },
          { tex: "P_n", symbol: "Pₙ", name: "prostor polinomov", meaning: " — polinomi stopnje največ n; dimenzija je n+1." },
          { tex: "f[x_i,x_i]", symbol: "f[xᵢ,xᵢ]", name: "ponovljeno vozlišče", meaning: " — v Hermitovi interpolaciji pomeni f′(xᵢ), ne deljenja z nič." }
        ]
      )),
      section("plain", "01 / povej na glas", "Odgovor, s katerim začneš pri profesorju", `
        <p><strong>»Imamo ${M("n+1", "n+1")} različnih vozlišč ${M("x_0,\\ldots,x_n", "x₀,…,xₙ")} in vrednosti funkcije v njih. Iščemo polinom ${M("I_nf\\in P_n", "Iₙf∈Pₙ")}, ki gre skozi vse točke ${M("(x_i,f(x_i))", "(xᵢ,f(xᵢ))")}. Tak polinom obstaja in je enoličen.«</strong></p>
        <p>»Za računanje je praktična Newtonova oblika. Njeni koeficienti so deljene diference, vsak nov člen pa vsebuje vse prejšnje faktorje ${M("(x-x_0)\\cdots(x-x_{k-1})", "(x−x₀)⋯(x−xₖ₋₁)")}. Če dodamo novo vozlišče, starega dela ne računamo znova.«</p>
        <p>»Interpolacija zadene podatke natančno, vendar med vozlišči ni nujno dobra. Napako nadzira ${M("f^{(n+1)}", "f⁽ⁿ⁺¹⁾")} in razpored vozlišč prek produkta ${M("\\omega_{n+1}", "ωₙ₊₁")}.«</p>
      `),
      section("visual", "02 / slika", "Kaj polinom zadene in kje nastane napaka", visual(
        "Črtkana funkcija in interpolacijski polinom se ujemata v štirih vozliščih, med njimi pa nastane residual.",
        `
          <svg viewBox="0 0 760 270" role="img" aria-label="Interpolacija v štirih vozliščih" style="width:100%;height:auto">
            <defs><linearGradient id="interpGlow" x1="0" x2="1"><stop offset="0" stop-color="#65e0c2"/><stop offset="1" stop-color="#70a8ff"/></linearGradient></defs>
            <line x1="55" y1="222" x2="720" y2="222" stroke="#52615b" stroke-width="2"/>
            <line x1="72" y1="242" x2="72" y2="25" stroke="#52615b" stroke-width="2"/>
            <path d="M72 190 C150 52 228 52 310 138 C402 233 502 223 585 92 C630 22 680 44 720 88" fill="none" stroke="#a7b2ad" stroke-width="3" stroke-dasharray="8 8"/>
            <path d="M72 190 C162 56 230 67 310 138 C405 222 510 200 585 92 C630 28 678 50 720 102" fill="none" stroke="url(#interpGlow)" stroke-width="5"/>
            <path d="M374 178 L374 201 M367 181 L374 174 L381 181 M367 198 L374 205 L381 198" fill="none" stroke="#ffcf6e" stroke-width="2"/>
            <text x="389" y="194" fill="#ffcf6e" font-size="14">f(x) − I₃f(x)</text>
            <circle cx="72" cy="190" r="6" fill="#f4f7f5"/><circle cx="238" cy="79" r="6" fill="#f4f7f5"/><circle cx="410" cy="211" r="6" fill="#f4f7f5"/><circle cx="585" cy="92" r="6" fill="#f4f7f5"/>
            <text x="62" y="247" fill="#cbd4d0">x₀</text><text x="228" y="247" fill="#cbd4d0">x₁</text><text x="400" y="247" fill="#cbd4d0">x₂</text><text x="575" y="247" fill="#cbd4d0">x₃</text>
            <line x1="510" y1="30" x2="550" y2="30" stroke="#a7b2ad" stroke-width="3" stroke-dasharray="8 8"/><text x="560" y="35" fill="#cbd4d0">f</text>
            <line x1="510" y1="55" x2="550" y2="55" stroke="#70a8ff" stroke-width="5"/><text x="560" y="60" fill="#cbd4d0">I₃f</text>
          </svg>
        `,
        "Bele točke so pogoji, ki jih polinom zadene; rumena razdalja je lokalna interpolacijska napaka."
      )),
      section("formal", "03 / matematični zapis", "Newtonova oblika, rekurzija in izrek o napaki", `
        ${theorem("Newtonova interpolacijska formula", `
          ${panel(
            "I_nf(x)=f[x_0]+f[x_0,x_1](x-x_0)+\\cdots+f[x_0,\\ldots,x_n]\\prod_{j=0}^{n-1}(x-x_j)",
            "Iₙf=f[x₀]+f[x₀,x₁](x−x₀)+⋯+f[x₀,…,xₙ]∏ⱼ₌₀ⁿ⁻¹(x−xⱼ)",
            "Newtonova oblika"
          )}
          <p>Začetek tabele je ${M("f[x_i]=f(x_i)", "f[xᵢ]=f(xᵢ)")}, višji stolpci pa nastanejo po pravilu</p>
          ${panel(
            "f[x_i,\\ldots,x_{i+k}]=\\frac{f[x_{i+1},\\ldots,x_{i+k}]-f[x_i,\\ldots,x_{i+k-1}]}{x_{i+k}-x_i}",
            "f[xᵢ,…,xᵢ₊ₖ]=(desna prejšnja − leva prejšnja)/(xᵢ₊ₖ−xᵢ)",
            "rekurzija deljenih diferenc"
          )}
        `)}
        ${theorem("Interpolacijska napaka", `
          <p>Če je ${M("f\\in C^{n+1}", "f∈Cⁿ⁺¹")} na intervalu, ki vsebuje vozlišča in x, potem za neko ${M("\\xi_x", "ξₓ")} v tem intervalu velja</p>
          ${panel(
            "f(x)-I_nf(x)=\\frac{f^{(n+1)}(\\xi_x)}{(n+1)!}\\,\\omega_{n+1}(x),\\qquad \\omega_{n+1}(x)=\\prod_{i=0}^{n}(x-x_i)",
            "f(x)−Iₙf(x)=f⁽ⁿ⁺¹⁾(ξₓ)/(n+1)! · ∏ᵢ₌₀ⁿ(x−xᵢ)",
            "točkovna napaka",
            "accent"
          )}
          <p>Varna enakomerna ocena je ${M("\\|f-I_nf\\|_\\infty\\le \\frac{\\|f^{(n+1)}\\|_\\infty}{(n+1)!}\\max_x|\\omega_{n+1}(x)|", "‖f−Iₙf‖∞≤‖f⁽ⁿ⁺¹⁾‖∞·max|ωₙ₊₁|/(n+1)!")}.</p>
        `)}
        ${sourceNote("str. 11–13", "Newtonova oblika in izrek 2.2")}
      `),
      section("algorithm", "04 / algoritem", "Kako sestaviš tabelo deljenih diferenc", `
        <ol>
          <li>V prvi stolpec zapiši vozlišča ${M("x_i", "xᵢ")}, v drugega pa ${M("f[x_i]=f_i", "f[xᵢ]=fᵢ")}.</li>
          <li>Prvi red: ${M("f[x_i,x_{i+1}]=(f_{i+1}-f_i)/(x_{i+1}-x_i)", "f[xᵢ,xᵢ₊₁]=(fᵢ₊₁−fᵢ)/(xᵢ₊₁−xᵢ)")}.</li>
          <li>Vsak naslednji stolpec sestavi iz dveh sosednjih vrednosti prejšnjega. Pri redu k je imenovalec ${M("x_{i+k}-x_i", "xᵢ₊ₖ−xᵢ")}.</li>
          <li>V polinom vzemi zgornjo diagonalo ${M("f[x_0],f[x_0,x_1],\\ldots,f[x_0,\\ldots,x_n]", "f[x₀], f[x₀,x₁], …, f[x₀,…,xₙ]")}.</li>
          <li>Preveri vsa vozlišča. Za vrednotenje uporabi vgnezdeno obliko, podobno Hornerjevi shemi.</li>
        </ol>
        <div class="math-panel" data-label="oblika tabele">
          <table style="width:100%;border-collapse:collapse;text-align:center">
            <thead><tr><th>x</th><th>red 0</th><th>red 1</th><th>red 2</th><th>red 3</th></tr></thead>
            <tbody>
              <tr><td>x₀</td><td>f[x₀]</td><td>f[x₀,x₁]</td><td>f[x₀,x₁,x₂]</td><td>f[x₀,x₁,x₂,x₃]</td></tr>
              <tr><td>x₁</td><td>f[x₁]</td><td>f[x₁,x₂]</td><td>f[x₁,x₂,x₃]</td><td></td></tr>
              <tr><td>x₂</td><td>f[x₂]</td><td>f[x₂,x₃]</td><td></td><td></td></tr>
              <tr><td>x₃</td><td>f[x₃]</td><td></td><td></td><td></td></tr>
            </tbody>
          </table>
        </div>
      `),
      section("example", "05 / lahek primer", "Vse deljene diference brez preskoka", worked(
        "easy",
        "Interpoliraj x² v točkah 0, 1 in 2",
        `Naj bo ${M("f(x)=x^2", "f(x)=x²")} ter ${M("x_0=0,x_1=1,x_2=2", "x₀=0, x₁=1, x₂=2")}. Sestavi ${M("I_2f", "I₂f")} v Newtonovi obliki.`,
        [
          `Ničti red: ${M("f[0]=0,\\ f[1]=1,\\ f[2]=4", "f[0]=0, f[1]=1, f[2]=4")}.`,
          `Prvi red: ${M("f[0,1]=(1-0)/(1-0)=1", "f[0,1]=1")} in ${M("f[1,2]=(4-1)/(2-1)=3", "f[1,2]=3")}.`,
          `Drugi red: ${M("f[0,1,2]=(3-1)/(2-0)=1", "f[0,1,2]=1")}.`,
          `Newtonova oblika je ${M("I_2f(x)=0+1(x-0)+1(x-0)(x-1)", "I₂f(x)=x+x(x−1)")}.`,
          `Razširimo: ${M("x+x^2-x=x^2", "x+x²−x=x²")}; dobili smo prvotno funkcijo, zato je napaka povsod nič.`
        ],
        `<p>${M("I_2f(x)=x^2", "I₂f(x)=x²")}. Polinom stopnje 2 se z interpolacijo stopnje 2 rekonstruira natančno.</p>`
      )),
      section("example", "06 / težji primer", "Racionalna funkcija in ocena napake", worked(
        "hard",
        "Štiri vozlišča za 1/(3x+1)",
        `Na ${M("[0,1]", "[0,1]")} interpoliraj ${M("f(x)=1/(3x+1)", "f(x)=1/(3x+1)")} v vozliščih ${M("0,1/3,2/3,1", "0, 1/3, 2/3, 1")}.`,
        [
          `Vrednosti funkcije so ${M("1,\\ 1/2,\\ 1/3,\\ 1/4", "1, 1/2, 1/3, 1/4")}.`,
          `Zgornja diagonala tabele je ${M("1,\\ -3/2,\\ 3/2,\\ -9/8", "1, −3/2, 3/2, −9/8")}.`,
          `Zato je ${M("I_3f(x)=1-\\frac32x+\\frac32x(x-\\frac13)-\\frac98x(x-\\frac13)(x-\\frac23)", "I₃f=1−3x/2+3x(x−1/3)/2−9x(x−1/3)(x−2/3)/8")}.`,
          `Četrti odvod je ${M("f^{(4)}(x)=\\frac{1944}{(3x+1)^5}", "f⁽⁴⁾(x)=1944/(3x+1)⁵")}, zato je ${M("\\|f^{(4)}\\|_\\infty=1944", "‖f⁽⁴⁾‖∞=1944")}.`,
          `Gradivo poda varno, grobo mejo ${M("\\|f-I_3f\\|_\\infty\\le 9/2", "‖f−I₃f‖∞≤9/2")}. Z neposrednim maksimumom ${M("\\max|\\omega_4|=1/81", "max|ω₄|=1/81")} dobimo ostrejšo mejo ${M("\\|f-I_3f\\|_\\infty\\le1", "‖f−I₃f‖∞≤1")}.`
        ],
        `<p>${M("I_3f(x)=1-\\frac32x+\\frac32x(x-\\frac13)-\\frac98x(x-\\frac13)(x-\\frac23)", "Newtonov I₃f kot zgoraj")}.</p><p>Ocena je zgornja meja, ne dejanska vrednost napake.</p>`
      )),
      section("proof", "07 / cel dokaz", "Dokaz formule za interpolacijsko napako", proof({
        idea: "Za fiksno točko x zgradimo pomožno funkcijo z n+2 ničlami. Po večkratni uporabi Rolleovega izreka njen (n+1)-vi odvod nekje izgine.",
        steps: [
          {
            title: "Odstranimo trivialni primer",
            body: `Če je ${M("x=x_i", "x=xᵢ")} vozlišče, sta obe strani formule nič: ${M("f(x_i)-I_nf(x_i)=0", "f(xᵢ)−Iₙf(xᵢ)=0")} in ${M("\\omega_{n+1}(x_i)=0", "ωₙ₊₁(xᵢ)=0")}.`,
            reason: "V nadaljevanju delimo z vozlišnim produktom, zato vozlišča obravnavamo posebej."
          },
          {
            title: "Ustvarimo dodatno ničlo",
            body: panel(
              "C=\\frac{f(x)-I_nf(x)}{\\omega_{n+1}(x)},\\qquad g(t)=f(t)-I_nf(t)-C\\omega_{n+1}(t)",
              "C=(f(x)−Iₙf(x))/ωₙ₊₁(x), g(t)=f(t)−Iₙf(t)−Cωₙ₊₁(t)",
              "pomožna funkcija"
            ),
            reason: "Ker x ni vozlišče, je imenovalec neničeln; po tej izbiri velja g(x)=0."
          },
          {
            title: "Preštejemo ničle",
            body: `Za vsak ${M("i=0,\\ldots,n", "i=0,…,n")} velja ${M("g(x_i)=f(x_i)-I_nf(x_i)-C\\cdot0=0", "g(xᵢ)=0")}. Skupaj z x ima g vsaj ${M("n+2", "n+2")} različnih ničel.`,
            reason: "Interpolacijski pogoji dajo n+1 ničel, konstanto C pa smo izbrali za še eno."
          },
          {
            title: "Rolleov izrek uporabimo n+1-krat",
            body: `Med zaporednimi ničlami ima ${M("g'", "g′")} ničlo; postopek ponavljamo. Zato za neko ${M("\\xi_x", "ξₓ")} v najmanjšem intervalu, ki vsebuje vozlišča in x, velja ${M("g^{(n+1)}(\\xi_x)=0", "g⁽ⁿ⁺¹⁾(ξₓ)=0")}.`,
            reason: "To je zaporedna uporaba Rolleovega izreka; predpostavljena gladkost zagotovi vse potrebne odvode."
          },
          {
            title: "Izračunamo zadnji odvod",
            body: `Ker je ${M("I_nf\\in P_n", "Iₙf∈Pₙ")}, je njegov (n+1)-vi odvod nič. Ker je ${M("\\omega_{n+1}", "ωₙ₊₁")} moničen stopnje n+1, je ${M("\\omega_{n+1}^{(n+1)}=(n+1)!", "ωₙ₊₁⁽ⁿ⁺¹⁾=(n+1)!")}. Torej ${M("0=f^{(n+1)}(\\xi_x)-C(n+1)!", "0=f⁽ⁿ⁺¹⁾(ξₓ)−C(n+1)!")}.`,
            reason: "V (n+1)-vem odvodu nižji členi izginejo in ostane samo vodilni člen."
          },
          {
            title: "Vstavimo C nazaj",
            body: panel(
              "f(x)-I_nf(x)=\\frac{f^{(n+1)}(\\xi_x)}{(n+1)!}\\omega_{n+1}(x)",
              "f(x)−Iₙf(x)=f⁽ⁿ⁺¹⁾(ξₓ)ωₙ₊₁(x)/(n+1)!",
              "dokazana formula",
              "accent"
            ),
            reason: "Prejšnja enačba da C=f⁽ⁿ⁺¹⁾(ξₓ)/(n+1)!; definicija C nato neposredno da trditev."
          }
        ],
        conclusion: "Formula lepo loči vpliv funkcije od vpliva vozlišč: gladkost je v odvodu, geometrija vozlišč pa v produktu ω.",
        source: "izrek 2.2 na str. 12; tukaj je dokaz izpeljan v celoti"
      })),
      section("warning", "08 / pogoste napake", "Kaj profesor hitro opazi", `
        <ul>
          <li><strong>Interpolacija ni minimaks:</strong> pogoji so ${M("I_nf(x_i)=f(x_i)", "Iₙf(xᵢ)=f(xᵢ)")}; ne minimiziramo samodejno norme napake.</li>
          <li><strong>Imenovalec:</strong> pri deljeni diferenci reda k je ${M("x_{i+k}-x_i", "xᵢ₊ₖ−xᵢ")}, ne razlika sosednjih vozlišč.</li>
          <li><strong>ξ ni znana konstanta:</strong> ${M("\\xi_x", "ξₓ")} se praviloma spreminja z x, zato za oceno vzamemo maksimum odvoda.</li>
          <li><strong>Ponovljena vozlišča:</strong> pri Hermitu velja ${M("f[x_i,x_i]=f'(x_i)", "f[xᵢ,xᵢ]=f′(xᵢ)")}; ne delimo z nič.</li>
          <li><strong>Več vozlišč ni avtomatično bolje:</strong> pri enakomernih vozliščih se lahko pojavi Rungejev pojav.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Od podatkov do napake", `
        <p><strong>Problem:</strong> skozi n+1 različnih točk gre natanko en polinom iz ${M("P_n", "Pₙ")}.</p>
        <p><strong>Račun:</strong> sestavim deljene diference in zgornjo diagonalo vstavim v Newtonovo obliko.</p>
        <p><strong>Napaka:</strong> ${M("f-I_nf=f^{(n+1)}(\\xi_x)\\omega_{n+1}/(n+1)!", "f−Iₙf=f⁽ⁿ⁺¹⁾(ξₓ)ωₙ₊₁/(n+1)!")} — odvod meri zahtevnost funkcije, produkt kakovost vozlišč.</p>
        <p><strong>Kontrola:</strong> polinom mora zadeti vsako vozlišče; če je f že v ${M("P_n", "Pₙ")}, je napaka nič.</p>
      `)
    ]
  });

  topics.push({
    id: "zlepki",
    number: 4,
    title: "Zlepki: linearni, kvadratni in kubični",
    short: "Namesto enega visokega polinoma uporabimo lokalne polinome ter v vozliščih nadzorujemo ujemanje vrednosti, tangent in ukrivljenosti.",
    accent: "#c69cff",
    minutes: 27,
    oral: ["prostor zlepkov", "linearni zlepek", "kvadratni C¹", "kubični Hermite", "kubični C²"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 13–23" }, EXAM_JULY],
    sections: [
      section("notation", "00 / legenda", "Pred formulami si nariši intervale", notation(
        "Zlepek je ena funkcija, sestavljena iz več lokalnih polinomov. Zgornji indeks pove gladkost, spodnji pa stopnjo lokalnih kosov.",
        [
          { tex: "X=\\{x_0<\\cdots<x_m\\}", symbol: "X={x₀<⋯<xₘ}", name: "razdelitev", meaning: " — m podintervalov [xᵢ₋₁,xᵢ] in m+1 vozlišč." },
          { tex: "h_i=x_{i+1}-x_i", symbol: "hᵢ=xᵢ₊₁−xᵢ", name: "dolžina intervala", meaning: " — v gradivu se pojavlja tudi zapis Δxᵢ." },
          { tex: "S_n^r(X)", symbol: "Sₙʳ(X)", name: "prostor zlepkov", meaning: " — na vsakem podintervalu stopnja največ n, globalno pa gladkost Cʳ." },
          { tex: "I_n^rf", symbol: "Iₙʳf", name: "interpolacijski zlepek", meaning: " — zlepek, ki izpolni predpisane vrednosti in po potrebi odvode." },
          { tex: "f_i=f(x_i)", symbol: "fᵢ", name: "vrednost v vozlišču", meaning: " — podatkovna višina." },
          { tex: "s_i=S'(x_i)", symbol: "sᵢ", name: "naklon v vozlišču", meaning: " — skupni levi in desni prvi odvod pri C¹-zlepku." },
          { tex: "q_i", symbol: "qᵢ", name: "lokalni kos", meaning: " — polinom, ki velja samo na enem intervalu." },
          { tex: "\\delta_i=(f_{i+1}-f_i)/h_i", symbol: "δᵢ", name: "sekantni naklon", meaning: " — povprečni naklon podatkov na i-tem intervalu." }
        ]
      )),
      section("plain", "01 / povej na glas", "Razlaga, ki zveni kot razumevanje", `
        <p><strong>»Zlepek uporabljamo, ker en globalni polinom visoke stopnje lahko močno oscilira, lokalni polinomi pa so stabilnejši in jih lahko spreminjamo lokalno. Na vsakem podintervalu imamo svoj polinom, v notranjih vozliščih pa predpišemo, koliko odvodov se mora ujemati.«</strong></p>
        <p>»Če se ujemajo samo vrednosti, je zlepek ${M("C^0", "C⁰")}. Če se ujemajo še prvi odvodi, je ${M("C^1", "C¹")} in nima kota. Pri ${M("C^2", "C²")} se ujemajo tudi drugi odvodi, zato je prehod ukrivljenosti gladek.«</p>
        <p>»Linearni zlepek je določen samo z vrednostmi. Kvadratni ${M("C^1", "C¹")} potrebuje še en začetni naklon, nato naklone prenašamo rekurzivno. Kubični Hermitov kos določijo dve vrednosti in dva naklona; za globalni kubični ${M("C^2", "C²")} neznane naklone dobimo iz tridiagonalnega sistema in dveh robnih pogojev.«</p>
      `),
      section("visual", "02 / slika", "C⁰, C¹ in C² niso ista zahteva", visual(
        "Trije lokalni kubični kosi se stikajo v vozliščih; vrednost, tangenta in ukrivljenost so označene ločeno.",
        `
          <svg viewBox="0 0 760 300" role="img" aria-label="Zlepek s tremi lokalnimi kosi" style="width:100%;height:auto">
            <rect width="760" height="300" rx="18" fill="#0a100d"/>
            <line x1="50" y1="242" x2="712" y2="242" stroke="#4f5e57" stroke-width="2"/>
            <path d="M70 214 C125 214 135 80 245 116" fill="none" stroke="#65e0c2" stroke-width="6"/>
            <path d="M245 116 C355 152 360 238 474 190" fill="none" stroke="#c69cff" stroke-width="6"/>
            <path d="M474 190 C582 145 624 58 696 82" fill="none" stroke="#70a8ff" stroke-width="6"/>
            <g fill="#f4f7f5" stroke="#0a100d" stroke-width="4">
              <circle cx="70" cy="214" r="8"/><circle cx="245" cy="116" r="8"/><circle cx="474" cy="190" r="8"/><circle cx="696" cy="82" r="8"/>
            </g>
            <line x1="190" y1="98" x2="302" y2="135" stroke="#ffcf6e" stroke-width="3"/>
            <line x1="415" y1="214" x2="530" y2="166" stroke="#ffcf6e" stroke-width="3"/>
            <text x="278" y="90" fill="#ffcf6e" font-size="15">skupna tangenta ⇒ C¹</text>
            <text x="505" y="224" fill="#c69cff" font-size="15">ujemanje ukrivljenosti ⇒ C²</text>
            <text x="58" y="270" fill="#b6c1bc">x₀</text><text x="233" y="270" fill="#b6c1bc">x₁</text><text x="462" y="270" fill="#b6c1bc">x₂</text><text x="684" y="270" fill="#b6c1bc">x₃</text>
            <text x="125" y="45" fill="#8fa099" font-size="14">q₁(x)</text><text x="350" y="45" fill="#8fa099" font-size="14">q₂(x)</text><text x="585" y="45" fill="#8fa099" font-size="14">q₃(x)</text>
          </svg>
        `,
        "Barva se v vozlišču spremeni, funkcija pa ostane ena. C¹ zahteva skupno tangento; C² še skupni drugi odvod."
      )),
      section("formal", "03 / prostor", "Koliko prostostnih stopenj sploh imamo", `
        ${theorem("Definicija in dimenzija prostora zlepkov", `
          <p>Za ${M("m", "m")} podintervalov je</p>
          ${panel(
            "S_n^r(X)=\\{S\\in C^r([x_0,x_m])\\colon S|_{[x_{i-1},x_i]}\\in P_n\\},\\qquad \\dim S_n^r(X)=mn-(m-1)r+1",
            "Sₙʳ(X)={Cʳ-funkcije z lokalnimi kosi iz Pₙ}; dim=mn−(m−1)r+1",
            "prostor zlepkov"
          )}
          <p>Razlaga dimenzije: začnemo z ${M("m(n+1)", "m(n+1)")} koeficienti. V vsakem od ${M("m-1", "m−1")} notranjih vozlišč zahtevamo ujemanje vrednosti in odvodov do reda r, torej ${M("r+1", "r+1")} pogojev.</p>
        `)}
        <div class="notation-grid" style="margin-top:18px">
          <div class="notation-item"><dt>C⁰</dt><dd>${M("q_i(x_i)=q_{i+1}(x_i)", "qᵢ(xᵢ)=qᵢ₊₁(xᵢ)")} — ni skoka, lahko pa je kot.</dd></div>
          <div class="notation-item"><dt>C¹</dt><dd>Poleg vrednosti še ${M("q_i'(x_i)=q_{i+1}'(x_i)", "qᵢ′(xᵢ)=qᵢ₊₁′(xᵢ)")} — skupna tangenta.</dd></div>
          <div class="notation-item"><dt>C²</dt><dd>Poleg prvih dveh še ${M("q_i''(x_i)=q_{i+1}''(x_i)", "qᵢ″(xᵢ)=qᵢ₊₁″(xᵢ)")} — gladka ukrivljenost.</dd></div>
        </div>
      `),
      section("formula", "04 / formule", "Od linearnega kosa do kubičnega C²-zlepka", `
        <h3>Linearni ${M("C^0", "C⁰")} kos</h3>
        ${panel(
          "I_1^0f(x)=f_i+\\frac{f_{i+1}-f_i}{h_i}(x-x_i),\\quad x\\in[x_i,x_{i+1}]",
          "I₁⁰f(x)=fᵢ+(fᵢ₊₁−fᵢ)(x−xᵢ)/hᵢ",
          "linearna interpolacija"
        )}
        <p>Če je ${M("f\\in C^2", "f∈C²")}, potem ${M("\\|f-I_1^0f\\|_{\\infty,[x_i,x_{i+1}]}\\le h_i^2\\|f''\\|_\\infty/8", "‖f−I₁⁰f‖∞≤hᵢ²‖f″‖∞/8")}.</p>

        <h3>Kvadratni ${M("C^1", "C¹")} kos — popravljena formula</h3>
        <p>Za ${M("t=x-x_{i-1}", "t=x−xᵢ₋₁")} in ${M("h=h_{i-1}", "h=hᵢ₋₁")} velja</p>
        ${panel(
          "q_i(x)=f_{i-1}+s_{i-1}t+\\frac{f_i-f_{i-1}-s_{i-1}h}{h^2}t^2,\\qquad s_i=-s_{i-1}+2\\frac{f_i-f_{i-1}}{h}",
          "qᵢ=fᵢ₋₁+sᵢ₋₁t+(fᵢ−fᵢ₋₁−sᵢ₋₁h)t²/h²; sᵢ=−sᵢ₋₁+2(fᵢ−fᵢ₋₁)/h",
          "kvadratni C¹-zlepek",
          "violet"
        )}
        <p><strong>Pazi:</strong> linearni člen je ${M("s_{i-1}(x-x_{i-1})", "sᵢ₋₁(x−xᵢ₋₁)")}. To je popravek v aprilski različici gradiva.</p>

        <h3>Kubični Hermitov kos</h3>
        <p>Naj bo ${M("t=(x-x_i)/h_i", "t=(x−xᵢ)/hᵢ")}. Iz vrednosti ${M("f_i,f_{i+1}", "fᵢ,fᵢ₊₁")} in naklonov ${M("s_i,s_{i+1}", "sᵢ,sᵢ₊₁")} dobimo</p>
        ${panel(
          "H_i=(2t^3-3t^2+1)f_i+(t^3-2t^2+t)h_is_i+(-2t^3+3t^2)f_{i+1}+(t^3-t^2)h_is_{i+1}",
          "Hᵢ=h₀₀(t)fᵢ+h₁₀(t)hᵢsᵢ+h₀₁(t)fᵢ₊₁+h₁₁(t)hᵢsᵢ₊₁",
          "kubična Hermitova oblika"
        )}
        <p>Napaka kosa je ${M("f(x)-H_i(x)=\\frac{f^{(4)}(\\xi_x)}{4!}(x-x_i)^2(x-x_{i+1})^2", "f−Hᵢ=f⁽⁴⁾(ξₓ)(x−xᵢ)²(x−xᵢ₊₁)²/4!")} in zato ${M("\\|f-H_i\\|_\\infty\\le h_i^4\\|f^{(4)}\\|_\\infty/384", "‖f−Hᵢ‖∞≤hᵢ⁴‖f⁽⁴⁾‖∞/384")}.</p>

        <h3>Nakloni za globalni kubični ${M("C^2", "C²")} zlepek</h3>
        ${panel(
          "h_i s_{i-1}+2(h_{i-1}+h_i)s_i+h_{i-1}s_{i+1}=3\\left(h_i\\delta_{i-1}+h_{i-1}\\delta_i\\right),\\quad i=1,\\ldots,m-1",
          "hᵢsᵢ₋₁+2(hᵢ₋₁+hᵢ)sᵢ+hᵢ₋₁sᵢ₊₁=3(hᵢδᵢ₋₁+hᵢ₋₁δᵢ)",
          "tridiagonalni sistem",
          "accent"
        )}
        <p>Notranje enačbe niso dovolj: dodamo še dva robna pogoja, na primer predpisana ${M("s_0,s_m", "s₀,sₘ")} (vpeti oziroma clamped zlepek) ali naravna pogoja ${M("S''(x_0)=S''(x_m)=0", "S″(x₀)=S″(xₘ)=0")}.</p>
        ${sourceNote("str. 13–23", "linearni, kvadratni in kubični zlepki")}
      `),
      section("algorithm", "05 / postopek", "Kako iz podatkov prideš do zlepka", `
        <ol>
          <li><strong>Izberi razred.</strong> Vprašaj se, ali naloga zahteva samo interpolacijo (${M("C^0", "C⁰")}), skupno tangento (${M("C^1", "C¹")}) ali še skupno ukrivljenost (${M("C^2", "C²")}).</li>
          <li><strong>Izračunaj ${M("h_i", "hᵢ")} in ${M("\\delta_i", "δᵢ")}.</strong> Tako se vse poznejše formule skrajšajo in zmanjšaš možnost napačnega indeksa.</li>
          <li><strong>Za kvadratni C¹:</strong> izberi ali dobi ${M("s_0", "s₀")}; na vsakem intervalu sestavi ${M("q_i", "qᵢ")} in nato z rekurzijo izračunaj naslednji naklon.</li>
          <li><strong>Za kubični C²:</strong> sestavi tridiagonalne notranje enačbe, dodaj dva robna pogoja in reši za vse ${M("s_i", "sᵢ")}.</li>
          <li><strong>Sestavi Hermitove kose.</strong> Na i-tem intervalu uporabi samo ${M("f_i,f_{i+1},s_i,s_{i+1}", "fᵢ,fᵢ₊₁,sᵢ,sᵢ₊₁")}.</li>
          <li><strong>Preveri šive.</strong> V vsakem notranjem vozlišču vstavi levi in desni kos ter njune zahtevane odvode.</li>
        </ol>
      `),
      section("example", "06 / lahek primer", "Kvadratni C¹-zlepek od začetka do konca", worked(
        "easy",
        "Tri točke in en začetni naklon",
        `Naj bodo vozlišča ${M("0,1,2", "0,1,2")}, vrednosti ${M("0,1,0", "0,1,0")} in začetni naklon ${M("s_0=1", "s₀=1")}. Sestavi kvadratni ${M("C^1", "C¹")} zlepek.`,
        [
          `Na prvem intervalu je ${M("h_0=1", "h₀=1")} in kvadratni koeficient ${M("(1-0-1\\cdot1)/1^2=0", "(1−0−1·1)/1²=0")}, zato ${M("q_1(x)=x", "q₁(x)=x")}.`,
          `Desni naklon prvega kosa je ${M("s_1=-s_0+2(f_1-f_0)/h_0=-1+2=1", "s₁=−1+2=1")}.`,
          `Na drugem intervalu uvedemo ${M("t=x-1", "t=x−1")}. Kvadratni koeficient je ${M("(0-1-1\\cdot1)/1^2=-2", "−2")}, zato ${M("q_2(x)=1+t-2t^2", "q₂(x)=1+t−2t²")}.`,
          `Vrednosti so pravilne: ${M("q_1(0)=0,\\ q_1(1)=q_2(1)=1,\\ q_2(2)=0", "q₁(0)=0, q₁(1)=q₂(1)=1, q₂(2)=0")}.`,
          `Pri šivu velja ${M("q_1'(1)=1=q_2'(1)", "q₁′(1)=q₂′(1)=1")}; zato je zlepek zares ${M("C^1", "C¹")}.`
        ],
        `<p>${M("S(x)=\\begin{cases}x,&0\\le x\\le1,\\\\1+(x-1)-2(x-1)^2,&1\\le x\\le2.\\end{cases}", "S(x)=x na [0,1], nato 1+(x−1)−2(x−1)² na [1,2]")}.</p>`
      )),
      section("example", "07 / težji primer", "Kubični C²-zlepek s sistemom za naklone", worked(
        "hard",
        "Vpeti zlepek skozi (0,0), (1,1), (2,0)",
        `Naj bo ${M("x=(0,1,2)", "x=(0,1,2)")}, ${M("f=(0,1,0)", "f=(0,1,0)")} in robna naklona ${M("s_0=s_2=0", "s₀=s₂=0")}. Poišči kubični ${M("C^2", "C²")} zlepek.`,
        [
          `Imamo ${M("h_0=h_1=1", "h₀=h₁=1")}, ${M("\\delta_0=1", "δ₀=1")} in ${M("\\delta_1=-1", "δ₁=−1")}.`,
          `Edina notranja enačba je ${M("s_0+4s_1+s_2=3(\\delta_0+\\delta_1)=0", "s₀+4s₁+s₂=3(δ₀+δ₁)=0")}. Z robnima pogojema sledi ${M("s_1=0", "s₁=0")}.`,
          `Hermitov kos na ${M("[0,1]", "[0,1]")} z vrednostma 0,1 in ničelnima naklonoma je ${M("H_1(x)=3x^2-2x^3", "H₁(x)=3x²−2x³")}.`,
          `Na ${M("[1,2]", "[1,2]")} postavimo ${M("t=x-1", "t=x−1")} in dobimo ${M("H_2(x)=1-3t^2+2t^3", "H₂(x)=1−3t²+2t³")}.`,
          `V šivu sta vrednost in prvi odvod enaka; za drugi odvod ${M("H_1''(1)=-6=H_2''(1)", "H₁″(1)=H₂″(1)=−6")}. Zato je zlepek ${M("C^2", "C²")}.`
        ],
        `<p>${M("S(x)=\\begin{cases}3x^2-2x^3,&0\\le x\\le1,\\\\1-3(x-1)^2+2(x-1)^3,&1\\le x\\le2.\\end{cases}", "S=3x²−2x³ na [0,1], nato 1−3(x−1)²+2(x−1)³")}.</p><p>Tridiagonalni sistem je način, kako lokalne Hermitove kose prisilimo v globalno ${M("C^2", "C²")} gladkost.</p>`
      )),
      section("proof", "08 / cel dokaz", "Res strog dokaz napake kubične Hermitove interpolacije", proof({
        idea: "Pomožna funkcija ima v obeh krajiščih dvojni ničli, ker se ujemata vrednost in prvi odvod, ter še ničlo v opazovani točki. Pet ničel z večkratnostjo prisili četrti odvod, da nekje izgine.",
        steps: [
          {
            title: "Robni primer in oznake",
            body: `Naj bo ${M("H", "H")} kubični Hermitov interpolant funkcije f na ${M("[a,b]", "[a,b]")}. Če je ${M("x=a", "x=a")} ali ${M("x=b", "x=b")}, je formula očitna. Zato naj bo ${M("a<x<b", "a<x<b")}.`,
            reason: "V krajiščih je razlika f−H nič in produkt (x−a)²(x−b)² prav tako."
          },
          {
            title: "Izberemo konstanto K",
            body: panel(
              "K=\\frac{f(x)-H(x)}{(x-a)^2(x-b)^2},\\qquad g(t)=f(t)-H(t)-K(t-a)^2(t-b)^2",
              "K=(f(x)−H(x))/((x−a)²(x−b)²), g=f−H−K(t−a)²(t−b)²",
              "pomožna funkcija"
            ),
            reason: "Ker je x v notranjosti, imenovalec ni nič; izbira zagotovi g(x)=0."
          },
          {
            title: "Krajišči sta dvojni ničli",
            body: `Hermitovi pogoji dajo ${M("g(a)=g(b)=0", "g(a)=g(b)=0")}. Tudi ${M("g'(a)=g'(b)=0", "g′(a)=g′(b)=0")}, ker se f′ in H′ ujemata, odvod produkta z dvojnima faktorjema pa v ustreznem krajišču izgine.`,
            reason: "Zato a in b ne štejeta le kot navadni, ampak kot dvojni ničli."
          },
          {
            title: "Rolle brez bližnjice",
            body: `Iz ${M("g(a)=g(x)=g(b)=0", "g(a)=g(x)=g(b)=0")} dobimo dve notranji ničli g′, eno v ${M("(a,x)", "(a,x)")} in eno v ${M("(x,b)", "(x,b)")}. Skupaj z ${M("g'(a)=g'(b)=0", "g′(a)=g′(b)=0")} ima g′ štiri ničle. Zato ima g″ tri, g‴ dve in ${M("g^{(4)}", "g⁽⁴⁾")} vsaj eno ničlo ${M("\\xi_x\\in(a,b)", "ξₓ∈(a,b)")}.`,
            reason: "To je štirikratna uporaba navadnega Rolleovega izreka; s tem je štetje večkratnosti popolnoma upravičeno."
          },
          {
            title: "Četrti odvod določi K",
            body: `Ker je H kubičen, ${M("H^{(4)}=0", "H⁽⁴⁾=0")}. Polinom ${M("(t-a)^2(t-b)^2", "(t−a)²(t−b)²")} je moničen stopnje 4, zato je njegov četrti odvod ${M("4!", "4!")} in iz ${M("g^{(4)}(\\xi_x)=0", "g⁽⁴⁾(ξₓ)=0")} sledi ${M("K=f^{(4)}(\\xi_x)/4!", "K=f⁽⁴⁾(ξₓ)/4!")}.`,
            reason: "Po štirih odvodih vsi nižji členi produkta izginejo; vodilni t⁴ prispeva 4!."
          },
          {
            title: "Formula in konstanta 1/384",
            body: `${panel(
              "f(x)-H(x)=\\frac{f^{(4)}(\\xi_x)}{4!}(x-a)^2(x-b)^2",
              "f(x)−H(x)=f⁽⁴⁾(ξₓ)(x−a)²(x−b)²/4!",
              "Hermitova napaka",
              "accent"
            )}<p>Za ${M("h=b-a", "h=b−a")} je ${M("(x-a)(b-x)\\le h^2/4", "(x−a)(b−x)≤h²/4")}; po kvadriranju in deljenju s ${M("4!=24", "4!=24")} dobimo faktor ${M("h^4/(16\\cdot24)=h^4/384", "h⁴/384")}.</p>`,
            reason: "Produkt dveh nenegativnih števil z vsoto h je največji, ko sta oba h/2."
          }
        ],
        conclusion: "Dokazana formula velja točkovno za neko ξₓ; po maksimumu četrtega odvoda dobimo enakomerno oceno. Konstanta 1/384 torej ni formula na pamet, ampak posledica dvojnih ničel in maksimuma produkta.",
        source: "izrek o napaki Hermitove interpolacije na str. 19–20; dokaz je tukaj dopolnjen"
      })),
      section("warning", "09 / pogoste napake", "Indeksi in gladkost, ki največkrat odnesejo točke", `
        <ul>
          <li><strong>Lokalna spremenljivka:</strong> na intervalu ${M("[x_{i-1},x_i]", "[xᵢ₋₁,xᵢ]")} je v kvadratni formuli ${M("x-x_{i-1}", "x−xᵢ₋₁")}, ne x in ne ${M("x-x_i", "x−xᵢ")}.</li>
          <li><strong>C⁰, C¹ in C²:</strong> interpolacija vrednosti sama da samo C⁰; skupna tangenta še ne zagotavlja skupnega drugega odvoda.</li>
          <li><strong>En podatek manjka:</strong> kvadratni C¹-zlepek potrebuje en robni naklon; kubični C²-zlepek potrebuje dva robna pogoja.</li>
          <li><strong>Hermitov odvod se meri po x:</strong> pri normiranem parametru t morata člena ob naklonih vsebovati faktor ${M("h_i", "hᵢ")}.</li>
          <li><strong>Ocena ni enačaj:</strong> ${M("h^4\\|f^{(4)}\\|_\\infty/384", "h⁴‖f⁽⁴⁾‖∞/384")} je zagotovljena zgornja meja, ne nujno dejanska napaka.</li>
        </ul>
      `),
      section("recap", "10 / 30 sekund", "En odgovor za vse tri stopnje", `
        <p><strong>Ideja:</strong> na vsakem podintervalu uporabim nizek polinom, v vozliščih pa zlepim zahtevane odvode.</p>
        <p><strong>Linearni C⁰:</strong> samo poveže podatke; lokalna napaka je reda ${M("h^2", "h²")}.</p>
        <p><strong>Kvadratni C¹:</strong> iz enega začetnega naklona rekurzivno dobim vse naslednje.</p>
        <p><strong>Kubični C²:</strong> Hermitove kose določijo vrednosti in nakloni; naklone izračunam s tridiagonalnim sistemom ter dvema robnima pogojema. Hermitova napaka je reda ${M("h^4", "h⁴")} z ostro konstanto ${M("1/384", "1/384")}.</p>
      `)
    ]
  });

  topics.push({
    id: "bezier",
    number: 5,
    title: "Bézierjeve krivulje in de Casteljau",
    short: "Kontrolne točke določijo krivuljo v Bernsteinovi bazi; de Casteljau jo stabilno vrednoti, konveksna ovojnica pa daje enosmeren certifikat varnosti.",
    accent: "#ff7ea8",
    minutes: 25,
    oral: ["Bernsteinova oblika", "de Casteljau", "konveksna ovojnica", "odvodi v krajiščih", "kolizija"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 24–34" }, EXAM_JUNE],
    sections: [
      section("notation", "00 / legenda", "Krivulja je vektorski polinom, ne množica daljic", notation(
        "Kontrolne točke so koeficienti v Bernsteinovi bazi. Kontrolni poligon pomaga videti obliko, vendar praviloma ni sama krivulja.",
        [
          { tex: "\\mathbf b(t)", symbol: "b(t)", name: "Bézierjeva krivulja", meaning: " — vektorska funkcija parametra t∈[0,1]." },
          { tex: "\\mathbf b_0,\\ldots,\\mathbf b_n", symbol: "b₀,…,bₙ", name: "kontrolne točke", meaning: " — točke v ℝ² ali ℝ³, ki določijo krivuljo stopnje n." },
          { tex: "B_i^n(t)", symbol: "Bᵢⁿ(t)", name: "Bernsteinov bazni polinom", meaning: " — nenegativna utež i-te kontrolne točke." },
          { tex: "\\operatorname{conv}\\{\\mathbf b_i\\}", symbol: "conv{bᵢ}", name: "konveksna ovojnica", meaning: " — najmanjša konveksna množica, ki vsebuje vse kontrolne točke." },
          { tex: "\\mathbf b_i^{(r)}(t)", symbol: "bᵢ⁽ʳ⁾(t)", name: "de Casteljaujeva točka", meaning: " — i-ta točka na r-tem nivoju interpolacije." },
          { tex: "\\Delta\\mathbf b_i=\\mathbf b_{i+1}-\\mathbf b_i", symbol: "Δbᵢ", name: "prva diferenca", meaning: " — rob kontrolnega poligona; določa tangentne smeri." },
          { tex: "\\Delta^r\\mathbf b_i", symbol: "Δʳbᵢ", name: "višja diferenca", meaning: " — večkrat ponovljena diferenca, ki določa višje odvode." },
          { tex: "\\mathcal O", symbol: "𝒪", name: "ovira", meaning: " — množica prostora, s katero ne želimo, da se tir seka." }
        ]
      )),
      section("plain", "01 / povej na glas", "Kako razložiš Bézierjevo krivuljo brez naštevanja", `
        <p><strong>»Bézierjeva krivulja stopnje n je vektorski polinom v Bernsteinovi bazi: vsako kontrolno točko pomnožim z nenegativno utežjo, vse uteži pa se seštejejo v ena. Zato je vsaka točka krivulje konveksna kombinacija kontrolnih točk in krivulja leži v njihovi konveksni ovojnici.«</strong></p>
        <p>»Krivulja gre skozi prvo in zadnjo kontrolno točko. Začetna tangenta ima smer ${M("\\mathbf b_1-\\mathbf b_0", "b₁−b₀")}, končna pa ${M("\\mathbf b_n-\\mathbf b_{n-1}", "bₙ−bₙ₋₁")}; dolžino odvoda pomnoži še stopnja n.«</p>
        <p>»Za vrednotenje uporabim de Casteljaujev algoritem: s parametrom t zaporedno linearno interpoliram sosednje točke, dokler ne ostane ena. Postopek je numerično stabilen, hkrati pa da konstrukcijo za razdelitev krivulje.«</p>
      `),
      section("visual", "02 / slika", "Kontrolni poligon, ovojnica in de Casteljaujev rez", visual(
        "Rožnata Bézierjeva krivulja leži v vijolični konveksni ovojnici, črtkani kontrolni poligon pa povezuje štiri kontrolne točke.",
        `
          <svg viewBox="0 0 760 360" role="img" aria-label="Kubična Bézierjeva krivulja z de Casteljaujevo konstrukcijo" style="width:100%;height:auto">
            <rect width="760" height="360" rx="18" fill="#0a100d"/>
            <polygon points="82,282 224,55 560,78 690,278" fill="#c69cff" fill-opacity=".10" stroke="#c69cff" stroke-width="2"/>
            <polyline points="82,282 224,55 560,78 690,278" fill="none" stroke="#83928b" stroke-width="3" stroke-dasharray="8 8"/>
            <path d="M82 282 C224 55 560 78 690 278" fill="none" stroke="#ff7ea8" stroke-width="7"/>
            <g fill="#f4f7f5" stroke="#0a100d" stroke-width="4">
              <circle cx="82" cy="282" r="9"/><circle cx="224" cy="55" r="9"/><circle cx="560" cy="78" r="9"/><circle cx="690" cy="278" r="9"/>
            </g>
            <text x="54" y="315" fill="#d5ddd9">b₀</text><text x="205" y="38" fill="#d5ddd9">b₁</text><text x="550" y="55" fill="#d5ddd9">b₂</text><text x="696" y="304" fill="#d5ddd9">b₃</text>
            <g stroke="#65e0c2" stroke-width="3">
              <line x1="146" y1="180" x2="375" y2="65"/><line x1="375" y1="65" x2="619" y2="168"/>
            </g>
            <g fill="#65e0c2"><circle cx="146" cy="180" r="6"/><circle cx="375" cy="65" r="6"/><circle cx="619" cy="168" r="6"/></g>
            <line x1="249" y1="128" x2="485" y2="111" stroke="#ffcf6e" stroke-width="4"/>
            <circle cx="249" cy="128" r="6" fill="#ffcf6e"/><circle cx="485" cy="111" r="6" fill="#ffcf6e"/>
            <circle cx="355" cy="120" r="10" fill="#c8ff3d" stroke="#0a100d" stroke-width="4"/>
            <text x="370" y="145" fill="#c8ff3d" font-size="15">b(t)</text>
            <text x="42" y="34" fill="#a6b4ad" font-size="14">vsak nivo = linearna interpolacija sosedov</text>
          </svg>
        `,
        "Končna zelena točka nastane iz treh nivojev linearnih interpolacij. Vsi vmesni poligoni ostanejo v prvotni konveksni ovojnici."
      )),
      section("formal", "03 / matematični zapis", "Definicija in lastnosti, ki jih moraš znati izpeljati", `
        ${theorem("Bernsteinova oblika Bézierjeve krivulje", `
          ${panel(
            "\\mathbf b(t)=\\sum_{i=0}^{n}\\mathbf b_i B_i^n(t),\\qquad B_i^n(t)=\\binom ni(1-t)^{n-i}t^i,\\qquad 0\\le t\\le1",
            "b(t)=Σᵢ₌₀ⁿ bᵢ Bᵢⁿ(t), Bᵢⁿ=C(n,i)(1−t)ⁿ⁻ⁱtⁱ",
            "Bézierjeva krivulja"
          )}
          <p>Ker je ${M("B_i^n(t)\\ge0", "Bᵢⁿ(t)≥0")} in ${M("\\sum_iB_i^n(t)=1", "ΣᵢBᵢⁿ(t)=1")}, velja</p>
          ${panel(
            "\\mathbf b([0,1])\\subseteq\\operatorname{conv}\\{\\mathbf b_0,\\ldots,\\mathbf b_n\\}",
            "b([0,1]) ⊆ conv{b₀,…,bₙ}",
            "lastnost konveksne ovojnice",
            "accent"
          )}
        `)}
        <h3>Odvodi in tangentni vektorji</h3>
        ${panel(
          "\\mathbf b'(t)=n\\sum_{i=0}^{n-1}(\\mathbf b_{i+1}-\\mathbf b_i)B_i^{n-1}(t)",
          "b′(t)=nΣᵢ₌₀ⁿ⁻¹(bᵢ₊₁−bᵢ)Bᵢⁿ⁻¹(t)",
          "odvodna krivulja"
        )}
        ${panel(
          "\\mathbf b^{(r)}(0)=\\frac{n!}{(n-r)!}\\Delta^r\\mathbf b_0,\\qquad \\mathbf b^{(r)}(1)=\\frac{n!}{(n-r)!}\\Delta^r\\mathbf b_{n-r}",
          "b⁽ʳ⁾(0)=n!/(n−r)! Δʳb₀; b⁽ʳ⁾(1)=n!/(n−r)! Δʳbₙ₋ᵣ",
          "krajiščni odvodi"
        )}
        <p>Posebej: ${M("\\mathbf b'(0)=n(\\mathbf b_1-\\mathbf b_0)", "b′(0)=n(b₁−b₀)")} in ${M("\\mathbf b'(1)=n(\\mathbf b_n-\\mathbf b_{n-1})", "b′(1)=n(bₙ−bₙ₋₁)")}.</p>

        <h3>Afina invariantnost in zvišanje stopnje</h3>
        <p>Za afino preslikavo ${M("A(\\mathbf x)=M\\mathbf x+\\mathbf c", "A(x)=Mx+c")} velja ${M("A(\\mathbf b(t))=\\sum A(\\mathbf b_i)B_i^n(t)", "A(b(t))=ΣA(bᵢ)Bᵢⁿ(t)")}. Krivuljo stopnje n lahko brez spremembe oblike zapišemo s stopnjo n+1:</p>
        ${panel(
          "\\widetilde{\\mathbf b}_0=\\mathbf b_0,\\quad \\widetilde{\\mathbf b}_{n+1}=\\mathbf b_n,\\quad \\widetilde{\\mathbf b}_i=\\frac{i}{n+1}\\mathbf b_{i-1}+\\left(1-\\frac{i}{n+1}\\right)\\mathbf b_i",
          "b̃₀=b₀, b̃ₙ₊₁=bₙ, b̃ᵢ=i bᵢ₋₁/(n+1)+(1−i/(n+1))bᵢ",
          "zvišanje stopnje"
        )}
        ${sourceNote("str. 24–34", "definicija, lastnosti, odvodi in de Casteljau")}
      `),
      section("algorithm", "04 / algoritem", "De Casteljaujeva trikotna shema", `
        <p>Za izbrani parameter ${M("t", "t")} postavi ${M("\\mathbf b_i^{(0)}=\\mathbf b_i", "bᵢ⁽⁰⁾=bᵢ")} in računaj</p>
        ${panel(
          "\\mathbf b_i^{(r)}(t)=(1-t)\\mathbf b_i^{(r-1)}(t)+t\\mathbf b_{i+1}^{(r-1)}(t),\\quad r=1,\\ldots,n,\\quad i=0,\\ldots,n-r",
          "bᵢ⁽ʳ⁾=(1−t)bᵢ⁽ʳ⁻¹⁾+t bᵢ₊₁⁽ʳ⁻¹⁾",
          "de Casteljau"
        )}
        <ol>
          <li>V ničti vrstici napiši vseh ${M("n+1", "n+1")} kontrolnih točk.</li>
          <li>V naslednji vrstici vsako sosednjo dvojico interpoliraj z istim t: delež ${M("1-t", "1−t")} leve in delež t desne točke.</li>
          <li>Ponavljaj; vsaka vrstica je za eno točko krajša.</li>
          <li>Edina točka v n-ti vrstici je ${M("\\mathbf b_0^{(n)}(t)=\\mathbf b(t)", "b₀⁽ⁿ⁾(t)=b(t)")}.</li>
          <li>Levi rob trikotnika so kontrolne točke leve podkrivulje, desni rob v obratnem vrstnem redu pa desne podkrivulje.</li>
        </ol>
      `),
      section("example", "05 / lahek primer", "De Casteljau z vsemi koordinatami", worked(
        "easy",
        "Kvadratna krivulja pri t=1/2",
        `Naj bodo ${M("\\mathbf b_0=(0,0),\\mathbf b_1=(2,2),\\mathbf b_2=(4,0)", "b₀=(0,0), b₁=(2,2), b₂=(4,0)")}. Izračunaj ${M("\\mathbf b(1/2)", "b(1/2)")}.`,
        [
          `Ničti nivo so kontrolne točke: ${M("\\mathbf b_0^{(0)}=(0,0),\\mathbf b_1^{(0)}=(2,2),\\mathbf b_2^{(0)}=(4,0)", "b₀⁽⁰⁾=(0,0), b₁⁽⁰⁾=(2,2), b₂⁽⁰⁾=(4,0)")}.`,
          `Prvi nivo: ${M("\\mathbf b_0^{(1)}=\\frac12(0,0)+\\frac12(2,2)=(1,1)", "b₀⁽¹⁾=(1,1)")}.`,
          `Druga točka prvega nivoja je ${M("\\mathbf b_1^{(1)}=\\frac12(2,2)+\\frac12(4,0)=(3,1)", "b₁⁽¹⁾=(3,1)")}.`,
          `Končni nivo: ${M("\\mathbf b_0^{(2)}=\\frac12(1,1)+\\frac12(3,1)=(2,1)", "b₀⁽²⁾=(2,1)")}.`,
          `Kontrola z neposredno formulo: ${M("\\frac14(0,0)+\\frac12(2,2)+\\frac14(4,0)=(2,1)", "¼b₀+½b₁+¼b₂=(2,1)")}.`
        ],
        `<p>${M("\\mathbf b(1/2)=(2,1)", "b(1/2)=(2,1)")}. Koeficienti 1/4, 1/2 in 1/4 so nenegativni in seštejejo ena, zato je točka v trikotniku kontrolnih točk.</p>`
      )),
      section("example", "06 / zadnji izpit", "Robot, vrednotenje, gladkost in kolizija", worked(
        "hard",
        "Naloga z izpita 19. 6. 2026",
        `Kubični tir ima kontrolne točke ${M("(-2,0),(-1,2),(1,2),(0,0)", "(−2,0),(−1,2),(1,2),(0,0)")}, kvadratni pa ${M("(0,0),(-1,-2),(3,0)", "(0,0),(−1,−2),(3,0)")}. Ovira je krog s središčem ${M("(1,1/2)", "(1,1/2)")} in polmerom ${M("1/3", "1/3")}.`,
        [
          `Za kubično krivuljo pri ${M("t=3/4", "t=3/4")} je prvi nivo ${M("(-5/4,3/2),\\ (1/2,2),\\ (1/4,1/2)", "(−5/4,3/2), (1/2,2), (1/4,1/2)")}.`,
          `Drugi nivo je ${M("(1/16,15/8),\\ (5/16,7/8)", "(1/16,15/8), (5/16,7/8)")}, zato je ${M("\\mathbf b(3/4)=(1/4,9/8)", "b(3/4)=(1/4,9/8)")}.`,
          `Vse kubične kontrolne točke zadoščajo ${M("y-2x\\ge0", "y−2x≥0")}, zato je tam tudi njihova ovojnica. Na krogu pa je največ ${M("y-2x=-\\frac32+\\frac{\\sqrt5}{3}<0", "max(y−2x)=−3/2+√5/3<0")}. Množici sta ločeni.`,
          `Kvadratna ovojnica leži v ${M("y\\le0", "y≤0")}, krog pa v ${M("y\\ge1/6", "y≥1/6")}; tudi tu je presek prazen.`,
          `Krivulji se stikata v ${M("(0,0)", "(0,0)")}. Lokalna odvoda sta ${M("3(\\mathbf b_3-\\mathbf b_2)=(-3,-6)", "3(b₃−b₂)=(−3,−6)")} in ${M("2(\\mathbf c_1-\\mathbf c_0)=(-2,-4)", "2(c₁−c₀)=(−2,−4)")}.`,
          `Odvoda sta pozitivna skalarna večkratnika, vendar nista enaka. Pri enako dolgih globalnih parameter­skih intervalih je spoj ${M("G^1", "G¹")}, ne ${M("C^1", "C¹")}; smer je gladka, hitrost skoči.`
        ],
        `<p>${M("\\mathbf b(3/4)=(1/4,9/8)", "b(3/4)=(1/4,9/8)")} in obe krivulji sta zaradi praznega preseka svojih konveksnih ovojnic z oviro varni.</p><p><strong>Logika je enosmerna:</strong> prazen presek ovojnice in ovire dokaže odsotnost kolizije; neprazen presek ne dokaže ne kolizije ne varnosti.</p>`
      )),
      section("theorem", "07 / certifikat", "Natančna logika konveksne ovojnice", `
        ${panel(
          "\\operatorname{conv}\\{\\mathbf b_0,\\ldots,\\mathbf b_n\\}\\cap\\mathcal O=\\varnothing\\quad\\Longrightarrow\\quad \\mathbf b([0,1])\\cap\\mathcal O=\\varnothing",
          "conv{b₀,…,bₙ} ∩ 𝒪 = ∅  ⇒  b([0,1]) ∩ 𝒪 = ∅",
          "zadosten pogoj za varnost",
          "accent"
        )}
        <p>Razlog je vključitev ${M("\\mathbf b([0,1])\\subseteq\\operatorname{conv}\\{\\mathbf b_i\\}", "b([0,1])⊆conv{bᵢ}")}. Če je večja množica ločena od ovire, je ločena tudi krivulja.</p>
        <div class="theorem-card" data-name="Kaj pomeni prekrivanje?">
          <p><strong>Če ${M("\\operatorname{conv}\\{\\mathbf b_i\\}\\cap\\mathcal O\\ne\\varnothing", "conv{bᵢ}∩𝒪≠∅")}, ne moremo sklepati ničesar.</strong> Krivulja lahko oviro zadene ali pa jo znotraj ovojnice obide. Takrat razdelimo krivuljo z de Casteljaujem, dobimo manjši ovojnici in test ponovimo; za dokaz kolizije moramo najti dejansko skupno točko.</p>
        </div>
      `),
      section("proof", "08 / cel dokaz", "Zakaj de Casteljau vrne prav Bézierjevo krivuljo", proof({
        idea: "Vsaka de Casteljaujeva točka je Bernsteinova kombinacija zaporednega bloka kontrolnih točk. Indukcija in Pascalova identiteta pokažeta, da se na zadnjem nivoju pojavijo natanko koeficienti Bᵢⁿ.",
        steps: [
          {
            title: "Trditev za poljuben nivo",
            body: panel(
              "\\mathbf b_i^{(r)}(t)=\\sum_{j=0}^{r}\\binom rj(1-t)^{r-j}t^j\\mathbf b_{i+j}",
              "bᵢ⁽ʳ⁾(t)=Σⱼ₌₀ʳ C(r,j)(1−t)ʳ⁻ʲtʲ bᵢ₊ⱼ",
              "indukcijska trditev"
            ),
            reason: "Za r=n in i=0 je desna stran natanko definicija Bézierjeve krivulje."
          },
          {
            title: "Osnovni nivo",
            body: `Pri ${M("r=0", "r=0")} je vsota samo ${M("\\binom00(1-t)^0t^0\\mathbf b_i=\\mathbf b_i", "C(0,0)bᵢ=bᵢ")}, kar je definicija ${M("\\mathbf b_i^{(0)}", "bᵢ⁽⁰⁾")}.`,
            reason: "S tem je indukcija zasidrana brez dodatne predpostavke."
          },
          {
            title: "Vstavimo indukcijsko predpostavko",
            body: `Predpostavimo formulo za r−1. Iz rekurzije ${M("\\mathbf b_i^{(r)}=(1-t)\\mathbf b_i^{(r-1)}+t\\mathbf b_{i+1}^{(r-1)}", "bᵢ⁽ʳ⁾=(1−t)bᵢ⁽ʳ⁻¹⁾+tbᵢ₊₁⁽ʳ⁻¹⁾")} dobimo dve vsoti: prva vsebuje točke ${M("\\mathbf b_i,\\ldots,\\mathbf b_{i+r-1}", "bᵢ,…,bᵢ₊ᵣ₋₁")}, druga pa ${M("\\mathbf b_{i+1},\\ldots,\\mathbf b_{i+r}", "bᵢ₊₁,…,bᵢ₊ᵣ")}.`,
            reason: "Množenje prve vsote z 1−t poveča eksponent 1−t, množenje druge s t pa eksponent t."
          },
          {
            title: "Združimo koeficiente iste točke",
            body: `Za notranjo točko ${M("\\mathbf b_{i+j}", "bᵢ₊ⱼ")} je skupni koeficient ${M("\\left[\\binom{r-1}{j}+\\binom{r-1}{j-1}\\right](1-t)^{r-j}t^j", "[C(r−1,j)+C(r−1,j−1)](1−t)ʳ⁻ʲtʲ")}.`,
            reason: "Po Pascalovi identiteti je izraz v oglatem oklepaju C(r,j); robna člena ustrezata C(r,0)=C(r,r)=1."
          },
          {
            title: "Zaključek indukcije",
            body: `Tako formula velja za r. Pri ${M("r=n,i=0", "r=n, i=0")} dobimo ${M("\\mathbf b_0^{(n)}(t)=\\sum_{j=0}^n\\mathbf b_jB_j^n(t)=\\mathbf b(t)", "b₀⁽ⁿ⁾(t)=ΣbⱼBⱼⁿ(t)=b(t)")}.`,
            reason: "Edina preostala točka algoritma je zato natanko vrednost prvotne Bézierjeve krivulje."
          },
          {
            title: "Ovojnica sledi kot posledica",
            body: `Koeficienti ${M("\\binom nj(1-t)^{n-j}t^j", "C(n,j)(1−t)ⁿ⁻ʲtʲ")} so za ${M("0\\le t\\le1", "0≤t≤1")} nenegativni, po binomskem izreku pa seštejejo ${M("((1-t)+t)^n=1", "((1−t)+t)ⁿ=1")}.`,
            reason: "Zato je b(t) konveksna kombinacija kontrolnih točk in leži v njihovi konveksni ovojnici."
          }
        ],
        conclusion: "De Casteljau ni približek in ni druga krivulja: v eksaktni aritmetiki izračuna isto Bernsteinovo vsoto, vendar samo z zaporednimi linearnimi interpolacijami.",
        source: "algoritem in trditev na str. 29–31; indukcijski dokaz je tukaj izpisan v celoti"
      })),
      section("warning", "09 / pogoste napake", "Bézierjeve pasti na enem mestu", `
        <ul>
          <li><strong>Kontrolni poligon ni krivulja:</strong> krivulja praviloma ne gre skozi notranje kontrolne točke.</li>
          <li><strong>Eksponenta v bazi:</strong> pri ${M("B_i^n", "Bᵢⁿ")} je ${M("(1-t)^{n-i}t^i", "(1−t)ⁿ⁻ⁱtⁱ")}; ne zamenjaj i in n−i.</li>
          <li><strong>Odvod vsebuje stopnjo:</strong> tangenta ni le ${M("\\mathbf b_1-\\mathbf b_0", "b₁−b₀")}, ampak ${M("n(\\mathbf b_1-\\mathbf b_0)", "n(b₁−b₀)")}.</li>
          <li><strong>Presek ovojnice z oviro:</strong> prekrivanje <em>ne dokazuje</em> kolizije in tudi <em>ne dokazuje</em> varnosti. Samo prazen presek je certifikat brez kolizije.</li>
          <li><strong>G¹ ni C¹:</strong> ista smer tangent pomeni G¹; za C¹ morata biti globalna odvoda enaka tudi po velikosti.</li>
          <li><strong>Parameter:</strong> t mora biti v [0,1]. Če je krivulja postavljena na drug globalni interval, odvode spremeni verižno pravilo.</li>
        </ul>
      `),
      section("recap", "10 / 30 sekund", "Celotna tema v štirih stavkih", `
        <p><strong>Definicija:</strong> ${M("\\mathbf b(t)=\\sum\\mathbf b_iB_i^n(t)", "b(t)=ΣbᵢBᵢⁿ(t)")} je vektorski polinom v Bernsteinovi bazi.</p>
        <p><strong>Geometrija:</strong> gre skozi b₀ in bₙ, krajiščni tangenti sledita prvemu in zadnjemu robu kontrolnega poligona, celotna krivulja pa je v konveksni ovojnici.</p>
        <p><strong>Račun:</strong> de Casteljau zaporedno interpolira sosednje točke in na zadnjem nivoju vrne b(t).</p>
        <p><strong>Kolizija:</strong> ${M("\\operatorname{conv}\\{\\mathbf b_i\\}\\cap\\mathcal O=\\varnothing", "conv{bᵢ}∩𝒪=∅")} zagotovi varnost; neprazen presek ovojnice ne da zaključka.</p>
      `)
    ]
  });

  topics.push({
    id: "bezier-zlepki",
    number: 6,
    title: "Zlepljanje Bézierjevih krivulj: C⁰, C¹, C² in G¹",
    short: "Pogoje v stiku izpeljemo iz krajiščnih diferenc, stopnje krivulje in verižnega pravila za dejanski globalni parameter.",
    accent: "#c8ff3d",
    minutes: 24,
    oral: ["C⁰/C¹/C² spoj", "različni stopnji", "reparametrizacija", "G¹ proti C¹"],
    pdfs: [{ ...APRIL, name: "Gradivo · str. 34–43" }, EXAM_JULY],
    sections: [
      section("notation", "00 / legenda", "Najprej loči lokalna parametra od globalnega", notation(
        "Največ napak nastane zato, ker se lokalna odvoda po t in s zamenjata z odvodom celotne poti po globalnem parametru u.",
        [
          { tex: "\\mathbf b(t),\\ t\\in[0,1]", symbol: "b(t)", name: "levi Bézierjev kos", meaning: " — stopnje n s kontrolnimi točkami b₀,…,bₙ." },
          { tex: "\\mathbf c(s),\\ s\\in[0,1]", symbol: "c(s)", name: "desni Bézierjev kos", meaning: " — stopnje m s kontrolnimi točkami c₀,…,cₘ." },
          { tex: "u", symbol: "u", name: "globalni parameter", meaning: " — parameter cele sestavljene poti." },
          { tex: "h_b=u_1-u_0", symbol: "h_b", name: "dolžina levega parametrskega intervala", meaning: " — ne geometrijska dolžina krivulje." },
          { tex: "h_c=u_2-u_1", symbol: "h_c", name: "dolžina desnega parametrskega intervala", meaning: " — določa hitrost reparametrizacije." },
          { tex: "t=(u-u_0)/h_b", symbol: "t", name: "levi lokalni parameter", meaning: " — u∈[u₀,u₁] preslika na [0,1]." },
          { tex: "s=(u-u_1)/h_c", symbol: "s", name: "desni lokalni parameter", meaning: " — u∈[u₁,u₂] preslika na [0,1]." },
          { tex: "\\Delta^j\\mathbf b_i", symbol: "Δʲbᵢ", name: "j-ta naprej diferenca", meaning: " — kombinacija j+1 sosednjih kontrolnih točk." },
          { tex: "C^k", symbol: "Cᵏ", name: "parametrična gladkost", meaning: " — globalni odvodi po u do reda k so enaki." },
          { tex: "G^1", symbol: "G¹", name: "geometrijska gladkost", meaning: " — tangentni smeri se ujemata, velikosti hitrosti pa se lahko razlikujeta." }
        ]
      )),
      section("plain", "01 / povej na glas", "Odgovor, ki takoj izpostavi bistvo", `
        <p><strong>»Dve Bézierjevi krivulji najprej zlepim po položaju: zadnja kontrolna točka leve mora biti prva kontrolna točka desne. Za ${M("C^1", "C¹")} morata biti enaka globalna tangentna vektorja, ne samo zadnja in prva stranica kontrolnih poligonov.«</strong></p>
        <p>»Lokalni krajiščni odvod leve krivulje je ${M("n(\\mathbf b_n-\\mathbf b_{n-1})", "n(bₙ−bₙ₋₁)")}, desne pa ${M("m(\\mathbf c_1-\\mathbf c_0)", "m(c₁−c₀)")}. Če kosa zasedata intervala dolžin ${M("h_b", "h_b")} in ${M("h_c", "h_c")}, moram po verižnem pravilu prvega deliti s ${M("h_b", "h_b")}, drugega pa s ${M("h_c", "h_c")}.«</p>
        <p>»Za ${M("C^2", "C²")} enako primerjam še skalirani drugi diferenci. Pri ${M("G^1", "G¹")} pa zahtevam samo isti položaj in isto usmerjeno tangentno premico; pozitivni skalarni faktor je dovoljen.«</p>
      `),
      section("visual", "02 / slika", "Lokalno enaki puščici še nista nujno globalno enaki", visual(
        "Dva Bézierjeva kosa na globalnih intervalih različnih dolžin se stikata z enako globalno tangentno puščico.",
        `
          <svg viewBox="0 0 760 345" role="img" aria-label="Zlepljanje dveh Bézierjevih krivulj z različnima parametrskima intervaloma" style="width:100%;height:auto">
            <rect width="760" height="345" rx="18" fill="#0a100d"/>
            <line x1="55" y1="292" x2="708" y2="292" stroke="#52615b" stroke-width="2"/>
            <path d="M70 242 C145 58 238 72 365 170" fill="none" stroke="#ff7ea8" stroke-width="7"/>
            <path d="M365 170 C535 302 604 94 696 75" fill="none" stroke="#70a8ff" stroke-width="7"/>
            <polyline points="70,242 155,40 270,92 365,170" fill="none" stroke="#927184" stroke-width="2" stroke-dasharray="7 7"/>
            <polyline points="365,170 555,317 696,75" fill="none" stroke="#667f9f" stroke-width="2" stroke-dasharray="7 7"/>
            <g fill="#f5f7f6">
              <circle cx="70" cy="242" r="6"/><circle cx="155" cy="40" r="6"/><circle cx="270" cy="92" r="6"/><circle cx="365" cy="170" r="9"/>
              <circle cx="555" cy="317" r="6"/><circle cx="696" cy="75" r="6"/>
            </g>
            <line x1="285" y1="108" x2="447" y2="233" stroke="#c8ff3d" stroke-width="5"/>
            <path d="M447 233 L428 231 L438 217 Z" fill="#c8ff3d"/>
            <text x="456" y="239" fill="#c8ff3d" font-size="15">skupni dz/du</text>
            <line x1="70" y1="310" x2="365" y2="310" stroke="#ff7ea8" stroke-width="4"/>
            <line x1="365" y1="310" x2="696" y2="310" stroke="#70a8ff" stroke-width="4"/>
            <text x="179" y="333" fill="#ffb8cf">h_b = u₁−u₀</text><text x="486" y="333" fill="#a9cbff">h_c = u₂−u₁</text>
            <text x="337" y="149" fill="#f5f7f6" font-size="15">spoj</text>
          </svg>
        `,
        "Puščica predstavlja odvod po globalnem u. Stopnja in dolžina parametrskega intervala določita njeno velikost."
      )),
      section("formal", "03 / matematični zapis", "Splošni pogoji za različni stopnji in različna intervala", `
        <p>Sestavljeno pot definiramo z</p>
        ${panel(
          "\\mathbf z(u)=\\begin{cases}\\mathbf b\\!\\left(\\frac{u-u_0}{h_b}\\right),&u_0\\le u\\le u_1,\\\\[2mm]\\mathbf c\\!\\left(\\frac{u-u_1}{h_c}\\right),&u_1\\le u\\le u_2.\\end{cases}",
          "z(u)=b((u−u₀)/h_b) na levem in c((u−u₁)/h_c) na desnem intervalu",
          "globalna parametrizacija"
        )}
        ${theorem("Pogoji v spoju u₁", `
          <p><strong>${M("C^0", "C⁰")}:</strong></p>
          ${panel("\\mathbf b_n=\\mathbf c_0", "bₙ=c₀", "položaj")}
          <p><strong>${M("C^1", "C¹")}:</strong> poleg C⁰ še</p>
          ${panel(
            "\\frac{n}{h_b}(\\mathbf b_n-\\mathbf b_{n-1})=\\frac{m}{h_c}(\\mathbf c_1-\\mathbf c_0)",
            "n(bₙ−bₙ₋₁)/h_b = m(c₁−c₀)/h_c",
            "globalna tangenta",
            "accent"
          )}
          <p><strong>${M("C^2", "C²")}:</strong> poleg C¹ še</p>
          ${panel(
            "\\frac{n(n-1)}{h_b^2}(\\mathbf b_n-2\\mathbf b_{n-1}+\\mathbf b_{n-2})=\\frac{m(m-1)}{h_c^2}(\\mathbf c_2-2\\mathbf c_1+\\mathbf c_0)",
            "n(n−1)Δ²bₙ₋₂/h_b² = m(m−1)Δ²c₀/h_c²",
            "globalni drugi odvod",
            "violet"
          )}
        `)}
        <h3>En zapis za vse rede</h3>
        ${panel(
          "\\frac{n!}{(n-j)!\\,h_b^j}\\Delta^j\\mathbf b_{n-j}=\\frac{m!}{(m-j)!\\,h_c^j}\\Delta^j\\mathbf c_0,\\qquad j=0,\\ldots,k\\le\\min\\{n,m\\}",
          "n! Δʲbₙ₋ⱼ/((n−j)!h_bʲ) = m! Δʲc₀/((m−j)!h_cʲ)",
          "splošni Cᵏ-pogoj"
        )}
        <h3>Geometrijski ${M("G^1", "G¹")} spoj</h3>
        ${panel(
          "\\mathbf b_n=\\mathbf c_0,\\qquad \\mathbf b_n-\\mathbf b_{n-1}=\\lambda(\\mathbf c_1-\\mathbf c_0),\\quad \\lambda>0",
          "bₙ=c₀ in bₙ−bₙ₋₁=λ(c₁−c₀), λ>0",
          "ista usmerjena tangenta"
        )}
        <p>Pri regularnih krajiščih faktorji stopnje in intervala ne spremenijo smeri, zato jih pri G¹ lahko absorbira pozitivni λ. Pri C¹ pa velikost odvoda šteje in faktorjev ne smemo izpustiti.</p>
        ${sourceNote("str. 34–43", "gladko zlepljanje in reparametrizacija")}
      `),
      section("algorithm", "04 / algoritem", "Kako iz levega kosa skonstruiraš začetek desnega", `
        <ol>
          <li>Zapiši stopnji n in m ter <strong>globalni</strong> dolžini ${M("h_b,h_c", "h_b,h_c")}. Če intervalov ni, je običajna predpostavka ${M("h_b=h_c=1", "h_b=h_c=1")}, vendar jo povej.</li>
          <li>Za C⁰ postavi ${M("\\mathbf c_0=\\mathbf b_n", "c₀=bₙ")}.</li>
          <li>Za C¹ preuredi enačbo:
            ${panel(
              "\\mathbf c_1=\\mathbf c_0+\\frac{n\\,h_c}{m\\,h_b}(\\mathbf b_n-\\mathbf b_{n-1})",
              "c₁=c₀+(n h_c)/(m h_b)(bₙ−bₙ₋₁)",
              "konstrukcija c₁"
            )}
          </li>
          <li>Za C² nato uporabi že znani c₁:
            ${panel(
              "\\mathbf c_2=2\\mathbf c_1-\\mathbf c_0+\\frac{n(n-1)h_c^2}{m(m-1)h_b^2}(\\mathbf b_n-2\\mathbf b_{n-1}+\\mathbf b_{n-2})",
              "c₂=2c₁−c₀+[n(n−1)h_c²/(m(m−1)h_b²)]Δ²bₙ₋₂",
              "konstrukcija c₂"
            )}
          </li>
          <li>Preostale kontrolne točke desne krivulje ne vplivajo na zahtevani red spoja; določimo jih z drugimi geometrijskimi ali interpolacijskimi pogoji.</li>
          <li>Na koncu neposredno izračunaj levi in desni globalni odvod. To je najhitrejša kontrola faktorjev.</li>
        </ol>
      `),
      section("example", "05 / lahek, a splošen", "C²-spoj različnih stopenj in intervalov", worked(
        "easy",
        "Kubična leva in kvadratna desna krivulja",
        `Leva krivulja ima stopnjo ${M("n=3", "n=3")}, interval dolžine ${M("h_b=1", "h_b=1")} in zadnje kontrolne točke ${M("\\mathbf b_1=(-2,1),\\mathbf b_2=(-1,0),\\mathbf b_3=(0,0)", "b₁=(−2,1), b₂=(−1,0), b₃=(0,0)")}. Desna je kvadratna, ${M("m=2", "m=2")}, na intervalu dolžine ${M("h_c=2", "h_c=2")}. Določi c₀,c₁,c₂ za C².`,
        [
          `C⁰ da ${M("\\mathbf c_0=\\mathbf b_3=(0,0)", "c₀=b₃=(0,0)")}.`,
          `Levi globalni prvi odvod je ${M("\\frac31(\\mathbf b_3-\\mathbf b_2)=3(1,0)=(3,0)", "3(b₃−b₂)=(3,0)")}.`,
          `Na desni je faktor ${M("m/h_c=2/2=1", "m/h_c=1")}, zato mora biti ${M("\\mathbf c_1-\\mathbf c_0=(3,0)", "c₁−c₀=(3,0)")} in ${M("\\mathbf c_1=(3,0)", "c₁=(3,0)")}.`,
          `Leva druga diferenca je ${M("\\mathbf b_3-2\\mathbf b_2+\\mathbf b_1=(0,1)", "b₃−2b₂+b₁=(0,1)")}; globalni drugi odvod je ${M("3\\cdot2(0,1)=(0,6)", "(0,6)")}.`,
          `Desni faktor drugega odvoda je ${M("m(m-1)/h_c^2=2/4=1/2", "1/2")}. Zato ${M("\\frac12(\\mathbf c_2-2\\mathbf c_1+\\mathbf c_0)=(0,6)", "½(c₂−2c₁+c₀)=(0,6)")} in ${M("\\mathbf c_2=(6,12)", "c₂=(6,12)")}.`,
          `Kontrola: desni odvod je ${M("(2/2)(\\mathbf c_1-\\mathbf c_0)=(3,0)", "(2/2)(c₁−c₀)=(3,0)")} in drugi ${M("(2/4)(\\mathbf c_2-2\\mathbf c_1+\\mathbf c_0)=(0,6)", "(2/4)(c₂−2c₁+c₀)=(0,6)")}.`
        ],
        `<p>${M("\\mathbf c_0=(0,0),\\qquad\\mathbf c_1=(3,0),\\qquad\\mathbf c_2=(6,12)", "c₀=(0,0), c₁=(3,0), c₂=(6,12)")}. Spoj je C² kljub različnima stopnjama in različnima dolžinama intervalov.</p>`
      )),
      section("example", "06 / zadnji izpit", "Reparametrizacija z izpita 1. 7. 2026", worked(
        "hard",
        "Najprej rekonstruiraj levi poligon, nato zlepi",
        `Kvadratna b je podana z ${M("\\mathbf b(0)=(-2,0)", "b(0)=(−2,0)")}, ${M("\\dot{\\mathbf b}(1)=(4,-2)", "ḃ(1)=(4,−2)")} in ${M("\\mathbf b(1/2)=(0,2)", "b(1/2)=(0,2)")}. Globalno velja na ${M("[0,1/2]", "[0,1/2]")}; kvadratna c pa na ${M("[1/2,2]", "[1/2,2]")}. Poišči začetek c za C¹-spoj.`,
        [
          `Iz ${M("\\mathbf b(0)=\\mathbf b_0", "b(0)=b₀")} dobimo ${M("\\mathbf b_0=(-2,0)", "b₀=(−2,0)")}.`,
          `Ker je b kvadratna, ${M("\\dot{\\mathbf b}(1)=2(\\mathbf b_2-\\mathbf b_1)=(4,-2)", "ḃ(1)=2(b₂−b₁)=(4,−2)")}; zato ${M("\\mathbf b_2=\\mathbf b_1+(2,-1)", "b₂=b₁+(2,−1)")}.`,
          `Pri ${M("t=1/2", "t=1/2")} je ${M("\\mathbf b(1/2)=\\frac14\\mathbf b_0+\\frac12\\mathbf b_1+\\frac14\\mathbf b_2=(0,2)", "b(1/2)=¼b₀+½b₁+¼b₂=(0,2)")}.`,
          `Vstavitev prejšnjih zvez da ${M("\\mathbf b_1=(0,3),\\qquad\\mathbf b_2=(2,2)", "b₁=(0,3), b₂=(2,2)")}.`,
          `Globalna pot je ${M("\\mathbf z(u)=\\mathbf b(2u)", "z(u)=b(2u)")} na prvem in ${M("\\mathbf z(u)=\\mathbf c(\\frac23u-\\frac13)", "z(u)=c((2/3)u−1/3)")} na drugem intervalu.`,
          `C⁰ da ${M("\\mathbf c_0=\\mathbf b_2=(2,2)", "c₀=b₂=(2,2)")}.`,
          `Levi globalni odvod je ${M("2\\dot{\\mathbf b}(1)=2(4,-2)=(8,-4)", "2ḃ(1)=(8,−4)")}. Desni je ${M("\\frac23\\dot{\\mathbf c}(0)=\\frac23\\,2(\\mathbf c_1-\\mathbf c_0)", "(2/3)ċ(0)=(4/3)(c₁−c₀)")}.`,
          `Iz enakosti sledi ${M("\\mathbf c_1-\\mathbf c_0=(6,-3)", "c₁−c₀=(6,−3)")} in zato ${M("\\mathbf c_1=(8,-1)", "c₁=(8,−1)")}.`
        ],
        `<p>${M("\\mathbf b_0=(-2,0),\\mathbf b_1=(0,3),\\mathbf b_2=(2,2),\\quad\\mathbf c_0=(2,2),\\mathbf c_1=(8,-1)", "b₀=(−2,0), b₁=(0,3), b₂=(2,2), c₀=(2,2), c₁=(8,−1)")}.</p><p>Za samo C¹ je c₂ prost. Če bi zahtevali še C², bi iz drugega globalnega odvoda dobili ${M("\\mathbf c_2=(14,-40)", "c₂=(14,−40)")}.</p>`
      )),
      section("deep", "07 / C¹ proti G¹", "Ista smer ni ista hitrost", `
        <div class="notation-grid">
          <div class="notation-item">
            <dt>${M("C^1", "C¹")}</dt>
            <dd><strong>Enak globalni vektor.</strong> Položaj je zvezen in velja ${M("\\mathbf z'_-(u_1)=\\mathbf z'_+(u_1)", "z′₋(u₁)=z′₊(u₁)")}. Smer in velikost hitrosti sta enaki.</dd>
          </div>
          <div class="notation-item">
            <dt>${M("G^1", "G¹")}</dt>
            <dd><strong>Enaka usmerjena premica.</strong> Velja ${M("\\mathbf z'_-(u_1)=\\mu\\mathbf z'_+(u_1)", "z′₋(u₁)=μz′₊(u₁)")} za neki ${M("\\mu>0", "μ>0")}; hitrost lahko skoči.</dd>
          </div>
        </div>
        <p>Vsak regularen C¹-spoj je G¹, obratno pa ne. Če je kateri tangentni vektor ničeln, preprost test s pozitivnim faktorjem ni zadosten; tak degeneriran spoj zahteva pregled prvih neničelnih odvodov.</p>
      `),
      section("proof", "08 / cel dokaz", "Od Bernsteinovega odvoda do splošnega Cᵏ-pogoja", proof({
        idea: "Najprej odvedemo Bézierjevo krivuljo po lokalnem parametru, nato uporabimo verižno pravilo za afino preslikavo globalnega intervala. Enakost enostranskih globalnih odvodov je natanko definicija Cᵏ-spoja.",
        steps: [
          {
            title: "Odvod Bernsteinove baze",
            body: panel(
              "\\frac{d}{dt}B_i^n(t)=n\\left(B_{i-1}^{n-1}(t)-B_i^{n-1}(t)\\right)",
              "dBᵢⁿ/dt=n(Bᵢ₋₁ⁿ⁻¹−Bᵢⁿ⁻¹)",
              "bazna identiteta"
            ),
            reason: "Identiteto dobimo z neposrednim odvajanjem binomskega zapisa; bazne funkcije z indeksom zunaj območja razumemo kot nič."
          },
          {
            title: "Odvod krivulje je krivulja diferenc",
            body: `Vstavitev identitete in premik indeksa dasta ${M("\\mathbf b'(t)=n\\sum_{i=0}^{n-1}\\Delta\\mathbf b_i B_i^{n-1}(t)", "b′(t)=nΣΔbᵢBᵢⁿ⁻¹(t)")}.`,
            reason: "Koeficient ob isti bazni funkciji je razlika zaporednih kontrolnih točk bᵢ₊₁−bᵢ."
          },
          {
            title: "Odvajanje ponovimo j-krat",
            body: panel(
              "\\mathbf b^{(j)}(t)=\\frac{n!}{(n-j)!}\\sum_{i=0}^{n-j}\\Delta^j\\mathbf b_i B_i^{n-j}(t)",
              "b⁽ʲ⁾(t)=n!/(n−j)! ΣΔʲbᵢBᵢⁿ⁻ʲ(t)",
              "j-ti lokalni odvod"
            ),
            reason: "Vsak korak zniža stopnjo za ena in prinese trenutni faktor n,n−1,…,n−j+1."
          },
          {
            title: "V krajiščih ostane en člen",
            body: `Pri t=1 je neničeln samo ${M("B_{n-j}^{n-j}(1)=1", "Bₙ₋ⱼⁿ⁻ʲ(1)=1")}, zato ${M("\\mathbf b^{(j)}(1)=\\frac{n!}{(n-j)!}\\Delta^j\\mathbf b_{n-j}", "b⁽ʲ⁾(1)=n!Δʲbₙ₋ⱼ/(n−j)!")}. Pri s=0 ostane ${M("B_0^{m-j}(0)=1", "B₀ᵐ⁻ʲ(0)=1")} in dobimo ustrezni izraz z ${M("\\Delta^j\\mathbf c_0", "Δʲc₀")}.`,
            reason: "To sta krajiščni lastnosti Bernsteinove baze."
          },
          {
            title: "Verižno pravilo doda intervalske faktorje",
            body: `Ker je ${M("t=(u-u_0)/h_b", "t=(u−u₀)/h_b")}, velja ${M("d^j/du^j=h_b^{-j}d^j/dt^j", "dʲ/duʲ=h_b⁻ʲdʲ/dtʲ")}. Na desni analogno dobimo faktor ${M("h_c^{-j}", "h_c⁻ʲ")}.`,
            reason: "Preslikavi sta afini, zato višji odvodi notranje funkcije izginejo in pri vsakem odvajanju dobimo še en faktor 1/h."
          },
          {
            title: "Izenačimo enostranska odvoda",
            body: `Za kosoma polinomsko pot velja ${M("C^k", "Cᵏ")} v spoju natanko tedaj, ko se ujemajo vrednost in enostranski odvodi po u za ${M("j=1,\\ldots,k", "j=1,…,k")}. Z vstavitvijo prejšnjih dveh korakov dobimo
              ${panel(
                "\\frac{n!}{(n-j)!\\,h_b^j}\\Delta^j\\mathbf b_{n-j}=\\frac{m!}{(m-j)!\\,h_c^j}\\Delta^j\\mathbf c_0",
                "n!Δʲbₙ₋ⱼ/((n−j)!h_bʲ)=m!Δʲc₀/((m−j)!h_cʲ)",
                "dokazani pogoj",
                "accent"
              )}`,
            reason: "To ni le zadosten recept, ampak neposreden prepis definicije Cᵏ v kontrolne točke."
          }
        ],
        conclusion: "Posebna pogoja za C¹ in C² dobimo z j=1 in j=2. Faktorji n,m,h_b in h_c so nujna posledica odvoda ter reparametrizacije, zato jih smemo izpustiti samo, ko se res pokrajšajo.",
        source: "krajiščni odvodi in zlepljanje na str. 34–43; splošna izpeljava je tukaj zapisana eksplicitno"
      })),
      section("warning", "09 / pogoste napake", "Šest preverjanj pred končnim odgovorom", `
        <ul>
          <li><strong>Najprej C⁰:</strong> enaka tangenta nič ne pomaga, če ${M("\\mathbf b_n\\ne\\mathbf c_0", "bₙ≠c₀")}.</li>
          <li><strong>Lokalni odvod ni globalni:</strong> pri različnih intervalih moraš deliti z ${M("h_b", "h_b")} oziroma ${M("h_c", "h_c")}.</li>
          <li><strong>Različni stopnji:</strong> leva tangenta ima faktor n, desna m; pri C² sta faktorja ${M("n(n-1)", "n(n−1)")} in ${M("m(m-1)", "m(m−1)")}.</li>
          <li><strong>Vrstni red druge diference:</strong> ${M("\\Delta^2\\mathbf b_{n-2}=\\mathbf b_n-2\\mathbf b_{n-1}+\\mathbf b_{n-2}", "Δ²bₙ₋₂=bₙ−2bₙ₋₁+bₙ₋₂")}.</li>
          <li><strong>C² vključuje C¹:</strong> enačaj drugih odvodov sam ne zagotovi ujemanja položaja in tangente.</li>
          <li><strong>Proste točke ostanejo proste:</strong> pogoj C¹ določi c₀ in c₁, ne pa samodejno tudi c₂,…,cₘ.</li>
          <li><strong>G¹ zahteva pozitiven faktor:</strong> negativen faktor obrne smer in ustvari geometrijski obrat.</li>
        </ul>
      `),
      section("recap", "10 / 30 sekund", "Formula, ki reši skoraj vsako nalogo", `
        <p><strong>Globalna pot:</strong> lokalna parametra sta ${M("t=(u-u_0)/h_b", "t=(u−u₀)/h_b")} in ${M("s=(u-u_1)/h_c", "s=(u−u₁)/h_c")}.</p>
        <p><strong>C⁰:</strong> ${M("\\mathbf b_n=\\mathbf c_0", "bₙ=c₀")}.</p>
        <p><strong>C¹:</strong> ${M("n(\\mathbf b_n-\\mathbf b_{n-1})/h_b=m(\\mathbf c_1-\\mathbf c_0)/h_c", "n(bₙ−bₙ₋₁)/h_b=m(c₁−c₀)/h_c")}.</p>
        <p><strong>C²:</strong> enako še skalirani drugi diferenci z faktorjema ${M("n(n-1)/h_b^2", "n(n−1)/h_b²")} in ${M("m(m-1)/h_c^2", "m(m−1)/h_c²")}.</p>
        <p><strong>G¹:</strong> ista točka in ista usmerjena tangenta z dovoljenim pozitivnim skalarnim faktorjem; hitrost ni nujno zvezna.</p>
      `)
    ]
  });

  window.NUM2_TOPICS_APPROX = topics;
})();
