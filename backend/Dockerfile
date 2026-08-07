# syntax=docker/dockerfile:1

FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

RUN useradd --system --uid 1001 faceai
USER faceai

# Port is configurable via the PORT env var (see .env.example); 3000 is the
# project convention (the Expo frontend owns 8081).
EXPOSE 3000
CMD ["node", "dist/server.js"]
