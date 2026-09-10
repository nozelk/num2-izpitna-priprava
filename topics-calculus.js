(() => {
  "use strict";

  /* Datoteka se lahko naloži pred ui.js. Takrat izdelamo enako, majhno
     predstavitveno plast; če je StudyUI že na voljo, uporabimo njegove
     pomočnike neposredno. */
  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const UI = window.StudyUI || {};
  const M = UI.M || ((tex, fallback = tex, display = false) => {
    const mode = display ? ' data-display="block"' : "";
    const cls = display ? "js-math math-display" : "js-math math-inline";
    return `<span class="${cls}" data-tex="${escapeHtml(tex)}"${mode}>${escapeHtml(fallback)}</span>`;
  });
  const panel = UI.panel || ((tex, fallback = tex, label = "zapis", tone = "") =>
    `<div class="math-panel" data-label="${escapeHtml(label)}"${tone ? ` data-tone="${escapeHtml(tone)}"` : ""}>${M(tex, fallback, true)}</div>`);
  const notation = UI.notation || ((intro, entries) => `<p>${intro}</p><dl class="notation-grid">${entries.map(entry =>
    `<div class="notation-item"><dt class="notation-symbol">${M(entry.tex, entry.symbol)}</dt><dd class="notation-meaning"><strong>${entry.name}</strong>${entry.meaning}</dd></div>`
  ).join("")}</dl>`);
  const theorem = UI.theorem || ((name, body) => `<div class="theorem-card" data-name="${escapeHtml(name)}">${body}</div>`);
  const proof = UI.proof || ((item) => `<p class="proof-lead"><strong>Ideja.</strong> ${item.idea}</p><div class="proof-steps">${item.steps.map(step =>
    `<div class="proof-step"><strong>${step.title}</strong><div>${step.body}</div>${step.reason ? `<aside class="proof-reason"><strong>Zakaj ta korak velja?</strong><p>${step.reason}</p></aside>` : ""}</div>`
  ).join("")}</div><p>${item.conclusion}</p><div class="qed">konec dokaza</div>${item.source ? `<div class="source-note"><strong>Vir v gradivu:</strong> ${item.source}</div>` : ""}`);
  const logicChain = UI.logicChain || (rows => `<div class="logic-chain">${rows.map(row =>
    `<div class="logic-row"><strong>${row.left}</strong><span class="arrow">${row.arrow || "→"}</span><small>${row.right}</small></div>`
  ).join("")}</div>`);
  const sourceNote = UI.sourceNote || ((source, note = "") => `<div class="source-note"><strong>Vir v gradivu:</strong> ${source}${note ? ` · ${note}` : ""}</div>`);
  const section = UI.section || ((type, label, title, html) => ({ type, label, title, html }));
  const m = tex => M(tex, tex);
  const P = (tex, label = "zapis", tone = "") => panel(tex, tex, label, tone);
  const gradivo = `<a href="../../Za izpit/apm_nm2_gradivo.pdf" target="_blank" rel="noopener">APM — Numerične metode 2</a>`;
  const izpit2026 = `<a href="../apm_nm2_i1_2526.pdf" target="_blank" rel="noopener">1. izpit 2025/26</a>`;

  window.NUM2_TOPICS_CALCULUS = [
    {
      id: "odvajanje",
      number: 7,
      title: "Numerično odvajanje",
      short: "Iz točk zgradiš formulo za odvod, z momenti določiš uteži ter pravilno poiščeš red in ostanek.",
      accent: "#ffb84d",
      minutes: 15,
      oral: ["momentni sistem", "red in ostanek"],
      pdfs: [
        { name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" },
        { name: "1. izpit 2025/26 — naloga 3", file: "../apm_nm2_i1_2526.pdf" }
      ],
      sections: [
        section("notation", "01 · LEGENDA", "Kaj pomenijo vsi simboli", notation(
          `Pred izpeljavo si vedno nariši točke. Formula ni zbirka črk: vsaka črka pove, <em>kje</em> vzorčimo in <em>kaj</em> želimo približati.`,
          [
            { tex: String.raw`x_0`, symbol: "x₀", name: "osnovna točka", meaning: " — točka, v kateri iščemo odvod." },
            { tex: String.raw`h`, symbol: "h", name: "razmik", meaning: " — tipična razdalja med sosednjima vozliščema." },
            { tex: String.raw`\delta_k`, symbol: "δₖ", name: "odmik", meaning: " — dejanski premik k-te točke od x₀; lahko je −2h, h/3 ali karkoli podanega." },
            { tex: String.raw`A_k`, symbol: "Aₖ", name: "utež", meaning: " — neznani koeficient ob vrednosti funkcije." },
            { tex: String.raw`F_h(f)`, symbol: "Fₕ(f)", name: "numerična formula", meaning: " — linearna kombinacija izmerjenih vrednosti funkcije." },
            { tex: String.raw`p`, symbol: "p", name: "red odvoda", meaning: " — p = 1 za prvi in p = 2 za drugi odvod." },
            { tex: String.raw`r`, symbol: "r", name: "prvi neuspešni monom", meaning: " — hkrati red odvoda v členu ostanka." },
            { tex: String.raw`K f^{(r)}(\xi)`, symbol: "K f⁽ʳ⁾(ξ)", name: "ostanek", meaning: " — razlika med točnim odvodom in formulo za neko ξ med skrajnima vozliščema." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Kako bi to razložil profesorju", `
          <p>Numerični odvod potrebujemo, ko poznamo samo nekaj vrednosti funkcije. Te vrednosti pomnožimo z utežmi in jih seštejemo tako, da formula odvod izračuna <strong>točno za čim več polinomov</strong>.</p>
          <p>Najlažje je, da okoli ${m(String.raw`x_0`)} uporabljamo monome ${m(String.raw`g_i(x)=(x-x_0)^i`)}. Konstanta mora dati odvod 0, linearni monom mora pri prvem odvodu dati 1, ostali začetni monomi pa 0. Tako dobimo sistem za uteži. Ko prvi naslednji monom odpove, dobimo red in koeficient ostanka.</p>
          ${logicChain([
            { left: "nariši vozlišča", right: "prebereš pravilne odmike δₖ" },
            { left: "vstavljaj 1, t, t², …", right: "dobiš momentni sistem" },
            { left: "prvi neuspešni monom", right: "pove r in K" }
          ])}
        `),
        section("visual", "03 · TAKO IZGLEDA", "Stencil in momentna tabela", `
          <div class="visual-diagram" style="padding:18px;border:1px solid #3d3624;border-radius:12px;background:#0b100d">
            <svg viewBox="0 0 760 220" role="img" aria-label="Tri desna vozlišča in momentna tabela numeričnega odvoda">
              <line x1="55" y1="82" x2="705" y2="82" stroke="#7d8b82" stroke-width="3"/>
              <path d="M705 82l-15-8v16z" fill="#7d8b82"/>
              <g fill="#ffb84d" stroke="#0b100d" stroke-width="3"><circle cx="150" cy="82" r="12"/><circle cx="360" cy="82" r="12"/><circle cx="570" cy="82" r="12"/></g>
              <g fill="#e8eee9" font-size="18" text-anchor="middle"><text x="150" y="52">x₀</text><text x="360" y="52">x₀+h</text><text x="570" y="52">x₀+2h</text></g>
              <g fill="#9ba79f" font-size="14" text-anchor="middle"><text x="150" y="120">A · f(x₀)</text><text x="360" y="120">B · f(x₀+h)</text><text x="570" y="120">C · f(x₀+2h)</text></g>
              <path d="M150 152h420" stroke="#38443d" stroke-width="2" stroke-dasharray="7 6"/>
              <g fill="#cbd5cf" font-size="14"><text x="90" y="184">i = 0:</text><text x="165" y="184">A + B + C = 0</text><text x="400" y="184">konstanta → odvod 0</text><text x="90" y="210">i = 1:</text><text x="165" y="210">Bh + 2Ch = 1</text><text x="400" y="210">premica → odvod 1</text></g>
            </svg>
          </div>
          <p><strong>Ključna slika:</strong> uteži stojijo pod točkami. V enačbo za moment samo potenciraš njihove odmike ${m(String.raw`0,h,2h`)} — ne celih koordinat ${m(String.raw`x_0,x_0+h,x_0+2h`)}.</p>
        `),
        section("formal", "04 · FORMALNI ZAPIS", "Momentni pogoji in ostanek", `
          ${P(String.raw`F_h(f)=\sum_{k=0}^{s}A_k f(x_0+\delta_k)\approx f^{(p)}(x_0)`, "splošna formula", "amber")}
          <p>Za ${m(String.raw`g_i(x)=(x-x_0)^i`)} mora za vse zahtevane stopnje veljati</p>
          ${P(String.raw`\sum_{k=0}^{s}A_k\delta_k^i=g_i^{(p)}(x_0)=\begin{cases}p!,&i=p,\\0,&i\ne p.\end{cases}`, "momentni sistem")}
          <p>Če so pogoji izpolnjeni do vključno stopnje ${m(String.raw`r-1`)}, pri stopnji ${m(String.raw`r`)} pa prvič ne, pišemo</p>
          ${P(String.raw`f^{(p)}(x_0)-F_h(f)=Kf^{(r)}(\xi),\qquad K=\frac{g_r^{(p)}(x_0)-F_h(g_r)}{r!}`, "ostanek", "violet")}
          ${theorem("Standardne simetrične formule", `
            ${P(String.raw`f'(x_0)=\frac{f(x_0+h)-f(x_0-h)}{2h}-\frac{h^2}{6}f^{(3)}(\xi)`, "centralni prvi odvod")}
            ${P(String.raw`f''(x_0)=\frac{f(x_0-h)-2f(x_0)+f(x_0+h)}{h^2}-\frac{h^2}{12}f^{(4)}(\xi)`, "centralni drugi odvod")}
          `)}
        `),
        section("derivation", "05 · IZPELJAVA", "Formula iz izpita 2026 — od začetka", `
          <p>Iščemo ${m(String.raw`f'(x_0)\approx Af(x_0)+Bf(x_0+h)+Cf(x_0+2h)`)}. Imamo tri uteži, zato najprej zahtevamo točnost za tri monome.</p>
          ${P(String.raw`\begin{array}{rcll}i=0:&A+B+C&=0,&g_0'=0,\\i=1:&Bh+2Ch&=1,&g_1'=1,\\i=2:&Bh^2+4Ch^2&=0,&g_2'=0.\end{array}`, "sistem")}
          <ol class="step-list">
            <li>Iz tretje enačbe je ${m(String.raw`B=-4C`)}.</li>
            <li>V drugi: ${m(String.raw`(-4C+2C)h=1`)}, zato ${m(String.raw`C=-1/(2h)`)}.</li>
            <li>Sledi ${m(String.raw`B=2/h`)} in iz prve ${m(String.raw`A=-3/(2h)`)}.</li>
          </ol>
          ${P(String.raw`\boxed{F_h(f)=\frac{-3f(x_0)+4f(x_0+h)-f(x_0+2h)}{2h}}`, "rezultat", "green")}
          <p>Za ${m(String.raw`g_3=(x-x_0)^3`)} dobimo ${m(String.raw`F_h(g_3)=-2h^2`)}, točni odvod v ${m(String.raw`x_0`)} pa je 0. Zato je formula točna do stopnje 2 in</p>
          ${P(String.raw`f'(x_0)-F_h(f)=\frac{h^2}{3}f^{(3)}(\xi)`, "prvi člen napake")}
        `),
        section("algorithm", "06 · ALGORITEM", "Postopek, ki deluje za poljubne točke", `
          <ol class="step-list">
            <li>Napiši vse točke in odmike ${m(String.raw`\delta_k=x_k-x_0`)}.</li>
            <li>Nastavi ${m(String.raw`F_h(f)=\sum A_kf(x_0+\delta_k)`)} in označi, kateri odvod iščeš.</li>
            <li>Vstavi ${m(String.raw`g_0,g_1,\ldots`)}. Za prvi odvod je desna stran samo pri ${m(String.raw`i=1`)} enaka 1.</li>
            <li>Reši sistem. Preveri enote: uteži prvega odvoda imajo ${m(String.raw`1/h`)}, drugega pa ${m(String.raw`1/h^2`)}.</li>
            <li>Nadaljuj z monomi. Prvi neuspešni monom določi ${m(String.raw`r`)}.</li>
            <li>Izračunaj ${m(String.raw`K=(g_r^{(p)}-F_h(g_r))/r!`)} in napiši interval za ${m(String.raw`\xi`)}.</li>
          </ol>
        `),
        section("example", "07 · LAHEK PRIMER", "Centralna razlika na kubiku", `
          <p>Naj bo ${m(String.raw`f(x)=x^3`)}, ${m(String.raw`x_0=1`)}, ${m(String.raw`h=0.1`)}. Centralna formula da</p>
          ${P(String.raw`D_0f(1)=\frac{f(1.1)-f(0.9)}{0.2}=\frac{1.331-0.729}{0.2}=3.01`, "račun")}
          <p>Točno je ${m(String.raw`f'(1)=3`)}, zato je absolutna napaka ${m(String.raw`0.01`)}. Ker je ${m(String.raw`f^{(3)}=6`)}, tudi ostanek napove</p>
          ${P(String.raw`D_0f-f'=\frac{h^2}{6}f^{(3)}=\frac{0.01}{6}\cdot6=0.01`, "kontrola")}
        `),
        section("example", "08 · IZPITNI PRIMER", "Izpit 2026 — tri presenetljive napake", `
          <p>Pri ${m(String.raw`x_0=0,h=1`)} uporabimo pravkar izpeljano formulo ${m(String.raw`F(p)=(-3p(0)+4p(1)-p(2))/2`)}.</p>
          <table class="compare-table"><thead><tr><th>polinom</th><th>vrednosti (0,1,2)</th><th>F(p)</th><th>p′(0)</th><th>|napaka|</th></tr></thead><tbody>
            <tr><td>${m(String.raw`p_1=x^2+x`)}</td><td>0, 2, 6</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
            <tr><td>${m(String.raw`p_2=x^3+3`)}</td><td>3, 4, 11</td><td>−2</td><td>0</td><td><strong>2</strong></td></tr>
            <tr><td>${m(String.raw`p_3=x^4-3x^3+2x`)}</td><td>0, 0, −4</td><td>2</td><td>2</td><td><strong>0</strong></td></tr>
          </tbody></table>
          <p><strong>Pomembno:</strong> »točna do stopnje 2« pomeni, da je točna za <em>vse</em> polinome stopnje največ 2. Posamezen polinom višje stopnje se lahko po naključju še vedno izide točno.</p>
          ${sourceNote(izpit2026, "naloga 3")}
        `),
        section("proof", "09 · ZAKAJ DELUJE", "Taylorjeva vrsta razloži momente", proof({
          idea: `Taylorjev razvoj vsako vrednost ${m(String.raw`f(x_0+\delta_k)`)} razstavi na odvode v ${m(String.raw`x_0`)}. Momentni pogoji izbrišejo vse neželene odvode in pustijo samo iskani člen.`,
          steps: [
            { title: "Razvij vsako vrednost", body: P(String.raw`f(x_0+\delta_k)=\sum_{i=0}^{r-1}\frac{f^{(i)}(x_0)}{i!}\delta_k^i+\frac{f^{(r)}(\xi_k)}{r!}\delta_k^r`, "Taylor") },
            { title: "Seštej z utežmi", body: P(String.raw`F_h(f)=\sum_i\frac{f^{(i)}(x_0)}{i!}\underbrace{\sum_kA_k\delta_k^i}_{\text{moment }i}+\text{ostanek}`, "zamenjava vsot"), reason: "Vsota je končna, zato lahko vrstni red seštevanja zamenjamo." },
            { title: "Uporabi momentne pogoje", body: `Vsi momenti do ${m(String.raw`r-1`)} so 0, razen momenta ${m(String.raw`p`)}, ki je ${m(String.raw`p!`)}. Zato ostane natanko ${m(String.raw`f^{(p)}(x_0)`)}.` },
            { title: "Prvi neizničeni člen", body: `Pri stopnji ${m(String.raw`r`)} moment ni pravilen. Njegova razlika, deljena z ${m(String.raw`r!`)}, je koeficient ${m(String.raw`K`)}.` }
          ],
          conclusion: `Momentni sistem torej ni trik na pamet, ampak zapis Taylorjevega izničevanja. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Najpogostejše napake", `
          <ul>
            <li><strong>Uporaba koordinat namesto odmikov:</strong> potenciraš ${m(String.raw`\delta_k`)}, ne ${m(String.raw`x_0+\delta_k`)}.</li>
            <li><strong>Napačen predznak ostanka:</strong> najprej se odloči, ali pišeš ${m(String.raw`f^{(p)}-F_h`)} ali ${m(String.raw`F_h-f^{(p)}`)}.</li>
            <li><strong>Prehitro končaš:</strong> uteži še ne povedo reda; preveriti moraš naslednje monome.</li>
            <li><strong>»Manjši h je vedno boljši«:</strong> diskretizacijska napaka pada, zaokrožitvena pa zaradi deljenja skoraj enakih števil raste.</li>
            <li><strong>Višji polinom z ničelno napako:</strong> to ne zviša avtomatsko stopnje točnosti; pomembna je točnost za vse polinome te stopnje.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»Vrednosti funkcije zložim v linearno kombinacijo ${m(String.raw`F_h=\sum A_kf(x_0+\delta_k)`)}. Uteži dobim tako, da formulo zahtevam točno na monomih ${m(String.raw`(x-x_0)^i`)}. Pri prvem odvodu je desna stran 1 samo za linearni monom. Prvi monom, kjer formula odpove, določi ${m(String.raw`r`)}; njegovo napako delim z ${m(String.raw`r!`)} in dobim ${m(String.raw`K`)}. Vedno preverim odmike, enote in predznak ostanka.«</p>
        `)
      ]
    },

    {
      id: "newton-cotes",
      number: 8,
      title: "Newton–Cotesova pravila",
      short: "Trapez, Simpson, odprta pravila in sestavljene formule razumeš kot integracijo interpolacijskega polinoma.",
      accent: "#50d8ff",
      minutes: 13,
      oral: ["trapez in Simpson", "odprta pravila"],
      pdfs: [{ name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" }],
      sections: [
        section("notation", "01 · LEGENDA", "Kaj je pravilo in kaj so vozlišča", notation(
          `Integracijsko pravilo je utežena vsota višin funkcije. Geometrija pove, kje merimo; algebra pove, kako izberemo uteži.`,
          [
            { tex: String.raw`I(f)`, symbol: "I(f)", name: "točni integral", meaning: " — vrednost integrala od a do b." },
            { tex: String.raw`Q(f)`, symbol: "Q(f)", name: "kvadraturno pravilo", meaning: " — numerični približek brez člena ostanka." },
            { tex: String.raw`x_i`, symbol: "xᵢ", name: "vozlišča", meaning: " — točke, v katerih računamo f." },
            { tex: String.raw`w_i`, symbol: "wᵢ", name: "uteži", meaning: " — povedo vpliv posamezne funkcijske vrednosti." },
            { tex: String.raw`h`, symbol: "h", name: "mrežni korak", meaning: " — pri sestavljenih pravilih h = (b−a)/m." },
            { tex: String.raw`m`, symbol: "m", name: "število podintervalov", meaning: " — pri sestavljenem Simpsonu mora biti sodo." },
            { tex: String.raw`d`, symbol: "d", name: "stopnja točnosti", meaning: " — največja stopnja, za katero je pravilo točno za vse polinome." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Od ploščine do uteži", `
          <p>Integral je ploščina pod grafom. Trapez funkcijo med krajiščema nadomesti s premico. Simpson vzame še sredino in skozi tri točke postavi parabolo. Zato je Simpson pri kubičnih polinomih še vedno točen, čeprav je interpolant kvadratičen — liha napaka se na simetričnem intervalu izniči.</p>
          <p>Newton–Cotes pomeni, da so vozlišča vnaprej enakomerno razporejena. Če uporabljamo krajišči, je pravilo <strong>zaprto</strong>; če krajišč ne uporabimo, je <strong>odprto</strong>.</p>
        `),
        section("visual", "03 · TAKO IZGLEDA", "Trapez, Simpson in Milne", `
          <div class="visual-diagram" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
            <div style="padding:12px;background:#0b100d;border:1px solid #283a40;border-radius:10px"><strong style="color:#50d8ff">TRAPEZ</strong><svg viewBox="0 0 220 130" role="img" aria-label="Trapezno pravilo"><path d="M25 110H200M35 110V25" stroke="#71847b" stroke-width="2"/><path d="M45 92L180 38L180 110L45 110Z" fill="#50d8ff22" stroke="#50d8ff" stroke-width="3"/><circle cx="45" cy="92" r="5" fill="#c8ff3d"/><circle cx="180" cy="38" r="5" fill="#c8ff3d"/></svg><small>krajišči, premica</small></div>
            <div style="padding:12px;background:#0b100d;border:1px solid #283a40;border-radius:10px"><strong style="color:#c8ff3d">SIMPSON</strong><svg viewBox="0 0 220 130" role="img" aria-label="Simpsonovo pravilo"><path d="M25 110H200M35 110V25" stroke="#71847b" stroke-width="2"/><path d="M45 90Q112 12 180 70L180 110L45 110Z" fill="#c8ff3d20" stroke="#c8ff3d" stroke-width="3"/><g fill="#50d8ff"><circle cx="45" cy="90" r="5"/><circle cx="112" cy="51" r="5"/><circle cx="180" cy="70" r="5"/></g></svg><small>krajišči + sredina, parabola</small></div>
            <div style="padding:12px;background:#0b100d;border:1px solid #283a40;border-radius:10px"><strong style="color:#ff72c6">ODPRTI MILNE</strong><svg viewBox="0 0 220 130" role="img" aria-label="Odprto Milneovo pravilo"><path d="M25 110H200M35 110V25" stroke="#71847b" stroke-width="2"/><path d="M45 80Q110 20 180 75" fill="none" stroke="#59665f" stroke-width="2"/><g fill="#ff72c6"><circle cx="72" cy="58" r="6"/><circle cx="112" cy="46" r="6"/><circle cx="153" cy="55" r="6"/></g><g fill="#9da8a1" font-size="12" text-anchor="middle"><text x="72" y="100">¼</text><text x="112" y="100">½</text><text x="153" y="100">¾</text></g></svg><small>brez krajišč; srednja utež je negativna</small></div>
          </div>
        `),
        section("formal", "04 · FORMULE", "Osnovna in sestavljena pravila", `
          ${P(String.raw`T(f)=\frac{b-a}{2}\bigl(f(a)+f(b)\bigr)`, "trapez")}
          ${P(String.raw`S(f)=\frac{b-a}{6}\left(f(a)+4f\!\left(\frac{a+b}{2}\right)+f(b)\right)`, "Simpson", "green")}
          ${P(String.raw`S_{3/8}(f)=\frac{3h}{8}(f_0+3f_1+3f_2+f_3),\qquad h=\frac{b-a}{3}`, "Simpson 3/8")}
          ${P(String.raw`M_{\mathrm{odprti}}(f)=\frac{b-a}{3}\left(2f\!\left(a+\frac{b-a}{4}\right)-f\!\left(\frac{a+b}{2}\right)+2f\!\left(a+\frac{3(b-a)}4\right)\right)`, "odprto Milneovo pravilo", "violet")}
          <p>Pri sestavljenih pravilih, ${m(String.raw`h=(b-a)/m`)}, velja</p>
          ${P(String.raw`T_h=\frac h2\left(f_0+2\sum_{i=1}^{m-1}f_i+f_m\right)`, "sestavljeni trapez")}
          ${P(String.raw`S_h=\frac h3\left(f_0+4\sum_{i\ \mathrm{lih}}f_i+2\sum_{i\ \mathrm{sod},\ i\ne0,m}f_i+f_m\right),\quad m\ \mathrm{sod}`, "sestavljeni Simpson")}
        `),
        section("derivation", "05 · IZPELJAVA", "Simpsonove uteži iz momentov", `
          <p>Na normiranem intervalu ${m(String.raw`[-1,1]`)} iščemo simetrično pravilo ${m(String.raw`Q(f)=Af(-1)+Bf(0)+Af(1)`)}.</p>
          ${P(String.raw`\begin{array}{rcl}f=1:&2A+B&=2,\\f=x:&-A+A&=0,\\f=x^2:&2A&=\frac23.\end{array}`, "momenti")}
          <p>Od tod ${m(String.raw`A=1/3`)} in ${m(String.raw`B=4/3`)}. Po preslikavi na ${m(String.raw`[a,b]`)} dobimo uteži ${m(String.raw`(b-a)(1,4,1)/6`)}. Kubični monom je lih in se integrira v 0, zato je pravilo točno tudi za stopnjo 3.</p>
        `),
        section("algorithm", "06 · ALGORITEM", "Kako se lotiš integracijske naloge", `
          <ol class="step-list">
            <li>Preberi interval, vozlišča in ali so podane tudi vrednosti odvodov.</li>
            <li>Če je pravilo znano, najprej naredi tabelo ${m(String.raw`x_i,f_i`)} in šele nato vstavljaj.</li>
            <li>Če so uteži neznane, piši ${m(String.raw`Q(f)`)} brez ostanka in vstavljaj monome ${m(String.raw`1,t,t^2,\ldots`)}.</li>
            <li>Pri sestavljenem Simpsonu preveri, da je ${m(String.raw`m`)} sodo; uteži so 1,4,2,4,…,2,4,1.</li>
            <li>Stopnjo točnosti določi s prvim monomom, kjer ${m(String.raw`Q(g_i)\ne I(g_i)`)}.</li>
            <li>Na koncu naredi grobo kontrolo: uteži za konstanto morajo sešteti dolžino intervala.</li>
          </ol>
        `),
        section("example", "07 · LAHEK PRIMER", "Trapez in Simpson na istem integralu", `
          <p>Izračunaj ${m(String.raw`\int_0^2(x^3+1)\,dx`)}. Točna vrednost je ${m(String.raw`6`)}.</p>
          ${P(String.raw`T=\frac22\bigl(f(0)+f(2)\bigr)=1(1+9)=10`, "trapez")}
          ${P(String.raw`S=\frac26\bigl(f(0)+4f(1)+f(2)\bigr)=\frac13(1+8+9)=6`, "Simpson", "green")}
          <p>Simpson je točen, ker je integrand kubičen, pravilo pa ima stopnjo točnosti 3.</p>
        `),
        section("example", "08 · TEŽJI PRIMER", "Odprto Milneovo pravilo brez ugibanja", `
          <p>Na ${m(String.raw`[a,b]`)} označi ${m(String.raw`L=b-a`)} in vozlišča ${m(String.raw`a+L/4,a+L/2,a+3L/4`)}. Pravilna formula je</p>
          ${P(String.raw`Q(f)=\frac L3\left(2f_{1/4}-f_{1/2}+2f_{3/4}\right)`, "Milne", "violet")}
          <p>Hitra kontrola s konstanto: ${m(String.raw`\frac L3(2-1+2)=L`)}, kar je točni integral konstante 1. Če manjka faktor ${m(String.raw`1/3`)} ali minus pred srednjo vrednostjo, kontrola takoj odpove.</p>
        `),
        section("proof", "09 · ZAKAJ", "Ostanek trapeza in Simpsona", proof({
          idea: "Pravilo integrira interpolacijski polinom; napaka integrala je integral interpolacijske napake.",
          steps: [
            { title: "Trapezna interpolacijska napaka", body: P(String.raw`f(x)-I_1f(x)=\frac{f''(\xi_x)}{2}(x-a)(x-b)`, "linearna interpolacija") },
            { title: "Integriraj produkt", body: P(String.raw`\int_a^b(x-a)(x-b)\,dx=-\frac{(b-a)^3}{6}`, "osnovni integral"), reason: "Faktor f′′/2 lahko po izreku o srednji vrednosti za integrale ocenimo v neki točki ξ." },
            { title: "Trapezni ostanek", body: P(String.raw`I(f)-T(f)=-\frac{(b-a)^3}{12}f''(\xi)`, "rezultat") },
            { title: "Simpson", body: `Zaradi simetrije se kubični člen izniči; prvi neizničeni člen vsebuje ${m(String.raw`f^{(4)}`)} in dobimo ${m(String.raw`I(f)-S(f)=-(b-a)^5f^{(4)}(\xi)/2880`)}.` }
          ],
          conclusion: `Zato trapez nosi globalni red 2, sestavljeni Simpson pa red 4. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Kaj se na izpitu najpogosteje zalomi", `
          <ul>
            <li>Pri Simpsonu uporabiš liho število podintervalov.</li>
            <li>Zamešaš en sam Simpsonov panel z njegovo sestavljeno različico.</li>
            <li>Pri odprtem Milneovem pravilu pozabiš negativno srednjo utež.</li>
            <li>Pri preslikavi intervala pozabiš faktor ${m(String.raw`(b-a)/2`)} v diferencialu.</li>
            <li>Člen ostanka vključiš v sistem za uteži. Uteži vedno določa samo ${m(String.raw`Q`)}.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»Newton–Cotesova pravila dobimo z integriranjem interpolanta v enakomernih vozliščih. Trapez uporablja krajišči in je točen do stopnje 1. Simpson uporablja še sredino, uteži 1–4–1 in je zaradi simetrije točen do stopnje 3. Pri sestavljenem Simpsonu mora biti število podintervalov sodo. Odprti Milne uporablja četrtine in uteži ${m(String.raw`2,-1,2`)} z zunanjim faktorjem ${m(String.raw`(b-a)/3`)}.«</p>
        `)
      ]
    },

    {
      id: "izboljsana-integracija",
      number: 9,
      title: "Izboljšana integracija",
      short: "Nedoločeni koeficienti, popravljeno trapezno pravilo, Gauss, Romberg in adaptivni Simpson v eni sliki.",
      accent: "#ff72c6",
      minutes: 15,
      oral: ["nedoločeni koeficienti", "Gauss in Romberg"],
      pdfs: [
        { name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" }
      ],
      sections: [
        section("notation", "01 · LEGENDA", "Dodatni simboli izboljšanih pravil", notation(
          `Vsa izboljšana pravila delajo isto: z enakim ali malo večjim številom podatkov poskušajo izničiti vodilni člen napake.`,
          [
            { tex: String.raw`Q(f)`, symbol: "Q(f)", name: "osnovni približek", meaning: " — desna stran pravila brez ostanka." },
            { tex: String.raw`E f^{(r)}(\xi)`, symbol: "E f⁽ʳ⁾(ξ)", name: "ostanek", meaning: " — prvi člen, ki ga pravilo ne integrira točno." },
            { tex: String.raw`R_{k,j}`, symbol: "Rₖ,ⱼ", name: "Rombergova tabela", meaning: " — stolpec j odstrani naslednji člen napake." },
            { tex: String.raw`S_1,S_2`, symbol: "S₁, S₂", name: "grobi in fini Simpson", meaning: " — en panel ter vsota dveh polovičnih panelov." },
            { tex: String.raw`\mathrm{tol}`, symbol: "tol", name: "toleranca", meaning: " — dovoljena lokalna ali globalna napaka." },
            { tex: String.raw`t_i,w_i`, symbol: "tᵢ,wᵢ", name: "Gaussova vozlišča in uteži", meaning: " — prosta so tudi vozlišča, zato dosežemo višjo stopnjo točnosti." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Tri načini, kako dobimo več natančnosti", `
          <p><strong>Nedoločeni koeficienti:</strong> sami izberemo uteži, da pravilo zadene čim več monomov. <strong>Gauss:</strong> poleg uteži premikamo tudi vozlišča. <strong>Richardson in Romberg:</strong> iz dveh mrež algebraično odstranimo vodilni člen napake. Adaptivni Simpson pa mrežo zgosti samo tam, kjer je funkcija težavna.</p>
          ${logicChain([
            { left: "več podatkov v pravilu", right: "momentni sistem" },
            { left: "prosta vozlišča", right: "Gauss: n točk → stopnja 2n−1" },
            { left: "dve gostoti mreže", right: "Richardson odstrani vodilno napako" }
          ])}
        `),
        section("visual", "03 · TAKO IZGLEDA", "Gauss, Romberg in adaptivna delitev", `
          <div class="visual-diagram" style="display:grid;grid-template-columns:1.1fr 1fr 1.2fr;gap:10px">
            <div style="padding:14px;border:1px solid #493245;border-radius:10px;background:#0b100d"><strong style="color:#ff72c6">GAUSS</strong><svg viewBox="0 0 260 120" role="img" aria-label="Gaussovi vozlišči znotraj intervala"><line x1="25" y1="72" x2="235" y2="72" stroke="#7a877f" stroke-width="3"/><circle cx="70" cy="72" r="7" fill="#59665f"/><circle cx="190" cy="72" r="7" fill="#59665f"/><circle cx="95" cy="72" r="9" fill="#ff72c6"/><circle cx="165" cy="72" r="9" fill="#ff72c6"/><g fill="#c7d0ca" font-size="13" text-anchor="middle"><text x="70" y="102">−1</text><text x="190" y="102">1</text><text x="95" y="42">−1/√3</text><text x="165" y="42">1/√3</text></g></svg></div>
            <div style="padding:14px;border:1px solid #493245;border-radius:10px;background:#0b100d"><strong style="color:#ff72c6">ROMBERG</strong><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:18px;font-family:monospace;text-align:center"><span style="padding:8px;background:#182019">T(h)</span><span></span><span></span><span style="padding:8px;background:#182019">T(h/2)</span><span style="padding:8px;background:#291a27;color:#ff9ddd">R₁,₁</span><span></span><span style="padding:8px;background:#182019">T(h/4)</span><span style="padding:8px;background:#291a27;color:#ff9ddd">R₂,₁</span><span style="padding:8px;background:#342031;color:#ff72c6">R₂,₂</span></div></div>
            <div style="padding:14px;border:1px solid #493245;border-radius:10px;background:#0b100d"><strong style="color:#ff72c6">ADAPTIVNO</strong><svg viewBox="0 0 290 120" role="img" aria-label="Adaptivno razpolavljanje intervala"><line x1="20" y1="70" x2="270" y2="70" stroke="#7a877f" stroke-width="3"/><g stroke="#ff72c6" stroke-width="3"><line x1="20" y1="55" x2="20" y2="85"/><line x1="145" y1="55" x2="145" y2="85"/><line x1="207" y1="55" x2="207" y2="85"/><line x1="238" y1="55" x2="238" y2="85"/><line x1="270" y1="55" x2="270" y2="85"/></g><text x="145" y="105" fill="#aeb8b1" text-anchor="middle" font-size="13">več točk samo tam, kjer je napaka velika</text></svg></div>
          </div>
        `),
        section("formal", "04 · FORMULE", "Jedro izboljšanih metod", `
          <p>Za pravilo z vrednostmi in odvodi uporabimo enoten momentni zapis</p>
          ${P(String.raw`Q(f)=\sum_jw_jf(x_j)+\sum_\ell v_\ell f^{(q_\ell)}(y_\ell),\qquad Q(g_i)=\int_a^bg_i(x)\,dx`, "nedoločeni koeficienti")}
          ${P(String.raw`\int_{x_0}^{x_0+h}f(x)\,dx=\frac h2(f_0+f_1)+\frac{h^2}{12}(f'_0-f'_1)+\frac{h^5}{720}f^{(4)}(\xi)`, "popravljeno trapezno pravilo", "violet")}
          ${P(String.raw`\int_{-1}^{1}f(t)\,dt\approx f\!\left(-\frac1{\sqrt3}\right)+f\!\left(\frac1{\sqrt3}\right)`, "Gauss–Legendre z dvema točkama")}
          ${P(String.raw`x=\frac{a+b}{2}+\frac{b-a}{2}t,\qquad dx=\frac{b-a}{2}\,dt`, "preslikava Gaussa")}
          ${P(String.raw`R_{k,j}=R_{k,j-1}+\frac{R_{k,j-1}-R_{k-1,j-1}}{4^j-1}`, "Romberg")}
          ${P(String.raw`\widehat e=\frac{|S_2-S_1|}{15},\qquad S_{\mathrm{corr}}=S_2+\frac{S_2-S_1}{15}`, "adaptivni Simpson", "green")}
        `),
        section("derivation", "05 · IZPELJAVA", "Popravljeno trapezno pravilo iz izpita 2025", `
          <p>Nastavimo ${m(String.raw`Q(f)=h(Af_0+Bf_1)+h^2(Cf'_0+Df'_1)`)} in vzamemo ${m(String.raw`g_i=(x-x_0)^i`)}.</p>
          ${P(String.raw`\begin{array}{rcl}A+B&=&1,\\B+C+D&=&\frac12,\\B+2D&=&\frac13,\\B+3D&=&\frac14.\end{array}`, "momenti 0–3")}
          <p>Iz zadnjih dveh je ${m(String.raw`D=-1/12`)} in ${m(String.raw`B=1/2`)}; nato ${m(String.raw`A=1/2,C=1/12`)}. Prvi neuspešni monom je ${m(String.raw`g_4`)}:</p>
          ${P(String.raw`\int g_4\,dx=\frac{h^5}{5},\qquad Q(g_4)=\frac{h^5}{6},\qquad \int g_4-Q(g_4)=\frac{h^5}{30}`, "prvi neuspeh")}
          <p>Ker je ${m(String.raw`g_4^{(4)}=24`)}, dobimo ${m(String.raw`E=h^5/(30\cdot24)=h^5/720`)}.</p>
        `),
        section("algorithm", "06 · ALGORITEM", "Katero izboljšavo izbereš", `
          <table class="compare-table"><thead><tr><th>naloga omenja</th><th>izberi</th><th>prvi korak</th></tr></thead><tbody>
            <tr><td>neznane A,B,C,… ali odvode</td><td>nedoločeni koeficienti</td><td>monomi okoli x₀</td></tr>
            <tr><td>trapeze na h,h/2,…</td><td>Romberg</td><td>zgradi prvi stolpec</td></tr>
            <tr><td>prosta vozlišča / Gauss</td><td>Gauss–Legendre</td><td>preslikaj interval</td></tr>
            <tr><td>toleranco in Simpson</td><td>adaptivni Simpson</td><td>primerjaj en in dva panela</td></tr>
          </tbody></table>
          <p>Pri adaptivnem postopku interval razpolovi, če ${m(String.raw`|S_2-S_1|/15>\mathrm{tol}`)}; lokalno toleranco razdeli med otroka.</p>
        `),
        section("example", "07 · LAHEK PRIMER", "Dve Gaussovi točki integrirata kvadrat točno", `
          <p>Za ${m(String.raw`f(t)=t^2+1`)} na ${m(String.raw`[-1,1]`)} je</p>
          ${P(String.raw`Q(f)=f(-1/\sqrt3)+f(1/\sqrt3)=\frac43+\frac43=\frac83`, "Gauss")}
          ${P(String.raw`\int_{-1}^{1}(t^2+1)\,dt=\frac23+2=\frac83`, "točno")}
          <p>Dvotočkovni Gauss je točen do stopnje 3, zato mora kvadrat zadeti brez napake.</p>
        `),
        section("example", "08 · TEŽJI IZPITNI TIP", "Popravljeno trapezno pravilo", `
          <p>Za pravilo z vrednostma in odvodoma v krajiščih je rezultat</p>
          ${P(String.raw`A=B=\frac12,\qquad C=\frac1{12},\qquad D=-\frac1{12},\qquad r=4,\qquad E=\frac{h^5}{720}`, "izpitni odgovor", "green")}
          <p>V odgovoru mora biti jasno, da ${m(String.raw`Ef^{(r)}(\xi)`)} ni del numeričnega približka, ampak opis napake. Negativna utež ${m(String.raw`D`)} je pravilna in ni računska napaka.</p>
          ${sourceNote(gradivo, "pravilo z vrednostmi in odvodi v krajiščih")}
        `),
        section("proof", "09 · ZAKAJ", "Zakaj dve Gaussovi točki dosežeta stopnjo 3", proof({
          idea: "Zaradi simetrije sta vozlišči ±a in uteži enaki. Dva prosta parametra določimo z momentoma 0 in 2; liha momenta se izničita sama.",
          steps: [
            { title: "Simetričen nastavek", body: P(String.raw`Q(f)=w\bigl(f(-a)+f(a)\bigr)`, "nastavek") },
            { title: "Konstanta", body: `${m(String.raw`Q(1)=2w=2`)}, zato je ${m(String.raw`w=1`)}.` },
            { title: "Kvadrat", body: `${m(String.raw`Q(t^2)=2a^2=2/3`)}, zato je ${m(String.raw`a=1/\sqrt3`)}.` },
            { title: "Liha monoma", body: `${m(String.raw`Q(t)=Q(t^3)=0`)}, enako kot točna integrala na simetričnem intervalu.` }
          ],
          conclusion: `Pravilo je točno za bazo ${m(String.raw`1,t,t^2,t^3`)}, zato za vsak polinom stopnje največ 3. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Loči metode in predznake", `
          <ul>
            <li>Pri Gaussu pozabiš preslikavo in faktor ${m(String.raw`(b-a)/2`)}.</li>
            <li>V Rombergu uporabiš ${m(String.raw`2^j-1`)} namesto ${m(String.raw`4^j-1`)} za trapezno osnovo.</li>
            <li>Pri adaptivnem Simpsonu primerjaš samo približka, ne deliš razlike s 15.</li>
            <li>V momentni sistem vključiš ostanek. Najprej določiš ${m(String.raw`Q`)}, šele nato ${m(String.raw`r,E`)}.</li>
            <li>Zamešaš predznak: tukaj je zapis ${m(String.raw`I(f)=Q(f)+Ef^{(r)}(\xi)`)}.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»Pri nedoločenih koeficientih pravilo brez ostanka zahtevam točno na zaporednih monomih. Prvi neuspešni monom določi ${m(String.raw`r`)} in ${m(String.raw`E`)}. Dvotočkovni Gauss ima vozlišči ${m(String.raw`\pm1/\sqrt3`)} in je točen do stopnje 3. Romberg iz trapezov na vedno gostejših mrežah odstranjuje člene napake z delitelji ${m(String.raw`4^j-1`)}. Adaptivni Simpson uporabi oceno ${m(String.raw`|S_2-S_1|/15`)} in deli samo težke intervale.«</p>
        `)
      ]
    }
  ];
})();
