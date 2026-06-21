import { defineCommand } from "@lib";

export default defineCommand({
    name: "save-streak",
    async run(_client, interaction) {
        await interaction.reply({
            // content: "https://cdn.pestoverse.world/yunya/save-streak.png",
            files: [
                {
                    attachment:
                        "https://cdn.pestoverse.world/yunya/save-streak.png",
                    name: "save-streak.png",
                },
            ],
        });
    },
});
