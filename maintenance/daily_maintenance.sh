#!/bin/bash
# d:/Management Pasar/maintenance/daily_maintenance.sh
# Daily system maintenance script for SVMS

# Rotate Laravel logs (keep last 7 days)
LOG_DIR="$(pwd)/storage/logs"
if [ -d "$LOG_DIR" ]; then
  find "$LOG_DIR" -type f -name "laravel-*.log" -mtime +7 -delete
fi

# Clear cache & config (optional)
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run SystemDoctor with auto‑fix
php artisan system:doctor --fix

# Optimize database tables (already done in SystemDoctor but keep for safety)
php artisan optimize

# Restart queue workers (if any)
# php artisan queue:restart

echo "Daily maintenance completed at $(date)"
