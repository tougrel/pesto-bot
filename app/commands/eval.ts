import { defineCommand } from "@lib";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "eval",
    async run(client, interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const command = interaction.options.getString("code");

        if (interaction.user.id !== import.meta.env.DEVELOPER_DISCORD_ID) {
            await interaction.editReply({
                content: "Only the bot developer can run this command",
            });

            return;
        }

        try {
            eval(command);

            await interaction.editReply({
                content: "✅ Success",
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "❌ An error occurred",
            });
        }
    },
});
