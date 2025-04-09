FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm install
RUN SKIP_ENV_VALIDATION=1 npm run build;
EXPOSE 3000
CMD ["npm", "start"]