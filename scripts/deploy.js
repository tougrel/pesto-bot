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
		.setDefaultMemberPermissions(PermissionFlagsBits.MessageSend)
		.addUserOption(
			new SlashCommandUserOption()
				.setName("pestie")
				.setDescription("The pestie you want to bite")
				.setRequired(true)
		),
	new SlashCommandBuilder()
		.setName("ppcheck")
		.setDescription("How big is your pesto power today? Remember to waddle!")
		.setDefaultMemberPermissions(PermissionFlagsBits.MessageSend)
];

// Code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const rest = new REST().setToken(process.env.NODE_ENV === "development" ? process.env.DEV_BOT_TOKEN : process.env.BOT_TOKEN);

(async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.NODE_ENV === "development" ? process.env.DEV_APP_ID : process.env.APP_ID, process.env.GUILD_ID), {body: commands});
		console.log(`Successfully deployed ${commands.length} command(s) to ${process.env.GUILD_ID}.`);
	} catch (err) {
		console.error(err);
	}
})();
