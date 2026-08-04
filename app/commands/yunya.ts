import { defineCommand } from "@lib";
import { writeFile } from "node:fs/promises";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "yunya",
    async run(client, interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const isMaintenance = import.meta.env.MAINTENANCE === "true";
        const isDev = interaction.user.id === import.meta.env.DEVELOPER_DISCORD_ID;
        const isSyri = interaction.user.id === "682284810030415903";
        const isDog = interaction.user.id === "212975234427518979";

        if (isMaintenance && !isDev && !isSyri && !isDog) {
            await interaction.editReply({
                content: "Permission Denied hehe :D",
            });

            return;
        }

        const config = client.config.config;
        const subcommand = interaction.options.getSubcommand(true);
        if (subcommand === "toggle") {
            const toggle = interaction.options.getBoolean("value", true);
            config.enabled = toggle;

            await writeFile(client.config.configFile || "config.json5", JSON.stringify(config, null, 2), "utf8");
            await interaction.editReply({
                content: `✅ Successfully ${toggle ? "enabled" : "disabled"} the system!`,
            });
        } else if (subcommand === "mode") {
            const mode = interaction.options.getString("value", true);
            config.mode = mode;

            await writeFile(client.config.configFile || "config.json5", JSON.stringify(config, null, 2), "utf8");
            await interaction.editReply({
                content: `Successfully changed the lockdown mode to ${mode}!`,
            });
        } else if (subcommand === "roles") {
            const option = interaction.options.getString("option");
            await interaction.editReply({
                content: `${option === "add" ? "Adding" : "Removing"} role from all guild members... This may take a while!`,
            });

            const members = await interaction.guild.members.fetch();
            for await (const [_id, member] of members) {
                //			if (member.roles.cache.has("649540898874720265")) console.debug(member.user.username);
                if (option === "add" && !member.roles.cache.has("1356366891442110546")) {
                    console.debug("Adding role to " + member.id);
                    await member.roles.add("1356366891442110546");
                } else {
                    console.debug("Removing role from " + member.id);
                    await member.roles.remove("1356366891442110546");
                }
            }

            await interaction.followUp({
                content: "Success!",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
});
