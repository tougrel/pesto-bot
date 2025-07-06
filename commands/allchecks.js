import { getPPCheckMessage, getHorniMessage } from "../utils/messages.js";
import { getUTCExpireTimestamp, isAprilFools, isNewYears, isWeekend } from "../utils/date.js";
import { MessageFlags } from "discord.js";
import { ComponentType, SeparatorSpacingSize } from "discord-api-types/v10";
import { checkCluelessKing, checkCopiumKing, checkFeetKing } from "../utils/checks.js";

export const name = "allchecks";

export async function run(client, interaction) {
	const db = client.database;
	
	await interaction.deferReply();
	try {
		const [rows] = await db.query(db.format("SELECT pp_power, pp_expires, clueless_power, clueless_expires, copium_power, copium_expires, horni_power, horni_expires FROM AllChecks WHERE user_id = ?", [interaction.user.id]));
		
		if (rows.length > 0) {
			const data = rows[0];
			
			let pp_power = data.pp_power || 0;
			let clueless_power = data.clueless_power || 0;
			let copium_power = data.copium_power || 0;
			let horni_power = data.horni_power || 0;
			
			// Maybe change this in the future to be included in the database. For now, it's exclusive to one user
			let feet_power = generateFeetPower(interaction.user.id);
			
			const [pp_expired, clueless_expired, copium_expired, horni_expired] = await checkForExpired(data.pp_expires, data.clueless_expires, data.copium_expires, data.horni_expires);
			if (pp_expired) pp_power = generatePPCheckPower();
			if (clueless_expired) clueless_power = generateCluelessPower(interaction.user.id);
			if (copium_expired) copium_power = generateCopiumPower(interaction.user.id);
			if (horni_expired) horni_power = generateHorniPower();
			
			const is_april_fools = isAprilFools();
			const expire_timestamp = getUTCExpireTimestamp();
			const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
			
			const pp_power_to_show = is_april_fools ? 0 : pp_power;
			const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
			const copium_power_to_show = is_april_fools ? 0 : copium_power;
			const horni_power_to_show = is_april_fools ? 0 : horni_power;
			const feet_power_to_show = is_april_fools ? -100 : feet_power;
			await interaction.editReply({
				flags: MessageFlags.IsComponentsV2,
				components: [
					{
						type: ComponentType.Container,
						components: [
							{
								type: ComponentType.TextDisplay,
								content: `- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power_to_show}%**, ${getPPCheckMessage(pp_power_to_show)}`
									+ `\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power_to_show}%** today! ${cluelessKingCheck(interaction.user.id)}`
									+ `\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power_to_show}%** today! ${copiumKingCheck(interaction.user.id)}`
									+ `\n- Horni level ${horni_expired ? "is" : "was"} **${horni_power_to_show}%**, ${getHorniMessage(horni_power_to_show)}`
									+ `\n- Feet power is **${feet_power_to_show}%**`,
							},
							{
								type: ComponentType.Separator,
								spacing: SeparatorSpacingSize.Small,
								divider: true,
							},
							{
								type: ComponentType.TextDisplay,
								content: `-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
							},
						],
					},
				],
			});
			
			if (is_april_fools) {
				setTimeout(async () => {
					await interaction.editReply({
						flags: MessageFlags.IsComponentsV2,
						components: [
							{
								type: ComponentType.Container,
								components: [
									{
										type: ComponentType.TextDisplay,
										content: `- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power}%**, ${getPPCheckMessage(pp_power)}`
											+ `\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power}%** today! ${cluelessKingCheck(interaction.user.id)}`
											+ `\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power}%** today! ${copiumKingCheck(interaction.user.id)}`
											+ `\n- Horni level ${horni_expired ? "is" : "was"} **${horni_power}%**, ${getHorniMessage(horni_power)}`
											+ `\n- Feet power is **${feet_power_to_show}%**`,
									},
									{
										type: ComponentType.Separator,
										spacing: SeparatorSpacingSize.Small,
										divider: true,
									},
									{
										type: ComponentType.TextDisplay,
										content: `-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
									},
								],
							},
						],
					});
				}, 60 * 1000);
			}
			
			if (pp_expired) await db.query(db.format("INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)", [interaction.user.id, pp_power, Date.now(), expire_timestamp]));
			if (clueless_expired) await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, clueless_power, expire_timestamp]));
			if (copium_expired) await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, copium_power, expire_timestamp]));
			if (horni_expired) await db.query(db.format("INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, horni_power, expire_timestamp]));
		} else {
			let pp_power = generatePPCheckPower();
			let clueless_power = generateCluelessPower(interaction.user.id);
			let copium_power = generateCopiumPower(interaction.user.id);
			let horni_power = generateHorniPower();
			// Maybe change this in the future to be included in the database. For now, it's exclusive to one user
			let feet_power = generateFeetPower(interaction.user.id);
			
			const is_april_fools = isAprilFools();
			const expire_timestamp = getUTCExpireTimestamp();
			const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
			
			const pp_power_to_show = is_april_fools ? 0 : pp_power;
			const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
			const copium_power_to_show = is_april_fools ? 0 : copium_power;
			const horni_power_to_show = is_april_fools ? 0 : horni_power;
			const feet_power_to_show = is_april_fools ? -100 : feet_power;
			
			await interaction.editReply({
				flags: MessageFlags.IsComponentsV2,
				components: [
					{
						type: ComponentType.Container,
						components: [
							{
								type: ComponentType.TextDisplay,
								content: `- Pesto Power is **${pp_power_to_show}%**, ${getPPCheckMessage(pp_power_to_show)}`
									+ `\n- Cluelessness is **${clueless_power_to_show}%** today! ${cluelessKingCheck(interaction.user.id)}`
									+ `\n- Copium level is **${copium_power_to_show}%** today! ${copiumKingCheck(interaction.user.id)}`
									+ `\n- Horni level is **${horni_power_to_show}%**, ${getHorniMessage(horni_power_to_show)}`
									+ `\n- Feet power is **${feet_power_to_show}%**`,
							},
							{
								type: ComponentType.Separator,
								spacing: SeparatorSpacingSize.Small,
								divider: true,
							},
							{
								type: ComponentType.TextDisplay,
								content: `-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
							},
						],
					},
				],
			});
			
			if (is_april_fools) {
				setTimeout(async () => {
					await interaction.editReply({
						flags: MessageFlags.IsComponentsV2,
						components: [
							{
								type: ComponentType.Container,
								components: [
									{
										type: ComponentType.TextDisplay,
										content: `- Pesto Power is **${pp_power}%**, ${getPPCheckMessage(pp_power_to_show)}`
											+ `\n- Cluelessness is **${clueless_power}%** today! ${cluelessKingCheck(interaction.user.id)}`
											+ `\n- Copium level is **${copium_power}%** today! ${copiumKingCheck(interaction.user.id)}`
											+ `\n- Horni level is **${horni_power}%**, ${getHorniMessage(horni_power_to_show)}`
											+ `\n- Feet power is **${feet_power}%**`,
									},
									{
										type: ComponentType.Separator,
										spacing: SeparatorSpacingSize.Small,
										divider: true,
									},
									{
										type: ComponentType.TextDisplay,
										content: `-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
									},
								],
							},
						],
					});
				}, 60 * 1000);
			}
			
			await db.query(db.format("INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)", [interaction.user.id, pp_power, Date.now(), expire_timestamp]));
			await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, clueless_power, expire_timestamp]));
			await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, copium_power, expire_timestamp]));
			await db.query(db.format("INSERT INTO HorniCheck(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, horni_power, expire_timestamp]));
		}
	} catch (err) {
		console.error(err);
		await interaction.editReply({
			content: "Something went wrong!",
		});
	}
}

async function checkForExpired(...values) {
	const array = [];
	const date = Date.now();
	
	for await (let value of values) {
		array.push(date >= value);
	}
	
	return array;
}

export function generatePPCheckPower() {
	let power = Math.floor(Math.random() * 101);
	
	if (isWeekend()) {
		power = Math.floor(Math.random() * (101 - 35)) + 35;
		
		let random = Math.random().toFixed(2);
		if (random <= 0.1) {
			power = Math.floor(Math.random() * 101) - 100;
		}
		
		if (Math.random() < 0.3) {
			const decimal = Math.random() + 0.99;
			power = Number(power + decimal).toFixed(2);
		}
	}
	
	// Small bonus to start the new year!
	if (isNewYears()) {
		power = Math.floor(Math.random() * (101 - 50)) + 50;
	}
	
	return power;
}

function generateCluelessPower(user_id) {
	let power = Math.floor(Math.random() * 101);
	
	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (checkCluelessKing(user_id)) {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
	}
	
	return power;
}

function generateCopiumPower(user_id) {
	let power = Math.floor(Math.random() * 101);
	
	// Here we generate the power for our copium king Warlord with a minimum of 100!
	if (checkCopiumKing(user_id)) {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
	}
	
	return power;
}

function generateHorniPower() {
	return Math.floor(Math.random() * 101);
}

function generateFeetPower(user_id) {
	let power = Math.floor(Math.random() * 101);
	
	if (checkFeetKing(user_id)) {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
	}
	
	if (user_id === "285529265502683138") {
		power = 100;
	}
	
	return power;
}

function cluelessKingCheck(user_id) {
	return checkCluelessKing(user_id) ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : "";
}

function copiumKingCheck(user_id) {
	return checkCopiumKing(user_id) ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : "";
}
