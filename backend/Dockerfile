FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional

FROM oven/bun:1.2.22 AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

COPY scripts ./scripts

ENV NODE_ENV=production
ENV API_PORT=4000

EXPOSE 4000
CMD ["bun", "run", "scripts/logoCommunication.ts"]
