import type { PestoCommand } from "@lib";
import { defineEvent } from "@lib";
import { Events } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export default defineEvent({
    name: Events.ClientReady,
    once: true,
    run: async (client) => {
        console.log("Nya");

        const path = join(import.meta.dirname, "../commands");
        console.debug("Loading commands from", path);
        const files = readdirSync(path);
        for (const file of files) {
            const { default: command }: { default: PestoCommand } = await import(
                `../commands/${file}`
            );
            console.debug("Loading command", command.name);
            client.commands.set(command.name, command);
        }
    },
});
