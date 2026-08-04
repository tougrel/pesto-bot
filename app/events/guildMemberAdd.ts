import { defineEvent } from "@lib";
import { ComponentType, Events, type GuildBasedChannel, type GuildMember, GuildMemberFlags, MessageFlags } from "discord.js";

export default defineEvent({
    name: Events.GuildMemberAdd,
    run: async (client, member) => {
        const isBot = member.user.bot;
        const isKickable = member.kickable;
        const hasBypass = member.flags.has(GuildMemberFlags.BypassesVerification);

        // If the system is not enabled, the guild doesn't match the config, the member has
        // the bypass verification flag or the member is not kickable then stop here
        const config = client.config.config;
        if (!config.enabled || config.guildId !== member.guild.id || isBot || hasBypass || !isKickable) {
            return;
        }

        const logs = await member.guild.channels.fetch(config.logsChannel);
        if (!logs) {
            console.error("Logs channel not found!");
            return;
        }

        // If the mode in the config is set to kick, then kick the user
        // else just drop the ban hammer on him :D
        try {
            const reason = "Yunya lockdown system";
            if (config.mode === "kick") {
                await member.kick(reason)
            } else {
                await member.ban({ reason });
            }

            await sendLog(logs, member);
        } catch (err) {
            console.error(err);
            await sendLog(logs, member, false);
        }
    },
});

async function sendLog(logChannel: GuildBasedChannel, member: GuildMember, success: boolean = true) {
    if (!logChannel.isSendable()) {
        console.error("Log channel is not sendable!");
        return;
    }

    try {
        await logChannel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: success
                                ? `User @${member.user.username} (${member}) with ID ${member.id} was successfully denied entry`
                                : `Something went wrong while trying to deny entry to user @${member.user.username} (${member}) with ID ${member.id}`,
                        },
                    ],
                },
            ],
        });
    } catch (err) {
        console.error(err);
    }
}
