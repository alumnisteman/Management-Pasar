#!/bin/bash
echo "Starting SVMS Deployment Automation..."
cd /var/www/svms

# Build and start services
docker compose up -d --build app worker

# Laravel Production Optimization
echo "Optimizing Laravel..."
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache
docker compose exec -T app php artisan optimize

echo "Deployment Successful!"
