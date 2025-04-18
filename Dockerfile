FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN SKIP_ENV_VALIDATION=1 npm run build
RUN mkdir -p .next/standalone/.next && \
    cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/public && \
    cp -r prisma .next/standalone/prisma && \
    cp -r node_modules .next/standalone/node_modules && \
    cp package.json .next/standalone/


FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone .
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && npm run prisma-seed && node server.js start"]
