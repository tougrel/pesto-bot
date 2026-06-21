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
    // yunya command
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

    // stream command
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

    // bite command
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

    // allchecks command
    new SlashCommandBuilder()
        .setName("allchecks")
        .setDescription(
            "Check how big your pesto power is, how clueless and how high on copium you are today!",
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    // ppcheck command
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

    // clueless command
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

    // copium command
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

    // mangocheck command
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

    // feetcheck command
    new SlashCommandBuilder()
        .setName("feetcheck")
        .setDescription("Check your feet power levels!")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(
            new SlashCommandUserOption()
                .setName("pestie")
                .setDescription("The pestie you want to check")
                .setRequired(false),
        ),

    // hornicheck command
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

    // eval command
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

    // hug command
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

    // kiss command
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

    // cult command
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

    // wallet command
    new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("How many coins do you have in your wallet?")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    // council command
    new SlashCommandBuilder()
        .setName("council")
        .setDescription("Shows the top 10 average power users across all checks from last month.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    // frank command
    new SlashCommandBuilder()
        .setName("frank")
        .setDescription("Ouch, Rest In Pesto, Frank")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    // save-streak command
    new SlashCommandBuilder()
        .setName("save-streak")
        .setDescription(
            "Lost your bb streak? You can save it here! (Command sponsored by our Copium King)",
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
];

if (!import.meta.env.BOT_TOKEN) {
    console.error("BOT_TOKEN is not set");
    process.exit(1);
}

// Code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const rest = new REST().setToken(import.meta.env.BOT_TOKEN);

(async () => {
    try {
        const app_id = import.meta.env.APP_ID;
        const guild_id = import.meta.env.GUILD_ID;

        if (!app_id) {
            console.error("APP_ID is not set");
            process.exit(1);
        }

        if (!guild_id) {
            console.error("GUILD_ID is not set");
            process.exit(1);
        }

        await rest.put(Routes.applicationGuildCommands(app_id, guild_id), { body: commands });
        console.log(`Successfully deployed ${commands.length} command(s) to ${guild_id}.`);
    } catch (err) {
        console.error(err);
    }
})();
