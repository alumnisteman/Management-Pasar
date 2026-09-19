#!/usr/bin/env bash
set -euo pipefail

echo "Starting all services..."

docker compose -f docker/docker-compose.yml up -d

echo "All services started."
