import { defineCommand } from "@lib";
import { ChatInputCommandInteraction, Component, ComponentType, ContextMenuCommandAssertions, Message, MessageFlags, SeparatorSpacingSize, User, type Interaction } from "discord.js";
import type { RowDataPacket, QueryError } from "mysql2";
import * as Utils from "@utils";
import type { PestoClient } from "@types";
import { GambaErrors, emotes } from "@utils";
import type { Pool } from "mysql2/promise";

export default defineCommand({
    name: "gamba",
    async run (client, interaction) {
        const isToug = "256048990750113793"
        const isYolo = "457062141078536194"

        //break away if user is not toug or yolo
        if (interaction.user.id !== isToug && interaction.user.id !== isYolo) {
            console.log(`${interaction.user.username} tried to run a /gamba command >:(`)
            await interaction.reply({
                content: "Your permission game is lacking :)",
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        const commandgroup = interaction.options.getSubcommandGroup(false)
        const subcommand = interaction.options.getSubcommand(true);

        //======= Command Group Game =======
        if (commandgroup == "game") {

            //List Games command
            if(subcommand === "list") {
                listGames(client, interaction)
            }

            //Add Game command
            if(subcommand === "add") {
                addGame(client, interaction)
            }

            //Remove Game command
            if(subcommand === "remove") {
                removeGame(client, interaction)
            }

        }


        //======= Command Group Pestie =======
        if (commandgroup == "pestie") {

            //List Pesties command
            if(subcommand === "list") {
                listPesties(client, interaction)
            }

            //Add Pesties command
            if(subcommand === "add") {
                addPestie(client, interaction)
            }

            //Remove Pesties command
            if(subcommand === "remove") {
                removePestie(client, interaction)
            }

        }


        if(subcommand === "gambatime") {
            const gameName: string = interaction.options.getString("gamename", true)
            const suppress: boolean = interaction.options.getBoolean("suppress", true)

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })
            
            const db = client.database;

            let queried_gameName = gameName

            try {

                const game = getGameIdFromDB(gameName, db)

                const queried_gameID = (await game).gameID
                queried_gameName = (await game).fullGameName

                const [pestieListRowData] = await db.query<RowDataPacket[]>(
                    db.format(
                        "SELECT user_id FROM GambaToPesto WHERE game_id = ?", [
                        queried_gameID
                    ])
                )

                await interaction.editReply({content: getFunnySuccessResponse()})

                if(suppress) {
                    
                    await interaction.followUp({
                        flags: MessageFlags.SuppressNotifications | MessageFlags.IsComponentsV2,
                        components: gambaTimeComponentBody(queried_gameName, pestieListRowData, interaction)
                    })
                } else if (!suppress) {
                    await interaction.followUp({
                        flags: MessageFlags.IsComponentsV2,
                        components: gambaTimeComponentBody(queried_gameName, pestieListRowData, interaction)
                    })
                }
                
            } catch (err) {
                console.error(err)

                await interaction.editReply({content: getFunnyFailureResponse()})

                if(err === GambaErrors.GAME_NOT_FOUND) {
                    await interaction.followUp({
                        flags: MessageFlags.Ephemeral,
                        content: `\`${queried_gameName}\` does not exist.`
                    })
                } else {
                    await interaction.followUp({
                        flags: MessageFlags.Ephemeral,
                        content: "Something went wrong!"
                    })
                }

                
            }
        }

        if(subcommand === "registerpulls") {
            const gameName: string = interaction.options.getString("gamename", true)
            const otherpestie: User = interaction.options.getUser("pestie", false)

            const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
            const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            })

            const db = client.database;

            let queried_gameName: string = gameName

            try {

                const game = getGameIdFromDB(gameName, db)

                const queried_gameID = (await game).gameID
                queried_gameName = (await game).fullGameName

                await db.query<RowDataPacket[]>(
                    db.format(
                        "INSERT INTO GambaHistory(user_id, game_id, did_pulls_on, poor_until, debuff_used) VALUES (?,?,?,?,?);", [
                        pestiD,
                        queried_gameID,
                        Date.now(),
                        Utils.getUTCExpireTimestamp(2), //add an extra day so that gamba luck will be down for N+1 days
                        false
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


//======= Command functions =======
async function listGames(client: PestoClient, interaction: ChatInputCommandInteraction) {
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

async function addGame(client: PestoClient, interaction: ChatInputCommandInteraction) {
    const gameName = interaction.options.getString("gamename", true)

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    })

    const db = client.database;

    try {
        await db.query<RowDataPacket[]>(
            db.format(
                "INSERT INTO GambaGames(game_name) VALUES(?)",
                gameName
            )
        )

        await interaction.editReply({
            content: `Added game \`${gameName}\` to the list!`
        })

    } catch (err) {
        console.error(err);

        if (typeof err == "object" && "code" in err ) {
            if (err.code == "ER_DUP_ENTRY") {
                await interaction.editReply({
                    content: `\`${gameName}\` already exists!`
                })
            }
        } else {
            await interaction.editReply({
                content: "Something went wrong!"
            })
        }
    }
}

async function removeGame(client: PestoClient, interaction: ChatInputCommandInteraction) {
    const gameName: string = interaction.options.getString("gamename", true)

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    })

    const db = client.database;

    let queried_gameName = gameName

    try {
        
        const game = getGameIdFromDB(gameName, db)

        const queried_gameID = (await game).gameID
        queried_gameName = (await game).fullGameName
        

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

        if(err === GambaErrors.GAME_NOT_FOUND) {
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

async function listPesties(client: PestoClient, interaction: ChatInputCommandInteraction) {
    const gameName: string = interaction.options.getString("gamename", true)

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    })

    const db = client.database;

    let queried_gameName = gameName

    try {

        const game = getGameIdFromDB(gameName, db)

        const queried_gameID = (await game).gameID
        queried_gameName = (await game).fullGameName

        const [pestieListRowData] = await db.query<RowDataPacket[]>(
            db.format(
                "SELECT user_id FROM GambaToPesto WHERE game_id = ?", [
                queried_gameID
            ])
        )

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: pestieListComponentBody(queried_gameName, pestieListRowData)
        })
    } catch (err) {
        console.error(err)

        if(err === GambaErrors.GAME_NOT_FOUND) {
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

async function addPestie(client: PestoClient, interaction: ChatInputCommandInteraction) {
    const gameName: string = interaction.options.getString("gamename", true)
    const otherpestie: User = interaction.options.getUser("pestie", false)

    const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
    const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    })

    const db = client.database;

    let queried_gameName = gameName

    try {

        const game = getGameIdFromDB(gameName, db)

        const queried_gameID = (await game).gameID
        queried_gameName = (await game).fullGameName

        await db.query<RowDataPacket[]>(
            db.format(
                "INSERT INTO GambaToPesto(game_id, user_id) VALUES (?,?);", [
                queried_gameID,
                pestiD
            ])
        )

        interaction.editReply({
            content: `Successfully added pestie \`${pestieName}\` to \`${queried_gameName}\`!`
        })
    } catch (err) {
        console.error(err)

        if (typeof err == "object" && "code" in err ) {
            if (err.code == "ER_DUP_ENTRY") {
                await interaction.editReply({
                    content: `\`${pestieName}\` is already added to \`${queried_gameName}\`!`
                })
            }
        } else if(err === GambaErrors.GAME_NOT_FOUND) {
            await interaction.editReply({
                content: `\`${queried_gameName}\` does not exist.`
            })
        } else {
            await interaction.editReply({
                content: "Something went wrong!"
            })
        }
    }

}

async function removePestie(client: PestoClient, interaction: ChatInputCommandInteraction) {
    const gameName: string = interaction.options.getString("gamename", true)
    const otherpestie: User = interaction.options.getUser("pestie", false)

    const pestiD: string = otherpestie ? otherpestie.id : interaction.user.id
    const pestieName: string = otherpestie ? otherpestie.displayName : interaction.user.displayName

    await interaction.deferReply({
        flags: MessageFlags.Ephemeral
    })

    const db = client.database;

    let queried_gameName = gameName

    try {

        const game = getGameIdFromDB(gameName, db)

        const queried_gameID = (await game).gameID
        queried_gameName = (await game).fullGameName

        await db.query<RowDataPacket[]>(
            db.format(
                "DELETE FROM GambaToPesto WHERE game_id = ? AND user_id = ? LIMIT 1", [
                queried_gameID,
                pestiD
            ])
        )

        interaction.editReply({
            content: `Successfully removed pestie \`${pestieName}\` from \`${queried_gameName}\`!`
        })
    } catch (err) {
        console.error(err)
        
        if(err === GambaErrors.GAME_NOT_FOUND) {
            await interaction.editReply({
                content: `\`${queried_gameName}\` does not exist.`
            })
        } else {
            await interaction.editReply({
                content: "Something went wrong!"
            })
        }
    }
}


//Helpers
async function getGameIdFromDB(gameName: string, db: Pool) {
    const [result] = await db.query<RowDataPacket[]>(
            db.format(
                "SELECT game_id, game_name FROM GambaGames WHERE game_name LIKE ? LIMIT 1",
                ['%'+gameName+'%']
            )
        )

    if (!(result.length > 0)) {
        throw GambaErrors.GAME_NOT_FOUND
    }

    const gameID = result[0].game_id
    const fullGameName = result[0].game_name

    return {gameID, fullGameName}
}

function getFunnySuccessResponse(): string {
    const responses = [
        `Pinged @everyone like you wanted! ✅`,
        `You woke everyone up..`,
        `Are you sure you turned on supression?`,
        `Now the whole world knows we are here!`,
        `Are you sure you didnt accidentally ping the cat? ${emotes.NYA}`,
        `Oh boi, here it comes... ${emotes.LETDOGCOOK}`,
        `Ready to lose every single pull?`,
        `Poor wallet...`,
        `AGAIN??!`,
        `Did Syri give you permission? ${emotes.PESTOPOLICE}`,
        `Is it worth it?`,
        `Are you sure you didnt forget someone?`
    ]

    const random = Math.floor(Math.random() * responses.length)

    return responses[random]
}

function getFunnyFailureResponse(): string {
    const responses = [
        `Failed to ping @everyone like you wanted ${emotes.YUNIILOST}`,
        `Failed to wake everyone up ${emotes.PESTOSCAM}`,
        `Task failed succesfully ${emotes.YUNIIWUT}`,
        `Oh boi, here it comes... nvm ${emotes.YUNIIX}`,
        `I saved your wallet, thank me later ${emotes.YUNIIWADDLE}`,
        `I let the other pesties sleep a little longer, no need to thank me ${emotes.KISSAPESTIE}`,
        `Syri didnt give you permission ${emotes.STARE} he has been notified of your transgressions ${emotes.RIPBOZO}`,
        `It isnt worth it ${emotes.YUNIILOST}`,
        `I forgot someone, wait a sec.. ${emotes.LETDOGCOOK}`
    ]

    const random = Math.floor(Math.random() * responses.length)

    return responses[random]
}


//======= Component bodies =======
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
                    content: `### Gamba time! ${emotes.GAMBA}`
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                },
                {
                    type: ComponentType.TextDisplay,
                    content: `<@${interaction.user.id}> is doing gamba on ${gameName}! ${emotes.GAMBA}`
                },
                {
                    type:ComponentType.TextDisplay,
                    content: data.length === 0 ? "-# No pesties for this game!" : `-# Notified Pesties: ${data.map((d) => `<@${d.user_id}>`).join(", ")}`
                }
            ]
        }
    ]
}
