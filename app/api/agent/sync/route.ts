import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { getAgentContext } from "@/app/lib/agent-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const context = await getAgentContext(request);

	if (!context) {
		return Response.json({ ok: false, message: "Invalid or revoked agent token." }, { status: 401 });
	}

	const [queuedCommand] = await db
		.select()
		.from(schema.pumpCommands)
		.where(and(eq(schema.pumpCommands.plcId, context.plc.id), eq(schema.pumpCommands.status, "queued")))
		.orderBy(asc(schema.pumpCommands.requestedAt))
		.limit(1);

	if (queuedCommand) {
		await db
			.update(schema.pumpCommands)
			.set({ status: "sent", sentAt: new Date() })
			.where(eq(schema.pumpCommands.id, queuedCommand.id));
	}

	return Response.json({
		ok: true,
		plc: {
			id: context.plc.id,
			name: context.plc.name,
			logoIp: context.plc.logoIp,
			logoPort: context.plc.logoPort,
			unitId: context.plc.unitId,
			readIntervalMs: context.plc.readIntervalMs,
			registerOffset: context.plc.registerOffset,
			registerCount: context.plc.registerCount,
			pumpControl: {
				mode: context.plc.pumpWriteMode,
				address:
					context.plc.pumpWriteMode === "coil"
						? context.plc.pumpCoilAddress
						: context.plc.pumpRegisterAddress,
				registerOnValue: context.plc.pumpRegisterOnValue,
				registerOffValue: context.plc.pumpRegisterOffValue,
			},
		},
		command: queuedCommand
			? {
					id: queuedCommand.id,
					enabled: queuedCommand.enabled,
					mode: queuedCommand.mode,
					address: queuedCommand.address,
				}
			: null,
		serverTime: new Date().toISOString(),
	});
}
