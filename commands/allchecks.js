import {getPPCheckMessage} from "../utils/messages.js";
import {getUTCExpireTimestamp, isAprilFools} from "../utils/date.js";

export const name = "allchecks";

export async function run(client, interaction) {
	const db = client.database;

	await interaction.deferReply();
	try {
		const [rows] = await db.query(db.format("SELECT pp_power, pp_expires, clueless_power, clueless_expires, copium_power, copium_expires FROM AllChecks WHERE user_id = ?", [interaction.user.id]));

		if (rows.length > 0) {
			const data = rows[0];

			let pp_power = data.pp_power || 0;
			let clueless_power = data.clueless_power || 0;
			let copium_power = data.copium_power || 0;

			const [pp_expired, clueless_expired, copium_expired] = await checkForExpired(data.pp_expires, data.clueless_expires, data.copium_expires);
			if (!pp_expired) pp_power = generatePPCheckPower();
			if (!clueless_expired) clueless_power = generateCluelessPower(interaction.user.id);
			if (!copium_expired) copium_power = generateCopiumPower(interaction.user.id);

			const is_april_fools = isAprilFools();
			const expire_timestamp = getUTCExpireTimestamp();
			const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);

			const pp_power_to_show = is_april_fools ? 0 : pp_power;
			const clueless_power_to_show = is_april_fools ? 0 : clueless_power;
			const copium_power_to_show = is_april_fools ? 0 : copium_power;
			await interaction.editReply({
				content: `${interaction.user}'s checks today:\n- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power_to_show}%**, ${getPPCheckMessage(pp_power_to_show)}\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power_to_show}%** today! ${cluelessKingCheck(interaction.user.id)}\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power_to_show}%** today! ${copiumKingCheck(interaction.user.id)}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
			});

			if (is_april_fools) {
				setTimeout(async () => {
					await interaction.editReply({
						content: `${interaction.user}'s checks today:\n- Pesto Power ${pp_expired ? "is" : "was"} **${pp_power}%**, ${getPPCheckMessage(pp_power)}\n- Cluelessness ${clueless_expired ? "is" : "was"} **${clueless_power}%** today! ${cluelessKingCheck(interaction.user.id)}\n- Copium level ${copium_expired ? "is" : "was"} **${copium_power}%** today! ${copiumKingCheck(interaction.user.id)}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
					});
				}, 60 * 1000);
			}

			if (pp_expired) await db.query(db.format("INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)", [interaction.user.id, pp_power, Date.now(), expire_timestamp]));
			if (clueless_expired) await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, clueless_power, expire_timestamp]));
			if (copium_expired)	await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, copium_power, expire_timestamp]));
		} else {
			let pp_power = generatePPCheckPower();
			let clueless_power = generateCluelessPower(interaction.user.id);
			let copium_power = generateCopiumPower(interaction.user.id);

			const is_april_fools = isAprilFools();
			const expire_timestamp = getUTCExpireTimestamp();
			const expire_timestamp_in_seconds = Math.round(expire_timestamp / 1000);
			await interaction.editReply({
				content: `${interaction.user}'s checks today:\n- Pesto Power is **${is_april_fools ? 1 : pp_power}%**, ${getPPCheckMessage(pp_power)}\n- Cluelessness is **${is_april_fools ? 1 : clueless_power}%** today! ${cluelessKingCheck(interaction.user.id)}\n- Copium level is **${is_april_fools ? 1 : copium_power}%** today! ${copiumKingCheck(interaction.user.id)}\n-# Checks reset <t:${expire_timestamp_in_seconds}:R> (<t:${expire_timestamp_in_seconds}>)`,
			});

			await db.query(db.format("INSERT INTO PPCheck(user_id, power, time, expires) VALUES(?, ?, ?, ?)", [interaction.user.id, pp_power, Date.now(), getUTCExpireTimestamp()]));
			await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, clueless_power, getUTCExpireTimestamp()]));
			await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, copium_power, getUTCExpireTimestamp()]));
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

function generatePPCheckPower() {
	let power = Math.floor(Math.random() * 101)

	const day = new Date().getUTCDay();
	if (day === 0 || day === 6) {
		power = Math.floor(Math.random() * (101 - 35)) + 35;

		let random = Math.random().toFixed(2);
		if (random <= 0.1) power = Math.floor(Math.random() * 101) - 100;
	}

	return power;
}

function generateCluelessPower(user_id) {
	let power = Math.floor(Math.random() * 101);

	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (user_id === "236642620506374145") {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
	}

	return power;
}

function generateCopiumPower(user_id) {
	let power = Math.floor(Math.random() * 101);

	// Here we generate the power for our copium king Warlord with a minimum of 100!
	if (user_id === "124963012321738752") {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
	}

	return power;
}

function cluelessKingCheck(user_id) {
	return user_id === "236642620506374145" ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : "";
}

function copiumKingCheck(user_id) {
	return user_id === "124963012321738752" ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : "";
}
