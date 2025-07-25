import { MessageFlags } from "discord.js";
import { ComponentType } from "discord-api-types/v10";

export const name = "council";

export async function run(client, interaction) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	
	const db = client.database;
	const [rows] = await db.query(db.format("SELECT user_id, avg_power, total_rolls from TheCouncil"));
	const [full] = await db.query(db.format("SELECT user_id, avg_power, total_rolls from TheCouncilFull"));
	
	const aleg = full.filter((row) => row.user_id === "236642620506374145");
	const warlord = full.filter((row) => row.user_id === "124963012321738752");
	const user = full.filter((row) => row.user_id === interaction.user.id);
	const userIndex = full.findIndex((row) => row.user_id === interaction.user.id);
	
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
								content: `# The Council\n## Special seats\n1. <@236642620506374145> the clueless king ${aleg.length > 0 ? `with an average **${aleg[0].avg_power}** power and **${aleg[0].total_rolls}** rolls` : ""} <:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>\n2. <@124963012321738752> the copium king ${warlord.length > 0 ? `with an average **${warlord[0].avg_power}** power and **${warlord[0].total_rolls}** rolls` : ""} <:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>`,
							},
							{
								type: ComponentType.TextDisplay,
								content: `## Elected Members\n${rows.map((row, index) => `${index}. <@${row.user_id}> with an average **${row.avg_power}** power and **${row.total_rolls}** rolls`).join("\n")}`,
							},
							{
								type: ComponentType.TextDisplay,
								content: `${user.length > 0 ? `### Your Rank is **${userIndex + 1}** with an average power of **${user[0].avg_power}**\n` : ""}-# The Council elected members reset every month!`
							}
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
