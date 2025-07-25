import { MessageFlags } from "discord.js";
import { ComponentType } from "discord-api-types/v10";

export const name = "council";

export async function run(client, interaction) {
	await interaction.deferReply();
	
	const db = client.database;
	const [rows] = await db.query(db.format("SELECT user_id, avg_power, total_rolls from TheCouncil ORDER BY avg_power DESC"));
	
	const council_emote = await client.application.emojis.fetch("1398244533950480534");
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
								content: "# The Council",
							},
							{
								type: ComponentType.TextDisplay,
								content: rows.map((row, index) => `${index}. <@${row.user_id}> with an average **${row.avg_power}** power and **${row.total_rolls}** rolls`).join("\n"),
							},
						],
						accessory: {
							type: ComponentType.Thumbnail,
							media: {
								url: council_emote.imageURL({ size: 128 }) + "&animated=true",
							},
						},
					},
				],
			},
		],
	});
}
