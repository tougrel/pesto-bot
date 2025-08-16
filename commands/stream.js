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
				SendMessages: true,
				ViewChannel: true,
				Connect: true,
			});
		} catch (err) {
			console.error(err);
		}
		
		try {
			interaction.guild.members.fetch("682284810030415903").then(async (syri) => {
				await syri.send({
					content: "WAKE UP SYRI YUNII IS STARTING A STREAM!!! <a:pestoDinkDonk:1398743521271480381>",
				});
			});
			
			interaction.guild.members.fetch(process.env.DEVELOPER_DISCORD_ID).then(async (syri) => {
				await syri.send({
					content: "YUNII SECRET STREAM!!! <a:pestoDinkDonk:1398743521271480381>",
				});
			});
		} catch (err) {
			console.error("Couldn't DM Syri!");
		}
		
		await interaction.reply({
			content: "Channel has been enabled! Have fun streaming Yuyu!",
			flags: MessageFlags.Ephemeral,
		}).catch(console.error);
	} else {
		if (channel.isTextBased()) {
			await channel.send({
				content: `The channel will be obliterated from existence <t:${Math.round((Date.now() + 10000) / 1000)}:R>!`,
			});
		}
		
		try {
			setTimeout(async () => {
				await channel.permissionOverwrites.edit("1233481038215250193", {
					SendMessages: false,
					ViewChannel: false,
					Connect: false,
				});
				
				if (channel.members.size > 0) {
					for (let member of channel.members.values()) {
						if (member.voice) {
							await member.voice.disconnect("Syri is cool!");
						}
					}
				}
			}, 10000);
		} catch (err) {
			console.error(err);
		}
		
		await interaction.reply({
			content: "Successfully kicked all users and disabled the channel!",
			flags: MessageFlags.Ephemeral,
		}).catch(console.error);
	}
}
