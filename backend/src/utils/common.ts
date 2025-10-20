export function convertRecordsToCsv(
	records: Array<Record<string, string | number>>,
): string {
	if (records.length === 0) {
		return "";
	}

	const headers = Object.keys(records[0]);
	const formattedHeaders = new Array(headers.length);
	for (let i = 0; i < headers.length; i++) {
		formattedHeaders[i] = headers[i]
			.split("_")
			.map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
			.join(" ");
	}

	const csvRows = records.map((record) =>
		headers
			.map((header) => `"${String(record[header]).replace(/"/g, '""')}"`)
			.join(","),
	);

	return [formattedHeaders.join(","), ...csvRows].join("\n");
}
