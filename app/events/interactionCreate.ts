import { defineEvent } from "@lib";
import { Events, MessageFlags } from "discord.js";

export default defineEvent({
    name: Events.InteractionCreate,
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            if (client.commands.has(interaction.commandName)) {
                const command = client.commands.get(interaction.commandName);

                const isInMaintenance = import.meta.env.MAINTENANCE === "true";
                const isDeveloper = interaction.user.id === import.meta.env.DEVELOPER_DISCORD_ID;
                const isSyri = interaction.user.id === "682284810030415903";
                const isDog = interaction.user.id === "212975234427518979";
                if (isInMaintenance && !isDeveloper && !isSyri && !isDog) {
                    await interaction.reply({
                        content: "Under maintenance!",
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                try {
                    command.run(client, interaction);
                } catch (err) {
                    console.error(err);
                    await interaction.reply({
                        content:
                            "Something went wrong! Please contact the developer for more info!",
                        flags: MessageFlags.Ephemeral,
                    });
                }
            } else {
                await interaction.reply({
                    content: "Invalid command!",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
});
