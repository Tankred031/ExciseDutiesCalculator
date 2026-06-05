const litaraInput = document.getElementById("litara");
const vrstaProizvoda = document.getElementById("vrstaProizvoda");
const osnovaObracuna = document.getElementById("osnovaObracuna");
const sadrzajInput = document.getElementById("sadrzaj");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");
const izracunajBtn = document.getElementById("izracunajBtn");

const STOPA_CARINE = 9.6;
const STOPA_PDV = 0.25;

const stopeVolumen = {
    pice: 2.65,
    sirup: 18.58
};

const stopeTaurin = {
    pice: 26.54,
    sirup: 185.81
};

const stopeMetilKsantin = {
    pice: 10.62,
    sirup: 74.32
};

const kategorijeSecera = {
    pice: [
        { tekst: "do 2 g/100 ml", stopa: 0 },
        { tekst: "više od 2 do 5 g/100 ml", stopa: 1.33 },
        { tekst: "više od 5 do 8 g/100 ml", stopa: 3.98 },
        { tekst: "više od 8 g/100 ml", stopa: 7.96 }
    ],
    sirup: [
        { tekst: "do 14 g/100 ml", stopa: 0 },
        { tekst: "više od 14 do 35 g/100 ml", stopa: 9.29 },
        { tekst: "više od 35 do 56 g/100 ml", stopa: 27.87 },
        { tekst: "više od 56 g/100 ml", stopa: 55.74 }
    ]
};

function dohvatiNazivVrste(vrsta) {
    if (vrsta === "pice") return "sok / gotovo piće";
    if (vrsta === "sirup") return "sirup / koncentrat";

    return "nije odabrano";
}

function dohvatiNazivOsnove(osnova) {
    if (osnova === "secer") return "šećer";
    if (osnova === "taurin") return "taurin";
    if (osnova === "metilKsantin") return "metil-ksantin";

    return "nije odabrano";
}

function dohvatiNazivTarifnogBroja(tarifniBroj) {
    if (tarifniBroj === "2009") return "2009 Voćni sokovi s dodanim šećerom";
    if (tarifniBroj === "220210") return "2202 10 Vode sa sladilima/šećerom";
    if (tarifniBroj === "220291") return "2202 91 Bezalkoholno pivo";
    if (tarifniBroj === "2205") return "2205 Vermuti s alk. manjim od 1.2%";
    if (tarifniBroj === "2206") return "2206 Jabukovače, medovine s alk. manjim od 1.2%";
    if (tarifniBroj === "2208") return "2208 Likeri s alk. manjim od 1.2%";

    return "nije odabrano";
}

function dohvatiOdabranuVrstu() {
    const odabraniRadio = document.querySelector('input[name="tipProizvoda"]:checked');

    if (!odabraniRadio) {
        return "";
    }

    return odabraniRadio.value;
}

function napuniOpcijeSadrzaja() {
    const vrsta = dohvatiOdabranuVrstu();
    const osnova = osnovaObracuna.value;

    sadrzajInput.innerHTML = "";

    if (!vrsta || !osnova) {
        sadrzajInput.innerHTML = `<option value="">Odaberi kategoriju</option>`;
        return;
    }

    if (vrstaProizvoda.value === "220291") {
        sadrzajInput.innerHTML = `<option value="0">Nije primjenjivo za bezalkoholno pivo</option>`;
        return;
    }

    if (osnova === "secer") {
        sadrzajInput.innerHTML = `<option value="">Odaberi udio šećera</option>`;

        kategorijeSecera[vrsta].forEach(kategorija => {
            sadrzajInput.innerHTML += `
                <option value="${kategorija.stopa}">
                    ${kategorija.tekst} — ${formatBroj(kategorija.stopa)} €/hl
                </option>
            `;
        });
    }

    if (osnova === "taurin") {
        const stopa = stopeTaurin[vrsta] || 0;

        sadrzajInput.innerHTML = `
            <option value="${stopa}">
                Taurin — ${formatBroj(stopa)} €/hl
            </option>
        `;
    }

    if (osnova === "metilKsantin") {
        const stopa = stopeMetilKsantin[vrsta] || 0;

        sadrzajInput.innerHTML = `
            <option value="${stopa}">
                Metil-ksantin — ${formatBroj(stopa)} €/hl
            </option>
        `;
    }
}

function provjeriBezalkoholnoPivo() {
    if (vrstaProizvoda.value === "220291") {
        osnovaObracuna.disabled = true;
        sadrzajInput.disabled = true;

        sadrzajInput.innerHTML = `
            <option value="0">Nije primjenjivo za bezalkoholno pivo</option>
        `;
    } else {
        osnovaObracuna.disabled = false;
        sadrzajInput.disabled = false;

        napuniOpcijeSadrzaja();
    }
}

function izracunajDavanja() {
    const litara = procitajBroj(litaraInput);
    const hektolitara = litara / 100;

    const vrsta = dohvatiOdabranuVrstu();
    const tarifniBroj = vrstaProizvoda.value;
    const osnova = osnovaObracuna.value;
    const vrijednostRobe = NumprocitajBrojber(vrijednostRobeInput);

    const stopaVolumen = stopeVolumen[vrsta] || 0;
    const iznosVolumen = hektolitara * stopaVolumen;

    let stopaSastav = 0;
    let iznosSastav = 0;
    let napomena = "";

    if (tarifniBroj === "220291") {
        stopaSastav = 0;
        iznosSastav = 0;

        napomena = `
            <p>
                <strong>Napomena:</strong>
                Bezalkoholno pivo se ne obračunava prema šećeru, taurinu ili metil-ksantinu.
            </p>
        `;
    } else {
        stopaSastav = procitajBroj(sadrzajInput);
        iznosSastav = hektolitara * stopaSastav;
    }

    const posebanPorez = iznosVolumen + iznosSastav;

    const iznosCarine = vrijednostRobe * STOPA_CARINE / 100;

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + posebanPorez;
    const iznosPDV = osnovicaZaPDV * STOPA_PDV;

    const ukupnaDavanja = posebanPorez + iznosCarine + iznosPDV;

    rezultat.innerHTML = `
        <p>Poseban porez prema volumenu: ${formatBroj(iznosVolumen)} €</p>
        <p>Poseban porez prema sadržaju šećera: ${formatBroj(iznosSastav)} €</p>
        <p>Ukupno poseban porez: ${formatBroj(posebanPorez)} €</p>

        <hr>

        <p>Ukupni iznos carine: ${formatBroj(iznosCarine)} €</p>
        <p>PDV: ${formatBroj(iznosPDV)} €</p>

        <hr>

        <p><strong>Ukupna davanja: ${formatBroj(ukupnaDavanja)} €</strong></p>

        ${napomena}
    `;
}

osnovaObracuna.addEventListener("change", napuniOpcijeSadrzaja);
vrstaProizvoda.addEventListener("change", provjeriBezalkoholnoPivo);

document.querySelectorAll('input[name="tipProizvoda"]').forEach(radio => {
    radio.addEventListener("change", napuniOpcijeSadrzaja);
});

izracunajBtn.addEventListener("click", izracunajDavanja);

napuniOpcijeSadrzaja();