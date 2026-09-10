(() => {
  "use strict";

  const { M, panel } = window.StudyUI;
  const T = String.raw;
  const F = (tex, meaning) => ({ tex, meaning });
  const Q = (q, a) => ({ q, a });
  const topics = [
    {
      id: "euler", title: "Eulerjevi metodi", official: [11], priority: "Najprej · 4. naloga: 0/20 → 10/20",
      question: "Kaj rešujemo z Eulerjevo metodo in kakšna je razlika med eksplicitno in implicitno?",
      speech: [
        "Poznam začetno vrednost rešitve in enačbo, ki mi v vsaki točki pove njen naklon. Rešitve ne iščem z eno zaprto formulo, ampak računam približke v zaporednih točkah, oddaljenih za korak h.",
        "Pri eksplicitnem Eulerju iz trenutne točke naredim korak v smeri njenega naklona. Nova višina je stara višina plus korak krat naklon. Pri implicitnem Eulerju uporabim naklon v novi točki, zato moram novo vrednost praviloma dobiti z reševanjem enačbe.",
        "Obe metodi sta prvega reda: pri dovolj gladki rešitvi in ustreznih pogojih ima napaka na fiksnem intervalu red h. Če korak razpolovim, se ta napaka približno prepolovi."
      ],
      formulas: [
        F(T`y'(x)=f(x,y(x)),\quad y(x_0)=y_0,\quad x_n=x_0+nh`, "y je iskana funkcija; f je podano pravilo za naklon; x₀ in y₀ določata začetek. yₙ je približek za y(xₙ), h pa razdalja med sosednjima točkama."),
        F(T`y_n=y_{n-1}+h f(x_{n-1},y_{n-1})`, "Eksplicitni Euler: vse na desni že poznam. Naklon vzamem na začetku koraka."),
        F(T`y_n=y_{n-1}+h f(x_n,y_n)`, "Implicitni Euler: yₙ nastopa tudi na desni. Odsek mora imeti naklon, ki ga enačba predpisuje v njegovem koncu.")
      ],
      imagine: "Narišem točno rešitev kot krivuljo in začetno točko na njej. Eksplicitni Euler nadaljuje po tangenti; po razdalji h izračunam nov naklon in spet naredim raven odsek. Tako nastane lomljenka.",
      demo: "euler",
      followups: [
        Q("Kako ju izpeljem iz diferenc?", "Pri eksplicitnem zamenjam y′(xₙ₋₁) s premo diferenco (yₙ−yₙ₋₁)/h. Pri implicitnem zamenjam y′(xₙ) z obratno diferenco z istima mrežnima točkama. Vstavim y′=f in izrazim novo vrednost."),
        Q("Kaj je lokalna in kaj globalna napaka?", "Lokalna napaka je napaka enega koraka, če začnem iz točne prejšnje vrednosti; pri Eulerju je O(h²). Globalna vključuje tudi napake prejšnjih korakov in je pod pogoji iz gradiva O(h)."),
        Q("Zakaj je implicitna lahko uporabna?", "Lahko dopušča večje stabilne korake. Na primer za y′=λy z realnim λ<0 ima eksplicitna faktor 1+hλ, implicitna pa 1/(1−hλ). Implicitnost sama po sebi še ne pomeni višjega reda natančnosti."),
        Q("Zakaj na drugem izpitu ni bilo treba reševati nelinearne enačbe?", "Ker je f(x,y)=−2x neodvisna od y. Implicitna formula v tem posebnem primeru postane neposreden račun.")
      ],
      example: "Na tvojem 2. izpitu je y′=−2x, y(0)=1. Pri h=1/2 eksplicitni Euler da y₁=1, y₂=1/2; implicitni y₁=1/2, y₂=−1/2. Točno je y(1)=0. Pri h=1/n sta končna približka ±1/n, zato za napako strogo manjšo od 0,1 potrebuješ n=11.",
      source: [65, 67], exam: [2, 4]
    },
    {
      id: "rk", title: "Od Eulerja do Runge–Kutta", official: [11], priority: "Najprej · 1. in 2. zapis kolegov",
      question: "Zakaj gremo iz Eulerjevih na Runge–Kutta metode in kako preberem Butcherjevo shemo?",
      speech: [
        "Euler cel korak opiše z enim naklonom. Če se smer rešitve vmes spreminja, je to grobo. Runge–Kutta znotraj istega koraka izračuna več pomožnih naklonov in jih ustrezno uteži. Tako lahko dosežemo višji red natančnosti.",
        "Metoda ostane enočlenska, ker za nov korak potrebuje samo prejšnji približek rešitve. Večstopenjska pa pomeni, da v tem koraku izračuna več pomožnih naklonov. Število stopenj in red natančnosti nista ista stvar.",
        "Pri profesorjevi izboljšani Eulerjevi metodi najprej izračunam začetni naklon. Z njim ocenim rešitev na polovici koraka, tam izračunam nov naklon in z njim naredim cel korak. To je dvostopenjska metoda drugega reda."
      ],
      formulas: [
        F(T`k_i=f\!\left(x_{n-1}+\alpha_i h,\;y_{n-1}+h\sum_{j=1}^s\beta_{i,j}k_j\right),\qquad y_n=y_{n-1}+h\sum_{i=1}^s\gamma_i k_i`, "Oznake iz gradiva: s je število stopenj; kᵢ so pomožni odvodi; αᵢ pove, kje v koraku računam; βᵢⱼ sestavijo pomožno višino; γᵢ utežijo končni naklon."),
        F(T`\begin{array}{c|cc}0&0&0\\\tfrac12&\tfrac12&0\\\hline&0&1\end{array}\qquad\begin{aligned}k_1&=f(x_{n-1},y_{n-1}),\\k_2&=f(x_{n-1}+h/2,y_{n-1}+hk_1/2),\\y_n&=y_{n-1}+hk_2.\end{aligned}`, "Izboljšana Eulerjeva metoda, primer 4.2 v gradivu. Levo v tabeli so α, v sredini β, spodaj γ. Druga vrstica naroči pol koraka v x in pol premika hk₁ v y.")
      ],
      imagine: "Narišem začetno točko in kratek tangentni premik do polovice koraka. V dobljeni pomožni točki vzamem nov naklon. Nato se vrnem v začetno točko in naredim cel korak s tem sredinskim naklonom. Pomožna točka je ocena, ne nujno točka na točni rešitvi.",
      followups: [
        Q("Kako izpeljem sredinsko metodo?", "Odvod v sredini približam s simetrično diferenco med krajiščema koraka. Manjkajočo vrednost rešitve v sredini ocenim s Taylorjevim razvojem: y na sredini ≈ stari y + (h/2)f na začetku. Dobim k₁, k₂ in yₙ iz zgornjega zapisa; lokalna napaka je O(h³), globalna O(h²)."),
        Q("Kako vidim, da je metoda eksplicitna?", "Če so v matriki β vsi elementi na diagonali in nad njo nič, lahko k₁, k₂ … računam zaporedoma. Če se stopnja sklicuje sama nase ali so stopnje sklopljene, moram rešiti enačbe za stopnje."),
        Q("Kaj naj vem o RK4?", "Klasični RK4 uporabi štiri naklone: na začetku, dvakrat na polovici in na koncu koraka. Končna kombinacija je h(k₁+2k₂+2k₃+k₄)/6. Globalna napaka je O(h⁴), lokalna O(h⁵), ob zadostni gladkosti."),
        Q("Zakaj so kᵢ na rešitvah izpita zapisani drugače?", "V gradivu so kᵢ nakloni in jih pri premiku množim s h. Rešitve 1. izpita z istim simbolom označijo že premike. Če premike označim Kᵢ=h kᵢ, je Kᵢ=h f(x+αᵢh,y+ΣβᵢⱼKⱼ), končni zapis pa y novo = y staro + ΣγᵢKᵢ. Faktorja h ne smem šteti dvakrat.")
      ],
      example: "Tvoja shema na 1. izpitu ima prvo vrstico 0 | 1/2, 0: prva stopnja vsebuje samo sebe. Za h=1 in f(x,y)=2x+y dobim k₁=y staro+k₁/2+2x staro. V prvem koraku k₁=2, k₂=4, y₁=4; v drugem k₁=12, k₂=14, y₂=17. Najprej preberem dejansko tabelo, nato računam.",
      source: [70, 72], exam: [1, 4]
    },
    {
      id: "odvajanje", title: "Diference in red napake", official: [8], priority: "Najprej · 3. naloga: 0/20 → 10/20",
      question: "Kaj so prema, obratna in simetrična diferenca? Zakaj imajo različen red ostanka?",
      speech: [
        "Odvod je naklon tangente. Če poznam samo vrednosti funkcije v nekaj točkah, tangento približam s sekanto: spremembo funkcijske vrednosti delim z razdaljo med točkama.",
        "Prema diferenca gleda v desno, obratna v levo, simetrična pa uporabi točki na obeh straneh. Prema in obratna imata napako reda h. Pri simetrični se v Taylorjevih razvojih sodi členi odštejejo, zato po deljenju z 2h ostane napaka reda h².",
        "Majhen korak zmanjšuje napako formule, toda zelo majhen korak poveča vpliv zaokroževanja: odštevam skoraj enaki števili in delim z majhnim h. Zato manjši korak ni vedno boljši."
      ],
      formulas: [
        F(T`D_h^+f(x)=\frac{f(x+h)-f(x)}h,\qquad f'(x)-D_h^+f(x)=-\frac h2f''(\xi_+)`, "Prema: x je točka odvoda, h>0 korak, ξ₊ je neka točka med x in x+h. Ostanek je tu vedno definiran kot točna vrednost minus približek."),
        F(T`D_h^-f(x)=\frac{f(x)-f(x-h)}h,\qquad f'(x)-D_h^-f(x)=\frac h2f''(\xi_-)`, "Obratna: uporabim levo sosedo. ξ₋ leži med x−h in x. Prema in obratna sta reda 1."),
        F(T`D_h^0f(x)=\frac{f(x+h)-f(x-h)}{2h},\qquad f'(x)-D_h^0f(x)=-\frac{h^2}{6}f'''(\xi_0)`, "Simetrična: razdalja med uporabljenima točkama je 2h. ξ₀ leži med x−h in x+h. Ob dovolj gladki funkciji je napaka O(h²).")
      ],
      imagine: "Narišem graf, tangento pri x ter sekante med levo, srednjo in desno točko. Simetrična sekanta zajame obe strani. Na robu intervala pogosto lahko uporabim samo enostransko pravilo.",
      demo: "difference",
      followups: [
        Q("Kako izpeljem novo pravilo iz treh točk?", "Nastavim A f(x₀)+B f(x₀+h)+C f(x₀+2h). Zahtevam točnost na 1, x−x₀ in (x−x₀)²: A+B+C=0, hB+2hC=1, h²B+4h²C=0. Dobim A=−3/(2h), B=2/h, C=−1/(2h)."),
        Q("Ali enostransko pravilo vedno pomeni red 1?", "Ne. Osnovna dvotočkovna prema diferenca je reda 1. Tritočkovna formula s tvojega 1. izpita, (−3f(x₀)+4f(x₀+h)−f(x₀+2h))/(2h), je reda 2."),
        Q("Kaj pomeni točnost na polinomih?", "Če pravilo vrne pravi odvod za 1, x−x₀, …, (x−x₀)ᵣ, je zaradi linearnosti točno za vse polinome stopnje največ r. To ne prepoveduje, da je po naključju točno še za kak poseben polinom višje stopnje."),
        Q("Kaj povem za 2. izpit?", "Antisimetrične uteži izničijo sode potence okoli x₀. Za linearno funkcijo dobim h(B−3A)=1, za kubično pa B−27A=0. Zato A=1/(24h), B=9/(8h). Zaradi simetrije je pravilo točno tudi za potenco 4; prvi neizničeni Taylorjev člen da napako O(h⁴).")
      ],
      example: "Pri f(x)=x³, x=1 in h=0,1 je pravi odvod 3. Prema diferenca da 3,31, obratna 2,71, simetrična 3,01. Tako lahko na konkretnem primeru razložiš, kaj pomeni boljša natančnost pri istem koraku.",
      source: [44, 48], exam: [1, 3]
    },
    {
      id: "vecclenske", title: "Veččlenske metode", official: [12], priority: "1. zapis kolegov · povezano z RK",
      question: "Kaj pridobimo z veččlenskimi metodami in kako izpeljemo eno od njih?",
      speech: [
        "Pri Runge–Kutta za vsak korak računam več novih pomožnih naklonov. Veččlenska metoda uporabi zgodovino: naklone in približke iz prejšnjih mrežnih točk. S tem lahko dosežem višji red z manj novimi izračuni funkcije.",
        "Pri Adams–Bashforthovi metodi diferencialno enačbo integriram čez naslednji korak. Funkcijo naklona nadomestim z interpolacijskim polinomom skozi že znane naklone in ta polinom integriram. Za dvočlensko metodo zadošča premica skozi zadnja dva naklona.",
        "Slabost je začetek: samo y₀ ne zadošča, zato dodatne začetne približke običajno izračunam z enočlensko metodo. Pomembna je tudi stabilnost; visok red sam ne zagotovi konvergence."
      ],
      formulas: [
        F(T`y(x_n)=y(x_{n-1})+\int_{x_{n-1}}^{x_n}f(x,y(x))\,dx`, "To je izhodišče izpeljave: sprememba rešitve je integral njenega odvoda."),
        F(T`f_j=f(x_j,y_j),\qquad y_n=y_{n-1}+\frac h2(3f_{n-1}-f_{n-2})`, "Adams–Bashforth z dvema členoma. h je stalen korak; fⱼ so shranjeni nakloni. Potrebujem y₀ in y₁. Metoda je eksplicitna, globalno reda 2 ob ustreznem začetku in pogojih stabilnosti.")
      ],
      imagine: "Na grafu naklona označim zadnji dve znani točki, skozi njiju potegnem premico in jo podaljšam čez naslednji interval. Integral pod podaljšano premico je predvideni prirastek y. To je ekstrapolacija naklonov.",
      followups: [
        Q("Od kod koeficienta 3/2 in −1/2?", "Pišem x=xₙ₋₁+th, 0≤t≤1. Interpolacijska premica je p=fₙ₋₁+t(fₙ₋₁−fₙ₋₂). Integriram h∫₀¹p dt: dobim h[fₙ₋₁+(fₙ₋₁−fₙ₋₂)/2]."),
        Q("Kaj je Adams–Moulton?", "Pri interpolaciji uporabim tudi naklon v novi, še neznani točki. Dobim implicitno metodo. Najpreprostejša taka primera v gradivu sta implicitni Euler in trapezna metoda; ta dva sta še enočlenska."),
        Q("Ali je RK4 štiričlenska metoda?", "Ne. Je štiristopenjska enočlenska metoda: štirje pomožni nakloni znotraj koraka, a samo ena prejšnja vrednost rešitve."),
        Q("Kaj pomeni prediktor–korektor?", "Z eksplicitno metodo najprej napovem novo vrednost. Z njo ocenim novi naklon v implicitni formuli in približek popravim. Profesor to pokaže z Milneovim parom metod na straneh 76–77.")
      ],
      example: "Če je zadnji naklon 2, predzadnji 1 in h=0,1, AB2 predvidi prirastek 0,1·(3·2−1)/2=0,25. Naklon je naraščal, zato je predvideni prirastek večji od Eulerjevega 0,2.",
      source: [75, 77]
    },
    {
      id: "integriranje", title: "Trapez, Simpson in povezava z odvodom", official: [9, 11], priority: "1. in 4. zapis kolegov",
      question: "Kaj je trapezno pravilo in kako sta numerično odvajanje in integriranje povezana z diferencialnimi enačbami?",
      speech: [
        "Pri numeričnem integriranju integral približam z uteženo vsoto nekaj vrednosti funkcije. Newton–Cotesova pravila dobim tako, da funkcijo nadomestim z interpolacijskim polinomom v enakomerno razporejenih vozliščih in ta polinom točno integriram.",
        "Trapezno pravilo poveže krajiščni vrednosti s premico in vzame ploščino pod njo. Simpsonovo pravilo uporabi še sredino in integrira parabolo skozi tri točke. Zaradi simetrije je Simpson točen celo za polinome stopnje 3.",
        "Odvajanje in integriranje lahko gradim na istem interpolantu: če ga odvajam, dobim diferenčno pravilo, če ga integriram, integracijsko pravilo. Pri y′=f lahko odvod zamenjam z diferenco ali pa enačbo integriram in integral približam s kvadraturo."
      ],
      formulas: [
        F(T`T(f)=\frac{b-a}{2}[f(a)+f(b)],\qquad I(f)-T(f)=-\frac{(b-a)^3}{12}f''(\xi)`, "I(f)=∫ₐᵇf je točen integral. a in b sta krajišči, ξ je neka točka vmes. Trapez je točen za polinome stopnje največ 1."),
        F(T`S(f)=\frac{b-a}{6}\left[f(a)+4f\!\left(\frac{a+b}{2}\right)+f(b)\right]`, "Simpson: uteži 1, 4, 1; sredinska vrednost ima največjo utež. Ostanek I−S je −(b−a)⁵f⁽⁴⁾(ξ)/2880."),
        F(T`y_n=y_{n-1}+\frac h2\left[f(x_{n-1},y_{n-1})+f(x_n,y_n)\right]`, "Trapezna metoda za diferencialno enačbo: na integral naklona čez en korak uporabim trapezno pravilo. To je implicitna enočlenska metoda drugega reda.")
      ],
      imagine: "Pri integralu narišem graf f in premico skozi krajišči: pod premico je trapez. Pri diferencialni enačbi integriram graf naklona x ↦ f(x,y(x)); dobljena ploščina pomeni spremembo y, ne ploščine pod grafom y.",
      visual: "quadrature",
      followups: [
        Q("Zakaj sestavljeno pravilo?", "Dolg interval razdelim na krajše in seštejem lokalne približke. Pri sestavljenem trapezu je za f∈C² globalna napaka O(h²), pri sestavljenem Simpsonu za f∈C⁴ pa O(h⁴). Tu h pomeni razmik mreže na fiksnem intervalu."),
        Q("Kako napišem sestavljeni pravili?", "Za m podintervalov in h=(b−a)/m je Tₕ=h[f(x₀)/2+f(x₁)+…+f(xₘ₋₁)+f(xₘ)/2]. Pri Simpsonu mora biti m sodo: Sₕ=(h/3)[f(x₀)+4f(x₁)+2f(x₂)+4f(x₃)+…+4f(xₘ₋₁)+f(xₘ)]."),
        Q("Kaj pove ostanek?", "Kako je napaka odvisna od razmika in odvoda, kakšno gladkost potrebujem in za katere polinome je pravilo točno. Če je f konveksna, je f″≥0, zato je I−T≤0: trapez preceni integral."),
        Q("Kako iz integriranja dobim Eulerja?", "V integralu naklona uporabim levi pravokotnik za eksplicitnega Eulerja, desnega za implicitnega. Povprečje krajiščnih naklonov da trapezno metodo.")
      ],
      example: "Za ∫₀¹x² dx je točna vrednost 1/3. Trapez da (0+1)/2=1/2. Simpson da (0+4·1/4+1)/6=1/3, saj je za kvadratne polinome točen.",
      source: [49, 57]
    },
    {
      id: "bezier", title: "Bézier in de Casteljau", official: [4, 5], priority: "Nato · 2. naloga: 6/20 → 12/20 · 3. zapis kolegov",
      question: "Kaj je Bézierjeva krivulja, kaj pomenijo kontrolne točke in kako izračunam točko na njej?",
      speech: [
        "Bézierjeva krivulja je parametrična polinomska krivulja. Določim jo s kontrolnimi točkami, ki si jih predstavljam kot ročice za oblikovanje. Parameter t med 0 in 1 pove, kje na poti sem.",
        "Točko krivulje dobim kot uteženo vsoto kontrolnih točk. Uteži so Bernsteinovi polinomi; na intervalu od 0 do 1 so nenegativni in imajo vsoto 1. Zato leži krivulja v konveksni ovojnici kontrolnih točk. Skozi prvo in zadnjo gre, skozi notranje pa praviloma ne.",
        "De Casteljau je geometrijski način računanja iste točke: med vsaki sosednji kontrolni točki vstavim točko v deležu t, nato postopek ponovim na novem, krajšem seznamu. Ko ostane ena točka, je to b(t)."
      ],
      formulas: [
        F(T`\mathbf b(t)=\sum_{i=0}^n\mathbf b_i B_i^n(t),\qquad B_i^n(t)=\binom ni t^i(1-t)^{n-i}`, "bᵢ so vektorske kontrolne točke, n je stopnja (kontrolnih točk je n+1), t∈[0,1] je parameter, Bᵢⁿ so skalarne uteži."),
        F(T`\mathbf b_i^{(0)}=\mathbf b_i,\qquad\mathbf b_i^{(r)}=(1-t)\mathbf b_i^{(r-1)}+t\mathbf b_{i+1}^{(r-1)},\qquad\mathbf b(t)=\mathbf b_0^{(n)}`, "r je raven de Casteljaujevega trikotnika; na vsaki ravni je ena točka manj. Pri t=1/2 vedno vzamem razpolovišče.")
      ],
      imagine: "Narišem kontrolni poligon in krivuljo, ki se začne in konča v njegovih krajiščih. Za t=1/2 označim razpolovišča stranic, nato razpolovišča med njimi. Končna točka leži na krivulji.",
      visual: "bezier",
      followups: [
        Q("Kaj mi pove konveksna ovojnica pri oviri?", "Če je presek ovojnice z oviro prazen, krivulja zagotovo ne zadene ovire. Če presek ni prazen, samo iz ovojnice še ne morem sklepati, da pride do trka."),
        Q("Kako krivuljo narišem?", "Izračunam b(t) za dovolj gosto izbrane parametre in povežem sosednje točke, ali pa jo z de Casteljaujevim postopkom razdeljujem na manjše odseke. Pri delitvi robova trikotnika dasta nova kontrolna poligona."),
        Q("Kaj pomeni afina invariantnost?", "Če vse kontrolne točke premaknem, zavrtim ali afino preslikam, dobim enako, kot če bi to preslikavo uporabil na celotni krivulji. Razlog je linearna kombinacija z vsoto uteži 1.")
      ],
      example: "Na 2. izpitu za kvadratno krivuljo pri t=1/2 velja b(1/2)=b₀/4+b₁/2+b₂/4. Pogoji b₀=(−2,0), b′(1)=(4,−2) in b(1/2)=(0,2) dajo b₁=(0,3), b₂=(2,2). Najprej povej, kateri podatek je položaj in kateri odvod.",
      source: [24, 34], exam: [2, 2]
    },
    {
      id: "spoji", title: "Odvodi in gladki Bézierjevi zlepki", official: [6, 7], priority: "Nato · posebej 2. naloga obeh izpitov",
      question: "Kdaj se krivulji stikata gladko in zakaj moram upoštevati dolžino časovnega intervala?",
      speech: [
        "Za zvezen spoj se morata končna točka prve in začetna točka druge krivulje ujemati. To je C⁰. Za C¹ morata biti enaka tudi odvodna vektorja po istem globalnem parametru: ujemata se smer in hitrost.",
        "Geometrijska zveznost G¹ zahteva pri neničelnih tangentah samo enako smer: odvodna vektorja sta pozitivna večkratnika. Pot je lahko videti gladka, robot pa na stiku nenadoma spremeni hitrost.",
        "Če odsek iz lokalnega intervala od 0 do 1 prestavim na globalni interval dolžine hᵢ, se odvod deli s hᵢ. Zato primerjava samih kontrolnih stranic brez dolžin intervalov ni dovolj."
      ],
      formulas: [
        F(T`\mathbf b'(t)=n\sum_{i=0}^{n-1}(\mathbf b_{i+1}-\mathbf b_i)B_i^{n-1}(t)`, "Odvod je spet Bézierjeva krivulja, tokrat stopnje največ n−1; njene kontrolne točke so n-kratne razlike sosednjih prvotnih točk."),
        F(T`\mathbf b'(0)=n(\mathbf b_1-\mathbf b_0),\qquad\mathbf b'(1)=n(\mathbf b_n-\mathbf b_{n-1})`, "Prva in zadnja stranica določata krajiščni tangenti. Faktor n je stopnja odseka."),
        F(T`C^0:\ \mathbf b_n=\mathbf c_0,\qquad C^1:\ \frac n{h_L}(\mathbf b_n-\mathbf b_{n-1})=\frac m{h_R}(\mathbf c_1-\mathbf c_0)`, "n in m sta stopnji levega in desnega odseka; hL in hR sta dolžini njunih globalnih intervalov. Za G¹ zahtevam pozitivno sorazmernost teh neničelnih vektorjev.")
      ],
      imagine: "Narišem tri točke okrog spoja: predzadnjo levo, skupno točko in prvo notranjo desno. Za G¹ ležijo na isti premici, usmerjeni stranici kažeta v isto smer. Za C¹ morata biti enaka tudi odvodna vektorja po skaliranju.",
      visual: "bezierJoin",
      followups: [
        Q("Kako konstruiram kubični C¹-zlepek iz točk in tangent?", "Za krajišči Pᵢ, Pᵢ₊₁, globalna odvodna vektorja vᵢ, vᵢ₊₁ in interval dolžine hᵢ vzamem kontrolne točke Pᵢ, Pᵢ+(hᵢ/3)vᵢ, Pᵢ₊₁−(hᵢ/3)vᵢ₊₁, Pᵢ₊₁. Če sta pri sosednjih odsekih skupna točka in njen odvod ista, je spoj C¹."),
        Q("Kaj pa kvadratični C¹-zlepek?", "Odsek ima samo eno notranjo kontrolno točko, zato obeh krajiščnih tangent ne morem neodvisno predpisati. Pri enotskih intervalih in kontrolnih točkah Pᵢ, qᵢ, Pᵢ₊₁ velja qᵢ₊₁=2Pᵢ₊₁−qᵢ. Prvo q izberem, ostale dobim z zrcaljenjem; pri različnih dolžinah uporabim skalirani pogoj C¹."),
        Q("Zakaj sploh lepimo?", "Dolgo in zahtevno obliko sestavim iz kratkih odsekov nizke stopnje. Dobim več lokalnega nadzora nad obliko, pri spojih pa posebej poskrbim za želeno gladkost.")
      ],
      example: "Na 1. izpitu sta odvoda v spoju (−3,−6) in (−2,−4): enaka smer, različni normi, torej G¹, vendar ne C¹. Na 2. izpitu sta globalni dolžini 1/2 in 3/2: zahtevam 2b′(1)=(2/3)c′(0), zato c₀=(2,2), c₁=(8,−1). Faktorja 2 in 2/3 prideta iz reparametrizacije.",
      source: [34, 43], exam: [2, 2]
    },
    {
      id: "casteljau", title: "De Casteljau korak za korakom", official: [5], priority: "5. zapis kolegov · po Bézierjevih krivuljah",
      question: "Pokaži de Casteljaujev postopek na eni kvadratni krivulji.",
      speech: [
        "Imam tri kontrolne točke b₀, b₁ in b₂ ter izbran parameter t. Najprej naredim linearno interpolacijo med prvima dvema in med zadnjima dvema točkama. Dobim dve novi točki. Med njima še enkrat naredim isto interpolacijo in dobim točko na krivulji.",
        "Parameter t je ves čas isti. Pri t=1/2 vedno vzamem razpolovišče. Pri drugih t vzamem delež t poti od prve do druge točke. Za krivuljo stopnje n enako ponovim n-krat."
      ],
      formulas: [
        F(T`\mathbf d_0=(1-t)\mathbf b_0+t\mathbf b_1,\quad\mathbf d_1=(1-t)\mathbf b_1+t\mathbf b_2,\quad\mathbf b(t)=(1-t)\mathbf d_0+t\mathbf d_1`, "d₀ in d₁ sta pomožni točki prve ravni. To je postopek za tri kontrolne točke; vse račune izvajam po koordinatah."),
        F(T`\mathbf b(1/2)=\tfrac14\mathbf b_0+\tfrac12\mathbf b_1+\tfrac14\mathbf b_2`, "Če vstavim prvi dve interpolaciji v zadnjo, dobim ravno Bernsteinove uteži. De Casteljau izračuna isto krivuljo kot neposredna formula.")
      ],
      imagine: "Narišem trikotnik kontrolnih točk, označim razpolovišči prvih dveh stranic in ju povežem. Razpolovišče te nove daljice je točka na krivulji pri t=1/2.",
      followups: [
        Q("Kaj narišem na tablo?", "Tri kontrolne točke; pod njimi dve pomožni točki; spodaj eno končno. Ob eno povezavo napišem (1−t)·prva+t·druga. To pokaže ves algoritem brez dolgega računanja."),
        Q("Ali je t=1/2 polovica dolžine poti?", "Ni nujno. Je polovica parametričnega intervala. Hitrost potovanja po krivulji praviloma ni konstantna."),
        Q("Kako dobim celo krivuljo?", "Postopek ponovim za več t od 0 do 1. Zaporedne dobljene točke povežem s kratkimi daljicami.")
      ],
      example: "Za b₀=(−2,0), b₁=(0,3), b₂=(2,2) in t=1/2 najprej dobim d₀=(−1; 1,5), d₁=(1; 2,5), nato b(1/2)=(0,2). Pri pomožnih točkah podpičje loči koordinati, vejica pa pomeni decimalno vejico.",
      source: [27, 31], exam: [2, 2]
    },
    {
      id: "zlepki", title: "Odsekoma polinomske funkcije", official: [3], priority: "4. zapis kolegov",
      question: "Kaj je zlepek in koliko prostih parametrov imajo linearni, kvadratični in kubični zlepki?",
      speech: [
        "Pri enem polinomu velja isti predpis na celem intervalu. Pri odsekoma polinomski funkciji interval razdelim na manjše dele in ima vsak del svoj polinom nizke stopnje. Na stikih zahtevam ustrezno ujemanje vrednosti in odvodov.",
        "C⁰ pomeni, da ni preskoka vrednosti. C¹ pomeni, da se ujemajo še prvi odvodi, torej ni preloma v naklonu. C² doda ujemanje drugih odvodov. Število prostih parametrov dobim tako, da od števila vseh koeficientov odštejem neodvisne pogoje na stikih.",
        "Za zvezni linearni zlepek zadoščajo funkcijske vrednosti v vozliščih. Za C¹-kvadratičnega poleg njih potrebujem še en pogoj, na primer začetni naklon. Pri kubičnem moram povedati, ali govorim o C¹ ali C², ker imata različno število prostih parametrov."
      ],
      formulas: [
        F(T`\dim S_n^r(X)=m(n+1)-(m-1)(r+1),\qquad 0\le r\le n`, "X={x₀,…,xₘ} je fiksna delitev na m intervalov, n stopnja lokalnih polinomov, r red zvezne odvedljivosti. Na vsakem od m−1 notranjih stikov zahtevam r+1 ujemanj."),
        F(T`\dim S_1^0=m+1,\quad\dim S_2^1=m+2,\quad\dim S_3^1=2m+2,\quad\dim S_3^2=m+3`, "To so dimenzije PRED predpisom interpolacijskih podatkov. Po m+1 vrednostih ostane: linearni 0, C¹-kvadratični 1, C¹-kubični m+1 in C²-kubični 2 prosta parametra."),
        F(T`s(x)=f_i+\frac{f_{i+1}-f_i}{x_{i+1}-x_i}(x-x_i),\qquad x\in[x_i,x_{i+1}]`, "Primer lokalnega linearnega predpisa: fᵢ=f(xᵢ). To je premica skozi sosednja podatka.")
      ],
      imagine: "Najprej povežem podatkovne točke z ravnimi daljicami: dobim C⁰-lomljenko. Potem si zamislim parabolične ali kubične odseke, ki na stikih dobijo enak naklon in po potrebi še drugi odvod.",
      visual: "splines",
      followups: [
        Q("Kako konstruiram C¹-kvadratičnega?", "Na odseku zadoščam obema krajiščnima vrednostma in začetnemu naklonu sᵢ. Odvod na koncu je sᵢ₊₁=2(fᵢ₊₁−fᵢ)/(xᵢ₊₁−xᵢ)−sᵢ. Ta postane začetni naklon naslednjega odseka. Izberem s₀ in nadaljujem."),
        Q("Kako konstruiram kubičnega?", "Za C¹-Hermitovega na vsakem odseku predpišem vrednost in odvod na obeh koncih: štirje pogoji za štiri koeficiente. Za C²-kubičnega poleg vrednosti zahtevam gladkost do drugega odvoda in dodam dva robna pogoja, na primer predpisana krajiščna prva odvoda ali ničelna druga odvoda pri naravnem zlepku."),
        Q("Zakaj ne en polinom zelo visoke stopnje?", "Pri interpolaciji lahko med vozlišči močno niha, predvsem pri neugodnih vozliščih. Z odseki nizke stopnje dobim prilagodljivo lokalno oblikovanje.")
      ],
      example: "Pri m=3 intervalih ima C¹-kvadratični zlepek 5 prostih parametrov. Štiri vrednosti v vozliščih porabijo štiri pogoje; ostane še začetni naklon. C²-kubični ima 6 parametrov; po štirih vrednostih ostaneta dva robna pogoja.",
      source: [13, 23]
    },
    {
      id: "remes", title: "Najboljša aproksimacija in Remes", official: [2], priority: "3. zapis kolegov · 1. naloga: 15/20 → 16/20",
      question: "Kaj pomeni najboljša enakomerna aproksimacija in kako jo iščemo z Remesovim postopkom?",
      speech: [
        "Med polinomi dovoljene stopnje iščem takega, ki ima najmanjšo največjo absolutno napako na intervalu. Torej izboljšujem najslabši odklon. Residual je razlika med funkcijo in približkom.",
        "Najboljši polinom stopnje največ n prepoznam po alterniranju: napaka v vsaj n+2 urejenih točkah izmenično doseže pozitivni in negativni globalni ekstrem enake velikosti. To je izrek o alterniranju.",
        "Remes začne z n+2 točkami. Iz pogojev alterniranja rešim linearni sistem za koeficiente polinoma in predznačeno višino m. Nato poiščem največjo napako na celem intervalu in zamenjam referenčno točko tako, da ohranim alterniranje. Ponavljam, dokler se največja napaka dovolj dobro ujema z |m|."
      ],
      formulas: [
        F(T`p^*=\arg\min_{p\in P_n}\|f-p\|_\infty,\qquad\|f-p\|_\infty=\max_{x\in[a,b]}|f(x)-p(x)|`, "Pₙ so polinomi stopnje največ n; p* je najboljši polinom, norma ∞ pa velikost najslabšega odklona."),
        F(T`p(x_i)+(-1)^i m=f(x_i),\qquad i=0,\ldots,n+1`, "Enačbe enega Remesovega koraka. Neznanih je n+1 koeficientov polinoma in še m: skupaj n+2. m je lahko negativen; velikost napake na tej množici je |m|.")
      ],
      imagine: "Narišem graf napake med vodoravnima črtama +E in −E. Pri najboljšem približku se graf izmenično dotika zgornje in spodnje meje. Če nekje štrli čez, prejšnja višina še ni največja napaka na celem intervalu.",
      visual: "remez",
      followups: [
        Q("Zakaj n+2 točki?", "Polinom ima n+1 koeficientov, dodatna neznanka pa je skupna predznačena višina m. Alternacijski izrek pove, da n+2 izmeničnih globalnih ekstremov certificira najboljši polinom."),
        Q("Ali en korak že da rešitev na celem intervalu?", "Dobiš najboljši približek na izbrani množici n+2 točk. Za trditev o celotnem intervalu moraš preveriti še residual med njimi. To je bila pomembna omejitev obeh tvojih izpitnih nalog."),
        Q("Kako bi pojasnil idejo izreka?", "Če bi imel drugi polinom manjšo napako, bi moral na zaporednih ekstremih popravljati izmenično navzgor in navzdol. Razlika polinomov bi zato imela vsaj n+1 ničel, čeprav je stopnje največ n. To je nemogoče za neničeln polinom.")
      ],
      example: "Na 2. izpitu za E₀={0,1/2,1} dobiš p(x)=24x−11 in m=−1. Napake so −1,+1,−1, njihova največja absolutna vrednost pa 1. Negativni m torej ne pomeni negativne norme.",
      source: [6, 10], exam: [2, 1]
    },
    {
      id: "kvadrati", title: "Metoda najmanjših kvadratov", official: [], priority: "Dodatek iz 4. zapisa kolegov",
      question: "Kaj minimiziramo pri metodi najmanjših kvadratov in kako si to predstavljam?",
      speech: [
        "Imam podatke, na primer meritve, in izbran model, na primer premico. Ker se vsi podatki navadno ne ujemajo natančno z modelom, iščem koeficiente, pri katerih je vsota kvadratov odstopanj najmanjša.",
        "Na sliki narišem točke in premico ter navpične razdalje od točk do premice. Kvadriram jih in seštejem. Kvadriranje prepreči, da bi se pozitivne in negativne napake med seboj izničile, večje napake pa močneje kaznuje.",
        "Pri linearni odvisnosti od neznanih koeficientov problem zapišem kot minimizacijo norme Ac−d. Optimalni residual je pravokoten na stolpce matrike A. Iz tega dobim normalne enačbe."
      ],
      formulas: [
        F(T`\min_{\mathbf c}\sum_{i=1}^N\bigl(p_{\mathbf c}(x_i)-d_i\bigr)^2=\min_{\mathbf c}\|A\mathbf c-\mathbf d\|_2^2`, "xᵢ so mesta meritev, dᵢ izmerjene vrednosti, c neznani koeficienti. Pri premici p(x)=c₀+c₁x je i-ta vrstica A enaka (1,xᵢ)."),
        F(T`A^T(A\mathbf c-\mathbf d)=0\quad\Longleftrightarrow\quad A^TA\mathbf c=A^T\mathbf d`, "Normalne enačbe. Ob neodvisnih stolpcih A je rešitev enolična. Za dejansko numerično računanje lahko uporabim QR-razcep, ki se izogne tvorjenju AᵀA."),
        F(T`\min_{p\in P_n}\int_a^b|f(x)-p(x)|^2\,dx`, "Zvezna različica: namesto vsote čez meritve uporabim integral kvadrata napake. To je aproksimacija v normi L².")
      ],
      imagine: "Navpične črtice od meritev do grafa modela so residuali. Modela ne silim skozi vsako točko: izberem ga tako, da je skupna vsota njihovih kvadratov najmanjša. V vektorski sliki je Ac pravokotna projekcija podatkov d na prostor modela.",
      followups: [
        Q("Kako se razlikuje od Remesa?", "Najmanjši kvadrati minimizirajo vsoto oziroma integral kvadratov napak. Remes išče najmanjšo največjo absolutno napako. Gre za različni merili, zato lahko dobita različna približka."),
        Q("Kako dobim normalne enačbe?", "Funkcijo napake J(c)=(Ac−d)ᵀ(Ac−d) odvajam po koeficientih. Pogoj za minimum je ∇J=2Aᵀ(Ac−d)=0."),
        Q("Kaj mora veljati za enoličnost?", "Stolpci A morajo biti linearno neodvisni. Če niso, najboljši približeni podatki še vedno obstajajo, koeficienti pa niso nujno enolični.")
      ],
      example: "Če tri meritve 0, 0 in 3 približujem s konstanto c, minimiziram c²+c²+(c−3)². Odvod je 6c−6, zato c=1, aritmetična sredina. Pri minimaksu bi dobil c=1,5, sredino med najmanjšo in največjo meritvijo.",
      source: [3, 3], supplement: true
    },
    {
      id: "aproksimacija", title: "Aproksimacija in Bernstein", official: [1], priority: "Kratek pregled osnov",
      question: "Kaj je aproksimacija in zakaj uporabljamo polinome?",
      speech: [
        "Zahtevno funkcijo nadomestim s preprostejšo iz izbranega prostora. Povedati moram, katero funkcijo približujem, katere približke dovolim in v kateri normi merim napako. Iščem približek, katerega napaka je čim bližje najmanjši dosegljivi.",
        "Polinomi so priročni, ker jih enostavno vrednotim, odvajam in integriram. Weierstrassov izrek zagotavlja, da lahko vsako zvezno funkcijo na zaprtem omejenem intervalu s polinomi poljubno dobro približam v enakomerni normi, če dopuščam dovolj visoko stopnjo.",
        "Bernsteinov približek na intervalu od 0 do 1 sestavim iz vzorčnih vrednosti funkcije in Bernsteinovih uteži. Z višanjem stopnje enakomerno konvergira k zvezni funkciji. Pri fiksni stopnji pa ni nujno najboljši približek."
      ],
      formulas: [
        F(T`\operatorname{dist}(f,Y)=\inf_{g\in Y}\|f-g\|`, "f je podana funkcija, Y prostor dovoljenih približkov, g kandidat. Infimum pomeni spodnjo mejo dosegljivih napak; če jo nek g doseže, je najboljši približek."),
        F(T`B_nf(x)=\sum_{i=0}^n f(i/n)\binom ni x^i(1-x)^{n-i},\qquad x\in[0,1]`, "n≥1 določa stopnjo, f(i/n) so vzorčne vrednosti. Bernsteinove uteži so iste kot pri Bézierju, le da tu utežimo števila, pri krivulji pa kontrolne vektorje.")
      ],
      imagine: "Narišem zahtevnejši graf f in preprost približek g. Navpična razlika je residual. Norma pove, ali gledam največji odklon, vsoto kvadratov ali drugo merilo.",
      followups: [
        Q("Je Bernsteinov polinom interpolant?", "Na [0,1] zadene krajišči, praviloma pa ne vseh notranjih vzorčnih točk. Vzorci so njegovi koeficienti v Bernsteinovi bazi, ne zahteve po interpolaciji."),
        Q("Kaj Weierstrass ne trdi?", "Ne trdi, da vsak interpolacijski postopek z višanjem stopnje konvergira. Zagotovi obstoj poljubno dobrih polinomskih približkov.")
      ],
      example: "Za f(x)=x² je B₂f(x)=x/2+x²/2. Pri x=1/2 dobim 3/8, medtem ko je f(1/2)=1/4. To na hitro pokaže, da Bernsteinov približek ni nujno interpolant.",
      source: [1, 5]
    },
    {
      id: "romberg", title: "Rombergova metoda", official: [10], priority: "5. zapis kolegov · po sestavljenih pravilih",
      question: "Kako iz dveh trapeznih približkov dobim natančnejši integral?",
      speech: [
        "Najprej izračunam sestavljeno trapezno pravilo s korakom h, nato še s polovičnim korakom. Pri dovolj gladki funkciji se vodilna napaka ob razpolovitvi približno deli s štiri, ker je sorazmerna s h².",
        "Natančnejši približek pomnožim s štiri, odštejem prejšnjega in delim s tri. S tem se vodilni člen napake izniči. Ostane napaka višjega reda. To je Richardsonova ekstrapolacija.",
        "Romberg ta postopek ponavlja v trikotni tabeli. Prvi stolpec so trapezna pravila na vedno gostejši mreži. Naslednji stolpci zaporedoma odstranjujejo člene s h², h⁴ in tako naprej. Pri gostitvi ponovno uporabim stare funkcijske vrednosti."
      ],
      formulas: [
        F(T`T_h=I+ch^2+O(h^4),\quad T_{h/2}=I+\frac{ch^2}{4}+O(h^4)\quad\Longrightarrow\quad\frac{4T_{h/2}-T_h}{3}=I+O(h^4)`, "I je točen integral; Tₕ in Tₕ/₂ sta sestavljena trapezna približka. c je neznan vodilni koeficient napake; ni ga treba izračunati, saj se odšteje."),
        F(T`R_{j,0}=T_{h_0/2^j},\qquad R_{j,k}=\frac{4^kR_{j,k-1}-R_{j-1,k-1}}{4^k-1},\quad 1\le k\le j`, "j pove raven gostitve mreže, k stolpec ekstrapolacije. Za k=1 dobim faktor 4, za k=2 faktor 16. Pri dovolj gladki funkciji ima fiksni stolpec k napako O(hⱼ^(2k+2)).")
      ],
      imagine: "Narišem trikotno tabelo: levo Tₕ, pod njim Tₕ/₂, pod njim Tₕ/₄. Iz dveh sosednjih v istem stolpcu s puščicama naredim enega desno. V prvem popravku napišem samo (4·boljši−slabši)/3.",
      followups: [
        Q("Zakaj ravno 4 in ne 2?", "Ker je vodilni člen trapezne napake h²: (h/2)²=h²/4. Faktor sledi redu napake. Pri naslednjem stolpcu je vodilna potenca h⁴, zato uporabim 16."),
        Q("Kako je povezan s Simpsonom?", "Prva ekstrapolacija sestavljenih trapezov (4Tₕ/₂−Tₕ)/3 je sestavljeno Simpsonovo pravilo na finejši mreži."),
        Q("Kdaj pričakovanje visokega reda odpove?", "Če funkcija nima dovolj gladkosti za razvoj napake po sodih potencah, na primer pri singularnosti, ali če začnejo prevladovati zaokrožitvene napake. Romberg ne popravi samodejno vsakega težavnega integrala.")
      ],
      example: "Za ∫₀¹x² dx je T₁=1/2 in T₁/₂=3/8. Popravek (4·3/8−1/2)/3=1/3 je točen. Tu se člen reda h² res v celoti odšteje.",
      source: [57, 59]
    },
    {
      id: "gauss", title: "Gaussova integracijska pravila", official: [10], priority: "5. zapis kolegov · dodatno utrdi",
      question: "Kaj je ideja Gaussove metode in zakaj je lahko točna z malo točkami?",
      speech: [
        "Pri Newton–Cotesu vozlišča vnaprej postavim enakomerno in določim uteži. Pri Gaussu izbiram oboje: vozlišča in uteži. To svobodo uporabim, da je pravilo točno za polinome čim višjih stopenj.",
        "Z n+1 primerno izbranimi vozlišči dobim točnost do stopnje 2n+1. Vozlišča so ničle ortogonalnega polinoma stopnje n+1 za obravnavani integral. Pri običajnem integralu na [−1,1] so to ničle Legendrovega polinoma.",
        "To pomeni, da z malo izračuni funkcije dobim zelo dober približek, kadar je funkcija primerna. Točno je pravilo za navedene polinome; za splošno funkcijo še vedno dobim približek."
      ],
      formulas: [
        F(T`\int_a^b f(x)\,dx\approx\sum_{i=0}^n A_i f(x_i),\qquad\text{točno za }p\in P_{2n+1}`, "Oznake kot v gradivu: vozlišč je n+1, xᵢ so njihove lege, Aᵢ so uteži. Če število vozlišč označim z N, je ista stopnja točnosti 2N−1."),
        F(T`\int_{-1}^1 f(t)\,dt\approx f(-1/\sqrt3)+f(1/\sqrt3)`, "Dvotočkovni Gauss–Legendre: vozlišči sta ±1/√3, obe uteži 1. Točno integrira vse polinome stopnje največ 3."),
        F(T`x=\frac{a+b}{2}+\frac{b-a}{2}t,\qquad\int_a^b f(x)\,dx=\frac{b-a}{2}\int_{-1}^1 f\!\left(\frac{a+b}{2}+\frac{b-a}{2}t\right)dt`, "Za splošen interval prestavim standardna vozlišča in vse uteži pomnožim z (b−a)/2. Ta faktor pride iz dx.")
      ],
      imagine: "Na intervalu označim dve notranji točki, malo levo in desno od sredine. Ne postavim ju na krajišči: njuni mesti izberem tako, da utežena vsota pravilno integrira čim več potenc.",
      followups: [
        Q("Kako izpeljem dvotočkovno pravilo simbolično?", "Zaradi simetrije vzamem vozlišči ±c in enaki uteži A. Točnost za 1 da 2A=2, torej A=1. Točnost za t² da 2c²=2/3, torej c=1/√3. Lihe potence do stopnje 3 se izničijo zaradi simetrije."),
        Q("Zakaj ortogonalni polinom?", "Polinom p stopnje največ 2n+1 razdelim kot p=qω+r, kjer je ω produkt (x−xᵢ), q in r pa sta stopnje največ n. Integral qω je zaradi ortogonalnosti nič; tudi v vozliščih je ω nič. Preostanek r pravilo točno integrira kot interpolacijsko pravilo."),
        Q("Kako se razlikuje od Romberga in sestavljenih pravil?", "Sestavljeno pravilo razdeli interval na manjše dele. Romberg kombinira približke na različnih mrežah in izniči napako. Gauss optimizira lege vozlišč in uteži. Tudi Gaussovo pravilo lahko uporabljam sestavljeno."),
        Q("Ali lahko uporabim poljubne že izmerjene točke?", "Osnovno Gaussovo pravilo zahteva vrednosti prav v svojih vozliščih. Če imam samo meritve v drugih fiksnih točkah, jih ne morem preprosto uporabiti kot Gaussova vozlišča.")
      ],
      example: "Za ∫₋₁¹t² dt da dvotočkovni Gauss 1/3+1/3=2/3, kar je točno. Trapez s krajiščema bi dal 2. Primer lepo pokaže, kaj pridobimo z izbiro vozlišč.",
      source: [62, 64]
    },
    {
      id: "sistemi", title: "Sistemi in enačbe višjega reda", official: [13], priority: "Za konec · zadnja uradna tema",
      question: "Ali lahko Eulerja in RK uporabimo tudi za sistem ali enačbo drugega reda?",
      speech: [
        "Da. Pri sistemu namesto enega števila vodim vektor neznank. Funkcija na desni vrne vektor njihovih odvodov. Euler in Runge–Kutta imata iste formule, le da računam z vektorji.",
        "Enačbo višjega reda najprej prepišem v sistem prvega reda. Pri enačbi drugega reda uvedem položaj y in hitrost y′ kot ločeni neznanki. Potrebujem začetni podatek za obe."
      ],
      formulas: [
        F(T`y''=g(x,y,y')\quad\Longrightarrow\quad\mathbf u=\binom{y}{y'},\qquad\mathbf u'=\binom{u_2}{g(x,u_1,u_2)}`, "u₁ je prvotna funkcija, u₂ njen prvi odvod. Novo desno stran označim F(x,u)."),
        F(T`\mathbf u_n=\mathbf u_{n-1}+h\mathbf F(x_{n-1},\mathbf u_{n-1})`, "Eksplicitni Euler za sistem. Vse komponente novega vektorja računam iz istega starega vektorja.")
      ],
      imagine: "Pri gibanju je stanje sestavljeno iz položaja in hitrosti. Enačba pove, kako se spreminjata oba, iz začetnega stanja pa po korakih sledim gibanju.",
      followups: [
        Q("Koliko začetnih pogojev potrebujem?", "Za eno enačbo reda r praviloma r začetnih vrednosti: y, y′, …, y⁽ʳ⁻¹⁾ v isti začetni točki."),
        Q("Je to robni problem?", "Ne. Tukaj so vsi pogoji predpisani v začetni točki. Pri robnem problemu so lahko razporejeni med več točk in neposredno korakanje iz enega znanega stanja ne zadošča.")
      ],
      example: "Nihalo v poenostavljenem modelu y″=−y prepišem kot u₁′=u₂, u₂′=−u₁. Za začetno stanje (1,0) Euler s korakom h da novo stanje (1,−h). Obe novi komponenti uporabita stari vrednosti.",
      source: [73, 74]
    }
  ];

  const notePages = { euler: [20, 21], rk: [20, 21], odvajanje: [15], vecclenske: [22, 24], integriranje: [16, 17], bezier: [9, 10], casteljau: [11], spoji: [12, 14], zlepki: [7, 8], remes: [5, 6], kvadrati: [2], aproksimacija: [2, 4], romberg: [18], gauss: [19] };
  const reports = [
    { n: 1, text: "Euler → RK, diference in ostanki, veččlenske metode, trapez; kaj pomeni in zakaj, skica ter povezava odvajanja z integriranjem.", ids: ["euler", "rk", "odvajanje", "vecclenske", "integriranje"] },
    { n: 2, text: "Podobno kot pri prvem zapisu, posebej Runge–Kutta.", ids: ["rk"] },
    { n: 3, text: "Bézierjeve krivulje in Remesov postopek.", ids: ["bezier", "remes"] },
    { n: 4, text: "Odsekoma polinomske funkcije, pravila za integriranje in odvajanje, metoda najmanjših kvadratov.", ids: ["zlepki", "integriranje", "odvajanje", "kvadrati"] },
    { n: 5, text: "Najprej Bézier, potem de Casteljau, nato numerično integriranje: sestavljena pravila, Romberg in Gauss. Poudarek na razumevanju; zapis je lahko simboličen.", ids: ["bezier", "casteljau", "integriranje", "romberg", "gauss"] }
  ];
  const exams = [
    { n: 1, title: "Remes; na drugem tudi Bernstein", first: 15, second: 16, target: "remes" },
    { n: 2, title: "Bézier, de Casteljau, odvodi in spoji", first: 6, second: 12, target: "bezier" },
    { n: 3, title: "Numerično odvajanje in točnost pravil", first: 0, second: 10, target: "odvajanje" },
    { n: 4, title: "Na prvem RK; na drugem Euler", first: 0, second: 10, target: "euler" }
  ];
  const byId = new Map(topics.map(topic => [topic.id, topic]));
  const jump = id => `<a href="#/na-izi/${id}">${byId.get(id).title}</a>`;
  const range = pages => pages.length > 1 && pages[0] !== pages[1] ? `${pages[0]}–${pages[1]}` : pages[0];

  function sources(topic) {
    const extra = notePages[topic.id];
    return `<div class="easy-sources"><a href="../apm_nm2_gradivo.pdf#page=${topic.source[0] + 7}" target="_blank" rel="noopener">Profesorjevo gradivo · str. ${range(topic.source)}</a>${extra ? `<a href="../Teorija_260810_181347.pdf#page=${extra[0]}" target="_blank" rel="noopener">Dodatna teorija · PDF str. ${range(extra)}</a>` : ""}${topic.exam ? `<a href="../apm_nm2_i${topic.exam[0]}_2526.pdf#page=${topic.exam[1]}" target="_blank" rel="noopener">${topic.exam[0]}. izpit · naloga ${topic.exam[1]}</a>` : ""}</div>`;
  }

  function demo(type) {
    const isEuler = type === "euler";
    return `<div class="easy-demo" data-easy-demo="${type}"><label>${isEuler ? "Število Eulerjevih korakov do x=1" : "Korak h pri odvodu x³ v x=1"}<input type="range" min="${isEuler ? 1 : 10}" max="${isEuler ? 20 : 80}" value="${isEuler ? 4 : 40}" data-easy-slider="${type}"></label><div class="easy-demo-plot" aria-live="polite"></div></div>`;
  }

  function card(topic, index) {
    const official = topic.official.map(number => window.NUM2_ORAL.find(item => item.number === number));
    return `<article class="easy-card" id="easy-${topic.id}">
      <header><span class="eyebrow">${index + 1} · ${topic.priority}</span><h2>${topic.title}</h2><p class="easy-question">»${topic.question}«</p></header>
      <details class="easy-answer" open><summary>Odgovor, formula in predstava</summary>
        <div class="easy-speech"><h3>Tako poveš na ustnem</h3>${topic.speech.map(p => `<p>${p}</p>`).join("")}</div>
        <div class="easy-formulas"><h3>Osnovni zapis · kaj pomeni</h3>${topic.formulas.map(f => `${panel(f.tex, f.tex, "na tablo")}<p>${f.meaning}</p>`).join("")}</div>
        <div class="easy-imagine"><h3>Kaj si predstavljaš in pokažeš</h3><p>${topic.imagine}</p>${topic.demo ? demo(topic.demo) : topic.visual ? window.NUM2_VISUALS[topic.visual]() : ""}</div>
        <aside class="easy-example"><h3>En primer, da ostane v glavi</h3><p>${topic.example}</p></aside>
        <div class="easy-followups"><h3>Če vpraša še »zakaj?«</h3>${topic.followups.map(item => `<details><summary>${item.q}</summary><p>${item.a}</p></details>`).join("")}</div>
        ${topic.supplement ? '<p class="easy-source-note">Osnovni dodatek po 4. zapisu kolegov. Priloženo profesorjevo gradivo metodo le omeni, dodatna teorija jo poveže z normo L². Zgornja razlaga normalnih enačb dopolnjuje ta omembi.</p>' : ""}
        ${sources(topic)}
        <div class="easy-full-links">${official.map(item => `<a href="#/ustni/${item.id}">Celoten odgovor ${item.number}: ${item.title} →</a>`).join("")}</div>
      </details>
    </article>`;
  }

  function render() {
    return `<div class="easy-page">
      <header class="easy-hero"><span class="eyebrow">Tvoja izpita + vseh 5 zapisov kolegov</span><h1>Na izi za ustni.</h1><p class="lede">Najprej povej, kaj metoda dela. Napiši osnovno formulo, razloži simbole in pokaži idejo na skici. Spodaj so kratki odgovori, kot bi jih povedal profesorju.</p><div class="hero-actions"><a class="primary-button" href="#/na-izi/euler">Začni pri Eulerju in RK</a><a class="secondary-button" href="#/na-izi/bezier">Bézier → integriranje (5. zapis)</a><button class="secondary-button" type="button" data-easy-cover>Pokrij vse odgovore</button></div></header>
      <section class="easy-priorities"><h2>Kaj najprej glede na tvoje točke</h2><p>V vsaki nalogi je bilo možnih 20 točk. Najprej utrdi odvajanje in diferencialne enačbe, nato Bézierjeve krivulje. Integriranje dodatno ponovi zaradi 1., 4. in 5. zapisa kolegov.</p><div class="easy-table-wrap"><table><thead><tr><th>Naloga</th><th>Tema</th><th>1. izpit</th><th>2. izpit</th></tr></thead><tbody>${exams.map(row => `<tr><th>${row.n}</th><td><a href="#/na-izi/${row.target}">${row.title}</a></td><td>${row.first}/20</td><td>${row.second}/20</td></tr>`).join("")}</tbody></table></div><p class="easy-source-note">To je vrstni red za tvojo pripravo, ne napoved vprašanj. Po izkušnjah kolegov profesor pogleda pisni izpit; ni potrjeno pravilo, da vedno vpraša najslabšo nalogo.</p><div class="easy-sources"><a href="../moje%20tocke.txt" target="_blank" rel="noopener">Tvoje zapisane točke</a><a href="../apm_nm2_i1_2526.pdf" target="_blank" rel="noopener">1. izpit · 19. 6. 2026</a><a href="../apm_nm2_i2_2526.pdf" target="_blank" rel="noopener">2. izpit · 1. 7. 2026</a></div></section>
      <section class="easy-reports"><h2>Vprašanja kolegov: vseh 5 zapisov je pokritih</h2><p>Številke 1–5 so zapisi izkušenj, ne številke uradnih vprašanj. V uradnem seznamu so štiri poglavja in skupaj 13 tem.</p><div>${reports.map(report => `<article><b>${report.n}</b><div><p>${report.text}</p><nav aria-label="Teme ${report.n}. zapisa">${report.ids.map(jump).join("")}</nav></div></article>`).join("")}</div><a href="../Izpit%20do%20zdej%20uprasanja.txt" target="_blank" rel="noopener">Odpri izvirne zapise kolegov ↗</a></section>
      <details class="easy-reading-note"><summary>Kako uporabiti novo dodatno teorijo</summary><p>Odgovori so preverjeni ob profesorjevem gradivu in tvoji dodatni teoriji. Povezavi pod temo odpreta ustrezni strani. Pri ustnem najprej povej kratek odgovor; podvprašanja in celoten uradni odgovor odpri za nadaljevanje.</p><p>Dve pomembni pojasnili: pri kubičnih zlepkih moraš ločiti C¹ in C². A-stabilnost implicitnega Eulerja pomeni stabilno dušenje testne enačbe za Re λ&lt;0 pri vsakem h&gt;0; ne pomeni, da je približek točen pri poljubnem koraku. Za natančnost še vedno gledamo napako.</p><a href="../Teorija_260810_181347.pdf" target="_blank" rel="noopener">Dodatna teorija · 24 strani ↗</a></details>
      <nav class="easy-jumps" aria-label="Kazalo kratkih odgovorov">${topics.map((topic, i) => `<a href="#/na-izi/${topic.id}"><b>${i + 1}</b>${topic.title}</a>`).join("")}</nav>
      <div class="easy-cards">${topics.map(card).join("")}</div>
      <footer class="easy-end"><p>Preveri se: brez gledanja povej idejo, napiši glavno formulo in razloži vsak njen simbol. Nato odgovori še na eno vprašanje »zakaj?«.</p><a class="secondary-button" href="#/ustni">Vseh 13 uradnih vprašanj z izpeljavami →</a></footer>
    </div>`;
  }

  function drawDemo(container) {
    const slider = container.querySelector("input");
    const type = container.dataset.easyDemo;
    const X = x => 45 + x * (type === "euler" ? 540 : 275);
    const Y = y => 235 - y * (type === "euler" ? 70 : 34);
    const point = (x, y) => `${X(x).toFixed(2)},${Y(y).toFixed(2)}`;
    const curve = (fn, end) => Array.from({ length: 101 }, (_, i) => point(i * end / 100, fn(i * end / 100))).join(" ");
    let plot, explanation;
    if (type === "euler") {
      const n = Number(slider.value), h = 1 / n;
      slider.setAttribute("aria-valuetext", `${n} korakov`);
      const approximation = Array.from({ length: n + 1 }, (_, i) => point(i * h, (1 + h) ** i)).join(" ");
      plot = `<polyline points="${curve(Math.exp, 1)}" class="easy-exact"/><polyline points="${approximation}" class="easy-estimate"/>`;
      explanation = `y′=y, y(0)=1 · ${n} korakov · h=${h.toFixed(3)}. Euler: y(1) ≈ ${((1 + h) ** n).toFixed(4)}; točno e ≈ 2,7183. Napaka: ${(Math.E - (1 + h) ** n).toFixed(4)}.`;
    } else {
      const h = Number(slider.value) / 100;
      slider.setAttribute("aria-valuetext", `h = ${h.toFixed(2)}`);
      plot = `<polyline points="${curve(x => x ** 3, 1.8)}" class="easy-exact"/><line x1="${X(0.6)}" y1="${Y(-0.2)}" x2="${X(1.5)}" y2="${Y(2.5)}" class="easy-tangent"/><polyline points="${point(1 - h, (1 - h) ** 3)} ${point(1 + h, (1 + h) ** 3)}" class="easy-estimate"/><circle cx="${X(1)}" cy="${Y(1)}" r="5" fill="var(--ink)"/>`;
      explanation = `f(x)=x³, x=1 · h=${h.toFixed(2)}. Naklon tangente: 3. Prema: ${(3 + 3 * h + h * h).toFixed(4)}; obratna: ${(3 - 3 * h + h * h).toFixed(4)}; simetrična (oranžna sekanta): ${(3 + h * h).toFixed(4)}.`;
    }
    container.querySelector(".easy-demo-plot").innerHTML = `<svg viewBox="0 0 640 280" role="img" aria-label="${type === "euler" ? "Točna rešitev in Eulerjeva lomljenka" : "Graf kubične funkcije, tangenta in simetrična sekanta"}"><path d="M35 235H610M45 250V20" class="easy-axis"/>${plot}<text x="600" y="257">x</text><text x="22" y="25">y</text></svg><p>${explanation}</p><small>Modra: ${type === "euler" ? "točna rešitev" : "graf funkcije"}. Oranžna: ${type === "euler" ? "Eulerjev približek" : "simetrična sekanta"}.${type === "difference" ? " Črtkano: tangenta." : ""}</small>`;
  }

  function bind(root, target) {
    root.querySelectorAll("[data-easy-demo]").forEach(drawDemo);
    root.querySelectorAll("[data-easy-slider]").forEach(slider => slider.addEventListener("input", () => drawDemo(slider.closest("[data-easy-demo]"))));
    root.querySelector("[data-easy-cover]").addEventListener("click", event => {
      const answers = [...root.querySelectorAll(".easy-answer")];
      const cover = answers.some(answer => answer.open);
      answers.forEach(answer => { answer.open = !cover; });
      event.currentTarget.textContent = cover ? "Odkrij vse odgovore" : "Pokrij vse odgovore";
    });
    const scrollToTopic = id => {
      root.classList.remove("view-enter");
      document.getElementById(`easy-${id}`).scrollIntoView({ block: "start", behavior: "instant" });
    };
    root.querySelectorAll('a[href^="#/na-izi/"]').forEach(link => link.addEventListener("click", event => {
      if (link.getAttribute("href") !== location.hash) return;
      event.preventDefault();
      scrollToTopic(link.getAttribute("href").split("/")[2]);
    }));
    if (target && byId.has(target)) requestAnimationFrame(() => scrollToTopic(target));
  }

  window.NUM2_EASY = { topics, reports, exams, render, bind };
})();
