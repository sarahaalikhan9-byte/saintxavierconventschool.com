#!/bin/bash

# 🚀 One-Command Firebase Deployment Script
# For: Saint Xavier Convent School Social Media Dashboard

echo "🚀 शुरू करते हैं Firebase Deploy..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Firebase CLI
echo -e "${YELLOW}Step 1: Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Firebase CLI not found!${NC}"
    echo "Install करो: npm install -g firebase-tools"
    exit 1
fi
echo -e "${GREEN}✓ Firebase CLI installed${NC}"
echo ""

# Step 2: Check Node modules
echo -e "${YELLOW}Step 2: Checking Node modules...${NC}"
if [ ! -d "node_modules" ]; then
    echo "node_modules नहीं है। Installing..."
    npm install
fi
echo -e "${GREEN}✓ Node modules ready${NC}"
echo ""

# Step 3: Clean करो
echo -e "${YELLOW}Step 3: Cleaning...${NC}"
npm run clean
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 4: Build करो
echo -e "${YELLOW}Step 4: Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 5: Deploy करो
echo -e "${YELLOW}Step 5: Deploying to Firebase...${NC}"
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Deployment Successful! 🎉${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Your dashboard is live at:"
    echo "https://saint-xavier-convent-school.web.app/social-dashboard"
    echo ""
    echo "Dashboard लॉगिन करने के लिए अपना password use करो!"
    echo ""
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi
