#!/usr/bin/env bash
set -euo pipefail

echo "=== Update Management-Pasar ==="

# 1. Backup database (optional, based on env var)
if [[ "${DB_BACKUP_ON_UPDATE:-false}" == "true" ]]; then
  echo "Backing up MySQL database..."
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  BACKUP_FILE="db_backup_${TIMESTAMP}.sql"
  docker exec management-pasar-mysql-1 mysqldump -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > ${BACKUP_FILE}
  echo "Backup saved to ${BACKUP_FILE}"
fi

# 2. Pull latest code
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Fetching latest changes..."
  git pull origin main || { echo "Git pull failed"; exit 1; }
else
  echo "Not a git repository. Skipping pull."
fi

# 3. Pull latest images & rebuild containers
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml up -d --build

# 4. Run migrations
docker exec management-pasar-backend-1 php artisan migrate --force

# 5. Optional seeding if env flag set
if [[ "${SEED_DATABASE:-false}" == "true" ]]; then
  docker exec management-pasar-backend-1 php artisan db:seed --force
fi

# 6. Run healthcheck
./scripts/healthcheck.sh

echo "Update completed successfully."
