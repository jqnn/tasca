FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm install
RUN SKIP_ENV_VALIDATION=1 npm run build;
RUN mkdir -p .next/standalone/.next && cp -r .next/static .next/standalone/.next/
RUN cp -r public .next/standalone/public
WORKDIR /app/.next/standalone
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && npm run prisma-seed && node server.js start"]