#!/bin/bash

# Start Docker services for development
# This script starts PostgreSQL and Redis using Docker Compose

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🐳 Starting Docker services...${NC}"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop or Docker daemon${NC}"
    exit 1
fi

# Check if docker-compose is available
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi

# Start only postgres and redis services
echo -e "${GREEN}📦 Starting PostgreSQL and Redis...${NC}"
$COMPOSE_CMD up -d postgres redis

# Wait for services to be healthy
echo -e "${GREEN}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check PostgreSQL
echo -e "${GREEN}🔍 Checking PostgreSQL...${NC}"
for i in {1..30}; do
    if docker exec $(docker ps -q -f name=postgres) pg_isready -U admin -d mental_health_db &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
    sleep 1
done

# Check Redis
echo -e "${GREEN}🔍 Checking Redis...${NC}"
for i in {1..30}; do
    if docker exec $(docker ps -q -f name=redis) redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Redis failed to start${NC}"
        exit 1
    fi
    sleep 1
done

echo -e "${GREEN}✅ All services are running!${NC}"
echo ""
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
echo ""
echo "To stop services: ./scripts/wsl-stop-services.sh"
echo "To view logs: docker compose logs -f"


