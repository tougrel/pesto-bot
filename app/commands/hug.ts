import { defineCommand } from "@lib";

export default defineCommand({
    name: "hug",
    async run(client, interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser("pestie");
        const tag = interaction.options.getBoolean("tag");
        const member = interaction.guild.members.cache.get(user.id);

        await interaction.editReply({
            content: `${interaction.user} hugs ${tag ? user : (member.nickname ?? user.username)} <:hugpestie:1302372205849612371>`,
        });
    },
});
