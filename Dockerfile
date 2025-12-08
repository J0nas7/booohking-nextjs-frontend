FROM node:20-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

# Install necessary build dependencies for Alpine
RUN apk add --no-cache \
  build-base \
  pixman-dev \
  pkgconfig \
  cairo-dev \
  libjpeg-turbo-dev \
  pango-dev \
  giflib-dev \
  gdk-pixbuf-dev \
  python3

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare

# Copy the root package.json and package-lock.json (if present) to ensure workspaces are recognized
COPY package.json package-lock.json* ./

# Now copy everything else
COPY . .

# Install the required dependencies
RUN npm install

# ---
FROM base AS builder

WORKDIR /app

# Add the environment variable for standalone mode in the build phase
ENV NEXT_PRIVATE_STANDALONE=true

# Copy the package.json and package-lock.json from the previous stage to ensure the files are available
COPY --from=prepare /app/package.json /app/package-lock.json* ./

# Now copy everything else from the 'prepare' stage
COPY --from=prepare /app .

# Install dependencies (including next)
RUN npm install

# Check if next is available (this will run 'next' to verify installation)
RUN npm run next --version

# ---
FROM base AS runner

# Set the working directory to the correct location
# Make sure the working directory is where `next` is located
WORKDIR /app

# Copy only required files from builder
#COPY --from=builder /app/.next/standalone ./
#COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Use an argument to handle dev/prod mode
ARG NODE_ENV=production

# If NODE_ENV is set to "development", run the Next.js dev server, else run in production mode
CMD if [ "$NODE_ENV" = "development" ]; then \
        npm run dev; \
    else \
        npm start; \
    fi
