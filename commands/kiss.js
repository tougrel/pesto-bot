export const name = "kiss";

export async function run(client, interaction) {
	const user = interaction.options.getUser("pestie");
	const tag = interaction.options.getBoolean("tag");
	const member = interaction.guild.members.cache.get(user.id);
	
	await interaction.reply({
		content: `${interaction.user} kissed ${tag ? user : member.nickname ?? user.username} <a:kissapestie:1302372194520666243>`,
	});
}
