import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import { getUTCExpireTimestamp, isAprilFools, generateCluelessPower, CHECK_TYPES } from "@utils";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "clueless",
    async run(client, interaction) {
        const user = interaction.options.getUser("pestie", false);

        try {
            await interaction.deferReply({
                flags: user && user.id !== interaction.user.id ? MessageFlags.Ephemeral : undefined,
            });

            const db = client.database;
            if (user && user.id !== interaction.user.id) {
                const [rows] = await db.query<RowDataPacket[]>(
                    db.format("SELECT check_value FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?", [
                        CHECK_TYPES.CLUELESS,
                        user.id,
                        Date.now(),
                    ]),
                );

                if (rows.length > 0) {
                    const power = rows[0].check_value;
                    await interaction.editReply({
                        content: `**${user}'s** cluelessness was **${power}%** today! ${user.id === "236642620506374145" ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}`,
                    });
                } else {
                    await interaction.editReply({
                        content:
                            "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their clueless check today! <a:madPesto:1329480709328343132>",
                    });
                }

                return;
            }

            let emoji = false;
            if (interaction.user.id === "236642620506374145") emoji = true;

            const is_april_fools = isAprilFools();
            const [rows] = await db.query<RowDataPacket[]>(
                db.format(
                    "SELECT check_value, expires_at FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?",
                    [CHECK_TYPES.CLUELESS, interaction.user.id, Date.now()],
                ),
            );
            if (rows.length > 0) {
                const data = rows[0];
                const timestamp = Math.round(data.expires_at / 1000);
                const power_to_show = is_april_fools ? 0 : data.check_value;
                await interaction.editReply({
                    content: `${interaction.user}'s cluelessness was **${power_to_show}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
                });

                if (is_april_fools) {
                    setTimeout(async () => {
                        await interaction.editReply({
                            content: `${interaction.user}'s cluelessness was **${data.check_value}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
                        });
                    }, 60 * 1000);
                }

                return;
            }

            const expire_timestamp = getUTCExpireTimestamp();
            const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
            let power = generateCluelessPower(interaction.user.id);

            // Here we generate the power for our clueless king Aleg with a minimum of 100!
            if (interaction.user.id === "236642620506374145")
                power = Math.floor(Math.random() * (10000 - 100)) + 100;

            const power_to_show = is_april_fools ? 0 : power;
            await interaction.editReply({
                content: `${interaction.user}'s cluelessness is **${power_to_show}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
            });

            if (is_april_fools) {
                setTimeout(async () => {
                    await interaction.editReply({
                        content: `${interaction.user}'s cluelessness is **${power}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                    });
                }, 60 * 1000);
            }

            await db.query(
                db.format("INSERT INTO CheckValue(type_id, user_id, check_value, created_at, expires_at) VALUES(?, ?, ?, ?, ?)", [
                    CHECK_TYPES.CLUELESS,
                    interaction.user.id,
                    power,
                    Date.now(),
                    expire_timestamp,
                ]),
            );
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});
