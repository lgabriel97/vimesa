# ----- Stage 1: build -----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

# ----- Stage 2: runtime -----
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

RUN npm install prisma@7 tsx --no-save

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated  
COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && node dist/index.js"