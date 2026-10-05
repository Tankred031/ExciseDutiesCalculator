const forma = document.getElementById("kalkulator");
const vrstaProizvoda = document.getElementById("vrstaProizvoda");
const kolicinaInput = document.getElementById("kolicina");
const oznakaKolicine = document.getElementById("oznakaKolicine");
const mpcInput = document.getElementById("mpc");
const komadaPoPaketicuInput = document.getElementById("komadaPoPaketicu");
const vrijednostRobeInput = document.getElementById("vrijednostRobe");
const rezultat = document.getElementById("rezultat");
const cigaretePodaci = document.getElementById("cigaretePodaci");
const opisKolicine = document.getElementById("opisKolicine");

const CIGARETE = "240220";

const OPISI_KOLICINE = {
    "": {
        oznaka: "Količina",
        placeholder: "Unesi količinu",
        opis: "Za cigarete/cigare unosi se broj komada, za duhan kg, za e-tekućinu ml."
    },
    "2401": {
        oznaka: "Količina neprerađenog duhana (kg)",
        placeholder: "Unesi količinu u kg",
        opis: "Za neprerađeni duhan unosi se količina u kilogramima."
    },
    "240220": {
        oznaka: "Ukupan broj komada cigareta",
        placeholder: "Unesi ukupan broj komada",
        opis: "Za cigarete unesi ukupan broj komada."
    },
    "240210": {
        oznaka: "Broj komada cigara/cigarilosa",
        placeholder: "Unesi broj komada",
        opis: "Za cigare i cigarilose unosi se broj komada."
    },
    "2403": {
        oznaka: "Količina duhana (kg)",
        placeholder: "Unesi količinu u kg",
        opis: "Za rezani duhan i ostali duhan za pušenje unosi se količina u kilogramima."
    },
    "240411": {
        oznaka: "Količina grijanog duhanskog proizvoda (kg)",
        placeholder: "Unesi količinu u kg",
        opis: "Za grijani duhanski proizvod unosi se količina u kilogramima."
    },
    "240412": {
        oznaka: "Količina e-tekućine (ml)",
        placeholder: "Unesi količinu u ml",
        opis: "Za e-tekućinu unosi se količina u mililitrima."
    }
};

function izracunajTrosarinu(vrsta, kolicina, mpc, komadaPoPaketicu) {
    const stope = RATES.tobacco.trosarina;
    const napomene = [];
    let iznosTrosarine = 0;

    if (vrsta === "2401") {
        iznosTrosarine = kolicina / 100 * stope.nepreradjeniDuhan;
    }

    else if (vrsta === CIGARETE) {
        const brojPaketic = kolicina / komadaPoPaketicu;

        const specificnaTrosarina = kolicina / 1000 * stope.cigareteSpecificna;
        const proporcionalnaTrosarina = brojPaketic * mpc * stope.cigareteProporcionalna;
        const obracunataTrosarina = specificnaTrosarina + proporcionalnaTrosarina;

        const minimalnaTrosarina = kolicina / 1000 * stope.cigareteMinimalna;

        iznosTrosarine = Math.max(obracunataTrosarina, minimalnaTrosarina);

        if (minimalnaTrosarina > obracunataTrosarina) {
            napomene.push("Primijenjena je minimalna trošarina na cigarete.");
        }
    }

    else if (vrsta === "240210") {
        iznosTrosarine = kolicina / 1000 * stope.cigare;
    }

    else if (vrsta === "2403") {
        iznosTrosarine = kolicina * stope.duhan;
    }

    else if (vrsta === "240411") {
        iznosTrosarine = kolicina * stope.grijani;
    }

    else if (vrsta === "240412") {
        iznosTrosarine = kolicina * stope.etekucina;
    }

    return { iznosTrosarine, napomene };
}

function izracunajCarinu(tarifniBroj, vrijednostRobe, kolicina) {
    const carina = RATES.tobacco.carina[tarifniBroj];

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

function izracunajDavanja(greske) {
    const tarifniBroj = uzmiOdabir(vrstaProizvoda, "Vrsta proizvoda", greske);
    const kolicina = uzmiBroj(kolicinaInput, "Količina", greske);

    let mpc = 0;
    let komadaPoPaketicu = 0;

    if (tarifniBroj === CIGARETE) {
        mpc = uzmiBroj(mpcInput, "MPC po paketiću", greske);
        komadaPoPaketicu = uzmiBroj(komadaPoPaketicuInput, "Komada po paketiću", greske, { iznadMin: true });
    }

    const vrijednostRobe = uzmiBroj(vrijednostRobeInput, "Vrijednost robe", greske);

    if (greske.length > 0) {
        return;
    }

    const obracun = izracunajTrosarinu(tarifniBroj, kolicina, mpc, komadaPoPaketicu);

    const iznosTrosarine = obracun.iznosTrosarine;
    const iznosCarine = izracunajCarinu(tarifniBroj, vrijednostRobe, kolicina);

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + iznosTrosarine;
    const iznosPDV = osnovicaZaPDV * RATES.pdv;

    const ukupnaDavanja = iznosTrosarine + iznosCarine + iznosPDV;

    prikaziRezultat(rezultat, {
        redovi: [
            { naziv: "Trošarina", iznos: iznosTrosarine },
            { naziv: "Ukupni iznos carine", iznos: iznosCarine },
            { naziv: "PDV", iznos: iznosPDV }
        ],
        ukupno: { naziv: "Ukupna davanja", iznos: ukupnaDavanja },
        napomene: obracun.napomene
    });
}

function prilagodiPolja() {
    const vrsta = vrstaProizvoda.value;
    const jeCigareta = vrsta === CIGARETE;
    const tekstovi = OPISI_KOLICINE[vrsta] || OPISI_KOLICINE[""];

    cigaretePodaci.hidden = !jeCigareta;
    mpcInput.disabled = !jeCigareta;
    komadaPoPaketicuInput.disabled = !jeCigareta;

    if (!jeCigareta) {
        mpcInput.value = "";
        komadaPoPaketicuInput.value = "";
    }

    oznakaKolicine.textContent = tekstovi.oznaka;
    kolicinaInput.placeholder = tekstovi.placeholder;
    opisKolicine.textContent = tekstovi.opis;
}

vrstaProizvoda.addEventListener("change", prilagodiPolja);

pokreniKalkulator(forma, rezultat, izracunajDavanja);
prilagodiPolja();
