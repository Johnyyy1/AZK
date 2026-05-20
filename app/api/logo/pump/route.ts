import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { auth } from "@/app/lib/auth";
import { getFirstAccessiblePlc } from "@/app/lib/plc-data";

export const dynamic = "force-dynamic";

const isRecentlySeen = (timestamp: Date | null) => {
	if (!timestamp) return false;
	return Date.now() - timestamp.getTime() < 30_000;
};

const pumpAddressFor = (plc: typeof schema.plcs.$inferSelect) =>
	plc.pumpWriteMode === "coil" ? plc.pumpCoilAddress : plc.pumpRegisterAddress;

async function getSession(request: Request) {
	return auth.api.getSession({
		headers: request.headers,
	});
}

export async function GET(request: Request) {
	const session = await getSession(request);

	if (!session?.user?.id) {
		return Response.json({ ok: false, message: "Authentication required." }, { status: 401 });
	}

	const plc = await getFirstAccessiblePlc(session.user.id);

	if (!plc) {
		return Response.json({
			configured: false,
			mode: null,
			address: null,
			connected: false,
			lastError: null,
			lastCommand: null,
			message: "Add a Siemens LOGO PLC in Settings before using pump control.",
		});
	}

	const [lastCommand] = await db
		.select()
		.from(schema.pumpCommands)
		.where(eq(schema.pumpCommands.plcId, plc.id))
		.orderBy(desc(schema.pumpCommands.requestedAt))
		.limit(1);

	const address = pumpAddressFor(plc);

	return Response.json({
		configured: address !== null,
		mode: plc.pumpWriteMode,
		address,
		connected: isRecentlySeen(plc.lastHeartbeatAt),
		lastError: plc.lastErrorMessage
			? {
					stage: plc.lastErrorStage ?? "agent",
					message: plc.lastErrorMessage,
					timestamp: plc.lastHeartbeatAt?.getTime() ?? Date.now(),
				}
			: null,
		lastCommand: lastCommand
			? {
					id: lastCommand.id,
					enabled: lastCommand.enabled,
					mode: lastCommand.mode,
					address: lastCommand.address,
					status: lastCommand.status,
					timestamp: lastCommand.requestedAt.getTime(),
				}
			: null,
	});
}

export async function POST(request: Request) {
	const session = await getSession(request);

	if (!session?.user?.id) {
		return Response.json({ ok: false, message: "Authentication required." }, { status: 401 });
	}

	const payload = (await request.json().catch(() => null)) as { enabled?: unknown } | null;

	if (typeof payload?.enabled !== "boolean") {
		return Response.json({ ok: false, message: "Body must include an 'enabled' boolean." }, { status: 400 });
	}

	const plc = await getFirstAccessiblePlc(session.user.id);

	if (!plc) {
		return Response.json({ ok: false, message: "Add a Siemens LOGO PLC in Settings first." }, { status: 400 });
	}

	const address = pumpAddressFor(plc);

	if (address === null) {
		return Response.json({ ok: false, message: "Pump mapping is not configured for this PLC." }, { status: 400 });
	}

	const [command] = await db
		.insert(schema.pumpCommands)
		.values({
			plcId: plc.id,
			requestedByUserId: session.user.id,
			enabled: payload.enabled,
			mode: plc.pumpWriteMode,
			address,
		})
		.returning();

	return Response.json({
		ok: true,
		command: {
			id: command.id,
			enabled: command.enabled,
			mode: command.mode,
			address: command.address,
			status: command.status,
			timestamp: command.requestedAt.getTime(),
		},
		connected: isRecentlySeen(plc.lastHeartbeatAt),
	});
}
