export const PPCHECK_MESSAGES = {
	"-100": [
		"Turned into dust! Disappeared from the face of the universe! <:ppcheck:1282311070924673050>",
		"Scientists need a quantum microscope to study this phenomenon",
	],
	"-99": [
		"Turns out you are a potato since you keep growing downward <a:smoking:1298958916452876288>",
		"Congrats! Your Pesto Power has officially reached the Earth's core!",
	],
	"-80": [
		"You are not even worthy being food <:yuniiJail:1298954463373168660>",
		"Scientists need a quantum microscope to study this phenomenon",
	],
	"-50": [
		"Turns out radiation DONT make things grow <:pestoSlime:1298958398577971220>",
		"It's evolving, just backwards!",
	],
	"-20": [
		"it can get this small? <:pestoGaspW:1137804322684547144>",
		"Is that a PP or just a pixel on my screen?",
	],
	"-69": [
		"reverse nice?... <:yuniiGasm:1281945197655363655>",
		"Task failed successfully! <:yuniiGasm:1281945197655363655>",
	],
	"0": [
		"non existent! Can't even find it with a magnifying glass <:pestoDetective:1298959707888812042>",
		"Congratulations, you reached absolute zero (which is -273.15 degrees Celsius)",
	],
	"69": [
		"nice... <:yuniiGasm:1281945197655363655>",
		"The legendary number has chosen you! Nice.. <:yuniiGasm:1281945197655363655>",
	],
	"67": [
		"6 7.. why must it be this way <:CEASE:1467663506387112051>",
		"The 6 7 has chosen you. Is this a blessing, or a curse?",
		"The third most legendary number has chosen you! what a time to be alive! <:yuniiGasm:1281945197655363655>",
	],
	"20": [
		"So smol, can't even see it! <:yuniiWut:1281948023819337812>",
		"It's trying its best, okay? <:pestoSlime:1298958398577971220>",
	],
	"50": [
		"hmm... decent size! <:yuniiPog:1281948035181711400>",
		"Definitely nothing to be ashamed of!",
	],
	"80": [
		"Beeg! Nice! <:yuniiUwaa:1281948029431316530>",
		"Impressive... most impressive",
	],
	"99": [
		"Enormous, Gigantic! Overflowing with pesto! <:yuniiCultured:1281948041032765490>",
		"NASA wants to study this cosmic anomaly <:pestoDetective:1298959707888812042>",
	],
	"100": [
		"<:yuniiuh:1298954249908125747>",
		"MAXIMUM OVERDRIVE ACHIEVED!",
	],
	"Infinity": ["Infinity? More like... divinity. You're transcending dimensions.", "This broke the PPCheck scale. Please reboot the yuniiverse."]
};

export function getPPCheckMessage(power) {
	if (power === Infinity) return PPCHECK_MESSAGES["Infinity"][Math.floor(Math.random() * PPCHECK_MESSAGES["Infinity"].length)];
	else if (power <= -100) return PPCHECK_MESSAGES["-100"][Math.floor(Math.random() * PPCHECK_MESSAGES["-100"].length)];
	else if (power === -69) return PPCHECK_MESSAGES["-69"][Math.floor(Math.random() * PPCHECK_MESSAGES["-69"].length)];
	else if (power < -80) return PPCHECK_MESSAGES["-99"][Math.floor(Math.random() * PPCHECK_MESSAGES["-99"].length)];
	else if (power < -50) return PPCHECK_MESSAGES["-80"][Math.floor(Math.random() * PPCHECK_MESSAGES["-80"].length)];
	else if (power < -20) return PPCHECK_MESSAGES["-50"][Math.floor(Math.random() * PPCHECK_MESSAGES["-50"].length)];
	else if (power < 0) return PPCHECK_MESSAGES["-20"][Math.floor(Math.random() * PPCHECK_MESSAGES["-20"].length)];
	else if (power === 0) return PPCHECK_MESSAGES["0"][Math.floor(Math.random() * PPCHECK_MESSAGES["0"].length)];
	else if (power === 67) return PPCHECK_MESSAGES["67"][Math.floor(Math.random() * PPCHECK_MESSAGES["67"].length)];
	else if (power === 69) return PPCHECK_MESSAGES["69"][Math.floor(Math.random() * PPCHECK_MESSAGES["69"].length)];
	else if (power >= 100) return PPCHECK_MESSAGES["100"][Math.floor(Math.random() * PPCHECK_MESSAGES["100"].length)];
	else if (power > 80) return PPCHECK_MESSAGES["99"][Math.floor(Math.random() * PPCHECK_MESSAGES["99"].length)];
	else if (power > 50) return PPCHECK_MESSAGES["80"][Math.floor(Math.random() * PPCHECK_MESSAGES["80"].length)];
	else if (power > 20) return PPCHECK_MESSAGES["50"][Math.floor(Math.random() * PPCHECK_MESSAGES["50"].length)];
	else return PPCHECK_MESSAGES["20"][Math.floor(Math.random() * PPCHECK_MESSAGES["20"].length)];
}

export function getHorniMessage(power) {
	return power === 50
		? "Choose your Allegiance! <:LETDOGCOOK:1323241567561187368>"
		: power > 50
			? "Welcome to the Horni Revolution! <:yuniiHorni:1323241964820238377>"
			: "Welcome to the Seiso Cops! <:pestoPolice:1323241434966654976>";
}

export function getPestoCoinsMessage(negative) {
	if (negative) {
		return "# Council Penalty\nThe __Pesto Council__ withdraws **{coins}** pesto coins as part of a Yuniverse realignment!";
	} else {
		return "# Council Reward\nThe __Pesto Council__ rewards you with **+{coins}** pesto coins for doing your daily checks!";
	}
}
