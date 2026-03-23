/* eslint-disable @typescript-eslint/no-require-imports */
const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();

const LOGO_IP = "192.168.0.3";
const PORT = 502;
const UNIT_ID = 1;

async function run() {
	try {
		await client.connectTCP(LOGO_IP, { port: PORT });
		client.setID(UNIT_ID);

		console.log(`Connected to LOGO at ${LOGO_IP}:${PORT} (unit ${UNIT_ID})`);

		setInterval(async () => {
			try {
				const data = await client.readHoldingRegisters(0, 1);
				console.log("Moisture:", data.data[0]);
			} catch (error) {
				console.error("Read error:", error.message);
			}
		}, 2000);
	} catch (error) {
		console.error("Connection error:", error.message);
	}
}

run();
