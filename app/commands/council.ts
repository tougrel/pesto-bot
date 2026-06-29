import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import { MessageFlags } from "discord.js";
import { ComponentType } from "discord-api-types/v10";
import { exists } from "@utils";

export default defineCommand({
    name: "council",
    async run(client, interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const db = client.database;
            const [kings] = await db.query<RowDataPacket[]>(
                db.format("SELECT user_id, avg_power, total_rolls from TheCouncil WHERE is_king = 1"),
            );
            const [users] = await db.query<RowDataPacket[]>(
                db.format("SELECT user_id, avg_power, total_rolls from TheCouncil WHERE is_king = 0 LIMIT 10"),
            );

            const aleg = kings.find((row) => row.user_id === "236642620506374145");
            const warlord = kings.find((row) => row.user_id === "124963012321738752");
            const user = users.filter((row) => row.user_id === interaction.user.id);
            const userIndex = users.findIndex((row) => row.user_id === interaction.user.id);

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
                                        content: `# The Council\n## Special seats\n1. <@236642620506374145> the clueless king ${exists(aleg) ? `with an average **${aleg.avg_power}** power and **${aleg.total_rolls}** rolls` : ""} <:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>\n2. <@124963012321738752> the copium king ${exists(warlord) ? `with an average **${warlord.avg_power}** power and **${warlord.total_rolls}** rolls` : ""} <:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>`,
                                    },
                                    {
                                        type: ComponentType.TextDisplay,
                                        content: `## Elected Members\n${users.map((row, index) => `${index}. <@${row.user_id}> with an average **${row.avg_power}** power and **${row.total_rolls}** rolls`).join("\n")}`,
                                    },
                                    {
                                        type: ComponentType.TextDisplay,
                                        content: `${exists(user) ? `### Your Rank is **${userIndex + 1}** with an average power of **${user[0].avg_power}** and **${user[0].total_rolls}** rolls\n` : ""}-# The Council elected members reset every month!`,
                                    },
                                ],
                                accessory: {
                                    type: ComponentType.Thumbnail,
                                    media: {
                                        url:
                                            council_emote.imageURL({
                                                size: 128,
                                            }) + "&animated=true",
                                    },
                                },
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});
