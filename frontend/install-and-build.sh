#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Installing Dependencies${NC}"
echo -e "${BLUE}========================================${NC}"

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Dependencies installed successfully!${NC}\n"
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Building Project${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    # Build the project
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✅ Build completed successfully!${NC}\n"
        echo -e "${GREEN}You can now run: npm run preview${NC}"
    else
        echo -e "\n${RED}❌ Build failed!${NC}\n"
        exit 1
    fi
else
    echo -e "\n${RED}❌ Installation failed!${NC}\n"
    exit 1
fi
