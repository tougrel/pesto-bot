import { defineCommand } from "@lib";

export default defineCommand({
    name: "frank",
    async run(_client, interaction) {
        await interaction.reply({
            // content: "https://cdn.pestoverse.world/yunya/frank_rejected.png",
            files: [
                {
                    attachment:
                        "https://cdn.pestoverse.world/yunya/frank_rejected.png",
                    name: "frank_rejected.png",
                },
            ],
        });
    },
});
