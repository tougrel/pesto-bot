import "dotenv/config";

import type { PestoClient } from "@types";
import type { PestoEvent } from "@lib";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { GatewayIntentBits, ActivityType } from "discord-api-types/v10";
import { Client, Partials, Collection } from "discord.js";
import { createPool } from "mysql2/promise";
import { createConsola } from "consola";

createConsola({
    level: import.meta.env.DEVELOPMENT === "true" ? 999 : 4,
}).wrapAll();

const pool = createPool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DATA,
});

const client = new Client({
    partials: [
        Partials.User,
        Partials.GuildMember,
        Partials.Channel,
        Partials.Message,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    presence: {
        activities: [
            {
                name: "Biting Abba, Watching Vihi die in Celeste and Listening to Frank's talk about feet",
                type: ActivityType.Custom,
            },
        ],
    },
}) as PestoClient;

// We add the database and commands to the client so we can use it inside events or commands if needed
client.database = pool;
client.commands = new Collection();

const eventsPath = join(import.meta.dirname, "events");
const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".ts"),
);

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const { default: event }: { default: PestoEvent } = await import(filePath);
    console.debug("Loading event " + event.name);

    if (event.once) {
        client.once(event.name, (...args) => event.run(client, ...args));
    } else {
        client.on(event.name, (...args) => event.run(client, ...args));
    }
}

client.login(process.env.BOT_TOKEN).catch(console.error);
