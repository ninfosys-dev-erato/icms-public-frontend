# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build-time args from docker-compose
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_DEBUG=false

# Expose them to Next.js build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_DEBUG=${NEXT_PUBLIC_DEBUG}

# Make sure devDependencies are installed
ENV YARN_PRODUCTION=false \
    npm_config_production=false \
    NODE_ENV=development

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

COPY . .

# Build in production mode (now has NEXT_PUBLIC_* available)
RUN NODE_ENV=production yarn build

#RUN yarn cache clean || true


# -------- Runtime stage --------
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000', r=>process.exit(r.statusCode>=200&&r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
