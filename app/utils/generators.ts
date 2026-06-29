import { checkCluelessKing, checkCopiumKing, checkFeetKing, checkPinkGoddess } from "./checks.js";
import {
    isChristmasSeason,
    isJuly6th,
    isSeptember6th,
    isNewYears,
    isWeekend,
    isYuniisBirthday,
} from "./dates.js";

export const CHECK_TYPES = {
    PPCHECK: 0,
    CLUELESS: 1,
    COPIUM: 2,
    HORNI: 3,
    MANGO: 4,
    FEET: 5,
};

export function generatePPCheckPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isWeekend() && !isChristmasSeason()) {
        power = Math.floor(Math.random() * (101 - 35)) + 35;

        let random = Math.random();
        if (random <= 0.1) {
            power = Math.floor(Math.random() * 101) - 100;
        }
    }

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isChristmasSeason()) {
        power = Math.floor(Math.random() * (101 - 50)) + 50;
    }

    // Small bonus to start the new year!
    if (isNewYears()) {
        power = Math.floor(Math.random() * (101 - 75)) + 75;
    }

    if (isYuniisBirthday()) {
        power = Math.floor(Math.random() * (201 - 100)) + 100;
    }

    if (checkPinkGoddess(userId)) {
        power = Infinity;
    }

    return power;
}

export function generateCluelessPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isChristmasSeason()) {
        power = Math.floor(Math.random() * 51);
    }

    if (isNewYears()) {
        power = 0;
    }

    if (checkPinkGoddess(userId)) {
        power = 0;
    }

    // Here we generate the power for our clueless king Aleg with a minimum of 100!
    if (checkCluelessKing(userId) && !isNewYears()) {
        power = Math.floor(Math.random() * (10000 - 100)) + 100;

        if (isJuly6th()) {
            power = 6767;
        }

        if (isSeptember6th()) {
            power = 6969;
        }

        if (isChristmasSeason()) {
            power = Math.floor(Math.random() * (50000 - 10000)) + 10000;
        }
    }

    return power;
}

export function generateCopiumPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isChristmasSeason()) {
        power = Math.floor(Math.random() * 51);
    }

    if (isNewYears()) {
        power = 0;
    }

    if (checkPinkGoddess(userId)) {
        power = 0;
    }

    // Here we generate the power for our copium king Warlord with a minimum of 100!
    if (checkCopiumKing(userId) && !isNewYears()) {
        power = Math.floor(Math.random() * (10000 - 100)) + 100;

        if (isJuly6th()) {
            power = 6767;
        }

        if (isSeptember6th()) {
            power = 6969;
        }

        if (isChristmasSeason()) {
            power = Math.floor(Math.random() * (50000 - 10000)) + 10000;
        }
    }

    return power;
}

export function generateHorniPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isNewYears()) {
        power = 50;
    }

    if (checkPinkGoddess(userId)) {
        power = 50;
    }

    return power;
}

export function generateFeetPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isChristmasSeason()) {
        power = Math.floor(Math.random() * 51);
    }

    if (isNewYears()) {
        power = 0;
    }

    if (checkPinkGoddess(userId)) {
        power = 0;
    }

    if (checkFeetKing(userId)) {
        power = Math.floor(Math.random() * (10000 - 100)) + 100;

        if (isJuly6th()) {
            power = 6767;
        }

        if (isSeptember6th()) {
            power = 6969;
        }

        if (isChristmasSeason() || isNewYears()) {
            power = Math.floor(Math.random() * (50000 - 10000)) + 10000;
        }
    }

    if (userId === "285529265502683138") {
        power = 100;
    }

    return power;
}

export function generateMangoPower(userId: string) {
    let power = Math.floor(Math.random() * 101);

    if (isJuly6th()) {
        power = 67;
    }

    if (isSeptember6th()) {
        power = 69;
    }

    if (isChristmasSeason()) {
        power = Math.floor(Math.random() * (101 - 50)) + 50;
    }

    // For our mango and mad king Zoiyyanino!
    if (userId === "198908340862976000") {
        power = Math.floor(Math.random() * (10000 - 100)) + 100;

        if (isJuly6th()) {
            power = 6767;
        }

        if (isSeptember6th()) {
            power = 6969;
        }

        if (isChristmasSeason() || isNewYears()) {
            power = Math.floor(Math.random() * (50000 - 10000)) + 10000;
        }
    }

    return power;
}

export function generatePestoCoins(power: number) {
    const effect = Math.max(-100, Math.min(power, 100));
    const negative = isChristmasSeason() ? false : power < 0;

    let coins;
    if (negative) {
        coins = Math.max(Math.floor(effect * 10), -500);
    } else {
        if (isChristmasSeason()) {
            coins = Math.floor(1000 + effect * 10);
        } else {
            coins = Math.floor(250 + effect * 10);
        }
    }

    if (isChristmasSeason()) {
        if (isWeekend()) {
            coins = Math.floor(coins * 2.5);
        } else {
            coins = Math.floor(coins * 1.5);
        }
    } else if (isWeekend()) {
        coins = Math.floor(coins * 1.5);
    }

    return { coins: Math.max(coins, -500), negative };
}
