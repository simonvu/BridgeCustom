#!/usr/bin/env bash

set -euo pipefail

theme_id="185206800684"
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

required_ignore_patterns=(
  "config/settings_data.json"
  "templates/*.json"
  "sections/*.json"
)

for pattern in "${required_ignore_patterns[@]}"; do
  if ! grep -Fqx "$pattern" .shopifyignore; then
    printf 'ERROR: .shopifyignore must contain %s\n' "$pattern" >&2
    exit 1
  fi
done

printf 'Deploying to LIVE theme %s without deleting remote files...\n' "$theme_id"
npx shopify theme push \
  --theme="$theme_id" \
  --allow-live \
  --nodelete \
  --ignore="config/settings_data.json" \
  --ignore="templates/*.json" \
  --ignore="sections/*.json" \
  --ignore="scripts/*.sh"