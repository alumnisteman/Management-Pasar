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
# Check if running inside docker or on host with composer installed
if command -v composer &> /dev/null; then
    composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
else
    # Fallback to running via the app container if composer isn't on host
    docker compose exec -T app composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
fi

echo "🗄️  3. Running Database Migrations..."
if command -v php &> /dev/null; then
    php artisan migrate --force
else
    docker compose exec -T app php artisan migrate --force
fi

echo "🧹 4. Clearing and Rebuilding Cache..."
if command -v php &> /dev/null; then
    php artisan optimize:clear
    php artisan config:cache
    php artisan event:cache
    php artisan route:cache
    php artisan view:cache
else
    docker compose exec -T app php artisan optimize:clear
    docker compose exec -T app php artisan config:cache
    docker compose exec -T app php artisan event:cache
    docker compose exec -T app php artisan route:cache
    docker compose exec -T app php artisan view:cache
fi

echo "🔄 5. Restarting Workers & WebSockets..."
if command -v php &> /dev/null; then
    php artisan queue:restart
else
    docker compose exec -T app php artisan queue:restart
fi

echo "✨ 6. Restarting Octane Server..."
# Restart octane gracefully if it's running
docker compose restart app || echo "⚠️  Could not restart app container automatically."

echo "============================================================"
echo "✅ Deployment completed successfully!"
echo "============================================================"
