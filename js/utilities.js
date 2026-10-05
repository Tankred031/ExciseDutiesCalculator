/* ------------------------------------------------------------------
 * Zajedničke funkcije za sve kalkulatore
 * ------------------------------------------------------------------ */

/**
 * Pretvara tekst u broj. Podržava hrvatski ("1.234,56", "2,65")
 * i engleski ("1,234.56", "2.65") zapis. Vraća NaN ako unos nije broj.
 */
function parseBroj(tekst) {
    let t = String(tekst).replace(/[\s ]/g, "");

    if (t === "") {
        return NaN;
    }

    const zadnjiZarez = t.lastIndexOf(",");
    const zadnjaTocka = t.lastIndexOf(".");

    if (zadnjiZarez !== -1 && zadnjaTocka !== -1) {
        // Zadnji separator je decimalni, onaj drugi je za tisućice
        const decimalni = zadnjiZarez > zadnjaTocka ? "," : ".";
        const tisucice = decimalni === "," ? "." : ",";
        t = t.split(tisucice).join("").replace(decimalni, ".");
    } else if (zadnjiZarez !== -1) {
        t = t.split(",").length > 2 ? t.split(",").join("") : t.replace(",", ".");
    } else if (zadnjaTocka !== -1 && t.split(".").length > 2) {
        t = t.split(".").join("");
    }

    return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
}

function procitajBroj(input) {
    return parseBroj(input.value);
}

function formatBroj(broj) {
    return Number(broj).toLocaleString("hr-HR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/* ------------------------------------------------------------------
 * Validacija
 * ------------------------------------------------------------------ */

function oznaciGresku(polje, jeGreska) {
    polje.classList.toggle("invalid", jeGreska);

    if (jeGreska) {
        polje.setAttribute("aria-invalid", "true");
    } else {
        polje.removeAttribute("aria-invalid");
    }
}

/**
 * Čita broj iz polja. Ako je unos neispravan, upiše grešku u listu `greske`
 * i vrati NaN.
 *
 * opcije: { min (zadano 0), max, iznadMin (true = min nije dopušten) }
 */
function uzmiBroj(input, naziv, greske, opcije = {}) {
    const { min = 0, max = Infinity, iznadMin = false } = opcije;
    const vrijednost = procitajBroj(input);

    let poruka = "";

    if (input.value.trim() === "") {
        poruka = `${naziv}: unesi vrijednost.`;
    } else if (Number.isNaN(vrijednost)) {
        poruka = `${naziv}: "${input.value.trim()}" nije ispravan broj.`;
    } else if (iznadMin ? vrijednost <= min : vrijednost < min) {
        poruka = iznadMin
            ? `${naziv}: mora biti veće od ${formatBroj(min)}.`
            : `${naziv}: ne može biti manje od ${formatBroj(min)}.`;
    } else if (vrijednost > max) {
        poruka = `${naziv}: ne može biti veće od ${formatBroj(max)}.`;
    }

    if (poruka) {
        greske.push({ polje: input, poruka });
        return NaN;
    }

    return vrijednost;
}

/** Provjerava je li u padajućem izborniku nešto odabrano. */
function uzmiOdabir(select, naziv, greske) {
    if (!select.value) {
        greske.push({ polje: select, poruka: `${naziv}: odaberi opciju.` });
        return "";
    }

    return select.value;
}

function ocistiGreske(forma) {
    forma.querySelectorAll(".invalid").forEach(polje => oznaciGresku(polje, false));
}

function prikaziGreske(rezultat, greske) {
    rezultat.classList.remove("zastarjelo");
    rezultat.className = "rezultat rezultat-greska";
    rezultat.replaceChildren();

    const naslov = document.createElement("p");
    naslov.className = "rezultat-naslov";
    naslov.textContent = "Provjeri unos:";
    rezultat.appendChild(naslov);

    const lista = document.createElement("ul");

    greske.forEach(greska => {
        oznaciGresku(greska.polje, true);

        const stavka = document.createElement("li");
        stavka.textContent = greska.poruka;
        lista.appendChild(stavka);
    });

    rezultat.appendChild(lista);
    greske[0].polje.focus();
}

/* ------------------------------------------------------------------
 * Prikaz rezultata
 * ------------------------------------------------------------------ */

/**
 * opis: {
 *   redovi:   [{ naziv, iznos }, ... ili "---" za razdjelnik],
 *   ukupno:   { naziv, iznos },
 *   napomene: ["tekst", ...]
 * }
 * Sav tekst ide kroz textContent, nikad kroz innerHTML.
 */
function prikaziRezultat(rezultat, opis) {
    rezultat.className = "rezultat rezultat-ok";
    rezultat.replaceChildren();

    const tekstZaKopiranje = [];
    const lista = document.createElement("dl");
    lista.className = "rezultat-lista";

    opis.redovi.forEach(red => {
        if (red === "---") {
            const crta = document.createElement("hr");
            lista.appendChild(crta);
            return;
        }

        const naziv = document.createElement("dt");
        naziv.textContent = red.naziv;

        const iznos = document.createElement("dd");
        iznos.textContent = `${formatBroj(red.iznos)} €`;

        lista.append(naziv, iznos);
        tekstZaKopiranje.push(`${red.naziv}: ${formatBroj(red.iznos)} €`);
    });

    rezultat.appendChild(lista);

    const ukupno = document.createElement("div");
    ukupno.className = "rezultat-ukupno";

    const ukupnoNaziv = document.createElement("span");
    ukupnoNaziv.textContent = opis.ukupno.naziv;

    const ukupnoIznos = document.createElement("strong");
    ukupnoIznos.textContent = `${formatBroj(opis.ukupno.iznos)} €`;

    ukupno.append(ukupnoNaziv, ukupnoIznos);
    rezultat.appendChild(ukupno);
    tekstZaKopiranje.push(`${opis.ukupno.naziv}: ${formatBroj(opis.ukupno.iznos)} €`);

    (opis.napomene || []).forEach(tekst => {
        const napomena = document.createElement("p");
        napomena.className = "rezultat-napomena";

        const oznaka = document.createElement("strong");
        oznaka.textContent = "Napomena: ";

        napomena.append(oznaka, document.createTextNode(tekst));
        rezultat.appendChild(napomena);
        tekstZaKopiranje.push(`Napomena: ${tekst}`);
    });

    const kopiraj = document.createElement("button");
    kopiraj.type = "button";
    kopiraj.className = "gumb-kopiraj";
    kopiraj.textContent = "Kopiraj rezultat";
    kopiraj.addEventListener("click", () => kopirajTekst(tekstZaKopiranje.join("\n"), kopiraj));
    rezultat.appendChild(kopiraj);
}

function kopirajTekst(tekst, gumb) {
    const javi = poruka => {
        const staro = gumb.textContent;
        gumb.textContent = poruka;
        setTimeout(() => { gumb.textContent = staro; }, 1800);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(tekst).then(
            () => javi("Kopirano ✓"),
            () => javi("Kopiranje nije uspjelo")
        );
        return;
    }

    // Rezervno rješenje za preglednike bez Clipboard API-ja
    const privremeno = document.createElement("textarea");
    privremeno.value = tekst;
    privremeno.style.position = "fixed";
    privremeno.style.opacity = "0";
    document.body.appendChild(privremeno);
    privremeno.select();

    try {
        document.execCommand("copy");
        javi("Kopirano ✓");
    } catch (e) {
        javi("Kopiranje nije uspjelo");
    }

    privremeno.remove();
}

/* ------------------------------------------------------------------
 * Povezivanje forme
 * ------------------------------------------------------------------ */

/**
 * Forma se šalje gumbom ili tipkom Enter. Funkcija `izracunaj`
 * dobiva praznu listu grešaka; ako je ona nakon poziva puna, prikazuju se greške.
 * Kad korisnik promijeni bilo koji unos, stari rezultat se označi kao zastarjeli.
 */
function pokreniKalkulator(forma, rezultat, izracunaj) {
    forma.addEventListener("submit", event => {
        event.preventDefault();
        ocistiGreske(forma);

        const greske = [];

        try {
            izracunaj(greske);
        } catch (error) {
            console.error(error);
            greske.length = 0;
            greske.push({ polje: forma.querySelector("input, select"), poruka: "Došlo je do neočekivane greške u izračunu. Osvježi stranicu i pokušaj ponovno." });
        }

        if (greske.length > 0) {
            prikaziGreske(rezultat, greske);
        }
    });

    const oznaciZastarjelo = event => {
        if (event.target.classList) {
            oznaciGresku(event.target, false);
        }

        if (rezultat.classList.contains("rezultat-ok")) {
            rezultat.classList.add("zastarjelo");
        }
    };

    forma.addEventListener("input", oznaciZastarjelo);
    forma.addEventListener("change", oznaciZastarjelo);
}
