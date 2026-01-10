import {getUTCExpireTimestamp, isAprilFools} from "../utils/date.js";
import {getHorniMessage} from "../utils/messages.js";
import {generateHorniPower} from "./allchecks.js";

export const name = "hornicheck";

export async function run(client, interaction) {
    const user = interaction.options.getUser("pestie", false);
   
    try {
        await interaction.deferReply({ flags: user && user.id !== interaction.user.id ? MessageFlags.Ephemeral : undefined });

        const db = client.database;
        const power = generateHorniPower(user ? user.id : interaction.user.id);

        const [rows] = await db.query(db.format("SELECT power, expires FROM HorniCheck WHERE user_id = ? AND expires >= ?", [user ? user.id : interaction.user.id, Date.now()]));
        const data = rows.length > 0 ? rows[0] : undefined;
        const is_april_fools = isAprilFools();
        const has_expired = data?.expires ? Date.now() >= data.expires : false;
        const expire_timestamp = getUTCExpireTimestamp();
        const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
        const power_to_show = is_april_fools ? 50 : power;

        const member = interaction.guild.members.cache.get(user ? user.id : interaction.user.id);
        await interaction.editReply({
            content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power_to_show}%** Horni, ${getHorniMessage(power_to_show)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.power}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
        });

        if (is_april_fools) {
            setTimeout(async () => {
                await interaction.editReply({
                    content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power}%** Horni, ${getHorniMessage(power)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.power}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                });
            }, 60 * 1000);
        }

        if(!user) await db.query(db.format("INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, expire_timestamp]));
    } catch (err) {
		console.error(err);
        await interaction.editReply({
            content: "Something went wrong!",
        });
	}
}
