(() => {
  "use strict";

  const TOPIC_IDS = [
    "aproksimacija",
    "remes-cebisev",
    "interpolacija",
    "zlepki",
    "bezier",
    "bezier-zlepki",
    "odvajanje",
    "newton-cotes",
    "izboljsana-integracija",
    "euler-trapez",
    "runge-kutta",
    "robni-problemi"
  ];

  const flashcardSpecs = {
    "aproksimacija": [
      ["Kaj je element najboljše aproksimacije?", "Za \\(f\\in X\\) in podprostor \\(P\\subseteq X\\) je \\(p^*\\in P\\) element najboljše aproksimacije, če velja \\(\\|f-p^*\\|=\\inf_{p\\in P}\\|f-p\\|\\)."],
      ["Kaj meri enakomerna oziroma neskončna norma?", "Na intervalu \\([a,b]\\) je \\(\\|g\\|_\\infty=\\max_{x\\in[a,b]}|g(x)|\\). Zato pri minimaks aproksimaciji zmanjšujemo največje, ne povprečne napake."],
      ["Kako je definiran Bernsteinov polinom?", "Za \\(f:[0,1]\\to\\mathbb R\\) je \\(B_nf(x)=\\sum_{i=0}^n f(i/n)\\binom ni x^i(1-x)^{n-i}\\)."],
      ["Kateri dve lastnosti Bernsteinove baze sta ključni?", "Velja \\(B_i^n(x)\\ge 0\\) in \\(\\sum_{i=0}^n B_i^n(x)=1\\) na \\([0,1]\\). Vrednost Bernsteinovega polinoma je zato konveksna kombinacija vzorčnih vrednosti."],
      ["Kaj zagotavlja Weierstrassov izrek?", "Vsako zvezno funkcijo na kompaktnem intervalu lahko v enakomerni normi poljubno dobro aproksimiramo s polinomi. Bernsteinovi polinomi dajo konstruktiven dokaz."],
      ["Kako primerjamo dva kandidata za enakomerno aproksimacijo?", "Za vsakega izračunamo funkcijo napake \\(e_i=f-p_i\\), poiščemo njene robne vrednosti in notranje ekstreme ter primerjamo \\(\\|e_i\\|_\\infty\\)."]
    ],
    "remes-cebisev": [
      ["Kaj pravi Čebiševov alternacijski izrek?", "Za \\(f\\in C[a,b]\\) je \\(p^*\\in\\mathcal P_n\\) najboljša enakomerna aproksimacija natanko tedaj, ko napaka v vsaj \\(n+2\\) urejenih točkah alternira med \\(+m\\) in \\(-m\\), kjer je \\(m=\\|f-p^*\\|_\\infty\\)."],
      ["Kateri sistem rešimo v enem koraku Remesovega postopka?", "Za izbrane \\(x_0<\\cdots<x_{n+1}\\) rešimo \\(f(x_i)-p(x_i)=(-1)^i m\\). Neznanke so \\(m\\) in \\(n+1\\) koeficientov polinoma."],
      ["Kaj predstavlja neznanka \\(m\\) v Remesovem sistemu?", "Je podpisana amplituda alternirajoče napake na trenutni množici točk. Norma napake je \\(|m|\\), ko so te točke res ekstremne za končni polinom."],
      ["Kaj naredimo po rešitvi Remesovega sistema?", "Izračunamo \\(e=f-p\\), poiščemo njene največje pozitivne in negativne ekstreme ter z njimi posodobimo alternirajočo množico \\(n+2\\) točk."],
      ["Kakšna je razlika med Remesom na končni množici in na intervalu?", "Na končni množici sistem neposredno reši diskretni minimaks problem. Na intervalu moramo še preveriti vse ekstreme napake in po potrebi iterirati."],
      ["Kako na izpitu certificiramo končni Remesov rezultat?", "Pokažemo \\(n+2\\) alternirajočih ekstremov enake absolutne višine in preverimo, da drugje velja \\(|f(x)-p(x)|\\le m\\)."]
    ],
    "interpolacija": [
      ["Kako je zapisan Lagrangeev interpolacijski polinom?", "Za različna vozlišča \\(x_i\\) je \\(p_n(x)=\\sum_{i=0}^n f(x_i)L_i(x)\\), kjer \\(L_i(x)=\\prod_{j\\ne i}(x-x_j)/(x_i-x_j)\\)."],
      ["Kako je zapisana Newtonova oblika interpolanta?", "Velja \\(p_n(x)=f[x_0]+f[x_0,x_1](x-x_0)+\\cdots+f[x_0,\\ldots,x_n]\\prod_{j=0}^{n-1}(x-x_j)\\)."],
      ["Kaj je deljena diferenca prvega reda?", "Za \\(x_0\\ne x_1\\) je \\(f[x_0,x_1]=(f(x_1)-f(x_0))/(x_1-x_0)\\); višje deljene diference dobimo rekurzivno."],
      ["Kako v deljenih diferencah obravnavamo ponovljena vozlišča?", "Pri Hermitovi interpolaciji velja \\(f[\\underbrace{x,\\ldots,x}_{k+1}]=f^{(k)}(x)/k!\\)."],
      ["Kakšen je ostanek polinomske interpolacije?", "Če je \\(f\\in C^{n+1}\\), potem za neki \\(\\xi\\) velja \\(f(x)-p_n(x)=f^{(n+1)}(\\xi)\\prod_{i=0}^n(x-x_i)/(n+1)!\\)."],
      ["Zakaj je interpolant stopnje največ \\(n\\) enoličen?", "Če bi obstajala dva, bi bila njuna razlika polinom stopnje največ \\(n\\) z \\(n+1\\) različnimi ničlami, zato bi morala biti identično ničelna."]
    ],
    "zlepki": [
      ["Kaj je polinomski zlepek?", "Je odsekoma polinomska funkcija na delitvi \\(a=x_0<\\cdots<x_m=b\\), pri kateri na stikih zahtevamo predpisano stopnjo gladkosti."],
      ["Kaj mora veljati za \\(C^k\\)-zlepek v notranjem stiku?", "Levi in desni kos morata imeti enake vrednosti odvodov reda \\(0,1,\\ldots,k\\) v stični točki."],
      ["Kako je določen linearni interpolacijski zlepek?", "Na vsakem \\([x_i,x_{i+1}]\\) je premica skozi \\((x_i,f_i)\\) in \\((x_{i+1},f_{i+1})\\). Zlepek je zvezen, praviloma pa ne \\(C^1\\)."],
      ["Katere podatke interpolira kubični Hermitov kos?", "Na intervalu interpolira vrednosti in prve odvode na obeh krajiščih, torej štiri podatke, ki enolično določijo kubični polinom."],
      ["Kaj pomenita naravna robna pogoja za kubični zlepek?", "Na krajiščih zahtevamo \\(S''(a)=S''(b)=0\\); s tem zapremo sistem za \\(C^2\\) kubični interpolacijski zlepek."],
      ["Kakšna je tipična napaka kubične Hermitove interpolacije?", "Na enem intervalu je \\(f(x)-H_3(x)=f^{(4)}(\\xi)(x-a)^2(x-b)^2/4!\\), zato napako omejimo z maksimumom četrtega odvoda."]
    ],
    "bezier": [
      ["Kako zapišemo Bézierjevo krivuljo stopnje \\(n\\)?", "Velja \\(b(t)=\\sum_{i=0}^n b_iB_i^n(t)\\), kjer je \\(B_i^n(t)=\\binom ni t^i(1-t)^{n-i}\\) in \\(t\\in[0,1]\\)."],
      ["Kje se Bézierjeva krivulja začne in konča?", "Ker je \\(B_0^n(0)=1\\) in \\(B_n^n(1)=1\\), velja \\(b(0)=b_0\\) in \\(b(1)=b_n\\)."],
      ["Kaj računa de Casteljaujev postopek?", "Rekurzivno računa \\(b_i^{(r)}(t)=(1-t)b_i^{(r-1)}(t)+tb_{i+1}^{(r-1)}(t)\\); končna točka je \\(b_0^{(n)}(t)=b(t)\\)."],
      ["Zakaj krivulja leži v konveksni ovojnici kontrolnih točk?", "Bernsteinove uteži so nenegativne in imajo vsoto ena, zato je \\(b(t)\\) za vsak \\(t\\) konveksna kombinacija kontrolnih točk."],
      ["Kaj pomeni afina invariantnost Bézierjevih krivulj?", "Za afino preslikavo \\(\\Phi\\) velja \\(\\Phi(b(t))=\\sum_i\\Phi(b_i)B_i^n(t)\\). Krivuljo preslikamo tako, da preslikamo vse kontrolne točke."],
      ["Kako zapišemo odvod Bézierjeve krivulje?", "Odvod je Bézierjeva krivulja stopnje \\(n-1\\): \\(b'(t)=n\\sum_{i=0}^{n-1}(b_{i+1}-b_i)B_i^{n-1}(t)\\)."]
    ],
    "bezier-zlepki": [
      ["Kateri pogoj zagotovi zvezen stik dveh Bézierjevih krivulj?", "Za stik konca \\(b\\) z začetkom \\(c\\) mora veljati \\(b_n=c_0\\). To je pogoj \\(C^0\\)."],
      ["Kateri pogoj zagotovi \\(C^1\\)-stik brez reparametrizacije?", "Za stopnji \\(n\\) in \\(m\\) mora veljati \\(n(b_n-b_{n-1})=m(c_1-c_0)\\)."],
      ["Kako reparametrizacija spremeni pogoj za prvi odvod?", "Če kosa uporabimo kot \\(b(\\phi(u))\\) in \\(c(\\psi(u))\\), morata biti v stiku enaka \\(\\phi'(u_*)b'(1)\\) in \\(\\psi'(u_*)c'(0)\\)."],
      ["Kateri pogoj zagotovi \\(C^2\\)-stik brez reparametrizacije?", "Poleg \\(C^0\\) in \\(C^1\\) zahtevamo \\(n(n-1)(b_n-2b_{n-1}+b_{n-2})=m(m-1)(c_2-2c_1+c_0)\\)."],
      ["Kakšna je razlika med zvezno smerjo in zvezno hitrostjo?", "Za geometrijski \\(G^1\\)-stik sta tangentna vektorja pozitivno kolinearna; za \\(C^1\\)-stik morata biti po ustrezni parametrizaciji tudi enaka."],
      ["Kdaj kubična Bézierjeva krivulja dejansko pade na stopnjo dve?", "Ko so tretje končne razlike kontrolnih točk nič: \\(b_3-3b_2+3b_1-b_0=0\\)."]
    ],
    "odvajanje": [
      ["Kakšna je prema diferenčna formula za prvi odvod?", "Velja \\(f'(x)=\\bigl(f(x+h)-f(x)\\bigr)/h+O(h)\\). Uporabna je ob levem robu intervala."],
      ["Kakšna je obratna diferenčna formula za prvi odvod?", "Velja \\(f'(x)=\\bigl(f(x)-f(x-h)\\bigr)/h+O(h)\\). Uporabna je ob desnem robu intervala."],
      ["Kakšna je simetrična diferenčna formula za prvi odvod?", "Velja \\(f'(x)=\\bigl(f(x+h)-f(x-h)\\bigr)/(2h)+O(h^2)\\). Simetrija odpravi člen s sodim odvodom."],
      ["Kakšna je centralna formula za drugi odvod?", "Velja \\(f''(x)=\\bigl(f(x+h)-2f(x)+f(x-h)\\bigr)/h^2+O(h^2)\\)."],
      ["Kako sistematično določimo uteži diferenčnega pravila?", "Nastavek uveljavimo na baznih polinomih \\(1,(x-x_0),\\ldots\\) in zahtevamo točnost za čim višjo stopnjo; dobimo momentni linearni sistem."],
      ["Zakaj zelo majhen \\(h\\) ni vedno najboljši?", "Diskretizacijska napaka z manjšim \\(h\\) pada, napaka zaradi odštevanja skoraj enakih števil in zaokroževanja pa se lahko poveča."]
    ],
    "newton-cotes": [
      ["Na čem temeljijo Newton–Cotesova pravila?", "Funkcijo interpoliramo v ekvidistantnih vozliščih in interpolacijski polinom integriramo natanko."],
      ["Kako se glasi osnovno trapezno pravilo?", "Velja \\(\\int_a^b f(x)\\,dx\\approx (b-a)\\bigl(f(a)+f(b)\\bigr)/2\\); stopnja točnosti je ena."],
      ["Kako se glasi Simpsonovo pravilo?", "Za \\(m=(a+b)/2\\) velja \\(\\int_a^b f(x)\\,dx\\approx (b-a)\\bigl(f(a)+4f(m)+f(b)\\bigr)/6\\); stopnja točnosti je tri."],
      ["Kaj je stopnja točnosti integracijskega pravila?", "Največje celo število \\(r\\), za katero je pravilo točno za vse polinome stopnje največ \\(r\\)."],
      ["Kako dobimo sestavljeno Newton–Cotesovo pravilo?", "Interval razdelimo na manjše podintervale, na vsakem uporabimo osnovno pravilo in rezultate seštejemo."],
      ["Kakšna sta reda globalne napake sestavljenega trapeznega in Simpsonovega pravila?", "Pri dovolj gladki funkciji je trapezna napaka \\(O(h^2)\\), Simpsonova pa \\(O(h^4)\\)."]
    ],
    "izboljsana-integracija": [
      ["Kaj je Richardsonova ekstrapolacija?", "Če ima približek razvoj \\(P_h=I+Ch^p+O(h^{p+q})\\), kombinacija \\((2^pP_{h/2}-P_h)/(2^p-1)\\) odpravi vodilni člen \\(Ch^p\\)."],
      ["Kakšna je Rombergova rekurzija?", "Iz trapeznih približkov gradimo \\(R_{k,0}=T_{h_k}\\) in \\(R_{k,j}=R_{k,j-1}+(R_{k,j-1}-R_{k-1,j-1})/(4^j-1)\\)."],
      ["Kako deluje adaptivno integriranje?", "Primerjamo približek na intervalu z vsoto približkov na obeh polovicah; kjer je ocena napake prevelika, interval rekurzivno razpolovimo."],
      ["Kakšno stopnjo doseže Gaussovo pravilo z \\(n\\) vozlišči?", "Z optimalno izbranimi vozlišči in utežmi je Gaussovo pravilo z \\(n\\) vozlišči točno za vse polinome stopnje največ \\(2n-1\\)."],
      ["Katero je dvo-točkovno Gauss–Legendreovo pravilo na \\([-1,1]\\)?", "Vozlišči sta \\(\\pm1/\\sqrt3\\), uteži pa obe ena: \\(\\int_{-1}^1f(x)\\,dx\\approx f(-1/\\sqrt3)+f(1/\\sqrt3)\\)."],
      ["Kaj pridobimo, če kvadraturno pravilo uporablja tudi odvode na krajiščih?", "Z istim številom krajiščnih točk lahko dosežemo višjo stopnjo točnosti; uteži izpeljemo z zahtevo točnosti na monomih, ostanek pa z naslednjim netočnim členom."]
    ],
    "euler-trapez": [
      ["Kaj je začetni problem za navadno diferencialno enačbo?", "Iščemo \\(y\\), ki zadošča \\(y'(x)=f(x,y(x))\\) in začetnemu pogoju \\(y(x_0)=y_0\\). Na mreži je \\(x_n=x_0+nh\\)."],
      ["Kako se glasi eksplicitna Eulerjeva metoda?", "Velja \\(y_{n+1}=y_n+hf(x_n,y_n)\\). Uporabi naklon na začetku koraka."],
      ["Kako se glasi implicitna Eulerjeva metoda?", "Velja \\(y_{n+1}=y_n+hf(x_{n+1},y_{n+1})\\). Za \\(y_{n+1}\\) moramo praviloma rešiti enačbo."],
      ["Kakšna sta lokalni in globalni red Eulerjeve metode?", "Lokalna napaka enega koraka je \\(O(h^2)\\), po približno \\(1/h\\) korakih pa se nabere globalna napaka \\(O(h)\\)."],
      ["Kako se glasi trapezna metoda za ODE?", "Velja \\(y_{n+1}=y_n+\\frac h2\\bigl(f(x_n,y_n)+f(x_{n+1},y_{n+1})\\bigr)\\). Metoda je implicitna in drugega reda."],
      ["Kaj je stabilnostna funkcija metode na testni enačbi?", "Za \\(y'=\\lambda y\\) zapišemo \\(y_{n+1}=R(z)y_n\\), kjer je \\(z=h\\lambda\\). Absolutna stabilnost pomeni \\(|R(z)|<1\\)."]
    ],
    "runge-kutta": [
      ["Zakaj Eulerjevo metodo posplošimo v Runge–Kutta metode?", "Euler uporabi en sam začetni naklon. Runge–Kutta z več nakloni znotraj koraka bolje aproksimira integral naklona brez shranjevanja starejših vrednosti."],
      ["Kako je zapisana splošna Runge–Kutta metoda?", "Stopnje so \\(k_i=f(x_n+c_ih,\\,y_n+h\\sum_j a_{ij}k_j)\\), posodobitev pa \\(y_{n+1}=y_n+h\\sum_i b_ik_i\\)."],
      ["Kaj vsebuje Butcherjeva tabela?", "Vektor \\(c\\) določa časovne odmike stopenj, matrika \\(A=(a_{ij})\\) njihove medsebojne odvisnosti, vektor \\(b\\) pa uteži končne kombinacije."],
      ["Kako iz Butcherjeve tabele prepoznamo eksplicitno metodo?", "Matrika \\(A\\) je strogo spodnje trikotna. Če ima diagonala ali zgornji del neničelne elemente, nastopijo implicitne enačbe za stopnje."],
      ["Katere uteži ima klasična metoda RK4?", "Uporabi štiri naklone in kombinacijo \\(y_{n+1}=y_n+h(k_1+2k_2+2k_3+k_4)/6\\), pri čemer sta srednja naklona izračunana v polovici koraka."],
      ["Kako se veččlenska metoda razlikuje od Runge–Kutta metode?", "Veččlenska metoda uporablja vrednosti iz več prejšnjih korakov; Runge–Kutta znotraj enega koraka izračuna več novih stopenj in je samostartna."]
    ],
    "robni-problemi": [
      ["Kako se robni problem razlikuje od začetnega problema?", "Pogoji so podani na različnih krajiščih intervala, na primer \\(y(a)=\\alpha\\) in \\(y(b)=\\beta\\), zato rešitve ne moremo preprosto razvijati le od leve proti desni."],
      ["Kateri centralni formuli uporabimo v diferenčni metodi?", "V notranjem vozlišču velja \\(y'(x_i)\\approx(y_{i+1}-y_{i-1})/(2h)\\) in \\(y''(x_i)\\approx(y_{i+1}-2y_i+y_{i-1})/h^2\\)."],
      ["Kakšen sistem navadno dobimo pri enodimenzionalnem robnem problemu drugega reda?", "Po diskretizaciji vsakega notranjega vozlišča dobimo tridiagonalen linearni sistem za neznane približke \\(y_1,\\ldots,y_{n-1}\\)."],
      ["Kako v sistem vključimo Dirichletova robna pogoja?", "Znani vrednosti \\(y_0=\\alpha\\) in \\(y_n=\\beta\\) prenesemo na desne strani prve oziroma zadnje notranje enačbe."],
      ["Kaj je strelska metoda?", "Neznani začetni odvod obravnavamo kot parameter, rešujemo začetni problem in parameter prilagajamo, dokler rešitev ne zadene robnega pogoja na drugem krajišču."],
      ["Kakšna je pet-točkovna formula za Laplaceov operator?", "Na kvadratni mreži je \\(\\Delta u_{ij}\\approx(u_{i+1,j}+u_{i-1,j}+u_{i,j+1}+u_{i,j-1}-4u_{ij})/h^2\\)."]
    ]
  };

  const CORE_CARD_IDS = new Set([
    "fc-remes-cebisev-1", "fc-remes-cebisev-2", "fc-remes-cebisev-3",
    "fc-remes-cebisev-4", "fc-remes-cebisev-5", "fc-remes-cebisev-6",
    "fc-bezier-1", "fc-bezier-3", "fc-bezier-4", "fc-bezier-5", "fc-bezier-6",
    "fc-bezier-zlepki-1", "fc-bezier-zlepki-2", "fc-bezier-zlepki-3",
    "fc-bezier-zlepki-4", "fc-bezier-zlepki-5",
    "fc-odvajanje-1", "fc-odvajanje-2", "fc-odvajanje-3",
    "fc-odvajanje-4", "fc-odvajanje-5", "fc-odvajanje-6",
    "fc-euler-trapez-2", "fc-euler-trapez-3",
    "fc-euler-trapez-5", "fc-euler-trapez-6",
    "fc-runge-kutta-1", "fc-runge-kutta-2",
    "fc-runge-kutta-3", "fc-runge-kutta-6"
  ]);

  const flashcards = TOPIC_IDS.flatMap(topic =>
    flashcardSpecs[topic].map(([question, answer], index) => {
      const id = `fc-${topic}-${index + 1}`;
      return {
        id,
        topic,
        question,
        answer,
        ...(CORE_CARD_IDS.has(id) ? { core: true } : {})
      };
    })
  );

  const quizSpecs = {
    "aproksimacija": [
      ["Kaj je \\(\\|g\\|_\\infty\\) na \\([a,b]\\)?", ["\\(\\int_a^b|g(x)|\\,dx\\)", "\\(\\max_{x\\in[a,b]}|g(x)|\\)", "\\(\\sum_i|g(x_i)|\\)", "\\(|g(a)|+|g(b)|\\)"], 1, "Enakomerna norma meri največje absolutno odstopanje na celotnem intervalu."],
      ["Kolikšna je vsota Bernsteinovih baznih polinomov v vsaki točki \\(x\\in[0,1]\\)?", ["\\(0\\)", "\\(x\\)", "\\(n\\)", "\\(1\\)"], 3, "Binomski izrek da \\(\\sum_i\\binom ni x^i(1-x)^{n-i}=(x+1-x)^n=1\\)."],
      ["Kateri pogoj opiše element najboljše aproksimacije \\(p^*\\in P\\)?", ["\\(p^*(x_i)=f(x_i)\\) v vseh vozliščih", "\\(\\|f-p^*\\|=\\inf_{p\\in P}\\|f-p\\|\\)", "\\(p^*=0\\)", "\\(f-p^*\\) je vedno pozitiven"], 1, "Najboljša aproksimacija minimizira izbrano normo napake med vsemi elementi prostora \\(P\\)."],
      ["Kaj je \\(B_n f\\), če je \\(f(x)=x\\)?", ["\\(0\\)", "\\(x\\)", "\\(x^n\\)", "\\(x+1/n\\)"], 1, "Bernsteinov operator natančno reproducira konstante in linearne funkcije."],
      ["Kaj zagotavlja Weierstrassov izrek?", ["Vsaka funkcija je polinom", "Vsako zvezno funkcijo na kompaktnem intervalu lahko enakomerno aproksimiramo s polinomi", "Interpolant je vedno najboljši minimaks polinom", "Bernsteinovi polinomi so vedno enaki funkciji"], 1, "Izrek zagotavlja poljubno majhno enakomerno napako, ne pa enakosti pri končnem polinomu." ]
    ],
    "remes-cebisev": [
      ["Koliko alternirajočih ekstremov potrebuje najboljši polinom iz \\(\\mathcal P_n\\)?", ["\\(n\\)", "\\(n+1\\)", "\\(n+2\\)", "\\(2n\\)"], 2, "Čebiševov alternacijski izrek zahteva vsaj \\(n+2\\) urejenih alternirajočih ekstremov."],
      ["Koliko neznank ima Remesov sistem za \\(p\\in\\mathcal P_n\\)?", ["\\(n\\)", "\\(n+1\\)", "\\(n+2\\)", "\\(2n+2\\)"], 2, "Neznanke so \\(n+1\\) koeficientov polinoma in amplituda napake \\(m\\)."],
      ["Kateri zapis predstavlja alterniranje napake?", ["\\(f(x_i)-p(x_i)=m\\) za vse \\(i\\)", "\\(f(x_i)-p(x_i)=(-1)^im\\)", "\\(p(x_i)=0\\)", "\\(|f(x_i)|=|p(x_i)|\\)"], 1, "Predznak se mora v zaporednih točkah izmenjevati."],
      ["Kaj moramo po diskretnem Remesovem koraku še preveriti za optimalnost na intervalu?", ["Samo stopnjo polinoma", "Samo vrednost v središču", "Vse relevantne ekstreme napake in omejitev \\(|f-p|\\le |m|\\)", "Ali so koeficienti celoštevilski"], 2, "Rešitev na izbranih točkah še ne izključuje večje napake med njimi."],
      ["Katera premica najbolje enakomerno aproksimira \\(x^2\\) na \\([0,2]\\)?", ["\\(2x\\)", "\\(x-1\\)", "\\(2x-1/2\\)", "\\(x+1/2\\)"], 2, "Napaka \\(x^2-2x+1/2\\) alternira z vrednostmi \\(1/2,-1/2,1/2\\) v točkah \\(0,1,2\\)."]
    ],
    "interpolacija": [
      ["Koliko različnih vrednostnih podatkov enolično določi polinom stopnje največ \\(n\\)?", ["\\(n\\)", "\\(n+1\\)", "\\(n+2\\)", "\\(2n\\)"], 1, "Polinom stopnje največ \\(n\\) ima \\(n+1\\) koeficientov."],
      ["Kolikšna je deljena diferenca z \\(k+1\\) enakimi vozlišči?", ["\\(f^{(k)}(x)\\)", "\\(k!f(x)\\)", "\\(f^{(k)}(x)/k!\\)", "Vedno je nič"], 2, "Ponovljena vozlišča v Hermitovi interpolaciji kodirajo odvode, deljene s faktorielom."],
      ["Kateri odvod nastopi v ostanku interpolanta stopnje \\(n\\)?", ["Prvi", "\\(n\\)-ti", "\\((n+1)\\)-ti", "\\((2n)\\)-ti"], 2, "Ostanek vsebuje \\(f^{(n+1)}(\\xi)/(n+1)!\\)."],
      ["Kaj velja za Lagrangeevo bazno funkcijo \\(L_i\\)?", ["\\(L_i(x_j)=\\delta_{ij}\\)", "\\(L_i(x_j)=1\\) za vse \\(j\\)", "\\(L_i'(x_j)=0\\) za vse \\(j\\)", "\\(L_i\\) ima stopnjo nič"], 0, "Bazna funkcija je ena v svojem vozlišču in nič v vseh drugih."],
      ["Katera je praktična prednost Newtonove oblike ob dodajanju novega vozlišča?", ["Vse koeficiente vedno izbrišemo", "Dodamo le nov člen z novo deljeno diferenco", "Ne potrebujemo funkcijskih vrednosti", "Interpolant postane linearen"], 1, "Prejšnji del Newtonovega interpolanta ostane nespremenjen." ]
    ],
    "zlepki": [
      ["Kaj mora veljati v stiku za \\(C^1\\)-zlepek?", ["Ujemata se le vrednosti", "Ujemata se vrednosti in prvi odvodi", "Ujemata se le drugi odvodi", "Kosa morata biti isti polinom"], 1, "Razred \\(C^1\\) zahteva zveznost funkcije in prvega odvoda."],
      ["Kakšna je običajna gladkost linearnega interpolacijskega zlepka?", ["Vedno \\(C^2\\)", "Vedno \\(C^1\\)", "\\(C^0\\), praviloma ne \\(C^1\\)", "Ni niti zvezen"], 2, "Sosednji premici se ujemata v vrednosti vozlišča, njuna naklona pa sta navadno različna."],
      ["Katera robna pogoja določata naravni kubični zlepek?", ["\\(S'(a)=S'(b)=0\\)", "\\(S''(a)=S''(b)=0\\)", "\\(S(a)=S(b)=0\\)", "\\(S'''(a)=S'''(b)=0\\)"], 1, "Naravna pogoja postavita ukrivljenost na krajiščih na nič."],
      ["Kateri štirje podatki določijo kubični Hermitov kos na \\([a,b]\\)?", ["Le štiri vrednosti v notranjosti", "\\(f(a),f'(a),f(b),f'(b)\\)", "\\(f(a),f''(a),f(b),f''(b)\\)", "Samo \\(f(a),f(b)\\)"], 1, "Dve vrednosti in dva prva odvoda dajo štiri neodvisne pogoje za štiri koeficiente."],
      ["Kateri odvod funkcije nadzoruje napako kubične Hermitove interpolacije?", ["Drugi", "Tretji", "Četrti", "Peti"], 2, "Ostanek vsebuje četrti odvod in faktor \\((x-a)^2(x-b)^2/4!\\)."]
    ],
    "bezier": [
      ["Kaj sta krajiščni vrednosti Bézierjeve krivulje?", ["\\(b(0)=b_1,\\ b(1)=b_{n-1}\\)", "\\(b(0)=b_0,\\ b(1)=b_n\\)", "Obe sta nič", "Obe sta povprečje kontrolnih točk"], 1, "Na krajišču je natanko ena Bernsteinova utež enaka ena."],
      ["Kateri sklep je pravilen, če je konveksna ovojnica kontrolnih točk disjunktna od ovire?", ["Krivulja zagotovo zadene oviro", "O trku ne moremo nič sklepati", "Krivulja ovire ne more zadeti", "Krivulja je premica"], 2, "Celotna krivulja leži v konveksni ovojnici, zato prazen presek ovojnice z oviro izključi trk."],
      ["Kaj računa en korak de Casteljaujevega postopka?", ["Odvod kontrolnih točk", "Afino kombinacijo dveh sosednjih točk \\((1-t)u+tv\\)", "Skalarni produkt", "Inverz matrike"], 1, "Vsaka nova raven nastane z linearno interpolacijo sosednjih točk prejšnje ravni."],
      ["Kolikšen je začetni tangentni vektor krivulje stopnje \\(n\\)?", ["\\(b_1-b_0\\)", "\\(n(b_1-b_0)\\)", "\\(n(b_n-b_{n-1})\\)", "\\(b_n-b_0\\)"], 1, "Iz formule za odvod pri \\(t=0\\) ostane prva kontrolna razlika, pomnožena z \\(n\\)."],
      ["Kako afino preslikamo Bézierjevo krivuljo?", ["Preslikamo le prvo točko", "Preslikamo parameter \\(t\\)", "Z isto afino preslikavo preslikamo vse kontrolne točke", "Najprej moramo krivuljo pretvoriti v krožnico"], 2, "Afina preslikava komutira s konveksnimi oziroma afinimi kombinacijami Bernsteinove oblike."]
    ],
    "bezier-zlepki": [
      ["Kateri je pogoj \\(C^0\\) za stik \\(b\\) in \\(c\\)?", ["\\(b_0=c_m\\)", "\\(b_n=c_0\\)", "\\(b'(1)=c'(0)\\)", "\\(b_n=c_m\\)"], 1, "Konec prve krivulje mora biti začetek druge."],
      ["Kateri pogoj da \\(C^1\\)-stik krivulj stopenj \\(n\\) in \\(m\\) brez reparametrizacije?", ["\\(b_n-b_{n-1}=c_1-c_0\\)", "\\(n(b_n-b_{n-1})=m(c_1-c_0)\\)", "\\(nb_n=mc_0\\)", "\\(b_{n-1}=c_1\\)"], 1, "Faktorja stopenj sta del krajiščnih odvodov."],
      ["Kaj zadošča za geometrijski \\(G^1\\)-stik?", ["Tangentna vektorja sta pozitivno kolinearna", "Hitrosti sta nujno enaki", "Druga odvoda sta nič", "Kontrolna poligona sta enaka"], 0, "Pri \\(G^1\\) zahtevamo isto smer brez nujno enake parametrske hitrosti."],
      ["Kateri izraz je sorazmeren z drugim krajiščnim odvodom kubične Bézierjeve krivulje?", ["\\(b_3-b_0\\)", "\\(b_3-2b_2+b_1\\)", "\\(b_2-b_1\\)", "\\(b_3-3b_2+3b_1-b_0\\)"], 1, "Za kubično krivuljo je \\(b''(1)=6(b_3-2b_2+b_1)\\)."],
      ["Kateri faktor nastopi pri drugem odvodu kompozicije z linearno reparametrizacijo \\(t=\\phi(u)\\)?", ["\\(\\phi'(u)\\)", "\\(\\phi'(u)^2\\)", "Samo \\(\\phi''(u)\\)", "Noben faktor"], 1, "Ker je linearna reparametrizacija brez drugega odvoda, velja \\((b\\circ\\phi)''=b''(\\phi)(\\phi')^2\\)."]
    ],
    "odvajanje": [
      ["Kakšen red ima simetrična formula \\((f(x+h)-f(x-h))/(2h)\\)?", ["\\(O(1)\\)", "\\(O(h)\\)", "\\(O(h^2)\\)", "\\(O(h^4)\\)"], 2, "Taylorjeva člena drugega reda se zaradi simetrije odštejeta."],
      ["Kakšen red ima osnovna prema diferenca?", ["\\(O(h)\\)", "\\(O(h^2)\\)", "\\(O(h^3)\\)", "Je vedno točna"], 0, "Po deljenju Taylorjevega razvoja z \\(h\\) ostane vodilna napaka sorazmerna z \\(h\\)."],
      ["Katera formula aproksimira \\(f''(x)\\) z redom dve?", ["\\((f(x+h)-f(x-h))/(2h)\\)", "\\((f(x+h)-2f(x)+f(x-h))/h^2\\)", "\\((f(x+h)-f(x))/h\\)", "\\((f(x+h)+f(x-h))/2\\)"], 1, "Centralna druga razlika je simetrična in ima napako \\(O(h^2)\\)."],
      ["Kako najvarneje izpeljemo neznane uteži nove diferenčne formule?", ["Uteži ugibamo", "Zahtevamo točnost na zaporednih monomih", "Vedno vzamemo vse uteži enake", "Odvajamo podatkovno tabelo grafično"], 1, "Momentni pogoji na polinomih tvorijo linearni sistem in neposredno povedo stopnjo točnosti."],
      ["Zakaj lahko napaka pri numeričnem odvajanju za zelo majhen \\(h\\) spet naraste?", ["Ker funkcija ni več definirana", "Zaradi katastrofalnega odštevanja in zaokroževanja", "Ker Taylorjev razvoj preneha veljati za majhen \\(h\\)", "Ker se stopnja polinoma poveča"], 1, "Odštevanje skoraj enakih funkcijskih vrednosti poveča relativni vpliv računske napake."]
    ],
    "newton-cotes": [
      ["Kakšna je stopnja točnosti trapeznega pravila?", ["0", "1", "2", "3"], 1, "Trapez integrira konstante in linearne funkcije natanko, kvadratnih pa ne na splošno."],
      ["Kakšna je stopnja točnosti Simpsonovega pravila?", ["1", "2", "3", "4"], 2, "Zaradi simetrije je Simpsonovo pravilo točno tudi za kubične polinome."],
      ["Kakšna so vozlišča klasičnih Newton–Cotesovih pravil?", ["Vedno ničle Legendrovih polinomov", "Ekvidistantna", "Naključna", "Samo kompleksna"], 1, "Newton–Cotes izhaja iz interpolacije v enakomerno razmaknjenih vozliščih."],
      ["Kakšen je globalni red sestavljenega trapeznega pravila?", ["\\(O(h)\\)", "\\(O(h^2)\\)", "\\(O(h^3)\\)", "\\(O(h^4)\\)"], 1, "Lokalne napake reda \\(h^3\\) se na približno \\(1/h\\) podintervalih seštejejo v red \\(h^2\\)."],
      ["Katere relativne uteži uporablja Simpsonovo pravilo v treh vozliščih?", ["\\(1,1,1\\)", "\\(1,2,1\\)", "\\(1,4,1\\)", "\\(2,3,2\\)"], 2, "Po izpostavitvi faktorja \\((b-a)/6\\) so uteži \\(1,4,1\\)."]
    ],
    "izboljsana-integracija": [
      ["Kateri vodilni člen odstrani Richardsonova ekstrapolacija iz približka reda \\(p\\)?", ["Konstanto \\(I\\)", "Člen \\(Ch^p\\)", "Vse zaokrožitvene napake", "Funkcijsko vrednost na robu"], 1, "Kombinacija približkov pri \\(h\\) in \\(h/2\\) je izbrana prav za odpravo \\(Ch^p\\)."],
      ["Zakaj se v Rombergovi tabeli pojavi imenovalec \\(4^j-1\\)?", ["Ker trapezna napaka vsebuje sode potence \\(h^{2j}\\)", "Ker so vedno štirje podintervali", "Ker Simpson uporablja štiri točke", "Ker integriramo polinom četrte stopnje"], 0, "Zaporedne ekstrapolacije odpravljajo člene \\(h^2,h^4,h^6,\\ldots\\)."],
      ["Kakšno maksimalno stopnjo točnosti doseže Gaussovo pravilo z \\(n\\) vozlišči?", ["\\(n-1\\)", "\\(n\\)", "\\(2n-1\\)", "\\(2n\\)"], 2, "Prosta so tako vozlišča kot uteži, skupaj \\(2n\\) parametrov, kar omogoči točnost do stopnje \\(2n-1\\)."],
      ["Kateri sta vozlišči dvo-točkovnega Gauss–Legendrovega pravila na \\([-1,1]\\)?", ["\\(-1,1\\)", "\\(-1/2,1/2\\)", "\\(-1/\\sqrt3,1/\\sqrt3\\)", "\\(0,1\\)"], 2, "Vozlišči sta ničli Legendrovega polinoma \\(P_2\\)."],
      ["Kaj je osnovna ideja adaptivne kvadrature?", ["Povsod uporabimo isti izredno majhen korak", "Gostimo delitev le tam, kjer lokalna ocena napake to zahteva", "Vedno uporabimo eno Gaussovo vozlišče", "Ignoriramo gladkost funkcije"], 1, "Lokalno prilagajanje porabi več dela na težavnih delih in manj na položnih."]
    ],
    "euler-trapez": [
      ["Katera je eksplicitna Eulerjeva posodobitev?", ["\\(y_{n+1}=y_n+hf(x_{n+1},y_{n+1})\\)", "\\(y_{n+1}=y_n+hf(x_n,y_n)\\)", "\\(y_{n+1}=f(x_n,y_n)\\)", "\\(y_{n+1}=y_n/h\\)"], 1, "Eksplicitni Euler uporabi znani naklon v levi točki koraka."],
      ["Zakaj je implicitna Eulerjeva metoda implicitna?", ["Ker ne uporablja koraka", "Ker se \\(y_{n+1}\\) pojavi znotraj \\(f(x_{n+1},y_{n+1})\\)", "Ker potrebuje dve stari vrednosti", "Ker je četrtega reda"], 1, "Nova neznana vrednost nastopa na obeh straneh enačbe."],
      ["Kakšen globalni red ima Eulerjeva metoda?", ["0", "1", "2", "4"], 1, "Globalna napaka Eulerjeve metode je pri običajnih pogojih \\(O(h)\\)."],
      ["Katera je stabilnostna funkcija trapezne metode na \\(y'=\\lambda y\\)?", ["\\(1+z\\)", "\\(1/(1-z)\\)", "\\((1+z/2)/(1-z/2)\\)", "\\(e^z\\)"], 2, "Po razrešitvi \\(y_{n+1}=y_n+z(y_n+y_{n+1})/2\\) dobimo navedeni količnik."],
      ["Katera trditev velja za implicitni Euler na testni enačbi?", ["Ni stabilen za noben negativen \\(z\\)", "Je A-stabilen", "Je vedno ekspliciten", "Ima stabilnostno funkcijo \\(1+z\\)"], 1, "Njegova stabilnostna funkcija \\(R(z)=1/(1-z)\\) zadošča \\(|R(z)|<1\\) v levi kompleksni polravnini."]
    ],
    "runge-kutta": [
      ["Kaj predstavljajo \\(c\\), \\(A\\) in \\(b\\) v Butcherjevi tabeli?", ["Mrežo, rešitev in napako", "Časovne odmike, povezave med stopnjami in končne uteži", "Začetni in robni pogoj", "Koeficiente interpolacijskega polinoma"], 1, "Ti trije deli v celoti določajo Runge–Kutta metodo."],
      ["Kdaj je Runge–Kutta metoda eksplicitna?", ["Ko je \\(A\\) strogo spodnje trikotna", "Ko je \\(A\\) simetrična", "Ko so vse uteži \\(b_i=0\\)", "Ko ima samo implicitne stopnje"], 0, "Vsaka stopnja tedaj uporablja le že izračunane prejšnje stopnje."],
      ["Kateri pogoj je nujen za konsistentnost Runge–Kutta metode prvega reda?", ["\\(\\sum_i b_i=0\\)", "\\(\\sum_i b_i=1\\)", "\\(c_i=1\\) za vse \\(i\\)", "\\(A=I\\)"], 1, "Metoda mora pravilno integrirati konstanten naklon."],
      ["Kakšen red ima klasična metoda RK4?", ["1", "2", "3", "4"], 3, "Ob dovolj gladki desni strani ima globalno napako \\(O(h^4)\\)."],
      ["Kaj dodatno potrebuje veččlenska metoda, preden jo lahko začnemo uporabljati?", ["Več začetnih približkov", "Kompleksna vozlišča", "Afino preslikavo", "Konveksno ovojnico"], 0, "Ker uporablja več preteklih korakov, moramo manjkajoče začetne vrednosti dobiti z drugo metodo, pogosto z RK."]
    ],
    "robni-problemi": [
      ["Katera centralna formula aproksimira prvi odvod v \\(x_i\\)?", ["\\((y_{i+1}-y_i)/h\\)", "\\((y_i-y_{i-1})/h\\)", "\\((y_{i+1}-y_{i-1})/(2h)\\)", "\\((y_{i+1}-2y_i+y_{i-1})/h^2\\)"], 2, "Simetrična razlika uporablja soseda na obeh straneh in ima red dve."],
      ["Kakšna matrika navadno nastane pri diskretizaciji enodimenzionalnega problema drugega reda?", ["Diagonalna brez sosednjih členov", "Tridiagonalna", "Vedno gosta", "Ortogonalna"], 1, "Vsaka notranja enačba poveže \\(y_{i-1},y_i,y_{i+1}\\)."],
      ["Kaj naredimo z znanima Dirichletovima vrednostma \\(y_0\\) in \\(y_n\\)?", ["Obravnavamo ju kot neznanki brez enačb", "Vstavimo ju in njuna prispevka prenesemo na desno stran", "Vedno ju postavimo na nič", "Izračunamo ju z Eulerjem"], 1, "Robni vrednosti sta podatka, ne notranji neznanki sistema."],
      ["Kaj prilagajamo pri strelski metodi za problem drugega reda?", ["Neznani začetni odvod", "Dolžino intervala", "Stopnjo polinoma", "Število kontrolnih točk"], 0, "Za izbran začetni naklon rešimo začetni problem in merimo zgrešeni desni robni pogoj."],
      ["Kateri izraz je števec pet-točkovne aproksimacije \\(\\Delta u\\)?", ["\\(u_{i+1,j}-u_{i-1,j}\\)", "\\(u_{i+1,j}+u_{i-1,j}+u_{i,j+1}+u_{i,j-1}-4u_{ij}\\)", "\\(u_{ij}^2\\)", "\\(u_{i+1,j+1}-u_{i-1,j-1}\\)"], 1, "Štirje osni sosedi in sredinska utež \\(-4\\) dajo standardni pet-točkovni Laplaceov stencil."]
    ]
  };
  const examSpecs = {
    "aproksimacija": [
      [2, "Za \\(f(x)=x^2\\) na \\([0,1]\\) zapiši Bernsteinov polinom \\(B_2f\\) v potencni bazi in izračunaj \\(\\|f-B_2f\\|_\\infty\\). Pojasni, v kateri točki je največja napaka.", "Najprej uporabi vrednosti \\(f(0),f(1/2),f(1)\\), nato analiziraj kvadratno funkcijo napake."],
      [3, "Naj bo \\(X=\\mathbb R^2\\), \\(P=\\{\\alpha(-1,1):\\alpha\\in\\mathbb R\\}\\) in \\(x=(0,1)\\). Poišči vse elemente najboljše aproksimacije za \\(x\\) v \\(P\\) glede na \\(\\|\\cdot\\|_\\infty\\) in glede na \\(\\|\\cdot\\|_1\\).", "Minimiziraj funkciji \\(\\max\\{|\\alpha|,|1-\\alpha|\\}\\) in \\(|\\alpha|+|1-\\alpha|\\) po intervalih za \\(\\alpha\\)."],
      [2, "Za \\(f(x)=x^3\\) na \\([-1,1]\\) primerjaj kandidata \\(p_1(x)=x\\) in \\(p_2(x)=(x^2-1)/2\\) v enakomerni normi. Izračunaj obe normi napake in utemelji, kateri kandidat je boljši.", "Pri obeh napakah preveri krajišči in ničle odvoda; ne primerjaj le nekaj izbranih vrednosti."],
      [4, "Dokaži, da Bernsteinov operator ohranja konstante in linearne funkcije ter da za vsak \\(x\\in[0,1]\\) vrednost \\(B_nf(x)\\) leži med najmanjšo in največjo vzorčno vrednostjo \\(f(i/n)\\). Nato razloži vlogo teh lastnosti v Weierstrassovem izreku.", "Uporabi binomski identiteti za vsoto baznih funkcij in za \\(\\sum_i iB_i^n(x)\\)."]
    ],
    "remes-cebisev": [
      [2, "Z enim Remesovim korakom poišči premico \\(p\\), ki najbolje enakomerno aproksimira \\(f(x)=x^2\\) na \\(E=\\{0,1,2\\}\\). Nato preveri, da je ista premica optimalna tudi na celotnem intervalu \\([0,2]\\), in določi normo napake.", "Postavi \\(f(x_i)-p(x_i)=(-1)^im\\), nato poišči ekstreme \\(e(x)=x^2-p(x)\\)."],
      [3, "Z Remesovim postopkom določi parabolo \\(p\\), ki predstavlja najboljšo enakomerno aproksimacijo za \\(f(x)=1/(x^2+1)\\) na množici \\(E=\\{0,1,2,3\\}\\). Zapiši ves linearni sistem in končni \\(m\\).", "Vzemi \\(p(x)=a_0+a_1x+a_2x^2\\) in štiri izmenične enačbe za napako."],
      [3, "Za \\(f(x)=-16x\\cos(\\pi x)\\) naredi Remesov korak s parabolo na \\(E=\\{0,1/3,2/3,1\\}\\). Izračunaj polinom in \\(\\|f-p\\|_{\\infty,E}\\).", "Najprej natančno izračunaj štiri funkcijske vrednosti; ne zaokrožuj, preden rešiš sistem za \\(m,a_0,a_1,a_2\\)."],
      [4, "Formuliraj Čebiševov alternacijski izrek za \\(\\mathcal P_n\\). Razloži, kako iz njega nastane Remesov algoritem, zakaj je potrebnih \\(n+2\\) točk in kako po enem koraku preveriš, ali je treba množico točk posodobiti.", "Loči dokazni certifikat optimalnosti od računskega postopka za iskanje alternirajočih ekstremov."]
    ],
    "interpolacija": [
      [3, "Funkcijo \\(f(x)=1/(2+x)\\) interpoliraj v vozliščih \\(-1,0,1\\). Interpolant zapiši v Newtonovi obliki in čim bolje oceni \\(\\max_{x\\in[-1,1]}|f(x)-p_2(x)|\\) z ostankom interpolacije.", "Izračunaj tabelo deljenih diferenc in omeji \\(|f^{(3)}(\\xi)|\\) ter produkt \\(|(x+1)x(x-1)|\\)."],
      [3, "Poišči kubični Hermitov polinom \\(p\\), za katerega velja \\(p(-1)=0\\), \\(p(1)=2\\) in \\(p'(-1)=p'(1)=3\\). Če so podatki vzeti iz funkcije z \\(\\|f^{(4)}\\|_\\infty\\le1\\), oceni napako na \\([-1,1]\\).", "Uporabi ponovljeni vozlišči \\(-1,-1,1,1\\) ali reši sistem za štiri koeficiente; ostanek vsebuje \\((x+1)^2(x-1)^2/4!\\)."],
      [3, "Izračunaj confluentno deljeno diferenco \\(f[0,1,2,0,1,2]\\) za \\(f(x)=x^5\\) in utemelji rezultat brez sestavljanja nepregledne tabele.", "Deljena diferenca reda pet polinoma stopnje pet je njegov vodilni koeficient; pojasni, zakaj vrstni red vozlišč rezultata ne spremeni."],
      [4, "Poišči racionalno funkcijo \\(r(x)=p_1(x)/q_2(x)\\), kjer je \\(p_1\\) linearen, \\(q_2\\) pa kvadratičen in normiran z vodilnim ali konstantnim koeficientom, ki interpolira podatke \\((0,-1),(1,1),(2,2),(3,3)\\). Preveri, da imenovalec v podatkovnih točkah ni nič.", "Pogoje \\(p_1(x_i)=y_iq_2(x_i)\\) prepiši v linearen sistem; ena normalizacija odstrani skupni skalarni faktor."]
    ],
    "zlepki": [
      [4, "Za \\(f(x)=x^4\\) in vozlišča \\(0,1,2\\) zapiši zvezni linearni interpolacijski zlepek in kubični Hermitov zlepek, ki interpolira tudi odvode. Dokaži oceno \\(\\|f-H\\|_{\\infty,[0,2]}\\le1/16\\).", "Obravnavaj vsak enotski podinterval posebej in uporabi Hermitov ostanek \\(f^{(4)}(\\xi)(x-x_i)^2(x-x_{i+1})^2/4!\\)."],
      [3, "Določi \\(C^1\\) parabolični zlepek na \\([-1,1]\\) s stikom v \\(0\\), ki interpolira \\(f(x)=x^3\\) v \\(-1,0,1\\) in zadošča \\(S''(-1)=2\\). Zapiši oba kosa in preveri vse pogoje.", "Zapiši dva kvadratna polinoma; pogoji v stiku so enakost vrednosti in prvih odvodov."],
      [4, "Na \\([0,2]\\) poišči odsekoma kubični \\(C^2\\)-zlepek s stikom v \\(1\\), ki interpolira \\(f(x)=\\cos(\\pi x/2)\\) v \\(0,1,2\\) in zadošča naravnima pogojema \\(S''(0)=S''(2)=0\\).", "Uporabi po en kubični polinom na vsakem podintervalu; vrednost v stiku zapiši za oba kosa, nato dodaj pogoja za prvi in drugi odvod."],
      [2, "Za odsekoma podano funkcijo \\(S(x)=x^2+x\\) na \\([-1,0]\\) in \\(S(x)=x\\) na \\((0,1]\\) določi največji \\(k\\), za katerega je \\(S\\in C^k[-1,1]\\). Nato spremeni drugi kos z najmanjšim številom koeficientov tako, da bo stik razreda \\(C^2\\).", "Primerjaj leve in desne vrednosti prvih dveh odvodov pri \\(x=0\\)."]
    ],
    "bezier": [
      [3, "Robot najprej sledi kubični Bézierjevi krivulji s kontrolnimi točkami \\((-2,0),(-1,2),(1,2),(0,0)\\), nato kvadratni s točkami \\((0,0),(-1,-2),(3,0)\\). Valj ima središče \\((1,1/2)\\) in polmer \\(1/3\\). Z uporabo konveksnih ovojnic dokaži, da je obe krivulji mogoče izključiti iz valja, nato z de Casteljaujem izračunaj prvo krivuljo pri \\(t=3/4\\).", "Za varnost moraš dokazati prazen presek vsake konveksne ovojnice s krogom; neprazen presek ne bi bil certifikat varnosti."],
      [3, "Za kubično Bézierjevo krivuljo s kontrolnimi točkami \\((-2,-1),(1,3),(3,0),(-1,4)\\) z de Casteljaujevim postopkom izračunaj \\(b(1/2)\\). Nato vse kontrolne točke zavrti z matriko \\(R_\\varphi\\) in utemelji, zakaj s tem dobiš točno zavrteno krivuljo.", "Nariši vse tri ravni de Casteljaujeve sheme; pri drugem delu uporabi afino invariantnost."],
      [2, "Kvadratna Bézierjeva krivulja ima kontrolne točke \\((1,0),(3,3),(5,0)\\). Skiciraj kontrolni poligon in krivuljo ter določi parameter in točko, kjer je tangenta vzporedna osi \\(x\\).", "Zapiši kontrolni točki odvoda \\(2(b_1-b_0)\\) in \\(2(b_2-b_1)\\), nato ničli navpično komponento."],
      [4, "Iz definicije Bernsteinovih baz dokaži lastnost konveksne ovojnice in afino invariantnost Bézierjevih krivulj. Nato razloži, kaj konveksna ovojnica lahko in česa ne more dokazati pri preverjanju trka z oviro.", "Prazen presek ovojnice in ovire zadošča za izključitev trka; neprazen presek sam po sebi trka ne dokazuje."]
    ],
    "bezier-zlepki": [
      [4, "Kvadratna Bézierjeva krivulja \\(b\\) zadošča \\(b(0)=(-2,0)\\), \\(b'(1)=(4,-2)\\) in \\(b(1/2)=(0,2)\\). Določi njene kontrolne točke. Nato jo na \\([0,1/2]\\) uporabi kot \\(b(2u)\\) in na \\([1/2,2]\\) spoji s kvadratno \\(c((2u-1)/3)\\), kjer je \\(c_2=(1,-3)\\). Določi \\(c_0,c_1\\), da bo zlepek \\(C^1\\).", "Najprej reši \\(b_0,b_1,b_2\\). Pri stiku obvezno upoštevaj faktorja \\(2\\) in \\(2/3\\) iz verižnega pravila."],
      [4, "Dani sta kubični Bézierjevi krivulji z delno znanimi točkami \\(b_0=(-3,0), b_2=(5,4), c_0=(11,0), c_2=(18,-5), c_3=(24,-9)\\). V zlepku se prva uporablja kot \\(b(3t/2)\\) na \\([0,2/3]\\), druga kot \\(c(3t-2)\\) na \\([2/3,1]\\). Določi \\(b_1,b_3,c_1\\), da bo zlepek \\(C^2\\), nato z de Casteljaujem izračunaj vrednost pri \\(t=1/3\\).", "Zapiši zaporedoma pogoje za vrednost, prvi in drugi odvod; pri vsakem odvodu potenciraj merilo reparametrizacije."],
      [3, "Kubična Bézierjeva krivulja ima \\(b_1=(-1,0),b_2=(0,2),b_3=(1,-1)\\). Določi \\(b_0\\), da bo krivulja stopnje največ dve. Nato jo \\(C^1\\)-zvezno spoji s kvadratno krivuljo in izrazi prvi dve kontrolni točki novega kosa.", "Za znižanje stopnje uporabi tretjo končno razliko; za stik enači krajiščna odvoda z ustreznima faktorjema stopenj."],
      [3, "Kubična krivulja se konča s kontrolnima točkama \\(b_2=(1,2),b_3=(0,0)\\), kvadratna pa začne s \\(c_0=(0,0),c_1=(-1,-2)\\). Ugotovi, ali je sestavljena pot zvezna, ali je vektor hitrosti zvezen in ali je zvezna vsaj smer hitrosti.", "Primerjaj \\(3(b_3-b_2)\\) in \\(2(c_1-c_0)\\); za smer preveri pozitivno kolinearnost, za hitrost pa enakost." ]
    ],
    "odvajanje": [
      [3, "Izpelji pravilo za \\(f'(x_0)\\), ki uporablja \\(f(x_0),f(x_0+h),f(x_0+2h)\\) in je točno za polinome čim višje stopnje. Določi vodilni člen ostanka in preveri pravilo na polinomih \\(x^2+x\\), \\(x^3+3\\) in \\(x^4-3x^3+2x\\) pri \\(x_0=0,h=1\\).", "Uteži določi s točnostjo na \\(1,x-x_0,(x-x_0)^2\\); ostanek nato dobiš iz Taylorjevega člena tretje stopnje."],
      [4, "Pravilo ima obliko \\(f'(x_0)\\approx Af(x_0-3h/2)-Bf(x_0-h/2)+Bf(x_0+h/2)-Af(x_0+3h/2)\\). Določi \\(A,B\\), da bo točno za vse polinome stopnje največ tri, in izpelji njegov red.", "Zaradi antisimetrije sta konstanta in kvadratni člen že pravilna; postavi momentna pogoja za linearni in kubični člen."],
      [3, "S Taylorjevimi razvoji izpelji premo, obratno in simetrično diferenčno formulo za prvi odvod. Za vsako jasno označi vodilni člen ostanka in grafično razloži, kateri sekantni naklon uporablja.", "Razvij \\(f(x\\pm h)\\) okoli \\(x\\); pri simetrični razliki opazuj izničevanje sodih potenc."],
      [4, "Izpelji pet-točkovno simetrično pravilo za \\(f''(x_0)\\) na točkah \\(x_0-2h,x_0-h,x_0,x_0+h,x_0+2h\\), ki je točno za polinome čim višje stopnje. Določi red ostanka.", "Zaradi simetrije vzemi enaki zunanji in enaki notranji uteži ter zahtevaj točnost na sodih monomih." ]
    ],
    "newton-cotes": [
      [3, "Na tabli je ostal zapis \\(\\int_0^h f(x)\\,dx\\approx Af(0)+Bf(h)\\). Določi \\(A,B\\), da bo pravilo točno za polinome čim višje stopnje, določi stopnjo in izpelji člen napake.", "Uveljavi pravilo na \\(1,x,x^2\\); prva dva pogoja določita uteži, tretji pokaže prvo napako."],
      [3, "Z integracijo kvadratnega Lagrangeevega interpolanta v točkah \\(a,(a+b)/2,b\\) izpelji Simpsonovo pravilo. Dokaži stopnjo točnosti tri in zapiši obliko ostanka.", "Po izpeljavi uteži preveri monome do stopnje štiri; zaradi simetrije bo kubični člen še vedno točen."],
      [2, "S sestavljenim trapeznim in sestavljenim Simpsonovim pravilom pri isti mreži približaj \\(\\int_0^1 e^x\\,dx\\) z razmikom \\(h=1/4\\). Primerjaj absolutni napaki s točno vrednostjo \\(e-1\\).", "Za Simpsonovo pravilo potrebuješ sodo število podintervalov in uteži \\(1,4,2,4,1\\)."],
      [4, "Interval \\([a,b]\\) razdeli z \\(x_i=a+ih\\), \\(i=0,\\ldots,5\\). Določi \\(A,B\\), da bo pravilo \\(Q(f)=\\frac{5h}{24}\\bigl(11f(x_1)+Af(x_2)+Bf(x_3)+11f(x_4)\\bigr)\\) točno za polinome čim višje stopnje, in preveri doseženo stopnjo.", "Najprej uporabi \\(1\\) in \\(x-a\\); simetrija bo povezala \\(A\\) in \\(B\\), nato preveri še kvadratni in kubični monom." ]
    ],
    "izboljsana-integracija": [
      [4, "Naj bo \\(h=b-a\\). Izpelji pravilo oblike \\(\\int_a^b f(x)\\,dx=h(Af(a)+Bf(b))+h^2(Cf'(a)+Df'(b))+Ef^{(r)}(\\xi)\\), ki je točno za polinome čim višje stopnje. Določi \\(A,B,C,D,r,E\\).", "Uporabi monome \\(1,(x-a),\\ldots\\); prve štiri pogoje rešuj kot Hermitovo kvadraturo, nato na prvem netočnem monomu določi \\(r\\) in \\(E\\)."],
      [3, "Za \\(I=\\int_0^1e^x\\,dx\\) izračunaj trapezna približka \\(T_1\\) in \\(T_{1/2}\\), nato z enim Richardsonovim korakom dobi \\(R_{1,1}\\). Primerjaj napaki vseh treh približkov.", "Trapezna napaka se začne s členom reda \\(h^2\\), zato uporabi \\(R_{1,1}=(4T_{1/2}-T_1)/3\\)."],
      [3, "Napiši adaptivni Simpsonov algoritem za \\(\\int_a^b f(x)\\,dx\\): lokalno oceno napake, kriterij ustavitve, delitev tolerance med polovici in sestavo rezultata. Pojasni, zakaj je popravek deljen s \\(15\\).", "Primerjaj Simpsonov približek na celem intervalu z vsoto približkov na polovicah; uporabi red štiri."],
      [4, "Z metodo nedoločenih koeficientov izpelji dvo-točkovno Gauss–Legendreovo pravilo na \\([-1,1]\\). Določi obe vozlišči in uteži ter dokaži, da je pravilo točno do stopnje tri, ne pa štiri.", "Simetrija omogoči vozlišči \\(\\pm\\alpha\\) in enaki uteži; pogoja za monoma \\(1\\) in \\(x^2\\) določita parametra." ]
    ],
    "euler-trapez": [
      [3, "Za začetni problem \\(y'=-2x,\\ y(0)=1\\) uporabi \\(h=1/2\\) in izračunaj približka v \\(1/2\\) in \\(1\\) z eksplicitnim ter implicitnim Eulerjem. Nato za \\(h=1/n\\) izpelji napako v \\(x=1\\) in najmanjši \\(n\\), da je manjša od \\(0.1\\).", "Pri splošnem \\(n\\) seštej aritmetično zaporedje mrežnih točk; točna rešitev je \\(1-x^2\\)."],
      [3, "Za \\(y'=(2x+1)y,\\ y(0)=2\\) izračunaj približek \\(y(1/2)\\) z eksplicitnim in implicitnim Eulerjem pri \\(h=1/4\\). Primerjaj oba s točno vrednostjo \\(2e^{x(x+1)}\\).", "Naredi dva koraka vsake metode; pri implicitnem Eulerju v vsakem koraku najprej algebraično izoliraj novo vrednost."],
      [4, "Za \\(y'=-4y,\\ y(0)=1\\) uporabi trapezno metodo z \\(h=1/3\\) do \\(x=1\\). Nato za splošni \\(h>0\\) izpelji \\(y_n\\) in dokaži, da \\(y_n\\to0\\) pri \\(n\\to\\infty\\).", "Izpelji faktor \\(R(-4h)\\) iz implicitne enačbe in preveri, da ima njegova absolutna vrednost za vsak \\(h>0\\) velikost manjšo od ena."],
      [4, "Na testni enačbi \\(y'=\\lambda y\\) izpelji stabilnostne funkcije eksplicitnega Eulerja, implicitnega Eulerja in trapezne metode. Skiciraj njihove intervale absolutne stabilnosti na negativni realni osi in razloži razliko med A-stabilnostjo in L-stabilnostjo.", "Za vsako metodo algebraično izrazi \\(y_{n+1}=R(z)y_n\\), kjer je \\(z=h\\lambda\\)." ]
    ],
    "runge-kutta": [
      [4, "Runge–Kutta metoda je podana s tabelo \\(\\begin{array}{c|cc}0&1/2&0\\\\1&1/2&0\\\\\\hline&1/2&1/2\\end{array}\\). Z dvema korakoma in \\(h=1\\) izračunaj približek \\(y(2)\\) za \\(y'=2x+y,\\ y(0)=1\\).", "Prva stopnja je implicitna, ker vsebuje samo sebe. V vsakem koraku najprej reši linearno enačbo za \\(k_1\\), nato izračunaj \\(k_2\\)."],
      [3, "Za metodo \\(\\begin{array}{c|ccc}0&0&0&0\\\\1/2&1/2&0&0\\\\1&-1&2&0\\\\\\hline&1/6&2/3&1/6\\end{array}\\) naredi en korak z \\(h=1\\) za \\(y'=x+y,\\ y(0)=1\\). Jasno izpiši vse tri stopnje in novo vrednost.", "Tabela je eksplicitna: stopnje računaj od zgoraj navzdol in pri vsaki uporabi ustrezen časovni odmik \\(c_i h\\)."],
      [3, "S klasično metodo RK4 in korakom \\(h=\\pi\\) naredi dva koraka za \\(y'=\\sin x\\cos y,\\ y(0)=0\\). Zapiši vse naklone, tudi kadar so zaradi trigonometričnih vrednosti ničelni.", "Uporabi čase \\(x_n,x_n+h/2,x_n+h/2,x_n+h\\) in klasične uteži \\(1,2,2,1\\)."],
      [4, "Iz integralne oblike začetnega problema motiviraj prehod od Eulerjeve metode k dvostopenjski eksplicitni Runge–Kutta metodi. Izpelji pogoje reda dve za splošne \\(a_{21},b_1,b_2,c_2\\), nato primerjaj samostartnost RK z Adams–Bashforthovo dvočlensko metodo.", "Primerjaj Taylorjev razvoj numeričnega koraka s Taylorjevim razvojem točne rešitve do členov reda \\(h^2\\)." ]
    ],
    "robni-problemi": [
      [4, "Za robni problem \\(y''-4y'+4y=x\\) na \\((0,3)\\) z \\(y(0)=y(3)=1\\) uporabi centralne diference in \\(h=1\\). Sestavi linearni sistem za \\(y_1\\approx y(1)\\), \\(y_2\\approx y(2)\\) in ga reši.", "V vsaki notranji točki vstavi \\(y''(x_i)\\approx y_{i+1}-2y_i+y_{i-1}\\) in \\(y'(x_i)\\approx(y_{i+1}-y_{i-1})/2\\)."],
      [3, "Za \\(-y''(x)+q(x)y(x)=r(x)\\) na \\([a,b]\\) z Dirichletovima pogojema sestavi diferenčno metodo drugega reda na enakomerni mreži. Zapiši vse tri diagonale matrike in pokaži, kam vstopita robni vrednosti.", "Centralno drugo razliko pomnoži z \\(-1\\); neznanke so le notranje vrednosti \\(y_1,\\ldots,y_{n-1}\\)."],
      [4, "Robni problem \\(y''=-y\\), \\(y(0)=0\\), \\(y(\\pi/2)=1\\) reši s strelsko metodo: uvedi neznani začetni naklon \\(s=y'(0)\\), zapiši pripadajoči sistem prvega reda in enačbo, s katero določiš \\(s\\). Razloži tudi numerično različico, ko točne rešitve sistema ne poznaš.", "Rešitev je linearno odvisna od začetnega naklona; v numerični različici ničlo funkcije zgreška na desnem robu iščeš s sekantno ali Newtonovo metodo."],
      [4, "Za Poissonov problem \\(-\\Delta u=f\\) na kvadratu z danimi Dirichletovimi robnimi vrednostmi izpelji pet-točkovno diferenčno enačbo v notranjem vozlišču. Opiši oštevilčenje neznank, strukturo matrike in red lokalne napake.", "Uporabi centralni drugi razliki v smereh \\(x\\) in \\(y\\); robne sosede prenesi na desno stran." ]
    ]
  };

  const quizQuestions = TOPIC_IDS.flatMap(topic =>
    (quizSpecs[topic] || []).map(([prompt, options, correct, explanation], index) => ({
      id: `q-${topic}-${index + 1}`,
      topic,
      prompt,
      options,
      correct,
      explanation
    }))
  );

  const chapterByTopic = {
    "aproksimacija": 1,
    "remes-cebisev": 1,
    "interpolacija": 1,
    "zlepki": 1,
    "bezier": 2,
    "bezier-zlepki": 2,
    "odvajanje": 3,
    "newton-cotes": 3,
    "izboljsana-integracija": 3,
    "euler-trapez": 4,
    "runge-kutta": 4,
    "robni-problemi": 4
  };

  const examQuestions = TOPIC_IDS.flatMap(topic =>
    (examSpecs[topic] || []).map(([difficulty, prompt, hint], index) => ({
      id: `e-${topic}-${index + 1}`,
      topic,
      chapter: chapterByTopic[topic],
      difficulty,
      prompt,
      hint,
      points: 20
    }))
  );

  window.NUM2_PRACTICE = { flashcards, quizQuestions, examQuestions };
})();
