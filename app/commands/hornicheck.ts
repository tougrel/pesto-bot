import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import { getUTCExpireTimestamp, isAprilFools, getHorniMessage, generateHorniPower, CHECK_TYPES } from "@utils";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "hornicheck",
    async run(client, interaction) {
        const user = interaction.options.getUser("pestie", false);

        try {
            await interaction.deferReply({
                flags: user && user.id !== interaction.user.id ? MessageFlags.Ephemeral : undefined,
            });

            const db = client.database;
            const power = generateHorniPower(user ? user.id : interaction.user.id);

            const [rows] = await db.query<RowDataPacket[]>(
                db.format(
                    "SELECT check_value, expires_at FROM CheckValue WHERE type_id = ? AND user_id = ? AND expires_at >= ?",
                    [CHECK_TYPES.HORNI, user ? user.id : interaction.user.id, Date.now()],
                ),
            );
            const data = rows.length > 0 ? rows[0] : undefined;
            const is_april_fools = isAprilFools();
            const has_expired = data?.expires_at ? Date.now() >= data.expires_at : false;
            const expire_timestamp = getUTCExpireTimestamp();
            const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
            const power_to_show = is_april_fools ? 50 : data?.check_value ?? power;

            const member = interaction.guild.members.cache.get(
                user ? user.id : interaction.user.id,
            );
            await interaction.editReply({
                content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power_to_show}%** Horni, ${getHorniMessage(power_to_show)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.check_value}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
            });

            if (is_april_fools) {
                setTimeout(async () => {
                    await interaction.editReply({
                        content: `${user ? (member.nickname ?? user.username) : interaction.user} is **${power}%** Horni, ${getHorniMessage(power)} ${data !== undefined && !has_expired ? `(**Reroll** <a:pestoScam:1323758768336404500>! First hornicheck of the date was **${data.check_value}**%)` : ""}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                    });
                }, 60 * 1000);
            }

            if (!user) {
                await db.query(
                    db.format("INSERT INTO CheckValue(type_id, user_id, check_value, created_at, expires_at) VALUES(?, ?, ?, ?, ?)", [
                        CHECK_TYPES.HORNI,
                        interaction.user.id,
                        power,
                        Date.now(),
                        expire_timestamp,
                    ]),
                );
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});
