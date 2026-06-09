"use server";

import { revalidatePath } from "next/cache";
import { eq, isNull, and } from "drizzle-orm";
import { db, schema } from "@/app/db";
import { requireSession } from "@/app/lib/session";
import { assertUserCanManagePlc, getPrimarySite } from "@/app/lib/plc-data";
import { createAgentToken, getTokenPrefix, hashAgentToken } from "@/app/lib/tokens";

export type PlcActionState = {
	message?: string;
	agentToken?: string;
	error?: string;
};

const pathsToRevalidate = ["/dashboard", "/dashboard/settings", "/dashboard/controls", "/dashboard/zones"];

const numberFromForm = (formData: FormData, key: string, fallback: number) => {
	const value = Number(formData.get(key));
	return Number.isFinite(value) ? value : fallback;
};

const optionalNumberFromForm = (formData: FormData, key: string) => {
	const raw = formData.get(key);
	if (raw === null || raw === "") return null;
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
};

const plcValuesFromForm = (formData: FormData) => {
	const name = String(formData.get("name") ?? "").trim() || "Greenhouse LOGO";
	const logoIp = String(formData.get("logoIp") ?? "").trim();
	const pumpWriteMode: "coil" | "register" =
		String(formData.get("pumpWriteMode") ?? "coil") === "register" ? "register" : "coil";
	const pumpCoilAddress = optionalNumberFromForm(formData, "pumpCoilAddress");
	const pumpRegisterAddress = optionalNumberFromForm(formData, "pumpRegisterAddress");

	if (!logoIp) {
		throw new Error("PLC IP address is required for the local bridge configuration.");
	}

	if (pumpWriteMode === "coil" && pumpCoilAddress === null) {
		throw new Error("Coil mode needs a pump coil address.");
	}

	if (pumpWriteMode === "register" && pumpRegisterAddress === null) {
		throw new Error("Register mode needs a pump register address.");
	}

	return {
		name,
		logoIp,
		logoPort: numberFromForm(formData, "logoPort", 502),
		unitId: numberFromForm(formData, "unitId", 1),
		readIntervalMs: Math.max(500, numberFromForm(formData, "readIntervalMs", 2000)),
		registerOffset: numberFromForm(formData, "registerOffset", 0),
		registerCount: Math.max(1, numberFromForm(formData, "registerCount", 1)),
		pumpWriteMode,
		pumpCoilAddress,
		pumpRegisterAddress,
		pumpRegisterOnValue: numberFromForm(formData, "pumpRegisterOnValue", 1),
		pumpRegisterOffValue: numberFromForm(formData, "pumpRegisterOffValue", 0),
	};
};

const revalidateDashboardPlcPaths = () => {
	for (const path of pathsToRevalidate) {
		revalidatePath(path);
	}
};

export async function createPlcAction(_: PlcActionState, formData: FormData): Promise<PlcActionState> {
	try {
		const session = await requireSession();
		const primary = await getPrimarySite(session.user.id);

		if (primary.role !== "owner") {
			return { error: "Only a site owner can add PLC hardware." };
		}

		const values = plcValuesFromForm(formData);

		const [plc] = await db
			.insert(schema.plcs)
			.values({
				siteId: primary.site.id,
				...values,
			})
			.returning();

		const token = createAgentToken();
		await db.insert(schema.agentTokens).values({
			plcId: plc.id,
			tokenHash: hashAgentToken(token),
			tokenPrefix: getTokenPrefix(token),
		});

		revalidateDashboardPlcPaths();
		return {
			message: "PLC added. Store this bridge token now; it is shown only once.",
			agentToken: token,
		};
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to add PLC." };
	}
}

export async function updatePlcAction(_: PlcActionState, formData: FormData): Promise<PlcActionState> {
	try {
		const session = await requireSession();
		const plcId = String(formData.get("plcId") ?? "");
		const plc = await assertUserCanManagePlc(session.user.id, plcId);
		const values = plcValuesFromForm(formData);

		await db
			.update(schema.plcs)
			.set({
				...values,
				updatedAt: new Date(),
			})
			.where(eq(schema.plcs.id, plc.id));

		revalidateDashboardPlcPaths();
		return { message: `${values.name} configuration saved.` };
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to update PLC." };
	}
}

export async function deletePlcAction(_: PlcActionState, formData: FormData): Promise<PlcActionState> {
	try {
		const session = await requireSession();
		const plcId = String(formData.get("plcId") ?? "");
		const plc = await assertUserCanManagePlc(session.user.id, plcId);

		await db.delete(schema.plcs).where(eq(schema.plcs.id, plc.id));

		revalidateDashboardPlcPaths();
		return { message: `${plc.name} deleted. Related bridge tokens and history were removed with it.` };
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to delete PLC." };
	}
}

export async function regenerateAgentTokenAction(
	_: PlcActionState,
	formData: FormData,
): Promise<PlcActionState> {
	try {
		const session = await requireSession();
		const plcId = String(formData.get("plcId") ?? "");
		const plc = await assertUserCanManagePlc(session.user.id, plcId);
		const token = createAgentToken();

		await db
			.update(schema.agentTokens)
			.set({ revokedAt: new Date() })
			.where(and(eq(schema.agentTokens.plcId, plc.id), isNull(schema.agentTokens.revokedAt)));

		await db.insert(schema.agentTokens).values({
			plcId: plc.id,
			tokenHash: hashAgentToken(token),
			tokenPrefix: getTokenPrefix(token),
		});

		revalidateDashboardPlcPaths();
		return {
			message: `New bridge token generated for ${plc.name}. Store it now; it is shown only once.`,
			agentToken: token,
		};
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to regenerate token." };
	}
}

export async function revokeAgentTokensAction(_: PlcActionState, formData: FormData): Promise<PlcActionState> {
	try {
		const session = await requireSession();
		const plcId = String(formData.get("plcId") ?? "");
		const plc = await assertUserCanManagePlc(session.user.id, plcId);

		await db
			.update(schema.agentTokens)
			.set({ revokedAt: new Date() })
			.where(and(eq(schema.agentTokens.plcId, plc.id), isNull(schema.agentTokens.revokedAt)));

		revalidateDashboardPlcPaths();
		return { message: `Active bridge tokens revoked for ${plc.name}.` };
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Failed to revoke token." };
	}
}
