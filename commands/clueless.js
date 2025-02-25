export const name = "clueless";
export async function run(client, interaction) {
	const db = client.database;
	const user = interaction.options.getUser("pestie", false);
	if (user && user.id !== interaction.user.id) {
		const [rows] = await db.query(db.format("SELECT power FROM Clueless WHERE user_id = ? AND expires >= ?", [user.id, Date.now()]));

		if (rows.length > 0) {
			const power = rows[0].power;
			await interaction.reply({
				content: `**${user}'s** cluelessness was **${power}%** today! ${user.id === "236642620506374145" ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}`,
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their clueless check today! <a:madPesto:1329480709328343132>",
				ephemeral: true
			});
		}

		return;
	}

	const [rows] = await db.query(db.format("SELECT expires FROM Clueless WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
	if (rows.length > 0) {
		const timestamp = Math.round(rows[0].expires / 1000);
		await interaction.reply({
			content: `You have already checked how clueless you are today! Check again <t:${timestamp}:R> (<t:${timestamp}>)`,
			ephemeral: true
		});

		return;
	}
	
	const date = getExpireTimestamp();
	let power = Math.floor(Math.random() * 101);
	let emoji = false;

	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (interaction.user.id === "236642620506374145") {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
		emoji = true;
	}
	
	await interaction.reply({
		content: `${interaction.user}'s cluelessness is **${power}%** today! ${emoji ? "<:cluelessKing:1332416626251010153> <:pestoBow:1332418781133410446>" : ""}`
	});

	await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, date]));
}

function getExpireTimestamp() {
	const date = new Date();

	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getDate() + 1);

	return date.getTime();
}
