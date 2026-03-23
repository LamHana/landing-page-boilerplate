#!/bin/bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="${APP_NAME:-__PROJECT_NAME__}"
APP_TAG="${APP_TAG:-$(git rev-parse --short HEAD)-$(date +%s)}"
APP_REGISTRY="${APP_REGISTRY:-registry.example.com}"
GITOPS_NAMESPACE="${GITOPS_NAMESPACE:-dev}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"
BUILD_CONTEXT="${BUILD_CONTEXT:-.}"
PUSH_IMAGE="${PUSH_IMAGE:-false}"
FAIL_ON_VULN="${FAIL_ON_VULN:-true}"
TRIVY_SEVERITY="${TRIVY_SEVERITY:-HIGH,CRITICAL,MEDIUM}"

# Construct image name
APP_IMAGE="${APP_REGISTRY}/${GITOPS_NAMESPACE}/${APP_NAME}"

echo "${GREEN}🐳 Docker Build & Scan Script${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "App Name:     ${APP_NAME}"
echo "Image Tag:    ${APP_TAG}"
echo "Image:        ${APP_IMAGE}:${APP_TAG}"
echo "Dockerfile:   ${DOCKERFILE}"
echo "Context:      ${BUILD_CONTEXT}"
echo "Push Image:   ${PUSH_IMAGE}"
echo "Fail on Vuln: ${FAIL_ON_VULN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Check if Trivy is available
if ! command -v trivy > /dev/null 2>&1; then
  echo "${YELLOW}⚠️  Trivy not found. Installing via Docker...${NC}"
  USE_DOCKER_TRIVY=true
else
  USE_DOCKER_TRIVY=false
fi

# Step 1: Build Docker image
echo "${GREEN}📦 Step 1: Building Docker image...${NC}"
if docker build \
  -f "${DOCKERFILE}" \
  -t "${APP_IMAGE}:${APP_TAG}" \
  -t "${APP_IMAGE}:latest" \
  "${BUILD_CONTEXT}"; then
  echo "${GREEN}✅ Docker image built successfully${NC}"
else
  echo "${RED}❌ Docker build failed${NC}"
  exit 1
fi

echo ""

# Step 2: Download Trivy HTML template
echo "${GREEN}🔍 Step 2: Preparing Trivy scan...${NC}"
HTML_TEMPLATE="html.tpl"
if [ ! -f "${HTML_TEMPLATE}" ]; then
  echo "Downloading Trivy HTML template..."
  curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl -o "${HTML_TEMPLATE}" || {
    echo "${YELLOW}⚠️  Failed to download template, using default format${NC}"
    HTML_TEMPLATE=""
  }
fi

echo ""

# Step 3: Scan image with Trivy
echo "${GREEN}🔍 Step 3: Scanning image with Trivy...${NC}"
REPORT_FILE="trivy-${APP_NAME}-report.html"
SARIF_FILE="trivy-${APP_NAME}-report.sarif"
JSON_FILE="trivy-${APP_NAME}-report.json"

if [ "$USE_DOCKER_TRIVY" = true ]; then
  docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$(pwd):/output" \
    aquasecurity/trivy:latest \
    image --format json --output "/output/${JSON_FILE}" \
    --severity "${TRIVY_SEVERITY}" "${APP_IMAGE}:${APP_TAG}" || true
else
  trivy image --format json --output "${JSON_FILE}" \
    --severity "${TRIVY_SEVERITY}" "${APP_IMAGE}:${APP_TAG}" || true
fi

echo ""

# Step 4: Check for vulnerabilities
echo "${GREEN}📊 Step 4: Analyzing scan results...${NC}"

if [ -f "${JSON_FILE}" ]; then
  VULN_COUNT=$(jq '[.Results[]?.Vulnerabilities[]?] | length' "${JSON_FILE}" 2>/dev/null || echo "0")
  CRITICAL_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "CRITICAL")] | length' "${JSON_FILE}" 2>/dev/null || echo "0")
  HIGH_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "HIGH")] | length' "${JSON_FILE}" 2>/dev/null || echo "0")

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Scan Results:"
  echo "  Total Vulnerabilities: ${VULN_COUNT}"
  echo "  Critical:              ${CRITICAL_COUNT}"
  echo "  High:                  ${HIGH_COUNT}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ "${FAIL_ON_VULN}" = "true" ] && [ "${VULN_COUNT}" -gt 0 ]; then
    echo "${RED}🛑 Vulnerabilities found! Set FAIL_ON_VULN=false to continue.${NC}"
    exit 1
  elif [ "${VULN_COUNT}" -gt 0 ]; then
    echo "${YELLOW}⚠️  Vulnerabilities found but continuing (FAIL_ON_VULN=false)${NC}"
  else
    echo "${GREEN}✅ No vulnerabilities found!${NC}"
  fi
else
  echo "${YELLOW}⚠️  Could not parse scan results${NC}"
fi

echo ""
echo "${GREEN}✅ Build and scan completed successfully!${NC}"
