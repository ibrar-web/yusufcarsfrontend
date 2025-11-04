#!/bin/bash

echo "🔍 PartsQuote Setup Verification"
echo "=================================="
echo ""

# Check if src/components exists
if [ -d "src/components" ]; then
  echo "✅ src/components/ exists"
else
  echo "❌ src/components/ MISSING - Run SETUP.sh first"
  exit 1
fi

# Check if src/pages exists
if [ -d "src/pages" ]; then
  echo "✅ src/pages/ exists"
else
  echo "❌ src/pages/ MISSING - Run SETUP.sh first"
  exit 1
fi

# Check if src/styles exists
if [ -d "src/styles" ]; then
  echo "✅ src/styles/ exists"
else
  echo "❌ src/styles/ MISSING"
  exit 1
fi

# Check if duplicate styles exists
if [ -d "styles" ]; then
  echo "⚠️  Duplicate styles/ folder exists (should be deleted)"
else
  echo "✅ No duplicate styles/ folder"
fi

# Check if vite.config.ts exists
if [ -f "vite.config.ts" ]; then
  echo "⚠️  vite.config.ts exists (should be deleted)"
else
  echo "✅ No vite.config.ts found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo "✅ node_modules/ installed"
else
  echo "⚠️  node_modules/ not found - Run 'npm install'"
fi

# Check if package.json has Next.js
if grep -q '"next"' package.json; then
  echo "✅ Next.js in package.json"
else
  echo "❌ Next.js NOT in package.json"
  exit 1
fi

echo ""
echo "=================================="

# Count issues
if [ -d "src/components" ] && [ -d "src/pages" ] && [ -d "src/styles" ]; then
  echo "✅ Setup verification PASSED!"
  echo ""
  echo "Ready to run:"
  echo "  npm run dev"
else
  echo "❌ Setup verification FAILED"
  echo ""
  echo "Please run:"
  echo "  ./SETUP.sh"
  exit 1
fi
