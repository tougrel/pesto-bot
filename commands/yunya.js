import {readFile, writeFile} from "node:fs/promises";

export const name = "yunya";
export async function run(client, interaction) {
	if (interaction.options.getSubcommand() === "toggle") {
		const toggle = interaction.options.getBoolean("value", true);
		const config = JSON.parse((await readFile("configs/config.json")).toString());
		
		config.enabled = toggle;
		await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
		await interaction.reply({
			ephemeral: true,
			content: `✅ Successfully ${config.enabled ? "enabled" : "disabled"} the system!`,
		});
	} else if (interaction.options.getSubcommand() === "mode") {
		const mode = interaction.options.getString("value", true);
		const config = JSON.parse((await readFile("configs/config.json")).toString());
		
		config.mode = mode;
		await writeFile("configs/config.json", JSON.stringify(config, null, 4), "utf-8");
		await interaction.reply({
			ephemeral: true,
			content: `✅ Successfully changed the lockdown mode to ${mode}!`
		});
	}
}
