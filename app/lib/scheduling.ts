import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { getDashboardData } from "./dashboard-data";

export const weekdayOptions = [
	{ value: 1, short: "Mon", label: "Monday" },
	{ value: 2, short: "Tue", label: "Tuesday" },
	{ value: 3, short: "Wed", label: "Wednesday" },
	{ value: 4, short: "Thu", label: "Thursday" },
	{ value: 5, short: "Fri", label: "Friday" },
	{ value: 6, short: "Sat", label: "Saturday" },
	{ value: 0, short: "Sun", label: "Sunday" },
] as const;

const weekdayNameByValue = new Map<number, string>(weekdayOptions.map((day) => [day.value, day.short]));
const weekdayValueByName: Record<string, number> = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6,
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (timezone: string) => {
	const cached = formatterCache.get(timezone);
	if (cached) return cached;

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
	formatterCache.set(timezone, formatter);
	return formatter;
};

const getLocalScheduleParts = (date: Date, timezone: string) => {
	const parts = getFormatter(timezone).formatToParts(date);
	const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
	const weekday = weekdayValueByName[part("weekday")] ?? 0;
	const hour = Number(part("hour"));
	const minute = Number(part("minute"));

	return {
		weekday,
		minuteOfDay: hour * 60 + minute,
	};
};

const startOfUtcMinute = (date: Date) => {
	const dueAt = new Date(date);
	dueAt.setUTCSeconds(0, 0);
	return dueAt;
};

export const minutesToTime = (minutes: number) => {
	const hour = Math.floor(minutes / 60);
	const minute = minutes % 60;
	return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const ruleDaysLabel = (daysOfWeek: number[]) =>
	daysOfWeek
		.slice()
		.sort((a, b) => {
			const left = a === 0 ? 7 : a;
			const right = b === 0 ? 7 : b;
			return left - right;
		})
		.map((day) => weekdayNameByValue.get(day) ?? String(day))
		.join(", ");

export const nextWindowLabel = (
	rule: Pick<typeof schema.scheduleRules.$inferSelect, "daysOfWeek" | "startMinute" | "timezone">,
) => {
	const now = new Date();
	const local = getLocalScheduleParts(now, rule.timezone);
	const days = normalizeDays(rule.daysOfWeek);

	for (let offset = 0; offset < 8; offset += 1) {
		const weekday = (local.weekday + offset) % 7;
		const isFutureToday = offset === 0 && rule.startMinute > local.minuteOfDay;

		if (days.includes(weekday) && (offset > 0 || isFutureToday)) {
			const label = offset === 0 ? "Today" : (weekdayNameByValue.get(weekday) ?? "Next");
			return `${label} ${minutesToTime(rule.startMinute)} ${rule.timezone}`;
		}
	}

	return `Next ${minutesToTime(rule.startMinute)} ${rule.timezone}`;
};

export function normalizeDays(value: unknown) {
	const days = Array.isArray(value)
		? value
				.map((day) => Number(day))
				.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
		: [];

	return [...new Set(days)];
}

export async function getSchedulingData(userId: string) {
	const dashboard = await getDashboardData(userId);

	const rules = dashboard.primaryPlc
		? await db
				.select()
				.from(schema.scheduleRules)
				.where(eq(schema.scheduleRules.plcId, dashboard.primaryPlc.id))
				.orderBy(desc(schema.scheduleRules.createdAt))
		: [];

	const runs = dashboard.primaryPlc
		? await db
				.select({
					run: schema.scheduleRuns,
					ruleName: schema.scheduleRules.name,
				})
				.from(schema.scheduleRuns)
				.innerJoin(schema.scheduleRules, eq(schema.scheduleRuns.scheduleRuleId, schema.scheduleRules.id))
				.where(eq(schema.scheduleRuns.plcId, dashboard.primaryPlc.id))
				.orderBy(desc(schema.scheduleRuns.createdAt))
				.limit(12)
		: [];

	return {
		...dashboard,
		rules,
		runs,
	};
}

export async function evaluateDueSchedulesForPlc(plc: typeof schema.plcs.$inferSelect, now = new Date()) {
	const rules = await db
		.select()
		.from(schema.scheduleRules)
		.where(and(eq(schema.scheduleRules.plcId, plc.id), eq(schema.scheduleRules.enabled, true)));

	if (rules.length === 0) return 0;

	const dueAt = startOfUtcMinute(now);
	let generated = 0;

	for (const rule of rules) {
		const local = getLocalScheduleParts(now, rule.timezone);
		const days = normalizeDays(rule.daysOfWeek);
		const endMinute = rule.startMinute + rule.durationMinutes;
		const action =
			days.includes(local.weekday) && local.minuteOfDay === rule.startMinute
				? "pump_on"
				: days.includes(local.weekday) && local.minuteOfDay === endMinute
					? "pump_off"
					: null;

		if (!action) continue;

		const enabled = action === "pump_on";
		const address = plc.pumpWriteMode === "coil" ? plc.pumpCoilAddress : plc.pumpRegisterAddress;
		const status = rule.dryRun ? "previewed" : address === null ? "skipped" : "queued";
		const message =
			status === "previewed"
				? "Dry-run preview only; no pump command was queued."
				: status === "skipped"
					? "Pump mapping is missing, so no command was queued."
					: "Schedule generated a pump command for the local bridge.";

		const [run] = await db
			.insert(schema.scheduleRuns)
			.values({
				scheduleRuleId: rule.id,
				plcId: plc.id,
				action,
				status,
				dueAt,
				message,
			})
			.onConflictDoNothing()
			.returning();

		if (!run) continue;

		if (status === "queued" && address !== null) {
			const [command] = await db
				.insert(schema.pumpCommands)
				.values({
					plcId: plc.id,
					requestedByUserId: rule.createdByUserId,
					enabled,
					mode: plc.pumpWriteMode,
					address,
				})
				.returning();

			await db
				.update(schema.scheduleRuns)
				.set({ pumpCommandId: command.id })
				.where(eq(schema.scheduleRuns.id, run.id));
		}

		await db
			.update(schema.scheduleRules)
			.set({ lastGeneratedAt: now })
			.where(eq(schema.scheduleRules.id, rule.id));

		generated += 1;
	}

	return generated;
}
