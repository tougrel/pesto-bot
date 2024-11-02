export const name = "hug";

export async function run(client, interaction) {
	const user = interaction.options.getUser("pestie");
	const tag = interaction.options.getBoolean("tag");
	const member = interaction.guild.members.cache.get(user.id);
	
	await interaction.reply({
		content: `${interaction.user} hugs ${tag ? user : member.nickname ?? user.username} <:hugpestie:1302372205849612371>`,
	});
}
