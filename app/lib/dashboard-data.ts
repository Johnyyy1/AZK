import "server-only";

import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { getPrimarySite } from "./plc-data";

export async function getDashboardData(userId: string) {
	const primary = await getPrimarySite(userId);
	const plcRows = await db
		.select()
		.from(schema.plcs)
		.where(eq(schema.plcs.siteId, primary.site.id))
		.orderBy(desc(schema.plcs.createdAt));

	const primaryPlc = plcRows[0] ?? null;

	const readings = primaryPlc
		? await db
				.select()
				.from(schema.plcReadings)
				.where(eq(schema.plcReadings.plcId, primaryPlc.id))
				.orderBy(desc(schema.plcReadings.readAt))
				.limit(24)
		: [];

	const commands = primaryPlc
		? await db
				.select()
				.from(schema.pumpCommands)
				.where(eq(schema.pumpCommands.plcId, primaryPlc.id))
				.orderBy(desc(schema.pumpCommands.requestedAt))
				.limit(12)
		: [];

	return {
		site: primary.site,
		role: primary.role,
		plcs: plcRows,
		primaryPlc,
		readings,
		commands,
		latestReading: readings[0] ?? null,
		latestCommand: commands[0] ?? null,
	};
}

export const isAgentOnline = (lastHeartbeatAt: Date | null) => {
	if (!lastHeartbeatAt) return false;
	return Date.now() - lastHeartbeatAt.getTime() < 30_000;
};

export const formatDateTime = (value: Date | null | undefined) => {
	if (!value) return "Never";

	return new Intl.DateTimeFormat("cs-CZ", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(value);
};

export const formatTime = (value: Date | null | undefined) => {
	if (!value) return "Never";

	return new Intl.DateTimeFormat("cs-CZ", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(value);
};
