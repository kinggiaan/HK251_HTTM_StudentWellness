#!/bin/bash

# Stop Docker services

set -e

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🛑 Stopping Docker services...${NC}"

if docker compose version &> /dev/null; then
    docker compose stop postgres redis
elif command -v docker-compose &> /dev/null; then
    docker-compose stop postgres redis
else
    echo "Docker Compose not found"
    exit 1
fi

echo -e "${GREEN}✅ Services stopped${NC}"


