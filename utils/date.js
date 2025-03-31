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
