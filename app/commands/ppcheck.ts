import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import { Collection, MessageFlags } from "discord.js";
import { getPPCheckMessage } from "../utils/messages.js";
import { getUTCExpireTimestamp, isAprilFools, generatePPCheckPower, CHECK_TYPES } from "@utils";

export const scamCollection = new Collection<string, number>();

export default defineCommand({
    name: "ppcheck",
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
                        CHECK_TYPES.PPCHECK,
                        user.id,
                        Date.now(),
                    ]),
                );

                if (rows.length > 0) {
                    const power = rows[0].check_value;
                    await interaction.editReply({
                        content: `**${user}'s** Pesto Power was **${power}%** today, ${getPPCheckMessage(power)}`,
                    });
                } else {
                    await interaction.editReply({
                        content:
                            "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't roll for a ppcheck today! <a:madPesto:1329480709328343132>",
                    });
                }

                return;
            }

            let power = generatePPCheckPower(interaction.user.id);
            if (
                scamCollection.has(interaction.user.id) ||
                (user !== null && scamCollection.has(user.id))
            ) {
                const id = user !== null ? user.id : interaction.user.id;
                power = scamCollection.get(id);
                scamCollection.delete(id);
            }

            const [rows] = await db.query<RowDataPacket[]>(
                db.format("SELECT check_value, expires_at FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?", [
                    CHECK_TYPES.PPCHECK,
                    interaction.user.id,
                    Date.now(),
                ]),
            );
            const data = rows.length > 0 ? rows[0] : undefined;
            const hasExpired = data?.expires_at ? Date.now() >= data.expires_at : false;

            const expire_timestamp = getUTCExpireTimestamp();
            const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

            const is_april_fools = isAprilFools();
            const power_to_show = is_april_fools ? 0 : power;
            await interaction.editReply({
                content: `${interaction.user}'s Pesto Power is **${power_to_show}%**, ${getPPCheckMessage(power_to_show)} ${data !== undefined && !hasExpired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First ppcheck of the day was ${is_april_fools ? 0 : data.check_value}%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
            });

            if (is_april_fools) {
                setTimeout(async () => {
                    await interaction.editReply({
                        content: `${interaction.user}'s Pesto Power is **${power}%**, ${getPPCheckMessage(power)} ${data !== undefined && !hasExpired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First ppcheck of the day was ${data.check_value}%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                    });
                }, 60 * 1000);
            }

            if (rows.length === 0)
                await db.query(
                    db.format(
                        "INSERT INTO CheckValue(type_id, user_id, check_value, created_at, expires_at) VALUES(?, ?, ?, ?, ?)",
                        [
                            CHECK_TYPES.PPCHECK,
                            interaction.user.id,
                            power === Infinity ? 10000 : power,
                            Date.now(),
                            expire_timestamp,
                        ],
                    ),
                );
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});
