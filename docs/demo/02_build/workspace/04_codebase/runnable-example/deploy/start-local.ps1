$env:PORT = if ($env:PORT) { $env:PORT } else { "8080" }
Write-Host "Starting school education runnable example on port $env:PORT"
node ../backend/server.mjs
