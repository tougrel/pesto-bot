import { defineCommand } from "@lib";
import { emotes } from "@utils";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "date-converter",
    async run(client, interaction) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        // Date input should be YYYY-MM-DD
        const dateInput = interaction.options.getString("date", true)
        const zeroes = interaction.options.getBoolean("use-zeroes", false) || true
        const lowToHigh = interaction.options.getBoolean("number-sorting", false) || false

        const [year, month, day] = dateInput.split("-");

        if (dateInput.length < 10 || year.length < 4 || month.length < 2 || day.length < 2) {
            interaction.editReply({
                content: `Invalid date input! Only YYYY-MM-DD is allowed per ISO 8601 ${emotes.STAIRING}`
            })

            return;
        }

        //format to YMYDYDYM
        let dateOutput = `${year[0]}${month[0]}${year[1]}${day[0]}${year[2]}${day[1]}${year[3]}${month[1]}`

        if (!zeroes) {
            dateOutput = dateOutput.replaceAll("0","")
        }

        if (lowToHigh) {
            dateOutput = Array.from(dateOutput).sort().join('')
        }

        interaction.editReply({
                content: `I don't know why you would want this, but here you go: ${dateOutput}`
            })
        
    }
})