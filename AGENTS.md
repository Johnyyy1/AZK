<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses `next@16.2.1` with the App Router. Before changing routes, layouts, metadata, navigation, or `next.config.ts`, read the relevant guide in `node_modules/next/dist/docs/` and follow current Next 16 conventions rather than older examples.
<!-- END:nextjs-agent-rules -->

# AquaSmart Agent Guide

## Mission

Keep changes small, clean, and easy to review. Be token-efficient, preserve the existing visual system, and treat the backend as live hardware-facing code.

## Project Snapshot

- Product: AquaSmart
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, `motion/react`
- Backend: standalone Bun + TypeScript Modbus bridge in `backend/`
- Runtime shape:
  - marketing pages in `app/`
  - dashboard pages in `app/dashboard/`
  - frontend API proxy in `app/api/logo/pump/route.ts`
  - PLC communication in `backend/scripts/logoCommunication.ts`

## Agent Priorities

1. Read only the files needed for the task.
2. Prefer the smallest correct change over broad refactors.
3. Keep code composable and colocated.
4. Do not overwrite unrelated user changes.
5. Validate enough for the risk level of the change.

## Token Efficiency Rules

- Start with targeted inspection:
  - use `rg --files` for file discovery
  - use `rg` for symbol/text search
  - read focused slices with `sed -n`
- Do not scan `node_modules`, `.next`, or lockfiles unless the task requires it.
- Exception: reading `node_modules/next/dist/docs/` is expected before changing routed UI or Next config.
- Summarize patterns instead of pasting large file contents back to the user.
- Avoid repeating repo structure once it has already been established.

## Files And Boundaries

- `app/layout.tsx`: global fonts, metadata, Material Symbols stylesheet
- `app/globals.css`: theme tokens, shared utility classes, global visual language
- `app/components/`: shared UI used across marketing and dashboard surfaces
- `app/dashboard/layout.tsx`: dashboard shell and sidebar layout
- `app/api/logo/pump/route.ts`: frontend-to-backend proxy boundary
- `backend/scripts/logoCommunication.ts`: Modbus connection, polling, pump writes, local HTTP API
- `public/`: static assets only

Do not edit generated or dependency artifacts:

- `.next/`
- `node_modules/`
- `backend/node_modules/`
- `next-env.d.ts`

## Frontend Rules

- Preserve the App Router structure:
  - routes use `page.tsx`
  - shared route chrome uses `layout.tsx`
- Prefer server components by default, but keep `"use client"` where interactivity, state, browser APIs, or `motion/react` require it.
- Do not add client boundaries higher in the tree than necessary.
- Reuse existing global tokens and utility classes in `app/globals.css` before inventing new styling patterns.
- Match the current brand language:
  - agricultural-tech tone
  - IBM Plex + Playfair typography
  - soft glass cards
  - green/navy/paper/clay palette
  - motion that feels editorial, not noisy
- Keep dashboard additions visually aligned with existing primitives such as `section-frame`, `dark-frame`, `atlas-card`, `atlas-button`, and `atlas-button-secondary`.
- Prefer small route-local helpers for one-off UI. Promote to `app/components/` only when reused.
- Preserve responsive behavior on mobile and desktop.

## Backend And Hardware Rules

- Treat `backend/` as hardware-facing code, not a mock service.
- Do not hardcode PLC IPs, ports, coil addresses, or backend URLs when env configuration already exists.
- Keep the frontend talking to `/api/logo/pump`; do not bypass the proxy from client components.
- Preserve the current backend API contract unless the task explicitly requires a coordinated change:
  - `GET /api/health`
  - `GET /api/moisture`
  - `GET /api/pump`
  - `POST /api/pump`
- Be conservative with retries, polling, and write behavior. A careless change can affect real equipment.

## Clean Code Rules

- Prefer clear types and simple data flow over clever abstractions.
- Keep components focused. If a file grows unwieldy, extract a small local helper or subcomponent.
- Reuse existing naming patterns and class composition style.
- Avoid duplicate constants, repeated markup patterns, and one-off style drift.
- Add comments only when they explain non-obvious intent.
- Do not churn formatting or rename things without benefit.

## Dependency And Config Rules

- `bun` is the primary runtime for this repo.
- Keep `package-lock.json` and `backend/package-lock.json` untouched unless dependency work makes changes necessary.
- Check current Next 16 docs before changing `next.config.ts`.
- Prefer `next/font` for additional fonts.
- Do not expose secrets from `.env*` files.

## Common Commands

- `bun run dev`: start the Next.js dev server
- `bun run lint`: run ESLint
- `bun run typecheck`: run the workspace TypeScript check
- `bun run build`: run the production build
- `bun run backend:start`: start the local LOGO backend
- `bun run backend:test:logo`: manual backend connectivity check

## Validation Rules

- Frontend/UI changes: run `bun run lint`.
- Type-sensitive or shared TS changes: run `bun run typecheck`.
- Routing, layout, metadata, config, or production behavior changes: run `bun run build`.
- Backend changes: validate with the least risky command that fits the task. Do not run live hardware checks unless the task calls for it and the environment is known.

## Practical Defaults

- Marketing pages are highly art-directed and often intentionally use client components with `motion/react`.
- Dashboard pages share one shell and should feel calmer and more operational than the marketing pages while keeping the same design DNA.
- If the task touches both frontend and backend, keep the HTTP contract explicit and verify both sides still line up.
- If a task is ambiguous, prefer preserving existing behavior and making the narrowest useful improvement.
