import type { RowDataPacket, Pool } from "mysql2/promise";

/**
 * @param id { String } the Discord ID of a user
 */
export function checkCluelessKing(id: string) {
    return id === "236642620506374145";
}

/**
 * @param id { String } the Discord ID of a user
 */
export function checkCopiumKing(id: string) {
    return id === "124963012321738752";
}

/**
 * @param id { String } the Discord ID of a user
 */
export function checkFeetKing(id: string) {
    return id === "853014553079971870";
}

/**
 * @param id { String } the Discord ID of a user
 */
export function checkPinkGoddess(id: string) {
    return id === "212975234427518979";
}

/**
 * @param id { String } the Discord ID of a user
 */
export function checkBanker(id: string) {
    return id === "599384106056286208";
}

/**
 * @param id { String } the Discord ID of a user
 */
export function checkHardhat(id: string) {
    return id === "682284810030415903"
}

/**
 * Checks if an expiry timestap lies in the future or in the past
 * @param values { number[] }
 * @returns array
 */
export async function checkForExpired(...values: number[]) {
    const array = [];
    const date = Date.now();

    for await (let value of values) {
        array.push(date >= value);
    }

    return array;
}


export async function checkGambaDebuffActive(db: Pool, userId: string) {
    const [rows] = await db.query<RowDataPacket[]>(
        db.format(
            "SELECT gamba_pull_id, poor_until FROM GambaHistory WHERE user_id = ? AND debuff_used = 0 ORDER BY poor_until DESC LIMIT 1",
            userId
        )
    )

    if (rows.length === 0) {
        return { active: false, pullId: null }
    }

    const active = Date.now() < rows[0].poor_until;
    return { active, pullId: rows[0].gamba_pull_id }
}

export async function consumeGambaDebuff(db: Pool, pullId: number) {
    try {
        await db.query<RowDataPacket[]>(
            db.format(
                "UPDATE GambaHistory SET debuff_used = 1 WHERE gamba_pull_id = ?",
                pullId
            )
        )
    } catch (err) {
        console.error(err);
    }
}
