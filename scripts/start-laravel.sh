#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "[Laravel] Bootstrapping Laravel environment..."

# --- Generate .env from process environment variables ---
cat > .env << ENVEOF
APP_NAME=${APP_NAME:-SVMS}
APP_ENV=${APP_ENV:-local}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-true}
APP_URL=${APP_URL:-http://localhost:8000}

LOG_CHANNEL=${LOG_CHANNEL:-stack}
LOG_LEVEL=${LOG_LEVEL:-debug}

DB_CONNECTION=${DB_CONNECTION:-sqlite}

BROADCAST_CONNECTION=${BROADCAST_CONNECTION:-reverb}
CACHE_STORE=${CACHE_STORE:-redis}
CACHE_DRIVER=${CACHE_DRIVER:-redis}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-redis}

SESSION_DRIVER=${SESSION_DRIVER:-file}
SESSION_LIFETIME=${SESSION_LIFETIME:-120}

REDIS_CLIENT=${REDIS_CLIENT:-predis}
REDIS_HOST=${REDIS_HOST:-127.0.0.1}
REDIS_PASSWORD=${REDIS_PASSWORD:-null}
REDIS_PORT=${REDIS_PORT:-6379}

MAIL_MAILER=${MAIL_MAILER:-log}
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS:-noreply@svms.id}
MAIL_FROM_NAME="${APP_NAME:-SVMS}"

REVERB_APP_ID=${REVERB_APP_ID:-svms-app-001}
REVERB_APP_KEY=${REVERB_APP_KEY:-svms-reverb-key}
REVERB_APP_SECRET=${REVERB_APP_SECRET:-svms-reverb-secret}
REVERB_HOST=${REVERB_HOST:-0.0.0.0}
REVERB_PORT=${REVERB_PORT:-8081}
REVERB_SCHEME=${REVERB_SCHEME:-http}
ENVEOF

echo "[Laravel] .env generated."

# --- Wait for Redis ---
echo "[Laravel] Waiting for Redis on ${REDIS_HOST:-127.0.0.1}:${REDIS_PORT:-6379}..."
for i in $(seq 1 30); do
    if redis-cli -h "${REDIS_HOST:-127.0.0.1}" -p "${REDIS_PORT:-6379}" ping 2>/dev/null | grep -q PONG; then
        echo "[Laravel] Redis is ready."
        break
    fi
    echo "[Laravel] Redis not ready yet, waiting... ($i/30)"
    sleep 1
done

# --- Install dependencies if needed ---
if [ ! -d vendor ]; then
    echo "[Laravel] Installing Composer dependencies..."
    composer install --no-interaction --no-dev --optimize-autoloader 2>&1
fi

# --- Generate APP_KEY if missing ---
if ! grep -q "APP_KEY=base64:" .env; then
    echo "[Laravel] Generating application key..."
    php artisan key:generate --force
fi

# --- Ensure SQLite database exists ---
if [ ! -f "database/database.sqlite" ]; then
    echo "[Laravel] Creating SQLite database..."
    touch database/database.sqlite
fi

# --- Run migrations ---
echo "[Laravel] Running migrations..."
php artisan migrate --force --no-interaction 2>&1 || echo "[Laravel] Migration warning (may already be up to date)"

# --- Clear caches ---
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

echo "[Laravel] Starting artisan serve on port 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
