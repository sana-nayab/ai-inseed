#!/bin/bash

echo "🚀 Starting Dylan Cafe Ordering System in development mode..."

# Start database and Redis
echo "🐳 Starting database and Redis..."
docker-compose up -d postgres redis

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

# Check if printer service dependencies are installed
if [ ! -d "printer-service/node_modules" ]; then
  echo "📦 Installing printer service dependencies..."
  cd printer-service && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Run migrations and seeds
echo "🗄️  Setting up database..."
cd backend && npm run migrate && npm run seed && cd ..

# Start all services in parallel
echo "🎯 Starting all services..."

# Start backend
cd backend && npm run dev &
BACKEND_PID=$!

# Start printer service  
cd printer-service && npm run dev &
PRINTER_PID=$!

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ All services started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend: http://localhost:3001"
echo "🖨️  Printer service: Running"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'kill $BACKEND_PID $PRINTER_PID $FRONTEND_PID; docker-compose down; exit' INT
wait