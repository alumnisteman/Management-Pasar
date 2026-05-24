#!/usr/bin/env bash
# SVMS Git Auto Sync - baca token dari .sync_env
source /var/www/svms/.sync_env 2>/dev/null
python3 /var/www/svms/scripts/svms_sync.py
