import "dotenv/config";
import {GatewayIntentBits, ActivityType, GuildMemberFlags} from "discord-api-types/v10";
import {Client, Partials, Events, Collection} from "discord.js";
import {readFile, readdir} from "node:fs/promises";
import {createPool} from "mysql2/promise";
import {checkCluelessKing, checkCopiumKing} from "./utils/checks.js";

const pool = createPool({
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_DATA,
});

const client = new Client({
	partials: [Partials.User, Partials.GuildMember, Partials.Channel, Partials.Message],
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
	presence: {
		activities: [
			{
				name: "Biting Abba, Watching Vihi die in Celeste and Listening to Frank's talk about feet",
				type: ActivityType.Custom,
			}
		],
	},
});
const commands = new Collection();

// We add the database to the client so we can use it later in the command if needed
client.database = pool;

client.once(Events.ClientReady, async () => {
	console.log("Nya");
	
	const files = await readdir("./commands/");
	for (const file of files) {
		const command = await import((`./commands/${file}`));
		commands.set(command.name, command);
	}
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

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	if (checkCluelessKing(message.author.id.toString())) {
		if (/not (.+)? clueless (king)?/gi.test(message.content)) {
			await message.reply({
				content: "<:cluelessKing:1332416626251010153> <:pestobow:1332418781133410446>"
			});
		}
		else if (/(.+)?I|1(.+)?/gi.test(message.content)) {
//			TODO: make this less frequent and less annoying! (maybe add a chance like the weekend ppcheck?)
//			await message.react("1332416626251010153");
//			await message.react("1332418781133410446");
		}
	}

	if (checkCopiumKing(message.author.id.toString())) {
		if (/not (.+)? copium (king)?/gi.test(message.content)) {
			await message.reply({
				content: "<:copiumKing:1332416650900799619> <:pestobow:1332418781133410446>"
			});
		}
		else if (/(.+)?I(.+)?/gi.test(message.content)) {
//			TODO: make this less frequent and less annoying! (maybe add a chance like the weekend ppcheck?)
//			await message.react("1332416650900799619");
//			await message.react("1332418781133410446");
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		if (commands.has(interaction.commandName)) {
			const command = commands.get(interaction.commandName);
			
			if (process.env.MAINTENANCE === "true" && (interaction.user.id !== process.env.DEVELOPER_DISCORD_ID && interaction.user.id !== "682284810030415903" && interaction.user.id !== "212975234427518979")) {
				return await interaction.reply({
					content: "Under maintenance!",
					ephemeral: true,
				});
			}

			try {
				command.run(client, interaction);
			} catch (err) {
				await interaction.reply({
					content: "Something went wrong! Please contact the developer for more info!",
					ephemeral: true
				});
			}
		} else {
			await interaction.reply({
				content: "Invalid command!",
				ephemeral: true,
			});
		}
	}
});

client.login(process.env.BOT_TOKEN).catch(console.error);
