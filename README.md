# AquaSmart

AquaSmart is a Next.js dashboard plus a small Bun-powered TypeScript backend for communicating with a Siemens LOGO! PLC over Modbus TCP.

This project currently does four main things:

- reads moisture data from the LOGO!
- lets the dashboard queue manual pump commands (`Cerpadlo`)
- stores users, sessions, PLC config, telemetry, and command history in Postgres
- lets a local bridge agent pull work from AquaSmart without exposing the PLC to the public internet

## Kontrolní seznam školních požadavků

AquaSmart je odevzdávaný v kategorii `Webová aplikace`, ne jako samostatné hardwarové zařízení.

- vhodný framework: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- databáze: PostgreSQL s Drizzle schématem pro uživatele, PLC, telemetrii, bridge tokeny a příkazy čerpadla
- kontejnerizace: frontend `Dockerfile`, backend `backend/Dockerfile` a `compose.yaml`
- responzivní UI: marketingové stránky, přihlášení i dashboard jsou připravené pro mobil i desktop
- ochrana citlivých údajů: Better Auth spravuje hesla; bridge tokeny se ukládají jako SHA-256 hash
- aplikace připravená k nasazení: standalone Next build běží v Dockeru a konfiguruje se přes proměnné prostředí
- podmínky používání / privacy policy: veřejná route `/privacy`
- kontrola pro obhajobu: veřejná route `/requirements` mapuje cíle zadání na hotové funkce aplikace

## How the communication works

There are three layers:

1. `frontend` - Next.js app in `C:\Users\jonas\AZK`
2. `backend` - Bun + TypeScript Modbus bridge in `C:\Users\jonas\AZK\backend`
3. `PLC` - Siemens LOGO! 8.4

Flow:

```text
Dashboard button
  -> authenticated Next.js route /api/logo/pump
  -> Postgres pump_commands queue
  -> local bridge polls /api/agent/sync with AQUASMART_AGENT_TOKEN
  -> Modbus TCP write to LOGO!
  -> local bridge reports result to /api/agent/report
  -> LOGO! marker M1
  -> OR block B007
  -> output Q1 (Cerpadlo)
```

For reading moisture:

```text
LOGO! holding register
  -> local bridge reads with Modbus TCP
  -> local bridge reports telemetry to /api/agent/report
  -> frontend shows the latest stored state
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

- `C:\Users\jonas\AZK\app\api\logo\pump\route.ts` - authenticated pump command queue endpoint
- `C:\Users\jonas\AZK\app\api\agent\sync\route.ts` - cloud endpoint used by the local bridge to pull config and commands
- `C:\Users\jonas\AZK\app\api\agent\report\route.ts` - cloud endpoint used by the local bridge to report telemetry and command results
- `C:\Users\jonas\AZK\app\components\PumpControlCard.tsx` - dashboard pump control card
- `C:\Users\jonas\AZK\backend\scripts\logoCommunication.ts` - Modbus TCP connection, reading, and pump writes
- `C:\Users\jonas\AZK\app\db\schema.ts` - Drizzle schema for auth, sites, PLCs, telemetry, and commands
- `C:\Users\jonas\AZK\backend\.env` - backend runtime configuration
- `C:\Users\jonas\AZK\.env.local` - frontend runtime configuration

## Environment configuration

### Database and auth

The frontend requires Postgres and Better Auth configuration:

```env
DATABASE_URL=postgres://aquasmart:aquasmart@127.0.0.1:5432/aquasmart
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

Generate and apply database migrations with:

```powershell
bun run db:generate
bun run db:migrate
```

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

To run the bridge as a cloud agent instead of the legacy local HTTP API, also set:

```env
AQUASMART_CLOUD_URL=http://localhost:3000
AQUASMART_AGENT_TOKEN=as_generated_from_dashboard_settings
AGENT_SYNC_INTERVAL_MS=2000
```

When those two AquaSmart values are present, the backend does not need to expose a local pump API. It polls the cloud for
its LOGO configuration and queued pump commands.

### Frontend

Frontend config is loaded from `C:\Users\jonas\AZK\.env.local`.

Current value:

```env
DATABASE_URL=postgres://aquasmart:aquasmart@127.0.0.1:5432/aquasmart
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

## Docker setup

The repository now includes a full Docker setup for both services:

- `Dockerfile` - production image for the Next.js frontend
- `backend/Dockerfile` - Bun image for the Modbus bridge
- `db` service - Postgres for auth, PLC configuration, telemetry, and command queue
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

Set at least the database/auth values in `.env`:

```env
DATABASE_URL=postgres://aquasmart:aquasmart@db:5432/aquasmart
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

Notes:

- `BACKEND_PORT` only affects the host port mapping; inside the Docker network the backend still listens on `4000`
- after Postgres starts for the first time, run `bun run db:migrate` from the project root with `DATABASE_URL` pointing at the database

### Start with Docker Compose

```powershell
cd C:\Users\jonas\AZK
docker compose up --build
```

Then open:

- [http://localhost:3000](http://localhost:3000)
- [http://localhost:3000/dashboard/controls](http://localhost:3000/dashboard/controls)

If the backend is running in legacy local mode, it will also be available on the host at:

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

Open three terminals.

### Terminal 1 - database

Start Postgres, then run migrations:

```powershell
cd C:\Users\jonas\AZK
docker compose up -d db
$env:DATABASE_URL="postgres://aquasmart:aquasmart@127.0.0.1:5432/aquasmart"
bun run db:migrate
```

### Terminal 2 - backend bridge

```powershell
cd C:\Users\jonas\AZK
bun run backend:start
```

Without `AQUASMART_CLOUD_URL` and `AQUASMART_AGENT_TOKEN`, this starts the legacy local HTTP backend. Expected output:

- `HTTP API ready on port 4001`
- `Connected to LOGO at 192.168.0.3:502`
- periodic moisture read logs

With cloud-agent env values from Dashboard Settings, expected output starts with:

```powershell
[logo-backend] Cloud agent mode enabled. Syncing with http://localhost:3000
```

### Terminal 3 - frontend

```powershell
cd C:\Users\jonas\AZK
bun run dev
```

Then open:

- [http://localhost:3000/dashboard/controls](http://localhost:3000/dashboard/controls)

## How to use the pump control

On the dashboard Settings page:

- create an account
- add a Siemens LOGO 8.4 PLC
- copy the one-time `AQUASMART_AGENT_TOKEN`
- start the bridge with `AQUASMART_CLOUD_URL` and `AQUASMART_AGENT_TOKEN`

On the dashboard controls page:

- click `Turn pump on` to queue a `true` command for the selected PLC
- click `Turn pump off` to queue a `false` command for the selected PLC

The dashboard calls:

- `GET /api/logo/pump` for status
- `POST /api/logo/pump` for commands

The local bridge then polls and calls Modbus:

- `writeCoil(8256, true)` for ON
- `writeCoil(8256, false)` for OFF

## Bridge APIs

Cloud-agent endpoints:

- `GET /api/agent/sync` - authenticated with `Authorization: Bearer AQUASMART_AGENT_TOKEN`; returns PLC config and the next queued command
- `POST /api/agent/report` - authenticated bridge report for heartbeat, readings, errors, and command results

Legacy local backend mode still exposes:

- `GET /api/health` - connection state, latest error, latest reading
- `GET /api/moisture` - full monitor state including moisture data
- `GET /api/pump` - pump control configuration and last pump command
- `POST /api/pump` - sends pump ON/OFF command

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
- If you move from coil control to holding register control, replace `PUMP_COIL_ADDRESS` with `PUMP_REGISTER_ADDRESS`
