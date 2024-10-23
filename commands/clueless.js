import {Collection} from "discord.js";

const collection = new Collection();

export const name = "clueless";
export async function run(client, interaction) {
	if (collection.has(interaction.user.id) && new Date(collection.get(interaction.user.id)).getTime() > Date.now()) {
		const timestamp = Math.round(collection.get(interaction.user.id) / 1000);
		
		await interaction.reply({
			content: `You have already checked how clueless you are today! Check again <t:${timestamp}:R> (<t:${timestamp}>)`,
			ephemeral: true,
		});
		
		return;
	}
	
	let power = Math.floor(Math.random() * 101);
	let date = new Date();
	
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + 1);
	
	collection.set(interaction.user.id, date.getTime());
	
	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (interaction.user.id === "236642620506374145") power = Math.floor(Math.random() * 10000) + 100;
	
	await interaction.reply({
		content: `${interaction.user}'s cluelessness is **${power}%** today!`
	});
}
