export function getUTCExpireTimestamp() {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getDate() + 1);
	
	return date.getTime();
}

export function isAprilFools() {
	const date = new Date();
	const day = date.getUTCDate();
	const month = date.getUTCMonth();
	
	return day === 1 && month === 3;
}

export function isWeekend() {
	const date = new Date();
	const day = date.getUTCDay();
	
	return day === 0 || day === 6;
}

export function isChristmasSeason() {
	const date = new Date();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();

	return (month === 11 && day >= 1) || (month === 0 && day <= 8);
}

export function isNewYears() {
	const date = new Date();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	
	return month === 0 && day === 1;
}

export function isYuniisBirthday() {
	const date = new Date();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	
	return month === 6 && day === 24;
}
