import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/app/db";

export async function getPrimarySite(userId: string) {
	const [membership] = await db
		.select({
			site: schema.sites,
			role: schema.siteMembers.role,
		})
		.from(schema.siteMembers)
		.innerJoin(schema.sites, eq(schema.siteMembers.siteId, schema.sites.id))
		.where(and(eq(schema.siteMembers.userId, userId), eq(schema.siteMembers.status, "active")))
		.limit(1);

	if (membership) return membership;

	const [site] = await db
		.insert(schema.sites)
		.values({
			name: "My AquaSmart",
			createdByUserId: userId,
		})
		.returning();

	await db.insert(schema.siteMembers).values({
		siteId: site.id,
		userId,
		role: "owner",
		status: "active",
	});

	return { site, role: "owner" as const };
}

export async function getDashboardSettings(userId: string) {
	const primary = await getPrimarySite(userId);
	const plcRows = await db
		.select()
		.from(schema.plcs)
		.where(eq(schema.plcs.siteId, primary.site.id))
		.orderBy(desc(schema.plcs.createdAt));

	const plcData = await Promise.all(
		plcRows.map(async (plc) => {
			const [token] = await db
				.select()
				.from(schema.agentTokens)
				.where(and(eq(schema.agentTokens.plcId, plc.id), isNull(schema.agentTokens.revokedAt)))
				.orderBy(desc(schema.agentTokens.createdAt))
				.limit(1);

			const [latestReading] = await db
				.select()
				.from(schema.plcReadings)
				.where(eq(schema.plcReadings.plcId, plc.id))
				.orderBy(desc(schema.plcReadings.readAt))
				.limit(1);

			return { plc, token, latestReading };
		}),
	);

	return {
		site: primary.site,
		role: primary.role,
		plcs: plcData,
	};
}

export async function assertUserCanManagePlc(userId: string, plcId: string) {
	const [row] = await db
		.select({
			plc: schema.plcs,
			role: schema.siteMembers.role,
		})
		.from(schema.plcs)
		.innerJoin(schema.siteMembers, eq(schema.plcs.siteId, schema.siteMembers.siteId))
		.where(
			and(
				eq(schema.plcs.id, plcId),
				eq(schema.siteMembers.userId, userId),
				eq(schema.siteMembers.status, "active"),
			),
		)
		.limit(1);

	if (!row || row.role !== "owner") {
		throw new Error("You do not have permission to manage this PLC.");
	}

	return row.plc;
}

export async function getFirstAccessiblePlc(userId: string) {
	const [row] = await db
		.select({ plc: schema.plcs })
		.from(schema.plcs)
		.innerJoin(schema.siteMembers, eq(schema.plcs.siteId, schema.siteMembers.siteId))
		.where(and(eq(schema.siteMembers.userId, userId), eq(schema.siteMembers.status, "active")))
		.orderBy(desc(schema.plcs.createdAt))
		.limit(1);

	return row?.plc ?? null;
}
