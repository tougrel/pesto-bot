import "dotenv/config";
import {Routes, PermissionFlagsBits} from "discord-api-types/v10";
import {
	REST,
	SlashCommandBuilder,
	SlashCommandBooleanOption,
	SlashCommandSubcommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption
} from "discord.js";

const commands = [
	new SlashCommandBuilder()
		.setName("yunya")
		.setDescription("Toggles the automatic kick system")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("toggle")
				.setDescription("Toggles the lockdown system")
				.addBooleanOption(
					new SlashCommandBooleanOption()
						.setName("value")
						.setDescription("Do you want to enable (True) or disable (False)")
						.setRequired(true)
				),
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("mode")
				.setDescription("Changes the lockdown mode between kick and ban")
				.addStringOption(
					new SlashCommandStringOption()
						.setName("value")
						.setDescription("Do you want to kick or ban members when they join?")
						.setChoices([
							{
								name: "Kick",
								value: "kick",
							},
							{
								name: "Ban",
								value: "ban",
							}
						])
						.setRequired(true)
				)
		),
	new SlashCommandBuilder()
		.setName("bite")
		.setDescription("Make yunya bite a pestie")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to bite")
				.setRequired(true)
		),
	new SlashCommandBuilder()
		.setName("ppcheck")
		.setDescription("How big is your pesto power today? Remember to waddle!")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to check")
				.setRequired(false)
		),
	new SlashCommandBuilder()
		.setName("hornicheck")
		.setDescription("Check how horni you or a pestie is")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to check")
				.setRequired(false)
		),
	new SlashCommandBuilder()
		.setName("clueless")
		.setDescription("How clueless are you today?")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	new SlashCommandBuilder()
		.setName("eval")
		.setDescription("Shhh")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(
			new SlashCommandStringOption()
				.setName("code")
				.setDescription("The code that will get executed")
				.setRequired(true)
		),
	new SlashCommandBuilder()
		.setName("hug")
		.setDescription("Give a big hug to a pestie!")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to hug")
				.setRequired(true)
		)
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName("tag")
				.setDescription("Do you want to tag the pestie you are hugging?")
				.setRequired(false)
		),
	new SlashCommandBuilder()
		.setName("kiss")
		.setDescription("Give a kiss to a pestie!")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to kiss")
				.setRequired(true)
		)
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName("tag")
				.setDescription("Do you want to tag the pestie you are kissing?")
				.setRequired(false)
		),
];

// Code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		const app_id = process.env.APP_ID;
		const guild_id = process.env.GUILD_ID;
		
		await rest.put(Routes.applicationGuildCommands(app_id, guild_id), {body: commands});
		console.log(`Successfully deployed ${commands.length} command(s) to ${process.env.GUILD_ID}.`);
	} catch (err) {
		console.error(err);
	}
})();
