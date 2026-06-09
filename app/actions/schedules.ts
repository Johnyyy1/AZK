"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { requireSession } from "@/app/lib/session";
import { assertUserCanManagePlc } from "@/app/lib/plc-data";
import { normalizeDays } from "@/app/lib/scheduling";

const pathsToRevalidate = ["/dashboard", "/dashboard/scheduling", "/dashboard/controls"];

const redirectWithFeedback = (type: "notice" | "error", message: string): never => {
	const params = new URLSearchParams({ [type]: message });
	redirect(`/dashboard/scheduling?${params.toString()}`);
};

const revalidateSchedulingPaths = () => {
	for (const path of pathsToRevalidate) {
		revalidatePath(path);
	}
};

const numberFromForm = (formData: FormData, key: string, fallback: number) => {
	const value = Number(formData.get(key));
	return Number.isFinite(value) ? value : fallback;
};

const timeToMinute = (value: FormDataEntryValue | null) => {
	const text = String(value ?? "");
	const match = /^(\d{2}):(\d{2})$/.exec(text);

	if (!match) {
		throw new Error("Start time must use HH:MM format.");
	}

	const hour = Number(match[1]);
	const minute = Number(match[2]);

	if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
		throw new Error("Start time must be a valid time of day.");
	}

	return hour * 60 + minute;
};

const timezoneFromForm = (formData: FormData) => {
	const timezone = String(formData.get("timezone") ?? "Europe/Prague").trim() || "Europe/Prague";

	try {
		new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
		return timezone;
	} catch {
		throw new Error("Timezone is not valid.");
	}
};

const scheduleValuesFromForm = (formData: FormData) => {
	const name = String(formData.get("name") ?? "").trim() || "Morning irrigation";
	const startMinute = timeToMinute(formData.get("startTime"));
	const durationMinutes = Math.max(1, Math.min(180, numberFromForm(formData, "durationMinutes", 5)));
	const daysOfWeek = normalizeDays(formData.getAll("daysOfWeek"));

	if (daysOfWeek.length === 0) {
		throw new Error("Choose at least one day for the schedule.");
	}

	if (startMinute + durationMinutes >= 24 * 60) {
		throw new Error("Schedule windows must end on the same day for now.");
	}

	return {
		name,
		enabled: formData.get("enabled") === "on",
		dryRun: formData.get("dryRun") === "on",
		daysOfWeek,
		startMinute,
		durationMinutes,
		timezone: timezoneFromForm(formData),
	};
};

async function assertUserCanManageSchedule(userId: string, scheduleRuleId: string) {
	const [row] = await db
		.select({
			rule: schema.scheduleRules,
			role: schema.siteMembers.role,
		})
		.from(schema.scheduleRules)
		.innerJoin(schema.plcs, eq(schema.scheduleRules.plcId, schema.plcs.id))
		.innerJoin(schema.siteMembers, eq(schema.plcs.siteId, schema.siteMembers.siteId))
		.where(
			and(
				eq(schema.scheduleRules.id, scheduleRuleId),
				eq(schema.siteMembers.userId, userId),
				eq(schema.siteMembers.status, "active"),
			),
		)
		.limit(1);

	if (!row || row.role !== "owner") {
		throw new Error("You do not have permission to manage this schedule.");
	}

	return row.rule;
}

export async function createScheduleRuleAction(formData: FormData) {
	let notice = "Schedule rule created.";

	try {
		const session = await requireSession();
		const plcId = String(formData.get("plcId") ?? "");
		const plc = await assertUserCanManagePlc(session.user.id, plcId);
		const values = scheduleValuesFromForm(formData);

		await db.insert(schema.scheduleRules).values({
			plcId: plc.id,
			createdByUserId: session.user.id,
			...values,
		});

		notice = values.dryRun
			? `${values.name} is saved in dry-run mode.`
			: `${values.name} is active and may queue pump commands when due.`;
	} catch (error) {
		redirectWithFeedback("error", error instanceof Error ? error.message : "Failed to create schedule rule.");
	}

	revalidateSchedulingPaths();
	redirectWithFeedback("notice", notice);
}

export async function toggleScheduleRuleAction(formData: FormData) {
	let notice = "Schedule rule updated.";

	try {
		const session = await requireSession();
		const scheduleRuleId = String(formData.get("scheduleRuleId") ?? "");
		const rule = await assertUserCanManageSchedule(session.user.id, scheduleRuleId);
		const enabled = formData.get("enabled") === "true";

		await db
			.update(schema.scheduleRules)
			.set({ enabled, updatedAt: new Date() })
			.where(eq(schema.scheduleRules.id, rule.id));

		notice = `${rule.name} is now ${enabled ? "enabled" : "paused"}.`;
	} catch (error) {
		redirectWithFeedback("error", error instanceof Error ? error.message : "Failed to update schedule rule.");
	}

	revalidateSchedulingPaths();
	redirectWithFeedback("notice", notice);
}

export async function setScheduleDryRunAction(formData: FormData) {
	let notice = "Schedule safety mode updated.";

	try {
		const session = await requireSession();
		const scheduleRuleId = String(formData.get("scheduleRuleId") ?? "");
		const rule = await assertUserCanManageSchedule(session.user.id, scheduleRuleId);
		const dryRun = formData.get("dryRun") === "true";

		await db
			.update(schema.scheduleRules)
			.set({ dryRun, updatedAt: new Date() })
			.where(eq(schema.scheduleRules.id, rule.id));

		notice = dryRun
			? `${rule.name} is back in dry-run mode.`
			: `${rule.name} can now queue real pump commands when due.`;
	} catch (error) {
		redirectWithFeedback("error", error instanceof Error ? error.message : "Failed to update dry-run mode.");
	}

	revalidateSchedulingPaths();
	redirectWithFeedback("notice", notice);
}

export async function deleteScheduleRuleAction(formData: FormData) {
	let notice = "Schedule rule deleted.";

	try {
		const session = await requireSession();
		const scheduleRuleId = String(formData.get("scheduleRuleId") ?? "");
		const rule = await assertUserCanManageSchedule(session.user.id, scheduleRuleId);

		await db.delete(schema.scheduleRules).where(eq(schema.scheduleRules.id, rule.id));
		notice = `${rule.name} was deleted.`;
	} catch (error) {
		redirectWithFeedback("error", error instanceof Error ? error.message : "Failed to delete schedule rule.");
	}

	revalidateSchedulingPaths();
	redirectWithFeedback("notice", notice);
}
