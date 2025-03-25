# Build stage
FROM node:16 AS builder
WORKDIR /app
COPY client/package*.json client/
RUN cd client && npm install
COPY client/ client/
RUN cd client && npm run build

# Production stage
FROM node:16-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --production
COPY server/ ./
COPY --from=builder /app/client/build ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"] 