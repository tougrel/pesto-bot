import { defineCommand } from "@lib";

export default defineCommand({
    name: "eno",
    run: async (client, interaction) => {
        const user = interaction.options.getUser("pestie", false) || interaction.user;

        await interaction.reply({
            content: `${user.username} English Only Apenas inglês, Solo inglese, 英語だけ, Solo inglés, 영어 만, Только английский, ENGLISH ONLY <:a:yuyuRage:1523394858645983404>`,
        });
    }
});
