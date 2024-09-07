import "dotenv/config";
import {GatewayIntentBits, ActivityType, GuildMemberFlags} from "discord-api-types/v10";
import {Client, Partials, Events, GuildMember} from "discord.js";
import {readFile, writeFile} from "node:fs/promises";

const client = new Client({
	partials: [Partials.User, Partials.GuildMember],
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	presence: {
		activities: [
			{
				name: "Biting Abba, Watching Vihi die in Celeste and Listening to Frank's talk about feet",
				type: ActivityType.Custom,
			}
		],
	},
});

client.once(Events.ClientReady, () => {
	console.log("Nya");
});

client.on(Events.GuildMemberAdd, async (member) => {
	// Get the config
	const config = JSON.parse((await readFile("configs/config.json")).toString());
	
	// If the system is not enabled, the member has the bypass verification flag and the member is not kickable then stop here
	if (!config.enabled || member.user.bot || member.flags.has(GuildMemberFlags.BypassesVerification) || !member.kickable) return;
	
	// If the mode in the config is set to kick then kick the user
	if (config.mode === "kick") await member.kick("Yunya lockdown system");
	// else just drop the ban hammer on him :D
	else await member.ban({reason: "Yunya lockdown system"});
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		if (interaction.commandName === "yunya") {
			if (interaction.options.getSubcommand() === "toggle") {
				const toggle = interaction.options.getBoolean("value", true);
				const config = JSON.parse((await readFile("configs/config.json")).toString());
				
				config.enabled = toggle;
				await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
				await interaction.reply({
					ephemeral: true,
					content: `✅ Successfully ${config.enabled ? "enabled" : "disabled"} the system!`,
				});
				
				return;
			} else if (interaction.options.getSubcommand() === "mode") {
				const mode = interaction.options.getString("value", true);
				const config = JSON.parse((await readFile("configs/config.json")).toString());
				
				config.mode = mode;
				await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
				await interaction.reply({
					ephemeral: true,
					content: `✅ Successfully changed the lockdown mode to ${mode}!`
				});
				
				return;
			}
		}
		
		if (interaction.commandName === "bite") {
			const member = interaction.options.getUser("pestie");
			
			await interaction.reply({
				content: `${client.user} attacks ${member.username}! <:PestoFood:1075882159115612252>`,
			});
		}
		
		if (interaction.commandName === "ppcheck") {
			const power = Math.floor(Math.random() * 100);
			
			let message;
			if (power === 69) message = "nice... <:yuniiGasm:1281945197655363655>";
			else if (power <= 20) message = "So smol, can't even see it! <:yuniiWut:1281948023819337812>";
			else if (power <= 50) message = "hmm... decent size! <:yuniiPog:1281948035181711400>";
			else if (power <= 80) message = "Beeg! Nice! <:yuniiUwaa:1281948029431316530>";
			else message = "Enormous, Gigantic! Overflowing with pesto! <:yuniiCultured:1281948041032765490>"
			
			await interaction.reply({
				content: `${interaction.user}'s Pesto Power is ${power} ${message}`,
			});
		}
	}
});

client.login(process.env.NODE_ENV === "development" ? process.env.DEV_BOT_TOKEN : process.env.BOT_TOKEN).catch(console.error);
