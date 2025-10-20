import { client } from "../../utils/db";
import type { AdminModel } from "./model";

export abstract class AdminService {
	static async generateTruckUsageReport(): Promise<
		Array<AdminModel.TruckUsageReportItem>
	> {
		const result = await client.query(`SELECT * FROM v_truck_usage_monthly;`);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
}
