#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------
# 1. Deteksi OS & arsitektur
# -------------------------------------------------
OS=$(uname -s)
ARCH=$(uname -m)

if [[ "$OS" == "Linux" ]]; then
    echo "Detected Linux ($ARCH)"
elif [[ "$OS" == "Darwin" ]]; then
    echo "Detected macOS ($ARCH)"
else
    echo "Sistem operasi $OS tidak didukung. Gunakan Linux/WSL2."
    exit 1
fi

# -------------------------------------------------
# 2. Cek dependencies (docker, docker compose, curl, jq)
# -------------------------------------------------
missing=()
command -v docker >/dev/null || missing+=("docker")
docker compose version >/dev/null 2>&1 || missing+=("docker-compose")
command -v curl >/dev/null || missing+=("curl")
command -v jq >/dev/null || missing+=("jq")

if [[ ${#missing[@]} -gt 0 ]]; then
    echo "Dependency berikut belum terpasang: ${missing[*]}"
    echo "Silakan instal menggunakan package manager (apt, yum, brew)."
    exit 1
fi

# -------------------------------------------------
# 3. Cek port yang akan dipakai (80, 8000, 4000)
# -------------------------------------------------
for p in 80 8000 4000; do
    if lsof -i TCP:"$p" -s TCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port $p sudah dipakai. Tutup proses yang memakai port ini atau ubah konfigurasi."
        exit 1
    fi
done

# -------------------------------------------------
# 4. Inisialisasi .env
# -------------------------------------------------
if [[ ! -f .env ]]; then
    echo "Membuat .env dari .env.example"
    cp .env.example .env
fi

# Load .env variables
set -a
source .env
set +a

if [[ -z "${APP_KEY:-}" ]]; then
    echo "Generating APP_KEY..."
    KEY=$(php -r "echo 'base64:'.base64_encode(random_bytes(32));")
    sed -i "s/^APP_KEY=.*/APP_KEY=$KEY/" .env
fi

# -------------------------------------------------
# 5. Buat directory yang dibutuhkan
# -------------------------------------------------
mkdir -p storage bootstrap/cache
chmod -R 777 storage bootstrap/cache

# -------------------------------------------------
# 6. Jalankan Docker Compose (build & up)
# -------------------------------------------------
docker compose -f docker/docker-compose.yml up -d --build

# -------------------------------------------------
# 7. Tunggu backend siap (maks 60 detik)
# -------------------------------------------------
echo "Menunggu backend siap..."
for i in {1..12}; do
    if docker exec management-pasar-backend-1 curl -s http://localhost:8000/health | grep -q "OK"; then
        echo "Backend sudah siap."
        break
    fi
    sleep 5
done

# -------------------------------------------------
# 8. Migrasi database
# -------------------------------------------------
docker exec management-pasar-backend-1 php artisan migrate --force

# -------------------------------------------------
# 9. Seed data (opsional)
# -------------------------------------------------
if [[ "${SEED_DATABASE:-false}" == "true" ]]; then
    docker exec management-pasar-backend-1 php artisan db:seed --force
fi

# -------------------------------------------------
# 10. Healthcheck akhir & tampilkan URL
# -------------------------------------------------
./scripts/healthcheck.sh

echo ""
echo "=========================================="
echo "Instalasi selesai! Akses aplikasi di:"
echo "   http://localhost"
echo "=========================================="
echo "Perintah manajemen:"
echo "   ./scripts/start.sh      # jalankan semua service"
echo "   ./scripts/stop.sh       # matikan semua service"
echo "   ./scripts/restart.sh    # restart"
echo "   ./scripts/update.sh     # update ke versi terbaru"
echo "   ./scripts/uninstall.sh  # hapus semua container & data (opsional)"
