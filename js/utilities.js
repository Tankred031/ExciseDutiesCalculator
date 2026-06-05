function procitajBroj(input) {
    return Number(input.value.trim().replace(",", "."));
}

function formatBroj(broj) {
    return Number(broj).toLocaleString("hr-HR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}