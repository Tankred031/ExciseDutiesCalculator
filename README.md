# ExciseDutiesCalculator

Frontend web aplikacija za izračun posebnih poreza, trošarina, carine i PDV-a za različite skupine proizvoda.

Projekt je izrađen kao praktična vježba iz HTML-a, CSS-a i JavaScripta, s naglaskom na pretvaranje stvarnih obračunskih pravila i Excel formula u interaktivni web kalkulator.

Aplikacija je zamišljena kao jednostavan pomoćni alat za izračun davanja pri uvozu ili obračunu proizvoda koji podliježu posebnim porezima i trošarinama.

---

## Ideja projekta

Projekt je započet kao brzi kalkulator u Excelu, u kojem su formule služile za izračun posebnih poreza, trošarina, carine i PDV-a na temelju unesenih vrijednosti i količina.

Nakon toga je ideja pretočena u web aplikaciju kako bi se spojilo ugodno i korisno: vježbanje frontend razvoja kroz HTML, CSS i JavaScript, uz korištenje stvarnih obračunskih podataka i logike iz Excel tablica.

Na taj način projekt nije zamišljen samo kao tehnička vježba, nego kao praktičan alat koji povezuje učenje programiranja s konkretnim poslovnim i obračunskim primjerima.

## Tehnologije

* HTML
* CSS
* JavaScript
* Vanilla JS
* DOM manipulacija
* Local file struktura

---

## Glavne funkcionalnosti

### Poseban porez na kavu

* Izračun posebnog poreza prema neto težini u kilogramima
* Odabir tarifnog broja
* Primjena različitih stopa za kavu, ekstrakte, koncentrate i pripravke
* Izračun carine prema vrijednosti robe
* Izračun PDV-a
* Ispis ukupnih davanja

### Poseban porez na bezalkoholna pića

* Odabir vrste proizvoda: sok ili sirup
* Odabir tarifnog broja
* Izračun posebnog poreza prema volumenu
* Dodatni obračun prema sadržaju šećera, taurina ili metil-ksantina
* Posebna logika za bezalkoholno pivo
* Izračun carine po jedinstvenoj stopi
* Izračun PDV-a
* Ispis ukupnih davanja

### Početni izbornik

* Kartice za različite vrste davanja
* Navigacija prema pojedinim kalkulatorima
* Vizualno odvojene cjeline prema vrsti proizvoda:

  * kava
  * bezalkoholna pića
  * alkoholna pića
  * duhanski proizvodi


## Cilj projekta

Cilj projekta je vježbati izradu praktične frontend aplikacije kroz stvaran obračunski primjer.

Poseban naglasak stavljen je na:

* rad s formama
* dohvaćanje vrijednosti iz inputa
* rad s `select` elementima i radio buttonima
* izračune u JavaScriptu
* uvjetnu logiku
* objekte sa stopama
* prikaz rezultata u DOM-u
* organizaciju više HTML, CSS i JS datoteka
* izradu preglednog korisničkog sučelja

---

## Obračunska logika

Aplikacija koristi unaprijed definirane stope posebnih poreza, trošarina i carina.

Primjeri obračuna uključuju:

* posebni porez po kilogramu
* posebni porez po hektolitru
* carinu kao postotak vrijednosti robe
* PDV na osnovicu koja uključuje vrijednost robe i davanja
* posebne napomene za proizvode koji podliježu dodatnim pravilima

---

## Trenutni status

Projekt je u razvoju.

Trenutno su u fokusu:

* kalkulator za kavu
* kalkulator za bezalkoholna pića
* početna navigacijska stranica
* vizualno odvajanje pojedinih kategorija proizvoda

Planirano je daljnje proširenje za:

* alkoholna pića
* duhanske proizvode
* dodatne validacije
* bolji prikaz grešaka
* detaljnije objašnjenje obračuna
* moguće spremanje ili izvoz rezultata

---

## Buduća poboljšanja

* Validacija praznih polja
* Upozorenja za neodabrane tarifne brojeve
* Detaljan breakdown obračuna
* Print verzija izračuna
* Export u PDF
* Export u Excel
* React verzija aplikacije
* Backend verzija s bazom stopa i tarifnih brojeva
* Administracija stopa i obračunskih pravila

---

## Napomena

Aplikacija je edukativnog i pomoćnog karaktera.

Za službene obračune potrebno je provjeriti važeće propise, tarifne brojeve, carinske stope i porezne odredbe prema službenim izvorima.

---

## Autor

Izradio Tankred Kralj.
