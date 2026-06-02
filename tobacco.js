const vrstaProizvoda = document.getElementById("vrstaProizvoda");
const kolicinaInput = document.getElementById("kolicina");
const mpcInput = document.getElementById("mpc");
const komadaPoPaketicuInput = document.getElementById("komadaPoPaketicu");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const stopaCarineInput = document.getElementById("stopaCarine");
const rezultat = document.getElementById("rezultat");
const izracunajBtn = document.getElementById("izracunajBtn");
const cigaretePodaci = document.getElementById("cigaretePodaci");
const opisKolicine = document.getElementById("opisKolicine");

const STOPA_PDV = 0.25;

const STOPE = {
    nepreradjeniDuhan: 56,              // €/100 kg

    cigareteSpecificna: 59.10,          // €/1000 kom
    cigareteProporcionalna: 0.34,       // 34%
    cigareteMinimalna: 124.20,          // €/1000 kom

    cigare: 126.90,                     // €/1000 kom
    duhan: 126.90,                      // €/kg
    grijani: 211.30,                    // €/kg
    etekucina: 0.25                     // €/ml
};

function dohvatiNazivProizvoda(vrsta) {
    if (vrsta === "cigarete") return "cigarete";
    if (vrsta === "cigare") return "cigare / cigarilosi";
    if (vrsta === "duhan") return "rezani duhan / ostali duhan za pušenje";
    if (vrsta === "grijani") return "grijani duhanski proizvod";
    if (vrsta === "etekucina") return "e-tekućina";

    return "nije odabrano";
}

function izracunajTrosarinu() {
    const vrsta = vrstaProizvoda.value;
    const kolicina = Number(kolicinaInput.value);

    let iznosTrosarine = 0;
    let opisObracuna = "";
    let dodatnaNapomena = "";

    if (vrsta === "2401") {
    iznosTrosarine = kolicina / 100 * STOPE.nepreradjeniDuhan;

    opisObracuna = `
        <p>Obračun: kg / 100 × 56 €</p>
        <p>Stopa: 56 € / 100 kg</p>
    `;
}

    if (vrsta === "cigarete") {
        const mpc = Number(mpcInput.value);
        const komadaPoPaketicu = Number(komadaPoPaketicuInput.value);

        const brojPaketic = komadaPoPaketicu > 0 ? kolicina / komadaPoPaketicu : 0;

        const specificnaTrosarina = kolicina / 1000 * STOPE.cigareteSpecificna;

        /*
            Formula ispod prati tvoju Excel logiku:
            34 MPC daje proporcionalnu trošarinu približno 0.12 po paketiću.

            Ako kasnije želiš računati proporcionalnu trošarinu kao punih 34% MPC-a,
            promijeni:
            mpc * STOPE.cigareteProporcionalna / 100
            u:
            mpc * STOPE.cigareteProporcionalna
        */
        const proporcionalnaPoPaketicu = mpc * STOPE.cigareteProporcionalna / 100;
        const proporcionalnaTrosarina = brojPaketic * proporcionalnaPoPaketicu;

        const obracunataTrosarina = specificnaTrosarina + proporcionalnaTrosarina;
        const minimalnaTrosarina = kolicina / 1000 * STOPE.cigareteMinimalna;

        iznosTrosarine = Math.max(obracunataTrosarina, minimalnaTrosarina);

        opisObracuna = `
            <p>Specifična trošarina: ${specificnaTrosarina.toFixed(2)} €</p>
            <p>Proporcionalna trošarina: ${proporcionalnaTrosarina.toFixed(2)} €</p>
            <p>Obračunata trošarina: ${obracunataTrosarina.toFixed(2)} €</p>
            <p>Minimalna trošarina: ${minimalnaTrosarina.toFixed(2)} €</p>
        `;

        if (minimalnaTrosarina > obracunataTrosarina) {
            dodatnaNapomena = `
                <p>
                    <strong>Napomena:</strong>
                    Primijenjena je minimalna trošarina jer je veća od obračunate trošarine.
                </p>
            `;
        }

    } else if (vrsta === "cigare") {
        iznosTrosarine = kolicina / 1000 * STOPE.cigare;
        opisObracuna = `<p>Obračun: komadi / 1000 × 126.90 €</p>`;

    } else if (vrsta === "duhan") {
        iznosTrosarine = kolicina * STOPE.duhan;
        opisObracuna = `<p>Obračun: kg × 126.90 €</p>`;

    } else if (vrsta === "grijani") {
        iznosTrosarine = kolicina * STOPE.grijani;
        opisObracuna = `<p>Obračun: kg × 211.30 €</p>`;

    } else if (vrsta === "etekucina") {
        iznosTrosarine = kolicina * STOPE.etekucina;
        opisObracuna = `<p>Obračun: ml × 0.25 €</p>`;
    }

    return {
        iznosTrosarine,
        opisObracuna,
        dodatnaNapomena
    };
}

function izracunajDavanja() {
    const vrsta = vrstaProizvoda.value;
    const vrijednostRobe = Number(vrijednostRobeInput.value);
    const stopaCarine = Number(stopaCarineInput.value) || 0;

    const obracun = izracunajTrosarinu();

    const iznosTrosarine = obracun.iznosTrosarine;
    const iznosCarine = vrijednostRobe * stopaCarine / 100;

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + iznosTrosarine;
    const iznosPDV = osnovicaZaPDV * STOPA_PDV;

    const ukupnaDavanja = iznosTrosarine + iznosCarine + iznosPDV;

    rezultat.innerHTML = `
        <p>Vrsta proizvoda: <strong>${dohvatiNazivProizvoda(vrsta)}</strong></p>

        <hr>

        ${obracun.opisObracuna}

        <p><strong>Trošarina: ${iznosTrosarine.toFixed(2)} €</strong></p>

        <hr>

        <p>Vrijednost robe: ${vrijednostRobe.toFixed(2)} €</p>
        <p>Carina: ${iznosCarine.toFixed(2)} €</p>
        <p>Osnovica za PDV: ${osnovicaZaPDV.toFixed(2)} €</p>
        <p>PDV: ${iznosPDV.toFixed(2)} €</p>

        <hr>

        <p><strong>Ukupna davanja: ${ukupnaDavanja.toFixed(2)} €</strong></p>

        ${obracun.dodatnaNapomena}
    `;
}

function prilagodiPolja() {
    const vrsta = vrstaProizvoda.value;

    if (vrsta === "cigarete") {
        cigaretePodaci.style.display = "flex";
        kolicinaInput.placeholder = "Unesi broj komada cigareta";
        opisKolicine.textContent = "Za cigarete unesi ukupan broj komada.";
    } else {
        cigaretePodaci.style.display = "none";
        mpcInput.value = "";
        komadaPoPaketicuInput.value = "";

        if (vrsta === "cigare") {
            kolicinaInput.placeholder = "Unesi broj komada cigara/cigarilosa";
            opisKolicine.textContent = "Za cigare i cigarilose unosi se broj komada.";
        } else if (vrsta === "duhan") {
            kolicinaInput.placeholder = "Unesi količinu duhana u kg";
            opisKolicine.textContent = "Za rezani duhan i ostali duhan za pušenje unosi se količina u kilogramima.";
        } else if (vrsta === "grijani") {
            kolicinaInput.placeholder = "Unesi količinu grijanog duhanskog proizvoda u kg";
            opisKolicine.textContent = "Za grijani duhanski proizvod unosi se količina u kilogramima.";
        } else if (vrsta === "etekucina") {
            kolicinaInput.placeholder = "Unesi količinu e-tekućine u ml";
            opisKolicine.textContent = "Za e-tekućinu unosi se količina u mililitrima.";
        } else {
            kolicinaInput.placeholder = "Unesi količinu";
            opisKolicine.textContent = "Za cigarete/cigare unosi se broj komada, za duhan kg, za e-tekućinu ml.";
        }
    }
}

vrstaProizvoda.addEventListener("change", prilagodiPolja);
izracunajBtn.addEventListener("click", izracunajDavanja);

prilagodiPolja();