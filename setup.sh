#!/bin/bash

echo "🚀 Setting up TaskFlow - Task Management System"
echo "================================================"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd ../backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "================================================"
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run start:dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001/api"
echo ""
echo "⚠️  Make sure MongoDB is running locally or update MONGODB_URI in backend/.env"
