#!/usr/bin/env bash
set -euo pipefail

echo "Restarting all services..."

./scripts/stop.sh
./scripts/start.sh

echo "All services restarted."
