(() => {
  "use strict";

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const UI = window.StudyUI || {};
  const M = UI.M || ((tex, fallback = tex, display = false) => {
    const mode = display ? ' data-display="block"' : "";
    const className = display ? "js-math math-display" : "js-math math-inline";
    return '<span class="' + className + '" data-tex="' + escapeHtml(tex) + '"' + mode + '>' +
      escapeHtml(fallback) + "</span>";
  });
  const panel = UI.panel || ((tex, fallback = tex, label = "zapis") =>
    '<div class="math-panel" data-label="' + escapeHtml(label) + '">' +
      M(tex, fallback, true) + "</div>");
  const notation = UI.notation || ((intro, entries) =>
    "<p>" + intro + '</p><dl class="notation-grid">' +
      entries.map(entry =>
        '<div class="notation-item"><dt class="notation-symbol">' +
          M(entry.tex, entry.symbol) +
          '</dt><dd class="notation-meaning"><strong>' + entry.name + "</strong>" +
          entry.meaning + "</dd></div>"
      ).join("") +
    "</dl>");
  const sourceNote = UI.sourceNote || ((source, note = "") =>
    '<div class="source-note"><strong>Vir:</strong> ' + source +
      (note ? " · " + note : "") + "</div>");
  const section = UI.section || ((type, label, title, html) => ({ type, label, title, html }));
  const H = parts => parts.join("");
  const m = tex => M(tex, tex);
  const P = (tex, label = "zapis") => panel(tex, tex, label);
  const oralPdf = '<a href="../ustni_izpit_2526.pdf" target="_blank" rel="noopener">' +
    "Uradne teme za ustne izpite 2025/26</a>";

  const speech = items =>
    '<ol class="step-list oral-speech">' +
      items.map((item, index) => "<li><strong>" + (index + 1) + ".</strong> " + item + "</li>").join("") +
    "</ol>";

  const followups = items =>
    '<div class="oral-followups">' +
      items.map(item =>
        "<details><summary>" + item.q + "</summary><p>" + item.a + "</p></details>"
      ).join("") +
    "</div>";

  const officialSection = prompt => section(
    "official",
    "01 · URADNO VPRAŠANJE",
    "Kaj mora odgovor pokriti",
    '<blockquote class="oral-official-prompt">' + prompt + "</blockquote>" +
      "<p>Odgovor gradi po vrstnem redu iz vprašanja. Najprej povej idejo, nato zapis, " +
      "izpeljavo in na koncu omejitve metode.</p>" +
      sourceNote(oralPdf, "PDF, stran 1")
  );

  window.NUM2_ORAL_PART2 = [
    {
      id: "oral-08-pravila-za-odvajanje",
      number: 8,
      chapter: "3 · Numerično odvajanje in integriranje",
      title: "Pravila za odvajanje",
      officialPrompt: "Opišite izpeljavo osnovnih pravil za numerično odvajanje (prema, obratna in simetrična diferenca). Kako natančna so pravila in na kakšne težave lahko naletimo pri njihovi uporabi?",
      accent: "#ff7a90",
      minutes: 8,
      deepLinks: ["odvajanje"],
      sections: [
        officialSection("Opišite izpeljavo osnovnih pravil za numerično odvajanje (prema, obratna in simetrična diferenca). Kako natančna so pravila in na kakšne težave lahko naletimo pri njihovi uporabi?"),
        section("plain", "02 · VZOREN GOVOR", "Odgovor v pravilnem zaporedju", speech([
          H(["Numerično odvajanje uporabimo, ko funkcijo poznamo samo v mrežnih točkah. Odvod nadomestimo s sekantnim naklonom oziroma z linearno kombinacijo bližnjih vrednosti funkcije."]),
          H(["Za premo diferenco uporabim točki ", m("x"), " in ", m("x+h"), ", za obratno ", m("x-h"), " in ", m("x"), ", za simetrično pa obe strani ", m("x-h"), " in ", m("x+h"), "."]),
          H(["Vse tri formule izpeljem s Taylorjevima razvojema okoli ", m("x"), ". Prema in obratna imata vodilno napako reda ", m("h"), ", pri simetrični pa se sodi Taylorjevi členi odštejejo, zato je napaka reda ", m("h^2"), "."]),
          H(["Na levem ali desnem robu intervala pogosto nimamo točk na obeh straneh, zato uporabimo enostransko formulo; v notranjosti je simetrična navadno natančnejša."]),
          H(["Zelo majhen ", m("h"), " ni vedno boljši: odštevamo skoraj enaki funkcijski vrednosti in rezultat delimo z majhnim številom, zato se poveča vpliv zaokrožitvenih napak."])
        ])),
        section("notation", "03 · LEGENDA", "Kaj pomeni vsak simbol", notation(
          "Pred računom povej, v kateri točki iščeš odvod in katere vrednosti funkcije so na voljo.",
          [
            { tex: "x", symbol: "x", name: "osnovna točka", meaning: " — točka, v kateri približujemo odvod." },
            { tex: "h>0", symbol: "h", name: "korak", meaning: " — razdalja do sosednjih mrežnih točk." },
            { tex: "D_h^+f(x)", symbol: "D⁺ₕf(x)", name: "prema diferenca", meaning: " — sekanta od x proti x+h." },
            { tex: "D_h^-f(x)", symbol: "D⁻ₕf(x)", name: "obratna diferenca", meaning: " — sekanta od x−h proti x." },
            { tex: "D_h^0f(x)", symbol: "D⁰ₕf(x)", name: "simetrična diferenca", meaning: " — sekanta čez interval [x−h,x+h]." },
            { tex: "\\xi_+,\\xi_-,\\xi_0", symbol: "ξ₊, ξ₋, ξ₀", name: "vmesne točke", meaning: " — ležijo na ustreznem intervalu Taylorjevega ostanka." },
            { tex: "O(h^p)", symbol: "O(hᵖ)", name: "red napake", meaning: " — ob razpolovitvi h se vodilna napaka približno zmanjša za faktor 2ᵖ." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "Tri sekante na eni mreži", H([
          '<div class="visual-diagram" style="padding:16px;border:1px solid #ff7a90;border-radius:12px">',
          '<svg viewBox="0 0 760 210" role="img" aria-label="Prema, obratna in simetrična diferenčna sekanta">',
          '<path d="M55 158H710" stroke="currentColor" stroke-width="2" opacity=".45"/>',
          '<path d="M100 144C230 134 330 94 390 76S555 57 675 24" fill="none" stroke="currentColor" stroke-width="3" opacity=".45"/>',
          '<path d="M210 126L390 76" stroke="#ff7a90" stroke-width="5"/>',
          '<path d="M390 76L570 48" stroke="#67d8ff" stroke-width="5"/>',
          '<path d="M210 126L570 48" stroke="#a78bfa" stroke-width="4" stroke-dasharray="10 7"/>',
          '<g fill="#ffbd7a"><circle cx="210" cy="126" r="8"/><circle cx="390" cy="76" r="8"/><circle cx="570" cy="48" r="8"/></g>',
          '<g fill="currentColor" font-size="16" text-anchor="middle"><text x="210" y="184">x−h</text><text x="390" y="184">x</text><text x="570" y="184">x+h</text></g>',
          '<g fill="currentColor" font-size="14"><text x="245" y="102">obratna</text><text x="455" y="54">prema</text><text x="353" y="119">simetrična</text></g>',
          "</svg></div>",
          "<p>Na tabli označi tri točke in povej: enostranski sekanti sta uporabni na robu, simetrična pa izkoristi podatke z obeh strani in zaradi simetrije pridobi en red.</p>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Formule, ostanki in red", H([
          P("D_h^+f(x)=\\frac{f(x+h)-f(x)}h,\\qquad f'(x)=D_h^+f(x)-\\frac h2f''(\\xi_+)", "prema diferenca"),
          P("D_h^-f(x)=\\frac{f(x)-f(x-h)}h,\\qquad f'(x)=D_h^-f(x)+\\frac h2f''(\\xi_-)", "obratna diferenca"),
          P("D_h^0f(x)=\\frac{f(x+h)-f(x-h)}{2h},\\qquad f'(x)=D_h^0f(x)-\\frac{h^2}{6}f^{(3)}(\\xi_0)", "simetrična diferenca"),
          '<table class="compare-table"><thead><tr><th>pravilo</th><th>potrebne točke</th><th>diskretizacijska napaka</th></tr></thead><tbody>',
          "<tr><td>prema</td><td>", m("x,x+h"), "</td><td>", m("O(h)"), "</td></tr>",
          "<tr><td>obratna</td><td>", m("x-h,x"), "</td><td>", m("O(h)"), "</td></tr>",
          "<tr><td>simetrična</td><td>", m("x-h,x+h"), "</td><td>", m("O(h^2)"), "</td></tr>",
          "</tbody></table>",
          "<p>Za natančne ostanke predpostavimo dovolj zveznih odvodov; ",
          m("\\xi_+\\in(x,x+h)"), ", ", m("\\xi_-\\in(x-h,x)"), ", ", m("\\xi_0\\in(x-h,x+h)"), ".</p>"
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Taylor pokaže predznake in red", H([
          P("f(x+h)=f(x)+hf'(x)+\\frac{h^2}{2}f''(\\xi_+)", "razvoj v desno"),
          "<p>Odštejemo ", m("f(x)"), ", delimo s ", m("h"), " in preuredimo; dobimo premo formulo z negativnim ostankom v zapisu ", m("f'-D_h^+"), ".</p>",
          P("f(x-h)=f(x)-hf'(x)+\\frac{h^2}{2}f''(\\xi_-)", "razvoj v levo"),
          "<p>Po preureditvi dobimo obratno formulo. Za simetrično formulo razvijemo obe strani do tretjega reda:</p>",
          P("\\begin{aligned}f(x+h)&=f(x)+hf'(x)+\\frac{h^2}{2}f''(x)+\\frac{h^3}{6}f^{(3)}(\\xi_1),\\\\f(x-h)&=f(x)-hf'(x)+\\frac{h^2}{2}f''(x)-\\frac{h^3}{6}f^{(3)}(\\xi_2).\\end{aligned}", "dva razvoja"),
          "<p>Drugo enačbo odštejemo od prve. Konstanta in člen z ", m("f''"), " izgineta; po deljenju z ", m("2h"), " je prvi preostali člen reda ", m("h^2"),
          ". Če je ", m("f^{(3)}"), " zvezna, je povprečje vrednosti v ", m("\\xi_1,\\xi_2"), " enako ", m("f^{(3)}(\\xi_0)"),
          " za neko ", m("\\xi_0\\in(x-h,x+h)"), ". To je razlog za višji red, ne formula na pamet.</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Kaj napišeš v prvih dveh minutah", H([
          '<ol class="step-list">',
          "<li>Nariši ", m("x-h,\\ x,\\ x+h"), " in tri sekante.</li>",
          "<li>Napiši Taylorjeva razvoja ", m("f(x\\pm h)"), " okoli ", m("x"), ".</li>",
          "<li>Iz prvega izpelji premo, iz drugega obratno, z odštevanjem obeh simetrično formulo.</li>",
          "<li>Pod formule zapiši ", m("O(h),O(h),O(h^2)"), " ter intervale za ", m("\\xi"), ".</li>",
          "<li>Zaključi z robom intervala, izničenjem sodih členov in kompromisom diskretizacija–zaokroževanje.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "Zakaj je simetrična formula boljša", H([
          "<p>Naj bo ", m("f(x)=x^3"), ", ", m("x=1"), ", ", m("h=0.1"), ". Točno je ", m("f'(1)=3"), ".</p>",
          P("D_h^+f(1)=\\frac{1.1^3-1}{0.1}=3.31", "prema"),
          P("D_h^-f(1)=\\frac{1-0.9^3}{0.1}=2.71", "obratna"),
          P("D_h^0f(1)=\\frac{1.1^3-0.9^3}{0.2}=3.01", "simetrična"),
          "<p>Pri istem koraku sta enostranski napaki približno linearni v ", m("h"), ", simetrična pa ima napako ", m("0.01=h^2"), ".</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Kratek odgovor brez ugibanja", followups([
          { q: "Zakaj simetrična formula ni prvega reda?", a: H(["Ker se pri odštevanju Taylorjevih razvojev izničijo vsi sodi členi; po ", m("2hf'"), " je prvi preostali člen sorazmeren z ", m("h^3"), ", po deljenju z ", m("2h"), " pa z ", m("h^2"), "."]) },
          { q: "Katero formulo uporabiš na levem robu intervala?", a: "Praviloma premo oziroma drugo enostransko formulo, ker vrednosti levo od roba niso na voljo." },
          { q: "Kaj pomeni red p?", a: H(["Če je vodilna napaka ", m("Ch^p"), ", razpolovitev koraka asimptotično zmanjša ta del napake približno za ", m("2^p"), "."]) },
          { q: "Zakaj h ne sme biti poljubno majhen?", a: H(["Zaradi katastrofalnega odštevanja skoraj enakih števil in deljenja z ", m("h"), ". Grob model skupne napake je ", m("C_dh^p+C_r\\varepsilon_{\\rm mach}/h"), "."]) },
          { q: "Kako izpelješ formulo na poljubnem stencilu?", a: H(["Nastaviš ", m("\\sum_j A_jf(x+\\delta_j)"), " in zahtevaš točnost na monomih ", m("1,(t-x),(t-x)^2,\\ldots"), ". Prvi neuspešni monom določi ostanek."]) }
        ])),
        section("warning", "10 · PASTI", "Kje se odgovor najhitreje podre", H([
          "<ul>",
          "<li>Ne zamenjaj predznaka: vedno povej, ali zapisuješ ", m("f'-D_h"), " ali ", m("D_h-f'"), ".</li>",
          "<li>Simetrična formula ima imenovalec ", m("2h"), ", ne ", m("h"), ".</li>",
          "<li>Red formule ni število uporabljenih točk; določa ga prvi neizničeni Taylorjev člen.</li>",
          "<li>Na robu ne uporabljaj točke, ki ni v podatkovnem območju.</li>",
          "<li>Manjšanje ", m("h"), " zmanjšuje diskretizacijsko, ne nujno skupne napake.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Premo, obratno in simetrično diferenco izpeljem iz Taylorjevih razvojev okoli točke ",
          m("x"), ". Prema in obratna uporabljata enostransko sekanto in sta reda 1. Simetrična uporablja obe strani; sodi členi se izničijo, zato je reda 2. Na robu izberem enostransko formulo. Pri zelo majhnem koraku pa zaradi odštevanja skoraj enakih vrednosti začne prevladovati zaokrožitvena napaka.«</p>"
        ]))
      ]
    },

    {
      id: "oral-09-newton-cotesova-pravila",
      number: 9,
      chapter: "3 · Numerično odvajanje in integriranje",
      title: "Newton–Cotesova integracijska pravila",
      officialPrompt: "Opišite izpeljavo trapeznega in Simpsonovega pravila. Kaj nam o pravilu pove njegov ostanek? Zakaj in kako definiramo sestavljena pravila?",
      accent: "#67d8ff",
      minutes: 9,
      deepLinks: ["newton-cotes"],
      sections: [
        officialSection("Opišite izpeljavo trapeznega in Simpsonovega pravila. Kaj nam o pravilu pove njegov ostanek? Zakaj in kako definiramo sestavljena pravila?"),
        section("plain", "02 · VZOREN GOVOR", "Od interpolanta do sestavljenega pravila", speech([
          H(["Newton–Cotesova pravila dobimo tako, da funkcijo v enakomerno razporejenih vozliščih nadomestimo z interpolacijskim polinomom in nato ta polinom eksaktno integriramo. Integrali Lagrangeevih baz so kvadraturne uteži."]),
          H(["Trapez uporablja linearni interpolant skozi krajišči ", m("a,b"), ". Simpson uporabi še sredino in kvadratni interpolant, vendar je zaradi simetrije točen celo za vse kubične polinome."]),
          H(["Ostanek pove predznak in velikost vodilne napake, zahtevano gladkost ter stopnjo točnosti pravila. Iz njega dobimo tudi oceno napake z maksimumom ustreznega odvoda."]),
          H(["Namesto enega visokostopenjskega pravila interval razdelimo na kratke podintervale in na vsakem uporabimo isto nizkostopenjsko pravilo. Lokalne približke seštejemo; tako dobimo sestavljeni trapez oziroma sestavljeni Simpson."]),
          H(["Pri sestavljenem Simpsonu mora biti število podintervalov sodo. Pri dovolj gladki funkciji ima sestavljeni trapez globalno napako ", m("O(h^2)"), ", sestavljeni Simpson pa ", m("O(h^4)"), "."])
        ])),
        section("notation", "03 · LEGENDA", "Interval, vozlišča, uteži in ostanek", notation(
          "Kvadraturo vedno loči na točni integral, numerični približek in člen napake.",
          [
            { tex: "I(f)=\\int_a^bf(x)\\,dx", symbol: "I(f)", name: "točni integral", meaning: " — količina, ki jo želimo približati." },
            { tex: "Q(f)=\\sum_iw_if(x_i)", symbol: "Q(f)", name: "kvadraturno pravilo", meaning: " — utežena vsota funkcijskih vrednosti." },
            { tex: "x_i", symbol: "xᵢ", name: "vozlišča", meaning: " — točke, v katerih vrednotimo funkcijo." },
            { tex: "w_i", symbol: "wᵢ", name: "uteži", meaning: " — integrali interpolacijskih baznih polinomov." },
            { tex: "m", symbol: "m", name: "število podintervalov", meaning: " — pri Simpsonu mora biti sodo." },
            { tex: "h=(b-a)/m", symbol: "h", name: "mrežni korak", meaning: " — dolžina enega podintervala." },
            { tex: "I(f)-Q(f)", symbol: "E(f)", name: "ostanek", meaning: " — napaka pravila z jasno izbranim predznakom." },
            { tex: "\\xi\\in(a,b)", symbol: "ξ", name: "vmesna točka", meaning: " — točka, v kateri nastopa odvod v eksaktnem ostanku." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "Premica, parabola in razdeljen interval", H([
          '<div class="visual-diagram" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">',
          '<div style="padding:14px;border:1px solid #67d8ff;border-radius:12px"><strong>En panel</strong>',
          '<svg viewBox="0 0 340 170" role="img" aria-label="Trapezni in Simpsonov približek na enem intervalu">',
          '<path d="M35 140H315M50 150V25" stroke="currentColor" stroke-width="2" opacity=".45"/>',
          '<path d="M70 121Q170 30 285 84" fill="none" stroke="#a78bfa" stroke-width="4"/>',
          '<path d="M70 121L285 84" fill="none" stroke="#ff7a90" stroke-width="4" stroke-dasharray="9 6"/>',
          '<g fill="#ffbd7a"><circle cx="70" cy="121" r="7"/><circle cx="178" cy="59" r="7"/><circle cx="285" cy="84" r="7"/></g>',
          '<g fill="currentColor" text-anchor="middle"><text x="70" y="162">a</text><text x="178" y="162">(a+b)/2</text><text x="285" y="162">b</text></g>',
          "</svg><small>trapez = premica; Simpson = parabola skozi tri točke</small></div>",
          '<div style="padding:14px;border:1px solid #67d8ff;border-radius:12px"><strong>Sestavljeno</strong>',
          "<p>", m("a=x_0<x_1<\\cdots<x_m=b"), "</p>",
          "<p>Na vsakem kratkem kosu integriramo lokalni interpolant, nato prispevke seštejemo. Pri Simpsonu združujemo podintervale v pare.</p></div>",
          "</div>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Osnovni in sestavljeni formuli", H([
          P("T(f)=\\frac{b-a}{2}\\bigl(f(a)+f(b)\\bigr),\\qquad I(f)-T(f)=-\\frac{(b-a)^3}{12}f''(\\xi)", "trapez"),
          P("S(f)=\\frac{b-a}{6}\\left[f(a)+4f\\!\\left(\\frac{a+b}{2}\\right)+f(b)\\right]", "Simpson"),
          P("I(f)-S(f)=-\\frac{(b-a)^5}{2880}f^{(4)}(\\xi)", "Simpsonov ostanek"),
          "<p>Za ", m("x_i=a+ih"), " in ", m("h=(b-a)/m"), ":</p>",
          P("T_h=h\\left[\\frac12f_0+\\sum_{i=1}^{m-1}f_i+\\frac12f_m\\right]", "sestavljeni trapez"),
          P("S_h=\\frac h3\\left[f_0+4\\sum_{\\substack{1\\le i\\le m-1\\\\i\\ {\\rm lih}}}f_i+2\\sum_{\\substack{2\\le i\\le m-2\\\\i\\ {\\rm sod}}}f_i+f_m\\right],\\quad m\\ {\\rm sod}", "sestavljeni Simpson"),
          P("I-T_h=-\\frac{b-a}{12}h^2f''(\\xi),\\qquad I-S_h=-\\frac{b-a}{180}h^4f^{(4)}(\\eta)", "globalna ostanka")
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Integriraj interpolant, ne ugibaj uteži", H([
          "<p><strong>Trapez.</strong> Linearni Lagrangeev interpolant je</p>",
          P("p_1(x)=f(a)\\frac{b-x}{b-a}+f(b)\\frac{x-a}{b-a}", "linearni interpolant"),
          "<p>Integrala obeh baz sta ", m("(b-a)/2"), ", zato je ", m("\\int_a^bp_1=T"), ". Interpolacijski ostanek je ",
          m("f(x)-p_1(x)=\\tfrac12f''(\\xi_x)(x-a)(x-b)"),
          "; ker je produkt na intervalu nepozitiven, integracija da trapezni ostanek z minusom.</p>",
          "<p><strong>Simpson.</strong> Na normiranem intervalu ", m("[-1,1]"), " zaradi simetrije nastavimo ",
          m("Q(f)=Af(-1)+Bf(0)+Af(1)"), ", nato zahtevamo točnost na ", m("1,t,t^2"), ":</p>",
          P("2A+B=2,\\qquad 2A=\\frac23\\quad\\Longrightarrow\\quad A=\\frac13,\\ B=\\frac43", "Simpsonove uteži"),
          "<p>Lihi monom ", m("t^3"), " se integrira in sešteje v 0, zato je stopnja točnosti 3. Prvi neuspeh je pri ",
          m("t^4"), "; po preslikavi na ", m("[a,b]"), " dobimo člen ", m("-(b-a)^5f^{(4)}(\\xi)/2880"), ".</p>",
          "<p><strong>Sestavljanje.</strong> Lokalna trapezna napaka je reda ", m("h^3"), ", takih kosov pa je približno ",
          m("(b-a)/h"), ", zato globalno dobimo ", m("O(h^2)"), ". Enako lokalni Simpsonov ", m("O(h^5)"),
          " po seštevanju da ", m("O(h^4)"), ".</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Vrstni red za devetminutni odgovor", H([
          '<ol class="step-list">',
          "<li>Napiši splošno idejo ", m("Q(f)=\\int_a^b I_nf=\\sum_iw_if(x_i)"), ".</li>",
          "<li>Nariši premico skozi krajišči in integriraj linearni Lagrangeev interpolant.</li>",
          "<li>Na ", m("[-1,1]"), " izpelji Simpsonove uteži ", m("1,4,1"), " iz momentov.</li>",
          "<li>Ob obe formuli napiši natančen ostanek in stopnjo točnosti.</li>",
          "<li>Nariši mrežo, napiši sestavljeni formuli ter opozori na sodi ", m("m"), " pri Simpsonu.</li>",
          "<li>Zaključi: sestavljanje zmanjša korak, ohrani nizko stopnjo lokalnega interpolanta in omogoči sistematično kontrolo napake.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "Trapez zgreši, Simpson zadene kubik", H([
          "<p>Za ", m("I=\\int_0^2x^3\\,dx=4"), " dobimo</p>",
          P("T=\\frac{2}{2}\\bigl(0^3+2^3\\bigr)=8", "trapez"),
          P("S=\\frac{2}{6}\\bigl(0^3+4\\cdot1^3+2^3\\bigr)=4", "Simpson"),
          "<p>Simpson je točen, ker je njegova stopnja točnosti 3; to ni naključje posameznega primera.</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Odgovori, ki zaključijo misel", followups([
          { q: "Zakaj je Simpson točen za kubične polinome, če uporablja kvadratni interpolant?", a: "Zaradi simetrije. Na normiranem simetričnem intervalu je kubični monom lih, zato sta njegov integral in Simpsonova vsota enaka 0." },
          { q: "Kaj pove ostanek poleg reda?", a: "Pove zahtevani odvod, predznak napake pri znaku tega odvoda, natančno potenco dolžine oziroma koraka in omogoči zgornjo oceno z normo odvoda." },
          { q: "Zakaj mora biti m pri sestavljenem Simpsonu sodo?", a: "En Simpsonov panel uporablja dva zaporedna podintervala in tri vozlišča; celotno mrežo moramo zato razdeliti v pare podintervalov." },
          { q: "Kaj je zaprto in kaj odprto Newton–Cotesovo pravilo?", a: "Zaprto uporablja krajišči intervala, odprto ju izpusti. Odprto je uporabno, kadar funkcija na robovih ni definirana ali je neugodna." },
          { q: "Kako hitro preveriš uteži?", a: H(["Na konstanti: vsota uteži mora biti ", m("b-a"), ", ker mora veljati ", m("Q(1)=\\int_a^b1\\,dx"), "."]) },
          { q: "Zakaj ne vzamemo enega Newton–Cotesovega pravila zelo visoke stopnje?", a: "Visokostopenjska interpolacija na enakomernih vozliščih je lahko oscilatorna, uteži pa velike ali negativne. Sestavljanje nizkostopenjskega pravila je stabilnejše in lokalno prilagodljivo." }
        ])),
        section("warning", "10 · PASTI", "Štiri formule, ki jih ne smeš pomešati", H([
          "<ul>",
          "<li>En Simpsonov panel uporablja faktor ", m("(b-a)/6"), ", sestavljeni pa ", m("h/3"), ".</li>",
          "<li>Simpsonove uteži so ", m("1,4,2,4,\\ldots,2,4,1"), ", ne izmenično 1 in 4 do konca.</li>",
          "<li>Trapezni ostanek vsebuje ", m("f''"), ", Simpsonov ", m("f^{(4)}"), "; oba sta v zapisu ", m("I-Q"), " negativna.</li>",
          "<li>Stopnja točnosti pomeni točnost za vse polinome do te stopnje, ne le za en posrečen višji polinom.</li>",
          "<li>Pri sestavljanju razlikuj lokalno potenco dolžine od globalne potence koraka.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Newton–Cotes dobim z integriranjem interpolanta v enakomernih vozliščih. Trapez integrira premico in je točen do stopnje 1, njegov ostanek je ",
          m("-(b-a)^3f''(\\xi)/12"), ". Simpson uporablja krajišči in sredino, uteži 1–4–1 ter je zaradi simetrije točen do stopnje 3; ostanek vsebuje četrti odvod. Pri sestavljenih pravilih interval razdelim, lokalna pravila seštejem in dobim globalni red 2 oziroma 4.«</p>"
        ]))
      ]
    },
    {
      id: "oral-10-izboljsana-pravila-integriranja",
      number: 10,
      chapter: "3 · Numerično odvajanje in integriranje",
      title: "Izboljšana pravila za integriranje",
      officialPrompt: "Opišite enega izmed pristopov, s katerimi lahko približek za integral izračunamo učinkoviteje kot z Newton–Cotesovimi pravili.",
      accent: "#a78bfa",
      minutes: 7,
      deepLinks: ["izboljsana-integracija", "newton-cotes"],
      sections: [
        officialSection("Opišite enega izmed pristopov, s katerimi lahko približek za integral izračunamo učinkoviteje kot z Newton–Cotesovimi pravili."),
        section("plain", "02 · VZOREN GOVOR", "Izberem Romberg in ga izpeljem do konca", speech([
          H(["Kot izboljšavo izberem <strong>Richardsonovo ekstrapolacijo oziroma Rombergovo metodo</strong>. Ne povečujem stopnje enega Newton–Cotesovega interpolanta, ampak kombiniram sestavljene trapezne približke na gnezdenih mrežah."]),
          H(["Za dovolj gladko funkcijo ima sestavljeni trapez razvoj ", m("T_h=I+c_2h^2+c_4h^4+\\cdots"), ". Na mreži s polovičnim korakom se vodilni člen zmanjša za faktor 4."]),
          H(["Zato kombinacija ", m("(4T_{h/2}-T_h)/3"), " natančno izniči člen s ", m("h^2"), " in pusti napako reda ", m("h^4"), ". To je prvi Richardsonov korak."]),
          H(["Postopek ponavljamo v trikotni Rombergovi tabeli. Vsak nov stolpec izniči naslednjo sodo potenco napake; delitelj v stolpcu ", m("j"), " je ", m("4^j-1"), "."]),
          H(["Račun je učinkovit, ker so mreže gnezdene: pri razpolovitvi koraka ponovno uporabimo vse stare funkcijske vrednosti in izračunamo samo nove sredinske točke."]),
          H(["Metoda potrebuje dovolj gladko funkcijo in pravilen razvoj napake. Pri singularnosti, nezveznosti ali močnem šumu lahko ekstrapolacija postane nezanesljiva; takrat je primernejša adaptivna delitev."])
        ])),
        section("notation", "03 · LEGENDA", "Kako bereš Rombergovo tabelo", notation(
          "Indeksa ne pomenita iste stvari: prvi šteje zgostitve mreže, drugi pa ekstrapolacije.",
          [
            { tex: "I=\\int_a^bf(x)\\,dx", symbol: "I", name: "točni integral", meaning: " — neznana ciljna vrednost." },
            { tex: "h_k=h_0/2^k", symbol: "hₖ", name: "korak k-te mreže", meaning: " — vsaka naslednja mreža je dvakrat gostejša." },
            { tex: "T_{h_k}", symbol: "Tₕₖ", name: "sestavljeni trapez", meaning: " — prvi stolpec Rombergove tabele." },
            { tex: "R_{k,0}=T_{h_k}", symbol: "Rₖ,₀", name: "osnovni stolpec", meaning: " — še brez ekstrapolacije." },
            { tex: "R_{k,j}", symbol: "Rₖ,ⱼ", name: "ekstrapolirani približek", meaning: " — j vodilnih sodih členov je odstranjenih." },
            { tex: "c_{2r}", symbol: "c₂ᵣ", name: "koeficient napake", meaning: " — odvisen je od funkcije in intervala, ne pa od h." },
            { tex: "\\mathrm{tol}", symbol: "tol", name: "toleranca", meaning: " — prag za ustavitev na podlagi razlike zaporednih približkov." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "Trikotna tabela in gnezdene mreže", H([
          '<div class="visual-diagram" style="display:grid;grid-template-columns:1fr 1.2fr;gap:14px">',
          '<div style="padding:14px;border:1px solid #a78bfa;border-radius:12px">',
          "<strong>Gnezdene mreže</strong><p>", m("h_0\\;\\longrightarrow\\;h_0/2\\;\\longrightarrow\\;h_0/4"), "</p>",
          "<p>Stare točke ostanejo; dodamo samo sredine starih podintervalov.</p></div>",
          '<div style="padding:14px;border:1px solid #a78bfa;border-radius:12px">',
          '<strong>Rombergov trikotnik</strong><table class="compare-table"><tbody>',
          "<tr><td>", m("T_{h_0}"), "</td><td></td><td></td></tr>",
          "<tr><td>", m("T_{h_1}"), "</td><td>", m("R_{1,1}"), "</td><td></td></tr>",
          "<tr><td>", m("T_{h_2}"), "</td><td>", m("R_{2,1}"), "</td><td>", m("R_{2,2}"), "</td></tr>",
          "</tbody></table></div></div>",
          "<p>Na tabli s puščico poveži dva sosednja elementa prejšnjega stolpca z novim elementom desno: iz njune razlike odstraniš vodilni člen napake.</p>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Richardson in splošna Rombergova rekurzija", H([
          P("T_h=I+c_2h^2+c_4h^4+c_6h^6+\\cdots", "razvoj trapezne napake"),
          P("R_{1,1}=\\frac{4T_{h/2}-T_h}{3}=I+O(h^4)", "prvi Richardsonov korak"),
          P("R_{k,0}=T_{h_k},\\qquad R_{k,j}=R_{k,j-1}+\\frac{R_{k,j-1}-R_{k-1,j-1}}{4^j-1}", "Rombergova rekurzija"),
          P("R_{k,j}=I+O\\!\\left(h_k^{2j+2}\\right),\\qquad 0\\le j\\le k", "red po stolpcih"),
          P("T_{h/2}=\\frac12T_h+\\frac h2\\sum_{i=0}^{m-1}f\\!\\left(a+\\left(i+\\frac12\\right)h\\right)", "ponovna uporaba vrednosti"),
          "<p>Zadnja formula velja, kadar ima stara sestavljena mreža ", m("m"), " podintervalov dolžine ", m("h"), ".</p>"
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Od kod prideta 4 in 3", H([
          "<p>Zapišemo prva dva člena razvoja na dveh mrežah:</p>",
          P("\\begin{aligned}T_h&=I+c_2h^2+c_4h^4+O(h^6),\\\\T_{h/2}&=I+\\frac14c_2h^2+\\frac1{16}c_4h^4+O(h^6).\\end{aligned}", "dve gostoti"),
          "<p>Drugo enačbo pomnožimo s 4 in odštejemo prvo:</p>",
          P("4T_{h/2}-T_h=3I-\\frac34c_4h^4+O(h^6)", "izničenje"),
          "<p>Po deljenju s 3 dobimo približek reda 4. V naslednjem stolpcu je vodilna potenca že ",
          m("h^4"), "; razpolovitev jo zmanjša za ", m("2^4=16"), ", zato je naslednji delitelj ",
          m("16-1=4^2-1"), ". Splošno v stolpcu ", m("j"), " odstranjujemo člen ", m("h^{2j}"),
          ", zato nastopi ", m("4^j-1"), ".</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Sedemminutni odgovor brez odmikov", H([
          '<ol class="step-list">',
          "<li>Povej, da boš od dovoljenih pristopov izbral Rombergovo metodo.</li>",
          "<li>Napiši razvoj trapezne napake v sodih potencah ", m("h"), ".</li>",
          "<li>V dveh vrsticah izpelji ", m("R_{1,1}=(4T_{h/2}-T_h)/3"), ".</li>",
          "<li>Nariši trikotno tabelo in napiši splošno rekurzijo.</li>",
          "<li>Pojasni gnezdenje mrež in ponovno uporabo starih vrednosti funkcije.</li>",
          "<li>Zaključi s pogoji: gladkost, smiselna toleranca in previdnost pri singularnostih oziroma zaokroževanju.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "En Richardsonov korak zadene kvadrat", H([
          "<p>Naj bo ", m("I=\\int_0^1x^2\\,dx=1/3"), ". Trapez na enem in dveh podintervalih da</p>",
          P("T_1=\\frac12,\\qquad T_{1/2}=\\frac12\\left(\\frac14+\\frac12\\right)=\\frac38", "dve mreži"),
          P("R_{1,1}=\\frac{4(3/8)-1/2}{3}=\\frac13", "ekstrapolacija"),
          "<p>Pri tem primeru ekstrapolacija ni le natančnejša, ampak je eksaktna, ker po odstranitvi člena reda ", m("h^2"), " ni več višjih prispevkov.</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Kaj lahko profesor takoj obrne", followups([
          { q: "Zakaj je v prvem koraku faktor 4?", a: H(["Ker je vodilna trapezna napaka sorazmerna z ", m("h^2"), "; pri ", m("h/2"), " postane štirikrat manjša."]) },
          { q: "Zakaj v Rombergu nastopi 4^j−1?", a: H(["V stolpcu ", m("j"), " izničujemo člen reda ", m("h^{2j}"), ", ki se ob razpolovitvi zmanjša za ", m("2^{2j}=4^j"), "."]) },
          { q: "V čem je računska učinkovitost?", a: "Mreže so gnezdene. Vsi stari funkcijski izračuni ostanejo uporabni, na novi mreži ovrednotimo le sredine starih podintervalov." },
          { q: "Ali Romberg vedno izboljša rezultat?", a: "Ne. Potrebuje gladko funkcijo in regularen razvoj napake v sodih potencah. Singularnosti, nezveznosti, močne oscilacije ali zaokroževanje lahko pokvarijo ekstrapolacijo." },
          { q: "Kako bi izbral drug izboljšani pristop?", a: "Gaussova pravila premikajo tudi vozlišča in z n točkami dosežejo stopnjo 2n−1; adaptivni Simpson pa deli samo intervale, kjer je lokalna ocena napake velika." },
          { q: "Kako oceniš, kdaj končati?", a: H(["Praktično spremljaš razliko novih diagonalnih približkov, na primer ", m("|R_{k,k}-R_{k-1,k-1}|"), ", vendar je to ocena, ne eksakten ostanek."]) }
        ])),
        section("warning", "10 · PASTI", "Česa Rombergova tabela ne odpusti", H([
          "<ul>",
          "<li>Za trapezno osnovo je delitelj ", m("4^j-1"), ", ne ", m("2^j-1"), ".</li>",
          "<li>Indeks ", m("k"), " pomeni zgostitev mreže, ", m("j"), " pa stopnjo ekstrapolacije; vedno mora veljati ", m("j\\le k"), ".</li>",
          "<li>Ne računaj vseh funkcijskih vrednosti znova; s tem izgubiš glavno računsko prednost.</li>",
          "<li>Red ", m("O(h^4)"), " po prvem koraku velja ob predpostavki ustreznega gladkega razvoja napake.</li>",
          "<li>Pri zelo gostih mrežah lahko zaokroževanje prevlada, čeprav formalni red raste.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Kot izboljšano integriranje izberem Romberg. Sestavljeni trapez ima razvoj ",
          m("I+c_2h^2+c_4h^4+\\cdots"), ". Ker se člen ", m("h^2"), " pri polovičnem koraku zmanjša za 4, ga kombinacija ",
          m("(4T_{h/2}-T_h)/3"), " izniči in da red 4. Postopek nadaljujem z rekurzijo z deliteljem ",
          m("4^j-1"), ". Gnezdene mreže ponovno uporabijo stare vrednosti, zato je metoda učinkovita, če je funkcija dovolj gladka.«</p>"
        ]))
      ]
    },
    {
      id: "oral-11-enoclenske-runge-kutta",
      number: 11,
      chapter: "4 · Numerično reševanje diferencialnih enačb",
      title: "Enočlenske metode in Runge–Kutta",
      officialPrompt: "Kako izpeljemo eksplicitno in implicitno Eulerjevo metodo ter kako z njima rešimo začetni problem? Kakšna je ideja posplošitve teh dveh metod na Runge–Kutta metode? Opišite katero izmed večstopenjskih metod tega tipa na podlagi Butcherjeve sheme.",
      accent: "#ffbd7a",
      minutes: 10,
      deepLinks: ["euler-trapez", "runge-kutta"],
      sections: [
        officialSection("Kako izpeljemo eksplicitno in implicitno Eulerjevo metodo ter kako z njima rešimo začetni problem? Kakšna je ideja posplošitve teh dveh metod na Runge–Kutta metode? Opišite katero izmed večstopenjskih metod tega tipa na podlagi Butcherjeve sheme."),
        section("plain", "02 · VZOREN GOVOR", "Od začetnega problema do Butcherjeve tabele", speech([
          H(["Začnem z začetnim problemom ", m("y'=f(x,y),\\ y(x_0)=y_0"), " in mrežo ", m("x_n=x_0+nh"), ". Enočlenska metoda iz ", m("y_n"), " izračuna ", m("y_{n+1}"), " brez starejše zgodovine."]),
          H(["Eksplicitni Euler dobim iz preme diference v stari točki: premaknem se za ", m("h"), " v smeri naklona ", m("f(x_n,y_n)"), ". Pri implicitnem Eulerju uporabim obratno diferenco in naklon v novi točki, zato je ", m("y_{n+1}"), " neznanka na obeh straneh."]),
          H(["Obe Eulerjevi metodi imata lokalno napako ", m("O(h^2)"), " in pod običajnimi predpostavkami globalno napako ", m("O(h)"), ". Implicitna metoda je računsko dražja, ker na vsakem koraku rešujemo enačbo, vendar ima boljše stabilnostne lastnosti."]),
          H(["Runge–Kutta ohrani enočlensko naravo, vendar znotraj istega koraka izračuna več pomožnih naklonov ", m("k_i"), " na premišljeno izbranih vmesnih točkah. Končni premik je njihova utežena vsota."]),
          H(["Butcherjeva tabela vsebuje vektor ", m("c"), " časovnih odmikov, matriko ", m("A=(a_{ij})"), " notranjih kombinacij in vektor ", m("b"), " končnih uteži. Strogo spodnje trikotna ", m("A"), " pomeni eksplicitno metodo; neničelna diagonala ali zgornji del pomeni implicitno."]),
          H(["Kot konkreten primer opišem sredinsko RK2: prvi naklon naredi Eulerjev polkorak do sredine, drugi naklon izmerim v tej napovedani sredini in z njim opravim cel korak. Metoda je globalno drugega reda."])
        ])),
        section("notation", "03 · LEGENDA", "Začetni problem, korak in stopnje", notation(
          "Pri Runge–Kutta jasno loči mrežne približke od notranjih stopenj enega koraka.",
          [
            { tex: "y'=f(x,y)", symbol: "y′=f(x,y)", name: "diferencialna enačba", meaning: " — f določa naklon rešitve." },
            { tex: "y(x_0)=y_0", symbol: "y(x₀)=y₀", name: "začetni pogoj", meaning: " — vsi koraki se začnejo iz znane vrednosti." },
            { tex: "x_n=x_0+nh", symbol: "xₙ", name: "mrežna točka", meaning: " — h je razmik do naslednje točke." },
            { tex: "y_n\\approx y(x_n)", symbol: "yₙ", name: "mrežni približek", meaning: " — rezultat po n korakih." },
            { tex: "\\Phi(x_n,y_n,h)", symbol: "Φ", name: "numerični odvod", meaning: " — efektivni naklon enočlenske metode." },
            { tex: "k_i", symbol: "kᵢ", name: "RK-stopnja", meaning: " — pomožni naklon znotraj trenutnega koraka, ne nov mrežni približek." },
            { tex: "c_i", symbol: "cᵢ", name: "časovni odmik", meaning: " — stopnjo vrednotimo pri xₙ+cᵢh." },
            { tex: "a_{ij},b_i", symbol: "aᵢⱼ, bᵢ", name: "Butcherjeve uteži", meaning: " — aᵢⱼ gradijo notranja stanja, bᵢ pa končni premik." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "En zunanji korak, več notranjih naklonov", H([
          '<div class="visual-diagram" style="display:grid;grid-template-columns:1fr 1.25fr;gap:14px">',
          '<div style="padding:14px;border:1px solid #ffbd7a;border-radius:12px"><strong>Enočlenski korak</strong>',
          "<p>", m("(x_n,y_n)\\ \\longrightarrow\\ (x_{n+1},y_{n+1})"), "</p>",
          "<p>Euler: en naklon. RK: več notranjih naklonov, vendar še vedno samo en stari mrežni približek.</p></div>",
          '<div style="padding:14px;border:1px solid #ffbd7a;border-radius:12px"><strong>Butcherjeva shema</strong>',
          P("\\begin{array}{c|ccc}c_1&a_{11}&\\cdots&a_{1s}\\\\\\vdots&\\vdots&&\\vdots\\\\c_s&a_{s1}&\\cdots&a_{ss}\\\\\\hline&b_1&\\cdots&b_s\\end{array}", "c | A / b"),
          "<p>Vrstica ", m("i"), " zgradi ", m("k_i"), "; spodnja vrstica se uporabi šele za ", m("y_{n+1}"), ".</p></div></div>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Euler, splošni RK in sredinska RK2", H([
          P("y_{n+1}=y_n+h\\Phi(x_n,y_n,h)", "splošna enočlenska metoda"),
          P("y_{n+1}=y_n+hf(x_n,y_n)", "eksplicitni Euler"),
          P("y_{n+1}=y_n+hf(x_{n+1},y_{n+1})", "implicitni Euler"),
          P("k_i=f\\!\\left(x_n+c_ih,\\ y_n+h\\sum_{j=1}^{s}a_{ij}k_j\\right),\\qquad y_{n+1}=y_n+h\\sum_{i=1}^{s}b_ik_i", "splošni Runge–Kutta"),
          P("\\begin{array}{c|cc}0&0&0\\\\\\frac12&\\frac12&0\\\\\\hline&0&1\\end{array}", "sredinska RK2"),
          P("k_1=f(x_n,y_n),\\quad k_2=f\\!\\left(x_n+\\frac h2,y_n+\\frac h2k_1\\right),\\quad y_{n+1}=y_n+hk_2", "prepis tabele"),
          "<p>Eulerjevi metodi: lokalna napaka ", m("O(h^2)"), ", globalna ", m("O(h)"), ". Sredinska RK2: lokalna ",
          m("O(h^3)"), ", globalna ", m("O(h^2)"), ", ob običajnih gladkostnih in stabilnostnih predpostavkah.</p>"
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Najprej Euler, nato pogoji reda 2", H([
          "<p><strong>Euler.</strong> Taylorjev razvoj rešitve v stari točki da</p>",
          P("y(x_{n+1})=y(x_n)+hy'(x_n)+O(h^2)=y(x_n)+hf(x_n,y(x_n))+O(h^2)", "eksplicitni korak"),
          "<p>Zamenjava točnih vrednosti s približki da eksplicitni Euler. Če namesto tega odvod v novi točki nadomestimo z obratno diferenco, dobimo</p>",
          P("y(x_{n+1})=y(x_n)+hf(x_{n+1},y(x_{n+1}))+O(h^2)", "implicitni korak"),
          "<p><strong>Zakaj sredinska RK2 doseže red 2.</strong> Točna rešitev ima razvoj</p>",
          P("y(x_n+h)=y_n+hf_n+\\frac{h^2}{2}\\bigl(f_x+f_yf\\bigr)_n+O(h^3)", "točni Taylor"),
          "<p>Za splošni dvostopenjski eksplicitni nastavek razširimo drugo stopnjo:</p>",
          P("\\begin{aligned}k_1&=f_n,\\\\k_2&=f(x_n+c_2h,y_n+a_{21}hk_1)\\\\&=f_n+h\\bigl(c_2f_x+a_{21}f_yf_n\\bigr)+O(h^2),\\\\y_{n+1}&=y_n+h(b_1k_1+b_2k_2).\\end{aligned}", "razvoj metode"),
          "<p>Primerjava koeficientov da ", m("b_1+b_2=1"), ", ", m("b_2c_2=1/2"), " in ",
          m("b_2a_{21}=1/2"), ". Izbira ", m("b_1=0,b_2=1,c_2=a_{21}=1/2"), " je prav sredinska RK2.</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Deset minut brez mešanja pojmov", H([
          '<ol class="step-list">',
          "<li>Napiši začetni problem, mrežo in splošno enočlensko obliko.</li>",
          "<li>Iz preme in obratne diference izpelji obe Eulerjevi formuli; pri implicitni obkroži novi ", m("y_{n+1}"), " na obeh straneh.</li>",
          "<li>Povej lokalni in globalni red ter zakaj implicitni korak zahteva reševanje enačbe.</li>",
          "<li>Nariši splošno Butcherjevo tabelo in prevedi ", m("c,A,b"), " v enačbe za ", m("k_i"), ".</li>",
          "<li>Napiši tabelo sredinske RK2 in iz nje vrstico za vrstico izpiši ", m("k_1,k_2,y_{n+1}"), ".</li>",
          "<li>Zaključi z bistveno ločnico: več stopenj znotraj enega koraka ni veččlenska metoda.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "En korak sredinske RK2", H([
          "<p>Za ", m("y'=x+y"), ", ", m("y(0)=1"), " in ", m("h=0.2"), " je</p>",
          P("k_1=f(0,1)=1", "prva stopnja"),
          P("k_2=f(0.1,1+0.1k_1)=f(0.1,1.1)=1.2", "sredinski naklon"),
          P("y_1=1+0.2k_2=1.24", "novi približek"),
          "<p>V istem koraku smo izračunali dva naklona, vendar smo za začetek potrebovali samo en mrežni približek ", m("y_0"), ".</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Profesor preveri predvsem razumevanje tabele", followups([
          { q: "Zakaj je Runge–Kutta še vedno enočlenska metoda?", a: H(["Ker za izračun ", m("y_{n+1}"), " potrebuje samo neposredni mrežni približek ", m("y_n"), ". Stopnje ", m("k_i"), " nastanejo in se porabijo znotraj istega koraka."]) },
          { q: "Kako iz matrike A prepoznaš eksplicitno metodo?", a: H(["Matrika ", m("A"), " mora biti strogo spodnje trikotna: ", m("a_{ij}=0"), " za ", m("j\\ge i"), ". Tedaj vsaka stopnja uporablja le že izračunane stopnje."]) },
          { q: "Kaj pomeni neničelna diagonala?", a: H(["Če je ", m("a_{ii}\\ne0"), ", se ", m("k_i"), " pojavi v lastni enačbi. Stopnjo moramo rešiti implicitno; pri nelinearnem ", m("f"), " navadno z iteracijsko metodo."]) },
          { q: "Kakšna je razlika med lokalno in globalno napako?", a: "Lokalna je napaka enega koraka, če začnemo iz točne prejšnje vrednosti. Globalna vključuje akumulacijo vseh prejšnjih lokalnih napak; pri stabilni metodi je navadno za eno potenco h slabša." },
          { q: "Ali je kᵢ naklon ali že premik?", a: H(["V tukaj uporabljeni konvenciji je ", m("k_i=f(\\cdot)"), " naklon in je ", m("h"), " zunaj. Druga dovoljena konvencija definira ", m("K_i=hf(\\cdot)"), "; v enem računu ju ne smemo mešati."]) },
          { q: "Kaj mora veljati za konsistentnost RK?", a: H(["Nujen pogoj prvega reda je ", m("\\sum_i b_i=1"), ". Pri standardnem zapisu poleg tega časovne odmike povezuje ", m("c_i=\\sum_j a_{ij}"), "."]) }
        ])),
        section("warning", "10 · PASTI", "Enočlensko, večstopenjsko in implicitno niso sinonimi", H([
          "<ul>",
          "<li>Runge–Kutta z več stopnjami ni veččlenska metoda; ne uporablja starejših ", m("y_{n-1},y_{n-2},\\ldots"), ".</li>",
          "<li>Pri implicitnem Eulerju nastopa na obeh straneh ", m("y_{n+1}"), ", ne stari ", m("y_n"), ".</li>",
          "<li>Spodnja vrstica ", m("b"), " se uporabi šele po vseh stopnjah, ne znotraj njihovega argumenta.</li>",
          "<li>V časovni koordinati ne pozabi ", m("h"), ": pravilno je ", m("x_n+c_ih"), ".</li>",
          "<li>Ne pomnoži z ", m("h"), " dvakrat, ko je izbrana konvencija ", m("k_i=f"), ".</li>",
          "<li>Neničelna diagonala ali element nad diagonalo pomeni implicitnost; ni dovolj pogledati le zgornjega dela.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Eulerjevi metodi izpeljem iz preme in obratne diference. Eksplicitni Euler uporabi star naklon, implicitni novega in zato zahteva reševanje enačbe; oba sta globalno prvega reda. Runge–Kutta je še vedno enočlenska metoda, a znotraj koraka izračuna več naklonov. V Butcherjevi tabeli ", m("c"),
          " določa čas, ", m("A"), " notranja stanja, ", m("b"), " pa končno kombinacijo. Sredinska RK2 z Eulerjevim polkorakom napove sredino in je globalno drugega reda.«</p>"
        ]))
      ]
    },
    {
      id: "oral-12-vecclenske-metode",
      number: 12,
      chapter: "4 · Numerično reševanje diferencialnih enačb",
      title: "Veččlenske metode za začetne probleme",
      officialPrompt: "Kakšne so prednosti in slabosti veččlenskih metod v primerjavi z enočlenskimi? Opišite izpeljavo ene izmed veččlenskih metod.",
      accent: "#ff7a90",
      minutes: 8,
      deepLinks: ["runge-kutta", "robni-problemi"],
      sections: [
        officialSection("Kakšne so prednosti in slabosti veččlenskih metod v primerjavi z enočlenskimi? Opišite izpeljavo ene izmed veččlenskih metod."),
        section("plain", "02 · VZOREN GOVOR", "Najprej primerjava, nato izpeljava AB2", speech([
          H(["Enočlenska metoda izračuna novi približek samo iz neposredno prejšnjega približka; Runge–Kutta pri tem znotraj koraka ustvari več novih naklonov. Veččlenska metoda pa za novi približek uporabi več že izračunanih mrežnih vrednosti in naklonov."]),
          H(["Glavna prednost je učinkovitost: eksplicitna Adams–Bashforthova metoda po zagonu za nov korak potrebuje samo eno novo vrednotenje ", m("f"), ", ker so stari nakloni shranjeni. Z razmeroma malo dela lahko doseže višji red."]),
          H(["Slabosti so, da metoda ni samostartna, potrebuje več začetnih približkov, hrani zgodovino, je manj priročna pri spreminjanju koraka in ima pogosto strožje stabilnostne omejitve. Implicitna veččlenska metoda zahteva še reševanje enačbe."]),
          H(["Adamsove metode izpeljemo iz integralne identitete ", m("y(x_n)=y(x_{n-1})+\\int_{x_{n-1}}^{x_n}f(x,y(x))\\,dx"), ". Funkcijo naklona interpoliramo v prejšnjih točkah in interpolant integriramo."]),
          H(["Za dvočlensko Adams–Bashforthovo metodo interpoliram naklona ", m("f_{n-2}"), " in ", m("f_{n-1}"), " z linearno funkcijo. Integral tega interpolanta da uteži ", m("-1/2"), " in ", m("3/2"), "."]),
          H(["Dobim ", m("y_n=y_{n-1}+\\tfrac h2(3f_{n-1}-f_{n-2})"), ". Lokalna napaka je reda ", m("h^3"), ", globalna pa reda ", m("h^2"), "; za začetek potrebujem še približek ", m("y_1"), " primerljive natančnosti, na primer iz RK2."])
        ])),
        section("notation", "03 · LEGENDA", "Zgodovina, število členov in eksplicitnost", notation(
          "Indeksi v gradivu so postavljeni tako, da je novi neznani približek yₙ, stare vrednosti pa yₙ₋₁, yₙ₋₂ in tako naprej.",
          [
            { tex: "f_j=f(x_j,y_j)", symbol: "fⱼ", name: "shranjeni naklon", meaning: " — vrednost desne strani pri že izračunanem približku." },
            { tex: "k", symbol: "k", name: "število členov", meaning: " — koliko preteklih mrežnih nivojev sodeluje v splošni formuli." },
            { tex: "\\alpha_i", symbol: "αᵢ", name: "uteži približkov", meaning: " — množijo vrednosti yₙ₋ᵢ." },
            { tex: "\\beta_i", symbol: "βᵢ", name: "uteži naklonov", meaning: " — množijo fₙ₋ᵢ." },
            { tex: "h", symbol: "h", name: "stalni korak", meaning: " — razmik med zaporednimi mrežnimi točkami." },
            { tex: "p(x)", symbol: "p", name: "interpolant naklonov", meaning: " — približuje funkcijo x ↦ f(x,y(x))." },
            { tex: "y_1,\\ldots,y_{k-1}", symbol: "zagonske vrednosti", name: "start", meaning: " — manjkajoče začetne približke izračunamo z enočlensko metodo." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "Zgodovina proti notranjim stopnjam", H([
          '<div class="visual-diagram" style="display:grid;grid-template-columns:1.1fr .9fr;gap:14px">',
          '<div style="padding:14px;border:1px solid #ff7a90;border-radius:12px"><strong>Veččlenska metoda</strong>',
          '<svg viewBox="0 0 470 145" role="img" aria-label="Dve stari točki določita novi približek">',
          '<path d="M35 78H435" stroke="currentColor" stroke-width="2" opacity=".45"/>',
          '<g fill="#ff7a90"><circle cx="90" cy="78" r="9"/><circle cx="235" cy="78" r="9"/></g>',
          '<circle cx="380" cy="78" r="11" fill="none" stroke="#ffbd7a" stroke-width="5"/>',
          '<path d="M90 48Q235 4 380 48" fill="none" stroke="#a78bfa" stroke-width="4" stroke-dasharray="9 6"/>',
          '<g fill="currentColor" text-anchor="middle"><text x="90" y="118">n−2</text><text x="235" y="118">n−1</text><text x="380" y="118">n</text></g>',
          "</svg><small>stara približka in naklona napovesta novo mrežno vrednost</small></div>",
          '<div style="padding:14px;border:1px solid #ff7a90;border-radius:12px"><strong>Runge–Kutta</strong>',
          "<p>", m("y_{n-1}\\ \\xrightarrow{k_1,k_2,\\ldots}\\ y_n"), "</p>",
          "<p>Več novih stopenj znotraj enega koraka, brez uporabe ", m("y_{n-2}"), ".</p></div></div>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Splošna formula, AB in AM", H([
          P("\\sum_{i=0}^{k}\\alpha_i y_{n-i}+h\\sum_{i=0}^{k}\\beta_i f(x_{n-i},y_{n-i})=0,\\qquad \\alpha_0\\ne0", "splošna k-členska metoda"),
          "<p>Koeficiente lahko normiramo z ", m("\\alpha_0=1"), ". Če je ", m("\\beta_0=0"), " je nova vrednost naklona odsotna in metoda je eksplicitna; če je ", m("\\beta_0\\ne0"), " je metoda implicitna.</p>",
          P("y_n=y_{n-1}+\\frac h2\\bigl(3f_{n-1}-f_{n-2}\\bigr)", "Adams–Bashforth 2"),
          P("y_n=y_{n-1}+\\frac h{12}\\bigl(23f_{n-1}-16f_{n-2}+5f_{n-3}\\bigr)", "Adams–Bashforth 3"),
          P("y_n=y_{n-1}+\\frac h2\\bigl(f_{n-1}+f_n\\bigr)", "Adams–Moulton: trapezna metoda"),
          "<table class=\"compare-table\"><thead><tr><th>lastnost</th><th>enočlenska / RK</th><th>veččlenska</th></tr></thead><tbody>",
          "<tr><td>zagon</td><td>samostartna</td><td>potrebuje dodatne začetne vrednosti</td></tr>",
          "<tr><td>novi izračuni f</td><td>RK navadno več na korak</td><td>eksplicitni Adams navadno en</td></tr>",
          "<tr><td>spomin</td><td>trenutno stanje</td><td>več starih stanj in naklonov</td></tr>",
          "<tr><td>spremenljiv h</td><td>preprosteje</td><td>koeficiente je treba prilagoditi</td></tr>",
          "</tbody></table>"
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Dvočlenska Adams–Bashforth brez pomnjenja uteži", H([
          "<p>Ob diferencialni enačbi je vedno res</p>",
          P("y(x_n)=y(x_{n-1})+\\int_{x_{n-1}}^{x_n}F(x)\\,dx,\\qquad F(x)=f(x,y(x))", "integralna identiteta"),
          "<p>Vpeljemo ", m("t=(x-x_{n-1})/h"), ". Na integracijskem intervalu je ", m("t\\in[0,1]"), ", stari vozlišči ",
          m("x_{n-2},x_{n-1}"), " pa ustrezata ", m("t=-1,0"), ". Linearni interpolant je</p>",
          P("p(t)=F_{n-1}+t(F_{n-1}-F_{n-2})=(1+t)F_{n-1}-tF_{n-2}", "interpolant naklonov"),
          "<p>Ker je ", m("dx=h\\,dt"), ", ga integriramo:</p>",
          P("h\\int_0^1p(t)\\,dt=h\\left(\\frac32F_{n-1}-\\frac12F_{n-2}\\right)", "uteži AB2"),
          "<p>Točne vrednosti nadomestimo z mrežnimi in dobimo AB2. Interpolacijski ostanek ima obliko</p>",
          P("F(x)-p(x)=\\frac{F''(\\xi_x)}{2}(x-x_{n-2})(x-x_{n-1})", "ostanek interpolacije"),
          "<p>Po integraciji je lokalna napaka ", m("\\tfrac5{12}h^3F''(\\xi)=\\tfrac5{12}h^3y'''(\\xi)"),
          ", zato je ob stabilnosti globalni red 2.</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Osem minut z jasno primerjavo", H([
          '<ol class="step-list">',
          "<li>Nariši časovno os z ", m("n-2,n-1,n"), " in jo primerjaj z notranjimi stopnjami RK.</li>",
          "<li>Napiši splošno veččlensko formulo ter kriterij ", m("\\beta_0=0"), " za eksplicitnost.</li>",
          "<li>V dveh stolpcih navedi prednosti in slabosti v primerjavi z enočlenskimi metodami.</li>",
          "<li>Napiši integralno identiteto od ", m("x_{n-1}"), " do ", m("x_n"), ".</li>",
          "<li>V koordinati ", m("t"), " interpoliraj naklona v točkah ", m("-1,0"), " in integriraj od 0 do 1.</li>",
          "<li>Obkroži uteži ", m("3/2,-1/2"), ", povej lokalni/globalni red in nujnost kakovostne zagonske vrednosti.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "En AB2-korak po podanem zagonu", H([
          "<p>Za ", m("y'=-y"), ", ", m("h=0.1"), ", ", m("y_0=1"), " in že podani ", m("y_1=0.9"),
          " sta ", m("f_0=-1"), " in ", m("f_1=-0.9"), ". Zato</p>",
          P("y_2=0.9+\\frac{0.1}{2}\\bigl(3(-0.9)-(-1)\\bigr)=0.815", "AB2"),
          "<p>Točna vrednost je ", m("e^{-0.2}\\approx0.81873"), ". Za prvi korak smo potrebovali zunanji zagon; samo ", m("y_0"), " za AB2 ne zadošča.</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Ločnice, ki jih moraš povedati brez premora", followups([
          { q: "Glavna razlika med RK in veččlensko metodo?", a: H(["RK iz ", m("y_{n-1}"), " v enem koraku izračuna več novih notranjih stopenj. Veččlenska metoda ponovno uporabi že shranjene ", m("y_{n-j}"), " in ", m("f_{n-j}"), " iz različnih mrežnih korakov."]) },
          { q: "Zakaj AB2 ni samostartna?", a: H(["Za prvi pravi korak potrebuje dva približka, na primer ", m("y_0,y_1"), ". Začetni problem poda samo ", m("y_0"), ", zato ", m("y_1"), " izračunamo z enočlensko metodo primerljivega reda."]) },
          { q: "Kako iz splošne formule prepoznaš implicitnost?", a: H(["Če je ", m("\\beta_0\\ne0"), ", formula vsebuje ", m("f(x_n,y_n)"), " in s tem neznani ", m("y_n"), " na desni; rešiti je treba enačbo."]) },
          { q: "Od kod pridejo Adamsove uteži?", a: "Iz integracije interpolacijskega polinoma za funkcijo naklona x ↦ f(x,y(x)); pri Adams–Bashforthu interpoliramo le v preteklih točkah." },
          { q: "Kaj se zgodi, če y₁ izračunaš s premalo natančno metodo?", a: "Zagonska napaka lahko prevlada in zniža opaženi globalni red celotnega postopka. Starter naj bo vsaj primerljivega reda kot veččlenska metoda." },
          { q: "Zakaj so spremenljivi koraki težji?", a: "Uteži 3/2 in −1/2 izhajajo iz enakih razmikov. Pri spremenljivih korakih je treba interpolant in koeficiente ponovno prilagoditi razmerjem korakov." }
        ])),
        section("warning", "10 · PASTI", "Ne recitiraj AB2 brez integralne zgodbe", H([
          "<ul>",
          "<li>Več <em>stopenj</em> RK ni isto kot več <em>členov</em> časovne zgodovine.</li>",
          "<li>AB2 uporablja ", m("3f_{n-1}-f_{n-2}"), ", ne obratnega vrstnega reda.</li>",
          "<li>Brez zagonske vrednosti ", m("y_1"), " dvočlenske metode ne moreš začeti.</li>",
          "<li>Pri splošnem zapisu je eksplicitnost odvisna od ", m("\\beta_0"), ", ob predpostavki ", m("\\alpha_0\\ne0"), ".</li>",
          "<li>Stalnih Adamsovih uteži ne uporabljaj nespremenjeno na neenakomerni mreži.</li>",
          "<li>Lokalni red 3 pri AB2 pomeni globalni red 2, ne 3.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Veččlenska metoda uporablja več starih mrežnih približkov in naklonov, zato po zagonu doseže višji red z malo novimi vrednotenji funkcije. Slabosti so start, spomin, težji spremenljivi koraki in pogosto slabša stabilnost. AB2 izpeljem tako, da integral naklona od ",
          m("x_{n-1}"), " do ", m("x_n"), " nadomestim z integralom linearnega interpolanta skozi stara naklona. Dobim ",
          m("y_n=y_{n-1}+h(3f_{n-1}-f_{n-2})/2"), ", lokalni red 3 in globalni red 2.«</p>"
        ]))
      ]
    },
    {
      id: "oral-13-posploseni-zacetni-problem",
      number: 13,
      chapter: "4 · Numerično reševanje diferencialnih enačb",
      title: "Posplošeni začetni problem",
      officialPrompt: "Kako rešujemo začetni problem, ki je podan s sistemom diferencialnih enačb? Ali lahko izpeljane metode uporabimo tudi za reševanje diferencialnih enačb višjih redov?",
      accent: "#67d8ff",
      minutes: 8,
      deepLinks: ["robni-problemi", "euler-trapez", "runge-kutta"],
      sections: [
        officialSection("Kako rešujemo začetni problem, ki je podan s sistemom diferencialnih enačb? Ali lahko izpeljane metode uporabimo tudi za reševanje diferencialnih enačb višjih redov?"),
        section("plain", "02 · VZOREN GOVOR", "Vektor namesto skalarja, nato znižanje reda", speech([
          H(["Sistem prvega reda zapišem v vektorski obliki ", m("Y'(x)=F(x,Y(x))"), " z začetnim pogojem ",
            m("Y(x_0)=Y_0\\in\\mathbb R^m"), ". Rešitev in numerični približki so zdaj vektorji."]),
          H(["Vse prej izpeljane enočlenske in Runge–Kuttove metode uporabimo komponentno: skalarne koeficiente ohranimo, seštevanje in vrednotenje desne strani pa izvajamo v ", m("\\mathbb R^m"), "."]),
          H(["Na primer eksplicitni Euler postane ", m("Y_{n+1}=Y_n+hF(x_n,Y_n)"), ". Pri implicitni metodi rešujemo sistem enačb za vse komponente novega vektorja; pri implicitnem RK je sistem še večji zaradi vseh stopenj."]),
          H(["Enačbo reda ", m("r"), " najprej rešim za najvišji odvod in uvedem stanje ",
            m("Y=(y,y',\\ldots,y^{(r-1)})^T"), ". Prvih ", m("r-1"), " enačb samo prestavlja odvode, zadnja pa vsebuje dano desno stran."]),
          H(["Vsi podatki ", m("y(x_0),y'(x_0),\\ldots,y^{(r-1)}(x_0)"), " so podani v isti začetni točki, zato dobimo navaden sistemski začetni problem in lahko uporabimo Eulerja, RK ali veččlensko metodo."]),
          H(["To ni robni problem. Pri robnem problemu so pogoji podani v različnih točkah intervala in praviloma ne moremo neposredno korakati od leve proti desni."])
        ])),
        section("notation", "03 · LEGENDA", "Komponente stanja in začetni podatki", notation(
          "Velike črke označujejo vektorje; indeks n še vedno označuje mrežni korak, ne komponente.",
          [
            { tex: "Y(x)\\in\\mathbb R^m", symbol: "Y(x)", name: "vektor rešitve", meaning: " — vsebuje m odvisnih spremenljivk." },
            { tex: "F:\\mathbb R\\times\\mathbb R^m\\to\\mathbb R^m", symbol: "F", name: "vektorska desna stran", meaning: " — vrne po en odvod za vsako komponento." },
            { tex: "Y_0", symbol: "Y₀", name: "začetni vektor", meaning: " — vse njegove komponente so podane pri istem x₀." },
            { tex: "Y_n\\approx Y(x_n)", symbol: "Yₙ", name: "vektorski približek", meaning: " — rezultat metode v mrežni točki xₙ." },
            { tex: "r", symbol: "r", name: "red skalarne enačbe", meaning: " — po pretvorbi dobimo sistem dimenzije r." },
            { tex: "y_j=y^{(j-1)}", symbol: "yⱼ", name: "komponenta stanja", meaning: " — j-ta komponenta hrani (j−1)-vi odvod." },
            { tex: "\\eta_j=y^{(j)}(x_0)", symbol: "ηⱼ", name: "začetni odvod", meaning: " — sestavlja začetni vektor pretvorjenega sistema." }
          ]
        )),
        section("visual", "04 · KAJ NARIŠEŠ", "Veriga odvodov postane sistem prvega reda", H([
          '<div class="visual-diagram" style="padding:16px;border:1px solid #67d8ff;border-radius:12px">',
          '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:center;text-align:center">',
          '<div style="padding:12px;border:1px solid #a78bfa;border-radius:10px">', m("y_1=y"), "</div>",
          '<div style="padding:12px;border:1px solid #a78bfa;border-radius:10px">', m("y_2=y'"), "</div>",
          '<div style="padding:12px;border:1px solid #a78bfa;border-radius:10px">', m("\\cdots"), "</div>",
          '<div style="padding:12px;border:1px solid #a78bfa;border-radius:10px">', m("y_r=y^{(r-1)}"), "</div>",
          "</div>",
          "<p style=\"text-align:center\">", m("y_1'=y_2,\\quad y_2'=y_3,\\quad\\ldots,\\quad y_r'=g(x,y_1,\\ldots,y_r)"), "</p>",
          "</div>",
          "<p>Na rob table dodaj primerjavo: <strong>začetni problem</strong> = vsi podatki pri ",
          m("x_0"), "; <strong>robni problem</strong> = pogoji pri različnih točkah. S tem preprečiš najpogostejšo pojmovno napako.</p>"
        ])),
        section("formal", "05 · NATANČEN ZAPIS", "Sistem, vektorska metoda in višji red", H([
          P("Y'(x)=F(x,Y(x)),\\qquad Y(x_0)=Y_0\\in\\mathbb R^m", "sistemski začetni problem"),
          P("\\begin{aligned}y_1'&=F_1(x,y_1,\\ldots,y_m),\\\\&\\ \\vdots\\\\y_m'&=F_m(x,y_1,\\ldots,y_m),\\end{aligned}", "komponentni zapis"),
          P("Y_{n+1}=Y_n+hF(x_n,Y_n)", "vektorski eksplicitni Euler"),
          P("K_i=F\\!\\left(x_n+c_ih,Y_n+h\\sum_{j=1}^{s}a_{ij}K_j\\right),\\qquad Y_{n+1}=Y_n+h\\sum_{i=1}^{s}b_iK_i", "vektorski Runge–Kutta"),
          "<p>Za enačbo višjega reda</p>",
          P("y^{(r)}=g\\!\\left(x,y,y',\\ldots,y^{(r-1)}\\right),\\qquad y^{(j)}(x_0)=\\eta_j,\\quad j=0,\\ldots,r-1", "skalarni začetni problem reda r"),
          P("Y=\\begin{pmatrix}y_1\\\\y_2\\\\\\vdots\\\\y_r\\end{pmatrix}=\\begin{pmatrix}y\\\\y'\\\\\\vdots\\\\y^{(r-1)}\\end{pmatrix},\\qquad Y'=\\begin{pmatrix}y_2\\\\y_3\\\\\\vdots\\\\g(x,y_1,\\ldots,y_r)\\end{pmatrix},\\qquad Y(x_0)=\\begin{pmatrix}\\eta_0\\\\\\eta_1\\\\\\vdots\\\\\\eta_{r-1}\\end{pmatrix}", "pretvorba v sistem")
        ])),
        section("derivation", "06 · KLJUČNA IZPELJAVA", "Zakaj je pretvorba res enakovredna", H([
          "<p>Postavimo ", m("y_1=y"), ", ", m("y_2=y'"), ", …, ", m("y_r=y^{(r-1)}"), ". Z odvajanjem definicij neposredno dobimo</p>",
          P("y_1'=y_2,\\quad y_2'=y_3,\\quad\\ldots,\\quad y_{r-1}'=y_r", "prvih r−1 enačb"),
          "<p>Ker je ", m("y_r'=y^{(r)}"), ", originalna enačba določi zadnjo komponento:</p>",
          P("y_r'=g(x,y_1,y_2,\\ldots,y_r)", "zadnja enačba"),
          "<p>Začetni pogoji določijo vsako komponento ", m("Y(x_0)"), ". Če ", m("y"), " rešuje prvotno enačbo, tako sestavljen ",
          m("Y"), " rešuje sistem. Obratno prve enačbe sistema prisilijo ", m("y_j=y_1^{(j-1)}"), ", zadnja pa vrne prvotno enačbo. Problema sta torej ekvivalentna.</p>",
          "<p>Ker so Eulerjeve in RK-formule sestavljene le iz seštevanja, množenja s skalarnimi koeficienti in vrednotenja desne strani, ostanejo iste formule veljavne za vektorje.</p>"
        ])),
        section("board", "07 · NAČRT TABLE", "Osem minut in nobenega robnega problema", H([
          '<ol class="step-list">',
          "<li>Napiši vektorski začetni problem in razloži dimenzije ", m("Y,F,Y_0"), ".</li>",
          "<li>V komponentah pokaži, da gre za m sklopljenih enačb prvega reda.</li>",
          "<li>Napiši vektorski Eulerjev ali RK-korak in povej, da se vse operacije izvajajo komponentno.</li>",
          "<li>Zapiši splošno enačbo reda ", m("r"), " ter vseh ", m("r"), " začetnih pogojev v isti točki.</li>",
          "<li>Uvedi ", m("y_j=y^{(j-1)}"), " in nariši verigo prvih ", m("r-1"), " enačb ter zadnjo enačbo z ", m("g"), ".</li>",
          "<li>Naredi en vektorski Eulerjev korak na sistemu drugega reda.</li>",
          "<li>Zaključi z jasnim stavkom: začetni podatki v eni točki niso robni pogoji v različnih točkah.</li>",
          "</ol>"
        ])),
        section("example", "08 · MINI PRIMER", "Enačba drugega reda in dva Eulerjeva koraka", H([
          "<p>Naj bo ", m("y''=y'y^2-y"), ", ", m("y(0)=1"), ", ", m("y'(0)=0"), ". Postavimo ", m("z=y'"), ":</p>",
          P("\\begin{pmatrix}y\\\\z\\end{pmatrix}'=\\begin{pmatrix}z\\\\zy^2-y\\end{pmatrix},\\qquad \\begin{pmatrix}y(0)\\\\z(0)\\end{pmatrix}=\\begin{pmatrix}1\\\\0\\end{pmatrix}", "sistem prvega reda"),
          "<p>Pri ", m("h=0.1"), " eksplicitni Euler da</p>",
          P("Y_1=\\begin{pmatrix}1\\\\0\\end{pmatrix}+0.1\\begin{pmatrix}0\\\\-1\\end{pmatrix}=\\begin{pmatrix}1\\\\-0.1\\end{pmatrix}", "prvi korak"),
          P("Y_2=\\begin{pmatrix}1\\\\-0.1\\end{pmatrix}+0.1\\begin{pmatrix}-0.1\\\\-1.1\\end{pmatrix}=\\begin{pmatrix}0.99\\\\-0.21\\end{pmatrix}", "drugi korak"),
          "<p>Prva komponenta približuje ", m("y"), ", druga pa ", m("y'"), "; zato sta ", m("y(0.1)\\approx1"), " in ", m("y(0.2)\\approx0.99"), ".</p>"
        ])),
        section("questions", "09 · VERJETNA PODVPRAŠANJA", "Kaj spremeni vektorska oblika in kaj ne", followups([
          { q: "Ali moramo za sistem izpeljati novo Eulerjevo metodo?", a: H(["Ne. Isto formulo ", m("Y_{n+1}=Y_n+hF(x_n,Y_n)"), " uporabimo vektorsko; vsaka komponenta dobi svojo Eulerjevo enačbo."]) },
          { q: "Kaj se spremeni pri implicitni metodi?", a: H(["Novi vektor ", m("Y_{n+1}"), " nastopa v ", m("F(x_{n+1},Y_{n+1})"), ", zato na vsakem koraku rešujemo praviloma sklopljen nelinearen sistem dimenzije m."]) },
          { q: "Koliko komponent ima sistem za enačbo reda r?", a: H(["Natanko ", m("r"), ": hranimo ", m("y,y',\\ldots,y^{(r-1)}"), ". Potrebujemo tudi ", m("r"), " začetnih vrednosti v isti točki."]) },
          { q: "Katera komponenta je iskana prvotna rešitev?", a: H(["Prva komponenta ", m("y_1=y"), ". Ostale komponente približujejo njene zaporedne odvode."]) },
          { q: "Kaj če enačbe ne moremo rešiti za najvišji odvod?", a: "Tedaj pretvorba v prikazano eksplicitno obliko ni neposredna; lahko nastane implicitna diferencialna enačba oziroma diferencialno-algebrajski problem, ki zahteva druge metode." },
          { q: "Zakaj to ni robni problem?", a: H(["Pri začetnem problemu so ", m("y(x_0),y'(x_0),\\ldots"), " vsi podani pri istem ", m("x_0"), ". Pri robnem problemu so pogoji razporejeni po različnih točkah, na primer ", m("y(a)"), " in ", m("y(b)"), "."]) }
        ])),
        section("warning", "10 · PASTI", "Največja nevarnost je napačna klasifikacija", H([
          "<ul>",
          "<li>Ne imenuj pogojev ", m("y(x_0),y'(x_0)"), " robna pogoja; to sta začetna podatka v isti točki.</li>",
          "<li>Pri uvedbi ", m("z=y'"), " ne pozabi tudi začetnega pogoja ", m("z(x_0)=y'(x_0)"), ".</li>",
          "<li>Zadnja enačba sistema mora vsebovati pravilno osamljeni najvišji odvod.</li>",
          "<li>Pri vektorskem Eulerju je ", m("F"), " vektor; ne posodobi samo prve komponente.</li>",
          "<li>Pri interpretaciji rezultata je prvotna rešitev prva komponenta, ne norma vektorja.</li>",
          "<li>Implicitni korak za sistem pomeni sklopljeno enačbo za vse nove komponente.</li>",
          "</ul>"
        ])),
        section("recap", "11 · 30 SEKUND", "Zaključek na glas", H([
          "<p>»Sistemski začetni problem zapišem kot ", m("Y'=F(x,Y),\\ Y(x_0)=Y_0\\in\\mathbb R^m"),
          " in vse Eulerjeve oziroma RK-formule uporabim vektorsko. Enačbo reda ", m("r"), " prevedem na sistem prvega reda z ",
          m("Y=(y,y',\\ldots,y^{(r-1)})^T"), "; prve enačbe prestavljajo odvode, zadnja vsebuje dano funkcijo ",
          m("g"), ". Vseh ", m("r"), " začetnih podatkov je pri istem ", m("x_0"), ", zato je to začetni in ne robni problem.«</p>"
        ]))
      ]
    },
  ];
})();
