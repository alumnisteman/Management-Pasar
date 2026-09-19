#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------
# Remote deployment script for Management-Pasar
# Runs on a local machine (Linux/macOS/WSL) and executes
# the full install process on a remote server.
# -------------------------------------------------

# ==== Konfigurasi ==== 
REMOTE_HOST="192.168.1.18"
REMOTE_USER="root"
# Jika menggunakan kunci SSH, pastikan SSH_AUTH_SOCK terpasang atau set SSH_KEY.
# Jika menggunakan password, anda dapat menambahkan opsi -p ke sshpass (tidak disarankan).
REPO_URL="https://github.com/alumnisteman/Management-Pasar"
TARGET_DIR="/var/www/Management-Pasar"

# -------------------------------------------------
# 1. Pastikan ssh tersedia
# -------------------------------------------------
command -v ssh >/dev/null || { echo "ssh tidak terpasang. Install terlebih dahulu."; exit 1; }

# -------------------------------------------------
# 2. Clone atau update repository di remote
# -------------------------------------------------
ssh ${REMOTE_USER}@${REMOTE_HOST} "\
  if [ -d \"${TARGET_DIR}\" ]; then \
    echo 'Direktori ada, melakukan git pull...' && \
    cd \"${TARGET_DIR}\" && git pull origin main; \
  else \
    echo 'Clone repository...' && \
    mkdir -p \"$(dirname ${TARGET_DIR})\" && \
    git clone ${REPO_URL} ${TARGET_DIR}; \
  fi\
"

# -------------------------------------------------
# 3. Jalankan instalasi di remote
# -------------------------------------------------
ssh ${REMOTE_USER}@${REMOTE_HOST} "bash -c 'cd ${TARGET_DIR} && chmod +x ./scripts/install.sh && ./scripts/install.sh'"

echo "Remote deployment selesai pada ${REMOTE_HOST}."
