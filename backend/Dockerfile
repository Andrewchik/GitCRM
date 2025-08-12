# ---- deps: встановлюємо залежності ----
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci

# ---- build: компілюємо TS у dist ----
FROM node:18-alpine AS build
WORKDIR /app
# потрібен package.json, щоб існував скрипт "build"
COPY package*.json tsconfig.json ./
COPY src ./src
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build   # або: npx tsc

# ---- prod: мінімальний рантайм ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
# runtime залежності
COPY package*.json ./
RUN npm ci --omit=dev
# зібраний код
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
