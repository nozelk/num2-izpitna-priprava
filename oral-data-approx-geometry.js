(() => {
  "use strict";

  const UI = window.StudyUI;
  if (!UI) throw new Error("oral-data-approx-geometry.js potrebuje StudyUI.");
  const { M, panel, notation, theorem, proof, section } = UI;

  const OFFICIAL_PDF = "../ustni_izpit_2526.pdf";
  const prompts = {
    1: "Aproksimacijski problem. Formulirajte splošni aproksimacijski problem. Zakaj je prostor polinomov primeren podprostor za aproksimacijo zveznih funkcij?",
    2: "Problem najboljše aproksimacije. Definirajte element najboljše aproksimacije. Kako je karakteriziran polinom najboljše enakomerne aproksimacije in s katerim postopkom ga lahko poiščemo? Opišite glavne korake postopka.",
    3: "Odsekoma polinomske funkcije. Kakšna je razlika med polinomi in odsekoma polinomskimi funkcijami? Koliko prostih parametrov imajo odsekoma linearne, kvadratične in kubične funkcije ter kako jih konstruiramo na podlagi funkcijskih podatkov?",
    4: "Bézierjeve krivulje. Kako parametrično polinomsko krivuljo podamo v Bézierjevi obliki in zakaj je taka predstavitev praktično uporabna? Opišite glavne lastnosti Bézierjevih krivulj.",
    5: "De Casteljaujev postopek. Kako izračunamo vrednost na Bézierjevi krivulji z de Casteljaujevim postopkom? Kako narišemo Bézierjevo krivuljo?",
    6: "Zlepek Bézierjevih krivulj. Kako odvode Bézierjeve krivulje predstavimo v Bézierjevi obliki? Kakšni so pogoji gladkosti, ki zagotavljajo zveznost, zvezno odvedljivost in geometrijsko zveznost zlepka dveh Bézierjevih krivulj?",
    7: "Konstrukcija zlepkov Bézierjevih krivulj. Zakaj Bézierjeve krivulje lepimo v zlepke? Opišite konstrukcijo zvezno odvedljivega kvadratičnega in kubičnega zlepka Bézierjevih krivulj."
  };

  const official = prompt => section("official", "00 / uradno vprašanje", "Točno tako je zapisano na seznamu", `
    <blockquote class="oral-official-prompt">${prompt}</blockquote>
    <p class="source-note"><strong>Uradni vir:</strong> <a href="${OFFICIAL_PDF}" target="_blank" rel="noreferrer">Teme za ustne izpite 2025/2026</a>.</p>
  `);

  const spoken = items => `
    <p><strong>Govori v tem vrstnem redu:</strong></p>
    <ol class="oral-flow">${items.map(item => `<li>${item}</li>`).join("")}</ol>
  `;

  const sketch = (svg, steps, caption) => `
    <figure class="review-visual">
      <div class="review-visual-stage">${svg}</div>
      <figcaption>${caption}</figcaption>
    </figure>
    <h3>Vrstni red na tabli</h3>
    <ol class="board-plan">${steps.map(item => `<li>${item}</li>`).join("")}</ol>
  `;

  const example = (title, prompt, steps, answer) => `
    <article class="review-example" data-level="easy">
      <span>mini primer za ustni izpit</span>
      <h3>${title}</h3>
      <p class="review-example-prompt">${prompt}</p>
      <ol>${steps.map(item => `<li>${item}</li>`).join("")}</ol>
      <div class="review-example-answer"><strong>Sklep</strong><p>${answer}</p></div>
    </article>
  `;

  const followups = entries => `
    <div class="oral-followups">
      ${entries.map(([question, answer]) => `
        <details>
          <summary>${question}</summary>
          <div class="oral-followup-answer">${answer}</div>
        </details>
      `).join("")}
    </div>
  `;

  const topics = [];

  topics.push({
    id: "oral-01-aproksimacijski-problem",
    number: 1,
    chapter: "1 · Aproksimacija funkcij",
    title: "Aproksimacijski problem",
    officialPrompt: prompts[1],
    accent: "#a78bfa",
    minutes: 9,
    deepLinks: ["aproksimacija"],
    sections: [
      official(prompts[1]),
      section("plain", "01 / vzoren odgovor", "Kako začneš in povežeš celotno zgodbo", spoken([
        `»Najprej določimo normiran prostor ${M("X", "X")}, v katerem živi ciljna funkcija ${M("f", "f")}, ter preprostejšo množico približkov ${M("Y\\subseteq X", "Y⊆X")}.«`,
        `»Za ${M("g\\in Y", "g∈Y")} je ${M("r=f-g", "r=f−g")} residual. Njegovo velikost merimo z izbrano normo; pri enakomerni aproksimaciji gledamo najslabšo absolutno napako na intervalu.«`,
        `»Splošni problem je poiskati g z majhno normo residuala, idealno element, ki doseže razdaljo ${M("\\operatorname{dist}(f,Y)", "dist(f,Y)")}. Obstoj takega elementa ni avtomatičen.«`,
        `»Polinomi so uporabni, ker jih lahko preprosto računamo, odvajamo in integriramo, njihov prostor ${M("P_n", "Pₙ")} pa je končnodimenzionalen.«`,
        `»Ključni teoretični razlog je Weierstrassov izrek: unija vseh ${M("P_n", "Pₙ")} je gosta v ${M("C([a,b])", "C([a,b])")} v enakomerni normi. Torej lahko vsako zvezno funkcijo poljubno dobro približamo s polinomom dovolj visoke stopnje.«`
      ])),
      section("notation", "02 / legenda", "Simboli, ki jih moraš poimenovati", notation(
        "Ne piši formule, dokler ne poveš, kaj je cilj, kaj je dovoljen približek in kako meriš napako.",
        [
          { tex: "X", symbol: "X", name: "normiran prostor", meaning: " — npr. C([a,b]) z enakomerno normo." },
          { tex: "f\\in X", symbol: "f∈X", name: "ciljni element", meaning: " — funkcija, ki jo želimo nadomestiti." },
          { tex: "Y\\subseteq X", symbol: "Y⊆X", name: "aproksimacijska množica", meaning: " — dovoljeni, navadno enostavnejši približki." },
          { tex: "g\\in Y", symbol: "g∈Y", name: "približek", meaning: " — izbrani kandidat." },
          { tex: "r=f-g", symbol: "r=f−g", name: "residual", meaning: " — podpisana točkovna napaka." },
          { tex: "\\|r\\|_\\infty", symbol: "‖r‖∞", name: "enakomerna napaka", meaning: " — največja absolutna napaka na celotnem intervalu." },
          { tex: "P_n", symbol: "Pₙ", name: "polinomski podprostor", meaning: " — polinomi stopnje največ n; dimenzija n+1." },
          { tex: "\\operatorname{dist}(f,Y)", symbol: "dist(f,Y)", name: "razdalja do Y", meaning: " — infimum norm napake po vseh kandidatih." }
        ]
      )),
      section("board", "03 / tabla in skica", "Kaj narišeš, še preden dokazuješ", sketch(
        `
          <svg viewBox="0 0 720 245" role="img" aria-label="Funkcija, polinomski približek in največji residual" style="width:100%;height:auto">
            <rect width="720" height="245" rx="16" fill="#0b1015"/>
            <line x1="45" y1="202" x2="685" y2="202" stroke="#59636d" stroke-width="2"/>
            <path d="M55 165 C145 35 230 54 310 135 C395 220 500 185 665 45" fill="none" stroke="#b6c0ca" stroke-width="3" stroke-dasharray="8 7"/>
            <path d="M55 172 C170 62 265 78 344 142 C440 215 540 145 665 60" fill="none" stroke="#a78bfa" stroke-width="5"/>
            <line x1="438" y1="184" x2="438" y2="202" stroke="#ffbd7a" stroke-width="4"/>
            <text x="450" y="198" fill="#ffbd7a">‖f−g‖∞</text>
            <text x="565" y="35" fill="#b6c0ca">f</text><text x="590" y="91" fill="#a78bfa">g∈Y</text>
          </svg>
        `,
        [
          `Levo napiši podatke ${M("f\\in X,\\ Y\\subseteq X", "f∈X, Y⊆X")}.`,
          `Na sredino nariši f in približek g; navpično označi residual.`,
          `Desno napiši ${M("\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\|f-g\\|", "dist(f,Y)=inf ‖f−g‖")}.`,
          `Spodaj loči: fiksni ${M("P_n", "Pₙ")} je majhen prostor; ${M("\\bigcup_nP_n", "∪ₙPₙ")} pa je gost v C([a,b]).`
        ],
        "Skica pokaže, da residual ni število; norma iz celotne funkcije napake naredi eno merilo."
      )),
      section("formal", "04 / natančen zapis", "Splošni problem in Weierstrassov razlog", `
        ${theorem("Splošni aproksimacijski problem", `
          <p>Za dani ${M("f\\in X", "f∈X")} in ${M("Y\\subseteq X", "Y⊆X")} merimo kakovost kandidata g z ${M("\\|f-g\\|", "‖f−g‖")}. Najmanjša dosegljiva napaka je</p>
          ${panel(
            "\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\|f-g\\|.",
            "dist(f,Y)=inf(g∈Y) ‖f−g‖",
            "aproksimacijski problem"
          )}
          <p>Če neki ${M("g^*\\in Y", "g*∈Y")} doseže ta infimum, je element najboljše aproksimacije; to je tema naslednjega uradnega vprašanja.</p>
        `)}
        ${theorem("Weierstrassov aproksimacijski izrek", `
          ${panel(
            "\\forall f\\in C([a,b])\\ \\forall\\varepsilon>0\\ \\exists p\\in P:\\quad \\|f-p\\|_{\\infty,[a,b]}<\\varepsilon.",
            "Za vsak zvezen f in ε>0 obstaja polinom p z ‖f−p‖∞<ε.",
            "gostost polinomov",
            "violet"
          )}
          <p>Izrek govori o <em>vseh stopnjah skupaj</em>. Ne trdi, da že neki vnaprej fiksni ${M("P_n", "Pₙ")} aproksimira vse funkcije poljubno dobro.</p>
        `)}
        <p><strong>Zakaj še praktično?</strong> Polinomi imajo končno število koeficientov, Hornerjevo vrednotenje je hitro, odvodi in integrali so eksplicitni, afine spremembe intervala pa so preproste.</p>
      `),
      section("proof", "05 / ključni dokaz", "Bernsteinov dokaz gostosti polinomov na [0,1]", proof({
        idea: "Bernsteinov polinom je uteženo povprečje vzorcev funkcije. Bližnji vzorci imajo podobne vrednosti zaradi enakomerne zveznosti, skupna utež oddaljenih vzorcev pa gre proti nič.",
        steps: [
          {
            title: "Sestavimo polinom",
            body: panel(
              "B_nf(x)=\\sum_{i=0}^{n}f(i/n)\\binom ni x^i(1-x)^{n-i}.",
              "Bₙf(x)=Σ f(i/n) C(n,i)xⁱ(1−x)ⁿ⁻ⁱ",
              "Bernsteinov polinom"
            ),
            reason: "Gre za polinom stopnje največ n, uteži so nenegativne in se po binomskem izreku seštejejo v ena."
          },
          {
            title: "Napako zapišemo kot povprečje razlik",
            body: panel(
              "|B_nf(x)-f(x)|\\le\\sum_{i=0}^{n}|f(i/n)-f(x)|B_i^n(x).",
              "|Bₙf−f|≤Σ|f(i/n)−f(x)|Bᵢⁿ",
              "osnovna ocena"
            ),
            reason: "Odštejemo f(x)ΣBᵢⁿ=f(x) in uporabimo trikotniško neenakost."
          },
          {
            title: "Bližnji vzorci",
            body: `Ker je f na kompaktnem [0,1] enakomerno zvezna, za dani ${M("\\varepsilon>0", "ε>0")} izberemo δ, da iz ${M("|i/n-x|<\\delta", "|i/n−x|<δ")} sledi ${M("|f(i/n)-f(x)|<\\varepsilon/2", "|f(i/n)−f(x)|<ε/2")}. Prispevek bližnjih členov je zato največ ε/2.`,
            reason: "Vsota njihovih nenegativnih uteži je največ ena."
          },
          {
            title: "Oddaljeni vzorci",
            body: panel(
              "\\sum_{|i/n-x|\\ge\\delta}B_i^n(x)\\le\\frac1{\\delta^2}\\sum_i(i/n-x)^2B_i^n(x)=\\frac{x(1-x)}{n\\delta^2}\\le\\frac1{4n\\delta^2}.",
              "Vsota oddaljenih uteži ≤1/(4nδ²).",
              "drugi moment"
            ),
            reason: "Na oddaljeni množici je 1≤(i/n−x)²/δ²; drugi moment Bernsteinovih uteži je x(1−x)/n."
          },
          {
            title: "Enakomerna meja",
            body: `Za ${M("M=\\|f\\|_\\infty", "M=‖f‖∞")} je oddaljeni prispevek največ ${M("2M/(4n\\delta^2)", "2M/(4nδ²)")}. Pri dovolj velikem n je manjši od ε/2, zato ${M("\\|B_nf-f\\|_\\infty<\\varepsilon", "‖Bₙf−f‖∞<ε")}.`,
            reason: "Ocena je neodvisna od x, zato je konvergenca enakomerna."
          }
        ],
        conclusion: "Polinomi Bₙf torej enakomerno konvergirajo k f na [0,1]; afina preslikava prenese rezultat na poljuben [a,b].",
        source: "glavno gradivo, poglavje 1.1"
      })),
      section("example", "06 / mini primer", "Residual, norma in izbira prostora", example(
        "Aproksimiraj |x| s polinomom x²",
        `Na ${M("[-1,1]", "[−1,1]")} vzemi ${M("f(x)=|x|", "f(x)=|x|")}, ${M("Y=P_2", "Y=P₂")} in kandidata ${M("g(x)=x^2", "g(x)=x²")}.`,
        [
          `Residual je ${M("r(x)=|x|-x^2", "r(x)=|x|−x²")}.`,
          `Zaradi sodosti zadošča ${M("x\\in[0,1]", "x∈[0,1]")}, kjer je ${M("r=x-x^2", "r=x−x²")}.`,
          `Odvod ${M("1-2x", "1−2x")} izgine pri ${M("x=1/2", "x=1/2")}; tam je residual ${M("1/4", "1/4")}.`,
          `V krajiščih je residual nič, zato ${M("\\|f-g\\|_\\infty=1/4", "‖f−g‖∞=1/4")}.`
        ],
        "To izmeri kakovost izbranega kandidata. Še nismo dokazali, da je x² najboljši element P₂."
      )),
      section("questions", "07 / podvprašanja", "Kaj bo profesor verjetno vprašal naprej", followups([
        ["Ali je residual isto kot napaka?", `Residual ${M("f-g", "f−g")} je funkcija in ima predznak. Norma residuala je eno nenegativno število, s katerim primerjamo približke.`],
        ["Zakaj uporabimo enakomerno normo?", `Ker nadzoruje najslabšo napako na celotnem intervalu: ${M("\\|r\\|_\\infty=\\max_x|r(x)|", "‖r‖∞=maxₓ|r(x)|")}. Pri varnosti ali grafični kakovosti nas pogosto zanima prav najslabši primer.`],
        ["Ali Weierstrass pove, kateri polinom izbrati?", "Ne. Zagotovi obstoj zaporedja dobrih polinomov. Bernsteinova konstrukcija je en konkreten dokaz, najboljši polinom ali numerično učinkovita konstrukcija pa sta ločeni vprašanji."],
        ["Ali so polinomi gosti tudi med nezveznimi funkcijami v ‖·‖∞?", "Ne. Enakomerna limita zveznih funkcij je zvezna, zato nezvezne funkcije v tej normi ne moremo enakomerno aproksimirati s polinomi."],
        ["Zakaj ni dovolj en sam Pₙ?", `Ker je ${M("P_n", "Pₙ")} končnodimenzionalen in zaprt; splošne funkcije zunaj njega ne moremo znotraj fiksnega Pₙ približati poljubno dobro. Stopnjo moramo dovoliti povečevati.`]
      ])),
      section("warning", "08 / pasti", "Česa pri tem odgovoru ne smeš reči", `
        <ul>
          <li>Ne reci, da Weierstrass zagotavlja interpolacijo ali najboljši polinom; zagotavlja gostost.</li>
          <li>Ne zamenjaj ${M("\\inf_{g\\in Y}", "inf po g")} z ${M("\\max_{x\\in[a,b]}", "max po x")} — to sta dva različna nivoja optimizacije.</li>
          <li>Ne trdi, da infimum vedno dosežemo; za to potrebujemo dodatne pogoje.</li>
          <li>Ne reci, da je fiksni ${M("P_n", "Pₙ")} gost v C([a,b]); gosta je unija vseh polinomskih stopenj.</li>
          <li>Če govoriš o normi, povej interval. Maksimum brez domene ni popoln matematični zapis.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Zaključek brez gledanja", `
        <p>Imamo ${M("f\\in X", "f∈X")}, množico približkov ${M("Y\\subseteq X", "Y⊆X")} in residual ${M("f-g", "f−g")}; kakovost merimo z normo. Najmanjša možna napaka je ${M("\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\|f-g\\|", "dist(f,Y)=inf ‖f−g‖")}. Polinomi so praktični za računanje, ključni teoretični razlog pa je Weierstrass: vsako zvezno funkcijo na zaprtem intervalu lahko v enakomerni normi poljubno dobro aproksimiramo s polinomom dovolj visoke stopnje.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-02-najboljsa-aproksimacija",
    number: 2,
    chapter: "1 · Aproksimacija funkcij",
    title: "Problem najboljše aproksimacije",
    officialPrompt: prompts[2],
    accent: "#ff7a90",
    minutes: 10,
    deepLinks: ["remes-cebisev"],
    sections: [
      official(prompts[2]),
      section("plain", "01 / vzoren odgovor", "Od definicije do Remesovega postopka", spoken([
        `»Element ${M("g^*\\in Y", "g*∈Y")} je najboljša aproksimacija f, če doseže najmanjšo možno napako, torej ${M("\\|f-g^*\\|=\\operatorname{dist}(f,Y)", "‖f−g*‖=dist(f,Y)")} se ne da zmanjšati z nobenim drugim elementom Y.«`,
        `»Pri polinomih ${M("P_n", "Pₙ")} in enakomerni normi je najboljši polinom enoličen. Njegov residual karakterizira alternacijski izrek.«`,
        `»Za ${M("p^*\\in P_n", "p*∈Pₙ")} mora residual v vsaj ${M("n+2", "n+2")} urejenih točkah doseči isto absolutno višino z izmeničnim predznakom.«`,
        `»Remesov postopek začne z n+2 točkami, v njih reši linearni sistem za koeficiente p in skupno alternirajočo napako m, nato poišče pravi največji ekstrem residuala.«`,
        `»Če je pravi maksimum večji od |m|, z novo ekstremno točko zamenja eno staro tako, da ohrani alterniranje; ponavlja, dokler razlika ni pod toleranco.«`
      ])),
      section("notation", "02 / legenda", "Ne zamenjaj m, M in residuala", notation(
        "Alternacijski izrek in Remes uporabljata podobne simbole za tri različne stvari.",
        [
          { tex: "p^*\\in P_n", symbol: "p*∈Pₙ", name: "najboljši polinom", meaning: " — minimizira enakomerno normo napake." },
          { tex: "r=f-p", symbol: "r=f−p", name: "residual", meaning: " — podpisana funkcija napake." },
          { tex: "M=\\|r\\|_\\infty", symbol: "M=‖r‖∞", name: "prava največja napaka", meaning: " — maksimum na celotnem intervalu." },
          { tex: "E_k=\\{x_0,\\ldots,x_{n+1}\\}", symbol: "Eₖ", name: "menjalna množica", meaning: " — n+2 trenutnih Remesovih točk." },
          { tex: "m_k", symbol: "mₖ", name: "višina na Eₖ", meaning: " — rešitev linearnega sistema; sprva ni nujno enaka M." },
          { tex: "\\sigma\\in\\{-1,1\\}", symbol: "σ", name: "začetni predznak", meaning: " — določi orientacijo alterniranja." },
          { tex: "\\varepsilon", symbol: "ε", name: "toleranca", meaning: " — dovoljena razlika med M in |mₖ|." }
        ]
      )),
      section("board", "03 / tabla in skica", "Residual mora izmenično zadeti dve ograji", sketch(
        `
          <svg viewBox="0 0 720 255" role="img" aria-label="Alternirajoči residual" style="width:100%;height:auto">
            <rect width="720" height="255" rx="16" fill="#0b1015"/>
            <line x1="55" y1="128" x2="675" y2="128" stroke="#59636d" stroke-width="2"/>
            <line x1="55" y1="48" x2="675" y2="48" stroke="#ff7a90" stroke-width="2" stroke-dasharray="8 7"/>
            <line x1="55" y1="208" x2="675" y2="208" stroke="#ff7a90" stroke-width="2" stroke-dasharray="8 7"/>
            <path d="M80 48 C150 48 158 208 245 208 S330 48 420 48 S515 208 640 208" fill="none" stroke="#67d8ff" stroke-width="5"/>
            <g fill="#ffbd7a"><circle cx="80" cy="48" r="7"/><circle cx="245" cy="208" r="7"/><circle cx="420" cy="48" r="7"/><circle cx="640" cy="208" r="7"/></g>
            <text x="18" y="53" fill="#ff7a90">+M</text><text x="18" y="213" fill="#ff7a90">−M</text>
            <text x="510" y="105" fill="#67d8ff">r=f−p*</text>
          </svg>
        `,
        [
          `Najprej napiši definicijo ${M("\\|f-p^*\\|_\\infty=\\min_{p\\in P_n}\\|f-p\\|_\\infty", "‖f−p*‖∞=min ‖f−p‖∞")}.`,
          `Nariši vodoravni črti ${M("\\pm M", "±M")} in n+2 alternirajočih dotikov.`,
          `Pod sliko zapiši alternacijski izrek z urejenimi ${M("x_0<\\cdots<x_{n+1}", "x₀<⋯<xₙ₊₁")}.`,
          `Nato napiši Remesov sistem: prvi stolpec alternira, ostali so Vandermondovi.`,
          `Zaključi z menjavo ekstremne točke in kriterijem ${M("M_k-|m_k|\\le\\varepsilon", "Mₖ−|mₖ|≤ε")}.`
        ],
        "Za P₂ so potrebni štirje dotiki. Ničle residuala niso certifikat; certifikat so enako visoki alternirajoči ekstremi."
      )),
      section("formal", "04 / natančen zapis", "Definicija, karakterizacija in sistem", `
        ${theorem("Element najboljše aproksimacije", `
          ${panel(
            "g^*\\in Y\\text{ je najboljši}\\quad\\Longleftrightarrow\\quad \\|f-g^*\\|=\\inf_{g\\in Y}\\|f-g\\|.",
            "g* je najboljši ⇔ ‖f−g*‖=inf(g∈Y)‖f−g‖",
            "definicija"
          )}
        `)}
        ${theorem("Alternacijski izrek", `
          <p>Za ${M("f\\in C([a,b])", "f∈C([a,b])")} je ${M("p^*\\in P_n", "p*∈Pₙ")} najboljša enakomerna aproksimacija natanko tedaj, ko obstajajo ${M("x_0<\\cdots<x_{n+1}", "x₀<⋯<xₙ₊₁")} in ${M("\\sigma\\in\\{-1,1\\}", "σ∈{−1,1}")}, da</p>
          ${panel(
            "f(x_i)-p^*(x_i)=(-1)^i\\sigma\\,\\|f-p^*\\|_\\infty,\\qquad i=0,\\ldots,n+1.",
            "f(xᵢ)−p*(xᵢ)=(−1)ⁱσ‖f−p*‖∞",
            "alterniranje",
            "accent"
          )}
        `)}
        <h3>Remesov sistem v koraku k</h3>
        ${panel(
          "\\begin{bmatrix}1&1&x_0&\\cdots&x_0^n\\\\-1&1&x_1&\\cdots&x_1^n\\\\\\vdots&\\vdots&\\vdots&&\\vdots\\\\(-1)^{n+1}&1&x_{n+1}&\\cdots&x_{n+1}^n\\end{bmatrix}\\begin{bmatrix}m_k\\\\a_0\\\\a_1\\\\\\vdots\\\\a_n\\end{bmatrix}=\\begin{bmatrix}f(x_0)\\\\f(x_1)\\\\\\vdots\\\\f(x_{n+1})\\end{bmatrix}.",
          "[alternirajoči stolpec | Vandermondova matrika]·[mₖ,a₀,…,aₙ]ᵀ=f(Eₖ)",
          "linearni sistem"
        )}
        <p>Rešitev zagotovi alterniranje samo na Eₖ. Nato moramo na celotnem intervalu poiskati ${M("M_k=\\|f-p_k\\|_\\infty", "Mₖ=‖f−pₖ‖∞")}.</p>
      `),
      section("proof", "05 / ključni dokaz", "Zakaj n+2 alternacij izključi boljši polinom", proof({
        idea: "Če bi obstajal strogo boljši polinom q, bi razlika q−p zaradi alterniranja morala imeti vsaj n+1 ničel, čeprav ima stopnjo največ n.",
        steps: [
          {
            title: "Predpostavimo alterniranje",
            body: `Naj bo ${M("r=f-p", "r=f−p")} in ${M("r(x_i)=(-1)^i\\sigma M", "r(xᵢ)=(−1)ⁱσM")} v n+2 točkah, kjer je ${M("M=\\|r\\|_\\infty", "M=‖r‖∞")}.`,
            reason: "To je predpostavljeni certifikat za p."
          },
          {
            title: "Predpostavimo strogo boljši q",
            body: `Naj bo ${M("q\\in P_n", "q∈Pₙ")} in ${M("\\|f-q\\|_\\infty<M", "‖f−q‖∞<M")}. Označimo ${M("s=f-q", "s=f−q")}.`,
            reason: "Dokazujemo optimalnost s protislovjem."
          },
          {
            title: "Razlika q−p izmenjuje predznak",
            body: panel(
              "q(x_i)-p(x_i)=r(x_i)-s(x_i).",
              "q(xᵢ)−p(xᵢ)=r(xᵢ)−s(xᵢ)",
              "ključna identiteta"
            ),
            reason: "Ker je |s(xᵢ)|<M=|r(xᵢ)|, ima r(xᵢ)−s(xᵢ) isti predznak kot r(xᵢ)."
          },
          {
            title: "Dobimo preveč ničel",
            body: `Med vsako zaporedno dvojico xᵢ in xᵢ₊₁ ima zvezni polinom q−p ničlo. To je vsaj ${M("n+1", "n+1")} različnih ničel.`,
            reason: "Uporabimo izrek o vmesni vrednosti na n+1 disjunktnih intervalih."
          },
          {
            title: "Protislovje s stopnjo",
            body: `Toda ${M("q-p\\in P_n", "q−p∈Pₙ")} in neničeln polinom stopnje največ n ne more imeti več kot n različnih ničel.`,
            reason: "Zato strogo boljši q ne obstaja."
          }
        ],
        conclusion: "Polinom p je najboljši. To dokazuje zadostno smer alternacijskega izreka, ki jo pri Remesu uporabljamo kot certifikat.",
        source: "glavno gradivo, izrek 1.2"
      })),
      section("example", "06 / mini primer", "Tri alternacije za najboljšo premico", example(
        "Najboljša premica za x² na [0,1]",
        `Iščemo ${M("p(x)=a_0+a_1x", "p=a₀+a₁x")} in zahtevamo alterniranje residuala v ${M("0,1/2,1", "0,1/2,1")}.`,
        [
          `Enačbe so ${M("-a_0=m", "−a₀=m")}, ${M("1/4-a_0-a_1/2=-m", "1/4−a₀−a₁/2=−m")} in ${M("1-a_0-a_1=m", "1−a₀−a₁=m")}.`,
          `Iz prve je ${M("a_0=-m", "a₀=−m")}; iz tretje dobimo ${M("a_1=1", "a₁=1")}.`,
          `Druga enačba nato da ${M("m=1/8", "m=1/8")} in ${M("a_0=-1/8", "a₀=−1/8")}.`,
          `Residual je ${M("r(x)=x^2-x+1/8=(x-1/2)^2-1/8", "r=(x−1/2)²−1/8")} in povsod leži med −1/8 in 1/8.`
        ],
        `${M("p^*(x)=x-\\frac18,\\qquad\\|f-p^*\\|_\\infty=\\frac18", "p*(x)=x−1/8, ‖f−p*‖∞=1/8")}. Tri alternacije so certifikat za P₁.`
      )),
      section("questions", "07 / podvprašanja", "Kaj moraš znati odgovoriti brez novega računa", followups([
        ["Koliko alternacij potrebujemo za Pₙ?", `Vsaj ${M("n+2", "n+2")} urejenih točk z enako absolutno napako in izmeničnim predznakom.`],
        ["Zakaj je najboljši polinom enoličen?", "Če bi bila dva različna najboljša polinoma, bi alternacijska struktura oziroma standardni dokaz za Haarov prostor Pₙ prisilila njuno razliko k prevelikemu številu ničel."],
        ["Ali je |mₖ| že prava napaka?", `Ne. ${M("|m_k|", "|mₖ|")} je napaka v trenutnih menjalnih točkah. Prava napaka je ${M("\\|f-p_k\\|_{\\infty,[a,b]}", "‖f−pₖ‖∞,[a,b]")} in jo moramo poiskati na vsem intervalu.`],
        ["Kako izberemo novo Remesovo točko?", "Vzamemo točko največjega absolutnega residuala in zamenjamo sosednjo staro točko tako, da ostanejo predznaki v urejenem seznamu alternirajoči."],
        ["Kaj je končni kriterij?", `Tipično ${M("\\|r_k\\|_\\infty-|m_k|\\le\\varepsilon", "‖rₖ‖∞−|mₖ|≤ε")}; takrat trenutne alternacijske višine skoraj dosežejo pravi maksimum.`],
        ["Ali alterniranje pomeni ničle residuala?", "Ne. Gre za ekstremne vrednosti +M in −M. Med njimi so sicer ničle, vendar same ničle ne karakterizirajo optimuma."]
      ])),
      section("warning", "08 / pasti", "Najpogostejše napake pri Remesu", `
        <ul>
          <li>V prvem stolpcu sistema morajo znaki alternirati; ta stolpec pripada neznanki m, ne koeficientu polinoma.</li>
          <li>Ves čas uporabljaj isto konvencijo residuala, na primer ${M("r=f-p", "r=f−p")}.</li>
          <li>Ne razglasi optimuma samo zato, ker residual alternira na izbranem Eₖ; preveri globalni maksimum.</li>
          <li>Alternacijski izrek zahteva urejene točke in enake absolutne višine.</li>
          <li>Besedi »najboljši« vedno dodaj normo; najboljši v L² in najboljši v L∞ nista ista polinoma.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Definicija, certifikat, algoritem", `
        <p>Najboljši element doseže razdaljo do aproksimacijske množice. Za ${M("P_n", "Pₙ")} v enakomerni normi je najboljši polinom enoličen in njegov residual alternira med ${M("\\pm M", "±M")} v n+2 točkah. Remes iz n+2 točk reši alternirajoči sistem, poišče pravi globalni ekstrem, zamenja eno točko ob ohranitvi predznakov in ponavlja do tolerance.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-03-odsekoma-polinomske-funkcije",
    number: 3,
    chapter: "1 · Aproksimacija funkcij",
    title: "Odsekoma polinomske funkcije",
    officialPrompt: prompts[3],
    accent: "#67d8ff",
    minutes: 10,
    deepLinks: ["zlepki"],
    sections: [
      official(prompts[3]),
      section("plain", "01 / vzoren odgovor", "Od globalnega polinoma do lokalnih konstrukcij", spoken([
        `»Polinom ima en predpis na celotnem intervalu. Odsekoma polinomska funkcija pa ima na vsakem podintervalu svoj polinom; v stikih zahtevamo ujemanje vrednosti in po potrebi odvodov.«`,
        `»Pri m intervalih in lokalni stopnji n začnemo z ${M("m(n+1)", "m(n+1)")} koeficienti. Vsak notranji stik za gladkost ${M("C^r", "Cʳ")} doda r+1 pogojev, zato je dimenzija ${M("m(n+1)-(m-1)(r+1)", "m(n+1)−(m−1)(r+1)")} .«`,
        `»Zvezni linearni zlepek ima m+1 parametrov in ga določijo funkcijske vrednosti v m+1 vozliščih.«`,
        `»Kvadratni C¹-zlepek ima m+2 parametrov: m+1 vrednosti in še en robni naklon. Iz njega rekurzivno dobimo vse ostale naklone.«`,
        `»Kubični C²-zlepek ima m+3 parametrov: m+1 vrednosti in dva robna pogoja. Neznane notranje naklone dobimo iz tridiagonalnega sistema, nato vsak interval zapišemo kot kubični Hermitov kos.«`
      ])),
      section("notation", "02 / legenda", "Indeksi so polovica naloge", notation(
        "Naj bo X delitev z m podintervali. Pri formulah vedno povej, ali hᵢ pripada intervalu [xᵢ,xᵢ₊₁].",
        [
          { tex: "X=\\{x_0<\\cdots<x_m\\}", symbol: "X", name: "delitev intervala", meaning: " — m podintervalov in m+1 vozlišč." },
          { tex: "h_i=x_{i+1}-x_i", symbol: "hᵢ", name: "korak", meaning: " — dolžina i-tega podintervala." },
          { tex: "S_n^r(X)", symbol: "Sₙʳ(X)", name: "prostor zlepkov", meaning: " — lokalna stopnja ≤n, globalna gladkost Cʳ." },
          { tex: "q_i", symbol: "qᵢ", name: "lokalni polinom", meaning: " — predpis na enem podintervalu." },
          { tex: "f_i=f(x_i)", symbol: "fᵢ", name: "funkcijski podatek", meaning: " — interpolirana vrednost v vozlišču." },
          { tex: "s_i=S'(x_i)", symbol: "sᵢ", name: "naklon", meaning: " — skupna vrednost prvega odvoda v vozlišču." },
          { tex: "\\delta_i=(f_{i+1}-f_i)/h_i", symbol: "δᵢ", name: "sekantni naklon", meaning: " — povprečni naklon podatkov." }
        ]
      )),
      section("board", "03 / tabla in skica", "Najprej pokaži šive, nato štej parametre", sketch(
        `
          <svg viewBox="0 0 720 260" role="img" aria-label="Odsekoma polinomska funkcija s tremi šivi" style="width:100%;height:auto">
            <rect width="720" height="260" rx="16" fill="#0b1015"/>
            <line x1="45" y1="210" x2="680" y2="210" stroke="#59636d" stroke-width="2"/>
            <path d="M65 180 C130 180 145 70 235 92" fill="none" stroke="#a78bfa" stroke-width="5"/>
            <path d="M235 92 C330 118 345 225 455 170" fill="none" stroke="#67d8ff" stroke-width="5"/>
            <path d="M455 170 C550 122 605 55 665 82" fill="none" stroke="#ff7a90" stroke-width="5"/>
            <g fill="#ffbd7a"><circle cx="65" cy="180" r="7"/><circle cx="235" cy="92" r="7"/><circle cx="455" cy="170" r="7"/><circle cx="665" cy="82" r="7"/></g>
            <text x="222" y="238" fill="#c1cad2">x₁</text><text x="442" y="238" fill="#c1cad2">x₂</text>
            <text x="90" y="42" fill="#a78bfa">q₁</text><text x="335" y="42" fill="#67d8ff">q₂</text><text x="575" y="42" fill="#ff7a90">q₃</text>
          </svg>
        `,
        [
          `Nariši delitev ${M("x_0<\\cdots<x_m", "x₀<⋯<xₘ")} in nad vsakim intervalom svoj qᵢ.`,
          `V stiku napiši tri nivoje: ${M("C^0:q_i=q_{i+1}", "C⁰: vrednosti")}, ${M("C^1:q_i'=q_{i+1}'", "C¹: prvi odvodi")}, ${M("C^2:q_i''=q_{i+1}''", "C²: drugi odvodi")}.`,
          `Napiši splošno štetje ${M("\\dim S_n^r=m(n+1)-(m-1)(r+1)", "dim Sₙʳ=m(n+1)−(m−1)(r+1)")}.`,
          `Naredi tabelo: linearni C⁰ → m+1; kvadratni C¹ → m+2; kubični C² → m+3.`,
          "Na koncu pod vsako vrstico napiši, kateri podatki jo določijo."
        ],
        "Barve pomenijo različne lokalne polinome. Ujemanje barv ni potrebno; ujemati se morajo vrednosti in zahtevani odvodi."
      )),
      section("formal", "04 / natančen zapis", "Tri konstrukcije iz funkcijskih podatkov", `
        ${theorem("Prostor zlepkov", `
          ${panel(
            "S_n^r(X)=\\{S\\in C^r([x_0,x_m]):S|_{[x_{i-1},x_i]}\\in P_n\\},\\qquad \\dim S_n^r(X)=mn-(m-1)r+1.",
            "Sₙʳ: lokalno Pₙ in globalno Cʳ; dim=mn−(m−1)r+1",
            "definicija in dimenzija"
          )}
        `)}
        <h3>1. Linearni ${M("C^0", "C⁰")} zlepek — m+1 podatkov</h3>
        ${panel(
          "S(x)=f_i+\\frac{f_{i+1}-f_i}{h_i}(x-x_i),\\qquad x\\in[x_i,x_{i+1}].",
          "S=fᵢ+(fᵢ₊₁−fᵢ)(x−xᵢ)/hᵢ",
          "linearna interpolacija"
        )}
        <h3>2. Kvadratni ${M("C^1", "C¹")} zlepek — m+2 podatkov</h3>
        <p>Za ${M("t=x-x_i", "t=x−xᵢ")} in znani sᵢ je</p>
        ${panel(
          "q_i(x)=f_i+s_it+\\frac{f_{i+1}-f_i-s_ih_i}{h_i^2}t^2,\\qquad s_{i+1}=-s_i+2\\delta_i.",
          "qᵢ=fᵢ+sᵢt+(fᵢ₊₁−fᵢ−sᵢhᵢ)t²/hᵢ²; sᵢ₊₁=−sᵢ+2δᵢ",
          "kvadratna rekurzija",
          "violet"
        )}
        <h3>3. Kubični ${M("C^2", "C²")} zlepek — m+3 podatkov</h3>
        <p>Za vrednosti fᵢ in naklone sᵢ zapišemo vsak interval v kubični Hermitovi obliki. Notranje naklone določijo enačbe</p>
        ${panel(
          "h_i s_{i-1}+2(h_{i-1}+h_i)s_i+h_{i-1}s_{i+1}=3(h_i\\delta_{i-1}+h_{i-1}\\delta_i),\\quad i=1,\\ldots,m-1.",
          "hᵢsᵢ₋₁+2(hᵢ₋₁+hᵢ)sᵢ+hᵢ₋₁sᵢ₊₁=3(hᵢδᵢ₋₁+hᵢ₋₁δᵢ)",
          "tridiagonalni sistem",
          "accent"
        )}
        <p>Dodamo dva robna pogoja, npr. predpisana s₀,sₘ ali naravna pogoja ${M("S''(x_0)=S''(x_m)=0", "S″(x₀)=S″(xₘ)=0")}.</p>
      `),
      section("proof", "05 / ključna izpeljava", "Od koeficientov do m+1, m+2 in m+3", proof({
        idea: "Vsak lokalni polinom prinese n+1 koeficientov. V vsakem notranjem stiku nato odštejemo po en neodvisen pogoj za vrednost in vsak zahtevani odvod.",
        steps: [
          {
            title: "Brez lepljenja",
            body: `Na m intervalih imamo m polinomov iz ${M("P_n", "Pₙ")}; vsak ima n+1 koeficientov. Skupaj je ${M("m(n+1)", "m(n+1)")} prostih parametrov.`,
            reason: "Lokalni predpisi so pred pogoji v stikih neodvisni."
          },
          {
            title: "En notranji stik",
            body: `Gladkost ${M("C^r", "Cʳ")} zahteva ujemanje odvodov redov ${M("0,1,\\ldots,r", "0,1,…,r")}. To je r+1 linearnih pogojev.`,
            reason: "Red 0 pomeni samo vrednost funkcije."
          },
          {
            title: "Vsi notranji stiki",
            body: `Notranjih stikov je m−1, zato odštejemo ${M("(m-1)(r+1)", "(m−1)(r+1)")} pogojev.`,
            reason: "Za n≥r so ti pogoji neodvisni in lokalno povezujejo le sosednja kosa."
          },
          {
            title: "Splošna dimenzija",
            body: panel(
              "\\dim S_n^r(X)=m(n+1)-(m-1)(r+1)=mn-(m-1)r+1.",
              "dim Sₙʳ=m(n+1)−(m−1)(r+1)",
              "štetje"
            ),
            reason: "Druga oblika je samo algebraično poenostavljenje prve."
          },
          {
            title: "Tri pomembne vrste",
            body: `${M("\\dim S_1^0=m+1", "dim S₁⁰=m+1")}, ${M("\\dim S_2^1=m+2", "dim S₂¹=m+2")} in ${M("\\dim S_3^2=m+3", "dim S₃²=m+3")}.`,
            reason: "Zato potrebujemo po vrsti m+1 vrednosti; m+1 vrednosti in en naklon; m+1 vrednosti in dva robna pogoja."
          }
        ],
        conclusion: "Štetje razloži, zakaj pri kvadratnem C¹-zlepku ostane en prost podatek in pri kubičnem C²-zlepku dva. Konstrukcijske formule te proste podatke nato konkretno uporabijo.",
        source: "glavno gradivo, poglavje 1.3"
      })),
      section("example", "06 / mini primer", "Kvadratni C¹-zlepek brez preskoka", example(
        "Vrednosti 0,1,0 in začetni naklon 1",
        `Vozlišča so ${M("0,1,2", "0,1,2")}, vrednosti ${M("0,1,0", "0,1,0")} in ${M("s_0=1", "s₀=1")}.`,
        [
          `Na [0,1] je kvadratni koeficient ${M("(1-0-1\\cdot1)/1^2=0", "0")}, zato ${M("q_0(x)=x", "q₀(x)=x")}.`,
          `Rekurzija da ${M("s_1=-1+2(1-0)=1", "s₁=1")}.`,
          `Na [1,2] naj bo ${M("t=x-1", "t=x−1")}; koeficient je ${M("(0-1-1)/1^2=-2", "−2")}.`,
          `Zato ${M("q_1(x)=1+t-2t^2", "q₁=1+t−2t²")} in ${M("q_0'(1)=q_1'(1)=1", "q₀′(1)=q₁′(1)=1")}.`
        ],
        "Vrednosti in prvi odvod se v x=1 ujemajo, zato je zlepek C¹. Drugi odvod se ni dolžan ujemati."
      )),
      section("questions", "07 / podvprašanja", "Hitra preverjanja razumevanja", followups([
        ["Zakaj ne uporabimo enega visokega polinoma?", "Lokalni kosi dajejo lokalni nadzor, manj oscilacij in redke sisteme. Sprememba enega podatka navadno vpliva le lokalno ali prek dobro strukturiranega sistema."],
        ["Kaj pomeni C⁰ v stiku?", "Leva in desna vrednost sta enaki. Graf nima skoka, lahko pa ima kot."],
        ["Koliko parametrov ima odsekoma kubična C¹-funkcija?", `Vstavimo n=3,r=1: ${M("m(4)-(m-1)2=2m+2", "4m−2(m−1)=2m+2")}. Določimo jo lahko z vrednostmi in nakloni v vseh m+1 vozliščih — to je kubična Hermitova interpolacija.`],
        ["Zakaj je sistem za kubični C²-zlepek tridiagonalen?", "Pogoj drugega odvoda v vozlišču poveže samo naklone sᵢ₋₁,sᵢ,sᵢ₊₁ sosednjih intervalov."],
        ["Katera dva robna pogoja lahko izberemo?", "Predpisana robna naklona, naravna pogoja S″=0, periodična pogoja ali druge ustrezne linearne pogoje; izbira spremeni zlepek."],
        ["Ali je odsekoma polinomska funkcija vedno zvezna?", "Ne. Brez izrecnih pogojev so lokalni polinomi lahko v stikih celo nezvezni."]
      ])),
      section("warning", "08 / pasti", "Kje se izgubijo indeksi ali prostostne stopnje", `
        <ul>
          <li>Število m pomeni število intervalov, ne vozlišč; vozlišč je m+1.</li>
          <li>Pri Cʳ v vsakem stiku zahtevamo r+1 pogojev, ker šteje tudi vrednost — odvod reda 0.</li>
          <li>V kvadratni formuli na [xᵢ,xᵢ₊₁] uporabi ${M("t=x-x_i", "t=x−xᵢ")}; napačno izhodišče pokvari interpolacijo.</li>
          <li>Kubični Hermitov zlepek s poljubnimi nakloni je C¹, ne avtomatično C².</li>
          <li>Za kubični C²-zlepek notranje enačbe brez dveh robnih pogojev ne določijo enolične rešitve.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Tabela, ki jo moraš znati na pamet", `
        <p>Pri m intervalih je ${M("\\dim S_n^r=m(n+1)-(m-1)(r+1)", "dim Sₙʳ=m(n+1)−(m−1)(r+1)")}. Zato ima linearni C⁰-zlepek m+1 parametrov in ga določijo vrednosti; kvadratni C¹-zlepek m+2 parametrov in potrebuje še en robni naklon; kubični C²-zlepek m+3 parametrov in potrebuje dva robna pogoja. Linearne kose napišemo neposredno, kvadratne gradimo z rekurzijo naklonov, kubične pa s Hermitovimi kosi in tridiagonalnim sistemom.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-04-bezierjeve-krivulje",
    number: 4,
    chapter: "2 · Računalniško podprto geometrijsko oblikovanje",
    title: "Bézierjeve krivulje",
    officialPrompt: prompts[4],
    accent: "#ffbd7a",
    minutes: 9,
    deepLinks: ["bezier"],
    sections: [
      official(prompts[4]),
      section("plain", "01 / vzoren odgovor", "Kaj je oblika in zakaj jo uporabljamo", spoken([
        `»Parametrično polinomsko krivuljo stopnje n lahko namesto v potenčni bazi zapišemo v Bernsteinovi bazi. Njeni vektorski koeficienti ${M("\\mathbf b_0,\\ldots,\\mathbf b_n", "b₀,…,bₙ")} so kontrolne točke.«`,
        `»Bézierjeva oblika je praktična, ker imajo koeficienti neposreden geometrijski pomen: krivulja začne v b₀, konča v bₙ in krajiščni tangenti sledita prvemu in zadnjemu robu kontrolnega poligona.«`,
        `»Bernsteinove uteži so na [0,1] nenegativne in se seštejejo v ena. Zato krivulja ostane v konveksni ovojnici kontrolnih točk.«`,
        `»Afine transformacije lahko izvedemo kar na kontrolnih točkah, kar je zelo uporabno pri premikih, rotacijah in skaliranju v računalniški grafiki.«`,
        `»Krivuljo stabilno vrednotimo z de Casteljaujevim postopkom, stopnjo pa lahko zvišamo, ne da bi spremenili njeno obliko.«`
      ])),
      section("notation", "02 / legenda", "Točke so vektorji, baza pa skalarna", notation(
        "Vsaka koordinata krivulje je polinom, celotno krivuljo pa dobimo z istimi skalarnimi utežmi vseh kontrolnih vektorjev.",
        [
          { tex: "t\\in[0,1]", symbol: "t", name: "parameter", meaning: " — določi položaj na krivulji, ne nujno prepotovane razdalje." },
          { tex: "\\mathbf b(t)\\in\\mathbb R^d", symbol: "b(t)", name: "parametrična krivulja", meaning: " — točka v ravnini ali prostoru." },
          { tex: "\\mathbf b_0,\\ldots,\\mathbf b_n", symbol: "b₀,…,bₙ", name: "kontrolne točke", meaning: " — vektorski koeficienti Bézierjeve oblike." },
          { tex: "B_i^n(t)", symbol: "Bᵢⁿ(t)", name: "Bernsteinova baza", meaning: " — skalarna utež i-te kontrolne točke." },
          { tex: "\\operatorname{conv}\\{\\mathbf b_i\\}", symbol: "conv{bᵢ}", name: "konveksna ovojnica", meaning: " — najmanjša konveksna množica, ki vsebuje kontrolni poligon." },
          { tex: "\\Delta\\mathbf b_i=\\mathbf b_{i+1}-\\mathbf b_i", symbol: "Δbᵢ", name: "prva diferenca", meaning: " — rob kontrolnega poligona." },
          { tex: "A\\mathbf x+\\mathbf v", symbol: "Ax+v", name: "afina transformacija", meaning: " — linearna preslikava skupaj s translacijo." }
        ]
      )),
      section("board", "03 / tabla in skica", "Nariši poligon, ovojnico in krivuljo", sketch(
        `
          <svg viewBox="0 0 720 295" role="img" aria-label="Kubična Bézierjeva krivulja v konveksni ovojnici" style="width:100%;height:auto">
            <rect width="720" height="295" rx="16" fill="#0b1015"/>
            <polygon points="70,240 205,42 520,58 655,238" fill="#a78bfa" fill-opacity=".12" stroke="#a78bfa" stroke-width="2"/>
            <polyline points="70,240 205,42 520,58 655,238" fill="none" stroke="#7b8791" stroke-width="3" stroke-dasharray="8 7"/>
            <path d="M70 240 C205 42 520 58 655 238" fill="none" stroke="#ffbd7a" stroke-width="7"/>
            <g fill="#f3f6f8"><circle cx="70" cy="240" r="8"/><circle cx="205" cy="42" r="8"/><circle cx="520" cy="58" r="8"/><circle cx="655" cy="238" r="8"/></g>
            <text x="46" y="268" fill="#f3f6f8">b₀</text><text x="185" y="29" fill="#f3f6f8">b₁</text><text x="510" y="42" fill="#f3f6f8">b₂</text><text x="661" y="260" fill="#f3f6f8">b₃</text>
            <line x1="70" y1="240" x2="150" y2="122" stroke="#67d8ff" stroke-width="4"/><path d="M150 122 l-4 18 -13 -9 z" fill="#67d8ff"/>
            <text x="86" y="115" fill="#67d8ff">b′(0)</text>
          </svg>
        `,
        [
          `Napiši ${M("B_i^n(t)=\\binom ni(1-t)^{n-i}t^i", "Bᵢⁿ=C(n,i)(1−t)ⁿ⁻ⁱtⁱ")}.`,
          `Nariši štiri kontrolne točke in črtkani kontrolni poligon.`,
          "Okoli njih nariši konveksno ovojnico ter znotraj nje krivuljo.",
          `Pri b₀ in bₙ nariši tangentni smeri ${M("\\mathbf b_1-\\mathbf b_0", "b₁−b₀")} in ${M("\\mathbf b_n-\\mathbf b_{n-1}", "bₙ−bₙ₋₁")}.`,
          "Ob rob napiši: afina invariantnost in de Casteljau."
        ],
        "Krivulja praviloma ne gre skozi notranje kontrolne točke; te jo le geometrijsko usmerjajo."
      )),
      section("formal", "04 / natančen zapis", "Definicija in glavne lastnosti", `
        ${theorem("Bézierjeva oblika", `
          ${panel(
            "\\mathbf b(t)=\\sum_{i=0}^{n}\\mathbf b_iB_i^n(t),\\qquad B_i^n(t)=\\binom ni(1-t)^{n-i}t^i,\\quad t\\in[0,1].",
            "b(t)=Σᵢ₌₀ⁿ bᵢBᵢⁿ(t)",
            "definicija"
          )}
          <p>Ker Bernsteinovi polinomi tvorijo bazo Pₙ, lahko vsako parametrično polinomsko krivuljo stopnje največ n enolično zapišemo v tej obliki.</p>
        `)}
        <div class="notation-grid">
          <div class="notation-item"><dt>Robova</dt><dd>${M("\\mathbf b(0)=\\mathbf b_0,\\quad\\mathbf b(1)=\\mathbf b_n", "b(0)=b₀, b(1)=bₙ")}.</dd></div>
          <div class="notation-item"><dt>Tangenti</dt><dd>${M("\\mathbf b'(0)=n(\\mathbf b_1-\\mathbf b_0),\\quad\\mathbf b'(1)=n(\\mathbf b_n-\\mathbf b_{n-1})", "b′(0)=n(b₁−b₀), b′(1)=n(bₙ−bₙ₋₁)")}.</dd></div>
          <div class="notation-item"><dt>Ovojnica</dt><dd>${M("\\mathbf b([0,1])\\subseteq\\operatorname{conv}\\{\\mathbf b_0,\\ldots,\\mathbf b_n\\}", "b([0,1])⊆conv{b₀,…,bₙ}")}.</dd></div>
          <div class="notation-item"><dt>Afina preslikava</dt><dd>${M("\\Phi(\\mathbf b(t))=\\sum_i\\Phi(\\mathbf b_i)B_i^n(t)", "Φ(b(t))=ΣΦ(bᵢ)Bᵢⁿ(t)")}.</dd></div>
        </div>
        <h3>Višanje stopnje brez spremembe krivulje</h3>
        ${panel(
          "\\widetilde{\\mathbf b}_0=\\mathbf b_0,\\quad\\widetilde{\\mathbf b}_{n+1}=\\mathbf b_n,\\quad \\widetilde{\\mathbf b}_i=\\frac{i}{n+1}\\mathbf b_{i-1}+\\left(1-\\frac{i}{n+1}\\right)\\mathbf b_i.",
          "b̃₀=b₀, b̃ₙ₊₁=bₙ, b̃ᵢ=i bᵢ₋₁/(n+1)+(1−i/(n+1))bᵢ",
          "višanje stopnje"
        )}
      `),
      section("proof", "05 / ključni dokaz", "Konveksna ovojnica in afina invariantnost", proof({
        idea: "Bernsteinove bazne funkcije so konveksne uteži. Prav to hkrati pojasni geometrijski nadzor in pravilno obnašanje pri afinih preslikavah.",
        steps: [
          {
            title: "Nenegativnost",
            body: `Za ${M("0\\le t\\le1", "0≤t≤1")} sta t in 1−t nenegativna, zato ${M("B_i^n(t)\\ge0", "Bᵢⁿ(t)≥0")} za vsak i.`,
            reason: "Tudi binomski koeficient je pozitiven."
          },
          {
            title: "Razčlenitev enote",
            body: panel(
              "\\sum_{i=0}^{n}B_i^n(t)=\\sum_{i=0}^{n}\\binom ni t^i(1-t)^{n-i}=(t+1-t)^n=1.",
              "ΣBᵢⁿ(t)=1",
              "binomski izrek"
            ),
            reason: "Vsota Bernsteinovih uteži je binomski razvoj števila 1."
          },
          {
            title: "Konveksna kombinacija",
            body: `${M("\\mathbf b(t)=\\sum_iB_i^n(t)\\mathbf b_i", "b(t)=ΣBᵢⁿbᵢ")} je torej kombinacija kontrolnih točk z nenegativnimi koeficienti vsote ena.`,
            reason: "To je definicija konveksne kombinacije, zato b(t) leži v njihovi konveksni ovojnici."
          },
          {
            title: "Afina transformacija",
            body: `Za ${M("\\Phi(\\mathbf x)=A\\mathbf x+\\mathbf v", "Φ(x)=Ax+v")} velja
              ${M("\\Phi(\\mathbf b(t))=A\\sum_iB_i^n\\mathbf b_i+\\mathbf v=\\sum_iB_i^n(A\\mathbf b_i+\\mathbf v)", "Φ(b(t))=ΣBᵢⁿΦ(bᵢ)")}.`,
            reason: "Vektor v lahko prenesemo v vsoto, ker ΣBᵢⁿ=1."
          }
        ],
        conclusion: "Za transformacijo krivulje je dovolj transformirati kontrolne točke. Konveksna ovojnica pa daje uporaben, vendar enosmeren geometrijski certifikat.",
        source: "glavno gradivo, razdelki 2.1.1 in 2.1.3"
      })),
      section("example", "06 / mini primer", "Kvadratna Bézierjeva krivulja pri polovici", example(
        "Tri kontrolne točke",
        `Naj bodo ${M("\\mathbf b_0=(0,0),\\mathbf b_1=(2,2),\\mathbf b_2=(4,0)", "b₀=(0,0), b₁=(2,2), b₂=(4,0)")}.`,
        [
          `Za n=2 so ${M("B_0^2=(1-t)^2,\\ B_1^2=2t(1-t),\\ B_2^2=t^2", "B₀²=(1−t)², B₁²=2t(1−t), B₂²=t²")}.`,
          `Pri ${M("t=1/2", "t=1/2")} so uteži ${M("1/4,1/2,1/4", "1/4,1/2,1/4")}.`,
          `${M("\\mathbf b(1/2)=\\frac14(0,0)+\\frac12(2,2)+\\frac14(4,0)=(2,1)", "b(1/2)=(2,1)")}.`,
          `Začetna tangenta je ${M("2(\\mathbf b_1-\\mathbf b_0)=(4,4)", "b′(0)=(4,4)")} in končna ${M("2(\\mathbf b_2-\\mathbf b_1)=(4,-4)", "b′(1)=(4,−4)")}.`
        ],
        "Točka (2,1) je konveksna kombinacija kontrolnih točk in leži v njihovem trikotniku."
      )),
      section("questions", "07 / podvprašanja", "Lastnosti, ki jih profesor rad izolira", followups([
        ["Ali krivulja interpolira vse kontrolne točke?", "Ne. Vedno interpolira prvo in zadnjo. Skozi notranjo kontrolno točko gre le v posebnih primerih."],
        ["Kaj določa kontrolni poligon?", "Geometrijsko usmerja obliko, poda krajiščni tangenti in konveksno ovojnico. Z višanjem stopnje se kontrolni poligon približuje krivulji."],
        ["Kaj dobimo, če obrnemo vrstni red kontrolnih točk?", `Isto geometrijsko krivuljo v nasprotni smeri: novi predpis je ${M("\\widetilde{\\mathbf b}(t)=\\mathbf b(1-t)", "b̃(t)=b(1−t)")}.`],
        ["Ali parameter t meri dolžino loka?", "Praviloma ne. Enaki koraki v t ne pomenijo enakih geometrijskih razdalj."],
        ["Zakaj je afina invariantnost praktična?", "Premik, rotacijo, skaliranje ali strig izvedemo na n+1 kontrolnih točkah; ni treba transformirati velikega vzorca točk krivulje."],
        ["Kaj pomeni višanje stopnje?", "Isto krivuljo zapišemo z več kontrolnimi točkami in bazo višje stopnje; oblika se ne spremeni."]
      ])),
      section("warning", "08 / pasti", "Ne zamenjaj krivulje z njenim poligonom", `
        <ul>
          <li>V ${M("B_i^n", "Bᵢⁿ")} sta eksponenta ${M("t^i(1-t)^{n-i}", "tⁱ(1−t)ⁿ⁻ⁱ")}; njuna zamenjava obrne indeksiranje.</li>
          <li>Kontrolne točke so vektorji, Bernsteinovi polinomi pa skalarne uteži.</li>
          <li>Konveksna ovojnica vsebuje krivuljo, vendar krivulja praviloma ne zapolni ovojnice.</li>
          <li>Če se ovojnica seka z oviro, še ne vemo, ali se seka tudi krivulja; prazen presek pa varnost zagotovi.</li>
          <li>Krajiščni tangentni vektor vsebuje faktor n; rob poligona pove smer, ne celotnega odvoda.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Pet lastnosti v enem dihu", `
        <p>Bézierjeva krivulja je ${M("\\mathbf b(t)=\\sum\\mathbf b_iB_i^n(t)", "b(t)=ΣbᵢBᵢⁿ(t)")}. Gre skozi b₀ in bₙ, tangenti določata prvi in zadnji rob kontrolnega poligona, zaradi nenegativnih uteži vsote ena leži v konveksni ovojnici, afine transformacije izvedemo na kontrolnih točkah, vrednosti pa stabilno računamo z de Casteljaujem.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-05-de-casteljau",
    number: 5,
    chapter: "2 · Računalniško podprto geometrijsko oblikovanje",
    title: "De Casteljaujev postopek",
    officialPrompt: prompts[5],
    accent: "#a78bfa",
    minutes: 8,
    deepLinks: ["bezier"],
    sections: [
      official(prompts[5]),
      section("plain", "01 / vzoren odgovor", "Algoritem povej kot zaporedje interpolacij", spoken([
        `»Za dano vrednost t začnem s kontrolnimi točkami kot ničtim nivojem: ${M("\\mathbf b_i^{(0)}=\\mathbf b_i", "bᵢ⁽⁰⁾=bᵢ")}.«`,
        `»Na vsakem naslednjem nivoju linearno interpoliram sosednji točki z istim parametrom t: vzamem delež 1−t leve in delež t desne.«`,
        `»Po n nivojih ostane ena sama točka ${M("\\mathbf b_0^{(n)}(t)", "b₀⁽ⁿ⁾(t)")}; ta je natanko vrednost Bézierjeve krivulje b(t).«`,
        `»Krivuljo lahko narišem tako, da postopek ponovim za gosto mrežo parametrov in točke povežem, ali pa krivuljo rekurzivno razdeljujem ter rišem dovolj ravne kontrolne poligone.«`,
        `»Prednost postopka je numerična stabilnost, uporablja samo konveksne kombinacije, obenem pa brez dodatnega računa dobimo kontrolne točke leve in desne podkrivulje.«`
      ])),
      section("notation", "02 / legenda", "Trikotna tabela ima dva indeksa", notation(
        "Zgornji indeks je nivo postopka, spodnji pa položaj točke znotraj tega nivoja.",
        [
          { tex: "\\mathbf b_i^{(0)}", symbol: "bᵢ⁽⁰⁾", name: "začetni nivo", meaning: " — originalna i-ta kontrolna točka." },
          { tex: "\\mathbf b_i^{(r)}(t)", symbol: "bᵢ⁽ʳ⁾(t)", name: "vmesna točka", meaning: " — i-ta točka na nivoju r." },
          { tex: "r=0,\\ldots,n", symbol: "r", name: "nivo", meaning: " — na vsakem nivoju je ena točka manj." },
          { tex: "i=0,\\ldots,n-r", symbol: "i", name: "lokalni indeks", meaning: " — dovoljen razpon na nivoju r." },
          { tex: "1-t,\\ t", symbol: "1−t, t", name: "uteži", meaning: " — nenegativni in vsote ena za t∈[0,1]." },
          { tex: "\\mathbf b_0^{(n)}(t)", symbol: "b₀⁽ⁿ⁾(t)", name: "rezultat", meaning: " — edina točka zadnjega nivoja, enaka b(t)." }
        ]
      )),
      section("board", "03 / tabla in skica", "Nariši trikotnik, ne le končne formule", sketch(
        `
          <svg viewBox="0 0 720 315" role="img" aria-label="De Casteljaujev trikotnik za kubično krivuljo" style="width:100%;height:auto">
            <rect width="720" height="315" rx="16" fill="#0b1015"/>
            <g stroke="#66727d" stroke-width="2">
              <line x1="95" y1="58" x2="95" y2="255"/><line x1="95" y1="58" x2="300" y2="90"/>
              <line x1="95" y1="125" x2="300" y2="90"/><line x1="95" y1="125" x2="300" y2="157"/>
              <line x1="95" y1="190" x2="300" y2="157"/><line x1="95" y1="190" x2="300" y2="222"/>
              <line x1="95" y1="255" x2="300" y2="222"/>
              <line x1="300" y1="90" x2="500" y2="126"/><line x1="300" y1="157" x2="500" y2="126"/>
              <line x1="300" y1="157" x2="500" y2="193"/><line x1="300" y1="222" x2="500" y2="193"/>
              <line x1="500" y1="126" x2="635" y2="160"/><line x1="500" y1="193" x2="635" y2="160"/>
            </g>
            <g fill="#f2f5f7"><circle cx="95" cy="58" r="7"/><circle cx="95" cy="125" r="7"/><circle cx="95" cy="190" r="7"/><circle cx="95" cy="255" r="7"/></g>
            <g fill="#67d8ff"><circle cx="300" cy="90" r="7"/><circle cx="300" cy="157" r="7"/><circle cx="300" cy="222" r="7"/></g>
            <g fill="#ff7a90"><circle cx="500" cy="126" r="8"/><circle cx="500" cy="193" r="8"/></g>
            <circle cx="635" cy="160" r="10" fill="#ffbd7a"/>
            <text x="74" y="35" fill="#f2f5f7">r=0</text><text x="278" y="35" fill="#67d8ff">r=1</text><text x="478" y="35" fill="#ff7a90">r=2</text><text x="613" y="35" fill="#ffbd7a">r=3</text>
            <text x="649" y="165" fill="#ffbd7a">b(t)</text>
          </svg>
        `,
        [
          "V prvi stolpec napiši b₀,b₁,…,bₙ.",
          `Nad puščico napiši pravilo ${M("(1-t)\\cdot\\text{leva}+t\\cdot\\text{desna}", "(1−t)·leva+t·desna")}.`,
          "Vsak naslednji stolpec naj ima eno točko manj.",
          `Ob zadnjo točko napiši ${M("\\mathbf b_0^{(n)}(t)=\\mathbf b(t)", "b₀⁽ⁿ⁾(t)=b(t)")}.`,
          "Z drugo barvo označi levi in desni rob trikotnika — to sta kontrolna poligona podkrivulj."
        ],
        "Za kubično krivuljo izvedemo tri nivoje. Vsaka nova točka leži na daljici prejšnjega nivoja."
      )),
      section("formal", "04 / algoritem", "Rekurzija in risanje krivulje", `
        ${panel(
          "\\mathbf b_i^{(0)}=\\mathbf b_i,\\qquad \\mathbf b_i^{(r)}(t)=(1-t)\\mathbf b_i^{(r-1)}(t)+t\\mathbf b_{i+1}^{(r-1)}(t).",
          "bᵢ⁽⁰⁾=bᵢ; bᵢ⁽ʳ⁾=(1−t)bᵢ⁽ʳ⁻¹⁾+t bᵢ₊₁⁽ʳ⁻¹⁾",
          "de Casteljau"
        )}
        <p>Indeksi so ${M("r=1,\\ldots,n", "r=1,…,n")} in ${M("i=0,\\ldots,n-r", "i=0,…,n−r")}; rezultat je ${M("\\mathbf b(t)=\\mathbf b_0^{(n)}(t)", "b(t)=b₀⁽ⁿ⁾(t)")}.</p>
        ${theorem("Dva načina izrisa", `
          <ol>
            <li><strong>Vzorčenje:</strong> izberi ${M("0=t_0<\\cdots<t_N=1", "0=t₀<⋯<t_N=1")}, za vsak tⱼ izračunaj b(tⱼ) in sosednje točke poveži.</li>
            <li><strong>Subdivizija:</strong> navadno pri t=1/2 razdeli krivuljo; levi rob de Casteljaujevega trikotnika določi levo podkrivuljo, desni rob v obratnem vrstnem redu desno. Ponavljaj, dokler sta kontrolna poligona dovolj ravna.</li>
          </ol>
        `)}
        <p>Vzorčena lomljenka je približek, ne eksaktna krivulja. Subdivizija omogoča prilagodljivo gostoto prav tam, kjer je ukrivljenost večja.</p>
      `),
      section("proof", "05 / cel dokaz", "Zakaj zadnja točka res enaka Bernsteinovi vsoti", proof({
        idea: "Na vsakem nivoju r je de Casteljaujeva točka Bernsteinova kombinacija r+1 zaporednih začetnih kontrolnih točk. To dokažemo z indukcijo in Pascalovo identiteto.",
        steps: [
          {
            title: "Indukcijska trditev",
            body: panel(
              "\\mathbf b_i^{(r)}(t)=\\sum_{j=0}^{r}\\binom rj(1-t)^{r-j}t^j\\mathbf b_{i+j}.",
              "bᵢ⁽ʳ⁾=Σⱼ₌₀ʳ C(r,j)(1−t)ʳ⁻ʲtʲbᵢ₊ⱼ",
              "trditev"
            ),
            reason: "Pri r=n,i=0 je desna stran natanko Bézierjeva definicija."
          },
          {
            title: "Začetek r=0",
            body: `Vsota vsebuje le ${M("\\binom00\\mathbf b_i=\\mathbf b_i", "C(0,0)bᵢ=bᵢ")}, kar je ${M("\\mathbf b_i^{(0)}", "bᵢ⁽⁰⁾")}.`,
            reason: "Osnovni primer je definicija ničtega nivoja."
          },
          {
            title: "Indukcijski korak",
            body: `V rekurzijo vstavimo formulo za r−1. Prva vsota se pomnoži z 1−t, druga s t in se po premiku indeksa nanaša na iste točke ${M("\\mathbf b_{i+j}", "bᵢ₊ⱼ")}.`,
            reason: "Tako lahko združimo koeficienta vsake notranje kontrolne točke."
          },
          {
            title: "Pascalova identiteta",
            body: `Koeficient ob bᵢ₊ⱼ je ${M("\\binom{r-1}{j}+\\binom{r-1}{j-1}=\\binom rj", "C(r−1,j)+C(r−1,j−1)=C(r,j)")} krat ${M("(1-t)^{r-j}t^j", "(1−t)ʳ⁻ʲtʲ")}.`,
            reason: "Robna koeficienta sta prav tako pravilna, ker sta C(r,0)=C(r,r)=1."
          },
          {
            title: "Zadnji nivo",
            body: panel(
              "\\mathbf b_0^{(n)}(t)=\\sum_{j=0}^{n}\\mathbf b_jB_j^n(t)=\\mathbf b(t).",
              "b₀⁽ⁿ⁾(t)=ΣbⱼBⱼⁿ(t)=b(t)",
              "sklep",
              "accent"
            ),
            reason: "Indukcija velja za vse nivoje, zato posebej za r=n in i=0."
          }
        ],
        conclusion: "De Casteljau ni približna metoda za eno točko: v eksaktni aritmetiki izračuna natanko isto vrednost kot Bernsteinova formula.",
        source: "glavno gradivo, razdelek 2.1.2"
      })),
      section("example", "06 / mini primer", "Dva nivoja pri t=1/2", example(
        "Kvadratna krivulja",
        `Kontrolne točke so ${M("(0,0),(2,2),(4,0)", "(0,0),(2,2),(4,0)")} in ${M("t=1/2", "t=1/2")}.`,
        [
          `Prva točka nivoja 1: ${M("\\mathbf b_0^{(1)}=\\frac12(0,0)+\\frac12(2,2)=(1,1)", "b₀⁽¹⁾=(1,1)")}.`,
          `Druga: ${M("\\mathbf b_1^{(1)}=\\frac12(2,2)+\\frac12(4,0)=(3,1)", "b₁⁽¹⁾=(3,1)")}.`,
          `Zadnja: ${M("\\mathbf b_0^{(2)}=\\frac12(1,1)+\\frac12(3,1)=(2,1)", "b₀⁽²⁾=(2,1)")}.`
        ],
        `${M("\\mathbf b(1/2)=(2,1)", "b(1/2)=(2,1)")}. Levi rob (b₀,(1,1),(2,1)) in desni rob ((2,1),(3,1),b₂) določita podkrivulji.`
      )),
      section("questions", "07 / podvprašanja", "Od algoritma do implementacije", followups([
        ["Kolikšna je časovna zahtevnost za eno točko?", `Seštejemo n+(n−1)+⋯+1 parov, zato ${M("O(n^2)", "O(n²)")} operacij in z zapisom na mestu O(n) pomnilnika.`],
        ["Zakaj je postopek stabilen?", "Uporablja zaporedne linearne oziroma konveksne kombinacije in se izogne velikim izmeničnim koeficientom potenčne baze."],
        ["Kako dobimo podkrivulji?", "Kontrolne točke leve so b₀⁽⁰⁾,b₀⁽¹⁾,…,b₀⁽ⁿ⁾; desne pa b₀⁽ⁿ⁾,b₁⁽ⁿ⁻¹⁾,…,bₙ⁽⁰⁾."],
        ["Ali enakomerni koraki t dajo enakomerno razporejene točke?", "Ne, ker parametrizacija praviloma ni po dolžini loka."],
        ["Kako ocenimo, da je podkrivulja dovolj ravna?", "Na primer z razdaljami notranjih kontrolnih točk od daljice med krajiščema; če so dovolj majhne, kontrolni poligon dobro nadomesti krivuljo."],
        ["Kaj se zgodi pri t=0 ali t=1?", "Vse interpolacije izberejo le levi oziroma desni konec, zato dobimo b₀ oziroma bₙ."]
      ])),
      section("warning", "08 / pasti", "Majhne napake v indeksih uničijo trikotnik", `
        <ul>
          <li>Na nivoju r je indeks i največ n−r, ne n.</li>
          <li>Utež t pripada desni točki; ${M("(1-t)\\mathbf b_i+t\\mathbf b_{i+1}", "(1−t)bᵢ+tbᵢ₊₁")}.</li>
          <li>Za vse nivoje uporabljaš isti t.</li>
          <li>Pri računanju na mestu prepisuj točke v smeri, ki ne uniči še potrebnih starih vrednosti, ali uporabi novo tabelo.</li>
          <li>Povezovanje končnega števila vzorcev nariše lomljen približek, ne matematično eksaktne krivulje.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Algoritem v eni formuli", `
        <p>Postavim ${M("\\mathbf b_i^{(0)}=\\mathbf b_i", "bᵢ⁽⁰⁾=bᵢ")} in ponavljam ${M("\\mathbf b_i^{(r)}=(1-t)\\mathbf b_i^{(r-1)}+t\\mathbf b_{i+1}^{(r-1)}", "bᵢ⁽ʳ⁾=(1−t)bᵢ⁽ʳ⁻¹⁾+tbᵢ₊₁⁽ʳ⁻¹⁾")}. Po n nivojih je edina točka b(t). Za izris postopek ponavljam po mreži t ali uporabim rekurzivno subdivizijo; robova trikotnika sta kontrolna poligona podkrivulj.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-06-zlepek-bezierjevih-krivulj",
    number: 6,
    chapter: "2 · Računalniško podprto geometrijsko oblikovanje",
    title: "Zlepek Bézierjevih krivulj",
    officialPrompt: prompts[6],
    accent: "#ff7a90",
    minutes: 10,
    deepLinks: ["bezier", "bezier-zlepki"],
    sections: [
      official(prompts[6]),
      section("plain", "01 / vzoren odgovor", "Najprej odvod, nato parametrični in geometrijski stik", spoken([
        `»Odvod Bézierjeve krivulje stopnje n je spet Bézierjeva krivulja, zdaj stopnje n−1. Njene kontrolne točke so prve diference prvotnih kontrolnih točk, pomnožene z n.«`,
        `»Za stik dveh krivulj moram najprej obe lokalni parametrizaciji [0,1] prenesti na njuna globalna intervala. To je pomembno, ker se globalni odvodi po verižnem pravilu delijo z dolžino parametrskega intervala.«`,
        `»Zveznost ${M("C^0", "C⁰")} zahteva, da se zadnja kontrolna točka leve in prva desne ujemata.«`,
        `»Zvezna odvedljivost ${M("C^1", "C¹")} zahteva še enakost globalnih tangentnih vektorjev, zato moramo upoštevati stopnji obeh krivulj in dolžini intervalov.«`,
        `»Geometrijska zveznost ${M("G^1", "G¹")} je šibkejša: položaj se ujema, tangenti pa morata imeti isto usmerjeno smer; njuni dolžini se smeta razlikovati. Zato je G¹ neodvisen od hitrosti parametrizacije.«`
      ])),
      section("notation", "02 / legenda", "Tri vrste gladkosti in dva parametra", notation(
        "Leva krivulja uporablja lokalni t, desna lokalni s, celoten zlepek pa globalni u.",
        [
          { tex: "\\mathbf b(t),\\ t\\in[0,1]", symbol: "b(t)", name: "levi kos", meaning: " — Bézierjeva krivulja stopnje n." },
          { tex: "\\mathbf c(s),\\ s\\in[0,1]", symbol: "c(s)", name: "desni kos", meaning: " — Bézierjeva krivulja stopnje m." },
          { tex: "u_0<u_1<u_2", symbol: "u₀<u₁<u₂", name: "globalna delitev", meaning: " — stik je pri u₁." },
          { tex: "h_b=u_1-u_0,\\ h_c=u_2-u_1", symbol: "h_b,h_c", name: "parametrski dolžini", meaning: " — vplivata na globalno hitrost." },
          { tex: "\\Delta\\mathbf b_i=\\mathbf b_{i+1}-\\mathbf b_i", symbol: "Δbᵢ", name: "diferenca", meaning: " — kontrolna točka odvodne krivulje pred faktorjem n." },
          { tex: "C^0", symbol: "C⁰", name: "zveznost", meaning: " — enak položaj v stiku." },
          { tex: "C^1", symbol: "C¹", name: "parametrična gladkost", meaning: " — enak položaj in enak globalni odvod." },
          { tex: "G^1", symbol: "G¹", name: "geometrijska gladkost", meaning: " — enak položaj in ista usmerjena tangentna premica." }
        ]
      )),
      section("board", "03 / tabla in skica", "Na sliki loči smer od velikosti hitrosti", sketch(
        `
          <svg viewBox="0 0 720 275" role="img" aria-label="Stik dveh Bézierjevih krivulj" style="width:100%;height:auto">
            <rect width="720" height="275" rx="16" fill="#0b1015"/>
            <path d="M55 218 C145 48 245 82 355 145" fill="none" stroke="#a78bfa" stroke-width="7"/>
            <path d="M355 145 C470 210 565 197 670 63" fill="none" stroke="#67d8ff" stroke-width="7"/>
            <polyline points="55,218 150,35 270,92 355,145" fill="none" stroke="#776b88" stroke-width="2" stroke-dasharray="7 7"/>
            <polyline points="355,145 485,225 585,155 670,63" fill="none" stroke="#607d8d" stroke-width="2" stroke-dasharray="7 7"/>
            <circle cx="355" cy="145" r="10" fill="#ffbd7a"/>
            <line x1="270" y1="92" x2="452" y2="205" stroke="#ff7a90" stroke-width="5"/>
            <path d="M452 205 l-19 -2 10 -15 z" fill="#ff7a90"/>
            <text x="459" y="210" fill="#ff7a90">skupni dz/du pri C¹</text>
            <text x="326" y="123" fill="#ffbd7a">bₙ=c₀</text>
          </svg>
        `,
        [
          `Najprej izpelji ${M("\\mathbf b'(t)=n\\sum\\Delta\\mathbf b_iB_i^{n-1}(t)", "b′=nΣΔbᵢBᵢⁿ⁻¹")}.`,
          `Nariši dva kontrolna poligona s skupno točko ${M("\\mathbf b_n=\\mathbf c_0", "bₙ=c₀")}.`,
          `Pod sliko napiši lokalna parametra ${M("t=(u-u_0)/h_b", "t=(u−u₀)/h_b")} in ${M("s=(u-u_1)/h_c", "s=(u−u₁)/h_c")}.`,
          "Za C¹ nariši eno samo tangentno puščico in napiši enakost globalnih odvodov.",
          "Za G¹ nariši dve različno dolgi, toda enako usmerjeni puščici."
        ],
        "C¹ govori o gibanju po parametru u; G¹ samo o vizualni smeri krivulje."
      )),
      section("formal", "04 / natančen zapis", "Odvodna krivulja in vsi pogoji v stiku", `
        ${theorem("Odvodi v Bézierjevi obliki", `
          ${panel(
            "\\mathbf b'(t)=n\\sum_{i=0}^{n-1}\\Delta\\mathbf b_i B_i^{n-1}(t),\\qquad \\Delta\\mathbf b_i=\\mathbf b_{i+1}-\\mathbf b_i.",
            "b′(t)=nΣᵢ₌₀ⁿ⁻¹ΔbᵢBᵢⁿ⁻¹(t)",
            "prvi odvod"
          )}
          ${panel(
            "\\mathbf b^{(r)}(t)=\\frac{n!}{(n-r)!}\\sum_{i=0}^{n-r}\\Delta^r\\mathbf b_iB_i^{n-r}(t),\\qquad r\\le n.",
            "b⁽ʳ⁾=n!/(n−r)! ΣΔʳbᵢBᵢⁿ⁻ʳ",
            "višji odvodi"
          )}
        `)}
        <p>Globalni zlepek je</p>
        ${panel(
          "\\mathbf z(u)=\\begin{cases}\\mathbf b((u-u_0)/h_b),&u\\in[u_0,u_1],\\\\\\mathbf c((u-u_1)/h_c),&u\\in[u_1,u_2].\\end{cases}",
          "z(u)=b((u−u₀)/h_b) levo, c((u−u₁)/h_c) desno",
          "reparametriziran zlepek"
        )}
        <div class="notation-grid">
          <div class="notation-item"><dt>C⁰</dt><dd>${M("\\mathbf b_n=\\mathbf c_0", "bₙ=c₀")}.</dd></div>
          <div class="notation-item"><dt>C¹</dt><dd>Ob C⁰ še ${M("\\frac n{h_b}(\\mathbf b_n-\\mathbf b_{n-1})=\\frac m{h_c}(\\mathbf c_1-\\mathbf c_0)", "n(bₙ−bₙ₋₁)/h_b=m(c₁−c₀)/h_c")}.</dd></div>
          <div class="notation-item"><dt>G¹</dt><dd>Ob C⁰ obstaja ${M("\\alpha>0", "α>0")}, da ${M("\\mathbf b_n-\\mathbf b_{n-1}=\\alpha(\\mathbf c_1-\\mathbf c_0)", "bₙ−bₙ₋₁=α(c₁−c₀)")}.</dd></div>
        </div>
        <p>V uradnem gradivu sta kosa iste stopnje n. Tedaj se n pokrajša in C¹-postane ${M("\\Delta\\mathbf b_{n-1}/h_b=\\Delta\\mathbf c_0/h_c", "Δbₙ₋₁/h_b=Δc₀/h_c")}.</p>
        <p>Za C² dodamo enakost ${M("\\frac{n(n-1)}{h_b^2}\\Delta^2\\mathbf b_{n-2}=\\frac{m(m-1)}{h_c^2}\\Delta^2\\mathbf c_0", "n(n−1)Δ²bₙ₋₂/h_b²=m(m−1)Δ²c₀/h_c²")}.</p>
      `),
      section("proof", "05 / ključna izpeljava", "Od odvoda Bernsteinove baze do pogoja C¹", proof({
        idea: "Najprej odvedemo Bernsteinovo vsoto in združimo sosednje kontrolne točke v diference. Nato v krajiščih ostane ena sama diferenca, verižno pravilo pa doda faktorja 1/h.",
        steps: [
          {
            title: "Odvod bazne funkcije",
            body: panel(
              "\\frac d{dt}B_i^n(t)=n\\left(B_{i-1}^{n-1}(t)-B_i^{n-1}(t)\\right).",
              "dBᵢⁿ/dt=n(Bᵢ₋₁ⁿ⁻¹−Bᵢⁿ⁻¹)",
              "bazna identiteta"
            ),
            reason: "Sledi z neposrednim odvajanjem binomskega zapisa in identitetama za binomske koeficiente."
          },
          {
            title: "Odvedemo krivuljo in premaknemo indeks",
            body: `${M("\\mathbf b'=\\sum_i\\mathbf b_i(B_i^n)'", "b′=Σbᵢ(Bᵢⁿ)′")} postane razlika dveh vsot. Po premiku indeksa je koeficient ob ${M("B_i^{n-1}", "Bᵢⁿ⁻¹")} enak ${M("n(\\mathbf b_{i+1}-\\mathbf b_i)", "n(bᵢ₊₁−bᵢ)")}.`,
            reason: "Tako dobimo odvodno Bézierjevo krivuljo z diferenčnimi kontrolnimi točkami."
          },
          {
            title: "Krajiščna odvoda",
            body: panel(
              "\\mathbf b'(1)=n\\Delta\\mathbf b_{n-1},\\qquad \\mathbf c'(0)=m\\Delta\\mathbf c_0.",
              "b′(1)=nΔbₙ₋₁, c′(0)=mΔc₀",
              "lokalni tangenti"
            ),
            reason: "Pri t=1 je neničeln le zadnji Bernsteinov polinom, pri s=0 le prvi."
          },
          {
            title: "Verižno pravilo",
            body: `Na levi je ${M("dt/du=1/h_b", "dt/du=1/h_b")}, na desni ${M("ds/du=1/h_c", "ds/du=1/h_c")}. Zato sta globalna enostranska odvoda ${M("n\\Delta\\mathbf b_{n-1}/h_b", "nΔbₙ₋₁/h_b")} in ${M("m\\Delta\\mathbf c_0/h_c", "mΔc₀/h_c")}.`,
            reason: "C¹ zahteva odvoda po istem globalnem parametru u."
          },
          {
            title: "Pogoja C¹ in G¹",
            body: `Enakost globalnih vektorjev da formulo C¹. Če zahtevamo samo isto usmerjeno smer, lahko enega pomnožimo s poljubnim pozitivnim faktorjem — to je G¹.`,
            reason: "Pozitivno skaliranje spremeni hitrost, ne pa tangentne smeri; negativno bi smer obrnilo."
          }
        ],
        conclusion: "Faktorji stopnje in parametrskega intervala pri C¹ niso okras, ampak posledica odvoda in verižnega pravila. Pri G¹ se pozitivni faktorji absorbirajo, zato je pogoj geometrijski.",
        source: "glavno gradivo, razdelka 2.2.1–2.2.2"
      })),
      section("example", "06 / mini primer", "Poišči skupno kontrolno točko za C¹", example(
        "Dve kubični krivulji na enako dolgih intervalih",
        `Podani sta zadnja predhodna točka ${M("\\mathbf b_2=(-1,1)", "b₂=(−1,1)")} in prva naslednja ${M("\\mathbf c_1=(1,-1)", "c₁=(1,−1)")}. Naj bo ${M("\\mathbf p=\\mathbf b_3=\\mathbf c_0", "p=b₃=c₀")}.`,
        [
          `C⁰ je že vgrajen z izbiro skupne točke p.`,
          `Ker sta stopnji in intervala enaka, C¹ zahteva ${M("\\mathbf p-\\mathbf b_2=\\mathbf c_1-\\mathbf p", "p−b₂=c₁−p")}.`,
          `Torej ${M("2\\mathbf p=\\mathbf b_2+\\mathbf c_1=(0,0)", "2p=b₂+c₁=(0,0)")} in ${M("\\mathbf p=(0,0)", "p=(0,0)")}.`,
          `Oba globalna odvoda sta ${M("3(1,-1)=(3,-3)", "3(1,−1)=(3,−3)")}.`
        ],
        "Spoj je C¹. Za samo G¹ bi lahko p izbrali kjerkoli strogo med b₂ in c₁; tangentna vektorja bi bila pozitivna večkratnika."
      )),
      section("questions", "07 / podvprašanja", "Profesor preveri, ali res ločiš parametrizacijo od oblike", followups([
        ["Zakaj je odvod spet Bézierjeva krivulja?", "Po odvajanju Bernsteinove baze in premiku indeksov dobimo Bernsteinovo vsoto stopnje n−1 s kontrolnimi vektorji nΔbᵢ."],
        ["Ali C¹ vedno pomeni G¹?", "Da, če je skupna tangenta neničelna. Enaka vektorja imata seveda isto smer. Obratno ne velja."],
        ["Zakaj G¹ ne vsebuje h_b in h_c?", "Pozitivna reparametrizacija tangentni vektor samo pozitivno skalarno pomnoži; smer se ne spremeni."],
        ["Kaj se fizično zgodi, če ni C¹?", "Pri gibanju po zlepku hitrost v stiku skoči. Če je spoj samo G¹, pot vizualno nima kota, a velikost hitrosti se lahko spremeni."],
        ["Kaj se zgodi, če ni C²?", "Pospešek je lahko nezvezen. To je pomembno pri načrtovanju gibanja."],
        ["Kaj če sta stopnji različni?", `Uporabimo splošni pogoj ${M("n\\Delta\\mathbf b_{n-1}/h_b=m\\Delta\\mathbf c_0/h_c", "nΔbₙ₋₁/h_b=mΔc₀/h_c")}; faktorja n in m se ne pokrajšata.`]
      ])),
      section("warning", "08 / pasti", "Tri skoraj enake formule imajo različen pomen", `
        <ul>
          <li>C⁰ mora veljati pred C¹ ali G¹: brez skupne točke ni zlepka.</li>
          <li>Ne izenačuj lokalnih odvodov, če sta globalna intervala različno dolga.</li>
          <li>Pri različnih stopnjah ne pozabi faktorjev n in m.</li>
          <li>G¹ zahteva <em>pozitiven</em> skalarni faktor; negativen faktor pomeni nasprotno usmeritev.</li>
          <li>Če je tangenta ničelna, preprost test smeri ni dovolj; pregledati moramo prve neničelne odvode.</li>
          <li>Enakost drugega odvoda brez C⁰ in C¹ še ne pomeni C²-spoja.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Odvod in tri gladkosti", `
        <p>Odvod je ${M("\\mathbf b'=n\\sum\\Delta\\mathbf b_iB_i^{n-1}", "b′=nΣΔbᵢBᵢⁿ⁻¹")}. C⁰ zahteva bₙ=c₀. C¹ zahteva še ${M("n\\Delta\\mathbf b_{n-1}/h_b=m\\Delta\\mathbf c_0/h_c", "nΔbₙ₋₁/h_b=mΔc₀/h_c")}, ker primerjamo globalna odvoda po u. G¹ zahteva le, da sta diferenčna vektorja pozitivna skalarna večkratnika, zato je vizualno gladek, hitrost pa se lahko spremeni.</p>
      `)
    ]
  });

  topics.push({
    id: "oral-07-konstrukcija-bezierjevih-zlepkov",
    number: 7,
    chapter: "2 · Računalniško podprto geometrijsko oblikovanje",
    title: "Konstrukcija zlepkov Bézierjevih krivulj",
    officialPrompt: prompts[7],
    accent: "#67d8ff",
    minutes: 10,
    deepLinks: ["bezier-zlepki", "zlepki"],
    sections: [
      official(prompts[7]),
      section("plain", "01 / vzoren odgovor", "Dve konstrukciji, dva tipa vhodnih podatkov", spoken([
        `»Bézierjeve krivulje nizke stopnje lepimo, ker z enim kosom težko opišemo kompleksno obliko, visoka stopnja pa izgubi lokalni nadzor in je numerično manj priročna.«`,
        `»Pri kvadratnem C¹-zlepku izberemo m+2 točk ${M("\\mathbf p_0,\\ldots,\\mathbf p_{m+1}", "p₀,…,pₘ₊₁")}. Notranje pᵢ postavimo kot srednje kontrolne točke posameznih kvadratnih kosov; skupne končne točke sosednjih kosov dobimo kot utežena povprečja pᵢ in pᵢ₊₁.«`,
        `»Uteži določi razmerje dolžin sosednjih parametrskih intervalov. Izpeljava pride neposredno iz enakosti levega in desnega globalnega odvoda.«`,
        `»Pri kubičnem C¹-zlepku podamo interpolacijske točke p₀,…,pₘ in tangentne vektorje v₀,…,vₘ. Na vsakem intervalu štiri kontrolne točke dobimo iz obeh krajišč in obeh tangent.«`,
        `»Sosednja kubična kosa zato avtomatično interpolirata isto pᵢ in imata isti globalni odvod vᵢ. Če želimo C², notranje vektorje vᵢ določimo s tridiagonalnim sistemom.«`
      ])),
      section("notation", "02 / legenda", "Pri kvadratni in kubični konstrukciji pᵢ nima iste vloge", notation(
        "To je pomembna razlika: pri kvadratni konstrukciji so pᵢ predvsem oblikovne kontrolne točke, pri kubični pa interpolirane točke zlepka.",
        [
          { tex: "u_0<\\cdots<u_m", symbol: "u₀<⋯<uₘ", name: "stični parametri", meaning: " — določijo m segmentov." },
          { tex: "h_i=u_i-u_{i-1}", symbol: "hᵢ", name: "dolžina i-tega intervala", meaning: " — i=1,…,m." },
          { tex: "\\mathbf b_j^{(i)}", symbol: "bⱼ⁽ⁱ⁾", name: "kontrolna točka i-tega kosa", meaning: " — j=0,1,2 pri kvadratnem in j=0,1,2,3 pri kubičnem." },
          { tex: "\\mathbf p_i", symbol: "pᵢ", name: "podana točka", meaning: " — njena vloga je odvisna od konstrukcije." },
          { tex: "\\mathbf v_i", symbol: "vᵢ", name: "globalni tangentni vektor", meaning: " — pri kubičnem zlepku je z′(uᵢ)=vᵢ." },
          { tex: "\\mathbf q_i", symbol: "qᵢ", name: "kvadratna stična točka", meaning: " — skupna b₂⁽ⁱ⁾=b₀⁽ⁱ⁺¹⁾." },
          { tex: "\\Delta\\mathbf p_i=\\mathbf p_{i+1}-\\mathbf p_i", symbol: "Δpᵢ", name: "razlika podatkov", meaning: " — nastopa v C²-sistemu za kubični zlepek." }
        ]
      )),
      section("board", "03 / tabla in skica", "Nariši kontrolne poligone obeh konstrukcij", sketch(
        `
          <svg viewBox="0 0 720 310" role="img" aria-label="Kvadratni in kubični Bézierjev zlepek" style="width:100%;height:auto">
            <rect width="720" height="310" rx="16" fill="#0b1015"/>
            <text x="36" y="34" fill="#67d8ff" font-size="16">kvadratni C¹</text>
            <polyline points="48,138 135,58 232,104 328,65" fill="none" stroke="#71818c" stroke-width="2" stroke-dasharray="7 6"/>
            <path d="M48 138 Q135 58 232 104 Q280 86 328 65" fill="none" stroke="#67d8ff" stroke-width="6"/>
            <g fill="#ffbd7a"><circle cx="48" cy="138" r="6"/><circle cx="135" cy="58" r="7"/><circle cx="232" cy="104" r="9"/><circle cx="328" cy="65" r="7"/></g>
            <text x="211" y="132" fill="#ffbd7a">qᵢ</text>
            <text x="378" y="34" fill="#ff7a90" font-size="16">kubični C¹</text>
            <polyline points="388,137 454,52 541,52 630,137" fill="none" stroke="#71818c" stroke-width="2" stroke-dasharray="7 6"/>
            <path d="M388 137 C454 52 541 52 630 137" fill="none" stroke="#ff7a90" stroke-width="6"/>
            <g fill="#ffbd7a"><circle cx="388" cy="137" r="8"/><circle cx="454" cy="52" r="6"/><circle cx="541" cy="52" r="6"/><circle cx="630" cy="137" r="8"/></g>
            <line x1="388" y1="137" x2="443" y2="66" stroke="#a78bfa" stroke-width="4"/><line x1="630" y1="137" x2="557" y2="67" stroke="#a78bfa" stroke-width="4"/>
            <line x1="35" y1="184" x2="685" y2="184" stroke="#3f4b54" stroke-width="2"/>
            <text x="48" y="218" fill="#b8c2c9">kvadratni: pᵢ sta srednji kontroli → qᵢ iz C¹</text>
            <text x="48" y="252" fill="#b8c2c9">kubični: pᵢ sta krajišči, vᵢ tangenti → dve notranji kontroli</text>
          </svg>
        `,
        [
          "Levo nariši dva kvadratna kontrolna trikotnika s skupnim qᵢ.",
          `Pod njiju napiši ${M("2(\\mathbf q_i-\\mathbf p_i)/h_i=2(\\mathbf p_{i+1}-\\mathbf q_i)/h_{i+1}", "2(qᵢ−pᵢ)/hᵢ=2(pᵢ₊₁−qᵢ)/hᵢ₊₁")}.`,
          "Desno nariši kubični kontrolni poligon med pᵢ₋₁ in pᵢ ter tangentni puščici.",
          `Ob njem napiši štiri kontrolne točke ${M("\\mathbf p_{i-1},\\ \\mathbf p_{i-1}+h_i\\mathbf v_{i-1}/3,\\ \\mathbf p_i-h_i\\mathbf v_i/3,\\ \\mathbf p_i", "pᵢ₋₁, pᵢ₋₁+hᵢvᵢ₋₁/3, pᵢ−hᵢvᵢ/3, pᵢ")}.`,
          "Zaključi: nizka stopnja + lokalni kosi + pogoji v stikih."
        ],
        "Kvadratni podani pᵢ niso nujno točke na krivulji; kubični pᵢ pa so interpolirana krajišča."
      )),
      section("formal", "04 / natančen zapis", "Kvadratna in kubična konstrukcija", `
        ${theorem("Kvadratni C¹-zlepek", `
          <p>Za m kvadratnih kosov in podane ${M("\\mathbf p_0,\\ldots,\\mathbf p_{m+1}", "p₀,…,pₘ₊₁")} postavimo</p>
          ${panel(
            "\\mathbf b_1^{(i)}=\\mathbf p_i,\\qquad i=1,\\ldots,m.",
            "b₁⁽ⁱ⁾=pᵢ",
            "srednje kontrole"
          )}
          <p>Za ${M("i=1,\\ldots,m-1", "i=1,…,m−1")} je skupna stična točka</p>
          ${panel(
            "\\mathbf q_i=\\mathbf b_2^{(i)}=\\mathbf b_0^{(i+1)}=\\frac{h_{i+1}}{h_i+h_{i+1}}\\mathbf p_i+\\frac{h_i}{h_i+h_{i+1}}\\mathbf p_{i+1}.",
            "qᵢ=b₂⁽ⁱ⁾=b₀⁽ⁱ⁺¹⁾=[hᵢ₊₁pᵢ+hᵢpᵢ₊₁]/(hᵢ+hᵢ₊₁)",
            "C¹-stik",
            "accent"
          )}
          <p>Konstrukcijo zapremo z ${M("\\mathbf b_0^{(1)}=(\\mathbf p_0+\\mathbf p_1)/2", "b₀⁽¹⁾=(p₀+p₁)/2")} in ${M("\\mathbf b_2^{(m)}=(\\mathbf p_m+\\mathbf p_{m+1})/2", "b₂⁽ᵐ⁾=(pₘ+pₘ₊₁)/2")}.</p>
        `)}
        ${theorem("Kubični C¹-zlepek", `
          <p>Podamo interpolacijske točke ${M("\\mathbf p_0,\\ldots,\\mathbf p_m", "p₀,…,pₘ")} in globalne odvode ${M("\\mathbf v_0,\\ldots,\\mathbf v_m", "v₀,…,vₘ")}. Na intervalu [uᵢ₋₁,uᵢ] so kontrole</p>
          ${panel(
            "\\mathbf b_0^{(i)}=\\mathbf p_{i-1},\\quad \\mathbf b_1^{(i)}=\\mathbf p_{i-1}+\\frac{h_i}{3}\\mathbf v_{i-1},\\quad \\mathbf b_2^{(i)}=\\mathbf p_i-\\frac{h_i}{3}\\mathbf v_i,\\quad \\mathbf b_3^{(i)}=\\mathbf p_i.",
            "b₀⁽ⁱ⁾=pᵢ₋₁, b₁⁽ⁱ⁾=pᵢ₋₁+hᵢvᵢ₋₁/3, b₂⁽ⁱ⁾=pᵢ−hᵢvᵢ/3, b₃⁽ⁱ⁾=pᵢ",
            "kubični Hermitov kos",
            "violet"
          )}
          <p>Vsak kos ima na levi globalni odvod vᵢ₋₁ in na desni vᵢ, zato je celoten zlepek C¹.</p>
        `)}
        <h3>Če želimo kubični C²-zlepek</h3>
        ${panel(
          "h_{i+1}\\mathbf v_{i-1}+2(h_i+h_{i+1})\\mathbf v_i+h_i\\mathbf v_{i+1}=3\\left(\\frac{h_{i+1}}{h_i}\\Delta\\mathbf p_{i-1}+\\frac{h_i}{h_{i+1}}\\Delta\\mathbf p_i\\right).",
          "hᵢ₊₁vᵢ₋₁+2(hᵢ+hᵢ₊₁)vᵢ+hᵢvᵢ₊₁=3[(hᵢ₊₁/hᵢ)Δpᵢ₋₁+(hᵢ/hᵢ₊₁)Δpᵢ]",
          "tridiagonalni sistem"
        )}
        <p>Sistem rešimo po koordinatah za notranje vᵢ; robna v₀,vₘ sta dodatna podatka ali ju izberemo, na primer ničelna.</p>
      `),
      section("proof", "05 / ključna izpeljava", "Od pogoja C¹ do vseh kontrolnih točk", proof({
        idea: "Pri kvadratnem zlepku neznano skupno krajišče dobimo iz enakosti globalnih odvodov. Pri kubičnem kosu pa iz predpisanih krajiščnih odvodov neposredno rešimo prvi in zadnji rob kontrolnega poligona.",
        steps: [
          {
            title: "Kvadratni stik po položaju",
            body: `Med i-tim in (i+1)-vim kosom postavimo ${M("\\mathbf q_i=\\mathbf b_2^{(i)}=\\mathbf b_0^{(i+1)}", "qᵢ=b₂⁽ⁱ⁾=b₀⁽ⁱ⁺¹⁾")}. Srednji kontroli sta ${M("\\mathbf b_1^{(i)}=\\mathbf p_i", "b₁⁽ⁱ⁾=pᵢ")} in ${M("\\mathbf b_1^{(i+1)}=\\mathbf p_{i+1}", "b₁⁽ⁱ⁺¹⁾=pᵢ₊₁")}.`,
            reason: "Skupna qᵢ zagotovi C⁰."
          },
          {
            title: "Kvadratni globalni tangenti",
            body: panel(
              "\\frac2{h_i}(\\mathbf q_i-\\mathbf p_i)=\\frac2{h_{i+1}}(\\mathbf p_{i+1}-\\mathbf q_i).",
              "2(qᵢ−pᵢ)/hᵢ=2(pᵢ₊₁−qᵢ)/hᵢ₊₁",
              "pogoj C¹"
            ),
            reason: "Kvadratna krajiščna odvoda sta 2(b₂−b₁) in 2(b₁−b₀), verižno pravilo pa doda 1/h."
          },
          {
            title: "Rešimo za qᵢ",
            body: `Po krajšanju 2 in množenju z ${M("h_ih_{i+1}", "hᵢhᵢ₊₁")} dobimo ${M("(h_i+h_{i+1})\\mathbf q_i=h_{i+1}\\mathbf p_i+h_i\\mathbf p_{i+1}", "(hᵢ+hᵢ₊₁)qᵢ=hᵢ₊₁pᵢ+hᵢpᵢ₊₁")}.`,
            reason: "Deljenje z vsoto intervalov da zapisano konveksno kombinacijo."
          },
          {
            title: "Kubični levi rob",
            body: `Za kubični kos na intervalu dolžine hᵢ je globalni začetni odvod ${M("\\frac3{h_i}(\\mathbf b_1^{(i)}-\\mathbf b_0^{(i)})=\\mathbf v_{i-1}", "3(b₁⁽ⁱ⁾−b₀⁽ⁱ⁾)/hᵢ=vᵢ₋₁")}. Ker je b₀⁽ⁱ⁾=pᵢ₋₁, sledi ${M("\\mathbf b_1^{(i)}=\\mathbf p_{i-1}+h_i\\mathbf v_{i-1}/3", "b₁⁽ⁱ⁾=pᵢ₋₁+hᵢvᵢ₋₁/3")}.`,
            reason: "Samo preuredimo krajiščno tangentno formulo."
          },
          {
            title: "Kubični desni rob",
            body: `Na desni je ${M("\\frac3{h_i}(\\mathbf b_3^{(i)}-\\mathbf b_2^{(i)})=\\mathbf v_i", "3(b₃⁽ⁱ⁾−b₂⁽ⁱ⁾)/hᵢ=vᵢ")}. Z b₃⁽ⁱ⁾=pᵢ dobimo ${M("\\mathbf b_2^{(i)}=\\mathbf p_i-h_i\\mathbf v_i/3", "b₂⁽ⁱ⁾=pᵢ−hᵢvᵢ/3")}.`,
            reason: "Sosednja kosa uporabita isti pᵢ in isti vᵢ, zato se avtomatično ujemata v vrednosti in globalnem prvem odvodu."
          }
        ],
        conclusion: "Obe konstrukciji sta neposredni posledici pogojev C⁰ in C¹. Pri kvadratni konstrukciji rešujemo za skupna krajišča, pri kubični pa za notranji kontrolni točki vsakega Hermitovega kosa.",
        source: "glavno gradivo, razdelka 2.2.3–2.2.4"
      })),
      section("example", "06 / mini primer", "Dva kvadratna kosa pri enakomerni parametrizaciji", example(
        "Štiri oblikovne točke",
        `Naj bodo ${M("\\mathbf p_0=(0,0),\\mathbf p_1=(1,2),\\mathbf p_2=(3,2),\\mathbf p_3=(4,0)", "p₀=(0,0), p₁=(1,2), p₂=(3,2), p₃=(4,0)")} in ${M("h_1=h_2=1", "h₁=h₂=1")}.`,
        [
          `Srednji kontroli sta ${M("\\mathbf b_1^{(1)}=\\mathbf p_1=(1,2)", "b₁⁽¹⁾=(1,2)")} in ${M("\\mathbf b_1^{(2)}=\\mathbf p_2=(3,2)", "b₁⁽²⁾=(3,2)")}.`,
          `Skupna točka je ${M("\\mathbf q_1=(\\mathbf p_1+\\mathbf p_2)/2=(2,2)", "q₁=(2,2)")}.`,
          `Robova sta ${M("\\mathbf b_0^{(1)}=(\\mathbf p_0+\\mathbf p_1)/2=(1/2,1)", "b₀⁽¹⁾=(1/2,1)")} in ${M("\\mathbf b_2^{(2)}=(\\mathbf p_2+\\mathbf p_3)/2=(7/2,1)", "b₂⁽²⁾=(7/2,1)")}.`,
          `Kontrolni trikotnik prvega kosa je ${M("((1/2,1),(1,2),(2,2))", "((1/2,1),(1,2),(2,2))")}; drugega ${M("((2,2),(3,2),(7/2,1))", "((2,2),(3,2),(7/2,1))")}.`,
          `Globalna odvoda v stiku sta oba ${M("2(1,0)=(2,0)", "(2,0)")}.`
        ],
        "Zlepek je C¹. Točki p₁ in p₂ sta notranji kontrolni točki, zato ju krivulja ni dolžna interpolirati."
      )),
      section("questions", "07 / podvprašanja", "Kaj moraš povedati, če profesor spremeni podatke", followups([
        ["Zakaj sploh lepimo več kosov?", "Dobimo kompleksne oblike z nizko lokalno stopnjo, lokalnim nadzorom, stabilnim vrednotenjem in možnostjo prilagodljive delitve intervala."],
        ["Ali kvadratni zlepek interpolira podane pᵢ?", "Na splošno ne. Notranje pᵢ so srednje kontrolne točke kosov; zlepek interpolira izračunana skupna krajišča qᵢ in izbrana zunanja krajišča."],
        ["Kaj pa kubični pᵢ?", "Ti so prava interpolacijska vozlišča: i-ti in (i+1)-vi kos se stikata v pᵢ."],
        ["Kako dobimo kubični C²-zlepek?", "Notranjih tangent vᵢ ne predpišemo poljubno, ampak jih izračunamo iz tridiagonalnega sistema, ki izenači druge odvode sosednjih Hermitovih kosov."],
        ["Kako izberemo stične parametre?", `Pogoste so ${M("\\alpha", "α")}-parametrizacije ${M("u_i-u_{i-1}=\\|\\mathbf p_i-\\mathbf p_{i-1}\\|^\\alpha", "hᵢ=‖pᵢ−pᵢ₋₁‖ᵅ")}: α=0 enakomerna, α=1/2 centripetalna, α=1 tetivna.`],
        ["Kako je Chaikin povezan s kvadratnim zlepkom?", "Chaikinovo ponavljajoče rezanje vogalov pri enakomerni parametrizaciji konvergira k ustreznemu C¹-kvadratnemu Bézierjevemu zlepku."]
      ])),
      section("warning", "08 / pasti", "Konstrukciji sta podobni samo na prvi pogled", `
        <ul>
          <li>Pri kvadratnem zlepku ne trdi, da krivulja interpolira vse pᵢ; ti so kontrolni podatki.</li>
          <li>Uteži v qᵢ so križne: pᵢ ima koeficient hᵢ₊₁, pᵢ₊₁ pa hᵢ.</li>
          <li>Pri kubičnem kosu se hᵢ/3 pri začetni kontroli prišteje, pri predzadnji pa odšteje.</li>
          <li>Vektorji vᵢ so odvodi po globalnem u. Če uporabiš lokalne odvode, faktor hᵢ ni isti.</li>
          <li>Poljubno izbrani vᵢ zagotavljajo C¹, ne avtomatično C².</li>
          <li>Za tridiagonalni C²-sistem potrebujemo še robna vektorja ali druga dva robna pogoja.</li>
        </ul>
      `),
      section("recap", "09 / 30 sekund", "Obe konstrukciji brez izpeljave", `
        <p><strong>Kvadratni C¹:</strong> b₁⁽ⁱ⁾=pᵢ, skupni stik je ${M("\\mathbf q_i=(h_{i+1}\\mathbf p_i+h_i\\mathbf p_{i+1})/(h_i+h_{i+1})", "qᵢ=(hᵢ₊₁pᵢ+hᵢpᵢ₊₁)/(hᵢ+hᵢ₊₁)")}; robova zapremo s polovičnima povprečjema. <strong>Kubični C¹:</strong> na [uᵢ₋₁,uᵢ] so kontrole ${M("\\mathbf p_{i-1},\\ \\mathbf p_{i-1}+h_i\\mathbf v_{i-1}/3,\\ \\mathbf p_i-h_i\\mathbf v_i/3,\\ \\mathbf p_i", "pᵢ₋₁, pᵢ₋₁+hᵢvᵢ₋₁/3, pᵢ−hᵢvᵢ/3, pᵢ")}. Tako se v stikih ujemata položaj in globalna tangenta.</p>
      `)
    ]
  });

  window.NUM2_ORAL_PART1 = topics;
})();
