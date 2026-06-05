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

function dohvatiStopuSecera(vrsta, sadrzajSecera) {
    if (vrsta === "pice") {
        if (sadrzajSecera <= 2) return 0;
        if (sadrzajSecera <= 5) return 1.33;
        if (sadrzajSecera <= 8) return 3.98;
        return 7.96;
    }

    if (vrsta === "sirup") {
        if (sadrzajSecera <= 14) return 0;
        if (sadrzajSecera <= 35) return 9.29;
        if (sadrzajSecera <= 56) return 27.87;
        return 55.74;
    }

    return 0;
}

function dohvatiNazivVrste(vrsta) {
    if (vrsta === "pice") {
        return "sok / gotovo piće";
    }

    if (vrsta === "sirup") {
        return "sirup / koncentrat";
    }

    return "nije odabrano";
}

function dohvatiNazivOsnove(osnova) {
    if (osnova === "secer") {
        return "šećer";
    }

    if (osnova === "taurin") {
        return "taurin";
    }

    if (osnova === "metilKsantin") {
        return "metil-ksantin";
    }

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

function izracunajDavanja() {
    const litara = Number(litaraInput.value);
    const hektolitara = litara / 100;

    const vrsta = document.querySelector('input[name="tipProizvoda"]:checked').value;
    const tarifniBroj = vrstaProizvoda.value;

    const osnova = osnovaObracuna.value;
    const sadrzaj = Number(sadrzajInput.value);
    const vrijednostRobe = Number(vrijednostRobeInput.value);

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
        if (osnova === "secer") {
            stopaSastav = dohvatiStopuSecera(vrsta, sadrzaj);
        } else if (osnova === "taurin") {
            stopaSastav = stopeTaurin[vrsta] || 0;
        } else if (osnova === "metilKsantin") {
            stopaSastav = stopeMetilKsantin[vrsta] || 0;
        }

        iznosSastav = hektolitara * stopaSastav;
    }

    const posebanPorez = iznosVolumen + iznosSastav;

    const iznosCarine = vrijednostRobe * STOPA_CARINE / 100;

    const osnovicaZaPDV = vrijednostRobe + iznosCarine + posebanPorez;
    const iznosPDV = osnovicaZaPDV * STOPA_PDV;

    const ukupnaDavanja = posebanPorez + iznosCarine + iznosPDV;

    rezultat.innerHTML = `
        <p>Tarifni broj: <strong>${dohvatiNazivTarifnogBroja(tarifniBroj)}</strong></p>
        <p>Vrsta proizvoda: <strong>${dohvatiNazivVrste(vrsta)}</strong></p>
        <p>Osnova obračuna: <strong>${tarifniBroj === "220291" ? "nije primjenjivo" : dohvatiNazivOsnove(osnova)}</strong></p>

        <hr>

        <p>Poseban porez prema volumenu: ${iznosVolumen.toFixed(2)} €</p>
        <p>Poseban porez prema sastavu: ${iznosSastav.toFixed(2)} €</p>
        <p><strong>Ukupno poseban porez: ${posebanPorez.toFixed(2)} €</strong></p>

        <hr>

        <p>Carina: ${iznosCarine.toFixed(2)} €</p>
        <p>PDV: ${iznosPDV.toFixed(2)} €</p>

        <hr>

        <p><strong>Ukupna davanja: ${ukupnaDavanja.toFixed(2)} €</strong></p>

        ${napomena}
    `;
}

function promijeniPlaceholder() {
    if (osnovaObracuna.value === "secer") {
        sadrzajInput.placeholder = "Unesi sadržaj šećera u g/100 ml";
    } else if (osnovaObracuna.value === "taurin") {
        sadrzajInput.placeholder = "Unesi sadržaj taurina";
    } else if (osnovaObracuna.value === "metilKsantin") {
        sadrzajInput.placeholder = "Unesi sadržaj metil-ksantina";
    }
}

function provjeriBezalkoholnoPivo() {
    if (vrstaProizvoda.value === "220291") {
        osnovaObracuna.disabled = true;
        sadrzajInput.disabled = true;
        sadrzajInput.value = "";
        sadrzajInput.placeholder = "Nije primjenjivo za bezalkoholno pivo";
    } else {
        osnovaObracuna.disabled = false;
        sadrzajInput.disabled = false;
        promijeniPlaceholder();
    }
}

osnovaObracuna.addEventListener("change", promijeniPlaceholder);
vrstaProizvoda.addEventListener("change", provjeriBezalkoholnoPivo);
izracunajBtn.addEventListener("click", izracunajDavanja);