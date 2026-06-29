import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import { getUTCExpireTimestamp, isAprilFools, generateCopiumPower, COPIUM_MESSAGES, CHECK_TYPES } from "@utils";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "copium",
    run: async (client, interaction) => {
        const user = interaction.options.getUser("pestie", false);

        try {
            await interaction.deferReply({
                flags: user && user.id !== interaction.user.id ? MessageFlags.Ephemeral : undefined,
            });

            const db = client.database;
            if (user && user.id !== interaction.user.id) {
                const [rows] = await db.query<RowDataPacket[]>(
                    db.format("SELECT check_value FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?", [
                        CHECK_TYPES.COPIUM,
                        user.id,
                        Date.now(),
                    ]),
                );

                if (rows.length > 0) {
                    const power = rows[0].check_value;
                    await interaction.editReply({
                        content: `**${user}'s** copium level was **${power}%** today! ${user.id === "124963012321738752" ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}`,
                    });
                } else {
                    await interaction.editReply({
                        content:
                            "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their copium check today! <a:madPesto:1329480709328343132>",
                    });
                }

                return;
            }

            let emoji = false;
            if (interaction.user.id === "124963012321738752") emoji = true;

            const is_april_fools = isAprilFools();
            const [rows] = await db.query<RowDataPacket[]>(
                db.format("SELECT check_value, expires_at FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?", [
                    CHECK_TYPES.COPIUM,
                    interaction.user.id,
                    Date.now(),
                ]),
            );
            if (rows.length > 0) {
                const data = rows[0];
                const timestamp = Math.round(data.expires_at / 1000);
                const power_to_show = is_april_fools ? 0 : data.check_value;
                await interaction.editReply({
                    content: `${interaction.user}'s copium level is **${power_to_show}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
                });

                if (is_april_fools) {
                    setTimeout(async () => {
                        await interaction.editReply({
                            content: `${interaction.user}'s copium level is **${data.check_value}%** today! ${data.check_value > 50 ? COPIUM_MESSAGES.EXTRA : ""} ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${timestamp}:R> (<t:${timestamp}>)`,
                        });
                    }, 60 * 1000);
                }

                return;
            }

            const expire_timestamp = getUTCExpireTimestamp();
            const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
            let power = generateCopiumPower(interaction.user.id);

            // Here we generate the power for our copiun king Warlord with a minimum of 100!
            if (interaction.user.id === "124963012321738752")
                power = Math.floor(Math.random() * (10000 - 100)) + 100;

            const power_to_show = is_april_fools ? 0 : power;
            await interaction.editReply({
                content: `${interaction.user}'s copium level is **${power_to_show}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
            });

            if (is_april_fools) {
                setTimeout(async () => {
                    await interaction.editReply({
                        content: `${interaction.user}'s copium level is **${power}%** today! ${power > 50 ? COPIUM_MESSAGES.EXTRA : ""} ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                    });
                }, 60 * 1000);
            }

            await db.query(
                db.format("INSERT INTO CheckValue(type_id, user_id, check_value, created_at, expires_at) VALUES(?, ?, ?, ?, ?)", [
                    CHECK_TYPES.COPIUM,
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
