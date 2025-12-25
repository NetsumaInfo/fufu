# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Accept build argument for CDN URL
ARG NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL

# Build Next.js application
# Next.js will collect anonymous telemetry data, disable it
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
