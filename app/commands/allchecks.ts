import type { RowDataPacket } from "mysql2";
import { defineCommand } from "@lib";
import * as Utils from "@utils";
import { MessageFlags } from "discord.js";
import { ComponentType, SeparatorSpacingSize } from "discord-api-types/v10";

export default defineCommand({
    name: "allchecks",
    async run(client, interaction) {
        const db = client.database;

        await interaction.deferReply();
        try {
            const [rows] = await db.query<RowDataPacket[]>(
                db.format(
                    "SELECT pp_power, pp_expires, clueless_power, clueless_expires, copium_power, copium_expires, horni_power, horni_expires FROM AllChecks WHERE user_id = ?",
                    [interaction.user.id],
                ),
            );

            if (rows.length > 0) {
                const data = rows[0];

                let pp_power = data.pp_power || 0;
                let clueless_power = data.clueless_power || 0;
                let copium_power = data.copium_power || 0;
                let horni_power = data.horni_power || 0;

                // Maybe change this in the future to be included in the database. For now, it changes every time you run the command
                let feet_power = Utils.generateFeetPower(interaction.user.id);
                let mango_power = Utils.generateMangoPower(interaction.user.id);

                const [pp_expired, clueless_expired, copium_expired, horni_expired] =
                    await checkForExpired(
                        data.pp_expires,
                        data.clueless_expires,
                        data.copium_expires,
                        data.horni_expires,
                    );
                if (pp_expired) pp_power = Utils.generatePPCheckPower(interaction.user.id);
                if (clueless_expired)
                    clueless_power = Utils.generateCluelessPower(interaction.user.id);
                if (copium_expired) copium_power = Utils.generateCopiumPower(interaction.user.id);
                if (horni_expired) horni_power = Utils.generateHorniPower(interaction.user.id);

                const is_april_fools = Utils.isAprilFools();
                const expire_timestamp = Utils.getUTCExpireTimestamp();
                const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

                const pp_power_to_show = is_april_fools ? 0 : pp_power;
                const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
                const copium_power_to_show = is_april_fools ? 0 : copium_power;
                const horni_power_to_show = is_april_fools ? 0 : horni_power;
                const feet_power_to_show = is_april_fools ? -100 : feet_power;
                const mango_power_to_show = is_april_fools ? 0 : mango_power;
                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        {
                            type: ComponentType.Container,
                            accent_color: Utils.isChristmasSeason() ? 0xff0000 : undefined,
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content:
                                        `- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power_to_show}%**, ${Utils.getPPCheckMessage(pp_power_to_show)}` +
                                        `\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power_to_show}%** today! ${Utils.getCluelessKingMessage(interaction.user.id)}` +
                                        `\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power_to_show}%** today! ${Utils.getCopiumKingMessage(interaction.user.id)}` +
                                        `\n- Horni level ${horni_expired ? "is" : "was"} **${horni_power_to_show}%**, ${Utils.getHorniMessage(horni_power_to_show)}` +
                                        `\n- Feet power is **${feet_power_to_show}%**` +
                                        `\n- Mango power is **${mango_power_to_show}%** <a:pestoMango:1452244340150632488>`,
                                },
                                {
                                    type: ComponentType.Separator,
                                    spacing: SeparatorSpacingSize.Small,
                                    divider: true,
                                },
                                {
                                    type: ComponentType.TextDisplay,
                                    content: Utils.isChristmasSeason()
                                        ? `### <a:pestoPadoru:1452242346518384681> Christmas boosts are on! <a:pestoPadoru:1452242346518384681>\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`
                                        : `\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                                },
                            ],
                        },
                    ],
                });

                if (is_april_fools) {
                    setTimeout(async () => {
                        await interaction.editReply({
                            flags: MessageFlags.IsComponentsV2,
                            components: [
                                {
                                    type: ComponentType.Container,
                                    accent_color: Utils.isChristmasSeason() ? 0xff0000 : undefined,
                                    components: [
                                        {
                                            type: ComponentType.TextDisplay,
                                            content:
                                                `- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power}%**, ${Utils.getPPCheckMessage(pp_power)}` +
                                                `\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power}%** today! ${Utils.getCluelessKingMessage(interaction.user.id)}` +
                                                `\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power}%** today! ${Utils.getCopiumKingMessage(interaction.user.id)}` +
                                                `\n- Horni level ${horni_expired ? "is" : "was"} **${horni_power}%**, ${Utils.getHorniMessage(horni_power)}` +
                                                `\n- Feet power is **${feet_power_to_show}%**` +
                                                `\n- Mango power is **${mango_power_to_show}%** <a:pestoMango:1452244340150632488>`,
                                        },
                                        {
                                            type: ComponentType.Separator,
                                            spacing: SeparatorSpacingSize.Small,
                                            divider: true,
                                        },
                                        {
                                            type: ComponentType.TextDisplay,
                                            content: Utils.isChristmasSeason()
                                                ? `### <a:pestoPadoru:1452242346518384681> Christmas boosts are on! <a:pestoPadoru:1452242346518384681>\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`
                                                : `\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                                        },
                                    ],
                                },
                            ],
                        });
                    }, 60 * 1000);
                }

                if (pp_expired) {
                    await db.query(
                        db.format(
                            "INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)",
                            [interaction.user.id, pp_power, Date.now(), expire_timestamp],
                        ),
                    );
                }

                if (clueless_expired) {
                    await db.query(
                        db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [
                            interaction.user.id,
                            clueless_power,
                            expire_timestamp,
                        ]),
                    );
                }

                if (copium_expired) {
                    await db.query(
                        db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [
                            interaction.user.id,
                            copium_power,
                            expire_timestamp,
                        ]),
                    );
                }

                if (horni_expired) {
                    await db.query(
                        db.format(
                            "INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)",
                            [interaction.user.id, horni_power, expire_timestamp],
                        ),
                    );
                }

                // This is temporary as I'm going to rewrite the whole bot in typescript soon
                // Forgive the mess hehe :pestoShy:
                try {
                    const [rows] = await db.query<RowDataPacket[]>(
                        db.format(
                            "SELECT created_at FROM WalletHistory WHERE id = ? AND type = ? AND expires_at >= UNIX_TIMESTAMP() * 1000",
                            [interaction.user.id, "allchecks"],
                        ),
                    );
                    if (rows.length === 0) {
                        const { coins, negative } = Utils.generatePestoCoins(pp_power);
                        await db.query(
                            db.format(
                                "INSERT INTO Wallet(id, coins, total_coins) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE coins = coins + VALUES(coins), total_coins = total_coins + VALUES(total_coins)",
                                [interaction.user.id, coins, coins],
                            ),
                        );
                        await db.query(
                            db.format(
                                "INSERT INTO WalletHistory(id, type, coins, created_at, expires_at) VALUES(?, ?, ?, ?, ?)",
                                [
                                    interaction.user.id,
                                    "allchecks",
                                    coins,
                                    Date.now(),
                                    expire_timestamp,
                                ],
                            ),
                        );

                        const coin_emote =
                            await client.application.emojis.fetch("1398010839667179531");
                        await interaction.followUp({
                            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                            components: [
                                {
                                    type: ComponentType.Container,
                                    components: [
                                        {
                                            type: ComponentType.Section,
                                            components: [
                                                {
                                                    type: ComponentType.TextDisplay,
                                                    content: Utils.getPestoCoinsMessage(
                                                        negative,
                                                    ).replace(/\{coins}/, coins.toString()),
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
                } catch (err) {
                    console.error(err);
                }
            } else {
                let pp_power = Utils.generatePPCheckPower(interaction.user.id);
                let clueless_power = Utils.generateCluelessPower(interaction.user.id);
                let copium_power = Utils.generateCopiumPower(interaction.user.id);
                let horni_power = Utils.generateHorniPower(interaction.user.id);
                // Maybe change this in the future to be included in the database. For now, it's exclusive to one user
                let feet_power = Utils.generateFeetPower(interaction.user.id);
                const mango_power = Utils.generateMangoPower(interaction.user.id);

                const is_april_fools = Utils.isAprilFools();
                const expire_timestamp = Utils.getUTCExpireTimestamp();
                const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

                const pp_power_to_show = is_april_fools ? 0 : pp_power;
                const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
                const copium_power_to_show = is_april_fools ? 0 : copium_power;
                const horni_power_to_show = is_april_fools ? 0 : horni_power;
                const feet_power_to_show = is_april_fools ? -100 : feet_power;
                const mango_power_to_show = is_april_fools ? 0 : mango_power;

                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: [
                        {
                            type: ComponentType.Container,
                            accent_color: Utils.isChristmasSeason() ? 0xff0000 : undefined,
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content:
                                        `- Pesto Power is **${pp_power_to_show}%**, ${Utils.getPPCheckMessage(pp_power_to_show)}` +
                                        `\n- Cluelessness is **${clueless_power_to_show}%** today! ${Utils.getCluelessKingMessage(interaction.user.id)}` +
                                        `\n- Copium level is **${copium_power_to_show}%** today! ${Utils.getCopiumKingMessage(interaction.user.id)}` +
                                        `\n- Horni level is **${horni_power_to_show}%**, ${Utils.getHorniMessage(horni_power_to_show)}` +
                                        `\n- Feet power is **${feet_power_to_show}%**` +
                                        `\n- Mango power is **${mango_power_to_show}%** <a:pestoMango:1452244340150632488>`,
                                },
                                {
                                    type: ComponentType.Separator,
                                    spacing: SeparatorSpacingSize.Small,
                                    divider: true,
                                },
                                {
                                    type: ComponentType.TextDisplay,
                                    content: Utils.isChristmasSeason()
                                        ? `### <a:pestoPadoru:1452242346518384681> Christmas boosts are on! <a:pestoPadoru:1452242346518384681>\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`
                                        : `\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                                },
                            ],
                        },
                    ],
                });

                if (is_april_fools) {
                    setTimeout(async () => {
                        await interaction.editReply({
                            flags: MessageFlags.IsComponentsV2,
                            components: [
                                {
                                    type: ComponentType.Container,
                                    accent_color: Utils.isChristmasSeason() ? 0xff0000 : undefined,
                                    components: [
                                        {
                                            type: ComponentType.TextDisplay,
                                            content:
                                                `- Pesto Power is **${pp_power}%**, ${Utils.getPPCheckMessage(pp_power_to_show)}` +
                                                `\n- Cluelessness is **${clueless_power}%** today! ${Utils.getCluelessKingMessage(interaction.user.id)}` +
                                                `\n- Copium level is **${copium_power}%** today! ${Utils.getCopiumKingMessage(interaction.user.id)}` +
                                                `\n- Horni level is **${horni_power}%**, ${Utils.getHorniMessage(horni_power_to_show)}` +
                                                `\n- Feet power is **${feet_power}%**` +
                                                `\n- Mango power is **${mango_power_to_show}%** <a:pestoMango:1452244340150632488>`,
                                        },
                                        {
                                            type: ComponentType.Separator,
                                            spacing: SeparatorSpacingSize.Small,
                                            divider: true,
                                        },
                                        {
                                            type: ComponentType.TextDisplay,
                                            content: Utils.isChristmasSeason()
                                                ? `### <a:pestoPadoru:1452242346518384681> Christmas boosts are on! <a:pestoPadoru:1452242346518384681>\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`
                                                : `\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
                                        },
                                    ],
                                },
                            ],
                        });
                    }, 60 * 1000);
                }

                await db.query(
                    db.format(
                        "INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)",
                        [
                            interaction.user.id,
                            pp_power === Infinity ? 1000 : pp_power,
                            Date.now(),
                            expire_timestamp,
                        ],
                    ),
                );
                await db.query(
                    db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [
                        interaction.user.id,
                        clueless_power,
                        expire_timestamp,
                    ]),
                );
                await db.query(
                    db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [
                        interaction.user.id,
                        copium_power,
                        expire_timestamp,
                    ]),
                );
                await db.query(
                    db.format("INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)", [
                        interaction.user.id,
                        horni_power,
                        expire_timestamp,
                    ]),
                );

                try {
                    const [rows] = await db.query<RowDataPacket[]>(
                        db.format(
                            "SELECT created_at FROM WalletHistory WHERE id = ? AND type = ? AND expires_at >= UNIX_TIMESTAMP() * 1000",
                            [interaction.user.id, "allchecks"],
                        ),
                    );
                    if (rows.length === 0) {
                        const { coins, negative } = Utils.generatePestoCoins(pp_power);
                        await db.query(
                            db.format(
                                "INSERT INTO Wallet(id, coins, total_coins) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE coins = coins + VALUES(coins), total_coins = total_coins + VALUES(total_coins)",
                                [interaction.user.id, coins, coins],
                            ),
                        );
                        await db.query(
                            db.format(
                                "INSERT INTO WalletHistory(id, type, coins, created_at, expires_at) VALUES(?, ?, ?, ?, ?)",
                                [
                                    interaction.user.id,
                                    "allchecks",
                                    coins,
                                    Date.now(),
                                    expire_timestamp,
                                ],
                            ),
                        );

                        const coin_emote =
                            await client.application.emojis.fetch("1398010839667179531");
                        await interaction.followUp({
                            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                            components: [
                                {
                                    type: ComponentType.Container,
                                    components: [
                                        {
                                            type: ComponentType.Section,
                                            components: [
                                                {
                                                    type: ComponentType.TextDisplay,
                                                    content: Utils.getPestoCoinsMessage(
                                                        negative,
                                                    ).replace(/\{coins}/, coins.toString()),
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
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});

async function checkForExpired(...values: number[]) {
    const array = [];
    const date = Date.now();

    for await (let value of values) {
        array.push(date >= value);
    }

    return array;
}
