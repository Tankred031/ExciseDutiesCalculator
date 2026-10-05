const forma = document.getElementById("kalkulator");
const tezinaKave = document.getElementById("tezinaKave");
const vrijednostRobe = document.getElementById("vrijednostRobe");
const tarifniTrosarina = document.getElementById("tarifniTrosarina");
const tarifniCarina = document.getElementById("tarifniCarina");
const rezultat = document.getElementById("rezultat");

function izracunajDavanja(greske) {
    const tezina = uzmiBroj(tezinaKave, "Neto težina", greske);
    const odabranaTrosarina = uzmiOdabir(tarifniTrosarina, "Tarifni broj za poseban porez", greske);
    const vrijednost = uzmiBroj(vrijednostRobe, "Vrijednost robe", greske);
    const odabranaCarina = uzmiOdabir(tarifniCarina, "Vrsta proizvoda (carina)", greske);

    if (greske.length > 0) {
        return;
    }

    const stopaTrosarine = RATES.coffee.trosarina[odabranaTrosarina] || 0;
    const stopaCarine = RATES.coffee.carina[odabranaCarina] || 0;

    const iznosTrosarine = tezina * stopaTrosarine;
    const iznosCarine = vrijednost * stopaCarine / 100;

    const osnovicaZaPDV = vrijednost + iznosTrosarine + iznosCarine;
    const iznosPDV = osnovicaZaPDV * RATES.pdv;

    const ukupnaDavanja = iznosTrosarine + iznosCarine + iznosPDV;

    const napomene = [];

    if (odabranaCarina === "210120") {
        napomene.push("Tarifni broj 2101 20 podliježe posebnom porezu na bezalkoholna pića.");
    }

    prikaziRezultat(rezultat, {
        redovi: [
            { naziv: "Trošarina", iznos: iznosTrosarine },
            { naziv: "Carina", iznos: iznosCarine },
            { naziv: "PDV", iznos: iznosPDV }
        ],
        ukupno: { naziv: "Ukupna davanja", iznos: ukupnaDavanja },
        napomene
    });
}

pokreniKalkulator(forma, rezultat, izracunajDavanja);
