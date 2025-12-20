import { getUTCExpireTimestamp, isAprilFools } from "../utils/date.js";
import { MessageFlags } from "discord.js";
import { generateCluelessPower } from "./allchecks.js";

export const name = "clueless";

export async function run(client, interaction) {
	const db = client.database;
	const user = interaction.options.getUser("pestie", false);
	if (user && user.id !== interaction.user.id) {
		const [rows] = await db.query(db.format("SELECT power FROM Clueless WHERE user_id = ? AND expires >= ?", [user.id, Date.now()]));
		
		if (rows.length > 0) {
			const power = rows[0].power;
			await interaction.reply({
				content: `**${user}'s** cluelessness was **${power}%** today! ${user.id === "236642620506374145" ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}`,
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their clueless check today! <a:madPesto:1329480709328343132>",
				flags: MessageFlags.Ephemeral,
			});
		}
		
		return;
	}
	
	let emoji = false;
	if (interaction.user.id === "236642620506374145") emoji = true;
	
	const is_april_fools = isAprilFools();
	const [rows] = await db.query(db.format("SELECT power, expires FROM Clueless WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
	if (rows.length > 0) {
		const data = rows[0];
		const timestamp = Math.round(data.expires / 1000);
		const power_to_show = is_april_fools ? 0 : data.power;
		await interaction.reply({
			content: `${interaction.user}'s cluelessness was **${power_to_show}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
			flags: MessageFlags.Ephemeral,
		});
		
		if (is_april_fools) {
			setTimeout(async () => {
				await interaction.editReply({
					content: `${interaction.user}'s cluelessness was **${data.power}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
					flags: MessageFlags.Ephemeral,
				});
			}, 60 * 1000);
		}
		
		return;
	}
	
	const expire_timestamp = getUTCExpireTimestamp();
	const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
	let power = generateCluelessPower(interaction.user.id);
	
	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (interaction.user.id === "236642620506374145") power = Math.floor(Math.random() * (10000 - 100)) + 100;
	
	const power_to_show = is_april_fools ? 0 : power;
	await interaction.reply({
		content: `${interaction.user}'s cluelessness is **${power_to_show}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
	});
	
	if (is_april_fools) {
		setTimeout(async () => {
			await interaction.editReply({
				content: `${interaction.user}'s cluelessness is **${power}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
			});
		}, 60 * 1000);
	}
	
	await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, expire_timestamp]));
}
