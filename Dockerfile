FROM node:18-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
ENV SKIP_ENV_VALIDATION=1
RUN npm run build

FROM node:18-slim AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json

RUN npm install -g tsx prisma
RUN apt-get update && apt-get install -y openssl

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "prisma db push --accept-data-loss --skip-generate && npm run db:seed && node server.js start"]
