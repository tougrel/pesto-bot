import "dotenv/config";
import { SlashCommandBuilder, SlashCommandBooleanOption, PermissionFlagsBits, REST, Routes } from "discord.js";

const commands = [
    new SlashCommandBuilder()
    .setName("yunya")
    .setDescription("Toggles the automatic kick system")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addBooleanOption(
        new SlashCommandBooleanOption()
        .setName("value")
        .setDescription("Do you want to enable (True) or disable (False) the system?")
        .setRequired(true),
    )
];

// Code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), { body: commands });
        console.log(`Successfully deployed ${commands.length} command(s) to ${process.env.GUILD_ID}.`);
    } catch (err) {
        console.error(err);
    }
})();
