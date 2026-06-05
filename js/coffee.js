const tezinaKave = document.getElementById("tezinaKave");
const vrijednostRobe = document.getElementById("vrijednostRobe");
const tarifniTrosarina = document.getElementById("tarifniTrosarina")
const tarifniCarina = document.getElementById("tarifniCarina");
const rezultat = document.getElementById("rezultat");
const izracunajBtn = document.getElementById("izracunajBtn");

const stopeTrosarine = {
    "090121": 0.8,
    "090122": 0.8,
    "090190": 0.8,
    "210111": 2.65,
    "210112": 2.65
};

const stopeCarine = {
    "090121": 7.5,
    "090122": 9,
    "210111": 9,
    "090190": 11.5,
    "210112": 11.5,
    "090210": 3.2,
    "210120": 6
}


function izracunajDavanja() {
    const tezina = Number(tezinaKave.value);
    const vrijednost = Number(vrijednostRobe.value);

    const odabranaTrosarina = tarifniTrosarina.value;
    const odabranaCarina = tarifniCarina.value;

    const stopaTrosarine = stopeTrosarine[odabranaTrosarina] || 0;
    const stopaCarine = stopeCarine[odabranaCarina] || 0;

    const iznosTrosarine = tezina * stopaTrosarine;
    const iznosCarine = vrijednost * stopaCarine / 100;

    const osnovicaZaPDV = vrijednost + iznosTrosarine + iznosCarine;
    const iznosPDV = osnovicaZaPDV * 0.25;

    const ukupnaDavanja = iznosTrosarine + iznosCarine + iznosPDV;

    let posebnaNapomena = "";

    if (odabranaCarina === "210120") {
        posebnaNapomena = `
        <p>
            <strong>Napomena:</strong>
            Tarifni broj 2101 20 podliježe posebnom porezu na bezalkoholna pića
        </p>
        `;
    }

    rezultat.innerHTML = `
        <p>Trošarina: ${iznosTrosarine.toFixed(2)} €</p>
        <p>Carina: ${iznosCarine.toFixed(2)} €</p>
        <p>PDV: ${iznosPDV.toFixed(2)} €</p>
        <hr>
        <p><strong>Ukupna davanja: ${ukupnaDavanja.toFixed(2)} €</strong></p>

        ${posebnaNapomena}
        `;
    
}

izracunajBtn.addEventListener("click", izracunajDavanja);