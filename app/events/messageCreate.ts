import { defineEvent } from "@lib";
import { Events } from "discord.js";

export default defineEvent({
    name: Events.MessageCreate,
    run: async (client, message) => {
        // Why are bots here madge
        if (message.author.bot) {
            return;
        }

        if (message.content.startsWith("!blamemerry")) {
            await message.channel.send({
                content: "<:blameMerry1:1404817851919110264><:blameMerry2:1404817860773150762>",
            });
        }

        const isDaDeveloper = message.author.id === process.env.DEVELOPER_DISCORD_ID;
        // if (checkBanker(message.author.id.toString()) || isDaDeveloper) {
        //     if (
        //         message.content.startsWith(
        //             `<@${client.user.id}> set bank fee to`,
        //         )
        //     ) {
        //         const args = message.content.split(" ");
        //         if (isNaN(parseInt(args[5].replace("%", "")))) {
        //             return;
        //         }

        //         const number = parseInt(args[5].replace(/%/, ""));
        //         await message.reply({
        //             content: `Setting bank fee to **${number}**%`,
        //         });
        //     }
        // }

        // if (checkCluelessKing(message.author.id.toString())) {
        //     if (/not(.+)?clueless(.+)?(king)??/gi.test(message.content)) {
        //         const random = Math.random();
        //         console.debug("[cluelessKing] not clueless check", random);
        //         if (random < 0.25) {
        //             const moreRandomStuffCauseWhyNot = Math.random();
        //             console.debug(
        //                 "[cluelessKing] not clueless check 2",
        //                 moreRandomStuffCauseWhyNot,
        //             );
        //             if (moreRandomStuffCauseWhyNot < 0.5) {
        //                 await message.reply({
        //                     content:
        //                         "<:cluelessKing:1332416626251010153> <:pestobow:1332418781133410446>",
        //                 });
        //             } else {
        //                 await message.react("1332416626251010153");
        //                 await message.react("1332418781133410446");
        //             }
        //         }
        //     }
        // }

        // if (checkCopiumKing(message.author.id.toString())) {
        //     if (/not(.+)?copium(.+)?(king)??/gi.test(message.content)) {
        //         const random = Math.random();
        //         console.debug("[copiumKing] not copium check", random);
        //         if (random < 0.25) {
        //             const moreRandomStuffCauseWhyNot = Math.random();
        //             console.debug(
        //                 "[copiumKing] not copium check 2",
        //                 moreRandomStuffCauseWhyNot,
        //             );
        //             if (moreRandomStuffCauseWhyNot < 0.5) {
        //                 await message.reply({
        //                     content:
        //                         "<:copiumKing:1332416650900799619> <:pestobow:1332418781133410446>",
        //                 });
        //             } else {
        //                 await message.react("1332416650900799619");
        //                 await message.react("1332418781133410446");
        //             }
        //         }
        //     } else if (/(rigged|scam)/gi.test(message.content)) {
        //         const random = Math.random();
        //         console.debug("[copiumKing] rigged", random);
        //         if (random < 0.25) {
        //             await message.reply({
        //                 content: "<:lookDownPestie:1512044054471245854>",
        //                 files: [
        //                     {
        //                         attachment:
        //                             "https://cdn.pestoverse.world/yunya/warlord.png",
        //                         name: "warlord-rigged.png",
        //                     },
        //                 ],
        //             });
        //         }
        //     }
        // }
    },
});
