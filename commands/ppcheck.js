import {Collection} from "discord.js";

const MESSAGES = {
	"-100": ["Turned into dust! Disappeared from the face of the universe! <:ppcheck:1282311070924673050>"],
	"-99": ["Turns out you are a potato since you keep growing downward <a:smoking:1298958916452876288>"],
	"-80": ["You are not even worthy being food <:yuniiJail:1298954463373168660>"],
	"-50": ["Turns out radiation DONT make things grow <:pestoSlime:1298958398577971220>"],
	"-20": ["it can get this small? <:pestoGaspW:1137804322684547144>"],
	"-69":  ["reverse nice?... <:yuniiGasm:1281945197655363655>"],
	"0": ["non existent! Can't even find it with a magnifying glass <:pestoDetective:1298959707888812042>", "Congratulations, you reached absolute zero (which is -273.15 degrees Celsius)"],
	"69": ["nice... <:yuniiGasm:1281945197655363655>"],
	"20": ["So smol, can't even see it! <:yuniiWut:1281948023819337812>"],
	"50": ["hmm... decent size! <:yuniiPog:1281948035181711400>"],
	"80": ["Beeg! Nice! <:yuniiUwaa:1281948029431316530>"],
	"99": ["Enormous, Gigantic! Overflowing with pesto! <:yuniiCultured:1281948041032765490>"],
	"100": ["<:yuniiuh:1298954249908125747>"],
}

export const name = "ppcheck";
export async function run(client, interaction) {
	const user = interaction.options.getUser("pestie", false);
	let power = Math.floor(Math.random() * 101);
	
	const date = new Date();
	const day = date.getUTCDay();
	if (day === 0 || day === 6) {
		power = Math.floor(Math.random() * (101 - 35)) + 35;
		
		let random = Math.random().toFixed(2);
		if (random <= 0.1) power = Math.floor(Math.random() * 101) - 100;
	}
	
	const message = getMessage(power);
	if (user) {
		const member = interaction.guild.members.cache.get(user.id);
		await interaction.reply({
			content: `**${member.nickname ?? user.username}'s** Pesto Power is **${power}%**, ${message}`,
		});
	} else {
		await interaction.reply({
			content: `${interaction.user}'s Pesto Power is **${power}%**, ${message}`,
		});
	}
}

function getMessage(power) {
	if (power === -100) return MESSAGES["-100"][Math.floor(Math.random() * MESSAGES["-100"].length)];
	else if (power === -69) return MESSAGES["-20"][Math.floor(Math.random() * MESSAGES["-20"].length)];
	else if (power < -80) return MESSAGES["-99"][Math.floor(Math.random() * MESSAGES["-99"].length)];
	else if (power < -50) return MESSAGES["-80"][Math.floor(Math.random() * MESSAGES["-80"].length)];
	else if (power < -20) return MESSAGES["-50"][Math.floor(Math.random() * MESSAGES["-50"].length)];
	else if (power < 0) return MESSAGES["-20"][Math.floor(Math.random() * MESSAGES["-20"].length)];
	else if (power === 0) return MESSAGES["0"][Math.floor(Math.random() * MESSAGES["0"].length)];
	else if (power === 69) return MESSAGES["69"][Math.floor(Math.random() * MESSAGES["69"].length)];
	else if (power === 100) return MESSAGES["100"][Math.floor(Math.random() * MESSAGES["100"].length)];
	else if (power > 80) return MESSAGES["99"][Math.floor(Math.random() * MESSAGES["99"].length)];
	else if (power > 50) return MESSAGES["80"][Math.floor(Math.random() * MESSAGES["80"].length)];
	else if (power > 20) return MESSAGES["50"][Math.floor(Math.random() * MESSAGES["50"].length)];
	else return MESSAGES["20"][Math.floor(Math.random() * MESSAGES["20"].length)];
}
