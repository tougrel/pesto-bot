import { MessageFlags } from "discord.js";

export const name = "bite";

export async function run(client, interaction) {
	const user = interaction.options.getUser("pestie");
	const member = await interaction.guild.members.fetch({ user, cache: true });
	
	if (member.id === "212975234427518979" || member.id === client.user.id) {
		await interaction.reply({
			content: `<:yuniiX:1283529446946504818> You dare bite me, ${interaction.member.nickname || interaction.user.globalName}? <:PestoFood:1075882159115612252>`,
		});
		
		return;
	}
	
	if (interaction.user.id === "236642620506374145") {
		await interaction.reply({
			content: `${interaction.member.nickname || interaction.user.globalName} tried to attack a pestie! Bite him!`,
		});
		
		await interaction.followUp({
			content: "<:yuniiX:1283529446946504818> Trying to bite a pestie your cluelessness? Not in my watch! <:yuniiRaid:1283531598993821707>",
			flags: MessageFlags.Ephemeral,
		});
		
		return;
	}
	
	await interaction.reply({
		content: `${client.user} attacks ${member.nickname || member.user.globalName}! <:PestoFood:1075882159115612252>`,
	});
	
	await interaction.followUp({
		content: "Remember to waddle pestie! <a:yuniiWaddle:1283532105988571136> <a:yuniiWaddle:1283532105988571136> <a:yuniiWaddle:1283532105988571136>",
		flags: MessageFlags.Ephemeral,
	});
}
