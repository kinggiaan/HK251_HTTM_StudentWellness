#!/bin/bash
# Start ML Python Service

echo "🚀 Starting ML Python Service on port 8000..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found! Please install Python 3.8+"
    exit 1
fi

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
echo "🔧 Activating virtual environment..."
source ./venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Start server
echo "✅ Starting FastAPI server..."
echo "📡 ML Service will be available at http://localhost:8000"
echo "📚 API docs at http://localhost:8000/docs"
echo ""
python main.py
