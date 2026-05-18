#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "[Reverb] Waiting for Laravel API on port 8000..."
for i in $(seq 1 60); do
    if curl -sf http://localhost:8000/api/ping > /dev/null 2>&1; then
        echo "[Reverb] Laravel API is ready."
        break
    fi
    echo "[Reverb] Laravel not ready yet... ($i/60)"
    sleep 2
done

echo "[Reverb] Starting Reverb WebSocket server on port 8080..."
exec php artisan reverb:start --host=0.0.0.0 --port=8080 --no-interaction
