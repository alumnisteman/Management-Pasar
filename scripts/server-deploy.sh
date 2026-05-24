#!/bin/bash
# =============================================================
# Deploy manual ke server (tanpa CI/CD)
# Jalankan dari local: bash scripts/server-deploy.sh
# =============================================================
set -e

SERVER="root@103.175.219.57"
APP_DIR="/var/www/svms"

echo "==> Connecting ke server $SERVER..."
ssh $SERVER "bash -s" << 'ENDSSH'
  set -e
  APP_DIR="/var/www/svms"

  echo "==> Pull kode terbaru..."
  cd $APP_DIR
  git pull origin master || git pull origin main

  echo "==> Install dependencies..."
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  cd apps/web
  bun install --frozen-lockfile

  echo "==> Build..."
  NODE_ENV=production bun run build

  echo "==> Restart PM2 via ecosystem..."
  cd $APP_DIR
  mkdir -p /var/log/svms
  pm2 describe svms > /dev/null 2>&1 \
    && pm2 restart svms --update-env \
    || pm2 start $APP_DIR/ecosystem.config.cjs

  pm2 save

  echo "==> Deploy selesai!"
  pm2 status svms
ENDSSH
