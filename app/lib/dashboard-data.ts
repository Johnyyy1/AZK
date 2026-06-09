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

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

const demoMoistureValues = [56, 54, 55, 57, 58, 56, 53, 51, 49, 48, 50, 52];

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

export function withDashboardMockData(data: DashboardData): DashboardData {
	const now = new Date();
	const lastReadingAt = minutesAgo(2);
	const createdAt = data.primaryPlc?.createdAt ?? minutesAgo(60 * 24);
	const primaryPlc =
		data.primaryPlc === null
			? {
					id: "00000000-0000-4000-8000-000000000001",
					siteId: data.site.id,
					name: "Sklenikovy LOGO bridge",
					model: "Siemens LOGO 8.4",
					logoIp: "192.168.0.42",
					logoPort: 502,
					unitId: 1,
					readIntervalMs: 2000,
					registerOffset: 0,
					registerCount: 8,
					pumpWriteMode: "coil" as const,
					pumpCoilAddress: 8256,
					pumpRegisterAddress: null,
					pumpRegisterOnValue: 1,
					pumpRegisterOffValue: 0,
					lastHeartbeatAt: now,
					lastReadingAt,
					lastErrorStage: null,
					lastErrorMessage: null,
					createdAt,
					updatedAt: now,
				}
			: {
					...data.primaryPlc,
					pumpCoilAddress: data.primaryPlc.pumpCoilAddress ?? 8256,
					lastHeartbeatAt: now,
					lastReadingAt: data.primaryPlc.lastReadingAt ?? lastReadingAt,
					lastErrorStage: null,
					lastErrorMessage: null,
				};

	const readings =
		data.readings.length >= 2
			? data.readings
			: demoMoistureValues.map((value, index) => ({
					id: `mock-reading-${index}`,
					plcId: primaryPlc.id,
					value,
					raw: [value],
					readAt: minutesAgo(index * 30 + 3),
					createdAt: minutesAgo(index * 30 + 3),
				}));

	const commands =
		data.commands.length > 0
			? data.commands
			: [
					{
						id: "mock-command-1",
						plcId: primaryPlc.id,
						requestedByUserId: null,
						enabled: false,
						mode: "coil" as const,
						address: primaryPlc.pumpCoilAddress ?? primaryPlc.pumpRegisterAddress ?? 8256,
						status: "acknowledged" as const,
						agentError: null,
						requestedAt: minutesAgo(42),
						sentAt: minutesAgo(41),
						acknowledgedAt: minutesAgo(40),
					},
					{
						id: "mock-command-2",
						plcId: primaryPlc.id,
						requestedByUserId: null,
						enabled: true,
						mode: "coil" as const,
						address: primaryPlc.pumpCoilAddress ?? primaryPlc.pumpRegisterAddress ?? 8256,
						status: "acknowledged" as const,
						agentError: null,
						requestedAt: minutesAgo(75),
						sentAt: minutesAgo(74),
						acknowledgedAt: minutesAgo(73),
					},
				];

	return {
		...data,
		plcs: data.plcs.length > 0 ? [primaryPlc, ...data.plcs.slice(1)] : [primaryPlc],
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
