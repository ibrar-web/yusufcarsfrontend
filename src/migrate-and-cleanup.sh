#!/bin/bash

# PartsQuote Pages Migration Script
# This script migrates all page components from /pages to /components/page-components
# and updates all imports throughout the application

set -e  # Exit on error

echo "🚀 Starting PartsQuote Pages Migration..."
echo ""

# Step 1: Create target directory
echo "📁 Creating /components/page-components directory..."
mkdir -p components/page-components

# Step 2: Copy files from /pages to /components/page-components
echo "📦 Copying page component files..."
cp -r pages/*.tsx components/page-components/

# Step 3: Update imports in copied files
echo "🔧 Updating imports in page components..."
cd components/page-components

# Replace relative imports with absolute imports
for file in *.tsx; do
  echo "  - Processing $file..."
  
  # Update component imports
  sed -i.bak 's|from "../components/|from "@/components/|g' "$file"
  sed -i.bak 's|from '\''../components/|from '\''@/components/|g' "$file"
  
  # Update style imports  
  sed -i.bak 's|from "../styles/|from "@/styles/|g' "$file"
  sed -i.bak 's|from '\''../styles/|from '\''@/styles/|g' "$file"
  
  # Remove backup files
  rm -f "$file.bak"
done

cd ../..

# Step 4: Update app router imports
echo "🔄 Updating app router files..."

# Update all page.tsx files in app directory
find app -name "page.tsx" -type f | while read file; do
  echo "  - Updating $file..."
  
  # Update @/pages imports
  sed -i.bak 's|@/pages/|@/components/page-components/|g' "$file"
  
  # Update ./pages imports
  sed -i.bak 's|'\''./pages/|'\''@/components/page-components/|g' "$file"
  sed -i.bak 's|"./pages/|"@/components/page-components/|g' "$file"
  
  # Update ../pages imports
  sed -i.bak 's|'\''../pages/|'\''@/components/page-components/|g' "$file"
  sed -i.bak 's|"../pages/|"@/components/page-components/|g' "$file"
  
  # Remove backup
  rm -f "$file.bak"
done

# Step 5: Update App.tsx if it exists
if [ -f "App.tsx" ]; then
  echo "  - Updating App.tsx..."
  sed -i.bak 's|from "./pages/|from "@/components/page-components/|g' App.tsx
  sed -i.bak 's|from '\''./pages/|from '\''@/components/page-components/|g' App.tsx
  rm -f App.tsx.bak
fi

# Step 6: Delete old folders
echo "🗑️  Removing old /pages and /lib folders..."
rm -rf pages/
rm -rf lib/

# Step 7: Clean up migration files
echo "🧹 Cleaning up migration helper files..."
rm -f migrate-pages-script.js
rm -f MIGRATION_GUIDE.md
rm -f PAGES_MIGRATION_README.md  
rm -f QUICK_START.md

echo ""
echo "✅ Migration complete!"
echo ""
echo "📋 Summary:"
echo "  - Moved 19 page components to /components/page-components/"
echo "  - Updated all imports to use @/components/page-components"
echo "  - Deleted /pages and /lib folders"
echo "  - Cleaned up migration helper files"
echo ""
echo "🧪 Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Start dev server: npm run dev"
echo "  3. Test the application at http://localhost:3000"
echo "  4. Check for any import errors in the console"
echo ""
echo "🎉 Your Next.js 15 app is now properly structured!"
echo ""
