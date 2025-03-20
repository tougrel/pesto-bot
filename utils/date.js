export function getUTCExpireTimestamp() {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getDate() + 1);

	return date.getTime();
}