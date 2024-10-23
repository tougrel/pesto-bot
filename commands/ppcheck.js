export const name = "ppcheck";
export async function run(client, interaction) {
	const user = interaction.options.getUser("pestie", false);
	const power = Math.floor(Math.random() * 101);
	
	let message;
	if (power === 0) message = "non existent! <:ppcheck:1282311070924673050>";
	else if (power === 69) message = "nice... <:yuniiGasm:1281945197655363655>";
	else if (power <= 20) message = "So smol, can't even see it! <:yuniiWut:1281948023819337812>";
	else if (power <= 50) message = "hmm... decent size! <:yuniiPog:1281948035181711400>";
	else if (power <= 80) message = "Beeg! Nice! <:yuniiUwaa:1281948029431316530>";
	else message = "Enormous, Gigantic! Overflowing with pesto! <:yuniiCultured:1281948041032765490>"
	
	if (user) {
		const member = interaction.guild.members.cache.get(user.id);
		await interaction.reply({
			content: `**${member.nickname ?? user.username}'s** Pesto Power is **${power}%**, ${message}`,
		});
	} else {
		await interaction.reply({
			content: `${interaction.user}'s Pesto Power is **${power}%**, ${message}`,
		});
	}
}
