import {getUTCExpireTimestamp, isAprilFools} from "../utils/date.js";
import {MessageFlags} from "discord.js";

export const name = "hornicheck";

export async function run(client, interaction) {
    const db = client.database;
    const user = interaction.options.getUser("pestie", false);
    const power = Math.floor(Math.random() * 101);

    const [rows] = await db.query(db.format("SELECT power, expires FROM HorniCheck WHERE user_id = ? AND expires >= ?", [user ? user.id : interaction.user.id, Date.now()]));
    const data = rows.length > 0 ? rows[0] : undefined;
    const is_april_fools = isAprilFools();
    const has_expired = data?.expires ? Date.now() >= data.expires : false;
    const expire_timestamp = getUTCExpireTimestamp();
    const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
    const power_to_show = is_april_fools ? 50 : power;

    const member = interaction.guild.members.cache.get(user ? user.id : interaction.user.id);
    await interaction.reply({
        content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power_to_show}%** Horni, ${getHorniMessage(power_to_show)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.power}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
    });

    if (is_april_fools) {
        setTimeout(async () => {
            await interaction.editReply({
                content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power}%** Horni, ${getMessage(power)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.power}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
            });
        }, 60 * 1000);
    }

    if(!user) await db.query(db.format("INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, expire_timestamp]));
}

function getMessage(power) {
    return power === 50
        ? "Choose your Allegiance! <:LETDOGCOOK:1323241567561187368>"
        : power > 50
            ? "Welcome to the Horni Revolution! <:yuniiHorni:1323241964820238377>"
            : "Welcome to the Seiso Cops! <:pestoPolice:1323241434966654976>";
}
