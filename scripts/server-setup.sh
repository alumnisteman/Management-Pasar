#!/bin/bash
# =============================================================
# Setup awal server untuk Management Pasar (SVMS)
# Build dilakukan di GitLab CI runner, server hanya butuh:
#   git, node, pm2, nginx
# Jalankan sekali di server: bash /var/www/svms/scripts/server-setup.sh
# =============================================================
set -e

APP_DIR="/var/www/svms"
REPO_URL="git@gitlab.com:alumnisteman/Management-Pasar.git"
NODE_PORT=5000

echo "======================================"
echo " Setup Server SVMS Management Pasar"
echo "======================================"

# Update system
apt-get update -y
apt-get install -y curl git nginx ufw

# Install Node.js 20 LTS (untuk menjalankan hasil build)
if ! command -v node &> /dev/null; then
  echo "==> Install Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "==> Node.js sudah ada: $(node -v)"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
  echo "==> Install PM2..."
  npm install -g pm2
  pm2 startup systemd -u root --hp /root
  systemctl enable pm2-root
else
  echo "==> PM2 sudah ada: $(pm2 -v)"
fi

# Setup SSH untuk GitLab (agar server bisa git pull)
echo "==> Pastikan GitLab ada di known_hosts..."
ssh-keyscan -H gitlab.com >> /root/.ssh/known_hosts 2>/dev/null || true

# Clone repositori
echo "==> Clone repositori..."
mkdir -p $(dirname $APP_DIR)
if [ -d "$APP_DIR/.git" ]; then
  echo "Repo sudah ada di $APP_DIR, skip clone."
else
  git clone $REPO_URL $APP_DIR
fi

# Direktori log
mkdir -p /var/log/svms

# ─────────────────────────────────────────
# NOTE: Build TIDAK dilakukan di sini.
# Build terjadi di GitLab CI runner dan
# hasilnya di-transfer ke server via CI/CD.
# Jalankan pipeline GitLab untuk deploy pertama kali.
# ─────────────────────────────────────────

# Konfigurasi Nginx sebagai reverse proxy
echo "==> Konfigurasi Nginx..."
cat > /etc/nginx/sites-available/svms << EOF
server {
    listen 80;
    server_name 103.175.219.57;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${NODE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/svms /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
systemctl enable nginx

# Firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo ""
echo "======================================"
echo " Setup selesai!"
echo ""
echo " Langkah berikutnya:"
echo "   Push ke GitLab → CI/CD otomatis build & deploy"
echo "   Atau trigger manual di GitLab → CI/CD → Pipelines"
echo ""
echo " Cek status: pm2 status"
echo " Cek Nginx:  systemctl status nginx"
echo "======================================"
