#!/bin/bash

# WSL Setup Script for Backend
# This script helps set up the development environment on WSL

set -e

echo "🚀 Setting up Backend for WSL..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on WSL
if [ -z "$WSL_DISTRO_NAME" ] && [ -z "$WSLENV" ]; then
    echo -e "${YELLOW}⚠️  Warning: This doesn't appear to be WSL. Continue anyway? (y/n)${NC}"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

# Check Node.js version
echo -e "${GREEN}📦 Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Installing Node.js 20...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo -e "${YELLOW}⚠️  Node.js version is less than 20. Please upgrade to Node.js 20+${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
    fi
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm -v) found${NC}"
fi

# Check Docker
echo -e "${GREEN}🐳 Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker not found. Installing Docker...${NC}"
    # Install Docker on WSL
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${YELLOW}⚠️  Please log out and log back in for Docker group changes to take effect${NC}"
else
    echo -e "${GREEN}✅ Docker $(docker --version) found${NC}"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose not found${NC}"
else
    echo -e "${GREEN}✅ Docker Compose found${NC}"
fi

# Install dependencies
echo -e "${GREEN}📦 Installing npm dependencies...${NC}"
npm install

# Generate Prisma Client
echo -e "${GREEN}🔧 Generating Prisma Client...${NC}"
npm run prisma:generate

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${GREEN}📝 Creating .env file from env.example...${NC}"
    cp env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Generate JWT secrets if not set
if ! grep -q "JWT_SECRET=change-me" .env || grep -q "JWT_SECRET=change-me" .env; then
    echo -e "${GREEN}🔐 Generating secure JWT secrets...${NC}"
    JWT_SECRET=$(openssl rand -hex 32)
    REFRESH_SECRET=$(openssl rand -hex 32)
    
    # Update .env file
    if command -v sed &> /dev/null; then
        sed -i "s/JWT_SECRET=change-me/JWT_SECRET=$JWT_SECRET/" .env
        sed -i "s/REFRESH_TOKEN_SECRET=change-me-too/REFRESH_TOKEN_SECRET=$REFRESH_SECRET/" .env
        echo -e "${GREEN}✅ JWT secrets generated and updated in .env${NC}"
    else
        echo -e "${YELLOW}⚠️  Please manually update JWT_SECRET and REFRESH_TOKEN_SECRET in .env${NC}"
    fi
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Start Docker services: ./scripts/wsl-start-services.sh"
echo "2. Run migrations: npm run migrate:dev"
echo "3. Seed database (optional): npm run seed"
echo "4. Start dev server: npm run dev"


