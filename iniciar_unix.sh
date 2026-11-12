#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
printf '%s\n' 'Servidor local iniciado em http://localhost:8000'
python3 -m http.server 8000
