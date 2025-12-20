import { isAprilFools } from "../utils/date.js";
import { generateMangoPower } from "./allchecks.js";

export const name = "mangocheck";

export async function run(client, interaction) {
    const user = interaction.options.getUser("pestie", false);
    const power = generateMangoPower(user ? user.id : interaction.user.id);
    const powerToShow = isAprilFools() ? 0 : power;

    const member = interaction.guild.members.cache.get(user ? user.id : interaction.user.id);
    await interaction.reply({
        content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${powerToShow}%** mango!`,
    });

    if (is_april_fools) {
        setTimeout(async () => {
            await interaction.editReply({
                content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power}%** mango!`,
            });
        }, 60 * 1000);
    }
}
