FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

ENV SKIP_ENV_VALIDATION=1
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && npm run db:seed && node server.js start"]
