#base image
FROM node:20-alpine AS base

#Install dependencies when needed
FROM base AS deps
#to add the missed shared libraries to the image using libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

#install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

#rebuild the source code when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#build the app
RUN npm run build

#production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

#copy built application and node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 3000

ENV PORT=3000
#set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
