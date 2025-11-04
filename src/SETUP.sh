#!/bin/bash

echo "🚀 PartsQuote - Next.js 16 Setup"
echo "================================="
echo ""

# Create required directories
echo "📁 Creating directories..."
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/guidelines
echo "✅ Directories created"

# Copy components
echo "📦 Copying components..."
if [ -d "components" ]; then
  cp -r components/* src/components/ 2>/dev/null || true
  echo "✅ Components copied to src/components/"
else
  echo "⚠️  No components folder found (might already be copied)"
fi

# Copy pages
echo "📄 Copying pages..."
if [ -d "pages" ]; then
  cp -r pages/* src/pages/ 2>/dev/null || true
  echo "✅ Pages copied to src/pages/"
else
  echo "⚠️  No pages folder found (might already be copied)"
fi

# Copy guidelines
echo "📋 Copying guidelines..."
if [ -d "guidelines" ]; then
  cp -r guidelines/* src/guidelines/ 2>/dev/null || true
  echo "✅ Guidelines copied to src/guidelines/"
else
  echo "⚠️  No guidelines folder found (might already be copied)"
fi

# Remove duplicate styles folder
echo "🎨 Cleaning up styles..."
if [ -d "styles" ]; then
  rm -rf styles
  echo "✅ Removed duplicate styles folder (using src/styles/)"
else
  echo "✅ No duplicate styles folder found"
fi

# Delete vite config if it exists
if [ -f "vite.config.ts" ]; then
  echo "🗑️  Removing vite.config.ts..."
  rm vite.config.ts
  echo "✅ Removed Vite config"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📂 Your structure is now:"
echo "   src/"
echo "   ├── app/"
echo "   ├── components/"
echo "   ├── pages/"
echo "   ├── styles/"
echo "   └── guidelines/"
echo ""
echo "🚀 Next steps:"
echo "   1. npm install"
echo "   2. npm run dev"
echo "   3. Open http://localhost:3000"
echo ""
