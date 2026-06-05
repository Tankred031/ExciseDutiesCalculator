const vrstaProizvoda = document.getElementById("vrstaProizvoda");
const kolicinaInput = document.getElementById("kolicina");
const mpcInput = document.getElementById("mpc");
const komadaPoPaketicuInput = document.getElementById("komadaPoPaketicu");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");
const izracunajBtn = document.getElementById("izracunajBtn");
const cigaretePodaci = document.getElementById("cigaretePodaci");
const opisKolicine = document.getElementById("opisKolicine");

const STOPA_PDV = 0.25;

const STOPE_TROSARINE = {
    nepreradjeniDuhan: 56,          // €/100 kg

    cigareteSpecificna: 53.10,      // €/1000 kom
    cigareteProporcionalna: 0.34,   // 34% MPC
    cigareteMinimalna: 117.87,      // €/1000 kom

    cigare: 114.15,                 // €/1000 kom
    duhan: 114.15,                  // €/kg

    grijani: 211.30,                // €/kg
    etekucina: 0.25                 // €/ml
};

const CARINE = {
    "2401": {
        nacin: "po100kg",
        stopa: 56
    },
    "240220": {
        nacin: "postotak",
        stopa: 57.60
    },
    "240210": {
        nacin: "postotak",
        stopa: 26.00
    },
    "2403": {
        nacin: "postotak",
        stopa: 74.90
    },
    "240411": {
        nacin: "postotak",
        stopa: 0
    },
    "240412": {
        nacin: "postotak",
        stopa: 0
    }
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
    let dodatnaNapomena = "";

    if (vrsta === "2401") {
        iznosTrosarine = kolicina / 100 * STOPE_TROSARINE.nepreradjeniDuhan;
    }

    else if (vrsta === "240220") {
        const mpc = procitajBroj(mpcInput);
        const komadaPoPaketicu = procitajBroj(komadaPoPaketicuInput);

        const brojPaketic = komadaPoPaketicu > 0 ? kolicina / komadaPoPaketicu : 0;

        const specificnaTrosarina =
            kolicina / 1000 * STOPE_TROSARINE.cigareteSpecificna;

        const proporcionalnaTrosarina =
            brojPaketic * mpc * STOPE_TROSARINE.cigareteProporcionalna;

        const obracunataTrosarina =
            specificnaTrosarina + proporcionalnaTrosarina;

        const minimalnaTrosarina =
            kolicina / 1000 * STOPE_TROSARINE.cigareteMinimalna;

        iznosTrosarine = Math.max(obracunataTrosarina, minimalnaTrosarina);

        if (minimalnaTrosarina > obracunataTrosarina) {
            dodatnaNapomena = `
                <p>
                    <strong>Napomena:</strong>
                    Primijenjena je minimalna trošarina na cigarete.
                </p>
            `;
        }
    }

    else if (vrsta === "240210") {
        iznosTrosarine = kolicina / 1000 * STOPE_TROSARINE.cigare;
    }

    else if (vrsta === "2403") {
        iznosTrosarine = kolicina * STOPE_TROSARINE.duhan;
    }

    else if (vrsta === "240411") {
        iznosTrosarine = kolicina * STOPE_TROSARINE.grijani;
    }

    else if (vrsta === "240412") {
        iznosTrosarine = kolicina * STOPE_TROSARINE.etekucina;
    }

    return {
        iznosTrosarine,
        dodatnaNapomena
    };
}

function izracunajCarinu(tarifniBroj, vrijednostRobe, kolicina) {
    const carina = CARINE[tarifniBroj];

    if (!carina) {
        return 0;
    }

    if (carina.nacin === "postotak") {
        return vrijednostRobe * carina.stopa / 100;
    }

    if (carina.nacin === "po100kg") {
        return kolicina / 100 * carina.stopa;
    }

    return 0;
}


function izracunajDavanja() {
    const tarifniBroj = vrstaProizvoda.value;
    const kolicina = procitajBroj(kolicinaInput);
    const vrijednostRobe = NumbprocitajBrojer(vrijednostRobeInput);

    const obracun = izracunajTrosarinu();

    const iznosTrosarine = obracun.iznosTrosarine;
    const iznosCarine = izracunajCarinu(tarifniBroj, vrijednostRobe, kolicina);

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + iznosTrosarine;
    const iznosPDV = osnovicaZaPDV * STOPA_PDV;

    const ukupnaDavanja = iznosTrosarine + iznosCarine + iznosPDV;

    rezultat.innerHTML = `
        <p>Trošarina: ${formatBroj(iznosTrosarine)} €</p>
        <p>Ukupni iznos carine: ${formatBroj(iznosCarine)} €</p>
        <p>PDV: ${formatBroj(iznosPDV)} €</p>

        <hr>

        <p><strong>Ukupna davanja: ${formatBroj(ukupnaDavanja)} €</strong></p>

        ${obracun.dodatnaNapomena}
    `;
}

function prilagodiPolja() {
    const vrsta = vrstaProizvoda.value;

    if (vrsta === "240220") {
        cigaretePodaci.style.display = "flex";

        mpcInput.disabled = false;
        komadaPoPaketicuInput.disabled = false;

        kolicinaInput.placeholder = "Unesi ukupan broj komada cigareta";
        opisKolicine.textContent = "Za cigarete unesi ukupan broj komada.";
    } else {
        cigaretePodaci.style.display = "none";

        mpcInput.disabled = true;
        komadaPoPaketicuInput.disabled = true;

        mpcInput.value = "";
        komadaPoPaketicuInput.value = "";

        if (vrsta === "2401") {
            kolicinaInput.placeholder = "Unesi količinu neprerađenog duhana u kg";
            opisKolicine.textContent = "Za neprerađeni duhan unosi se količina u kilogramima.";
        }

        else if (vrsta === "240210") {
            kolicinaInput.placeholder = "Unesi broj komada cigara/cigarilosa";
            opisKolicine.textContent = "Za cigare i cigarilose unosi se broj komada.";
        }

        else if (vrsta === "2403") {
            kolicinaInput.placeholder = "Unesi količinu duhana u kg";
            opisKolicine.textContent = "Za rezani duhan i ostali duhan za pušenje unosi se količina u kilogramima.";
        }

        else if (vrsta === "240411") {
            kolicinaInput.placeholder = "Unesi količinu grijanog duhanskog proizvoda u kg";
            opisKolicine.textContent = "Za grijani duhanski proizvod unosi se količina u kilogramima.";
        }

        else if (vrsta === "240412") {
            kolicinaInput.placeholder = "Unesi količinu e-tekućine u ml";
            opisKolicine.textContent = "Za e-tekućinu unosi se količina u mililitrima.";
        }

        else {
            kolicinaInput.placeholder = "Unesi količinu";
            opisKolicine.textContent = "Za cigarete/cigare unosi se broj komada, za duhan kg, za e-tekućinu ml.";
        }
    }
}

vrstaProizvoda.addEventListener("change", prilagodiPolja);
izracunajBtn.addEventListener("click", izracunajDavanja);

prilagodiPolja();