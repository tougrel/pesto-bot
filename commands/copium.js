export const name = "copium";
export async function run(client, interaction) {
	const db = client.database;
	const user = interaction.options.getUser("pestie", false);
	if (user && user.id !== interaction.user.id) {
		const [rows] = await db.query(db.format("SELECT power FROM Copium WHERE user_id = ? AND expires >= ?", [user.id, Date.now()]));

		if (rows.length > 0) {
			const power = rows[0].power;
			await interaction.reply({
				content: `**${user}'s** copium level was **${power}%** today! ${user.id === "124963012321738752" ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}`,
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: "I couldn't find any data for this pestie <:yuniiLost:1329480382843850815> It looks like they didn't do their copium check today! <a:madPesto:1329480709328343132>",
				ephemeral: true
			});
		}

		return;
	}

	const [rows] = await db.query(db.format("SELECT expires FROM Copium WHERE user_id = ? AND expires >= ?", [interaction.user.id, Date.now()]));
	if (rows.length > 0) {
		const timestamp = Math.round(rows[0].expires / 1000);
		await interaction.reply({
			content: `You have already checked how much on copium you are today! Check again <t:${timestamp}:R> (<t:${timestamp}>)`,
			ephemeral: true
		});

		return;
	}

	const date = getExpireTimestamp();
	let power = Math.floor(Math.random() * 101);
	let emoji = false;

	// Here we generate the power for our copiun king Warlord with a minimum of 100!
	if (interaction.user.id === "124963012321738752") {
		power = Math.floor(Math.random() * (10000 - 100)) + 100;
		emoji = true;
	}

	await interaction.reply({
		content: `${interaction.user}'s copium level is **${power}%** today! ${emoji ? "<:copiumKing:1332416650900799619> <:pestoBow:1332418781133410446>" : ""}`
	});

	await db.query(db.format("INSERT INTO Copium(user_id, power, expires) VALUES(?, ?, ?)", [interaction.user.id, power, date]));
}

function getExpireTimestamp() {
	const date = new Date();

	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getDate() + 1);

	return date.getTime();
}
