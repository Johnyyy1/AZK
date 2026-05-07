"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type PumpStatus = {
	configured: boolean;
	mode: string | null;
	address: number | null;
	connected: boolean;
	lastError: {
		stage: string;
		message: string;
		timestamp: number;
	} | null;
	lastCommand: {
		enabled: boolean;
		mode: string;
		address: number;
		timestamp: number;
	} | null;
};

const formatTimestamp = (timestamp: number | null | undefined) => {
	if (!timestamp) return "No command sent yet";

	return new Intl.DateTimeFormat("cs-CZ", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(timestamp);
};

export default function PumpControlCard() {
	const [status, setStatus] = useState<PumpStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState<"on" | "off" | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const loadStatus = useCallback(async () => {
		try {
			const response = await fetch("/api/logo/pump", { cache: "no-store" });
			const data = (await response.json()) as PumpStatus & { message?: string };

			if (!response.ok) {
				throw new Error(data.message ?? "Failed to load pump status.");
			}

			setStatus(data);
			setMessage(null);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Failed to load pump status.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const initialLoad = window.setTimeout(() => {
			void loadStatus();
		}, 0);

		const timer = window.setInterval(() => {
			void loadStatus();
		}, 5000);

		return () => {
			window.clearTimeout(initialLoad);
			window.clearInterval(timer);
		};
	}, [loadStatus]);

	const sendCommand = useCallback(
		async (enabled: boolean) => {
			setSubmitting(enabled ? "on" : "off");
			setMessage(null);

			try {
				const response = await fetch("/api/logo/pump", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ enabled }),
				});
				const data = (await response.json()) as {
					message?: string;
				};

				if (!response.ok) {
					throw new Error(data.message ?? "Pump command failed.");
				}

				setMessage(enabled ? "Pump start command sent." : "Pump stop command sent.");
				await loadStatus();
			} catch (error) {
				setMessage(error instanceof Error ? error.message : "Pump command failed.");
			} finally {
				setSubmitting(null);
			}
		},
		[loadStatus]
	);

	const statusLabel = useMemo(() => {
		if (loading) return "Loading";
		if (status?.lastCommand?.enabled) return "Pump requested ON";
		if (status?.lastCommand) return "Pump requested OFF";
		return "Ready";
	}, [loading, status]);

	return (
		<section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div className="max-w-2xl">
					<p className="eyebrow text-[8px] text-paper-soft/46">Pump control</p>
					<h2 className="mt-3 font-display text-4xl text-paper-soft">Manual cerpadlo control from the dashboard.</h2>
					<p className="mt-4 max-w-xl text-sm leading-7 text-paper-soft/72">
						This sends a live Modbus command through the local backend. For safety, wire the command to a writable
						LOGO marker or register that your PLC logic uses as a manual override.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onClick={() => void sendCommand(true)}
						disabled={submitting !== null || !status?.configured}
						className="atlas-button rounded-full px-6 py-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting === "on" ? "Starting..." : "Turn pump on"}
					</button>
					<button
						type="button"
						onClick={() => void sendCommand(false)}
						disabled={submitting !== null || !status?.configured}
						className="rounded-full border border-paper-soft/18 bg-paper-soft/8 px-6 py-4 text-sm text-paper-soft transition hover:bg-paper-soft/12 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting === "off" ? "Stopping..." : "Turn pump off"}
					</button>
				</div>
			</div>

			<div className="mt-6 grid gap-3 md:grid-cols-4">
				{[
					["Backend", status?.connected ? "Online" : "Offline"],
					["Mapping", status?.configured ? `${status.mode} ${status.address}` : "Not configured"],
					["Command", statusLabel],
					["Last action", formatTimestamp(status?.lastCommand?.timestamp)],
				].map(([label, value]) => (
					<div key={label} className="rounded-[1.3rem] border border-paper-soft/10 bg-paper-soft/6 px-4 py-4">
						<p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
						<p className="mt-2 text-sm text-paper-soft">{value}</p>
					</div>
				))}
			</div>

			{message ? <p className="mt-5 text-sm text-paper-soft">{message}</p> : null}
			{status?.lastError ? (
				<p className="mt-3 text-sm text-clay">Last backend error: {status.lastError.message}</p>
			) : null}
			{status && !status.configured ? (
				<p className="mt-3 text-sm text-paper-soft/72">
					Set `PUMP_COIL_ADDRESS` or `PUMP_REGISTER_ADDRESS` in `C:\Users\jonas\AZK\backend` before using the
					button.
				</p>
			) : null}
		</section>
	);
}
