import {Collection} from "discord.js";
import {getPPCheckMessage} from "../utils/messages.js";
import {getUTCExpireTimestamp, isAprilFools} from "../utils/date.js";

export const scamCollection = new Collection();
export const name = "ppcheck";
export async function run(client, interaction) {
	const db = client.database;
	const user = interaction.options.getUser("pestie", false);
	if (user && user.id !== interaction.user.id) {
		const [rows] = await db.query(db.format("SELECT power FROM PPCheck WHERE user_id = ? AND expires >= ?", [user.id, Date.now()]));

		if (rows.length > 0) {
			const power = rows[0].power;
			await interaction.reply({
				content: `**${user}'s** Pesto Power was **${power}%** today, ${getPPCheckMessage(power)}`,
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't roll for a ppcheck today! <a:madPesto:1329480709328343132>",
				ephemeral: true
			});
		}

		return;
	}

	let power = Math.floor(Math.random() * 101);
	if (isWeekend()) {
		power = Math.floor(Math.random() * (101 - 35)) + 35;
		
		let random = Math.random().toFixed(2);
		if (random <= 0.1) power = Math.floor(Math.random() * 101) - 100;
	}

	// Small bonus to start the new year!
	if (isNewYears()) power = Math.floor(Math.random() * (101 - 50)) + 50;

	if (scamCollection.has(interaction.user.id) || (user !== null && scamCollection.has(user.id))) {
		const id = user !== null ? user.id : interaction.user.id
		power = scamCollection.get(id);
		scamCollection.delete(id);
	}

	const [rows] = await db.query(db.format("SELECT power, expires FROM PPCheck WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
	const data = rows.length > 0 ? rows[0] : undefined;
	const hasExpired = data?.expires ? Date.now() >= data.expires : false;

	const expire_timestamp = getUTCExpireTimestamp();
	const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

	const is_april_fools = isAprilFools();
	const power_to_show = is_april_fools ? 0 : power;
	await interaction.reply({
		content: `${interaction.user}'s Pesto Power is **${power_to_show}%**, ${getPPCheckMessage(power_to_show)} ${data !== undefined && !hasExpired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First ppcheck of the day was ${is_april_fools ? 0 : data.power}%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
	});

	if (is_april_fools) {
		setTimeout(async () => {
			await interaction.editReply({
				content: `${interaction.user}'s Pesto Power is **${power}%**, ${getPPCheckMessage(power)} ${data !== undefined && !hasExpired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First ppcheck of the day was ${data.power}%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
			});
		}, 60 * 1000);
	}

	if (rows.length === 0) await db.query(db.format("INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)", [interaction.user.id, power, Date.now(), expire_timestamp]));
}

function isWeekend() {
	const date = new Date();
	const day = date.getUTCDay();

	return day === 0 || day === 6;
}

function isNewYears() {
	const date = new Date();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();

	return month === 0 && day === 1;
}
