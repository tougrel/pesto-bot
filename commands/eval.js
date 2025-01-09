import {scamCollection} from "./ppcheck.js";

export const name = "eval";
export async function run(client, interaction) {
	const command = interaction.options.getString("code");
	
	if (interaction.user.id !== process.env.DEVELOPER_DISCORD_ID) {
		await interaction.reply({
			content: "Only the bot developer can run this command",
			ephemeral: true,
		});
		
		return;
	}
	
	try {
		eval(command);
		
		await interaction.reply({
			content: "✅ Success",
			ephemeral: true
		});
	} catch (err) {
		console.error(err);
		await interaction.reply({
			content: "❌ An error occurred",
			ephemeral: true
		});
	}
}
