import "dotenv/config";
import { Routes, PermissionFlagsBits } from "discord-api-types/v10";
import {
	REST,
	SlashCommandBuilder,
	SlashCommandBooleanOption,
	SlashCommandSubcommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption,
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
			.setRequired(true),
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
				},
			])
			.setRequired(true),
		),
	)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("roles")
		.setDescription("Gives a role to all the users! DO NOT USE WITHOUT APPROVAL!")
		.addStringOption(
			new SlashCommandStringOption()
			.setName("option")
			.setDescription("Do you want to add or remove the april fools role?")
			.setChoices([
				{
					name: "Add",
					value: "add",
				},
				{
					name: "Remove",
					value: "remove",
				},
			])
			.setRequired(true),
		),
	),
	new SlashCommandBuilder()
	.setName("stream")
	.setDescription("Toggles the #aaaa voice channel")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("on")
		.setDescription("Enable the voice channel"),
	)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("off")
		.setDescription("Kick everyone from the channel and disable it"),
	),
	new SlashCommandBuilder()
	.setName("bite")
	.setDescription("Make yunya bite a pestie")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to bite")
		.setRequired(true),
	),
	new SlashCommandBuilder()
	.setName("allchecks")
	.setDescription("Check how big your pesto power is, how clueless and how high on copium you are today!")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	new SlashCommandBuilder()
	.setName("ppcheck")
	.setDescription("How big is your pesto power today? Remember to waddle!")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to check")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("clueless")
	.setDescription("How clueless are you today?")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to check")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("copium")
	.setDescription("How high on copium are you today?")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to check")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("mangocheck")
	.setDescription("Check your mango power levels!")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to check")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("hornicheck")
	.setDescription("Check how horni you or a pestie is")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to check")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("eval")
	.setDescription("Shhh")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addStringOption(
		new SlashCommandStringOption()
		.setName("code")
		.setDescription("The code that will get executed")
		.setRequired(true),
	),
	new SlashCommandBuilder()
	.setName("hug")
	.setDescription("Give a big hug to a pestie!")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to hug")
		.setRequired(true),
	)
	.addBooleanOption(
		new SlashCommandBooleanOption()
		.setName("tag")
		.setDescription("Do you want to tag the pestie you are hugging?")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("kiss")
	.setDescription("Give a kiss to a pestie!")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addUserOption(
		new SlashCommandUserOption()
		.setName("pestie")
		.setDescription("The pestie you want to kiss")
		.setRequired(true),
	)
	.addBooleanOption(
		new SlashCommandBooleanOption()
		.setName("tag")
		.setDescription("Do you want to tag the pestie you are kissing?")
		.setRequired(false),
	),
	new SlashCommandBuilder()
	.setName("cult")
	.setDescription("Join a Cult and work together to destroy other cults.")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Information about the cult you are currently in"),
	)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("join")
		.setDescription("Join an existing cult")
		.addStringOption(
			new SlashCommandStringOption()
			.setName("name")
			.setDescription("The name of the cult")
			.setRequired(true),
		),
	)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
		.setName("leave")
		.setDescription("Leave your current cult"),
	),
	new SlashCommandBuilder()
	.setName("wallet")
	.setDescription("How many coins do you have in your wallet?")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	new SlashCommandBuilder()
	.setName("council")
	.setDescription("Shows the top 10 average power users across all checks from last month.")
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
];

// Code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		const app_id = process.env.APP_ID;
		const guild_id = process.env.GUILD_ID;
		
		await rest.put(Routes.applicationGuildCommands(app_id, guild_id), { body: commands });
		console.log(`Successfully deployed ${commands.length} command(s) to ${process.env.GUILD_ID}.`);
	} catch (err) {
		console.error(err);
	}
})();
