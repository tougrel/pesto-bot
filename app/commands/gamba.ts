import { defineCommand } from "@lib";
import { Component, ComponentType, ContextMenuCommandAssertions, Message, MessageFlags, SeparatorSpacingSize, User, type Interaction } from "discord.js";
import type { RowDataPacket } from "mysql2";
import * as Utils from "@utils";

export default defineCommand({
    name: "gamba",
    async run (client, interaction) {
        const isToug = "256048990750113793"
        const isYolo = "457062141078536194"

        //break away if user is not yolo or toug
        if (!isToug || !isYolo) {
            await interaction.reply({
                content: "Your permission game is lacking :)",
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        const subcommand = interaction.options.getSubcommand(true);

        //add game command
        if(subcommand === "addgame") {
            const gamename = interaction.options.getString("gamename", true)

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            try {
                await db.query<RowDataPacket[]>(
                    db.format(
                        "INSERT INTO GambaGames(game_name) VALUES(?)",
                        gamename
                    )
                )

                await interaction.editReply({
                    content: `Added game \`${gamename}\` to the list!`
                })
            } catch (err) {
                console.error(err);

                if (err.toString().toLowerCase().includes("duplicate")) {
                    await interaction.editReply({
                        content: "Game already exists!"
                    })
                } else {
                    await interaction.editReply({
                        content: "Something went wrong!"
                    })
                }
            }
            
        }

        if(subcommand === "addpestie") {
            const gamename: string = interaction.options.getString("gamename", true)
            const otherpestie: User = interaction.options.getUser("pestie", false)

            const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
            const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                await db.query<RowDataPacket[]>(
                    db.format(
                        "INSERT INTO GambaToPesto(game_id, user_id) VALUES (?,?);", [
                        queried_gameID,
                        pestiD
                    ])
                )

                interaction.editReply({
                    content: `Successfully added pestie ${pestieName} to ${queried_gameName}!`
                })
            } catch (err) {
                console.error(err)

                if (err.toString().toLowerCase().includes("duplicate")) {
                    await interaction.editReply({
                        content: `${pestieName} is already added to ${queried_gameName}!`
                    })
                } else {
                    await interaction.editReply({
                        content: "Something went wrong!"
                    })
                }
            }

        }

        if(subcommand === "removegamba") {
            const gamename: string = interaction.options.getString("gamename", true)

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                await db.query<RowDataPacket[]>(
                    db.format(
                        "DELETE FROM GambaGames WHERE game_id = ? LIMIT 1", [
                        queried_gameID
                    ])
                )

                interaction.editReply({
                    content: `Successfully removed game ${queried_gameName} from the list!`
                })
            } catch (err) {
                console.error(err)

                if (err.toString().toLowerCase().includes("duplicate")) {
                    await interaction.editReply({
                        content: `${queried_gameName} is not present in the list.`
                    })
                } else if (err.toString().toLowerCase().includes("foreign key constraint")) {
                    await interaction.editReply({
                        content: `${queried_gameName} still has members! remove them first pls`
                    })
                } else {
                    await interaction.editReply({
                        content: "Something went wrong!"
                    })
                }
            }


        }

        if(subcommand === "removepestie") {
            const gamename: string = interaction.options.getString("gamename", true)
            const otherpestie: User = interaction.options.getUser("pestie", false)

            const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
            const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                await db.query<RowDataPacket[]>(
                    db.format(
                        "DELETE FROM GambaToPesto WHERE game_id = ? AND user_id = ? LIMIT 1", [
                        queried_gameID,
                        pestiD
                    ])
                )

                interaction.editReply({
                    content: `Successfully removed pestie ${pestieName} from ${queried_gameName}!`
                })
            } catch (err) {
                console.error(err)

                if (err.toString().toLowerCase().includes("duplicate")) {
                    await interaction.editReply({
                        content: `${pestieName} is not added to ${queried_gameName}.`
                    })
                } else {
                    await interaction.editReply({
                        content: "Something went wrong!"
                    })
                }
            }


        }

        if(subcommand === "listgames") {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;
            try {
                const [rows] = await db.query<RowDataPacket[]>(
                    "SELECT game_name FROM GambaGames",
                )

                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: gameListComponentBody(rows)
                })

            } catch (err) {
                console.error(err);
                await interaction.editReply({
                    content: "Something went wrong while retrieving the list."
                })
            }

            
        }

        if(subcommand === "listpesties") {
            const gamename: string = interaction.options.getString("gamename", true)

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                if (!(gameidrow.length > 0)) {
                    throw new Error("game does not exist.");
                }

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                const [pestieListRowData] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT user_id FROM GambaToPesto WHERE game_id = ? LIMIT 1", [
                        queried_gameID
                    ])
                )

                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: pestieListComponentBody(queried_gameName, pestieListRowData)
                })
            } catch (err) {
                console.error(err)

                if (err.toString().toLowerCase().includes("game does not exist.")) {
                    await interaction.editReply({
                        content: `${queried_gameName} does not exist.`
                    })
                } else {
                    await interaction.editReply({
                        content: "Something went wrong!"
                    })
                }
            }
        }

        if(subcommand === "gambatime") {
            const gamename: string = interaction.options.getString("gamename", true)
            const suppress: boolean = interaction.options.getBoolean("suppress", true)

            console.debug(suppress)

            if(!suppress) {await interaction.deferReply()}

            const db = client.database;

            let queried_gameName = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                if (!(gameidrow.length > 0)) {
                    throw new Error("game does not exist.");
                }

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                const [pestieListRowData] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT user_id FROM GambaToPesto WHERE game_id = ?", [
                        queried_gameID
                    ])
                )

                if(suppress) {
                    await interaction.reply({
                        flags: MessageFlags.SuppressNotifications | MessageFlags.IsComponentsV2,
                        components: gambaTimeComponentBody(queried_gameName, pestieListRowData, interaction)
                    })
                } else if (!suppress) {
                    await interaction.editReply({
                        flags: MessageFlags.IsComponentsV2,
                        components: gambaTimeComponentBody(queried_gameName, pestieListRowData, interaction)
                    })
                }
                
            } catch (err) {
                console.error(err)

                if (suppress) {
                    if (err.toString().toLowerCase().includes("game does not exist.")) {
                        await interaction.reply({
                            content: `${queried_gameName} does not exist.`
                        })
                    } else {
                        await interaction.reply({
                            content: "Something went wrong!"
                        })
                    }
                } else {
                    if (err.toString().toLowerCase().includes("game does not exist.")) {
                        await interaction.editReply({
                            content: `${queried_gameName} does not exist.`
                        })
                    } else {
                        await interaction.editReply({
                            content: "Something went wrong!"
                        })
                    }
                }

                
            }
        }

        if(subcommand === "addgambawin") {
            const gamename: string = interaction.options.getString("gamename", true)
            const otherpestie: User = interaction.options.getUser("pestie", false)

            const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
            const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName: string = gamename

            try {

                const [gameidrow] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                        ['%'+gamename+'%']
                    )
                )

                queried_gameName = gameidrow[0].game_name
                const queried_gameID = gameidrow[0].game_id

                await db.query<RowDataPacket[]>(
                    db.format(
                        "INSERT INTO DidGamba(user_id, game_id, did_pulls_on, poor_until) VALUES (?,?,?,?);", [
                        pestiD,
                        queried_gameID,
                        Date.now(),
                        Utils.getUTCExpireTimestamp()
                    ])
                )

                interaction.editReply({
                    content: `Successfully added a gamba for ${pestieName} to ${queried_gameName}!`
                })
            } catch (err) {
                console.error(err)
                
                await interaction.editReply({
                    content: "Something went wrong!"
                })
            }

        }
    }
})


function gameListComponentBody(data: RowDataPacket[]) {
    return [
        {
            type: ComponentType.Container,
            accent_color: 0x00ff00,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `### List of Gamba Games`
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                },
                {
                    type:ComponentType.TextDisplay,
                    content: data.length === 0 ? "No games available" : data.map((d) => `- ${d.game_name}`).join("\n")
                }
            ]
        }
    ]
}

function pestieListComponentBody(gameName: string, data: RowDataPacket[]) {
    return [
        {
            type: ComponentType.Container,
            accent_color: 0x00ff00,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `### List of Pesties in ${gameName}`
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                },
                {
                    type:ComponentType.TextDisplay,
                    content: data.length === 0 ? "No pesties for this game!" : data.map((d) => `- <@${d.user_id}>`).join("\n")
                }
            ]
        }
    ]
}

function gambaTimeComponentBody(gameName: string, data: RowDataPacket[], interaction: Interaction) {
    return [
        {
            type: ComponentType.Container,
            accent_color: 0x00ff00,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `### Gamba time! <pestogambaemotehere>`
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                },
                {
                    type: ComponentType.TextDisplay,
                    content: `<@${interaction.user.id}> is doing gamba on ${gameName}! <gambapestieemote>`
                },
                {
                    type:ComponentType.TextDisplay,
                    content: data.length === 0 ? "-# No pesties for this game!" : `-# Notified Pesties: ${data.map((d) => `<@${d.user_id}>`).join(", ")}`
                }
            ]
        }
    ]
}