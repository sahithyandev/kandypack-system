"use client";

export default function Performance() {
	const stats = {
		completed: 128,
		onTimePct: 93,
		avgDeliveryTime: "2h 14m",
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="text-sm">
				Completed deliveries: <strong>{stats.completed}</strong>
			</div>
			<div className="text-sm">
				On-time: <strong>{stats.onTimePct}%</strong>
			</div>
			<div className="text-sm">
				Avg delivery time: <strong>{stats.avgDeliveryTime}</strong>
			</div>
		</div>
	);
}
