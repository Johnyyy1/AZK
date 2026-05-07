# AquaSmart

AquaSmart is a Next.js dashboard plus a small Bun-powered TypeScript backend for communicating with a Siemens LOGO! PLC over Modbus TCP.

This project currently does two main things:

- reads moisture data from the LOGO!
- lets the dashboard manually switch the pump (`Cerpadlo`) on and off

## How the communication works

There are three layers:

1. `frontend` - Next.js app in `C:\Users\jonas\AZK`
2. `backend` - Bun + TypeScript Modbus bridge in `C:\Users\jonas\AZK\backend`
3. `PLC` - Siemens LOGO! 8.4

Flow:

```text
Dashboard button
  -> Next.js route /api/logo/pump
  -> local backend http://127.0.0.1:4001/api/pump
  -> Modbus TCP write to LOGO!
  -> LOGO! marker M1
  -> OR block B007
  -> output Q1 (Cerpadlo)
```

For reading moisture:

```text
LOGO! holding register
  -> backend reads with Modbus TCP
  -> backend exposes /api/moisture and /api/health
  -> frontend can show the current state
```

## Current PLC logic

The pump output is controlled like this:

```text
Automatic logic from B006 ----\
                               B007 (>1 / OR) ---- Q1
Manual command M1 -----------/
```

That means:

- the automatic logic can start the pump
- the website can also start the pump by writing to `M1`
- the website must also be able to write `M1 = 0`, otherwise the pump would stay on

## Current Modbus mapping

From the LOGO! Modbus address space:

- `M 1-64` maps to `Coil 8257-8320`
- in practice, this project uses `PUMP_COIL_ADDRESS=8256`

The working value for the website pump control is:

```env
PUMP_COIL_ADDRESS=8256
```

This is because the Modbus client uses addressing that ended up needing the `M1` coil offset by one in this setup.

## Important files

- `C:\Users\jonas\AZK\app\api\logo\pump\route.ts` - frontend API proxy to the local backend
- `C:\Users\jonas\AZK\app\components\PumpControlCard.tsx` - dashboard pump control card
- `C:\Users\jonas\AZK\backend\scripts\logoCommunication.ts` - Modbus TCP connection, reading, and pump writes
- `C:\Users\jonas\AZK\backend\.env` - backend runtime configuration
- `C:\Users\jonas\AZK\.env.local` - frontend runtime configuration

## Environment configuration

### Backend

Backend config is loaded automatically from `C:\Users\jonas\AZK\backend\.env`.

Current values:

```env
LOGO_IP=192.168.0.3
LOGO_PORT=502
UNIT_ID=1
API_PORT=4001
REGISTER_OFFSET=0
REGISTER_COUNT=1
PUMP_COIL_ADDRESS=8256
```

### Frontend

Frontend config is loaded from `C:\Users\jonas\AZK\.env.local`.

Current value:

```env
LOGO_BACKEND_URL=http://127.0.0.1:4001
```

## Docker setup

The repository now includes a full Docker setup for both services:

- `Dockerfile` - production image for the Next.js frontend
- `backend/Dockerfile` - Bun image for the Modbus bridge
- `compose.yaml` - runs both containers together
- `docker.env.example` - example Compose environment file

Both containers install dependencies from lockfiles:

- frontend uses `npm ci` with the root `package-lock.json`
- backend uses `npm ci --omit=dev --omit=optional` with `backend/package-lock.json`, then runs with Bun

### Docker environment

Create a Compose env file from the example:

```powershell
cd C:\Users\jonas\AZK
Copy-Item docker.env.example .env
```

Set at least the PLC connection values in `.env`:

```env
LOGO_IP=192.168.0.3
LOGO_PORT=502
UNIT_ID=1
PUMP_COIL_ADDRESS=8256
```

Notes:

- `LOGO_BACKEND_URL` should stay `http://backend:4000` when the frontend runs inside Compose
- `BACKEND_PORT` only affects the host port mapping; inside the Docker network the backend still listens on `4000`

### Start with Docker Compose

```powershell
cd C:\Users\jonas\AZK
docker compose up --build
```

Then open:

- [http://localhost:3000](http://localhost:3000)
- [http://localhost:3000/dashboard/controls](http://localhost:3000/dashboard/controls)

The backend will also be available on the host at:

- [http://localhost:4000/api/health](http://localhost:4000/api/health)
- [http://localhost:4000/api/pump](http://localhost:4000/api/pump)

Stop everything with:

```powershell
docker compose down
```

## How to start the project

Install dependencies with Bun from the repo root:

```powershell
cd C:\Users\jonas\AZK
bun install
```

Open two terminals.

### Terminal 1 - backend

```powershell
cd C:\Users\jonas\AZK
bun run backend:start
```

Expected output:

- `HTTP API ready on port 4001`
- `Connected to LOGO at 192.168.0.3:502`
- periodic moisture read logs

### Terminal 2 - frontend

```powershell
cd C:\Users\jonas\AZK
bun run dev
```

Then open:

- [http://localhost:3000/dashboard/controls](http://localhost:3000/dashboard/controls)

## How to use the pump control

On the dashboard controls page:

- click `Turn pump on` to write `true` to the configured pump coil
- click `Turn pump off` to write `false` to the configured pump coil

The dashboard calls:

- `GET /api/logo/pump` for status
- `POST /api/logo/pump` for commands

The backend then calls Modbus:

- `writeCoil(8256, true)` for ON
- `writeCoil(8256, false)` for OFF

## Backend API

The local backend exposes:

- `GET /api/health` - connection state, latest error, latest reading
- `GET /api/moisture` - full monitor state including moisture data
- `GET /api/pump` - pump control configuration and last pump command
- `POST /api/pump` - sends pump ON/OFF command

Example:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:4001/api/pump" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"enabled":true}'
```

## Common problems

### Port already in use

If backend start fails with:

```text
listen EADDRINUSE
```

then another process is already using that port.

Find and stop it:

```powershell
Get-NetTCPConnection -LocalPort 4001
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4001).OwningProcess -Force
```

### Frontend does not load

The project uses:

```json
"dev": "next dev --webpack"
```

This is intentional. Webpack mode is currently more stable here than Turbopack on this Windows setup.

The production build also uses webpack for the same reason:

```json
"build": "next build --webpack"
```

### Button says "command sent" but pump does not switch

Check these in order:

1. backend is running
2. LOGO! is reachable at `192.168.0.3`
3. `M1` is still wired into `B007`
4. `PUMP_COIL_ADDRESS=8256`
5. LOGO! project with the `M1 -> B007 -> Q1` logic is uploaded to the PLC

### LOGO! connection fails

Check:

- PLC IP address
- Modbus TCP enabled on the LOGO!
- same network/subnet as the PC
- port `502` reachable

Helpful commands:

```powershell
ping 192.168.0.3
Test-NetConnection 192.168.0.3 -Port 502
```

## Validation commands

Frontend:

```powershell
cd C:\Users\jonas\AZK
bun run lint
```

Full workspace typecheck:

```powershell
cd C:\Users\jonas\AZK
bun run typecheck
```

Docker Compose config check:

```powershell
cd C:\Users\jonas\AZK
docker compose config
```

Backend runtime check:

```powershell
cd C:\Users\jonas\AZK
bun run backend:test:logo
```

## Notes for future changes

- If you change the manual override bit in LOGO! from `M1` to another marker, update `PUMP_COIL_ADDRESS` in `backend\.env`
- If backend port changes, also update `LOGO_BACKEND_URL` in `.env.local`
- If you move from coil control to holding register control, replace `PUMP_COIL_ADDRESS` with `PUMP_REGISTER_ADDRESS`
