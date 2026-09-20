#!/bin/bash
# setup_laravel.sh - Run on server to bootstrap Laravel + copy app files
set -e

APP_DIR="/var/www/Management-Pasar"
TEMP_DIR="/tmp/laravel-fresh"

echo "=== Step 1: Create fresh Laravel project ==="
COMPOSER_ALLOW_SUPERUSER=1 composer create-project laravel/laravel "$TEMP_DIR" --prefer-dist --no-progress -q

echo "=== Step 2: Copy our app files into fresh Laravel ==="
# Override app files
cp -rf "$APP_DIR/app/"* "$TEMP_DIR/app/"
cp -rf "$APP_DIR/database/"* "$TEMP_DIR/database/"
cp -rf "$APP_DIR/routes/"* "$TEMP_DIR/routes/"
cp -rf "$APP_DIR/resources/"* "$TEMP_DIR/resources/"
[ -d "$APP_DIR/config" ] && cp -rf "$APP_DIR/config/"* "$TEMP_DIR/config/" 2>/dev/null || true

echo "=== Step 3: Install extra packages ==="
cd "$TEMP_DIR"
COMPOSER_ALLOW_SUPERUSER=1 composer require laravel/sanctum --no-interaction -q

echo "=== Step 4: Configure .env ==="
cp "$APP_DIR/.env" "$TEMP_DIR/.env" 2>/dev/null || cp .env.example .env

# Update DB settings from current .env or set defaults
sed -i "s/DB_HOST=.*/DB_HOST=mysql/" .env
sed -i "s/DB_DATABASE=.*/DB_DATABASE=svms/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=root/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=root/" .env
sed -i "s/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=redis/" .env
sed -i "s/REDIS_HOST=.*/REDIS_HOST=redis/" .env

php artisan key:generate --ansi --force

echo "=== Step 5: Move to production directory ==="
# Backup old dir
mv "$APP_DIR" "/var/www/Management-Pasar-backup-$(date +%s)" 2>/dev/null || true
mv "$TEMP_DIR" "$APP_DIR"

echo "=== Step 6: Set permissions ==="
cd "$APP_DIR"
chmod -R 777 storage bootstrap/cache

echo "=== DONE ==="
echo "Laravel is ready at $APP_DIR"
