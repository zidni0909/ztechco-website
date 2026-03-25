FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV UPLOAD_DIR=/app/storage/uploads
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
RUN mkdir -p /app/storage/uploads
VOLUME ["/app/storage/uploads"]
EXPOSE 3000
CMD ["node", "server.js"]
