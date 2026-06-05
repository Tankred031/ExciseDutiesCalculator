const maksimalnoRedova = 10;

const gwpOpcije = `
    <option value="675">675 (R-32)</option>
    <option value="1430">1430 (R-134a)</option>
    <option value="3922">3922 (R-404A)</option>
    <option value="1774">1774 (R-407C)</option>
    <option value="2087">2087 (R-410A)</option>
    <option value="1400">1400 (R-448A/49A)</option>
    <option value="490">490 (R-454B)</option>
    <option value="150" selected>150 (R-454C)</option>
    <option value="1">&lt;1 (R-1234yf/ze)</option>
    <option value="24300">24300 (SF6)</option>
`;

function formatBrojDecimalno(broj) {
    return broj.toFixed(2).replace(".", ",");
}

function napraviRedak() {
    const noviRed = document.createElement("tr");

    noviRed.innerHTML = `
        <td class="result-highlight broj-reda">1</td>

        <td>
            <input type="number" class="komada" value="0" min="0" oninput="izracunaj()">
        </td>

        <td>
            <input type="number" class="kg" value="0" min="0" step="0.01" oninput="izracunaj()">
        </td>

        <td class="result-highlight ukupno-kg">0,00</td>

        <td>
            <select class="gwp" onchange="izracunaj()">
                ${gwpOpcije}
            </select>
        </td>

        <td class="final-result tone">0,00</td>

        <td class="action-cell">
            <button class="icon-btn icon-add" onclick="dodajRedakIspod(this)" title="Dodaj redak">➕</button>
            <button class="icon-btn icon-remove" onclick="obrisiOvajRedak(this)" title="Obriši redak">🗑️</button>
        </td>
    `;

    return noviRed;
}

function dodajRedakIspod(gumb) {
    const tablica = document.getElementById("tablica-redovi");
    const sviRedovi = tablica.querySelectorAll("tr");

    if (sviRedovi.length >= maksimalnoRedova) {
        alert("Možeš dodati najviše 10 redova.");
        return;
    }

    const trenutniRed = gumb.closest("tr");
    const noviRed = napraviRedak();

    trenutniRed.after(noviRed);

    obnoviBrojeveRedova();
    izracunaj();
}

function obrisiOvajRedak(gumb) {
    const tablica = document.getElementById("tablica-redovi");
    const sviRedovi = tablica.querySelectorAll("tr");

    if (sviRedovi.length <= 1) {
        alert("Mora ostati barem jedan redak.");
        return;
    }

    const trenutniRed = gumb.closest("tr");
    trenutniRed.remove();

    obnoviBrojeveRedova();
    izracunaj();
}

function obnoviBrojeveRedova() {
    const brojevi = document.querySelectorAll(".broj-reda");

    brojevi.forEach((broj, index) => {
        broj.innerText = index + 1;
    });
}

function izracunaj() {
    const redovi = document.querySelectorAll("#tablica-redovi tr");

    let ukupnoKgSve = 0;
    let ukupnoToneSve = 0;

    redovi.forEach(red => {
        const komada = parseFloat(red.querySelector(".komada").value) || 0;
        const kg = parseFloat(red.querySelector(".kg").value) || 0;
        const gwp = parseFloat(red.querySelector(".gwp").value) || 0;

        const ukupnoKg = komada * kg;
        const co2 = ukupnoKg * gwp;
        const tone = co2 / 1000;

        red.querySelector(".ukupno-kg").innerText = formatBrojDecimalno(ukupnoKg);
        red.querySelector(".tone").innerText = formatBrojDecimalno(tone);

        ukupnoKgSve += ukupnoKg;
        ukupnoToneSve += tone;
    });

    document.getElementById("ukupno_kg_sve").innerText = formatBrojDecimalno(ukupnoKgSve);
    document.getElementById("ukupno_tone_sve").innerText = formatBrojDecimalno(ukupnoToneSve);
}

function printCertifikat() {
    const pdfProzor = window.open("../documents/fgas-certifikat.pdf", "_blank");

    if (pdfProzor) {
        pdfProzor.addEventListener("load", function () {
            pdfProzor.print();
        });
    } else {
        alert("Preglednik je blokirao otvaranje PDF-a. Dopusti popup prozore za ovu stranicu.");
    }
}

window.addEventListener("load", function () {
    const tablica = document.getElementById("tablica-redovi");

    const prviRed = napraviRedak();
    tablica.appendChild(prviRed);

    prviRed.querySelector(".komada").value = 40;
    prviRed.querySelector(".kg").value = 2;

    obnoviBrojeveRedova();
    izracunaj();
});