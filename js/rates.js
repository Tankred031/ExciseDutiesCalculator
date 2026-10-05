/*
 * Sve stope na jednom mjestu.
 * Kad se stope promijene, mijenja se samo ovaj file.
 *
 * Mjerne jedinice navedene su uz svaku stopu.
 */
const RATES = {
    // PDV (udio, 0.25 = 25 %)
    pdv: 0.25,

    // KAVA ------------------------------------------------------------
    coffee: {
        // Poseban porez, € po kg neto težine, po tarifnom broju
        trosarina: {
            "090121": 0.8,
            "090122": 0.8,
            "090190": 0.8,
            "210111": 2.65,
            "210112": 2.65
        },
        // Carina, % vrijednosti robe, po tarifnom broju
        carina: {
            "090121": 7.5,
            "090122": 9,
            "210111": 9,
            "090190": 11.5,
            "210112": 11.5,
            "090210": 3.2,
            "210120": 6
        }
    },

    // BEZALKOHOLNA PIĆA -----------------------------------------------
    drinks: {
        carina: 9.6,                    // % vrijednosti robe

        // € po hektolitru; "pice" = sok / gotovo piće, "sirup" = sirup / koncentrat
        volumen: { pice: 2.65, sirup: 18.58 },
        taurin: { pice: 26.54, sirup: 185.81 },
        metilKsantin: { pice: 10.62, sirup: 74.32 },

        secer: {
            pice: [
                { tekst: "do 2 g/100 ml", stopa: 0 },
                { tekst: "više od 2 do 5 g/100 ml", stopa: 1.33 },
                { tekst: "više od 5 do 8 g/100 ml", stopa: 3.98 },
                { tekst: "više od 8 g/100 ml", stopa: 7.96 }
            ],
            sirup: [
                { tekst: "do 14 g/100 ml", stopa: 0 },
                { tekst: "više od 14 do 35 g/100 ml", stopa: 9.29 },
                { tekst: "više od 35 do 56 g/100 ml", stopa: 27.87 },
                { tekst: "više od 56 g/100 ml", stopa: 55.74 }
            ]
        }
    },

    // ALKOHOL ---------------------------------------------------------
    alcohol: {
        pivo: 5.31,                     // € po hl po % alkohola
        jakiAlkohol: 796.34             // € po hl čistog alkohola
    },

    // DUHAN -----------------------------------------------------------
    tobacco: {
        trosarina: {
            nepreradjeniDuhan: 56,          // € / 100 kg

            cigareteSpecificna: 53.10,      // € / 1000 kom
            cigareteProporcionalna: 0.34,   // 34 % MPC
            cigareteMinimalna: 117.87,      // € / 1000 kom

            cigare: 114.15,                 // € / 1000 kom
            duhan: 114.15,                  // € / kg

            grijani: 211.30,                // € / kg
            etekucina: 0.25                 // € / ml
        },
        // Carina: "postotak" = % vrijednosti robe, "po100kg" = € / 100 kg
        carina: {
            "2401": { nacin: "po100kg", stopa: 56 },
            "240220": { nacin: "postotak", stopa: 57.60 },
            "240210": { nacin: "postotak", stopa: 26.00 },
            "2403": { nacin: "postotak", stopa: 74.90 },
            "240411": { nacin: "postotak", stopa: 0 },
            "240412": { nacin: "postotak", stopa: 0 }
        }
    }
};
