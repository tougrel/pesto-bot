export const name = "hornicheck";

export async function run(client, interaction) {
    const user = interaction.options.getUser("pestie", false);
    const power = Math.floor(Math.random() * 101);
    const message = power === 50 ? "Choose your Allegiance! <:LETDOGCOOK:1323241567561187368>" : power > 50 ? "Welcome to the Horni Revolution! <:yuniiHorni:1323241964820238377>" : "Welcome to the Seiso Cops! <:pestoPolice:1323241434966654976>";

    if (user) {
        const member = interaction.guild.members.cache.get(user.id);
        await interaction.reply({
            content: `**${member.nickname ?? user.username}** is **${power}%** Horni, ${message}`,
        });
    } else {
        await interaction.reply({
            content: `${interaction.user} is **${power}%** Horni, ${message}`,
        });
    }
}
