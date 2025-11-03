/**
 * Automated Pages Migration Script
 * 
 * This script migrates all files from /pages to /components/page-components
 * and updates imports from relative to absolute (@/) paths.
 * 
 * Usage: node migrate-pages-script.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'pages';
const TARGET_DIR = 'components/page-components';

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`✓ Created directory: ${TARGET_DIR}`);
}

// Get all .tsx files in /pages
const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.tsx'));

console.log(`\n📦 Found ${files.length} page component files to migrate\n`);

files.forEach(file => {
  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(TARGET_DIR, file);
  
  // Read source file
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Update imports:
  // ../components/... → @/components/...
  content = content.replace(/from ['"]\.\.\/components\//g, 'from "@/components/');
  
  // ../styles/... → @/styles/...
  content = content.replace(/from ['"]\.\.\/styles\//g, 'from "@/styles/');
  
  // ./components/... → @/components/...  
  content = content.replace(/from ['"]\.\/components\//g, 'from "@/components/');
  
  // Write to target
  fs.writeFileSync(targetPath, content);
  console.log(`✓ Migrated: ${file} → ${TARGET_DIR}/${file}`);
});

console.log(`\n✅ Migration complete! ${files.length} files migrated.\n`);

// List of app router files that need import updates
const appRouterFiles = [
  'App.tsx',
  'app/(website)/page.tsx',
  'app/(website)/about/page.tsx',
  'app/(website)/auth/page.tsx',
  'app/(website)/contact/page.tsx',
  'app/(website)/how-it-works/page.tsx',
  'app/(website)/parts-selection/page.tsx',
  'app/(website)/supplier-profile/page.tsx',
  'app/(website)/vehicle-confirmation/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/supplier/dashboard/page.tsx',
  'app/supplier/onboarding/page.tsx',
  'app/customer/quotes/page.tsx',
  'app/customer/chat/page.tsx',
  'app/customer/history/page.tsx',
  'app/customer/notifications/page.tsx',
];

console.log('📝 Now updating imports in app router files...\n');

let updatedCount = 0;
appRouterFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Update imports:
    // @/pages/... → @/components/page-components/...
    content = content.replace(/@\/pages\//g, '@/components/page-components/');
    
    // ./pages/... → @/components/page-components/...
    content = content.replace(/from ['"]\.\/pages\//g, 'from "@/components/page-components/');
    
    // ../pages/... → @/components/page-components/...
    content = content.replace(/from ['"]\.\.\/pages\//g, 'from "@/components/page-components/');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Updated imports in: ${filePath}`);
      updatedCount++;
    }
  }
});

console.log(`\n✅ Updated ${updatedCount} app router files.\n`);

console.log('🗑️  You can now safely delete:');
console.log('   - /pages directory');
console.log('   - /lib directory');
console.log('\nRun: rm -rf pages/ lib/\n');

console.log('🧪 Next steps:');
console.log('   1. Test the application: npm run dev');
console.log('   2. Check for any import errors');
console.log('   3. Delete /pages and /lib if everything works');
console.log('   4. Delete this migration script\n');
