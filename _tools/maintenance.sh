#!/bin/bash
echo "Starting SVMS System Maintenance..."

# 1. Clean up old logs (older than 7 days)
echo "Removing old logs..."
find /var/www/svms/backend/storage/logs -name "*.log" -mtime +7 -delete

# 2. Clear application cache
echo "Clearing expired cache..."
docker exec svms-app-1 php artisan cache:clear

# 3. Database Optimization (Reclaim fragmented space)
echo "Optimizing database tables..."
docker exec svms-mysql-1 mysql -u root -proot svms -e "OPTIMIZE TABLE transactions, assignments, audit_logs, scan_logs;"

echo "Maintenance Complete!"
