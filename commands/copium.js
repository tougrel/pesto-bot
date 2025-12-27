import { getUTCExpireTimestamp, isAprilFools } from "../utils/date.js";
import { MessageFlags } from "discord.js";
import { generateCopiumPower } from "./allchecks.js";

export const name = "copium";

export async function run(client, interaction) {
	try {
		const db = client.database;
		const user = interaction.options.getUser("pestie", false);
		if (user && user.id !== interaction.user.id) {
			const [rows] = await db.query(db.format("SELECT power FROM Copium WHERE user_id = ? AND expires >= ?", [user.id, Date.now()]));
			
			if (rows.length > 0) {
				const power = rows[0].power;
				await interaction.reply({
					content: `**${user}'s** copium level was **${power}%** today! ${user.id === "124963012321738752" ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}`,
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their copium check today! <a:madPesto:1329480709328343132>",
					flags: MessageFlags.Ephemeral,
				});
			}
			
			return;
		}
		
		let emoji = false;
		if (interaction.user.id === "124963012321738752") emoji = true;
		
		const is_april_fools = isAprilFools();
		const [rows] = await db.query(db.format("SELECT power, expires FROM Copium WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
		if (rows.length > 0) {
			const data = rows[0];
			const timestamp = Math.round(data.expires / 1000);
			const power_to_show = is_april_fools ? 0 : data.power;
			await interaction.reply({
				content: `${interaction.user}'s copium level is **${power_to_show}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
				flags: MessageFlags.Ephemeral,
			});
			
			if (is_april_fools) {
				setTimeout(async () => {
					await interaction.editReply({
						content: `${interaction.user}'s copium level is **${data.power}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
						flags: MessageFlags.Ephemeral,
					});
				}, 60 * 1000);
			}
			
			return;
		}
		
		const expire_timestamp = getUTCExpireTimestamp();
		const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
		let power = generateCopiumPower(interaction.user.id);
		
		// Here we generate the power for our copiun king Warlord with a minimum of 100!
		if (interaction.user.id === "124963012321738752") power = Math.floor(Math.random() * (10000 - 100)) + 100;
		
		const power_to_show = is_april_fools ? 0 : power;
		await interaction.reply({
			content: `${interaction.user}'s copium level is **${power_to_show}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
		});
		
		if (is_april_fools) {
			setTimeout(async () => {
				await interaction.editReply({
					content: `${interaction.user}'s copium level is **${power}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
				});
			}, 60 * 1000);
		}
		
		await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, expire_timestamp]));
	} catch (err) {
		console.error(err);
		await interaction.editReply({
			content: "Something went wrong!",
		});
	}
}
