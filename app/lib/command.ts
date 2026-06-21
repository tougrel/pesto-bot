import type { PestoClient } from "@types";
import type { ChatInputCommandInteraction } from "discord.js";

export interface PestoCommand {
    name: string;
    run: (client: PestoClient, interaction: ChatInputCommandInteraction) => void | Promise<void>;
}

export function defineCommand(command: PestoCommand): PestoCommand {
    return command;
}
