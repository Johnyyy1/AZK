CREATE TYPE "public"."schedule_action" AS ENUM('pump_on', 'pump_off');--> statement-breakpoint
CREATE TYPE "public"."schedule_run_status" AS ENUM('previewed', 'queued', 'skipped', 'failed');--> statement-breakpoint
CREATE TABLE "schedule_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plc_id" uuid NOT NULL,
	"created_by_user_id" text,
	"name" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"dry_run" boolean DEFAULT true NOT NULL,
	"days_of_week" jsonb DEFAULT '[1,2,3,4,5]'::jsonb NOT NULL,
	"start_minute" integer NOT NULL,
	"duration_minutes" integer DEFAULT 5 NOT NULL,
	"timezone" text DEFAULT 'Europe/Prague' NOT NULL,
	"last_generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_rule_id" uuid NOT NULL,
	"plc_id" uuid NOT NULL,
	"pump_command_id" uuid,
	"action" "schedule_action" NOT NULL,
	"status" "schedule_run_status" NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule_rules" ADD CONSTRAINT "schedule_rules_plc_id_plcs_id_fk" FOREIGN KEY ("plc_id") REFERENCES "public"."plcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_rules" ADD CONSTRAINT "schedule_rules_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_runs" ADD CONSTRAINT "schedule_runs_schedule_rule_id_schedule_rules_id_fk" FOREIGN KEY ("schedule_rule_id") REFERENCES "public"."schedule_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_runs" ADD CONSTRAINT "schedule_runs_plc_id_plcs_id_fk" FOREIGN KEY ("plc_id") REFERENCES "public"."plcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_runs" ADD CONSTRAINT "schedule_runs_pump_command_id_pump_commands_id_fk" FOREIGN KEY ("pump_command_id") REFERENCES "public"."pump_commands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedule_rules_plc_enabled_idx" ON "schedule_rules" USING btree ("plc_id","enabled");--> statement-breakpoint
CREATE INDEX "schedule_rules_created_by_idx" ON "schedule_rules" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "schedule_runs_plc_due_idx" ON "schedule_runs" USING btree ("plc_id","due_at");--> statement-breakpoint
CREATE INDEX "schedule_runs_rule_idx" ON "schedule_runs" USING btree ("schedule_rule_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_runs_rule_due_action_idx" ON "schedule_runs" USING btree ("schedule_rule_id","due_at","action");