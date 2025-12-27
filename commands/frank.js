import { MessageFlags } from "discord.js"

export const name = "frank"

export async function run(client, interaction) {
    interaction.reply({
        content: "https://cdn.pestoverse.world/yunya/frank_rejected.png"
    })
}
