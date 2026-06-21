import type { Client, ChatInputCommandInteraction, Events, ClientEvents } from "discord.js";
import type { Pool } from "mysql2/promise";

export interface PestoClient extends Client {
    database: Pool;
    commands: Collection<string, PestoCommand>;
}
