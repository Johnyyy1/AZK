import Link from "next/link";
import {
	createScheduleRuleAction,
	deleteScheduleRuleAction,
	setScheduleDryRunAction,
	toggleScheduleRuleAction,
} from "@/app/actions/schedules";
import { formatDateTime, isAgentOnline } from "@/app/lib/dashboard-data";
import {
	getSchedulingData,
	minutesToTime,
	nextWindowLabel,
	ruleDaysLabel,
	weekdayOptions,
} from "@/app/lib/scheduling";
import { requireSession } from "@/app/lib/session";

type SchedulingPageProps = {
	searchParams: Promise<{
		error?: string;
		notice?: string;
	}>;
};

const statusClass = {
	previewed: "bg-sky/16 text-forest",
	queued: "bg-mint/24 text-forest",
	skipped: "bg-gold/24 text-forest-deep",
	failed: "bg-clay/12 text-clay",
} as const;

const actionLabel = {
	pump_on: "Pump ON",
	pump_off: "Pump OFF",
} as const;

function Feedback({ error, notice }: { error?: string; notice?: string }) {
	if (!error && !notice) return null;

	return (
		<div
			className={`mb-6 rounded-[1.4rem] border px-5 py-4 text-sm ${
				error ? "border-clay/24 bg-clay/10 text-clay" : "border-mint/24 bg-white/70 text-forest"
			}`}
		>
			{error ?? notice}
		</div>
	);
}

function ScheduleForm({ plcId, canManage }: { plcId: string | null; canManage: boolean }) {
	if (!plcId) {
		return (
			<section className="section-frame rounded-[2rem] p-6 md:p-7">
				<p className="eyebrow text-[8px] text-clay">Setup needed</p>
				<h2 className="mt-3 font-display text-4xl text-forest">Add a PLC before scheduling.</h2>
				<p className="mt-4 text-sm leading-7 text-ink-soft">
					Schedules are scoped to one Siemens LOGO bridge, so AquaSmart needs the pump mapping first.
				</p>
				<Link href="/dashboard/settings" className="atlas-button mt-6 rounded-full px-5 py-3 text-sm font-medium">
					Open settings
				</Link>
			</section>
		);
	}

	if (!canManage) {
		return (
			<section className="section-frame rounded-[2rem] p-6 md:p-7">
				<p className="eyebrow text-[8px] text-clay">Owner access</p>
				<h2 className="mt-3 font-display text-4xl text-forest">Automation changes are owner-only.</h2>
				<p className="mt-4 text-sm leading-7 text-ink-soft">
					You can inspect schedule state, but only a site owner can create or arm pump automation.
				</p>
			</section>
		);
	}

	return (
		<section className="section-frame rounded-[2rem] p-6 md:p-7">
			<p className="eyebrow text-[8px] text-clay">New automation rule</p>
			<h2 className="mt-3 font-display text-4xl text-forest">Create a bounded pump window.</h2>
			<form action={createScheduleRuleAction} className="mt-6 grid gap-4">
				<input type="hidden" name="plcId" value={plcId} />
				<label className="block">
					<span className="eyebrow text-[7px] text-ink-soft/58">Rule name</span>
					<input
						name="name"
						placeholder="Morning irrigation"
						className="mt-2 w-full rounded-[1.15rem] border border-ink/10 bg-white/70 px-4 py-3 outline-none transition focus:border-clay"
					/>
				</label>
				<div className="grid gap-4 sm:grid-cols-3">
					<label className="block">
						<span className="eyebrow text-[7px] text-ink-soft/58">Start</span>
						<input
							name="startTime"
							type="time"
							defaultValue="06:00"
							required
							className="mt-2 w-full rounded-[1.15rem] border border-ink/10 bg-white/70 px-4 py-3 outline-none transition focus:border-clay"
						/>
					</label>
					<label className="block">
						<span className="eyebrow text-[7px] text-ink-soft/58">Duration minutes</span>
						<input
							name="durationMinutes"
							type="number"
							min={1}
							max={180}
							defaultValue={5}
							className="mt-2 w-full rounded-[1.15rem] border border-ink/10 bg-white/70 px-4 py-3 outline-none transition focus:border-clay"
						/>
					</label>
					<label className="block">
						<span className="eyebrow text-[7px] text-ink-soft/58">Timezone</span>
						<input
							name="timezone"
							defaultValue="Europe/Prague"
							className="mt-2 w-full rounded-[1.15rem] border border-ink/10 bg-white/70 px-4 py-3 outline-none transition focus:border-clay"
						/>
					</label>
				</div>
				<div>
					<p className="eyebrow text-[7px] text-ink-soft/58">Days</p>
					<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
						{weekdayOptions.map((day) => (
							<label key={day.value} className="rounded-[1.1rem] border border-ink/10 bg-white/64 px-3 py-3 text-sm text-forest">
								<input
									type="checkbox"
									name="daysOfWeek"
									value={day.value}
									defaultChecked={day.value >= 1 && day.value <= 5}
									className="mr-2 accent-forest"
								/>
								{day.short}
							</label>
						))}
					</div>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<label className="rounded-[1.2rem] border border-ink/10 bg-white/64 px-4 py-3 text-sm text-forest">
						<input type="checkbox" name="enabled" defaultChecked className="mr-2 accent-forest" />
						Enabled
					</label>
					<label className="rounded-[1.2rem] border border-ink/10 bg-white/64 px-4 py-3 text-sm text-forest">
						<input type="checkbox" name="dryRun" defaultChecked className="mr-2 accent-forest" />
						Dry-run only
					</label>
				</div>
				<button className="atlas-button mt-2 rounded-full px-6 py-4 text-sm font-medium">
					Save schedule rule
				</button>
			</form>
		</section>
	);
}

export default async function SchedulingPage({ searchParams }: SchedulingPageProps) {
	const params = await searchParams;
	const session = await requireSession();
	const data = await getSchedulingData(session.user.id);
	const plc = data.primaryPlc;
	const canManage = data.role === "owner";
	const activeRules = data.rules.filter((rule) => rule.enabled);
	const armedRules = data.rules.filter((rule) => rule.enabled && !rule.dryRun);
	const dryRunRules = data.rules.filter((rule) => rule.dryRun);
	const online = plc ? isAgentOnline(plc.lastHeartbeatAt) : false;
	const nextRule = activeRules[0] ?? null;

	return (
		<main className="px-5 py-6 md:px-8 md:py-8">
			<Feedback error={params.error} notice={params.notice} />

			<header className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
				<div>
					<p className="eyebrow text-[9px] text-clay">Scheduling</p>
					<h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
						Automation rules are now backed by real schedule records.
					</h1>
				</div>
				<div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
					{plc
						? `${plc.name} is ${online ? "online" : "waiting for the local bridge"}. Schedules generate dry-run previews by default and only queue pump commands when explicitly armed.`
						: "Add a Siemens LOGO bridge before creating pump automation."}
				</div>
			</header>

			<section className="mb-8 grid gap-5 lg:grid-cols-4">
				{[
					["Selected PLC", plc?.name ?? "None"],
					["Active rules", String(activeRules.length)],
					["Dry-run rules", String(dryRunRules.length)],
					["Armed rules", String(armedRules.length)],
				].map(([label, value]) => (
					<div key={label} className="atlas-card rounded-[2rem] p-5">
						<p className="eyebrow text-[8px] text-clay">{label}</p>
						<p className="mt-3 break-words font-display text-3xl text-forest">{value}</p>
					</div>
				))}
			</section>

			<div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
				<div className="space-y-8">
					<ScheduleForm plcId={plc?.id ?? null} canManage={canManage} />

					<section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
						<p className="eyebrow text-[8px] text-paper-soft/46">Next automation window</p>
						<h2 className="mt-4 font-display text-4xl">
							{nextRule ? nextWindowLabel(nextRule) : "No active schedule yet."}
						</h2>
						<p className="mt-4 text-sm leading-7 text-paper-soft/72">
							{nextRule
								? `${nextRule.name} will run for ${nextRule.durationMinutes} minutes. ${nextRule.dryRun ? "It is still in dry-run mode." : "It can queue real pump commands."}`
								: "Create a dry-run rule first, then watch the bridge produce preview history before arming writes."}
						</p>
					</section>
				</div>

				<div className="space-y-8">
					<section className="section-frame rounded-[2rem] p-6 md:p-7">
						<p className="eyebrow text-[8px] text-clay">Rules</p>
						{data.rules.length === 0 ? (
							<div className="mt-5 rounded-[1.4rem] bg-white/70 p-5">
								<h2 className="font-display text-4xl text-forest">No schedule rules configured.</h2>
								<p className="mt-4 text-sm leading-7 text-ink-soft">
									The first saved rule will create a durable database record instead of a demo calendar.
								</p>
							</div>
						) : (
							<div className="mt-5 grid gap-4">
								{data.rules.map((rule) => (
									<article key={rule.id} className="rounded-[1.5rem] border border-ink/10 bg-white/72 p-5">
										<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<p className="eyebrow text-[7px] text-ink-soft/58">
													{rule.enabled ? "Enabled" : "Paused"} · {rule.dryRun ? "Dry-run" : "Armed"}
												</p>
												<h3 className="mt-2 font-display text-3xl text-forest">{rule.name}</h3>
												<p className="mt-2 text-sm leading-6 text-ink-soft">
													{ruleDaysLabel(rule.daysOfWeek)} at {minutesToTime(rule.startMinute)} for{" "}
													{rule.durationMinutes} minutes · {rule.timezone}
												</p>
											</div>
											<div className="rounded-full bg-forest-deep px-4 py-2 text-xs text-paper-soft">
												{rule.lastGeneratedAt ? formatDateTime(rule.lastGeneratedAt) : "No run yet"}
											</div>
										</div>

										{canManage ? (
											<div className="mt-5 flex flex-wrap gap-3">
												<form action={toggleScheduleRuleAction}>
													<input type="hidden" name="scheduleRuleId" value={rule.id} />
													<input type="hidden" name="enabled" value={String(!rule.enabled)} />
													<button className="rounded-full border border-forest/18 bg-white/80 px-4 py-2 text-sm text-forest">
														{rule.enabled ? "Pause" : "Enable"}
													</button>
												</form>
												<form action={setScheduleDryRunAction}>
													<input type="hidden" name="scheduleRuleId" value={rule.id} />
													<input type="hidden" name="dryRun" value={String(!rule.dryRun)} />
													<button className="rounded-full border border-clay/24 bg-white/80 px-4 py-2 text-sm text-clay">
														{rule.dryRun ? "Allow queued writes" : "Return to dry-run"}
													</button>
												</form>
												<form action={deleteScheduleRuleAction}>
													<input type="hidden" name="scheduleRuleId" value={rule.id} />
													<button className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm text-ink-soft">
														Delete
													</button>
												</form>
											</div>
										) : null}
									</article>
								))}
							</div>
						)}
					</section>

					<section className="section-frame rounded-[2rem] p-6 md:p-7">
						<p className="eyebrow text-[8px] text-clay">Generation history</p>
						{data.runs.length === 0 ? (
							<p className="mt-4 text-sm leading-7 text-ink-soft">
								No scheduler events have been generated yet. The local bridge creates history when it syncs during
								a due minute.
							</p>
						) : (
							<div className="mt-5 grid gap-3">
								{data.runs.map(({ run, ruleName }) => (
									<div key={run.id} className="rounded-[1.3rem] bg-white/72 p-4">
										<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<p className="eyebrow text-[7px] text-ink-soft/58">{ruleName}</p>
												<p className="mt-2 text-sm text-forest">
													{actionLabel[run.action]} · due {formatDateTime(run.dueAt)}
												</p>
												{run.message ? <p className="mt-2 text-sm leading-6 text-ink-soft">{run.message}</p> : null}
											</div>
											<span className={`rounded-full px-3 py-1 text-xs ${statusClass[run.status]}`}>{run.status}</span>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			</div>
		</main>
	);
}
