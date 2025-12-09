FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies (prod + dev) required for building
RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the build artifacts and any static assets needed at runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 4500

CMD ["npm","run","start"]
