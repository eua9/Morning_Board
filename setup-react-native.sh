#!/bin/bash

# Setup script for Morning Board React Native project
# This script initializes a new React Native project using Expo

set -e

echo "🚀 Setting up Morning Board React Native project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   1. Visit https://nodejs.org/ and download the LTS version"
    echo "   2. Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "      Then: nvm install 18 && nvm use 18"
    exit 1
fi

# Check Node.js version (should be >= 16)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the Morning_Board project root directory"
    exit 1
fi

# Check if project is already initialized
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    echo "⚠️  Project appears to be already initialized."
    read -p "Do you want to reinitialize? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping initialization."
        exit 0
    fi
    echo "Cleaning up existing project files..."
    rm -rf node_modules package.json package-lock.json yarn.lock
fi

# Choose between Expo and React Native CLI
echo ""
echo "Choose your React Native setup:"
echo "1) Expo (Recommended - easier setup, managed workflow)"
echo "2) React Native CLI (Bare workflow, more control)"
read -p "Enter choice (1 or 2, default: 1): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[2]$ ]]; then
    echo "📦 Initializing React Native project with React Native CLI..."
    
    # Install React Native CLI globally if not present
    if ! command -v react-native &> /dev/null; then
        npm install -g react-native-cli
    fi
    
    # Create React Native project in a temporary directory then move files
    TEMP_DIR=$(mktemp -d)
    react-native init MorningBoard --directory "$TEMP_DIR"
    
    # Move files to current directory
    cp -r "$TEMP_DIR"/* .
    cp -r "$TEMP_DIR"/.* . 2>/dev/null || true
    rm -rf "$TEMP_DIR"
    
    echo "✅ React Native CLI project initialized!"
else
    echo "📦 Initializing React Native project with Expo..."
    
    # Install Expo CLI
    npx create-expo-app@latest . --template blank-typescript
    
    echo "✅ Expo project initialized!"
fi

# Install additional dependencies
echo "📦 Installing additional development dependencies..."
npm install --save-dev \
    @types/react \
    @types/react-native \
    eslint \
    prettier \
    typescript

# Create Prettier config
cat > .prettierrc.json << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Create ESLint config if it doesn't exist
if [ ! -f ".eslintrc.js" ] && [ ! -f ".eslintrc.json" ]; then
    cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "expo",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
EOF
fi

echo ""
echo "✅ Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Open VS Code and install recommended extensions"
echo "2. For Expo: Run 'npm start' to start the development server"
echo "3. For React Native CLI:"
echo "   - iOS: Run 'cd ios && pod install && cd ..' then 'npm run ios'"
echo "   - Android: Make sure Android Studio is set up, then 'npm run android'"
echo ""
echo "📱 Happy coding!"

