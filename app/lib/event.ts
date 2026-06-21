import type { PestoClient } from "@types";
import type { ClientEvents } from "discord.js";

export interface PestoEvent<E extends keyof ClientEvents = keyof ClientEvents> {
    name: E;
    once?: boolean;
    run: (client: PestoClient, ...args: ClientEvents[E]) => void | Promise<void>;
}

export function defineEvent<E extends keyof ClientEvents>(event: PestoEvent<E>): PestoEvent<E> {
    return event;
}
