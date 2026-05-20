import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function createAgentToken() {
	return `as_${randomBytes(32).toString("base64url")}`;
}

export function hashAgentToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

export function getTokenPrefix(token: string) {
	return token.slice(0, 12);
}
