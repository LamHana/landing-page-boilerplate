#!/bin/bash
# Lighthouse CI check — runs against the production build
# Requires: Next.js build complete, @lhci/cli installed

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PORT="${LIGHTHOUSE_PORT:-3000}"
START_TIMEOUT=30 # seconds to wait for server to be ready

# Check if lhci is available
if ! npx lhci --version > /dev/null 2>&1; then
  echo "${RED}❌ @lhci/cli not found. Run: npm install --save-dev @lhci/cli${NC}"
  exit 1
fi

# Check if build output exists
if [ ! -d ".next" ]; then
  echo "${RED}❌ No .next directory found. Run 'npm run build' first.${NC}"
  exit 1
fi

# Start Next.js production server in background
echo "Starting Next.js server on port ${PORT}..."
npm run start -- --port "${PORT}" &
SERVER_PID=$!

# Ensure server is killed on script exit
cleanup() {
  echo "Stopping server (PID ${SERVER_PID})..."
  kill "${SERVER_PID}" 2>/dev/null || true
}
trap cleanup EXIT

# Wait for server to be ready
echo "Waiting for server to be ready..."
ELAPSED=0
until curl -sf "http://localhost:${PORT}" > /dev/null 2>&1; do
  if [ "${ELAPSED}" -ge "${START_TIMEOUT}" ]; then
    echo "${RED}❌ Server did not start within ${START_TIMEOUT}s${NC}"
    exit 1
  fi
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done
echo "${GREEN}Server ready after ${ELAPSED}s${NC}"

# Run Lighthouse CI
echo "Running Lighthouse CI..."
npx lhci autorun --config=.lighthouserc.json

# Print score summary from the latest LHR JSON
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Lighthouse Score Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node -e "
const fs = require('fs');
const dir = '.lighthouseci';
const lhrs = fs.readdirSync(dir).filter(f => f.startsWith('lhr-') && f.endsWith('.json'));
if (!lhrs.length) { console.log('No LHR results found.'); process.exit(0); }
const lhr = JSON.parse(fs.readFileSync(dir + '/' + lhrs[lhrs.length - 1], 'utf8'));
const cats = lhr.categories;
const score = (s) => Math.round(s * 100);
const icon = (s) => s >= 90 ? '🟢' : s >= 50 ? '🟡' : '🔴';
const fmt = (label, s) => console.log(icon(s) + '  ' + label.padEnd(18) + s);
fmt('Performance',    score(cats.performance.score));
fmt('Accessibility',  score(cats.accessibility.score));
fmt('Best Practices', score(cats['best-practices'].score));
fmt('SEO',            score(cats.seo.score));
console.log('');
const audits = lhr.audits;
const ms = (v) => v >= 1000 ? (v/1000).toFixed(1) + 's' : Math.round(v) + 'ms';
console.log('  FCP : ' + ms(audits['first-contentful-paint'].numericValue));
console.log('  LCP : ' + ms(audits['largest-contentful-paint'].numericValue));
console.log('  TBT : ' + ms(audits['total-blocking-time'].numericValue));
console.log('  CLS : ' + audits['cumulative-layout-shift'].numericValue.toFixed(3));
console.log('  TTI : ' + ms(audits['interactive'].numericValue));
"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "${GREEN}✅ Lighthouse checks completed${NC}"
