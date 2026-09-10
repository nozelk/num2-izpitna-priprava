(() => {
  "use strict";

  const V = window.NUM2_VISUALS;
  const F = (tex, explain, fallback = tex) => ({ tex, fallback, explain });
  const N = (tex, symbol, meaning) => ({ tex, symbol, meaning });
  const A = (title, detail, watch = "") => ({ title, detail, watch });
  const E = (prompt, work, answer) => ({ prompt, work, answer });

  const methods = [
    {
      id: "aproksimacija",
      accent: "#c8ff3d",
      eyebrow: "Osnovna ideja predmeta",
      title: "Aproksimacijski problem",
      use: "Ko funkcije ne moremo ali nočemo obravnavati neposredno, jo nadomestimo z enostavnejšim elementom iz izbranega prostora.",
      minutes: 7,
      trigger: ["najboljši približek", "norma napake", "Bernstein", "Weierstrass"],
      spoken: {
        question: "Kaj sploh pomeni aproksimirati funkcijo?",
        answer: [
          "Imamo funkcijo f in vnaprej izbran prostor preprostejših funkcij Y, na primer polinome stopnje največ n. Med vsemi g iz Y iščemo takega, da je napaka med f in g čim manjša v izbrani normi.",
          "Norma pove, kaj razumemo kot majhno napako. Pri enakomerni normi gledamo najslabšo točko intervala. Element najboljše aproksimacije zato minimizira največji absolutni odklon."
        ],
        anatomy: [
          { label: "Podatek", text: "funkcija f, interval in aproksimacijski prostor Y" },
          { label: "Neznanka", text: "približek g* ∈ Y" },
          { label: "Merilo", text: "izbrana norma ‖f−g‖" },
          { label: "Rezultat", text: "najmanjša dosegljiva napaka dist(f,Y)" }
        ]
      },
      visual: {
        title: "Funkcija, približek in residual",
        lead: "Zelena krivulja je podana funkcija, modra pa približek. Navpična razlika je residual e(x).",
        diagram: V.approximation(),
        formulas: [
          F("\\operatorname{dist}(f,Y)=\\inf_{g\\in Y}\\lVert f-g\\rVert", "Najmanjša napaka, ki jo prostor Y sploh dopušča."),
          F("\\lVert f-g\\rVert_\\infty=\\max_{x\\in[a,b]}|f(x)-g(x)|", "V enakomerni normi odloča najslabša točka.")
        ],
        callouts: [
          { label: "Ne zamenjaj", text: "Interpolant mora zadeti izbrane točke; najboljša aproksimacija mora biti dobra na celotnem intervalu." },
          { label: "Povezava", text: "Če lokalni polinom odvajamo, dobimo diference; če ga integriramo, dobimo kvadrature." }
        ]
      },
      notation: [
        N("f", "f", "funkcija, ki jo želimo približati"),
        N("Y\\subseteq X", "Y ⊆ X", "izbrani prostor približkov"),
        N("g^*", "g*", "element najboljše aproksimacije"),
        N("e=f-g", "e=f−g", "residual oziroma funkcija napake"),
        N("\\lVert\\cdot\\rVert_\\infty", "‖·‖∞", "največja absolutna vrednost na intervalu"),
        N("P_n", "Pₙ", "polinomi stopnje največ n; to je oznaka iz gradiva")
      ],
      basic: F("g^*\\in Y:\\quad \\lVert f-g^*\\rVert\\le \\lVert f-g\\rVert\\quad\\forall g\\in Y", "To je natančna definicija najboljšega približka."),
      advanced: F("B_nf(x)=\\sum_{i=0}^{n}f(i/n)\\binom ni x^i(1-x)^{n-i},\\quad f\\in C[0,1],\\ x\\in[0,1]", "Bernsteinov operator je tu zapisan na [0,1]; splošni interval najprej afino preslikamo."),
      algorithm: [
        A("Izberi prostor", "Povej, ali iščeš konstanto, premico, polinom stopnje n ali zlepek.", "Koliko koeficientov je neznanih?"),
        A("Izberi normo", "Norma določa pojem optimalnosti: maksimum, vsota ali evklidska napaka.", "Ali naloga govori o najslabšem odklonu?"),
        A("Zapiši residual", "Vedno najprej definiraj e=f−g in šele nato optimizacijski pogoj.", "Predznak residuala ohrani do konca."),
        A("Preveri certifikat", "Pri minimaksu je certifikat alterniranje; pri drugih normah so pogoji drugačni.", "Ne razglasi kandidata za najboljšega brez razloga.")
      ],
      watch: ["prostor Y mora biti naveden", "norma mora biti navedena", "infimum ni nujno avtomatsko dosežen", "Bernsteinove uteži imajo vsoto 1"],
      easy: E("Na treh točkah so napake kandidata 0,1; −0,3; 0,2. Kolikšna je diskretna ∞-napaka?", ["Vzemi absolutne vrednosti: 0,1; 0,3; 0,2.", "Izberi največjo."], "\\(\\lVert e\\rVert_{\\infty,h}=0{,}3\\)."),
      hard: E("Zakaj iz \\(B_i^n(x)\\ge0\\) in \\(\\sum_iB_i^n(x)=1\\) sledi, da je \\(B_nf(x)\\) med najmanjšo in največjo vzorčno vrednostjo?", ["Koeficienti so nenegativne uteži.", "Njihova vsota je 1, zato je vsota konveksna kombinacija."], "\\(\\min_i f(i/n)\\le B_nf(x)\\le\\max_i f(i/n)\\)."),
      oral: ["Povej podatke, neznanko in normo.", "Definiraj residual.", "Razlikuj interpolacijo od najboljše aproksimacije.", "Poveži polinomsko aproksimacijo z nadaljnjimi metodami."],
      pitfall: "Diskretni maksimum na vzorčnih točkah še ni nujno maksimum na celotnem intervalu."
    },
    {
      id: "remes",
      accent: "#ffbf69",
      eyebrow: "Izpitni sklop A / zelo pogosto",
      title: "Remes in alterniranje",
      use: "Za najboljšo enakomerno polinomsko aproksimacijo na končni množici ali intervalu.",
      minutes: 20,
      trigger: ["minimax", "n+2 točk", "izmenični predznaki", "najboljša premica/parabola"],
      spoken: {
        question: "Kako deluje Remesov postopek in kako vemo, da smo končali?",
        answer: [
          "Za polinom stopnje n izberemo n+2 točk. Koeficiente polinoma in skupno velikost napake m določimo tako, da residual na teh točkah izmenično dosega +m in −m.",
          "Nato na celotnem intervalu poiščemo največjo absolutno napako. Če ni večja od |m| do tolerance, alternacijski izrek potrdi optimalnost. Sicer novo ekstremno točko vstavimo v množico in eno staro odstranimo tako, da alterniranje ostane ohranjeno."
        ],
        anatomy: [
          { label: "n+1", text: "koeficientov polinoma stopnje n" },
          { label: "+1", text: "dodatna neznanka m" },
          { label: "n+2", text: "enačb v alternirajočih točkah" },
          { label: "Certifikat", text: "n+2 ekstremov enake velikosti z menjavo predznaka" }
        ]
      },
      visual: {
        title: "Residual se dotika dveh vodoravnih mej",
        lead: "Točke morajo biti urejene, napaka pa v njih alternira. Samo enako velike napake brez menjave predznaka niso dovolj.",
        diagram: V.remez(),
        formulas: [
          F("f(x_i)-p(x_i)=(-1)^i m,\\quad i=0,\\ldots,n+1", "Sistem določi koeficiente polinoma in m."),
          F("\\lVert f-p\\rVert_\\infty=|m|", "Ko to velja na celotnem intervalu, imamo certifikat optimalnosti.")
        ],
        callouts: [
          { label: "Čebišev", text: "Če je residual natanko αTₙ₊₁, alterniranje dobimo neposredno." },
          { label: "Omejitev trika", text: "Odrez najvišjega Čebiševega člena velja za obliko pₙ+αTₙ₊₁; ni univerzalno pravilo za več višjih členov." }
        ]
      },
      notation: [
        N("E_k=\\{x_0,\\ldots,x_{n+1}\\}", "Eₖ", "trenutna množica alternirajočih točk"),
        N("p\\in P_n", "p ∈ Pₙ", "iskani polinom stopnje največ n"),
        N("m", "m", "podpisana velikost napake na točkah Eₖ"),
        N("r=f-p", "r=f−p", "residual"),
        N("\\varepsilon", "ε", "ustavitvena toleranca"),
        N("T_n(x)=\\cos(n\\arccos x)", "Tₙ", "Čebišev polinom na [−1,1]")
      ],
      basic: F("\\begin{bmatrix}1&1&x_0&\\cdots&x_0^n\\\\-1&1&x_1&\\cdots&x_1^n\\\\\\vdots&\\vdots&\\vdots&&\\vdots\\\\(-1)^{n+1}&1&x_{n+1}&\\cdots&x_{n+1}^n\\end{bmatrix}\\begin{bmatrix}m\\\\a_0\\\\\\vdots\\\\a_n\\end{bmatrix}=\\begin{bmatrix}f(x_0)\\\\f(x_1)\\\\\\vdots\\\\f(x_{n+1})\\end{bmatrix}", "Prvi stolpec kodira alterniranje, preostali pa vrednosti monomov."),
      advanced: F("p^*\\text{ najboljši}\\iff\\exists x_0<\\cdots<x_{n+1}:\\ r(x_i)=(-1)^i\\sigma\\lVert r\\rVert_\\infty", "Alternacijski izrek je ustavitveni certifikat, ne le opis algoritma."),
      algorithm: [
        A("Izberi n+2 točk", "Za premico potrebuješ 3, za parabolo 4 točke.", "Točke uredi naraščajoče."),
        A("Sestavi sistem", "V vsaki vrstici napiši p(xᵢ)+(−1)ⁱm=f(xᵢ).", "Predznak m naj se strogo menja."),
        A("Reši za m in koeficiente", "Dobiš kandidata p in napako na izbrani množici.", "Preveri vse enačbe z vstavljanjem."),
        A("Poišči pravi maksimum", "Analiziraj |f−p| tudi med izbranimi točkami.", "Na intervalu preveri krajišča in stacionarne točke residuala."),
        A("Zamenjaj točko ali končaj", "Če je nov ekstrem večji, ga vstavi in ohrani alterniranje.", "Če max|r|=|m|, je kandidat optimalen.")
      ],
      watch: ["n+2 enačb za n+2 neznank", "urejenost točk", "menjava predznaka", "preverjanje intervala, ne le začetne množice"],
      easy: E("Poišči najboljšo konstanto za podatke f(0)=1 in f(1)=5 v ∞-normi.", ["Zahtevaj 1−a=m in 5−a=−m ali obratno.", "Seštej enačbi: 6−2a=0."], "\\(a=3\\), največja napaka je \\(2\\)."),
      hard: E("Za najboljšo premico na treh točkah zapiši sistem brez računanja.", ["Naj bo p(x)=a₀+a₁x.", "Za x₀<x₁<x₂ napiši tri izmenične enačbe."], "\\(a_0+a_1x_i+(-1)^im=f(x_i),\\ i=0,1,2\\). Nato še preveri intervalno normo."),
      oral: ["Za stopnjo n potrebujemo n+2 alternirajočih ekstremov.", "m je dodatna neznanka in velikost minimaks napake.", "Po rešitvi sistema preverimo največji residual na celotnem območju.", "Alternacijski izrek da nujen in zadosten pogoj optimalnosti."],
      pitfall: "Rešitev Remesovega sistema je optimalna na izbranih točkah, ne avtomatsko tudi na vsem intervalu."
    },
    {
      id: "zlepki",
      accent: "#a8f0d2",
      eyebrow: "Rezervni sklop A / povezava z Bézierjem",
      title: "Polinomski zlepki",
      use: "Ko en sam globalni polinom ni primeren, interval razdelimo in na vsakem delu uporabimo svoj polinom.",
      minutes: 15,
      trigger: ["odsekoma", "C⁰/C¹/C²", "robni pogoji", "tridiagonalni sistem"],
      spoken: {
        question: "Kaj je zlepek in kako ga določimo?",
        answer: [
          "Zlepek je odsekoma polinomska funkcija. Na vsakem podintervalu ima svoj polinom, v notranjih vozliščih pa zahtevamo ujemanje vrednosti in po potrebi odvodov.",
          "Najprej preštejem koeficiente vseh kosov. Nato napišem interpolacijske pogoje, pogoje C^r v stikih in manjkajoče robne pogoje. Tako dobim linearni sistem za koeficiente ali vozliščne odvode."
        ],
        anatomy: [
          { label: "Lokalno", text: "vsak kos je polinom stopnje največ n" },
          { label: "Globalno", text: "v vozliščih se ujemajo odvodi do reda r" },
          { label: "Sistem", text: "interpolacija + gladkost + robni pogoji" },
          { label: "Prednost", text: "lokalna sprememba brez oscilacij visokega globalnega polinoma" }
        ]
      },
      visual: {
        title: "Več kosov, en gladek graf",
        lead: "Točke stika niso le interpolacijske točke: v njih nadzorujemo tudi tangento in ukrivljenost.",
        diagram: V.splines(),
        formulas: [
          F("S_n^r(X)=\\{s\\in C^r[a,b]:s|_{[x_{i-1},x_i]}\\in P_n\\}", "Spodnji indeks je stopnja kosov, zgornji red gladkosti."),
          F("\\dim S_n^r=m(n+1)-(m-1)(r+1)=mn-(m-1)r+1", "Za m nepraznih kosov in 0≤r<n: koeficienti vseh kosov minus pogoji v notranjih stikih.")
        ],
        callouts: [
          { label: "C⁰", text: "leva in desna vrednost sta enaki" },
          { label: "C¹/C²", text: "ujemata se še prva oziroma prva in druga odvoda" }
        ]
      },
      notation: [
        N("X=\\{x_0,\\ldots,x_m\\}", "X", "mreža oziroma vozlišča"),
        N("S_n^r(X)", "S⁽ʳ⁾ₙ(X)", "zlepki stopnje n in gladkosti r"),
        N("s_i=s|_{[x_{i-1},x_i]}", "sᵢ", "lokalni polinomski kos"),
        N("h_i=x_{i+1}-x_i", "hᵢ", "dolžina podintervala"),
        N("C^r", "Cʳ", "zvezni odvodi do vključno reda r"),
        N("d_i=s'(x_i)", "dᵢ", "vozliščni naklon")
      ],
      basic: F("s_{i-1}^{(j)}(x_i)=s_i^{(j)}(x_i),\\qquad j=0,\\ldots,r", "To je popoln zapis gladkosti v vsakem notranjem vozlišču."),
      advanced: F("f-I_3^1f=\\frac{f^{(4)}(\\xi)}{4!}(x-x_{i-1})^2(x-x_i)^2", "Hermitov kubični zlepek ima lokalno napako reda h⁴."),
      algorithm: [
        A("Napiši vsak kos", "Za kubični kos uporabi štiri koeficiente.", "Skupaj preštej vse neznanke."),
        A("Interpolacija", "Vstavi vrednosti v levi in desni rob vsakega kosa.", "Ista vozliščna vrednost nastopa na obeh sosednjih kosih."),
        A("Gladkost", "Za C¹ enači prva, za C² tudi druga odvoda.", "Odvajaj vsak lokalni predpis posebej."),
        A("Robna pogoja", "Naravni, vpeti ali drugače podani pogoji zaprejo sistem.", "Preveri, ali imaš toliko enačb kot neznank.")
      ],
      watch: ["lokalna koordinata x−xᵢ zmanjša napake", "C¹ ne pomeni C²", "robni pogoji niso poljubni", "v Hermitovem ostanku sta faktorja kvadrirana"],
      easy: E("Za dva linearna kosa preveri C⁰ v x=1.", ["Izračunaj levo vrednost s₁(1).", "Izračunaj desno vrednost s₂(1).", "Primerjaj ju."], "Zlepek je C⁰ natanko tedaj, ko je \\(s_1(1)=s_2(1)\\)."),
      hard: E("Dokaži konstanto 1/384 v oceni kubičnega Hermitovega zlepka na intervalu dolžine h.", ["Uporabi Hermitov ostanek z deliteljem 4!.", "Naj bo t=(x−a)/h; produkt je h⁴t²(1−t)².", "Maksimum t²(1−t)² na [0,1] je 1/16."], "\\(h^4/(4!\\cdot16)=h^4/384\\)."),
      oral: ["Zlepek je odsekoma polinomski.", "C^r pomeni ujemanje vseh odvodov do reda r.", "Sistem sestavijo interpolacijski, stični in robni pogoji.", "Hermitov kubični zlepek ima napako O(h⁴)."],
      pitfall: "Kvadratični C¹ interpolacijski zlepek potrebuje še en robni pogoj — lahko začetni ali končni odvod oziroma drug podan pogoj. Ne izberi ga brez razloga kot sekanto."
    },
    {
      id: "bezier",
      accent: "#6fe8ff",
      eyebrow: "Izpitni sklop B / na vseh novih izpitih",
      title: "Bézier in de Casteljau",
      use: "Za stabilno računanje in geometrijsko razumevanje parametričnih polinomskih krivulj.",
      minutes: 25,
      trigger: ["kontrolne točke", "Bernsteinova baza", "de Casteljau", "konveksna ovojnica"],
      spoken: {
        question: "Kaj je Bézierjeva krivulja in kako izračunamo njeno točko?",
        answer: [
          "Bézierjeva krivulja je polinom v Bernsteinovi bazi, njeni koeficienti pa so vektorji oziroma kontrolne točke. Ker so Bernsteinove bazne funkcije nenegativne in imajo vsoto ena, krivulja leži v konveksni ovojnici kontrolnih točk.",
          "Točko pri parametru t izračunam z de Casteljaujevim postopkom: zaporedoma linearno interpoliram sosednje kontrolne točke z utežema 1−t in t, dokler ne ostane ena točka."
        ],
        anatomy: [
          { label: "bᵢ", text: "kontrolne točke v ℝᵈ" },
          { label: "Bᵢⁿ(t)", text: "Bernsteinove uteži" },
          { label: "t", text: "parameter med 0 in 1" },
          { label: "b⁽ⁿ⁾₀", text: "končna točka de Casteljaujevega trikotnika" }
        ]
      },
      visual: {
        title: "Kontrolni poligon ni krivulja",
        lead: "Krivulja se začne v b₀, konča v bₙ in ostane znotraj osenčene konveksne ovojnice.",
        diagram: V.bezier(),
        formulas: [
          F("b(t)=\\sum_{i=0}^{n}b_iB_i^n(t),\\quad B_i^n(t)=\\binom ni t^i(1-t)^{n-i}", "Kontrolne točke so vektorski koeficienti Bernsteinove baze."),
          F("b_i^{(r)}=(1-t)b_i^{(r-1)}+tb_{i+1}^{(r-1)}", "Vsaka nova vrstica de Casteljauja ima eno točko manj.")
        ],
        callouts: [
          { label: "Ovira", text: "Če je ovojnica disjunktna z oviro, krivulja zagotovo ne trči." },
          { label: "Pozor", text: "Če se ovojnica in ovira sekata, o krivulji še ne moremo sklepati ničesar." }
        ]
      },
      notation: [
        N("b_i\\in\\mathbb R^d", "bᵢ", "kontrolna točka"),
        N("B_i^n(t)", "Bᵢⁿ(t)", "i-ta Bernsteinova bazna funkcija stopnje n"),
        N("b_i^{(r)}", "bᵢ⁽ʳ⁾", "točka v r-ti vrstici de Casteljauja"),
        N("\\operatorname{conv}\\{b_0,\\ldots,b_n\\}", "conv{bᵢ}", "konveksna ovojnica"),
        N("\\Delta b_i=b_{i+1}-b_i", "Δbᵢ", "prva kontrolna razlika"),
        N("\\Phi(x)=Ax+v", "Φ", "afina preslikava")
      ],
      basic: F("b_i^{(0)}=b_i,\\qquad b_i^{(r)}=(1-t)b_i^{(r-1)}+tb_{i+1}^{(r-1)}", "Za r=1,…,n; iskana točka je b₀⁽ⁿ⁾."),
      advanced: F("b'(t)=n\\sum_{i=0}^{n-1}(b_{i+1}-b_i)B_i^{n-1}(t)", "Odvod je Bézier stopnje n−1 s kontrolnimi točkami nΔbᵢ."),
      algorithm: [
        A("Vrstica 0", "Prepiši vse kontrolne točke b₀,…,bₙ.", "Ne mešaj koordinat različnih točk."),
        A("Linearna interpolacija", "Vsak nov element je (1−t)·levi+t·desni.", "Pri t=1/2 samo povprečiš."),
        A("Ponavljaj", "Nadaljuj, dokler ne ostane b₀⁽ⁿ⁾.", "Število elementov pada n+1,n,…,1."),
        A("Izkoristi trikotnik", "Vmesne diagonale so kontrolni poligoni obeh podkrivulj.", "Iz iste sheme dobiš tudi subdivision.")
      ],
      watch: ["Bernsteinove uteži so nenegativne", "vsota uteži je 1", "afino preslikavo uporabiš na kontrolnih točkah", "odvod vsebuje faktor n"],
      easy: E("Kvadratni Bézier ima b₀=(0,0), b₁=(2,2), b₂=(4,0). Izračunaj b(1/2).", ["Prva vrstica: (1,1) in (3,1).", "Druga vrstica: povprečje (2,1)."], "\\(b(1/2)=(2,1)\\)."),
      hard: E("Kako iz konveksne ovojnice pravilno izključiš trk s krožno oviro?", ["Sestavi konveksno ovojnico vseh kontrolnih točk.", "Preveri njen presek s krogom.", "Le prazen presek je dovolj močan certifikat."], "Če je \\(\\operatorname{conv}\\{b_i\\}\\cap K=\\varnothing\\), potem \\(b([0,1])\\cap K=\\varnothing\\). Obrat ne velja."),
      oral: ["Definicija je polinom v Bernsteinovi bazi.", "Nenegativnost in particija enote dasta konveksno ovojnico.", "De Casteljau ponavlja linearne interpolacije.", "Odvod ima kontrolne točke n(bᵢ₊₁−bᵢ)."],
      pitfall: "Presek ovire s konveksno ovojnico ne pomeni, da krivulja trči; pomeni samo, da test ni odločilen."
    },
    {
      id: "bezier-stiki",
      accent: "#c7a7ff",
      eyebrow: "Izpitni sklop B / težji del",
      title: "Bézierjevi odvodi in stiki",
      use: "Za rekonstrukcijo kontrolnih točk, tangent ter C⁰, C¹, C² ali G¹ lepljenje dveh odsekov.",
      minutes: 15,
      trigger: ["stik dveh krivulj", "reparametrizacija", "tangenta", "C¹/C²/G¹"],
      spoken: {
        question: "Kako preverimo gladek stik dveh Bézierjevih krivulj?",
        answer: [
          "Najprej zahtevam, da se konec prve in začetek druge krivulje ujemata. To je C⁰. Nato zapišem krajiščna odvoda. Za C¹ morata biti po upoštevanju hitrosti reparametrizacije enaka tudi vektorja hitrosti.",
          "Za G¹ zahtevam samo isto smer, torej pozitivno sorazmernost tangent. Za C² poleg prvih primerjam tudi druge odvode; pri linearni reparametrizaciji nastopi kvadrat faktorja spremembe parametra."
        ],
        anatomy: [
          { label: "Položaj", text: "cₙ=d₀" },
          { label: "Hitrost", text: "n(cₙ−cₙ₋₁) in m(d₁−d₀)" },
          { label: "Parameter", text: "odvod se množi s φ′" },
          { label: "Ukrivljenost", text: "drugi odvod in faktor (φ′)²" }
        ]
      },
      visual: {
        title: "Enaka točka še ni gladek stik",
        lead: "Za C¹ morajo biti kontrolni robovi kolinearni, pravilno usmerjeni in po parametrizaciji tudi pravilno dolgi.",
        diagram: V.bezierJoin(),
        formulas: [
          F("c_n=d_0,\\qquad \\frac{n(c_n-c_{n-1})}{\\Delta u_L}=\\frac{m(d_1-d_0)}{\\Delta u_R}", "Splošni C¹ pogoj: oba lokalna parametra [0,1] afino preslikamo na fizična intervala dolžin ΔuL in ΔuR, zato je φ′=1/Δu."),
          F("\\frac{n(n-1)\\Delta^2c_{n-2}}{(\\Delta u_L)^2}=\\frac{m(m-1)\\Delta^2d_0}{(\\Delta u_R)^2}", "Skupaj s C⁰ in C¹ ta dodatna enačba da C² stik.")
        ],
        callouts: [
          { label: "C¹", text: "ista tangenta in ista parametrizacijska hitrost" },
          { label: "G¹", text: "ista geometrijska smer, dovolj je pozitiven faktor α" }
        ]
      },
      notation: [
        N("c_0,\\ldots,c_n", "cᵢ", "kontrolne točke prve krivulje"),
        N("d_0,\\ldots,d_m", "dᵢ", "kontrolne točke druge krivulje"),
        N("\\Delta u_L,\\Delta u_R", "ΔuL, ΔuR", "dolžini parametričnih intervalov"),
        N("G^1", "G¹", "geometrijska zveznost tangentne smeri"),
        N("\\Delta^2c_i=c_{i+2}-2c_{i+1}+c_i", "Δ²cᵢ", "druga kontrolna razlika"),
        N("\\alpha>0", "α>0", "pozitivni faktor pri G¹")
      ],
      basic: F("b'(0)=n(b_1-b_0),\\qquad b'(1)=n(b_n-b_{n-1})", "Krajiščni tangenti prebereš neposredno iz prvega in zadnjega roba kontrolnega poligona."),
      advanced: F("(b\\circ\\phi)'=b'(\\phi)\\phi',\\qquad(b\\circ\\phi)''=b''(\\phi)(\\phi')^2+b'(\\phi)\\phi''", "Za linearno φ je φ″=0, faktor drugega odvoda pa je (φ′)²."),
      algorithm: [
        A("Izračunaj krajiščni položaj", "Postavi cₙ=d₀.", "Brez C⁰ ni višje gladkosti."),
        A("Napiši oba odvoda", "Vključi faktor stopnje n oziroma m.", "Če sta intervala različna, deli še z Δu."),
        A("Izberi vrsto stika", "C¹ zahteva enačbo vektorjev, G¹ pozitivno sorazmernost.", "Negativen faktor obrne smer in naredi špico."),
        A("Za C² dodaj druge razlike", "Uporabi n(n−1)Δ² in kvadrat reparametrizacijskega faktorja.", "Ne uporabi C¹ formule še enkrat.")
      ],
      watch: ["faktor stopnje", "faktor reparametrizacije", "pozitivnost pri G¹", "C² uporablja druge kontrolne razlike"],
      easy: E("Kubični Bézier se konča v c₃=(4,1), c₂=(3,1). Kateri začetni rob kvadratnega d zagotovi C¹ brez reparametrizacije?", ["Prvi odvod prvega je 3(c₃−c₂)=(3,0).", "Za kvadratnega je 2(d₁−d₀).", "Postavi d₀=c₃ in reši."], "\\(d_1-d_0=(3/2,0)\\), torej \\(d_1=(11/2,1)\\)."),
      hard: E("Zakaj pri linearni reparametrizaciji v C² pogoju nastopi kvadrat merila?", ["Enkrat uporabi verižno pravilo za prvi odvod.", "Odvajaj še enkrat.", "Ker je φ linearna, je φ″=0."], "Ostane \\((b\\circ\\phi)''=b''(\\phi)(\\phi')^2\\)."),
      oral: ["C⁰ enači položaj.", "C¹ enači parametrizirani hitrosti.", "G¹ zahteva le pozitivno sorazmerni tangenti.", "C² enači še druge odvode z ustreznimi kvadrati meril."],
      pitfall: "Formula cₙ−cₙ₋₁=d₁−d₀ velja le pri enakih stopnjah in enakih parametrizacijah."
    },
    {
      id: "diference",
      accent: "#ff7a90",
      eyebrow: "Izpitni sklop C / pogosto izpeljava",
      title: "Numerično odvajanje",
      use: "Za približek odvoda iz tabeliranih vrednosti funkcije in za diskretizacijo diferencialnih enačb.",
      minutes: 20,
      trigger: ["stencil", "prema/obratna/simetrična", "največja stopnja točnosti", "ostanek"],
      spoken: {
        question: "Kako izpeljemo diferenčno formulo in njen red?",
        answer: [
          "Nastavim linearno kombinacijo razpoložljivih funkcijskih vrednosti z neznanimi utežmi. Zahtevam, da formula vrne pravi odvod za monome od konstante naprej. Tako dobim momentni sistem za uteži.",
          "Nato vrednosti razvijem v Taylorjevo vrsto okoli x₀. Členi, ki jih je sistem izničil, odpadejo; prvi preostali člen določi vodilni člen napake in red formule."
        ],
        anatomy: [
          { label: "Stencil", text: "točke x₀+cⱼh, ki jih smemo uporabiti" },
          { label: "Uteži", text: "koeficienti aⱼ v linearni kombinaciji" },
          { label: "Eksaktnost", text: "točnost na 1,x,x²,…" },
          { label: "Red", text: "potenca h v prvem neizničenem členu" }
        ]
      },
      visual: {
        title: "Stencil postane linearni sistem",
        lead: "Geometrija točk določi momentno matriko. Simetrija pogosto avtomatsko izbriše lihe ali sode Taylorjeve člene.",
        diagram: V.stencil(),
        formulas: [
          F("f'(x_0)=\\frac{f(x_0+h)-f(x_0-h)}{2h}-\\frac{h^2}{6}f^{(3)}(\\xi)", "Simetrična formula je drugega reda."),
          F("f''(x_0)=\\frac{f(x_0-h)-2f(x_0)+f(x_0+h)}{h^2}-\\frac{h^2}{12}f^{(4)}(\\xi)", "Centralni drugi odvod je prav tako drugega reda.")
        ],
        callouts: [
          { label: "Naprej/nazaj", text: "prema in obratna diferenca sta praviloma reda 1" },
          { label: "Sredina", text: "simetrična razporeditev izbriše člen s f″ in dvigne red na 2" }
        ]
      },
      notation: [
        N("x_0", "x₀", "točka, kjer iščemo odvod"),
        N("h>0", "h", "mrežni korak"),
        N("c_j", "cⱼ", "brezdimenzijski odmik vozlišča"),
        N("a_j", "aⱼ", "neznana utež formule"),
        N("O(h^p)", "O(hᵖ)", "red asimptotične napake"),
        N("\\xi", "ξ", "vmesna točka v ostanku")
      ],
      basic: F("f'(x_0)\\approx\\sum_{j=0}^{s}a_jf(x_0+c_jh),\\quad \\sum_ja_j(c_jh)^k=\\left.\\frac{d}{dx}(x-x_0)^k\\right|_{x_0}", "Momentne enačbe dobimo z vstavljanjem monomov."),
      advanced: F("f'(x_0)=\\frac{f(x_0-2h)-8f(x_0-h)+8f(x_0+h)-f(x_0+2h)}{12h}+\\frac{h^4}{30}f^{(5)}(\\xi)", "Pettočkovna centralna formula doseže red 4."),
      algorithm: [
        A("Nariši stencil", "Označi x₀ in vse odmike cⱼh.", "Ali je razporeditev simetrična?"),
        A("Nastavi uteži", "Napiši L(f)=Σaⱼf(x₀+cⱼh).", "Dimenzije morajo ustrezati odvodu; uteži vsebujejo 1/h."),
        A("Vstavi monome", "Za k=0,1,… enači L((x−x₀)ᵏ) s pravim odvodom.", "Konstanta mora dati 0, linearna funkcija 1."),
        A("Poišči ostanek", "Vstavi Taylorjev razvoj ali naslednji monom.", "Prva neničelna potenca h je red napake."),
        A("Preveri na treh polinomih", "Tako hitro ujameš napačen predznak ali faktor.", "Vedno testiraj vsaj 1, x in x².")
      ],
      watch: ["deljenje s pravo potenco h", "predznak ostanka", "zahtevana gladkost f", "premajhen h poveča zaokrožitveno napako"],
      easy: E("Izpelji premo diferenco iz Taylorjeve formule.", ["Napiši f(x₀+h)=f(x₀)+hf′(x₀)+h²f″(ξ)/2.", "Odštej f(x₀), deli s h in preuredi."], "\\(f'(x_0)=[f(x_0+h)-f(x_0)]/h-hf''(\\xi)/2\\), zato red 1."),
      hard: E("Zakaj je simetrična diferenca bolj natančna od preme pri istem h?", ["Razvij f(x₀+h) in f(x₀−h).", "Odštej razvoja.", "Sodi členi imajo isti predznak in se odštejejo."], "Člen s f″ izgine; prvi ostane h³f⁽³⁾/3, po deljenju z 2h pa napaka O(h²)."),
      oral: ["Najprej povem stencil.", "Uteži določim iz točnosti na monomih.", "Taylorjev razvoj da ostanek in red.", "Prema/obratna sta reda 1, simetrična reda 2."],
      pitfall: "Več točk samo po sebi ne zagotovi višjega reda; uteži morajo izpolniti dodatne momentne pogoje."
    },
    {
      id: "kvadrature",
      accent: "#70d6ff",
      eyebrow: "Izpitni sklop C / ista osnova kot diference",
      title: "Numerično integriranje",
      use: "Za približek določenega integrala iz nekaj funkcijskih vrednosti, tudi ko antiderivata ne poznamo.",
      minutes: 15,
      trigger: ["uteži", "trapez/Simpson", "sestavljeno", "Romberg/Gauss"],
      spoken: {
        question: "Kako so kvadraturna pravila povezana z interpolacijo?",
        answer: [
          "Funkcijo nadomestim z interpolacijskim polinomom skozi izbrana vozlišča in ta polinom eksaktno integriram. Integrali baznih polinomov postanejo uteži pri funkcijskih vrednostih.",
          "Trapez uporablja linearni interpolant, Simpson kvadratičnega. Sestavljeno pravilo isto lokalno konstrukcijo uporabi na vseh podintervalih, zato se lokalne napake seštejejo v globalno."
        ],
        anatomy: [
          { label: "Vozlišča", text: "xᵢ, kjer poznamo f(xᵢ)" },
          { label: "Uteži", text: "wᵢ, integrali baznih funkcij" },
          { label: "Stopnja", text: "najvišji polinom, ki ga pravilo integrira točno" },
          { label: "Ostanek", text: "prvi neintegrirani člen" }
        ]
      },
      visual: {
        title: "Integral nadomestimo z uteženo vsoto višin",
        lead: "Vozlišča so mesta meritev, uteži pa povedo, koliko vsaka meritev prispeva k ploščini.",
        diagram: V.quadrature(),
        formulas: [
          F("\\int_a^bf(x)\\,dx=\\frac{b-a}{2}[f(a)+f(b)]-\\frac{(b-a)^3}{12}f''(\\xi)", "Trapezno pravilo in njegov ostanek."),
          F("\\int_a^bf(x)\\,dx=\\frac{b-a}{6}[f(a)+4f((a+b)/2)+f(b)]-\\frac{(b-a)^5}{2880}f^{(4)}(\\xi)", "Simpson je točen celo za kubične polinome.")
        ],
        callouts: [
          { label: "Sredinsko", text: "pravilen ostanek je +(b−a)³f″(ξ)/24" },
          { label: "Milne", text: "odprto pravilo ne uporablja krajišč; ostanek ima +7(b−a)⁵f⁽⁴⁾(ξ)/23040" }
        ]
      },
      notation: [
        N("x_i", "xᵢ", "kvadraturno vozlišče"),
        N("w_i", "wᵢ", "kvadraturna utež"),
        N("h=(b-a)/m", "h", "korak sestavljenega pravila"),
        N("T_h,S_h", "Tₕ, Sₕ", "sestavljeno trapezno in Simpsonovo pravilo"),
        N("\\delta", "δ", "toleranca adaptivne metode"),
        N("P_r", "Pᵣ", "prostor polinomov stopnje največ r")
      ],
      basic: F("Q(f)=\\sum_{i=0}^{n}w_if(x_i),\\qquad Q(x^k)=\\int_a^bx^k\\,dx", "Uteži določimo iz točnosti na zaporednih monomih."),
      advanced: F("T_{h/2}^{(1)}=\\frac{4T_{h/2}-T_h}{3}", "Prvi Rombergov korak z Richardsonovo ekstrapolacijo odstrani člen napake h²."),
      algorithm: [
        A("Izberi vozlišča", "Zaprto pravilo uporablja krajišča, odprto jih izpusti.", "Ali je funkcija na robu sploh definirana?"),
        A("Nastavi uteži", "Napiši Q(f)=Σwᵢf(xᵢ).", "Število neznanih uteži določa število osnovnih pogojev."),
        A("Zahtevaj polinomsko točnost", "Vstavi 1,x,x²,… in reši sistem.", "Stopnja je največji zaporedni k, za katerega enakost še velja."),
        A("Dodaj ostanek", "Uporabi interpolacijski ostanek ali Taylor.", "Predznak in konstanta sta del odgovora."),
        A("Po potrebi sestavi", "Interval razdeli in seštej lokalna pravila.", "Pri Simpsonu mora biti število podintervalov sodo.")
      ],
      watch: ["stopnja eksaktnosti ni število vozlišč", "Simpson zahteva sodo m", "lokalni in sestavljeni ostanek imata različni potenci dolžine", "Romberg predpostavlja strukturiran razvoj napake"],
      easy: E("Iz trapeznega pravila izračunaj približek ∫₀¹x²dx.", ["f(0)=0 in f(1)=1.", "Pomnoži povprečje krajišč z dolžino 1."], "\\(T=1/2\\), medtem ko je točno \\(1/3\\)."),
      hard: E("Izpelji uteži pravila Q(f)=A f(a)+B f(b), ki je točno za P₁.", ["Za f=1: A+B=b−a.", "Za f=x: Aa+Bb=(b²−a²)/2.", "Reši sistem."], "\\(A=B=(b-a)/2\\): trapezno pravilo."),
      oral: ["Kvadraturo dobimo z integriranjem interpolanta.", "Uteži lahko izpeljem z monomsko eksaktnostjo.", "Trapez je točen do P₁, Simpson do P₃.", "Sestavljanje zmanjša korak; Romberg odstrani vodilni člen napake."],
      pitfall: "Simpson nastane iz kvadratičnega interpolanta, vendar je zaradi simetrije točen tudi za stopnjo 3."
    },
    {
      id: "euler",
      accent: "#ffba63",
      eyebrow: "Izpitni sklop D / temelj ODE",
      title: "Euler, trapezna in stabilnost",
      use: "Za numerično reševanje začetnega problema y′=f(t,y), ko rešitev poznamo le v zaporednih mrežnih točkah.",
      minutes: 18,
      trigger: ["začetni pogoj", "koraki h", "eksplicitno/implicitno", "R(z)"],
      spoken: {
        question: "Kakšna je razlika med eksplicitnim in implicitnim Eulerjem?",
        answer: [
          "Eksplicitni Euler uporabi naklon v že znani začetni točki koraka, zato novo vrednost izračunamo neposredno. Implicitni Euler naklon vzame v novi točki, zato yₙ₊₁ nastopa na obeh straneh in moramo rešiti enačbo.",
          "Oba sta globalno prvega reda. Implicitni Euler je A-stabilen, zato je za Re λ<0 stabilen pri vsakem h>0. Trapezna metoda povpreči začetni in končni naklon ter doseže red 2."
        ],
        anatomy: [
          { label: "Mreža", text: "tₙ=t₀+nh" },
          { label: "Stanje", text: "yₙ približuje y(tₙ)" },
          { label: "Naklon", text: "f(t,y) iz diferencialne enačbe" },
          { label: "Stabilnost", text: "obnašanje na y′=λy" }
        ]
      },
      visual: {
        title: "Rešitev gradimo z lokalnimi nakloni",
        lead: "Lomljenka je Eulerjev približek, gladka krivulja pa točna rešitev. Vsak naslednji korak začne z že nastalo napako.",
        diagram: V.euler(),
        formulas: [
          F("y_{n+1}=y_n+hf(t_n,y_n)", "Eksplicitni Euler: en neposreden račun."),
          F("y_{n+1}=y_n+hf(t_{n+1},y_{n+1})", "Implicitni Euler: na vsakem koraku rešujemo enačbo.")
        ],
        callouts: [
          { label: "Lokalna napaka", text: "napaka enega koraka iz točne prejšnje vrednosti" },
          { label: "Globalna napaka", text: "akumulirana napaka po več korakih; pri Eulerju O(h)" }
        ]
      },
      notation: [
        N("y'=f(t,y)", "y′=f(t,y)", "diferencialna enačba"),
        N("y(t_0)=y_0", "y(t₀)=y₀", "začetni pogoj"),
        N("t_n=t_0+nh", "tₙ", "mrežna točka"),
        N("y_n\\approx y(t_n)", "yₙ", "numerični približek"),
        N("z=h\\lambda", "z", "brezdimenzijski stabilnostni parameter"),
        N("R(z)", "R(z)", "stabilnostna funkcija enega koraka")
      ],
      basic: F("y_{n+1}=y_n+\\frac h2[f(t_n,y_n)+f(t_{n+1},y_{n+1})]", "Implicitna trapezna metoda je reda 2."),
      advanced: F("R_{EE}(z)=1+z,\\quad R_{IE}(z)=\\frac1{1-z},\\quad R_T(z)=\\frac{1+z/2}{1-z/2}", "Na testni enačbi velja yₙ₊₁=R(z)yₙ."),
      algorithm: [
        A("Zapiši mrežo", "Iz intervala in h določi t₀,t₁,…", "Število korakov je dolžina intervala deljeno s h."),
        A("Vstavi metodo", "Pri eksplicitni uporabi stare, pri implicitni nove argumente.", "Ne zamenjaj tₙ in tₙ₊₁."),
        A("Reši notranjo enačbo", "Pri linearnem f algebraično; sicer s fiksno točko ali Newtonom.", "Imenovalec ne sme biti 0."),
        A("Za stabilnost uporabi y′=λy", "Izpelji faktor R(z) in nato potenciranje.", "A-stabilnost pomeni |R(z)|≤1 na levi polravnini; za yₙ→0 strogo <1.")
      ],
      watch: ["implicitna enačba mora biti rešena", "pri gladki rešitvi ter konsistentni in stabilni enočlenski metodi je lokalni red za eno višji od globalnega", "A-stabilnost uporablja ≤1", "implicitni Euler je tudi L-stabilen, trapezna pa ne"],
      easy: E("En korak eksplicitnega Eulerja za y′=−2y, y(0)=1, h=0,25.", ["f(0,1)=−2.", "y₁=1+0,25·(−2)."], "\\(y_1=0{,}5\\)."),
      hard: E("Izpelji stabilnostni faktor trapezne metode za y′=λy.", ["Vstavi f=λy v trapezno formulo.", "Zberi člena z yₙ₊₁ na levi.", "Deli z 1−hλ/2."], "\\(y_{n+1}=R(z)y_n\\), \\(R(z)=(1+z/2)/(1-z/2)\\)."),
      oral: ["Euler je tangentni korak.", "Eksplicitni uporablja star naklon, implicitni novega.", "Trapezna povpreči oba in je reda 2.", "Stabilnost presojam prek R(z) na testni enačbi."],
      pitfall: "Manjši h navadno zmanjša diskretizacijsko napako, vendar pomeni več korakov in lahko okrepi vpliv zaokroževanja."
    },
    {
      id: "runge-kutta",
      accent: "#c8ff3d",
      eyebrow: "Izpitni sklop D / glavno ustno vprašanje",
      title: "Runge–Kutta in veččlenske metode",
      use: "Za višji red reševanja ODE: RK uporabi več novih naklonov v enem koraku, veččlenske metode pa stare informacije iz več korakov.",
      minutes: 25,
      trigger: ["Butcherjeva tabela", "k₁,…,kₛ", "RK2/RK4", "Adams–Bashforth/Moulton"],
      spoken: {
        question: "Zakaj preidemo z Eulerja na Runge–Kutta in kako preberemo Butcherjevo tabelo?",
        answer: [
          "Euler en cel korak oceni samo z enim naklonom. Runge–Kutta znotraj istega koraka izračuna več pomožnih naklonov kᵢ na smiselno izbranih vmesnih mestih in jih na koncu uteženo sešteje. Tako dobimo višji red, ne da bi shranjevali več prejšnjih korakov.",
          "V Butcherjevi tabeli vrstica i pove časovni odmik cᵢ in koeficiente aᵢⱼ, s katerimi zgradimo stanje za kᵢ. Spodnja vrstica b pove končno kombinacijo. Če kᵢ uporablja še neznan kⱼ, moramo rešiti implicitni sistem."
        ],
        anatomy: [
          { label: "cᵢ", text: "mesto znotraj koraka" },
          { label: "A=(aᵢⱼ)", text: "kako stopnje gradijo vmesna stanja" },
          { label: "bᵢ", text: "uteži končnega koraka" },
          { label: "kᵢ", text: "pomožni nakloni, ne nove rešitve" }
        ]
      },
      visual: {
        title: "Tabela se bere po vrsticah",
        lead: "Vsaka vrstica ustvari eno stopnjo. Šele ko so stopnje znane, jih spodnja vrstica sestavi v yₙ₊₁.",
        diagram: V.rungeKutta(),
        formulas: [
          F("k_i=f(t_n+c_ih,\\ y_n+h\\sum_{j=1}^{s}a_{ij}k_j)", "i-ta vrstica Butcherjeve tabele."),
          F("y_{n+1}=y_n+h\\sum_{i=1}^{s}b_ik_i", "Spodnja vrstica tabele določi končni korak.")
        ],
        callouts: [
          { label: "Eksplicitni RK", text: "A je strogo spodnje trikotna; stopnje računamo zaporedno." },
          { label: "Implicitni RK", text: "diagonala ali zgornji del A vsebuje neničelne člene; stopnje rešujemo kot enačbe." }
        ]
      },
      notation: [
        N("s", "s", "število RK stopenj"),
        N("c_i", "cᵢ", "relativni čas i-te stopnje"),
        N("a_{ij}", "aᵢⱼ", "utež stopnje j v argumentu stopnje i"),
        N("b_i", "bᵢ", "končna utež stopnje i"),
        N("k_i", "kᵢ", "i-ti pomožni naklon"),
        N("f_n=f(t_n,y_n)", "fₙ", "že izračunana desna stran za veččlenske metode")
      ],
      basic: F("k_1=f(t_n,y_n),\\quad k_2=f(t_n+h/2,y_n+hk_1/2),\\quad y_{n+1}=y_n+hk_2", "Sredinska RK2: Eulerjev polkorak napove sredino, naklon v sredini naredi cel korak."),
      advanced: F("\\sum_{i=0}^{k}\\alpha_i y_{n-i}+h\\sum_{i=0}^{k}\\beta_i f_{n-i}=0,\\quad\\alpha_0\\ne0", "Splošna k-členska metoda; navadno normiramo α₀=1. β₀=0 pomeni eksplicitno, β₀≠0 implicitno metodo."),
      algorithm: [
        A("Prepiši tabelo", "Označi A, c in b; preveri, ali je metoda eksplicitna.", "Neničelna diagonala pomeni implicitno stopnjo."),
        A("Piši stopnjo za stopnjo", "Za vsako vrstico vstavi cᵢ in vse aᵢⱼ.", "Najprej preveri konvencijo: tu je kᵢ=f in je h zunaj; nekatere pole uporabljajo Kᵢ=hf. Faktorja h ne uporabi dvakrat."),
        A("Reši implicitne stopnje", "Pri linearnem f zberi kᵢ; pri nelinearnem uporabi iteracijo.", "Ne vstavljaj starega y, če tabela zahteva notranje stanje."),
        A("Sestavi novo vrednost", "Uporabi spodnje uteži bᵢ natanko enkrat.", "Preveri Σbᵢ=1 kot nujen pogoj konsistentnosti."),
        A("Primerjaj z veččlensko metodo", "RK ustvarja nove naklone, AB/AM ponovno uporablja stare fₙ.", "Veččlenska metoda potrebuje zagonske vrednosti.")
      ],
      watch: ["kᵢ ni h·f, če formula že vsebuje zunanji h", "prepoznaj implicitno tabelo", "veččlenska metoda potrebuje start", "RK in Adams nista ista vrsta metode"],
      easy: E("Preberi Eulerjevo metodo iz Butcherjeve tabele [0|0; —; 1].", ["Edina stopnja je k₁=f(tₙ,yₙ).", "Končna utež je b₁=1."], "\\(y_{n+1}=y_n+hk_1=y_n+hf(t_n,y_n)\\)."),
      hard: E("Izpelji sredinsko RK2 kot izboljšavo Eulerja.", ["Želimo naklon v sredini koraka.", "Neznano sredinsko stanje napovemo z Eulerjevim polkorakom: yₙ+hk₁/2.", "V tej točki izračunamo k₂ in z njim naredimo cel korak."], "\\(k_1=f(t_n,y_n),\\ k_2=f(t_n+h/2,y_n+hk_1/2),\\ y_{n+1}=y_n+hk_2\\); globalni red 2."),
      oral: ["RK uporablja več naklonov v enem koraku.", "Vrstice A,c določajo stopnje, b končno kombinacijo.", "Eksplicitnost preberem iz strukture A.", "Veččlenske metode uporabijo stare f-vrednosti in potrebujejo zagon."],
      pitfall: "Formula kᵢ=f(…) je splošna tudi za implicitni RK; vsota samo po j<i velja zgolj za eksplicitne metode."
    }
  ];

  window.REVIEW_3H = {
    title: "Numerične metode 2 v 180 minutah",
    subtitle: "Najprej prepoznaj tip naloge, nato poimenuj vse objekte, napiši model, izpelji korak in povej, s čim preveriš rezultat. Polna teorija ostane en klik stran.",
    timetable: [
      { time: "0–8", title: "Zemljevid", detail: "ena zgodba predmeta + hitra diagnostika" },
      { time: "8–38", title: "Aproksimacija", detail: "norma, Bernstein, Remes in Čebišev" },
      { time: "38–83", title: "Zlepki + Bézier", detail: "de Casteljau, odvodi, C⁰/C¹/C²" },
      { time: "83–113", title: "Diference + integral", detail: "uteži, red, ostanek, trapez" },
      { time: "113–148", title: "ODE", detail: "Euler, stabilnost, RK in veččlenske" },
      { time: "148–163", title: "Aktivni priklic", detail: "prioritetne kartice in mešani kviz" },
      { time: "163–180", title: "Mikroizpit", detail: "eno vprašanje iz vsakega stalnega sklopa" }
    ],
    universalNotation: [
      N("f", "f", "podana funkcija ali desna stran diferencialne enačbe"),
      N("p,s,b,y", "p, s, b, y", "polinom, zlepek, Bézierjeva krivulja, rešitev ODE"),
      N("x_i,t_n", "xᵢ, tₙ", "vozlišče aproksimacije oziroma časovna mrežna točka"),
      N("h", "h", "korak; razdalja med sosednjima mrežnima točkama"),
      N("\\xi\\in[a,b]", "ξ ∈ [a,b]", "neznana vmesna točka v ostanku"),
      N("O(h^p)", "O(hᵖ)", "asimptotični red napake"),
      N("P_n", "Pₙ", "polinomi stopnje največ n; oznaka iz gradiva"),
      N("\\lVert\\cdot\\rVert_\\infty", "‖·‖∞", "največji absolutni odklon")
    ],
    writingRules: [
      { title: "Najprej tip objekta", weak: "»Imamo neke točke.«", strong: "x_i=a+ih,\\quad i=0,\\ldots,m", why: "Poveš, da gre za enakomerno mrežo, in določiš pomen indeksov." },
      { title: "Vsaka neznanka dobi pomen", weak: "»Rešimo sistem za m in a-je.«", strong: "p(x)=\\sum_{j=0}^{n}a_jx^j,\\quad m=\\lVert f-p\\rVert_\\infty", why: "Profesor vidi, da veš, kaj sistem dejansko išče." },
      { title: "Formula potrebuje območje", weak: "»Napaka je O(h²).«", strong: "f'(x_0)-D_hf(x_0)=-\\frac{h^2}{6}f^{(3)}(\\xi),\\quad\\xi\\in(x_0-h,x_0+h)", why: "Napišeš red, konstanto, odvod in območje vmesne točke." },
      { title: "Algoritem konča s kriterijem", weak: "»Ponavljamo, dokler ni dovolj dobro.«", strong: "\\lVert f-p_k\\rVert_\\infty-|m_k|<\\varepsilon", why: "Natančen kriterij pokaže, kaj med postopkom meriš." }
    ],
    oralTemplate: [
      "Povem, kateri problem rešujemo in kje se metoda uporablja.",
      "Poimenujem vse podatke, neznanke, indekse in parametre.",
      "Napišem glavno formulo in jo prevedem nazaj v besede.",
      "Izpeljem vsaj en ključni korak oziroma razložim, zakaj metoda velja.",
      "Na majhnem primeru izvedem en cel korak.",
      "Zaključim z redom napake, stabilnostjo ali drugim certifikatom ter opozorim na tipično past."
    ],
    reserve: [
      {
        label: "Interpolacija",
        title: "Newton, Hermite in ostanek",
        text: "Newtonova oblika uporablja deljene diference; ponovljena vozlišča pomenijo odvode. Ostanek je produkt razdalj do vseh vozlišč.",
        tex: "f(x)-I_nf(x)=\\frac{f^{(n+1)}(\\xi)}{(n+1)!}\\prod_{i=0}^{n}(x-x_i)",
        topic: "interpolacija"
      },
      {
        label: "Boljša integracija",
        title: "Romberg, adaptivni Simpson in Gauss",
        text: "Romberg odstranjuje vodilne člene napake, adaptivni Simpson deli samo težke intervale, Gauss pa z optimalnimi vozlišči doseže stopnjo 2n+1.",
        tex: "T_{h/2}^{(1)}=\\frac{4T_{h/2}-T_h}{3},\\qquad Q_G\\text{ je točen na }P_{2n+1}",
        topic: "izboljsana-integracija"
      },
      {
        label: "Robni problem",
        title: "Centralne diference in streljanje",
        text: "Pri diferenčni metodi neznane vrednosti v notranjih vozliščih sestavijo tridiagonalni sistem; strelska metoda robni problem spremeni v zaporedje začetnih problemov.",
        tex: "-y_{i-1}+2y_i-y_{i+1}=h^2f(x_i)",
        topic: "robni-problemi"
      }
    ],
    classmateQuestion: {
      title: "Od Eulerja do Runge–Kutta, nato še diference in veččlenske metode",
      prompt: "Profesor začne: »Zakaj Euler ni dovolj in kako dobimo Runge–Kutta?« Nato pokaže Butcherjevo tabelo, vpraša po pomenu vsakega simbola, zahteva primerjavo preme, obratne in simetrične diference z ostanki ter na koncu razliko med RK in veččlenskimi metodami.",
      spokenAnswer: [
        "Euler uporabi en naklon na začetku ali koncu koraka in ima globalni red 1. RK v istem koraku vzame več naklonov, ki približajo obnašanje rešitve znotraj intervala; koeficiente preberem iz Butcherjeve tabele. Sredinska RK2 najprej z Eulerjevim polkorakom napove sredino in nato z naklonom v sredini naredi cel korak.",
        "Diferenčne formule so ista aproksimacijska ideja: interpolacijski polinom odvajamo oziroma uteži določimo iz točnosti na monomih. Prema in obratna formula sta reda 1, simetrična pa zaradi izničenja sodih Taylorjevih členov reda 2. Veččlenske metode za razliko od RK ne računajo več novih notranjih naklonov, temveč uporabijo f-vrednosti iz prejšnjih korakov, zato potrebujejo zagonske vrednosti."
      ],
      formulas: [
        { label: "Splošni RK", tex: "k_i=f(t_n+c_ih,y_n+h\\sum_ja_{ij}k_j),\\qquad y_{n+1}=y_n+h\\sum_ib_ik_i" },
        { label: "Tri osnovne diference", tex: "D_h^+f=\\frac{f(x+h)-f(x)}h,\\quad D_h^-f=\\frac{f(x)-f(x-h)}h,\\quad D_h^0f=\\frac{f(x+h)-f(x-h)}{2h}" },
        { label: "Splošna veččlenska", tex: "\\sum_{i=0}^{k}\\alpha_i y_{n-i}+h\\sum_{i=0}^{k}\\beta_i f_{n-i}=0" }
      ],
      plan: [
        "Najprej nariši en Eulerjev tangentni korak in povej njegovo omejitev.",
        "Iz sredinskega naklona motiviraj k₁, k₂ in RK2.",
        "Splošno Butcherjevo tabelo prevedi vrstico po vrstici.",
        "Diference izpelji s Taylorjem in izrecno napiši ostanke.",
        "Zaključi s primerjavo: RK = več novih naklonov v enem koraku; veččlenska = ponovna uporaba zgodovine."
      ]
    },
    methods
  };
})();
