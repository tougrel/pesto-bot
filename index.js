import "dotenv/config";
import { Client, ActivityType, GatewayIntentBits, Partials, GuildMemberFlags, Events } from "discord.js";
import { readFile, writeFile } from "node:fs/promises";

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
    const config = JSON.parse(await readFile("configs/config.json"));

    // If the system is not enabled, the member has the bypass verification flag and the member is not kickable then stop here
    if (!config.kick || member.flags.has(GuildMemberFlags.BypassesVerification) || !member.kickable) return;

    // Kick the member
    member.kick("Automatic kick system");
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "yunya") {
            const toggle = interaction.options.getBoolean("value", true);
            const config = JSON.parse(await readFile("configs/config.json"));

            config.kick = toggle;
            await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
            await interaction.reply({
                ephemeral: true,
                content: `✅ Successfully ${config.kick ? "enabled" : "disabled"} the system!`,
            });
        }
    }
});

client.login(process.env.BOT_TOKEN);
