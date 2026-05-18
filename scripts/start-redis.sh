#!/usr/bin/env bash
set -e
echo "[Redis] Starting Redis server on port 6379..."
exec redis-server --port 6379 --loglevel notice
