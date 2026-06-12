#!/usr/bin/env sh
set -eu

export PORT="${PORT:-8080}"
echo "Starting school education runnable example on port ${PORT}"
node ../backend/server.mjs
