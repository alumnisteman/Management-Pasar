#!/bin/bash
set -e

echo "Starting News Hybrid Deployment..."

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found, please install it."
    exit 1
fi

# 1. Start containers
echo "Starting Docker containers..."
docker-compose up -d

# 2. Wait for MySQL to be ready
echo "Waiting for MySQL..."
sleep 15

# 3. Initialize Laravel if not exists
if [ ! -d "app-backend/app" ]; then
    echo "Installing Laravel 12..."
    docker-compose exec -T app composer create-project laravel/laravel .
    
    echo "Installing dependencies..."
    docker-compose exec -T app composer require vedmant/laravel-feed-reader guzzlehttp/guzzle
    docker-compose exec -T app composer require predis/predis
fi

# 4. Configure .env
echo "Configuring .env..."
cp app-backend/.env.example app-backend/.env || true
sed -i 's/DB_HOST=127.0.0.1/DB_HOST=mysql/' app-backend/.env || true
sed -i 's/DB_DATABASE=laravel/DB_DATABASE=news_hybrid/' app-backend/.env || true
sed -i 's/DB_USERNAME=root/DB_USERNAME=root/' app-backend/.env || true
sed -i 's/DB_PASSWORD=/DB_PASSWORD=root/' app-backend/.env || true
sed -i 's/QUEUE_CONNECTION=sync/QUEUE_CONNECTION=redis/' app-backend/.env || true
sed -i 's/REDIS_HOST=127.0.0.1/REDIS_HOST=redis/' app-backend/.env || true

# 5. Copy custom files to Laravel structure
echo "Copying custom code..."
mkdir -p app-backend/app/Models app-backend/app/Services app-backend/app/Jobs app-backend/app/Console/Commands
cp laravel-custom/News.php app-backend/app/Models/News.php || true
cp laravel-custom/RssService.php app-backend/app/Services/RssService.php || true
cp laravel-custom/ScrapeNewsJob.php app-backend/app/Jobs/ScrapeNewsJob.php || true
cp laravel-custom/NewsController.php app-backend/app/Http/Controllers/NewsController.php || true
cp laravel-custom/api.php app-backend/routes/api.php || true
cp laravel-custom/RssFetchCommand.php app-backend/app/Console/Commands/RssFetchCommand.php || true
cp laravel-custom/create_news_table.php app-backend/database/migrations/2026_01_01_000000_create_news_table.php || true

# 6. Run Migrations
echo "Running Database Migrations..."
docker-compose exec -T app php artisan key:generate
docker-compose exec -T app php artisan migrate --force

# 7. Install Node dependencies for Scraper
echo "Setting up Playwright scraper..."
docker-compose exec -T scraper npm install

echo "Deployment complete!"
echo "You can check the Laravel logs or queue via standard artisan commands."
