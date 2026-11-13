import { defineCommand } from "@lib";

export default defineCommand({
    name: "throne",
    async run(_client, interaction) {
        await interaction.editReply({
            content: "https://throne.com/yuniiho",
        });
    },
});
