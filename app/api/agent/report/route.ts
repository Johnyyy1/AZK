import { eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { getAgentContext } from "@/app/lib/agent-auth";

export const dynamic = "force-dynamic";

type AgentReportPayload = {
	reading?: {
		value?: unknown;
		raw?: unknown;
		timestamp?: unknown;
	};
	error?: {
		stage?: unknown;
		message?: unknown;
		timestamp?: unknown;
	} | null;
	command?: {
		id?: unknown;
		status?: unknown;
		error?: unknown;
	} | null;
};

const dateFromPayload = (value: unknown) => {
	if (typeof value === "number") return new Date(value);
	if (typeof value === "string") {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) return date;
	}
	return new Date();
};

export async function POST(request: Request) {
	const context = await getAgentContext(request);

	if (!context) {
		return Response.json({ ok: false, message: "Invalid or revoked agent token." }, { status: 401 });
	}

	const payload = (await request.json().catch(() => null)) as AgentReportPayload | null;

	if (!payload) {
		return Response.json({ ok: false, message: "Report body must be valid JSON." }, { status: 400 });
	}

	const now = new Date();
	const plcUpdate: Partial<typeof schema.plcs.$inferInsert> = {
		lastHeartbeatAt: now,
	};

	if (payload.reading && typeof payload.reading.value === "number") {
		const readAt = dateFromPayload(payload.reading.timestamp);
		const raw = Array.isArray(payload.reading.raw)
			? payload.reading.raw.filter((item): item is number => typeof item === "number")
			: [payload.reading.value];

		await db.insert(schema.plcReadings).values({
			plcId: context.plc.id,
			value: payload.reading.value,
			raw,
			readAt,
		});

		plcUpdate.lastReadingAt = readAt;
	}

	if (payload.error && typeof payload.error.message === "string") {
		plcUpdate.lastErrorStage = typeof payload.error.stage === "string" ? payload.error.stage : "agent";
		plcUpdate.lastErrorMessage = payload.error.message;
	} else {
		plcUpdate.lastErrorStage = null;
		plcUpdate.lastErrorMessage = null;
	}

	await db.update(schema.plcs).set(plcUpdate).where(eq(schema.plcs.id, context.plc.id));

	if (payload.command && typeof payload.command.id === "string") {
		const failed = payload.command.status === "failed";
		await db
			.update(schema.pumpCommands)
			.set({
				status: failed ? "failed" : "acknowledged",
				agentError: failed && typeof payload.command.error === "string" ? payload.command.error : null,
				acknowledgedAt: now,
			})
			.where(eq(schema.pumpCommands.id, payload.command.id));
	}

	return Response.json({
		ok: true,
		serverTime: now.toISOString(),
	});
}
