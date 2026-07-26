import { RowDataPacket } from "../../node_modules/mysql2/index";
import { Pool, PoolCluster } from "../../node_modules/mysql2/promise";

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


export async function checkGambaDebuffActive(option: checkGambaOptions) {
    let debuffActive = false

    const [rows] = await option.db.query<RowDataPacket[]>(
        option.db.format(
            "SELECT gamba_pull_id, poor_until FROM GambaHistory WHERE user_id = ? AND debuff_used = 0 ORDER BY poor_until DESC LIMIT 1",
            option.userId
        )
    )

    if (rows.length > 0) {
        const date = Date.now();
        debuffActive = !(date >= rows[0].poor_until)
        await option.db.query<RowDataPacket[]>(
            option.db.format(
                "UPDATE GambaHistory SET debuff_used = 1 WHERE gamba_pull_id = ?",
                rows[0].gamba_pull_id
            )
        )
    }

    console.debug("debuff active?:")
    console.debug(debuffActive)

    return debuffActive
}

interface checkGambaOptions {
    db: Pool,
    userId: string
}