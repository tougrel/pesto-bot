import { defineCommand } from "@lib";
import { MessageFlags } from "discord.js";
import { scamCollection } from "./ppcheck.js";

export default defineCommand({
    name: "eval",
    async run(client, interaction) {
        const command = interaction.options.getString("code");

        if (interaction.user.id !== import.meta.env.DEVELOPER_DISCORD_ID) {
            await interaction.reply({
                content: "Only the bot developer can run this command",
                flags: MessageFlags.Ephemeral,
            });

            return;
        }

        try {
            eval(command);

            await interaction.reply({
                content: "✅ Success",
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: "❌ An error occurred",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
});
