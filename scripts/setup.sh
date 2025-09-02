#!/bin/bash

echo "🚀 Setting up Dylan Cafe Ordering System..."

# Create environment files
echo "📝 Creating environment files..."
cp backend/.env.example backend/.env
cp printer-service/.env.example printer-service/.env

# Build and start services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations and seeds
echo "🗄️  Running database migrations..."
cd backend && npm install && npm run migrate && npm run seed
cd ..

# Install dependencies for all services
echo "📦 Installing dependencies..."
cd backend && npm install && cd ..
cd printer-service && npm install && cd ..
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start all services: docker-compose up"
echo "2. Open frontend: http://localhost:5173"
echo "3. API available at: http://localhost:3001"
echo "4. Test printer: docker-compose exec printer-service node -e \"import('./src/services/PrinterService.js').then(m => new m.PrinterService().testPrint())\""
echo ""
echo "📱 For tablet testing:"
echo "1. Open http://localhost:5173 on tablet browser"
echo "2. Tap 'Add to Home Screen' when prompted"
echo "3. Launch from home screen for full-screen kiosk experience"