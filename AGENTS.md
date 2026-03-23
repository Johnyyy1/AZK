<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses `next@16.2.1` with the App Router. APIs, conventions, and type helpers may differ from older Next.js versions. Before changing routed UI, layouts, navigation, metadata, or framework config, read the relevant guide in `node_modules/next/dist/docs/` and follow current file conventions.
<!-- END:nextjs-agent-rules -->

# Project Guide for Agents

## Overview

- Product name: AquaSmart
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion
- Backend: standalone Node.js CommonJS script under `backend/` for Modbus / Logo communication
- Design assets and source exports live in `stitch_project/`

## Repository Layout

- `app/`: App Router entrypoint and route tree
- `app/components/`: shared UI used across marketing pages and dashboard shell
- `app/dashboard/`: dashboard area with nested pages for analytics, controls, scheduling, settings, and zones
- `app/layout.tsx`: root layout, global fonts, metadata, and Material Symbols stylesheet
- `app/globals.css`: Tailwind import, theme tokens, shared utilities, and animation helpers
- `public/`: static assets served by Next.js
- `backend/scripts/logoCommunication.js`: local hardware communication script
- `stitch_project/`: HTML exports, screenshots, and planning artifacts used as design reference

## Working Rules

- Preserve the App Router structure. Add routes with `page.tsx`; add shared chrome with `layout.tsx`.
- Prefer server components by default. Only add `"use client"` when browser APIs, stateful interactivity, or client-only libraries require it.
- Follow current Next 16 docs for route props and conventions. In this version, `params` / `searchParams` patterns and generated type helpers may differ from older releases.
- Keep root-level shared styling in `app/globals.css`. Reuse the existing design tokens such as `bg-background`, `text-on-background`, `font-headline`, `font-body`, and the custom utility classes before inventing new patterns.
- Match the existing visual language: agricultural-tech branding, bold typography, soft glass surfaces, green/navy palette, and motion-driven marketing sections.
- Use `next/font` for additional fonts rather than ad hoc font loading. The current root layout already wires headline/body/accent fonts.
- Treat `stitch_project/` as reference material, not runtime code. Do not wire those exported HTML files directly into the app.
- Keep `backend/` changes isolated from frontend work unless the task clearly crosses both.

## Commands

From the repo root:

- `npm run dev`: start the Next.js dev server
- `npm run build`: production build
- `npm run start`: run the production server
- `npm run lint`: run ESLint

From `backend/`:

- `npm start`: run the Modbus / Logo communication script
- `npm run test:logo`: same script, used as a manual connectivity check

## File-Specific Notes

- `app/page.tsx` is a client component and already uses `motion/react`; keep heavy animation work consistent with that setup.
- `app/dashboard/layout.tsx` provides the shared dashboard shell with the sidebar and left offset content region.
- `next.config.ts` is minimal right now. Check Next 16 docs before adding config keys because older examples may be obsolete.
- `.next/` and `node_modules/` are generated artifacts and should not be edited manually.

## Validation Expectations

- Run `npm run lint` after meaningful frontend edits.
- Run `npm run build` for changes that affect routing, layout structure, or production behavior.
- If you change `backend/`, validate from `backend/` with the relevant script only when the task calls for it and hardware assumptions are clear.

## Practical Defaults

- If you need a new shared dashboard or route-specific helper, colocate it near the route unless it is reused broadly.
- Prefer small, composable React components over very large page files when touching repeated dashboard UI.
- When making structural route changes, consult `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` and `03-layouts-and-pages.md` first.
