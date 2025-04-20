FROM node:18-slim AS job
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
RUN npm install -g tsx
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN SKIP_ENV_VALIDATION=1 npm run build
RUN mkdir -p .next/standalone/.next && \
    cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/public && \
    cp -r prisma .next/standalone/prisma && \
    cp -r node_modules .next/standalone/node_modules && \
    cp package.json .next/standalone/
WORKDIR /app/.next/standalone
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && npm run db:seed && node server.js start"]
