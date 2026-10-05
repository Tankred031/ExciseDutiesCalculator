const MAKSIMALNO_REDOVA = 10;
const PUTANJA_CERTIFIKATA = "../documents/fgas-certifikat.pdf";

const tablicaRedovi = document.getElementById("tablica-redovi");
const ukupnoKgSveEl = document.getElementById("ukupno_kg_sve");
const ukupnoToneSveEl = document.getElementById("ukupno_tone_sve");
const statusIzracuna = document.getElementById("statusIzracuna");
const statusCertifikata = document.getElementById("statusCertifikata");

// [GWP vrijednost, oznaka plina]
const GWP_OPCIJE = [
    [675, "675 (R-32)"],
    [1430, "1430 (R-134a)"],
    [3922, "3922 (R-404A)"],
    [1774, "1774 (R-407C)"],
    [2087, "2087 (R-410A)"],
    [1400, "1400 (R-448A/49A)"],
    [490, "490 (R-454B)"],
    [150, "150 (R-454C)"],
    [1, "<1 (R-1234yf/ze)"],
    [24300, "24300 (SF6)"]
];

const PODRAZUMIJEVANI_GWP = 150;

function napraviCeliju(klasa) {
    const celija = document.createElement("td");

    if (klasa) {
        celija.className = klasa;
    }

    return celija;
}

function napraviUnos(klasa, oznaka) {
    const unos = document.createElement("input");
    unos.type = "text";
    unos.inputMode = "decimal";
    unos.autocomplete = "off";
    unos.className = klasa;
    unos.value = "0";
    unos.setAttribute("aria-label", oznaka);

    return unos;
}

function napraviGumb(klasa, tekst, naslov, oznaka) {
    const gumb = document.createElement("button");
    gumb.type = "button";
    gumb.className = `icon-btn ${klasa}`;
    gumb.textContent = tekst;
    gumb.title = naslov;
    gumb.setAttribute("aria-label", oznaka);

    return gumb;
}

function napraviRedak() {
    const red = document.createElement("tr");

    const brojReda = napraviCeliju("result-highlight broj-reda");
    brojReda.textContent = "1";

    const celijaKomada = napraviCeliju();
    celijaKomada.appendChild(napraviUnos("komada", "Komada"));

    const celijaKg = napraviCeliju();
    celijaKg.appendChild(napraviUnos("kg", "kg po komadu"));

    const ukupnoKg = napraviCeliju("result-highlight ukupno-kg");
    ukupnoKg.textContent = "0,00";

    const celijaGwp = napraviCeliju();
    const gwp = document.createElement("select");
    gwp.className = "gwp";
    gwp.setAttribute("aria-label", "GWP");

    GWP_OPCIJE.forEach(([vrijednost, tekst]) => {
        const opcija = document.createElement("option");
        opcija.value = vrijednost;
        opcija.textContent = tekst;
        opcija.selected = vrijednost === PODRAZUMIJEVANI_GWP;
        gwp.appendChild(opcija);
    });

    celijaGwp.appendChild(gwp);

    const tone = napraviCeliju("final-result tone");
    tone.textContent = "0,00";

    const akcije = napraviCeliju("action-cell");
    akcije.append(
        napraviGumb("icon-add", "➕", "Dodaj redak ispod", "Dodaj redak ispod"),
        napraviGumb("icon-remove", "🗑️", "Obriši redak", "Obriši redak")
    );

    red.append(brojReda, celijaKomada, celijaKg, ukupnoKg, celijaGwp, tone, akcije);

    return red;
}

function dodajRedakIspod(trenutniRed) {
    if (tablicaRedovi.querySelectorAll("tr").length >= MAKSIMALNO_REDOVA) {
        statusIzracuna.textContent = `Možeš dodati najviše ${MAKSIMALNO_REDOVA} redova.`;
        return;
    }

    trenutniRed.after(napraviRedak());

    obnoviBrojeveRedova();
    izracunaj();
}

function obrisiRedak(trenutniRed) {
    if (tablicaRedovi.querySelectorAll("tr").length <= 1) {
        statusIzracuna.textContent = "Mora ostati barem jedan redak.";
        return;
    }

    trenutniRed.remove();

    obnoviBrojeveRedova();
    izracunaj();
}

function obnoviBrojeveRedova() {
    document.querySelectorAll(".broj-reda").forEach((broj, index) => {
        broj.textContent = index + 1;
    });
}

/** Prazno polje je 0; slova ili negativan broj su greška. */
function procitajPoljeRetka(unos) {
    if (unos.value.trim() === "") {
        return 0;
    }

    const broj = parseBroj(unos.value);

    return Number.isNaN(broj) || broj < 0 ? NaN : broj;
}

function izracunaj() {
    let ukupnoKgSve = 0;
    let ukupnoToneSve = 0;
    let imaGresaka = false;

    statusIzracuna.textContent = "";

    tablicaRedovi.querySelectorAll("tr").forEach(red => {
        const komadaUnos = red.querySelector(".komada");
        const kgUnos = red.querySelector(".kg");

        const komada = procitajPoljeRetka(komadaUnos);
        const kg = procitajPoljeRetka(kgUnos);
        const gwp = Number(red.querySelector(".gwp").value);

        oznaciGresku(komadaUnos, Number.isNaN(komada));
        oznaciGresku(kgUnos, Number.isNaN(kg));

        if (Number.isNaN(komada) || Number.isNaN(kg)) {
            imaGresaka = true;
            red.querySelector(".ukupno-kg").textContent = "—";
            red.querySelector(".tone").textContent = "—";
            return;
        }

        const ukupnoKg = komada * kg;
        const tone = ukupnoKg * gwp / 1000;

        red.querySelector(".ukupno-kg").textContent = formatBroj(ukupnoKg);
        red.querySelector(".tone").textContent = formatBroj(tone);

        ukupnoKgSve += ukupnoKg;
        ukupnoToneSve += tone;
    });

    if (imaGresaka) {
        // Ne prikazuj djelomičan zbroj koji bi izgledao kao točan
        ukupnoKgSveEl.textContent = "—";
        ukupnoToneSveEl.textContent = "—";
        statusIzracuna.textContent = "Provjeri označena polja: dopušteni su samo brojevi veći ili jednaki nuli.";
        return;
    }

    ukupnoKgSveEl.textContent = formatBroj(ukupnoKgSve);
    ukupnoToneSveEl.textContent = formatBroj(ukupnoToneSve);
}

async function printCertifikat() {
    statusCertifikata.textContent = "";

    try {
        const odgovor = await fetch(PUTANJA_CERTIFIKATA, { method: "HEAD" });
        const jePdf = (odgovor.headers.get("content-type") || "").includes("pdf");

        if (!odgovor.ok || !jePdf) {
            throw new Error("PDF nije dostupan");
        }
    } catch (error) {
        statusCertifikata.textContent = "PDF certifikat trenutno nije dostupan na ovoj stranici.";
        return;
    }

    const pdfProzor = window.open(PUTANJA_CERTIFIKATA, "_blank");

    if (pdfProzor) {
        pdfProzor.addEventListener("load", () => pdfProzor.print());
    } else {
        statusCertifikata.textContent = "Preglednik je blokirao otvaranje PDF-a. Dopusti skočne prozore za ovu stranicu.";
    }
}

tablicaRedovi.addEventListener("input", izracunaj);
tablicaRedovi.addEventListener("change", izracunaj);

tablicaRedovi.addEventListener("click", event => {
    const gumb = event.target.closest(".icon-btn");

    if (!gumb) {
        return;
    }

    const red = gumb.closest("tr");

    if (gumb.classList.contains("icon-add")) {
        dodajRedakIspod(red);
    } else if (gumb.classList.contains("icon-remove")) {
        obrisiRedak(red);
    }
});

document.getElementById("gumbCertifikat").addEventListener("click", printCertifikat);

const prviRed = napraviRedak();
tablicaRedovi.appendChild(prviRed);

prviRed.querySelector(".komada").value = 40;
prviRed.querySelector(".kg").value = 2;

obnoviBrojeveRedova();
izracunaj();
