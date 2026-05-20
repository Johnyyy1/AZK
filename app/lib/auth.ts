import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/app/db";

const fallbackSecret = "development-only-aquasmart-secret-change-me";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	secret: process.env.BETTER_AUTH_SECRET ?? fallbackSecret,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	databaseHooks: {
		user: {
			create: {
				after: async (createdUser) => {
					const siteName = `${createdUser.name || createdUser.email}'s AquaSmart`;
					const [site] = await db
						.insert(schema.sites)
						.values({
							name: siteName,
							createdByUserId: createdUser.id,
						})
						.returning({ id: schema.sites.id });

					if (!site) return;

					await db.insert(schema.siteMembers).values({
						siteId: site.id,
						userId: createdUser.id,
						role: "owner",
						status: "active",
					});
				},
			},
		},
	},
	plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
