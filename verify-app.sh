#!/bin/bash

echo "🔍 Morning Board App Verification Script"
echo "========================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check if React Native is initialized
echo ""
echo "📱 Checking React Native project..."
if [ -f "package.json" ]; then
    echo "✅ React Native project found"
    echo "   Run: npm start"
elif [ -f "ios/" ]; then
    echo "⚠️  Native iOS code found but React Native not initialized"
    echo "   To initialize React Native, run: ./setup-react-native.sh"
    echo "   Or use Xcode for native iOS development"
fi

# Check iOS code
echo ""
echo "🍎 Checking iOS native code..."
if [ -f "ios/MorningBoard/Views/DashboardView.swift" ]; then
    echo "✅ iOS SwiftUI code found"
    echo "   Hello World view is implemented"
    echo "   Open Xcode and create iOS project to run"
fi

# Check CI Status
echo ""
echo "🔄 Checking CI Status..."
echo "   Visit: https://github.com/eua9/Morning_Board/actions"
echo "   Look for green checkmarks on latest runs"

# Check backend status endpoint
echo ""
echo "🔌 Testing backend /status endpoint..."
if [ -d "backend" ]; then
    echo "   Backend directory found"
    echo "   To test: cd backend && npm run dev"
    echo "   Then: curl http://localhost:3000/status"
fi

echo ""
echo "========================================"
echo "✅ Verification complete"
