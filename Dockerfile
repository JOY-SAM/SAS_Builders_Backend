# Multi-stage Dockerfile for Development and Production

# Base stage
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# install global dependencies if any required, e.g. for prisma sometimes openssl is needed
RUN apk add --no-cache openssl
COPY package*.json ./
# Install all dependencies (including devDependencies) so we can build and run in dev
RUN npm ci

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev:docker"]

# Builder stage
FROM base AS builder
COPY . .
RUN npx prisma generate
RUN npm run build
# Prune dev dependencies to keep production image small
RUN npm prune --omit=dev

# Production stage
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install openssl for prisma client
RUN apk add --no-cache openssl

# Switch to non-root user
USER node

COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["node", "dist/server.js"]
