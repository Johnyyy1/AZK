import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { hashAgentToken } from "./tokens";

export async function getAgentContext(request: Request) {
	const header = request.headers.get("authorization");
	const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

	if (!token) return null;

	const [row] = await db
		.select({
			token: schema.agentTokens,
			plc: schema.plcs,
		})
		.from(schema.agentTokens)
		.innerJoin(schema.plcs, eq(schema.agentTokens.plcId, schema.plcs.id))
		.where(and(eq(schema.agentTokens.tokenHash, hashAgentToken(token)), isNull(schema.agentTokens.revokedAt)))
		.limit(1);

	if (!row) return null;

	const now = new Date();
	await db.update(schema.agentTokens).set({ lastUsedAt: now }).where(eq(schema.agentTokens.id, row.token.id));
	await db.update(schema.plcs).set({ lastHeartbeatAt: now }).where(eq(schema.plcs.id, row.plc.id));

	return row;
}
