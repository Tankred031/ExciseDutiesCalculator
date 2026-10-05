const forma = document.getElementById("kalkulator");
const litaraInput = document.getElementById("litara");
const postotakAlkoholaInput = document.getElementById("postotakAlkohola");
const tarifniTrosarina = document.getElementById("tarifniTrosarina");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");

// Tarifni brojevi na koje se ne plaća trošarina (postotak alkohola nije potreban)
const BEZ_TROSARINE = ["2204", "2205", "2206"];

function izracunajTrosarinu(tarifniBroj, hektolitara, postotakAlkohola) {
    if (tarifniBroj === "220310") {
        return hektolitara * RATES.alcohol.pivo * postotakAlkohola;
    }

    if (tarifniBroj === "2207" || tarifniBroj === "2208") {
        return hektolitara * (postotakAlkohola / 100) * RATES.alcohol.jakiAlkohol;
    }

    return 0;
}

function izracunajDavanja(greske) {
    const tarifniBroj = uzmiOdabir(tarifniTrosarina, "Tarifni broj", greske);
    const litara = uzmiBroj(litaraInput, "Količina", greske);
    const vrijednostRobe = uzmiBroj(vrijednostRobeInput, "Vrijednost robe", greske);

    // Za vino i slično trošarina je 0, pa postotak nije obavezan
    const postotakPotreban = !BEZ_TROSARINE.includes(tarifniBroj);
    const postotakAlkohola = postotakPotreban
        ? uzmiBroj(postotakAlkoholaInput, "Alkohol (% vol.)", greske, { max: 100 })
        : 0;

    if (greske.length > 0) {
        return;
    }

    const hektolitara = litara / 100;
    const iznosTrosarine = izracunajTrosarinu(tarifniBroj, hektolitara, postotakAlkohola);

    const osnovicaZaPDV = vrijednostRobe + iznosTrosarine;
    const iznosPDV = osnovicaZaPDV * RATES.pdv;

    const ukupnaDavanja = iznosTrosarine + iznosPDV;

    prikaziRezultat(rezultat, {
        redovi: [
            { naziv: "Trošarina", iznos: iznosTrosarine },
            { naziv: "PDV", iznos: iznosPDV }
        ],
        ukupno: { naziv: "Ukupna davanja", iznos: ukupnaDavanja }
    });
}

function prilagodiPolja() {
    const bezPostotka = BEZ_TROSARINE.includes(tarifniTrosarina.value);

    postotakAlkoholaInput.disabled = bezPostotka;

    if (bezPostotka) {
        postotakAlkoholaInput.value = "";
    }
}

tarifniTrosarina.addEventListener("change", prilagodiPolja);

pokreniKalkulator(forma, rezultat, izracunajDavanja);
prilagodiPolja();
