const litaraInput = document.getElementById("litara");
const postotakAlkoholaInput = document.getElementById("postotakAlkohola");
const tarifniTrosarina = document.getElementById("tarifniTrosarina");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");
const izracunajBtn = document.getElementById("izracunajBtn");

const STOPA_PDV = 0.25;

const STOPE = {
    pivo: 5.31,    
    jakiAlkohol: 796.34
};

function dohvatiNazivTarifnogBroja(tarifniBroj) {
    if (tarifniBroj === "220310") return "2203 10 - Pivo od slada";
    if (tarifniBroj === "2204") return "2204 - Vino, mirno i pjenušavo";
    if (tarifniBroj === "2205") return "2205 - Vermuti i ostala aromatizirana vina";
    if (tarifniBroj === "2206") return "2206 - Jabukovače, medovine i ostala fermentirana pića";
    if (tarifniBroj === "2207") return "2207 - Etilni alkohol";
    if (tarifniBroj === "2208") return "2208 - Jaka alkoholna pića";

    return "nije odabrano";
}

function izracunajTrosarinu(tarifniBroj, hektolitara, postotakAlkohola) {
    let iznosTrosarine = 0;
    let stopa = 0;
    let opisObracuna = "";
    

    if (tarifniBroj === "220310") {
        stopa = STOPE.pivo;
        iznosTrosarine = hektolitara * stopa * postotakAlkohola;
        opisObracuna = "pivo: hektolitri × 5.31 € × % alkohola";

    } else if (
        tarifniBroj === "2204" ||
        tarifniBroj === "2205" ||
        tarifniBroj === "2206"
    ) {
        stopa = 0;
        iznosTrosarine = 0;
        opisObracuna = "vino, vermuti i ostala fermentirana pića: trošarina 0,00 €";

    } else if (
        tarifniBroj === "2207" ||
        tarifniBroj === "2208"
    ) {
        stopa = STOPE.jakiAlkohol;
        iznosTrosarine = hektolitara * (postotakAlkohola / 100) * stopa;
        opisObracuna = "2207 / 2208: hektolitri × alkoholna jakost × 796.34 €";
    }

    return {
        iznosTrosarine,
        stopa,
        opisObracuna
    };
}

function izracunajDavanja() {
    const litara = procitajBroj(litaraInput);
    const hektolitara = litara / 100;

    const postotakAlkohola = procitajBroj(postotakAlkoholaInput);
    const tarifniBroj = tarifniTrosarina.value;
    const vrijednostRobe = procitajBroj(vrijednostRobeInput);

    const obracun = izracunajTrosarinu(
        tarifniBroj,
        hektolitara,
        postotakAlkohola
    );

    const iznosTrosarine = obracun.iznosTrosarine;

    const osnovicaZaPDV = vrijednostRobe + iznosTrosarine;
    const iznosPDV = osnovicaZaPDV * STOPA_PDV;

    const ukupnaDavanja = iznosTrosarine + iznosPDV;

   rezultat.innerHTML = `
    <p>Trošarina: ${formatBroj(iznosTrosarine)} €</p>
    <p>PDV: ${formatBroj(iznosPDV)} €</p>

    <hr>

    <p><strong>Ukupna davanja: ${formatBroj(ukupnaDavanja)} €</strong></p>
`;
}

izracunajBtn.addEventListener("click", izracunajDavanja);