(() => {
  "use strict";

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
  const proof = UI.proof || (item => `<p class="proof-lead"><strong>Ideja.</strong> ${item.idea}</p><div class="proof-steps">${item.steps.map(step =>
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
  const izpit2 = `<a href="../apm_nm2_i2_2526.pdf" target="_blank" rel="noopener">2. izpit 2025/26</a>`;

  window.NUM2_TOPICS_ODE = [
    {
      id: "euler-trapez",
      number: 10,
      title: "Eulerjevi in trapezna metoda",
      short: "Korak začetnega problema, implicitna enačba in faktor ojačanja postanejo ena povezana zgodba.",
      accent: "#c8ff3d",
      minutes: 14,
      oral: ["Euler in trapez", "stabilnost"],
      pdfs: [
        { name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" },
        { name: "2. izpit 2025/26 — naloga 4", file: "../apm_nm2_i2_2526.pdf" }
      ],
      sections: [
        section("notation", "01 · LEGENDA", "Kaj predstavljajo mreža, približek in stabilnost", notation(
          `Začetni problem pove začetno točko in smer gibanja. Numerična metoda nato po mreži gradi približke.`,
          [
            { tex: String.raw`y'=f(x,y)`, symbol: "y′=f(x,y)", name: "diferencialna enačba", meaning: " — funkcija f pove naklon v vsaki točki." },
            { tex: String.raw`y(x_0)=y_0`, symbol: "y(x₀)=y₀", name: "začetni pogoj", meaning: " — od kod začnemo." },
            { tex: String.raw`x_n=x_0+nh`, symbol: "xₙ", name: "mreža", meaning: " — točke, v katerih računamo približke." },
            { tex: String.raw`y_n`, symbol: "yₙ", name: "numerični približek", meaning: " — približek za točno vrednost y(xₙ)." },
            { tex: String.raw`h`, symbol: "h", name: "korak", meaning: " — razdalja med xₙ in xₙ₊₁." },
            { tex: String.raw`z=h\lambda`, symbol: "z=hλ", name: "skalirani parameter", meaning: " — uporabljamo ga pri testni enačbi y′=λy." },
            { tex: String.raw`R(z)`, symbol: "R(z)", name: "faktor ojačanja", meaning: " — iz yₙ₊₁=R(z)yₙ preberemo stabilnost." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Stari naklon, novi naklon ali povprečje", `
          <p>Eksplicitni Euler pogleda naklon v <strong>stari</strong> znani točki in naredi korak. Implicitni Euler zahteva naklon v <strong>novi</strong> točki, zato je novi ${m(String.raw`y_{n+1}`)} na obeh straneh in ga moramo izračunati iz enačbe. Trapezna metoda uporabi povprečje starega in novega naklona.</p>
          ${logicChain([
            { left: "stara točka", right: "eksplicitno, neposreden račun" },
            { left: "nova točka", right: "implicitno, reši enačbo" },
            { left: "povprečje obeh", right: "trapezna metoda, red 2" }
          ])}
        `),
        section("visual", "03 · TAKO IZGLEDA", "En korak treh metod", `
          <div class="visual-diagram" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
            <div style="padding:12px;background:#0b100d;border:1px solid #354428;border-radius:10px"><strong style="color:#c8ff3d">EKSPLICITNI</strong><svg viewBox="0 0 230 150" role="img" aria-label="Eksplicitni Euler uporablja stari naklon"><path d="M20 125H215M35 140V20" stroke="#708078" stroke-width="2"/><path d="M45 110C90 100 130 70 195 42" fill="none" stroke="#526158" stroke-width="2"/><circle cx="62" cy="105" r="7" fill="#c8ff3d"/><line x1="62" y1="105" x2="170" y2="63" stroke="#c8ff3d" stroke-width="4"/><text x="62" y="138" fill="#b9c3bc" text-anchor="middle">(xₙ,yₙ)</text></svg><small>naklon vzamemo na začetku</small></div>
            <div style="padding:12px;background:#0b100d;border:1px solid #354428;border-radius:10px"><strong style="color:#50d8ff">IMPLICITNI</strong><svg viewBox="0 0 230 150" role="img" aria-label="Implicitni Euler uporablja novi naklon"><path d="M20 125H215M35 140V20" stroke="#708078" stroke-width="2"/><path d="M45 110C90 100 130 70 195 42" fill="none" stroke="#526158" stroke-width="2"/><circle cx="62" cy="105" r="6" fill="#66746c"/><circle cx="174" cy="55" r="7" fill="#50d8ff"/><line x1="62" y1="105" x2="174" y2="55" stroke="#50d8ff" stroke-width="3" stroke-dasharray="7 5"/><line x1="123" y1="77" x2="210" y2="37" stroke="#50d8ff" stroke-width="4"/></svg><small>končni naklon določa novo točko</small></div>
            <div style="padding:12px;background:#0b100d;border:1px solid #354428;border-radius:10px"><strong style="color:#ff72c6">TRAPEZ</strong><svg viewBox="0 0 230 150" role="img" aria-label="Trapezna metoda povpreči naklona"><path d="M20 125H215M35 140V20" stroke="#708078" stroke-width="2"/><path d="M45 110C90 100 130 70 195 42" fill="none" stroke="#526158" stroke-width="2"/><circle cx="62" cy="105" r="6" fill="#c8ff3d"/><circle cx="174" cy="55" r="6" fill="#50d8ff"/><line x1="62" y1="105" x2="160" y2="67" stroke="#c8ff3d" stroke-width="3"/><line x1="100" y1="90" x2="196" y2="46" stroke="#50d8ff" stroke-width="3"/><line x1="62" y1="105" x2="174" y2="55" stroke="#ff72c6" stroke-width="4" stroke-dasharray="6 5"/></svg><small>povprečni naklon</small></div>
          </div>
        `),
        section("formal", "04 · FORMULE", "Tri metode in faktorji ojačanja", `
          ${P(String.raw`y_{n+1}=y_n+h f(x_n,y_n)`, "eksplicitni Euler")}
          ${P(String.raw`y_{n+1}=y_n+h f(x_{n+1},y_{n+1})`, "implicitni Euler", "green")}
          ${P(String.raw`y_{n+1}=y_n+\frac h2\left(f(x_n,y_n)+f(x_{n+1},y_{n+1})\right)`, "trapezna metoda", "violet")}
          <p>Za testno enačbo ${m(String.raw`y'=\lambda y`)} in ${m(String.raw`z=h\lambda`)}:</p>
          ${P(String.raw`R_E(z)=1+z,\qquad R_I(z)=\frac1{1-z},\qquad R_T(z)=\frac{1+z/2}{1-z/2}`, "faktorji ojačanja")}
          ${theorem("Stabilnost ni isto kot pojemanje", `
            <p>Absolutna stabilnost v točki ${m(String.raw`z`)} pomeni ${m(String.raw`|R(z)|\le1`)}. Metoda je A-stabilna, če to velja za ves levi polravninski del ${m(String.raw`\operatorname{Re}z\le0`)}. Za dejansko asimptotično pojemanje ${m(String.raw`y_n\to0`)} potrebujemo strogo ${m(String.raw`|R(z)|<1`)}.</p>
          `)}
        `),
        section("derivation", "05 · IZPELJAVA", "Od metode do R(z)", `
          <p>V vsako metodo vstavimo ${m(String.raw`f(x,y)=\lambda y`)}.</p>
          <table class="compare-table"><thead><tr><th>metoda</th><th>enačba</th><th>rezultat</th></tr></thead><tbody>
            <tr><td>eksplicitni Euler</td><td>${m(String.raw`y_{n+1}=y_n+h\lambda y_n`)}</td><td>${m(String.raw`R=1+z`)}</td></tr>
            <tr><td>implicitni Euler</td><td>${m(String.raw`(1-z)y_{n+1}=y_n`)}</td><td>${m(String.raw`R=1/(1-z)`)}</td></tr>
            <tr><td>trapez</td><td>${m(String.raw`(1-z/2)y_{n+1}=(1+z/2)y_n`)}</td><td>${m(String.raw`R=(1+z/2)/(1-z/2)`)}</td></tr>
          </tbody></table>
          <p>Za realni ${m(String.raw`\lambda<0`)} je eksplicitni Euler stabilen samo pri ${m(String.raw`-2<h\lambda<0`)}, torej ${m(String.raw`0<h<-2/\lambda`)}. Implicitni Euler in trapezna metoda sta A-stabilna. Implicitni Euler je tudi L-stabilen, ker ${m(String.raw`R_I(z)\to0`)} za ${m(String.raw`z\to-\infty`)}, pri trapezu pa ${m(String.raw`R_T(z)\to-1`)}.</p>
        `),
        section("algorithm", "06 · ALGORITEM", "Varni postopek za začetni problem", `
          <ol class="step-list">
            <li>Iz enačbe preberi ${m(String.raw`f(x,y)`)} ter iz začetnega pogoja ${m(String.raw`x_0,y_0`)}.</li>
            <li>Naredi mrežo in preštej korake: ${m(String.raw`N=(x_{\rm cilj}-x_0)/h`)}.</li>
            <li>V formulo vstavi pravilen par: pri eksplicitni metodi starega, pri implicitni novega.</li>
            <li>Če se ${m(String.raw`y_{n+1}`)} pojavi na desni, ga algebraično osami; pri nelinearnem problemu bi uporabil iteracijo.</li>
            <li>Po vsakem koraku posodobi oba podatka ${m(String.raw`x_n,y_n`)}.</li>
            <li>Pri stabilnosti ne računaj tabele: vstavi ${m(String.raw`y'=\lambda y`)}, izpelji ${m(String.raw`R`)}, nato preveri modul.</li>
          </ol>
        `),
        section("example", "07 · LAHEK PRIMER", "Vse tri metode v enem koraku", `
          <p>Naj bo ${m(String.raw`y'=-2y,y(0)=1,h=1/4`)}. Iščemo približek pri ${m(String.raw`x_1=1/4`)}.</p>
          ${P(String.raw`y_1^{E}=1+\frac14(-2)=\frac12`, "eksplicitni Euler")}
          ${P(String.raw`y_1^{I}=1+\frac14(-2y_1^{I})\ \Rightarrow\ y_1^{I}=\frac23`, "implicitni Euler")}
          ${P(String.raw`y_1^{T}=\frac{1-h}{1+h}y_0=\frac{3/4}{5/4}=\frac35`, "trapez", "green")}
          <p>Točno je ${m(String.raw`e^{-1/2}\approx0.60653`)}. Trapezna vrednost 0.6 je tukaj najbližja.</p>
        `),
        section("example", "08 · NAJNOVEJŠI IZPIT", "Euler za y′=−2x in zahtevana natančnost", `
          <p>Na 2. izpitu 2025/26 je podan ${m(String.raw`y'=-2x,y(0)=1`)}, katerega točna rešitev je ${m(String.raw`y=1-x^2`)}. Pri ${m(String.raw`h=1/2`)}:</p>
          ${P(String.raw`\text{eksplicitno:}\quad y_1=1,\qquad y_2=\frac12`, "stari x")}
          ${P(String.raw`\text{implicitno:}\quad y_1=\frac12,\qquad y_2=-\frac12`, "novi x", "green")}
          <p>Za ${m(String.raw`h=1/n`)} se vsoti aritmetičnih zaporedij poenostavita v</p>
          ${P(String.raw`y_n^{E}=\frac1n,\qquad y_n^{I}=-\frac1n,\qquad y(1)=0`, "napaka pri x=1")}
          <p>Pri obeh metodah je absolutna napaka ${m(String.raw`1/n`)}. Pogoj ${m(String.raw`1/n<0.1`)} pomeni ${m(String.raw`n>10`)}, zato je najmanjše celo število ${m(String.raw`\boxed{n=11}`)}.</p>
          ${sourceNote(izpit2, "naloga 4")}
        `),
        section("proof", "09 · ZAKAJ", "A-stabilnost implicitnega Eulerja in trapeza", proof({
          idea: `Za ${m(String.raw`\operatorname{Re}z\le0`)} neposredno primerjamo razdalje kompleksnih števil v števcu in imenovalcu.`,
          steps: [
            { title: "Implicitni Euler", body: P(String.raw`|R_I(z)|=\frac1{|1-z|}\le1`, "ocena"), reason: `Če je ${m(String.raw`\operatorname{Re}z\le0`)}, je ${m(String.raw`|1-z|^2=(1-\operatorname{Re}z)^2+(\operatorname{Im}z)^2\ge1`)}.` },
            { title: "Trapezna metoda", body: P(String.raw`|1+z/2|^2-|1-z/2|^2=2\operatorname{Re}z\le0`, "primerjava") },
            { title: "Sklep za trapez", body: `Števec ima največji enak modul kot imenovalec, zato ${m(String.raw`|R_T(z)|\le1`)}.` },
            { title: "Pojemanje", body: `Na negativni realni osi in pri končnem ${m(String.raw`z<0`)} je neenakost stroga, zato ${m(String.raw`R^n\to0`)}.` }
          ],
          conclusion: `Obe metodi sta A-stabilni; meja ${m(String.raw`\le1`)} definira stabilnost, stroga meja ${m(String.raw`<1`)} pa pojemanje. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Ne zamenjaj teh štirih stvari", `
          <ul>
            <li>Pri implicitnem Eulerju vstaviš ${m(String.raw`f(x_n,y_n)`)} namesto ${m(String.raw`f(x_{n+1},y_{n+1})`)}.</li>
            <li>Pozabiš, da do cilja potrebuješ več korakov, in narediš samo enega.</li>
            <li>Pri trapezu novi ${m(String.raw`y_{n+1}`)} ostane na obeh straneh, odgovor pa ni rešen.</li>
            <li>A-stabilnost zapišeš s strogo neenakostjo. Definicija uporablja ${m(String.raw`\le1`)}; strogo ${m(String.raw`<1`)} zahtevaš za pojemanje.</li>
            <li>»A-stabilno« zamenjaš z »L-stabilno«. Trapez je A-stabilen, vendar za zelo tog problem ne duši najhitrejših načinov do 0.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»Eksplicitni Euler uporablja staro točko, implicitni novo, trapezna metoda pa povprečje obeh naklonov. Pri implicitni metodi moram rešiti enačbo za ${m(String.raw`y_{n+1}`)}. Stabilnost preverim na ${m(String.raw`y'=\lambda y`)} tako, da izpeljem ${m(String.raw`y_{n+1}=R(h\lambda)y_n`)}. A-stabilnost pomeni ${m(String.raw`|R(z)|\le1`)} za levo polravnino, za ${m(String.raw`y_n\to0`)} pa potrebujem ${m(String.raw`|R|<1`)}.«</p>
        `)
      ]
    },

    {
      id: "runge-kutta",
      number: 11,
      title: "Runge–Kuttove metode",
      short: "Butcherjevo tabelo bereš vrstico za vrstico, pri implicitni stopnji pa enačbo dejansko rešiš.",
      accent: "#9d8cff",
      minutes: 16,
      oral: ["Butcherjeva tabela", "eksplicitni in implicitni RK"],
      pdfs: [
        { name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" },
        { name: "1. izpit 2025/26 — naloga 4", file: "../apm_nm2_i1_2526.pdf" }
      ],
      sections: [
        section("notation", "01 · LEGENDA", "Kako prebereš Butcherjevo tabelo", notation(
          `Tabela je recept za več meritev naklona znotraj enega samega koraka.`,
          [
            { tex: String.raw`s`, symbol: "s", name: "število stopenj", meaning: " — število vrstic nad vodoravno črto in število kᵢ." },
            { tex: String.raw`c_i`, symbol: "cᵢ", name: "časovni odmik", meaning: " — naklon računamo pri xₙ+cᵢh." },
            { tex: String.raw`a_{ij}`, symbol: "aᵢⱼ", name: "notranje uteži", meaning: " — določijo vmesno vrednost y za stopnjo i." },
            { tex: String.raw`b_i`, symbol: "bᵢ", name: "končne uteži", meaning: " — spodnja vrstica, uporabljena šele pri yₙ₊₁." },
            { tex: String.raw`k_i`, symbol: "kᵢ", name: "vmesni naklon", meaning: " — ni zapisan v tabeli; izračunamo ga iz i-te vrstice." },
            { tex: String.raw`A=(a_{ij})`, symbol: "A", name: "Butcherjeva matrika", meaning: " — njena oblika pove, ali je metoda eksplicitna ali implicitna." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Večkrat poglej naklon, nato jih pametno povpreči", `
          <p>Euler uporabi en naklon. Runge–Kutta jih znotraj istega koraka izračuna več. Vsaka vrstica tabele pove, kam se premaknemo v ${m(String.raw`x`)} in s katerimi že izračunanimi nakloni sestavimo vmesni ${m(String.raw`y`)}. Spodnja vrstica nato pove, kako vse naklone združimo.</p>
          <p>Če i-ta vrstica uporablja samo prejšnje ${m(String.raw`k_j`)}, računamo po vrsti — metoda je eksplicitna. Če se ${m(String.raw`k_i`)} pojavi v lastni enačbi ali so stopnje sklopljene, je metoda implicitna in rešimo enačbo oziroma sistem.</p>
        `),
        section("visual", "03 · TAKO IZGLEDA", "Tabela postane enačba za stopnjo", `
          <div class="visual-diagram" style="display:grid;grid-template-columns:minmax(260px,.8fr) 70px minmax(320px,1.2fr);gap:14px;align-items:center;padding:18px;background:#0b100d;border:1px solid #3d3656;border-radius:12px">
            <table class="compare-table" style="margin:0;text-align:center"><tbody>
              <tr><td style="color:#9d8cff">c₁</td><td style="background:#29213e;color:#d8ccff">a₁₁</td><td>a₁₂</td></tr>
              <tr><td style="color:#9d8cff">c₂</td><td>a₂₁</td><td>a₂₂</td></tr>
              <tr><td></td><td style="border-top:3px solid #9d8cff">b₁</td><td style="border-top:3px solid #9d8cff">b₂</td></tr>
            </tbody></table>
            <div style="font-size:34px;color:#c8ff3d;text-align:center">→</div>
            <div><strong style="color:#d8ccff">Prva vrstica</strong>${P(String.raw`k_1=f\!\left(x_n+c_1h,\ y_n+h(a_{11}k_1+a_{12}k_2)\right)`, "enačba stopnje", "violet")}<p style="font-size:12px">Če je označeni ${m(String.raw`a_{11}\ne0`)}, je že prva stopnja implicitna.</p></div>
          </div>
        `),
        section("formal", "04 · FORMALNI ZAPIS", "Splošni eksplicitni in implicitni RK", `
          ${P(String.raw`k_i=f\!\left(x_n+c_ih,\ y_n+h\sum_{j=1}^{s}a_{ij}k_j\right),\qquad i=1,\ldots,s`, "stopnje")}
          ${P(String.raw`y_{n+1}=y_n+h\sum_{i=1}^{s}b_ik_i`, "končni korak", "green")}
          <p><strong>Eksplicitni RK:</strong> ${m(String.raw`a_{ij}=0`)} za ${m(String.raw`j\ge i`)}. <strong>Implicitni RK:</strong> vsaj ena stopnja je odvisna od sebe ali prihodnje stopnje; rešujemo sistem za ${m(String.raw`k_1,\ldots,k_s`)}.</p>
          ${theorem("Dve dovoljeni konvenciji", `
            <p>Tu je ${m(String.raw`k_i`)} naklon in je faktor ${m(String.raw`h`)} zunaj. Nekateri zapiski definirajo ${m(String.raw`K_i=h f(\cdot)`)}. Obe konvenciji sta pravilni, vendar ju v istem računu ne smeš mešati.</p>
          `)}
          ${P(String.raw`\begin{aligned}k_1&=f(x_n,y_n),\\k_2&=f(x_n+h/2,y_n+hk_1/2),\\k_3&=f(x_n+h/2,y_n+hk_2/2),\\k_4&=f(x_n+h,y_n+hk_3),\\y_{n+1}&=y_n+\frac h6(k_1+2k_2+2k_3+k_4).\end{aligned}`, "klasični RK4")}
        `),
        section("derivation", "05 · PREVOD TABELE", "Najnovejša implicitna shema", `
          <p>Izpit 2026 poda</p>
          ${P(String.raw`\begin{array}{c|cc}0&1/2&0\\1&1/2&0\\\hline&1/2&1/2\end{array}`, "Butcherjeva tabela", "violet")}
          <p>Vrstici in spodnja vrstica dobesedno prepišemo:</p>
          ${P(String.raw`\begin{aligned}k_1&=f(x_n,\ y_n+\tfrac h2k_1),\\k_2&=f(x_n+h,\ y_n+\tfrac h2k_1),\\y_{n+1}&=y_n+\tfrac h2(k_1+k_2).\end{aligned}`, "metoda")}
          <p>Ker ${m(String.raw`k_1`)} nastopa v svojem argumentu, ga najprej rešimo. Za ${m(String.raw`f(x,y)=2x+y`)}:</p>
          ${P(String.raw`k_1=2x_n+y_n+\frac h2k_1\quad\Rightarrow\quad k_1=\frac{2x_n+y_n}{1-h/2}`, "implicitna stopnja")}
        `),
        section("algorithm", "06 · ALGORITEM", "Branje tabele brez ugibanja", `
          <ol class="step-list">
            <li>Iz naloge določi ${m(String.raw`f,x_0,y_0,h`)} in število korakov.</li>
            <li>Prepiši ${m(String.raw`c`)}, notranjo matriko ${m(String.raw`A`)}, spodnjo vrstico ${m(String.raw`b`)}.</li>
            <li>Za vsako vrstico posebej napiši ${m(String.raw`x=x_n+c_ih`)} in ${m(String.raw`y=y_n+h\sum_ja_{ij}k_j`)}.</li>
            <li>Preveri diagonalo: če ${m(String.raw`a_{ii}\ne0`)}, enačbo za ${m(String.raw`k_i`)} reši; pri polni matriki rešuj vse stopnje skupaj.</li>
            <li>Šele ko poznaš vse stopnje, uporabi spodnjo vrstico za ${m(String.raw`y_{n+1}`)}.</li>
            <li>Pri več korakih posodobi ${m(String.raw`x_n,y_n`)}; tabela ostane ista.</li>
          </ol>
        `),
        section("example", "07 · LAHEK PRIMER", "Eksplicitna sredinska RK2", `
          <p>Za ${m(String.raw`y'=x+y,y(0)=1,h=0.2`)} uporabimo sredinsko metodo.</p>
          ${P(String.raw`k_1=f(0,1)=1`, "prva stopnja")}
          ${P(String.raw`k_2=f(0.1,1+0.1k_1)=f(0.1,1.1)=1.2`, "sredinski naklon")}
          ${P(String.raw`y_1=1+0.2k_2=\boxed{1.24}`, "korak", "green")}
          <p>Točna rešitev da približno 1.2428, zato je rezultat smiseln.</p>
        `),
        section("example", "08 · IZPIT 2026", "Dva implicitna koraka do y(2)", `
          <p>Za ${m(String.raw`y'=2x+y,y(0)=1`)} in dva koraka do 2 je ${m(String.raw`h=1`)}.</p>
          <p><strong>Prvi korak, ${m(String.raw`x_0=0,y_0=1`)}:</strong></p>
          ${P(String.raw`k_1=1+\frac12k_1\Rightarrow k_1=2,\qquad k_2=2+1+\frac12k_1=4`, "stopnji 1")}
          ${P(String.raw`y_1=1+\frac12(2+4)=4`, "prvi korak", "green")}
          <p><strong>Drugi korak, ${m(String.raw`x_1=1,y_1=4`)}:</strong></p>
          ${P(String.raw`k_1=6+\frac12k_1\Rightarrow k_1=12,\qquad k_2=4+4+\frac12\cdot12=14`, "stopnji 2")}
          ${P(String.raw`\boxed{y_2=4+\frac12(12+14)=17}`, "končni odgovor", "green")}
          ${sourceNote(izpit2026, "naloga 4")}
        `),
        section("proof", "09 · ZAKAJ", "Kako iz oblike A prepoznaš metodo", proof({
          idea: "Odvisnosti med stopnjami so zapisane v neničelnih elementih matrike A.",
          steps: [
            { title: "Strogo spodnja trikotna A", body: `V vrstici ${m(String.raw`i`)} so neničelni samo stolpci ${m(String.raw`j<i`)}, zato so vse potrebne stopnje že znane.` },
            { title: "Neničelna diagonala", body: `Če je ${m(String.raw`a_{ii}\ne0`)}, desna stran enačbe za ${m(String.raw`k_i`)} vsebuje isti ${m(String.raw`k_i`)}, zato neposredno vstavljanje ni mogoče.` },
            { title: "Element nad diagonalo", body: `Če je ${m(String.raw`a_{ij}\ne0`)} za ${m(String.raw`j>i`)}, je zgodnejša stopnja odvisna od poznejše; stopnje rešimo kot sklopljen sistem.` },
            { title: "Končna vsota", body: `Vektor ${m(String.raw`b`)} ne določa implicitnosti; uporabi se šele po izračunu vseh stopenj.` }
          ],
          conclusion: `Oblika matrike A je torej graf odvisnosti med stopnjami. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Najpogostejši Butcherjevi zdrsi", `
          <ul>
            <li>Spodnjo vrstico ${m(String.raw`b`)} uporabiš znotraj stopnje namesto šele na koncu.</li>
            <li>V časovni koordinati pozabiš faktor ${m(String.raw`h`)}: pravilno je ${m(String.raw`x_n+c_ih`)}.</li>
            <li>Mešaš konvenciji ${m(String.raw`k_i=f`)} in ${m(String.raw`K_i=hf`)} ter faktor ${m(String.raw`h`)} uporabiš dvakrat.</li>
            <li>Neničelno diagonalo obravnavaš kot eksplicitno metodo. Izpit 2026 je prav takšna past.</li>
            <li>Pri drugem koraku še vedno uporabljaš ${m(String.raw`x_0,y_0`)} namesto novega para ${m(String.raw`x_1,y_1`)}.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»V Butcherjevi tabeli levi stolpec ${m(String.raw`c_i`)} premakne čas, notranja matrika ${m(String.raw`a_{ij}`)} sestavi vmesni y, spodnja vrstica ${m(String.raw`b_i`)} pa končni korak. Splošno je ${m(String.raw`k_i=f(x_n+c_ih,y_n+h\sum_ja_{ij}k_j)`)}. Strogo spodnja trikotna matrika pomeni eksplicitni RK; neničelna diagonala ali elementi nad njo pomenijo, da moram stopnje rešiti implicitno.«</p>
        `)
      ]
    },

    {
      id: "robni-problemi",
      number: 12,
      title: "Sistemi, veččlenske in robni problemi",
      short: "Višji red pretvoriš v sistem, veččlenska metoda uporabi zgodovino, robni problem pa rešiš kot cel linearni sistem.",
      accent: "#ff7f6e",
      minutes: 15,
      oral: ["višji red in veččlenske", "robni problem"],
      pdfs: [{ name: "Celotno gradivo", file: "../../Za izpit/apm_nm2_gradivo.pdf" }],
      sections: [
        section("notation", "01 · LEGENDA", "Trije sorodni, vendar različni problemi", notation(
          `Najprej prepoznaj tip naloge. Začetni, veččlenski in robni problem niso trije zapisi istega postopka.`,
          [
            { tex: String.raw`Y=(y,z)^T`, symbol: "Y", name: "vektor stanja", meaning: " — zbere y in njegove odvode v sistem prvega reda." },
            { tex: String.raw`F(x,Y)`, symbol: "F", name: "vektorska desna stran", meaning: " — vse komponente sistema prvega reda." },
            { tex: String.raw`f_n=f(x_n,y_n)`, symbol: "fₙ", name: "shranjeni naklon", meaning: " — uporablja ga veččlenska metoda." },
            { tex: String.raw`y(a)=A,\ y(b)=B`, symbol: "A,B", name: "robni vrednosti", meaning: " — podani sta na različnih koncih intervala." },
            { tex: String.raw`y_i`, symbol: "yᵢ", name: "mrežna neznanka", meaning: " — približek rešitve v notranji točki xᵢ." },
            { tex: String.raw`T`, symbol: "T", name: "tridiagonalna matrika", meaning: " — nastane iz centralne druge diference." }
          ]
        )),
        section("intuition", "02 · POVEJ PO DOMAČE", "Najprej spremeni obliko problema", `
          <p>Metode Eulerja in RK znajo reševati sisteme prvega reda. Enačbo višjega reda zato razbijemo: ${m(String.raw`z=y'`)}, nato hkrati računamo ${m(String.raw`y'=z`)} in enačbo za ${m(String.raw`z'`)}.</p>
          <p>Veččlenska metoda novega naklona ne ocenjuje z več stopnjami v istem koraku, ampak uporabi naklone iz prejšnjih korakov. Robni problem pa ima pogoja na obeh koncih, zato se ne moremo samo premikati od leve proti desni — vse notranje vrednosti rešimo hkrati iz sistema.</p>
          ${logicChain([
            { left: "višji odvod", right: "uvedi nove komponente stanja" },
            { left: "več prejšnjih fₙ", right: "Adams / prediktor–korektor" },
            { left: "pogoja na a in b", right: "diferenčni linearni sistem" }
          ])}
        `),
        section("visual", "03 · TAKO IZGLEDA", "Sistem, časovna zgodovina in robna mreža", `
          <div class="visual-diagram" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
            <div style="padding:14px;background:#0b100d;border:1px solid #49332e;border-radius:10px"><strong style="color:#ff7f6e">VIŠJI RED</strong><div style="margin-top:22px;text-align:center;font-family:monospace;color:#dbe4de"><div style="padding:9px;background:#1d1715">y″=g(x,y,y′)</div><div style="font-size:25px;color:#ff7f6e">↓</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><span style="padding:9px;background:#241b18">y′=z</span><span style="padding:9px;background:#241b18">z′=g</span></div></div></div>
            <div style="padding:14px;background:#0b100d;border:1px solid #49332e;border-radius:10px"><strong style="color:#ff7f6e">VEČČLENSKO</strong><svg viewBox="0 0 280 130" role="img" aria-label="Veččlenska metoda uporabi prejšnje točke"><line x1="25" y1="70" x2="255" y2="70" stroke="#7c8981" stroke-width="3"/><g fill="#ff7f6e"><circle cx="55" cy="70" r="8"/><circle cx="115" cy="70" r="8"/><circle cx="175" cy="70" r="8"/></g><circle cx="235" cy="70" r="10" fill="none" stroke="#c8ff3d" stroke-width="4"/><path d="M55 45Q145 5 235 45" fill="none" stroke="#ff7f6e" stroke-width="3" stroke-dasharray="6 5"/><g fill="#c5cec8" text-anchor="middle" font-size="13"><text x="55" y="100">n−2</text><text x="115" y="100">n−1</text><text x="175" y="100">n</text><text x="235" y="100">n+1</text></g></svg></div>
            <div style="padding:14px;background:#0b100d;border:1px solid #49332e;border-radius:10px"><strong style="color:#ff7f6e">ROBNI PROBLEM</strong><svg viewBox="0 0 300 130" role="img" aria-label="Robna mreža z notranjimi neznankami"><line x1="30" y1="70" x2="270" y2="70" stroke="#7c8981" stroke-width="3"/><g fill="#c8ff3d"><circle cx="35" cy="70" r="9"/><circle cx="265" cy="70" r="9"/></g><g fill="#ff7f6e"><circle cx="92" cy="70" r="8"/><circle cx="150" cy="70" r="8"/><circle cx="208" cy="70" r="8"/></g><g fill="#c5cec8" text-anchor="middle" font-size="12"><text x="35" y="105">A znan</text><text x="92" y="105">y₁ ?</text><text x="150" y="105">y₂ ?</text><text x="208" y="105">y₃ ?</text><text x="265" y="105">B znan</text></g></svg></div>
          </div>
        `),
        section("formal", "04 · FORMULE", "Vsi trije osnovni zapisi", `
          <p><strong>Pretvorba drugega reda:</strong></p>
          ${P(String.raw`y''=g(x,y,y'),\quad z=y'\quad\Longrightarrow\quad Y'=\begin{pmatrix}y\\z\end{pmatrix}'=\begin{pmatrix}z\\g(x,y,z)\end{pmatrix}`, "sistem prvega reda")}
          <p><strong>Adams–Bashforth:</strong></p>
          ${P(String.raw`y_{n+1}=y_n+\frac h2(3f_n-f_{n-1})`, "AB2")}
          ${P(String.raw`y_{n+1}=y_n+\frac h{12}(23f_n-16f_{n-1}+5f_{n-2})`, "AB3")}
          <p><strong>Prediktor–korektor:</strong> najprej napovej ${m(String.raw`y_{n+1}^{(P)}`)}, izračunaj ${m(String.raw`f_{n+1}^{(P)}`)}, nato uporabi Simpsonov korektor</p>
          ${P(String.raw`y_{n+1}^{(K)}=y_{n-1}+\frac h3\left(f_{n-1}+4f_n+f_{n+1}^{(P)}\right)`, "Simpsonov korektor", "violet")}
          <p><strong>Robni problem ${m(String.raw`-y''=q(x)`)}</strong> na mreži:</p>
          ${P(String.raw`-y_{i-1}+2y_i-y_{i+1}=h^2q(x_i),\qquad i=1,\ldots,m-1`, "centralna diferenčna shema", "green")}
        `),
        section("derivation", "05 · IZPELJAVA", "Od drugega odvoda do tridiagonalne matrike", `
          <p>Taylorjeva razvoja v levo in desno seštejemo:</p>
          ${P(String.raw`y(x_i\!+h)-2y(x_i)+y(x_i\!-h)=h^2y''(x_i)+O(h^4)`, "centralna razlika")}
          <p>Zato je ${m(String.raw`y''(x_i)=(y_{i-1}-2y_i+y_{i+1})/h^2+O(h^2)`)}. V enačbo ${m(String.raw`-y''=q`)} dobimo vrstico</p>
          ${P(String.raw`-y_{i-1}+2y_i-y_{i+1}=h^2q_i`, "i-ta vrstica")}
          <p>Za tri notranje točke je matrika</p>
          ${P(String.raw`\begin{pmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{pmatrix}\begin{pmatrix}y_1\\y_2\\y_3\end{pmatrix}=h^2\begin{pmatrix}q_1\\q_2\\q_3\end{pmatrix}+\begin{pmatrix}A\\0\\B\end{pmatrix}`, "linearni sistem")}
        `),
        section("algorithm", "06 · ALGORITEM", "Najprej prepoznaj tip naloge", `
          <ol class="step-list">
            <li><strong>Višji red:</strong> uvedi spremenljivko za vsak nižji odvod, osami najvišji odvod in sestavi ${m(String.raw`Y_0`)}.</li>
            <li><strong>Veččlenska metoda:</strong> preveri, ali imaš dovolj zagonskih vrednosti; manjkajoče dobiš z Eulerjem ali RK.</li>
            <li>Izračunaj in jasno označi vse potrebne ${m(String.raw`f_j=f(x_j,y_j)`)}.</li>
            <li><strong>Robni problem:</strong> naredi mrežo, robni vrednosti označi kot znani, notranje kot neznanke.</li>
            <li>Za vsako notranjo točko napiši eno diferenčno enačbo; znane robne člene prestavi na desno.</li>
            <li>Reši celoten sistem in odgovor poveži z mrežnimi točkami.</li>
          </ol>
        `),
        section("example", "07 · LAHEK PRIMER", "Višji red kot sistem in en Eulerjev korak", `
          <p>Naj bo ${m(String.raw`y''-4y'+4y=x`)}, ${m(String.raw`y(0)=1,y'(0)=0`)}. Postavimo ${m(String.raw`z=y'`)}:</p>
          ${P(String.raw`Y'=\begin{pmatrix}y'\\z'\end{pmatrix}=\begin{pmatrix}z\\x+4z-4y\end{pmatrix},\qquad Y_0=\begin{pmatrix}1\\0\end{pmatrix}`, "sistem")}
          <p>Pri ${m(String.raw`h=1/2`)} je ${m(String.raw`F(0,Y_0)=(0,-4)^T`)} in eksplicitni Euler da</p>
          ${P(String.raw`Y_1=Y_0+\frac12F(0,Y_0)=\begin{pmatrix}1\\-2\end{pmatrix}`, "rezultat", "green")}
          <p>Torej ${m(String.raw`y(1/2)\approx1`)} in ${m(String.raw`y'(1/2)\approx-2`)}.</p>
        `),
        section("example", "08 · TEŽJI PRIMER", "Robni problem kot en sistem", `
          <p>Reši ${m(String.raw`-y''=2`)}, ${m(String.raw`y(0)=y(1)=0`)}, ${m(String.raw`h=1/4`)}. Notranje neznanke so ${m(String.raw`y_1,y_2,y_3`)} in ${m(String.raw`h^2q=2/16=1/8`)}.</p>
          ${P(String.raw`\begin{pmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{pmatrix}\begin{pmatrix}y_1\\y_2\\y_3\end{pmatrix}=\begin{pmatrix}1/8\\1/8\\1/8\end{pmatrix}`, "sistem")}
          ${P(String.raw`\boxed{y_1=\frac3{16},\qquad y_2=\frac14,\qquad y_3=\frac3{16}}`, "rešitev", "green")}
          <p>Rešitev je simetrična, kar je dobra kontrola. Ujema se tudi s točno rešitvijo ${m(String.raw`y=x(1-x)`)} v vseh mrežnih točkah.</p>
          <hr>
          <p><strong>Mini primer AB2:</strong> pri ${m(String.raw`y'=-y,h=0.1,y_0=1,y_1=0.9`)} je</p>
          ${P(String.raw`y_2=0.9+\frac{0.1}{2}\bigl(3(-0.9)-(-1)\bigr)=0.815`, "AB2")}
        `),
        section("proof", "09 · ZAKAJ", "Red centralne sheme in obrnljivost sistema", proof({
          idea: "Simetrična Taylorjeva razvoja izničita lihe odvode, zato druga centralna razlika doseže red 2.",
          steps: [
            { title: "Razvoj v desno", body: P(String.raw`y_{i+1}=y_i+hy_i'+\frac{h^2}{2}y_i''+\frac{h^3}{6}y_i'''+\frac{h^4}{24}y^{(4)}(\xi_+)`, "Taylor") },
            { title: "Razvoj v levo", body: P(String.raw`y_{i-1}=y_i-hy_i'+\frac{h^2}{2}y_i''-\frac{h^3}{6}y_i'''+\frac{h^4}{24}y^{(4)}(\xi_-)`, "Taylor") },
            { title: "Seštej", body: `Člena z ${m(String.raw`y'`)} in ${m(String.raw`y'''`)} se izničita. Po deljenju z ${m(String.raw`h^2`)} ostane napaka reda ${m(String.raw`O(h^2)`)}` },
            { title: "Matrika", body: `Matrika z 2 na diagonali in −1 ob njej je pozitivno definitna pri Dirichletovih robnih pogojih, zato ima sistem enolično rešitev.` }
          ],
          conclusion: `Diferenčni približek je drugega reda in notranje mrežne vrednosti so enolično določene. <span class="proof-square">□</span>`,
          source: gradivo
        })),
        section("warning", "10 · PASTI", "Tri metode, tri različne nevarnosti", `
          <ul>
            <li>Pri pretvorbi višjega reda pozabiš začetni pogoj za novo komponento, na primer ${m(String.raw`z(0)=y'(0)`)}.</li>
            <li>AB2 uporabiš brez zagonskega ${m(String.raw`y_1`)} ali zamenjaš indekse naklonov.</li>
            <li>V korektor vstaviš ${m(String.raw`f_{n+1}`)}, preden imaš napoved za ${m(String.raw`y_{n+1}`)}.</li>
            <li>Robni problem rešuješ po korakih kot začetnega. Robna vrednost na desni zahteva celoten sistem.</li>
            <li>Znane robne vrednosti pustiš med neznankami namesto da jih prestaviš na desno stran.</li>
            <li>Pri splošni enačbi, ki vsebuje tudi ${m(String.raw`y'`)}, pozabiš centralno prvo razliko ${m(String.raw`(y_{i+1}-y_{i-1})/(2h)`)}.</li>
          </ul>
        `),
        section("recap", "11 · 30 SEKUND", "Povej brez gledanja", `
          <p>»Enačbo višjega reda pretvorim v sistem tako, da uvedem spremenljivke za odvode. Veččlenska metoda uporablja stare naklone in zato potrebuje zagonske vrednosti; AB2 ima uteži ${m(String.raw`3,-1`)} deljene z 2. Pri robnem problemu sta vrednosti znani na obeh koncih, zato za vse notranje ${m(String.raw`y_i`)} sestavim tridiagonalni sistem. Za ${m(String.raw`-y''=q`)} je vrstica ${m(String.raw`-y_{i-1}+2y_i-y_{i+1}=h^2q_i`)}.«</p>
        `)
      ]
    }
  ];
})();
