import {readFile, writeFile} from "node:fs/promises";
import { MessageFlags } from "discord.js";

export const name = "yunya";

/**
 * @param client
 * @param interaction { import("discord.js").CommandInteraction }
 * @returns {Promise<*>}
 */
export async function run(client, interaction) {
	if (process.env.MAINTENANCE === "true" && (interaction.user.id !== process.env.DEVELOPER_DISCORD_ID && interaction.user.id !== "682284810030415903" && interaction.user.id !== "212975234427518979")) {
		return await interaction.reply({
			content: "Permission Denied hehe :D",
			flags: MessageFlags.Ephemeral,
		});
	}
	
	const subcommand = interaction.options.getSubcommand(true);
	if (subcommand === "toggle") {
		const toggle = interaction.options.getBoolean("value", true);
		const config = JSON.parse((await readFile("configs/config.json")).toString());
		
		config.enabled = toggle;
		await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
		await interaction.reply({
			content: `✅ Successfully ${config.enabled ? "enabled" : "disabled"} the system!`,
			flags: MessageFlags.Ephemeral,
		});
	} else if (subcommand === "mode") {
		const mode = interaction.options.getString("value", true);
		const config = JSON.parse((await readFile("configs/config.json")).toString());
		
		config.mode = mode;
		await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
		await interaction.reply({
			content: `✅ Successfully changed the lockdown mode to ${mode}!`,
			flags: MessageFlags.Ephemeral,
		});
	} else if (subcommand === "roles") {
		const option = interaction.options.getString("option");
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		await interaction.editReply({
			content: `${option === "add" ? "Adding" : "Removing"} role from all guild members... This may take a while!`,
		});

		const members = await interaction.guild.members.fetch();
		for await (const [_id, member] of members) {
//			if (member.roles.cache.has("649540898874720265")) console.debug(member.user.username);
			if (option === "add" && !member.roles.cache.has("1356366891442110546")) {
				console.debug("Adding role to " + member.id);
				await member.roles.add("1356366891442110546");
			} else {
				console.debug("Removing role from " + member.id);
				await member.roles.remove("1356366891442110546");
			}
		}

		await interaction.followUp({
			content: "Success!",
			flags: MessageFlags.Ephemeral,
		});
	}
}
