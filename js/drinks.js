const forma = document.getElementById("kalkulator");
const litaraInput = document.getElementById("litara");
const vrstaProizvoda = document.getElementById("vrstaProizvoda");
const osnovaObracuna = document.getElementById("osnovaObracuna");
const sadrzajInput = document.getElementById("sadrzaj");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");

const BEZALKOHOLNO_PIVO = "220291";

function dohvatiOdabranuVrstu() {
    const odabraniRadio = document.querySelector('input[name="tipProizvoda"]:checked');

    return odabraniRadio ? odabraniRadio.value : "";
}

function dodajOpciju(vrijednost, tekst) {
    const opcija = document.createElement("option");
    opcija.value = vrijednost;
    opcija.textContent = tekst;
    sadrzajInput.appendChild(opcija);
}

function napuniOpcijeSadrzaja() {
    const vrsta = dohvatiOdabranuVrstu();
    const osnova = osnovaObracuna.value;

    sadrzajInput.replaceChildren();

    if (vrstaProizvoda.value === BEZALKOHOLNO_PIVO) {
        dodajOpciju("0", "Nije primjenjivo za bezalkoholno pivo");
        return;
    }

    if (!vrsta || !osnova) {
        dodajOpciju("", "Odaberi kategoriju");
        return;
    }

    if (osnova === "secer") {
        dodajOpciju("", "Odaberi udio šećera");

        RATES.drinks.secer[vrsta].forEach(kategorija => {
            dodajOpciju(kategorija.stopa, `${kategorija.tekst} — ${formatBroj(kategorija.stopa)} €/hl`);
        });
    }

    if (osnova === "taurin") {
        const stopa = RATES.drinks.taurin[vrsta];
        dodajOpciju(stopa, `Taurin — ${formatBroj(stopa)} €/hl`);
    }

    if (osnova === "metilKsantin") {
        const stopa = RATES.drinks.metilKsantin[vrsta];
        dodajOpciju(stopa, `Metil-ksantin — ${formatBroj(stopa)} €/hl`);
    }
}

function prilagodiPolja() {
    const jePivo = vrstaProizvoda.value === BEZALKOHOLNO_PIVO;

    osnovaObracuna.disabled = jePivo;
    sadrzajInput.disabled = jePivo;

    napuniOpcijeSadrzaja();
}

function izracunajDavanja(greske) {
    const jePivo = vrstaProizvoda.value === BEZALKOHOLNO_PIVO;

    const litara = uzmiBroj(litaraInput, "Količina", greske);
    const tarifniBroj = uzmiOdabir(vrstaProizvoda, "Tarifni broj", greske);
    const sadrzaj = jePivo ? "0" : uzmiOdabir(sadrzajInput, "Kategorija", greske);
    const vrijednostRobe = uzmiBroj(vrijednostRobeInput, "Vrijednost robe", greske);

    if (greske.length > 0) {
        return;
    }

    const vrsta = dohvatiOdabranuVrstu();
    const hektolitara = litara / 100;

    const iznosVolumen = hektolitara * RATES.drinks.volumen[vrsta];
    const iznosSastav = jePivo ? 0 : hektolitara * parseBroj(sadrzaj);

    const posebanPorez = iznosVolumen + iznosSastav;
    const iznosCarine = vrijednostRobe * RATES.drinks.carina / 100;

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + posebanPorez;
    const iznosPDV = osnovicaZaPDV * RATES.pdv;

    const ukupnaDavanja = posebanPorez + iznosCarine + iznosPDV;

    const napomene = [];

    if (jePivo) {
        napomene.push("Bezalkoholno pivo se ne obračunava prema šećeru, taurinu ili metil-ksantinu.");
    }

    prikaziRezultat(rezultat, {
        redovi: [
            { naziv: "Poseban porez prema volumenu", iznos: iznosVolumen },
            { naziv: "Poseban porez prema sadržaju", iznos: iznosSastav },
            { naziv: "Ukupno poseban porez", iznos: posebanPorez },
            "---",
            { naziv: "Ukupni iznos carine", iznos: iznosCarine },
            { naziv: "PDV", iznos: iznosPDV }
        ],
        ukupno: { naziv: "Ukupna davanja", iznos: ukupnaDavanja },
        napomene
    });
}

osnovaObracuna.addEventListener("change", napuniOpcijeSadrzaja);
vrstaProizvoda.addEventListener("change", prilagodiPolja);

document.querySelectorAll('input[name="tipProizvoda"]').forEach(radio => {
    radio.addEventListener("change", napuniOpcijeSadrzaja);
});

pokreniKalkulator(forma, rezultat, izracunajDavanja);
prilagodiPolja();
