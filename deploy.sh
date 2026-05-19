#!/bin/bash
# =========================================================================
# SMOS Enterprise v6 Automated Deployment Script
# =========================================================================
# This script is intended to be run on the production server (e.g., inside 
# the /var/www/svms/backend directory or from the host).
# =========================================================================

echo "============================================================"
echo "🚀 Starting SMOS Enterprise Deployment..."
echo "============================================================"

# Ensure we are in the correct directory (the backend folder)
if [ ! -f "artisan" ]; then
    echo "❌ Error: 'artisan' file not found. Please run this script from the Laravel root directory."
    exit 1
fi

echo "📦 1. Pulling latest updates from Git..."
git pull origin master || { echo "❌ Git pull failed"; exit 1; }

echo "🛠️  2. Installing PHP Dependencies (Composer)..."
docker exec -w /var/www svms-app-1 composer update laravel/octane spiral/roadrunner-cli spiral/roadrunner-http -W --no-interaction --prefer-dist --optimize-autoloader
docker exec -w /var/www svms-app-1 composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

echo "🗄️  3. Running Database Migrations..."
docker exec -w /var/www svms-app-1 php artisan migrate --force

echo "🧹 4. Clearing and Rebuilding Cache..."
docker exec -w /var/www svms-app-1 php artisan optimize:clear
docker exec -w /var/www svms-app-1 php artisan config:cache
docker exec -w /var/www svms-app-1 php artisan event:cache
docker exec -w /var/www svms-app-1 php artisan route:cache

echo "🔄 5. Restarting Workers & WebSockets..."
docker exec -w /var/www svms-app-1 php artisan queue:restart

echo "✨ 6. Restarting Application Container (to pick up Octane/Reverb changes)..."
cd /var/www/svms && docker compose restart app || echo "⚠️  Could not restart app container automatically."

echo "🏗️  7. Rebuilding and restarting Frontend Container..."
cd /var/www/svms && docker compose up -d --build frontend || echo "⚠️  Could not build/restart frontend container automatically."

echo "============================================================"
echo "✅ Deployment completed successfully!"
echo "============================================================"
