#!/bin/bash
set -e

APP_DIR="/var/www/svms"
LOG_FILE="/var/log/svms/deploy.log"

mkdir -p /var/log/svms
exec >> "$LOG_FILE" 2>&1

echo "=============================="
echo "Deploy started: $(date)"
echo "=============================="

cd "$APP_DIR"

echo "==> git pull..."
git pull origin master || git pull origin main

echo "==> bun install..."
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
cd "$APP_DIR/apps/web"
bun install --frozen-lockfile

echo "==> bun build..."
NODE_ENV=production bun run build

echo "==> pm2 restart..."
cd "$APP_DIR"
pm2 restart svms --update-env
pm2 save

echo "Deploy finished: $(date)"
