import { MessageFlags } from "discord.js";

export const name = "stream";

export async function run(client, interaction) {
	if (process.env.MAINTENANCE === "true" && (interaction.user.id !== process.env.DEVELOPER_DISCORD_ID && interaction.user.id !== "682284810030415903" && interaction.user.id !== "212975234427518979")) {
		return await interaction.reply({
			content: "Permission Denied hehe :D",
			ephemeral: true,
		});
	}
	
	const channel = interaction.guild.channels.cache.get("1380728375470981221");
	const subcommand = interaction.options.getSubcommand(true);
	if (subcommand === "on") {
		try {
			await channel.permissionOverwrites.edit("1233481038215250193", {
				ViewChannel: true,
				Connect: true,
			});
		} catch (err) {
			console.error(err);
		}
		
		await interaction.reply({
			content: "Channel has been enabled! Have fun streaming Yuyu!",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		if (channel.members.size > 0) {
			for (let member of channel.members.values()) {
				if (member.voice) {
					await member.voice.disconnect("Syri is cool!");
				}
			}
		}
		
		try {
			await channel.permissionOverwrites.edit("1233481038215250193", {
				ViewChannel: false,
				Connect: false,
			});
		} catch (err) {
			console.error(err);
		}
		
		await interaction.reply({
			content: "Successfully kicked all users and disabled the channel!",
			flags: MessageFlags.Ephemeral,
		});
	}
}
