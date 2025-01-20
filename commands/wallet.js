export const name = "wallet";

export async function run(client, interaction) {
	const db = client.database;
	const [rows] = await db.query(db.format("SELECT coins from Wallet WHERE id = ?", [interaction.user.id]));
	if (rows.length === 0) {
		await db.query(db.format("INSERT INTO Wallet(id) VALUES(?)", [interaction.user.id]));
		await run(client, interaction);

		return;
	}

	const user = rows[0];
	const coins = user?.coins || 0;

	await interaction.reply({
		content: `${interaction.user} you have **${coins}** pesto coins in your wallet`,
		ephemeral: true,
	});
}
