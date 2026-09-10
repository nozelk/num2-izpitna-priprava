(() => {
  "use strict";

  const shell = (name, svg, caption) => `
    <figure class="num2-visual num2-${name}">
      ${svg}
      <figcaption>${caption}</figcaption>
    </figure>`;

  const approximation = () => shell("approx", `
    <svg viewBox="0 0 720 330" role="img" aria-label="Funkcija in njena polinomska aproksimacija">
      <defs><linearGradient id="approxFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c8ff3d" stop-opacity=".2"/><stop offset="1" stop-color="#c8ff3d" stop-opacity="0"/></linearGradient></defs>
      <path class="grid" d="M70 45V280M70 280H675M190 45V280M310 45V280M430 45V280M550 45V280M70 90H675M70 150H675M70 210H675"/>
      <path class="axis" d="M55 150H685M70 294V35"/>
      <path class="curve target" d="M72 220 C145 62 205 75 274 154 S410 263 474 160 S592 48 671 117"/>
      <path class="curve approx" d="M72 210 C184 85 263 108 341 165 S506 211 671 107"/>
      <path class="error-band" d="M72 220 C145 62 205 75 274 154 S410 263 474 160 S592 48 671 117 L671 107 C506 211 419 222 341 165 S184 85 72 210Z"/>
      <g class="error-mark"><path d="M215 88V121"/><path d="M207 88H223M207 121H223"/><text x="231" y="107">e(x)=f(x)−p(x)</text></g>
      <g class="legend"><circle cx="95" cy="312" r="4" class="target-dot"/><text x="107" y="316">f — podana funkcija</text><circle cx="333" cy="312" r="4" class="approx-dot"/><text x="345" y="316">p ∈ Πₙ — približek</text></g>
      <text class="axis-label" x="681" y="143">x</text><text class="axis-label" x="77" y="38">y</text>
    </svg>`, "Ne iščemo nujno interpolanta. Iščemo element iz izbranega prostora, ki ima najmanjšo napako v predpisani normi.");

  const remez = () => shell("remez", `
    <svg viewBox="0 0 720 350" role="img" aria-label="Alternirajoči ostanek pri Remesovem postopku">
      <path class="grid" d="M70 55V285M70 170H675M190 55V285M310 55V285M430 55V285M550 55V285"/>
      <path class="axis" d="M55 170H686M70 300V42"/>
      <path class="remez-wave" d="M78 104 C125 86 158 76 190 76 S266 237 310 234 S389 72 430 76 S512 238 550 234 S625 67 670 102"/>
      <path class="remez-bound" d="M70 76H675M70 234H675"/>
      <g class="remez-points"><circle cx="190" cy="76" r="7"/><circle cx="310" cy="234" r="7"/><circle cx="430" cy="76" r="7"/><circle cx="550" cy="234" r="7"/></g>
      <g class="remez-labels"><text x="176" y="65">+m</text><text x="296" y="258">−m</text><text x="416" y="65">+m</text><text x="536" y="258">−m</text></g>
      <g class="remez-system"><rect x="86" y="291" width="542" height="43" rx="9"/><text x="105" y="318">p(xᵢ) + (−1)ⁱm = f(xᵢ),   i=0,…,n+1</text></g>
    </svg>`, "Za polinom stopnje n potrebujemo n+2 alternirajočih ekstremov napake. Neznanka m je velikost največjega odklona.");

  const bezier = () => shell("bezier", `
    <svg viewBox="0 0 720 380" role="img" aria-label="Kontrolni poligon, konveksna ovojnica in de Casteljaujev trikotnik">
      <defs><marker id="bezArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#c8ff3d"/></marker></defs>
      <polygon class="hull" points="78,278 175,62 416,81 534,280"/>
      <path class="control" d="M78 278L175 62L416 81L534 280"/>
      <path class="bezier-curve" d="M78 278 C175 62 416 81 534 280"/>
      <g class="control-points"><circle cx="78" cy="278" r="8"/><circle cx="175" cy="62" r="8"/><circle cx="416" cy="81" r="8"/><circle cx="534" cy="280" r="8"/></g>
      <g class="point-labels"><text x="52" y="303">b₀</text><text x="149" y="49">b₁</text><text x="424" y="68">b₂</text><text x="541" y="302">b₃</text></g>
      <circle class="obstacle" cx="606" cy="111" r="40"/><text class="obstacle-text" x="578" y="116">ovira</text>
      <path class="safe-arrow" d="M529 89C557 74 568 72 583 79" marker-end="url(#bezArrow)"/><text class="safe-label" x="499" y="59">prazen presek ⇒ ni trka</text>
      <g transform="translate(91 310)"><rect class="mini-panel" width="438" height="52" rx="10"/><text x="18" y="23">b(t)=Σᵢ bᵢ Bᵢⁿ(t)</text><text x="225" y="23">Bᵢⁿ(t)≥0</text><text x="225" y="42">ΣᵢBᵢⁿ(t)=1</text></g>
    </svg>`, "Bernsteinove uteži so nenegativne in imajo vsoto 1, zato je vsaka točka krivulje konveksna kombinacija kontrolnih točk.");

  const bezierJoin = () => shell("join", `
    <svg viewBox="0 0 720 340" role="img" aria-label="Stik dveh Bezierjevih krivulj">
      <path class="join-left-control" d="M70 255L185 70L320 170"/>
      <path class="join-right-control" d="M320 170L455 270L650 87"/>
      <path class="join-left" d="M70 255Q185 70 320 170"/>
      <path class="join-right" d="M320 170Q455 270 650 87"/>
      <g class="join-points"><circle cx="70" cy="255" r="7"/><circle cx="185" cy="70" r="7"/><circle cx="320" cy="170" r="9"/><circle cx="455" cy="270" r="7"/><circle cx="650" cy="87" r="7"/></g>
      <path class="tangent-line" d="M185 70L455 270"/>
      <text class="join-label" x="280" y="146">cₙ=d₀</text><text class="join-label" x="188" y="61">n(cₙ−cₙ₋₁)</text><text class="join-label" x="443" y="291">m(d₁−d₀)</text>
      <g class="join-levels"><rect x="72" y="294" width="572" height="32" rx="8"/><text x="91" y="316">C⁰: položaj   ·   C¹: tudi hitrost   ·   G¹: le smer tangente</text></g>
    </svg>`, "Pri C¹ morata biti krajiščna odvoda enaka. Pri linearni reparametrizaciji ju pomnožimo še z ustreznima hitrostma parametra.");

  const stencil = () => shell("stencil", `
    <svg viewBox="0 0 720 330" role="img" aria-label="Diferenčni stencil in momentni sistem">
      <path class="axis" d="M60 137H666"/>
      <g class="stencil-ticks"><path d="M120 120V154"/><path d="M280 120V154"/><path d="M440 120V154"/><path d="M600 120V154"/></g>
      <g class="stencil-points"><circle cx="120" cy="137" r="8"/><circle cx="280" cy="137" r="8"/><circle cx="440" cy="137" r="8"/><circle cx="600" cy="137" r="8"/></g>
      <g class="stencil-labels"><text x="94" y="184">x₀−h</text><text x="267" y="184">x₀</text><text x="422" y="184">x₀+h</text><text x="575" y="184">x₀+2h</text></g>
      <path class="h-brace" d="M285 204v10h150v-10"/><text class="h-label" x="355" y="236">h</text>
      <g class="moment-box"><rect x="104" y="252" width="512" height="56" rx="10"/><text x="124" y="276">L(f)=Σⱼ aⱼ f(x₀+cⱼh)</text><text x="124" y="298">zahtevaj: L(1), L(x), L(x²), … = pravi odvod</text></g>
    </svg>`, "Koeficientov ne ugibamo. Zahtevamo točnost na monomih; Taylor nato pove prvi člen, ki se ne izniči, in s tem red napake.");

  const quadrature = () => shell("quadrature", `
    <svg viewBox="0 0 720 350" role="img" aria-label="Kvadraturna vozlišča, uteži in ploščina">
      <defs><linearGradient id="quadFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6fe8ff" stop-opacity=".4"/><stop offset="1" stop-color="#6fe8ff" stop-opacity=".04"/></linearGradient></defs>
      <path class="axis" d="M70 281H666M82 300V48"/>
      <path class="quad-area" d="M103 281V235 C180 169 235 202 307 132 S465 58 613 151 V281Z"/>
      <path class="quad-curve" d="M103 235 C180 169 235 202 307 132 S465 58 613 151"/>
      <g class="quad-bars"><path d="M103 281V235"/><path d="M358 281V92"/><path d="M613 281V151"/></g>
      <g class="quad-points"><circle cx="103" cy="235" r="7"/><circle cx="358" cy="92" r="7"/><circle cx="613" cy="151" r="7"/></g>
      <g class="quad-labels"><text x="91" y="309">a</text><text x="342" y="309">(a+b)/2</text><text x="605" y="309">b</text><text x="145" y="73">∫ₐᵇf(x)dx ≈ Σᵢwᵢf(xᵢ)</text></g>
    </svg>`, "Isti princip kot pri diferencah: uteži določimo iz točnosti na polinomih. Sestavljeno pravilo isto lokalno pravilo ponovi na več podintervalih.");

  const euler = () => shell("euler", `
    <svg viewBox="0 0 720 350" role="img" aria-label="Eulerjeva metoda in polje smeri">
      <defs><marker id="eulArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#ffba63"/></marker></defs>
      <path class="grid" d="M70 55V285M70 285H670M190 55V285M310 55V285M430 55V285M550 55V285M70 105H670M70 165H670M70 225H670"/>
      <g class="slope-field"><path d="M93 236l28-11M213 212l28-14M333 175l28-17M453 125l28-19M573 78l28-17M93 174l28-6M213 150l28-9M333 113l28-11M453 77l28-12"/></g>
      <path class="exact-ode" d="M82 252C190 238 266 204 337 160S492 74 650 68"/>
      <path class="euler-line" d="M82 252L190 228L310 185L430 123L550 76L650 55"/>
      <g class="euler-points"><circle cx="82" cy="252" r="7"/><circle cx="190" cy="228" r="7"/><circle cx="310" cy="185" r="7"/><circle cx="430" cy="123" r="7"/><circle cx="550" cy="76" r="7"/></g>
      <path class="euler-step" d="M196 273H302" marker-end="url(#eulArrow)"/><text x="232" y="298" class="h-label">h</text><text x="363" y="314" class="formula-label">yₙ₊₁=yₙ+h f(tₙ,yₙ)</text>
    </svg>`, "Eksplicitni Euler vzame naklon na začetku koraka. Implicitni ga oceni v novi, še neznani točki; trapezna metoda povpreči oba naklona.");

  const rungeKutta = () => shell("rk", `
    <svg viewBox="0 0 720 390" role="img" aria-label="Butcherjeva tabela in Runge Kutta stopnje">
      <g class="butcher"><rect x="58" y="54" width="275" height="252" rx="15"/><text class="panel-title" x="82" y="86">Butcherjeva tabela</text><path d="M143 105V245M78 245H311"/><text x="101" y="137">c₁</text><text x="101" y="178">c₂</text><text x="101" y="219">c₃</text><text x="176" y="137">a₁₁   a₁₂   a₁₃</text><text x="176" y="178">a₂₁   a₂₂   a₂₃</text><text x="176" y="219">a₃₁   a₃₂   a₃₃</text><text x="176" y="276">b₁   b₂   b₃</text></g>
      <path class="rk-arrow" d="M351 176H405"/>
      <g class="rk-stages"><rect x="421" y="54" width="246" height="252" rx="15"/><text class="panel-title" x="445" y="86">Stopnje koraka</text><text x="445" y="128">kᵢ = f(tₙ+cᵢh,</text><text x="470" y="154">yₙ+hΣⱼaᵢⱼkⱼ)</text><path d="M447 177H642"/><text x="445" y="212">yₙ₊₁ = yₙ</text><text x="470" y="240">+ hΣᵢbᵢkᵢ</text><text class="rk-note" x="445" y="280">na diagonali ali nad njo?</text><text class="rk-note-strong" x="445" y="299">potem je metoda implicitna</text></g>
      <g class="rk-footer"><rect x="107" y="329" width="506" height="39" rx="9"/><text x="130" y="354">premišljeno utežene stopnje lahko dajo višji red</text></g>
    </svg>`, "Vsaka vrstica matrike A definira eno stopnjo kᵢ; vektor b pove, kako stopnje sestavimo v novi približek.");

  const splines = () => shell("splines", `
    <svg viewBox="0 0 720 340" role="img" aria-label="Odsekoma polinomski zlepek in gladkost v vozliščih">
      <path class="axis" d="M55 270H675"/>
      <path class="spline s1" d="M73 234C130 205 168 120 244 131"/>
      <path class="spline s2" d="M244 131C315 141 340 233 420 201"/>
      <path class="spline s3" d="M420 201C493 172 538 69 648 90"/>
      <g class="spline-knots"><circle cx="73" cy="234" r="6"/><circle cx="244" cy="131" r="8"/><circle cx="420" cy="201" r="8"/><circle cx="648" cy="90" r="6"/></g>
      <g class="spline-lines"><path d="M186 121L299 139"/><path d="M363 223L476 177"/></g>
      <g class="spline-labels"><text x="224" y="105">xᵢ</text><text x="398" y="231">xᵢ₊₁</text><text x="75" y="306">S∈C⁰: vrednosti</text><text x="269" y="306">S∈C¹: + prvi odvodi</text><text x="495" y="306">S∈C²: + drugi odvodi</text></g>
    </svg>`, "Vsak kos ima svoje koeficiente. Enačbe dobimo iz interpolacije, gladkosti v notranjih vozliščih in robnih pogojev.");

  window.NUM2_VISUALS = { approximation, remez, bezier, bezierJoin, stencil, quadrature, euler, rungeKutta, splines };
})();
