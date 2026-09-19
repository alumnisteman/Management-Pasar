#!/usr/bin/env bash
set -euo pipefail

# Function to print status with colors
status_color() {
  if [[ $1 == "OK" ]]; then
    echo -e "\e[32m$2: $1\e[0m"
  else
    echo -e "\e[31m$2: $1\e[0m"
  fi
}

echo "================================"
echo "APPLICATION HEALTH"
echo "================================"

# Backend
if docker inspect --format "{{.State.Health.Status}}" management-pasar-backend-1 2>/dev/null | grep -q "healthy"; then
  status_color "OK" "Backend"
else
  status_color "FAIL" "Backend"
fi

# Worker
if docker inspect --format "{{.State.Health.Status}}" management-pasar-worker-1 2>/dev/null | grep -q "healthy"; then
  status_color "OK" "Worker"
else
  status_color "FAIL" "Worker"
fi

# MySQL
if docker inspect --format "{{.State.Health.Status}}" management-pasar-mysql-1 2>/dev/null | grep -q "healthy"; then
  status_color "OK" "Database"
else
  status_color "FAIL" "Database"
fi

# Redis
if docker inspect --format "{{.State.Health.Status}}" management-pasar-redis-1 2>/dev/null | grep -q "healthy"; then
  status_color "OK" "Redis"
else
  status_color "FAIL" "Redis"
fi

# Frontend (simple curl)
if curl -sSf http://localhost:4000 >/dev/null; then
  status_color "OK" "Frontend"
else
  status_color "FAIL" "Frontend"
fi

# Application URL
echo "Application : http://localhost"

echo "Status       : $(if docker ps -q | wc -l | grep -q '^0$'; then echo "STOPPED"; else echo "HEALTHY"; fi)"

echo "================================"
