import { MessageFlags } from "discord.js";
import { ComponentType } from "discord-api-types/v10";

export const name = "wallet";

export async function run(client, interaction) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	
	const db = client.database;
	const [rows] = await db.query(db.format("SELECT coins from Wallet WHERE id = ?", [interaction.user.id]));
	if (rows.length === 0) {
		await db.query(db.format("INSERT INTO Wallet(id) VALUES(?)", [interaction.user.id]));
		await run(client, interaction);
		
		return;
	}
	
	const user = rows[0];
	const coins = user?.coins || 0;
	const coin_emote = await client.application.emojis.fetch("1398010839667179531");
	const waddle_emote = await client.application.emojis.fetch("1283532105988571136");
	const corpa_emote = await client.application.emojis.fetch("1398222323399524423");
	await interaction.editReply({
		flags: MessageFlags.IsComponentsV2,
		components: [
			{
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.Section,
						components: [
							{
								type: ComponentType.TextDisplay,
								content: `# Wallet\nYou’ve earned **${coins}** pesto coins through your daily grind! ${waddle_emote}\nCome back daily to collect more and grow your wallet. ${corpa_emote}`,
							},
						],
						accessory: {
							type: ComponentType.Thumbnail,
							media: {
								url: coin_emote.imageURL(),
							},
						},
					},
				],
			},
		],
	});
}
