#!/bin/bash

# Wayfinder Demo - Solid Pod Setup Script
# ========================================
#
# This script sets up a local Community Solid Server (CSS) and
# seeds it with demo person and team profiles.
#
# The demo uses localhost:3002 for the Pod server.
# In production, each department would run their own Pod server:
#   - pods.dcs.gov.uk (Department for Citizen Support)
#   - pods.rts.gov.uk (Revenue & Taxation Service)
#   - pods.bia.gov.uk (Border & Identity Agency)
#   - etc.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POD_PORT=3002
POD_BASE_URL="http://localhost:${POD_PORT}"

echo "========================================"
echo "Wayfinder Demo - Solid Pod Setup"
echo "========================================"
echo ""

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "Error: npx is required. Please install Node.js first."
    exit 1
fi

# Check if server is already running
if curl -s "http://localhost:${POD_PORT}" > /dev/null 2>&1; then
    echo "Pod server already running on port ${POD_PORT}"
    echo "To restart, kill the existing process first."
    exit 0
fi

echo "Step 1: Creating data directory..."
mkdir -p "${SCRIPT_DIR}/.data"

echo ""
echo "Step 2: Starting Community Solid Server..."
echo "Server will run on ${POD_BASE_URL}"
echo ""

# Start CSS in the background
# Using file-based storage for persistence
# Note: CSS 7.x uses --seedConfig instead of --seededPodConfigJson
npx @solid/community-server \
    -p ${POD_PORT} \
    -c @css:config/file.json \
    -f "${SCRIPT_DIR}/.data" \
    --seedConfig "${SCRIPT_DIR}/seed-config.json" &

CSS_PID=$!
echo "Server starting with PID: ${CSS_PID}"

# Wait for server to be ready
echo ""
echo "Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s "http://localhost:${POD_PORT}" > /dev/null 2>&1; then
        echo "Server is ready!"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Verify server is running
if ! curl -s "http://localhost:${POD_PORT}" > /dev/null 2>&1; then
    echo "Error: Server failed to start"
    exit 1
fi

echo ""
echo "Step 3: Pod server is running!"
echo ""
echo "========================================"
echo "Demo Pods Available:"
echo "========================================"
echo ""
echo "Person Pods:"
echo "  • River Stone (DCS):  ${POD_BASE_URL}/river-stone/profile#me"
echo "  • Ash Morgan (RTS):   ${POD_BASE_URL}/ash-morgan/profile#me"
echo "  • Slate Wylder (BIA): ${POD_BASE_URL}/slate-wylder/profile#me"
echo "  • Flint Rivers (DSO): ${POD_BASE_URL}/flint-rivers/profile#me"
echo "  • Heath Willows (NHDS): ${POD_BASE_URL}/heath-willows/profile#me"
echo ""
echo "Team Pods:"
echo "  • Puffin Team (DCS):  ${POD_BASE_URL}/puffin-team/profile#team"
echo "  • Granite Team (DSO): ${POD_BASE_URL}/granite-team/profile#team"
echo "  • Wolf Team (BIA):    ${POD_BASE_URL}/wolf-team/profile#team"
echo ""
echo "========================================"
echo "Key Demo Points:"
echo "========================================"
echo ""
echo "1. NO CENTRAL DATABASE"
echo "   Data lives in Pods, not in Wayfinder"
echo ""
echo "2. DEPARTMENT SOVEREIGNTY"
echo "   Each department would run their own Pod server"
echo ""
echo "3. USER CONTROL"
echo "   People update their own profiles"
echo ""
echo "4. STANDARDS-BASED"
echo "   W3C Solid - Tim Berners-Lee's vision"
echo ""
echo "========================================"
echo ""
echo "To stop the server: kill ${CSS_PID}"
echo ""
