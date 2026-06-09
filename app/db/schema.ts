import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const siteRole = pgEnum("site_role", ["owner", "operator"]);
export const siteMemberStatus = pgEnum("site_member_status", ["active", "pending"]);
export const pumpControlMode = pgEnum("pump_control_mode", ["coil", "register"]);
export const pumpCommandStatus = pgEnum("pump_command_status", ["queued", "sent", "acknowledged", "failed"]);
export const scheduleAction = pgEnum("schedule_action", ["pump_on", "pump_off"]);
export const scheduleRunStatus = pgEnum("schedule_run_status", ["previewed", "queued", "skipped", "failed"]);

export const sites = pgTable("sites", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	createdByUserId: text("created_by_user_id").references(() => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteMembers = pgTable(
	"site_members",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		siteId: uuid("site_id")
			.notNull()
			.references(() => sites.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: siteRole("role").notNull().default("operator"),
		status: siteMemberStatus("status").notNull().default("pending"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("site_members_site_id_idx").on(table.siteId),
		uniqueIndex("site_members_site_user_idx").on(table.siteId, table.userId),
	],
);

export const plcs = pgTable(
	"plcs",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		siteId: uuid("site_id")
			.notNull()
			.references(() => sites.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		model: text("model").notNull().default("Siemens LOGO 8.4"),
		logoIp: text("logo_ip").notNull(),
		logoPort: integer("logo_port").notNull().default(502),
		unitId: integer("unit_id").notNull().default(1),
		readIntervalMs: integer("read_interval_ms").notNull().default(2000),
		registerOffset: integer("register_offset").notNull().default(0),
		registerCount: integer("register_count").notNull().default(1),
		pumpWriteMode: pumpControlMode("pump_write_mode").notNull().default("coil"),
		pumpCoilAddress: integer("pump_coil_address"),
		pumpRegisterAddress: integer("pump_register_address"),
		pumpRegisterOnValue: integer("pump_register_on_value").notNull().default(1),
		pumpRegisterOffValue: integer("pump_register_off_value").notNull().default(0),
		lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true }),
		lastReadingAt: timestamp("last_reading_at", { withTimezone: true }),
		lastErrorStage: text("last_error_stage"),
		lastErrorMessage: text("last_error_message"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("plcs_site_id_idx").on(table.siteId)],
);

export const agentTokens = pgTable(
	"agent_tokens",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		plcId: uuid("plc_id")
			.notNull()
			.references(() => plcs.id, { onDelete: "cascade" }),
		tokenHash: text("token_hash").notNull().unique(),
		tokenPrefix: text("token_prefix").notNull(),
		name: text("name").notNull().default("Local bridge"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
		revokedAt: timestamp("revoked_at", { withTimezone: true }),
	},
	(table) => [index("agent_tokens_plc_id_idx").on(table.plcId)],
);

export const plcReadings = pgTable(
	"plc_readings",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		plcId: uuid("plc_id")
			.notNull()
			.references(() => plcs.id, { onDelete: "cascade" }),
		value: integer("value").notNull(),
		raw: jsonb("raw").$type<number[]>().notNull().default([]),
		readAt: timestamp("read_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index("plc_readings_plc_id_read_at_idx").on(table.plcId, table.readAt)],
);

export const pumpCommands = pgTable(
	"pump_commands",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		plcId: uuid("plc_id")
			.notNull()
			.references(() => plcs.id, { onDelete: "cascade" }),
		requestedByUserId: text("requested_by_user_id").references(() => user.id, { onDelete: "set null" }),
		enabled: boolean("enabled").notNull(),
		mode: pumpControlMode("mode").notNull(),
		address: integer("address").notNull(),
		status: pumpCommandStatus("status").notNull().default("queued"),
		agentError: text("agent_error"),
		requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
		sentAt: timestamp("sent_at", { withTimezone: true }),
		acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
	},
	(table) => [
		index("pump_commands_plc_status_idx").on(table.plcId, table.status),
		index("pump_commands_requested_at_idx").on(table.requestedAt),
	],
);

export const scheduleRules = pgTable(
	"schedule_rules",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		plcId: uuid("plc_id")
			.notNull()
			.references(() => plcs.id, { onDelete: "cascade" }),
		createdByUserId: text("created_by_user_id").references(() => user.id, { onDelete: "set null" }),
		name: text("name").notNull(),
		enabled: boolean("enabled").notNull().default(true),
		dryRun: boolean("dry_run").notNull().default(true),
		daysOfWeek: jsonb("days_of_week").$type<number[]>().notNull().default([1, 2, 3, 4, 5]),
		startMinute: integer("start_minute").notNull(),
		durationMinutes: integer("duration_minutes").notNull().default(5),
		timezone: text("timezone").notNull().default("Europe/Prague"),
		lastGeneratedAt: timestamp("last_generated_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("schedule_rules_plc_enabled_idx").on(table.plcId, table.enabled),
		index("schedule_rules_created_by_idx").on(table.createdByUserId),
	],
);

export const scheduleRuns = pgTable(
	"schedule_runs",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		scheduleRuleId: uuid("schedule_rule_id")
			.notNull()
			.references(() => scheduleRules.id, { onDelete: "cascade" }),
		plcId: uuid("plc_id")
			.notNull()
			.references(() => plcs.id, { onDelete: "cascade" }),
		pumpCommandId: uuid("pump_command_id").references(() => pumpCommands.id, { onDelete: "set null" }),
		action: scheduleAction("action").notNull(),
		status: scheduleRunStatus("status").notNull(),
		dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
		message: text("message"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("schedule_runs_plc_due_idx").on(table.plcId, table.dueAt),
		index("schedule_runs_rule_idx").on(table.scheduleRuleId),
		uniqueIndex("schedule_runs_rule_due_action_idx").on(table.scheduleRuleId, table.dueAt, table.action),
	],
);

export type Plc = typeof plcs.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type PumpCommand = typeof pumpCommands.$inferSelect;
export type ScheduleRule = typeof scheduleRules.$inferSelect;
export type ScheduleRun = typeof scheduleRuns.$inferSelect;
