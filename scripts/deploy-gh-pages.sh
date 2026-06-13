#!/usr/bin/env bash
# Build the static site and publish it to the `gh-pages` branch.
# Usage: npm run deploy   (run from the repo root)
set -euo pipefail

REPO_URL="$(git config --get remote.origin.url)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▶ Building static export (GH_PAGES=true)…"
GH_PAGES=true npm run build

# .nojekyll stops GitHub Pages from running Jekyll, which would drop the _next/ dir
touch out/.nojekyll

echo "▶ Publishing out/ to gh-pages…"
cd out
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.email=deploy@local -c user.name=deploy commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -fq "$REPO_URL" gh-pages
cd "$ROOT"
rm -rf out/.git

echo "✓ Deployed. Pages will refresh in ~1 min."
