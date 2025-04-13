#!/bin/bash

# Load Docker images
echo "🔄 Loading Docker images..."
docker load < laravel.tar.gz
docker load < chat.tar.gz


# Start containers
echo "🚀 Starting Docker Compose..."
docker-compose -f docker-compose.prod.yml up -d --build
