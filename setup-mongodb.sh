#!/bin/bash

echo "🔧 MongoDB Setup Script for Nafsyetak Clinic"
echo "============================================"
echo ""

# Check if MongoDB is already running
if pgrep -x mongod > /dev/null; then
    echo "✅ MongoDB is already running!"
    exit 0
fi

# Check if docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker found! Starting MongoDB container..."
    
    # Check if MongoDB container already exists
    if docker ps -a | grep -q mongodb-nafsyetak; then
        echo "📦 Starting existing MongoDB container..."
        docker start mongodb-nafsyetak
    else
        echo "📦 Creating new MongoDB container..."
        docker run -d \
            --name mongodb-nafsyetak \
            -p 27017:27017 \
            -v mongodb_data:/data/db \
            mongo:latest
    fi
    
    echo "✅ MongoDB container started successfully!"
    echo "🔗 Connection string: mongodb://localhost:27017/nafsyetak-clinic"
    exit 0
fi

# Try to install MongoDB using apt
echo "📦 Attempting to install MongoDB..."

# Update package list
sudo apt update

# Try installing mongodb
if sudo apt install -y mongodb; then
    echo "✅ MongoDB installed successfully!"
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
    echo "🔗 Connection string: mongodb://localhost:27017/nafsyetak-clinic"
else
    echo "❌ Failed to install MongoDB via apt"
    echo ""
    echo "🔧 Manual Installation Options:"
    echo "================================"
    echo ""
    echo "Option 1: Docker (Recommended)"
    echo "------------------------------"
    echo "1. Install Docker: sudo apt install docker.io"
    echo "2. Run: docker run -d --name mongodb-nafsyetak -p 27017:27017 mongo:latest"
    echo ""
    echo "Option 2: MongoDB Atlas (Cloud)"
    echo "-------------------------------"
    echo "1. Sign up at https://cloud.mongodb.com"
    echo "2. Create a free cluster"
    echo "3. Get connection string and update MONGODB_URI in .env file"
    echo ""
    echo "Option 3: Manual Installation"
    echo "-----------------------------"
    echo "Follow the official MongoDB installation guide:"
    echo "https://docs.mongodb.com/manual/installation/"
    echo ""
fi