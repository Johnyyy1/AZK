/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const { EventEmitter } = require("events");
const ModbusRTU = require("modbus-serial");

const toNumber = (value, fallback) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const config = {
	logoIp: process.env.LOGO_IP || "192.168.0.3",
	logoPort: toNumber(process.env.LOGO_PORT, 502),
	unitId: toNumber(process.env.UNIT_ID, 1),
	readIntervalMs: Math.max(100, toNumber(process.env.READ_INTERVAL_MS, 2000)),
	apiPort: toNumber(process.env.API_PORT, 4000),
	registerOffset: toNumber(process.env.REGISTER_OFFSET, 0),
	registerCount: Math.max(1, toNumber(process.env.REGISTER_COUNT, 1)),
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

	async monitorLoop() {
		while (this.running) {
			if (!this.connected) {
				await this.connectWithBackoff();
			}

			if (!this.running) break;

			if (!this.connected) {
				await delay(this.config.readIntervalMs);
				continue;
			}

			try {
				const registers = await this.client.readHoldingRegisters(
					this.config.registerOffset,
					this.config.registerCount
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
				this.connected = false;
				this.lastError = {
					stage: "read",
					message: error?.message ?? "Unknown error",
					timestamp: Date.now(),
				};
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

const server = http.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/moisture") {
		jsonResponse(res, 200, {
			...monitor.getState(),
			serverTime: new Date().toISOString(),
		});
		return;
	}

	if (req.method === "GET" && req.url === "/api/health") {
		const state = monitor.getState();
		jsonResponse(res, 200, {
			connected: state.connected,
			lastError: state.lastError,
			latestReading: state.latestReading,
			serverTime: new Date().toISOString(),
		});
		return;
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
