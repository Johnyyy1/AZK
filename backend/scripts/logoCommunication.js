/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const { EventEmitter } = require("events");
const ModbusRTU = require("modbus-serial");

const toNumber = (value, fallback) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value) => {
	if (value === undefined || value === null || value === "") return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pumpCoilAddress = toOptionalNumber(process.env.PUMP_COIL_ADDRESS);
const pumpRegisterAddress = toOptionalNumber(process.env.PUMP_REGISTER_ADDRESS);
const configuredPumpMode = process.env.PUMP_WRITE_MODE || (pumpCoilAddress !== null ? "coil" : pumpRegisterAddress !== null ? "register" : null);

const config = {
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

const log = (...messageParts) => {
	const prefix = "[logo-backend]";
	console.log(prefix, ...messageParts);
};

class LogoMonitor extends EventEmitter {
	constructor(settings) {
		super();
		this.config = settings;
		this.running = false;
		this.client = null;
		this.latestReading = null;
		this.lastError = null;
		this.connected = false;
		this.reconnectAttempts = 0;
		this.loopPromise = null;
		this.operationQueue = Promise.resolve();
		this.lastPumpCommand = null;
	}

	start() {
		if (this.running) return this.loopPromise;
		this.running = true;
		this.loopPromise = this.monitorLoop();
		return this.loopPromise;
	}

	async stop() {
		if (!this.running) return;
		this.running = false;
		this.connected = false;
		if (this.client) {
			try {
				this.client.close(() => {});
			} catch (error) {
				log("Error closing Modbus client:", error.message);
			}
		}
		if (this.loopPromise) {
			await this.loopPromise;
		}
	}

	getState() {
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

	resetClient() {
		if (this.client) {
			try {
				this.client.close(() => {});
			} catch (error) {
				log("Closing stale Modbus client failed:", error.message);
			}
		}
		this.client = new ModbusRTU();
	}

	async ensureConnected() {
		if (!this.connected) {
			await this.connectWithBackoff();
		}

		if (!this.connected || !this.client) {
			throw new Error("LOGO connection is not available");
		}
	}

	queueClientOperation(actionName, operation) {
		const task = this.operationQueue.catch(() => undefined).then(async () => {
			await this.ensureConnected();
			return operation(this.client);
		});

		this.operationQueue = task.catch(() => undefined);
		return task.catch((error) => {
			this.connected = false;
			this.lastError = {
				stage: actionName,
				message: error?.message ?? "Unknown error",
				timestamp: Date.now(),
			};
			throw error;
		});
	}

	async connectWithBackoff() {
		while (this.running && !this.connected) {
			this.reconnectAttempts += 1;
			this.resetClient();
			try {
				await this.client.connectTCP(this.config.logoIp, { port: this.config.logoPort });
				this.client.setID(this.config.unitId);
				this.connected = true;
				this.reconnectAttempts = 0;
				this.lastError = null;
				this.emit("connect");
				log(`Connected to LOGO at ${this.config.logoIp}:${this.config.logoPort} (unit ${this.config.unitId})`);
				break;
			} catch (error) {
				this.connected = false;
				this.lastError = {
					stage: "connect",
					message: error.message,
					timestamp: Date.now(),
				};
				const backoff = Math.min(
					this.config.baseReconnectDelayMs * 2 ** (this.reconnectAttempts - 1),
					this.config.maxReconnectDelayMs
				);
				log(`Connection attempt ${this.reconnectAttempts} failed (${error.message}). Retrying in ${backoff / 1000}s.`);
				await delay(backoff);
			}
		}
	}

	async writePumpState(enabled) {
		const { mode, address, registerOnValue, registerOffValue } = this.config.pumpControl;

		if (!mode || !Number.isInteger(address)) {
			throw new Error(
				"Pump control is not configured. Set PUMP_COIL_ADDRESS or PUMP_REGISTER_ADDRESS for a writable LOGO marker."
			);
		}

		await this.queueClientOperation("write", async (client) => {
			if (mode === "coil") {
				await client.writeCoil(address, enabled);
				return;
			}

			if (mode === "register") {
				await client.writeRegister(address, enabled ? registerOnValue : registerOffValue);
				return;
			}

			throw new Error(`Unsupported pump control mode: ${mode}`);
		});

		this.lastPumpCommand = {
			enabled,
			mode,
			address,
			timestamp: Date.now(),
		};
		this.lastError = null;

		log(
			`Pump command sent: ${enabled ? "ON" : "OFF"} via ${mode} ${address}`
		);

		return this.lastPumpCommand;
	}

	async monitorLoop() {
		while (this.running) {
			try {
				const registers = await this.queueClientOperation(
					"read",
					(client) =>
						client.readHoldingRegisters(
							this.config.registerOffset,
							this.config.registerCount
						)
				);
				const value = Array.isArray(registers?.data) ? registers.data[0] : null;

				if (value !== null) {
					const reading = {
						value,
						timestamp: Date.now(),
						raw: registers.data,
					};
					this.latestReading = reading;
					this.lastError = null;
					this.emit("reading", reading);
					log(`Moisture: ${reading.value} (read at ${new Date(reading.timestamp).toISOString()})`);
				} else {
					throw new Error("Modbus response did not contain register data");
				}
			} catch (error) {
				this.emit("error", error);
				log("Read error:", error?.message ?? error);
			}

			await delay(this.config.readIntervalMs);
		}
	}
}

const monitor = new LogoMonitor(config);
monitor.start().catch((error) => log("Monitor failed:", error?.message ?? error));

const jsonResponse = (res, status, payload) => {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(payload));
};

const readJsonBody = (req) =>
	new Promise((resolve, reject) => {
		let rawBody = "";

		req.on("data", (chunk) => {
			rawBody += chunk;
		});

		req.on("end", () => {
			if (!rawBody) {
				resolve({});
				return;
			}

			try {
				resolve(JSON.parse(rawBody));
			} catch {
				reject(new Error("Request body must be valid JSON"));
			}
		});

		req.on("error", reject);
	});

const server = http.createServer(async (req, res) => {
	const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

	if (req.method === "GET" && requestUrl.pathname === "/api/moisture") {
		jsonResponse(res, 200, {
			...monitor.getState(),
			serverTime: new Date().toISOString(),
		});
		return;
	}

	if (req.method === "GET" && requestUrl.pathname === "/api/health") {
		const state = monitor.getState();
		jsonResponse(res, 200, {
			connected: state.connected,
			lastError: state.lastError,
			latestReading: state.latestReading,
			serverTime: new Date().toISOString(),
		});
		return;
	}

	if (req.method === "GET" && requestUrl.pathname === "/api/pump") {
		jsonResponse(res, 200, {
			...monitor.getState().pumpControl,
			connected: monitor.getState().connected,
			lastError: monitor.getState().lastError,
			serverTime: new Date().toISOString(),
		});
		return;
	}

	if (req.method === "POST" && requestUrl.pathname === "/api/pump") {
		try {
			const payload = await readJsonBody(req);

			if (typeof payload.enabled !== "boolean") {
				jsonResponse(res, 400, {
					message: "Body must include an 'enabled' boolean.",
				});
				return;
			}

			const command = await monitor.writePumpState(payload.enabled);
			jsonResponse(res, 200, {
				ok: true,
				command,
				connected: monitor.getState().connected,
				serverTime: new Date().toISOString(),
			});
			return;
		} catch (error) {
			jsonResponse(res, 500, {
				ok: false,
				message: error?.message ?? "Pump command failed",
				connected: monitor.getState().connected,
				lastError: monitor.getState().lastError,
				serverTime: new Date().toISOString(),
			});
			return;
		}
	}

	jsonResponse(res, 404, { message: "Not found" });
});

server.listen(config.apiPort, () => {
	log(`HTTP API ready on port ${config.apiPort}`);
});

let shuttingDown = false;

const closeServer = () =>
	new Promise((resolve) => {
		server.close(() => resolve());
	});

const shutdown = async () => {
	if (shuttingDown) return;
	shuttingDown = true;
	log("Shutting down backend...");
	await monitor.stop();
	await closeServer();
	log("Shutdown complete.");
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (error) => {
	log("Uncaught exception:", error?.message ?? error);
	shutdown();
});
process.on("unhandledRejection", (error) => {
	log("Unhandled rejection:", error?.message ?? error);
});
