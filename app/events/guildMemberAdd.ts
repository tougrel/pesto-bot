import { defineEvent } from "@lib";
import { Events, GuildMemberFlags } from "discord.js";
import { readFile } from "node:fs/promises";

export default defineEvent({
    name: Events.GuildMemberAdd,
    run: async (client, member) => {
        // Get the config
        const config = JSON.parse(
            (await readFile("configs/config.json")).toString(),
        );

        const isBot = member.user.bot;
        const isKickable = member.kickable;
        const hasBypass = member.flags.has(
            GuildMemberFlags.BypassesVerification,
        );

        // If the system is not enabled, the member has the bypass verification flag and the member is not kickable then stop here
        if (!config.enabled || isBot || hasBypass || !isKickable) {
            return;
        }

        // If the mode in the config is set to kick then kick the user
        if (config.mode === "kick") await member.kick("Yunya lockdown system");
        // else just drop the ban hammer on him :D
        else
            await member.ban({
                reason: "Yunya lockdown system",
            });
    },
});
