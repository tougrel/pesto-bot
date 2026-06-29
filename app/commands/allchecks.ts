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

            const is_april_fools = Utils.isAprilFools();
            const expire_timestamp = Utils.getUTCExpireTimestamp();
            const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

            const { pp_power, pp_expired, clueless_power, clueless_expired, copium_power, copium_expired, horni_power, horni_expired, feet_power, mango_power } = await checkForData(interaction.user.id, rows.length > 0 ? rows[0] : undefined);
            const pp_power_to_show = is_april_fools ? 0 : pp_power;
            const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
            const copium_power_to_show = is_april_fools ? 0 : copium_power;
            const horni_power_to_show = is_april_fools ? 0 : horni_power;
            const feet_power_to_show = is_april_fools ? -100 : feet_power;
            const mango_power_to_show = is_april_fools ? 0 : mango_power;

            await interaction.editReply({
                flags: MessageFlags.IsComponentsV2,
                components: getComponentBody(interaction.user.id, {
                    pp_power: pp_power_to_show,
                    pp_expired: pp_expired,
                    clueless_power: clueless_power_to_show,
                    clueless_expired: clueless_expired,
                    copium_power: copium_power_to_show,
                    copium_expired: copium_expired,
                    horni_power: horni_power_to_show,
                    horni_expired: horni_expired,
                    feet_power: feet_power_to_show,
                    mango_power: mango_power_to_show,
                    expireTimestampInSeconds: expire_timestamp_in_seconds
                })
            });

            if (is_april_fools) {
                setTimeout(async () => {
                    await interaction.editReply({
                        flags: MessageFlags.IsComponentsV2,
                        components: getComponentBody(interaction.user.id, {
                            pp_power: pp_power_to_show,
                            pp_expired: pp_expired,
                            clueless_power: clueless_power_to_show,
                            clueless_expired: clueless_expired,
                            copium_power: copium_power_to_show,
                            copium_expired: copium_expired,
                            horni_power: horni_power_to_show,
                            horni_expired: horni_expired,
                            feet_power: feet_power_to_show,
                            mango_power: mango_power_to_show,
                            expireTimestampInSeconds: expire_timestamp_in_seconds
                        })
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
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: "Something went wrong!",
            });
        }
    },
});

async function checkForData(userId: string, data: RowDataPacket | undefined) {
    let pp_power = data?.pp_power || Utils.generatePPCheckPower(userId);
    let clueless_power = data?.clueless_power || Utils.generateCluelessPower(userId);
    let copium_power = data?.copium_power || Utils.generateCopiumPower(userId);
    let horni_power = data?.horni_power || Utils.generateHorniPower(userId);

    // Maybe change this in the future to be included in the database. For now, it changes every time you run the command
    let feet_power = Utils.generateFeetPower(userId);
    let mango_power = Utils.generateMangoPower(userId);

    let pp_expired = true;
    let clueless_expired = true;
    let copium_expired = true;
    let horni_expired = true;

    if (data) {
        const [db_pp_expired, db_clueless_expired, db_copium_expired, db_horni_expired] =
            await checkForExpired(
                data.pp_expires,
                data.clueless_expires,
                data.copium_expires,
                data.horni_expires,
            );

        if (db_pp_expired) {
            pp_power = Utils.generatePPCheckPower(userId);
        } else {
            pp_expired = false;
        }

        if (db_clueless_expired) {
            clueless_power = Utils.generateCluelessPower(userId);
        } else {
            clueless_expired = false;
        }

        if (db_copium_expired) {
            copium_power = Utils.generateCopiumPower(userId);
        } else {
            copium_expired = false;
        }

        if (db_horni_expired) {
            horni_power = Utils.generateHorniPower(userId);
        } else {
            horni_expired = false;
        }
    }

    return { pp_power, pp_expired, clueless_power, clueless_expired, copium_power, copium_expired, horni_power, horni_expired, feet_power, mango_power };
}

function getComponentBody(userId: string, data: ComponentBodyData) {
    return [
        {
            type: ComponentType.Container,
            accent_color: Utils.isChristmasSeason() ? 0xff0000 : undefined,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content:
                        `- Pesto Power ${data.pp_expired ? "is" : "was"} **${data.pp_power}%**, ${Utils.getPPCheckMessage(data.pp_power)}` +
                        `\n- Cluelessness ${data.clueless_expired ? "is" : "was"} **${data.clueless_power}%** today! ${Utils.getCluelessKingMessage(userId)}\n- ` +
                        Utils.COPIUM_MESSAGES.TEMPLATE
                            .replace("$expired", data.copium_expired ? "is" : "was")
                            .replace("$power", data.copium_power.toString())
                            .replace("$extra", data.copium_power > 50 ? Utils.COPIUM_MESSAGES.EXTRA : "")
                            .replace("$king", Utils.getCopiumKingMessage(userId)) +
                        `\n- Horni level ${data.horni_expired ? "is" : "was"} **${data.horni_power}%**, ${Utils.getHorniMessage(data.horni_power)}` +
                        `\n- Feet power is **${data.feet_power}%**` +
                        `\n- Mango power is **${data.mango_power}%** <a:pestoMango:1452244340150632488>`,
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                },
                {
                    type: ComponentType.TextDisplay,
                    content: Utils.isChristmasSeason()
                        ? `### <a:pestoPadoru:1452242346518384681> Christmas boosts are on! <a:pestoPadoru:1452242346518384681>\n-# Checks reset <t:${data.expireTimestampInSeconds}:R> (<t:${data.expireTimestampInSeconds}>)`
                        : `\n-# Checks reset <t:${data.expireTimestampInSeconds}:R> (<t:${data.expireTimestampInSeconds}>)`,
                },
            ],
        },
    ]
}

async function checkForExpired(...values: number[]) {
    const array = [];
    const date = Date.now();

    for await (let value of values) {
        array.push(date >= value);
    }

    return array;
}

interface ComponentBodyData {
    pp_power: number;
    pp_expired: boolean;
    clueless_power: number;
    clueless_expired: boolean;
    copium_power: number;
    copium_expired: boolean;
    horni_power: number;
    horni_expired: boolean;
    feet_power: number;
    mango_power: number;
    expireTimestampInSeconds: number;
}
