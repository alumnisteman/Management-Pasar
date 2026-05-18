#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "[Worker] Waiting for Laravel API on port 8000..."
for i in $(seq 1 60); do
    if curl -sf http://localhost:8000/api/ping > /dev/null 2>&1; then
        echo "[Worker] Laravel API is ready. Starting queue worker..."
        break
    fi
    echo "[Worker] Laravel not ready yet... ($i/60)"
    sleep 2
done

echo "[Worker] Starting queue worker (svms-worker-1)..."
exec php artisan queue:work redis --sleep=3 --tries=3 --timeout=90 --queue=default,high,low
