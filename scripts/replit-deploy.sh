#!/bin/bash
# =============================================================
# Deploy dari Replit ke server produksi
# Jalankan: bash scripts/replit-deploy.sh
# Membutuhkan secret: SSH_PRIVATE_KEY di Replit Secrets
# =============================================================
set -e

SERVER_USER="root"
SERVER_HOST="103.175.219.57"
SERVER_PORT="${SSH_PORT:-22}"
APP_DIR="/var/www/svms"

if [ -z "$SSH_PRIVATE_KEY" ]; then
  echo "❌ ERROR: SSH_PRIVATE_KEY tidak ditemukan di environment."
  echo "   Tambahkan SSH_PRIVATE_KEY di Replit Secrets panel."
  exit 1
fi

# Tulis key sementara ke tempfile yang aman (hanya di memory process ini)
KEY_FILE=$(mktemp)
chmod 600 "$KEY_FILE"

# Strip any leading label (e.g. "SSH_PRIVATE_KEY"), collapse all whitespace to single spaces,
# then reconstruct a valid PEM: header, base64 body (64-char lines), footer
printf '%s' "$SSH_PRIVATE_KEY" \
  | sed 's/^[A-Z_]*[[:space:]]*//' \
  | tr -s '[:space:]' ' ' \
  | sed 's/-----BEGIN OPENSSH PRIVATE KEY----- /-----BEGIN OPENSSH PRIVATE KEY-----\n/' \
  | sed 's/ -----END OPENSSH PRIVATE KEY-----/\n-----END OPENSSH PRIVATE KEY-----/' \
  | awk '/^-----/ { print; next } { gsub(/ /,""); n=split($0,a,""); line=""; for(i=1;i<=n;i++){line=line a[i]; if(length(line)==64){print line; line=""}} if(line!="") print line }' \
  > "$KEY_FILE"
echo "" >> "$KEY_FILE"

cleanup() {
  rm -f "$KEY_FILE"
}
trap cleanup EXIT

echo "🚀 Memulai deploy ke $SERVER_USER@$SERVER_HOST..."
echo "================================================"

ssh -i "$KEY_FILE" \
    -o StrictHostKeyChecking=no \
    -o ConnectTimeout=15 \
    -p "$SERVER_PORT" \
    "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'

set -e

APP_DIR="/var/www/svms"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "📦 Pull kode terbaru dari git..."
cd "$APP_DIR"
git pull origin master 2>/dev/null || git pull origin main

echo "📦 Install dependencies..."
cd "$APP_DIR/apps/web"
bun install --frozen-lockfile

echo "🔨 Build production..."
NODE_ENV=production bun run build

echo "♻️  Restart PM2..."
cd "$APP_DIR"
mkdir -p /var/log/svms
pm2 describe svms > /dev/null 2>&1 \
  && pm2 restart svms --update-env \
  || pm2 start "$APP_DIR/ecosystem.config.cjs"

pm2 save

echo ""
echo "✅ Deploy selesai!"
echo "================================================"
pm2 status svms

ENDSSH

echo ""
echo "✅ Server berhasil diupdate!"
