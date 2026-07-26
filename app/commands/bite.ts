import { defineCommand } from "@lib";
import { MessageFlags } from "discord.js";

export default defineCommand({
    name: "bite",
    async run(client, interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser("pestie") || interaction.user;
        const member = await interaction.guild.members.fetch({
            user,
            cache: true,
        });

        const pinkDog = member.id === "212975234427518979";
        const myself = member.id === client.user.id;
        if (pinkDog || myself) {
            await interaction.editReply({
                content: `<:yuniiX:1283529446946504818> You dare bite me, ${member.nickname || member.user.globalName}? <:PestoFood:1075882159115612252>`,
            });

            return;
        }

        if (interaction.user.id === "236642620506374145") {
            await interaction.editReply({
                content: `${member.nickname || member.user.globalName} tried to attack a pestie! Bite him!`,
            });

            await interaction.followUp({
                content:
                    "<:yuniiX:1283529446946504818> Trying to bite a pestie your cluelessness? Not in my watch! <:yuniiRaid:1283531598993821707>",
                flags: MessageFlags.Ephemeral,
            });

            return;
        }

        await interaction.editReply({
            content: `${client.user} attacks ${member.nickname || member.user.globalName}! <:PestoFood:1075882159115612252>`,
        });

        await interaction.followUp({
            content:
                "Remember to waddle pestie! <a:yuniiWaddle:1283532105988571136> <a:yuniiWaddle:1283532105988571136> <a:yuniiWaddle:1283532105988571136>",
            flags: MessageFlags.Ephemeral,
        });
    },
});
