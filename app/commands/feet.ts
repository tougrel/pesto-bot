import { defineCommand } from "@lib";
import { isAprilFools, generateFeetPower } from "@utils";

export default defineCommand({
    name: "feetcheck",
    async run(client, interaction) {
        const user = interaction.options.getUser("pestie", false);
        const power = generateFeetPower(user ? user.id : interaction.user.id);
        const powerToShow = isAprilFools() ? 0 : power;

        const member = interaction.guild.members.cache.get(user ? user.id : interaction.user.id);
        await interaction.reply({
            content: `${user ? (member.nickname ?? user.username) : interaction.user}'s feet power is **${powerToShow}%**!`,
        });

        if (isAprilFools()) {
            setTimeout(async () => {
                await interaction.editReply({
                    content: `${user ? (member.nickname ?? user.username) : interaction.user}'s feet power is **${power}%**!`,
                });
            }, 60 * 1000);
        }
    },
});
