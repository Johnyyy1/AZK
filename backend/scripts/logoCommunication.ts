import http, {
	type IncomingMessage,
	type ServerResponse,
} from "node:http";
import ModbusRTU from "modbus-serial";

type PumpControlMode = "coil" | "register";

interface PumpCommand {
	enabled: boolean;
	mode: PumpControlMode;
	address: number;
	timestamp: number;
}

interface Reading {
	value: number;
	timestamp: number;
	raw: number[];
}

interface ReadRegisterResult {
	data: number[];
}

interface MonitorError {
	stage: "connect" | "read" | "write";
	message: string;
	timestamp: number;
}

interface PumpControlConfig {
	mode: PumpControlMode | null;
	address: number | null;
	registerOnValue: number;
	registerOffValue: number;
}

interface MonitorConfig {
	logoIp: string;
	logoPort: number;
	unitId: number;
	readIntervalMs: number;
	apiPort: number;
	registerOffset: number;
	registerCount: number;
	pumpControl: PumpControlConfig;
	baseReconnectDelayMs: number;
	maxReconnectDelayMs: number;
}

interface MonitorState {
	config: {
		logoIp: string;
		logoPort: number;
		unitId: number;
		registerOffset: number;
		registerCount: number;
		readIntervalMs: number;
	};
	pumpControl: {
		configured: boolean;
		mode: PumpControlMode | null;
		address: number | null;
		lastCommand: PumpCommand | null;
	};
	connected: boolean;
	reconnectAttempts: number;
	latestReading: Reading | null;
	lastError: MonitorError | null;
}

interface PumpCommandPayload {
	enabled?: boolean;
}

const toNumber = (value: string | undefined, fallback: number): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: string | undefined): number | null => {
	if (value === undefined || value === null || value === "") return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

const pumpCoilAddress = toOptionalNumber(process.env.PUMP_COIL_ADDRESS);
const pumpRegisterAddress = toOptionalNumber(process.env.PUMP_REGISTER_ADDRESS);
const configuredPumpMode =
	(process.env.PUMP_WRITE_MODE as PumpControlMode | undefined) ??
	(pumpCoilAddress !== null
		? "coil"
		: pumpRegisterAddress !== null
			? "register"
			: null);

const config: MonitorConfig = {
	logoIp: process.env.LOGO_IP || "192.168.0.3",
	logoPort: toNumber(process.env.LOGO_PORT, 502),
	unitId: toNumber(process.env.UNIT_ID, 1),
	readIntervalMs: Math.max(100, toNumber(process.env.READ_INTERVAL_MS, 2000)),
	apiPort: toNumber(process.env.API_PORT, 4000),
	registerOffset: toNumber(process.env.REGISTER_OFFSET, 0),
	registerCount: Math.max(1, toNumber(process.env.REGISTER_COUNT, 1)),
	pumpControl: {
		mode: configuredPumpMode,
		address:
			configuredPumpMode === "register"
				? pumpRegisterAddress
				: configuredPumpMode === "coil"
					? pumpCoilAddress
					: null,
		registerOnValue: toNumber(process.env.PUMP_REGISTER_ON_VALUE, 1),
		registerOffValue: toNumber(process.env.PUMP_REGISTER_OFF_VALUE, 0),
	},
	baseReconnectDelayMs: 1000,
	maxReconnectDelayMs: 30_000,
};

const log = (...messageParts: unknown[]): void => {
	console.log("[logo-backend]", ...messageParts);
};

class LogoMonitor {
	private readonly config: MonitorConfig;

	private running = false;

	private client: ModbusRTU | null = null;

	private latestReading: Reading | null = null;

	private lastError: MonitorError | null = null;

	private connected = false;

	private reconnectAttempts = 0;

	private loopPromise: Promise<void> | null = null;

	private operationQueue: Promise<unknown> = Promise.resolve();

	private lastPumpCommand: PumpCommand | null = null;

	constructor(settings: MonitorConfig) {
		this.config = settings;
	}

	start(): Promise<void> | null {
		if (this.running) return this.loopPromise;
		this.running = true;
		this.loopPromise = this.monitorLoop();
		return this.loopPromise;
	}

	async stop(): Promise<void> {
		if (!this.running) return;
		this.running = false;
		this.connected = false;
		this.closeClient();

		if (this.loopPromise) {
			await this.loopPromise;
		}
	}

	getState(): MonitorState {
		return {
			config: {
				logoIp: this.config.logoIp,
				logoPort: this.config.logoPort,
				unitId: this.config.unitId,
				registerOffset: this.config.registerOffset,
				registerCount: this.config.registerCount,
				readIntervalMs: this.config.readIntervalMs,
			},
			pumpControl: {
				configured:
					Boolean(this.config.pumpControl.mode) &&
					Number.isInteger(this.config.pumpControl.address),
				mode: this.config.pumpControl.mode,
				address: this.config.pumpControl.address,
				lastCommand: this.lastPumpCommand,
			},
			connected: this.connected,
			reconnectAttempts: this.reconnectAttempts,
			latestReading: this.latestReading,
			lastError: this.lastError,
		};
	}

	private closeClient(): void {
		if (!this.client) return;

		try {
			this.client.close(() => undefined);
		} catch (error) {
			log("Closing Modbus client failed:", getErrorMessage(error));
		} finally {
			this.client = null;
		}
	}

	private resetClient(): void {
		this.closeClient();
		this.client = new ModbusRTU();
	}

	private async ensureConnected(): Promise<ModbusRTU> {
		if (!this.connected) {
			await this.connectWithBackoff();
		}

		if (!this.connected || !this.client) {
			throw new Error("LOGO connection is not available");
		}

		return this.client;
	}

	private queueClientOperation<T>(
		actionName: MonitorError["stage"],
		operation: (client: ModbusRTU) => Promise<T>,
	): Promise<T> {
		const task = this.operationQueue.catch(() => undefined).then(async () => {
			const client = await this.ensureConnected();
			return operation(client);
		});

		this.operationQueue = task.then(
			() => undefined,
			() => undefined,
		);

		return task.catch((error: unknown) => {
			this.connected = false;
			this.lastError = {
				stage: actionName,
				message: getErrorMessage(error),
				timestamp: Date.now(),
			};
			throw error;
		});
	}

	private async connectWithBackoff(): Promise<void> {
		while (this.running && !this.connected) {
			this.reconnectAttempts += 1;
			this.resetClient();

			try {
				if (!this.client) {
					throw new Error("Modbus client was not initialized");
				}

				await this.client.connectTCP(this.config.logoIp, {
					port: this.config.logoPort,
				});
				this.client.setID(this.config.unitId);
				this.connected = true;
				this.reconnectAttempts = 0;
				this.lastError = null;
				log(
					`Connected to LOGO at ${this.config.logoIp}:${this.config.logoPort} (unit ${this.config.unitId})`,
				);
				break;
			} catch (error) {
				this.connected = false;
				this.lastError = {
					stage: "connect",
					message: getErrorMessage(error),
					timestamp: Date.now(),
				};

				const backoff = Math.min(
					this.config.baseReconnectDelayMs *
						2 ** (this.reconnectAttempts - 1),
					this.config.maxReconnectDelayMs,
				);

				log(
					`Connection attempt ${this.reconnectAttempts} failed (${getErrorMessage(error)}). Retrying in ${backoff / 1000}s.`,
				);
				await delay(backoff);
			}
		}
	}

	async writePumpState(enabled: boolean): Promise<PumpCommand> {
		const { mode, address, registerOnValue, registerOffValue } =
			this.config.pumpControl;
		const resolvedAddress = address;

		if (!mode || resolvedAddress === null || !Number.isInteger(resolvedAddress)) {
			throw new Error(
				"Pump control is not configured. Set PUMP_COIL_ADDRESS or PUMP_REGISTER_ADDRESS for a writable LOGO marker.",
			);
		}

		await this.queueClientOperation("write", async (client) => {
			if (mode === "coil") {
				await client.writeCoil(resolvedAddress, enabled);
				return;
			}

			if (mode === "register") {
				await client.writeRegister(
					resolvedAddress,
					enabled ? registerOnValue : registerOffValue,
				);
				return;
			}

			throw new Error(`Unsupported pump control mode: ${mode}`);
		});

		const command: PumpCommand = {
			enabled,
			mode,
			address: resolvedAddress,
			timestamp: Date.now(),
		};
		this.lastPumpCommand = command;
		this.lastError = null;

		log(
			`Pump command sent: ${enabled ? "ON" : "OFF"} via ${mode} ${resolvedAddress}`,
		);

		return command;
	}

	private async monitorLoop(): Promise<void> {
		while (this.running) {
			try {
				const registers = await this.queueClientOperation(
					"read",
					(client) =>
						client.readHoldingRegisters(
							this.config.registerOffset,
							this.config.registerCount,
						),
				);
				this.updateReading(registers);
			} catch (error) {
				log("Read error:", getErrorMessage(error));
			}

			await delay(this.config.readIntervalMs);
		}
	}

	private updateReading(registers: ReadRegisterResult): void {
		const value = Array.isArray(registers.data) ? registers.data[0] : null;

		if (value === null || value === undefined) {
			throw new Error("Modbus response did not contain register data");
		}

		const reading: Reading = {
			value,
			timestamp: Date.now(),
			raw: registers.data,
		};

		this.latestReading = reading;
		this.lastError = null;
		log(
			`Moisture: ${reading.value} (read at ${new Date(reading.timestamp).toISOString()})`,
		);
	}
}

const monitor = new LogoMonitor(config);
monitor.start()?.catch((error: unknown) => {
	log("Monitor failed:", getErrorMessage(error));
});

const jsonResponse = (
	response: ServerResponse,
	status: number,
	payload: unknown,
): void => {
	response.writeHead(status, { "Content-Type": "application/json" });
	response.end(JSON.stringify(payload));
};

const readJsonBody = (
	request: IncomingMessage,
): Promise<PumpCommandPayload> =>
	new Promise((resolve, reject) => {
		let rawBody = "";

		request.on("data", (chunk: Buffer | string) => {
			rawBody += chunk.toString();
		});

		request.on("end", () => {
			if (!rawBody) {
				resolve({});
				return;
			}

			try {
				resolve(JSON.parse(rawBody) as PumpCommandPayload);
			} catch {
				reject(new Error("Request body must be valid JSON"));
			}
		});

		request.on("error", reject);
	});

const server = http.createServer(
	async (request: IncomingMessage, response: ServerResponse) => {
		const requestUrl = new URL(
			request.url || "/",
			`http://${request.headers.host || "localhost"}`,
		);

		if (request.method === "GET" && requestUrl.pathname === "/api/moisture") {
			jsonResponse(response, 200, {
				...monitor.getState(),
				serverTime: new Date().toISOString(),
			});
			return;
		}

		if (request.method === "GET" && requestUrl.pathname === "/api/health") {
			const state = monitor.getState();
			jsonResponse(response, 200, {
				connected: state.connected,
				lastError: state.lastError,
				latestReading: state.latestReading,
				serverTime: new Date().toISOString(),
			});
			return;
		}

		if (request.method === "GET" && requestUrl.pathname === "/api/pump") {
			const state = monitor.getState();
			jsonResponse(response, 200, {
				...state.pumpControl,
				connected: state.connected,
				lastError: state.lastError,
				serverTime: new Date().toISOString(),
			});
			return;
		}

		if (request.method === "POST" && requestUrl.pathname === "/api/pump") {
			try {
				const payload = await readJsonBody(request);

				if (typeof payload.enabled !== "boolean") {
					jsonResponse(response, 400, {
						message: "Body must include an 'enabled' boolean.",
					});
					return;
				}

				const command = await monitor.writePumpState(payload.enabled);
				jsonResponse(response, 200, {
					ok: true,
					command,
					connected: monitor.getState().connected,
					serverTime: new Date().toISOString(),
				});
				return;
			} catch (error) {
				jsonResponse(response, 500, {
					ok: false,
					message: getErrorMessage(error),
					connected: monitor.getState().connected,
					lastError: monitor.getState().lastError,
					serverTime: new Date().toISOString(),
				});
				return;
			}
		}

		jsonResponse(response, 404, { message: "Not found" });
	},
);

server.listen(config.apiPort, () => {
	log(`HTTP API ready on port ${config.apiPort}`);
});

let shuttingDown = false;

const closeServer = (): Promise<void> =>
	new Promise((resolve, reject) => {
		server.close((error) => {
			if (error) {
				reject(error);
				return;
			}

			resolve();
		});
	});

const shutdown = async (): Promise<void> => {
	if (shuttingDown) return;
	shuttingDown = true;
	log("Shutting down backend...");

	try {
		await monitor.stop();
		await closeServer();
		log("Shutdown complete.");
		process.exit(0);
	} catch (error) {
		log("Shutdown failed:", getErrorMessage(error));
		process.exit(1);
	}
};

process.on("SIGINT", () => {
	void shutdown();
});
process.on("SIGTERM", () => {
	void shutdown();
});
process.on("uncaughtException", (error: Error) => {
	log("Uncaught exception:", getErrorMessage(error));
	void shutdown();
});
process.on("unhandledRejection", (error: unknown) => {
	log("Unhandled rejection:", getErrorMessage(error));
});
