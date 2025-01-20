export const name = "clueless";
export async function run(client, interaction) {
	const db = client.database;
	const [rows] = await db.query(db.format("SELECT expires FROM Clueless WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
	if (rows.length > 0) {
		const timestamp = Math.round(rows[0].expires / 1000);
		await interaction.reply({
			content: `You have already checked how clueless you are today! Check again <t:${timestamp}:R> (<t:${timestamp}>)`,
			ephemeral: true
		});

		return;
	}
	
	let power = Math.floor(Math.random() * 101);
	const date = getExpireTimestamp();

	// Here we generate the power for our clueless king Aleg with a minimum of 100!
	if (interaction.user.id === "236642620506374145") power = Math.floor(Math.random() * (10000 - 100)) + 100;
	
	await interaction.reply({
		content: `${interaction.user}'s cluelessness is **${power}%** today!`
	});

	await db.query(db.format("INSERT INTO Clueless(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, date]));
}

function getExpireTimestamp() {
	const date = new Date();

	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getDate() + 1);

	return date.getTime();
}
