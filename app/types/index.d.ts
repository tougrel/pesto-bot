import type { Client, ChatInputCommandInteraction, Events, ClientEvents } from "discord.js";
import type { Pool } from "mysql2/promise";

export interface PestoClient extends Client {
    database: Pool;
    commands: Collection<string, PestoCommand>;
}

export interface CheckValue {
    value_id: number;
    type_id: number;
    user_id: string;
    check_value: number;
    created_at: string;
    expires_at: string;
}
