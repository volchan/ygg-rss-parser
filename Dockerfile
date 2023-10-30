# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Install pnpm
ARG PNPM_VERSION=8.10.0
RUN npm install --ignore-scripts -g pnpm@"$PNPM_VERSION"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential pkg-config python-is-python3 &&\
    apt-get clean

FROM base AS development
# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

FROM base AS production
# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts --prod=false

# Copy application code
COPY ./src ./src
COPY tsconfig.json ./

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
# Create group and user nonroot
RUN addgroup --system nonroot && adduser --system --group nonroot
# Set user to nonroot
USER nonroot
CMD [ "pnpm", "serve" ]
