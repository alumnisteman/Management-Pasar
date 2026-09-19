#!/bin/bash

# Health Guard for SVMS Real-Time System
# This script ensures that Reverb and Queue workers are always running.

LOG_FILE="/var/www/svms/health_guard.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Checking SVMS Health..." >> $LOG_FILE

# 1. Check Reverb (Port 8081)
if ! netstat -tulpn | grep :8081 > /dev/null; then
    echo "[$DATE] Reverb is DOWN! Restarting..." >> $LOG_FILE
    docker exec -d svms-app-1 php artisan reverb:start --host=0.0.0.0 --port=8081
else
    echo "[$DATE] Reverb is OK." >> $LOG_FILE
fi

# 2. Check Queue Worker
if ! docker ps | grep svms-worker-1 | grep Up > /dev/null; then
    echo "[$DATE] Worker is DOWN! Restarting..." >> $LOG_FILE
    cd /var/www/svms && docker compose restart worker
else
    echo "[$DATE] Worker is OK." >> $LOG_FILE
fi

echo "[$DATE] Health Check Complete." >> $LOG_FILE
