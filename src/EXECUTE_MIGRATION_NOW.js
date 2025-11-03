const fs = require('fs');
const path = require('path');

console.log('🚀 Starting immediate page migration...\n');

// Mapping of source files to destination
const migrations = [
  { from: 'pages/about.tsx', to: 'app/(website)/about/page.tsx' },
  { from: 'pages/home.tsx', to: 'app/(website)/page.tsx' },
  { from: 'pages/auth.tsx', to: 'app/(website)/auth/page.tsx' },
  { from: 'pages/contact.tsx', to: 'app/(website)/contact/page.tsx' },
  { from: 'pages/how-it-works.tsx', to: 'app/(website)/how-it-works/page.tsx' },
  { from: 'pages/parts-selection.tsx', to: 'app/(website)/parts-selection/page.tsx' },
  { from: 'pages/supplier-profile.tsx', to: 'app/(website)/supplier-profile/page.tsx' },
  { from: 'pages/vehicle-confirmation.tsx', to: 'app/(website)/vehicle-confirmation/page.tsx' },
  { from: 'pages/admin-dashboard.tsx', to: 'app/admin/dashboard/page.tsx' },
  { from: 'pages/supplier-dashboard.tsx', to: 'app/supplier/dashboard/page.tsx' },
  { from: 'pages/supplier-onboarding.tsx', to: 'app/supplier/onboarding/page.tsx' },
  { from: 'pages/quotes.tsx', to: 'app/customer/quotes/page.tsx' },
  { from: 'pages/chat.tsx', to: 'app/customer/chat/page.tsx' },
  { from: 'pages/history.tsx', to: 'app/customer/history/page.tsx' },
  { from: 'pages/notifications.tsx', to: 'app/customer/notifications/page.tsx' },
];

let successCount = 0;
let errorCount = 0;

migrations.forEach(({ from, to }) => {
  try {
    if (!fs.existsSync(from)) {
      console.log(`⚠️  Skip: ${from} (not found)`);
      return;
    }

    // Read source file
    let content = fs.readFileSync(from, 'utf8');
    
    // Update imports
    content = content.replace(/from ['"]\.\.\//g, 'from "@/');
    content = content.replace(/from ['"]\.\//g, 'from "@/');
    
    // Add 'use client' at the top if not present
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      content = `'use client';\n\n${content}`;
    }
    
    // Extract the component name and create wrapper
    const componentMatch = content.match(/export function (\w+)/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      
      // Add useRouter import if needed
      if (!content.includes('useRouter')) {
        content = content.replace(
          /^('use client';?\n)/m,
          "$1\nimport { useRouter } from 'next/navigation';\n"
        );
      }
      
      // Create the page component at the end
      const pageComponent = `\n\nexport default function Page() {
  const router = useRouter();
  
  return <${componentName} onNavigate={(path) => router.push(path === 'home' ? '/' : \`/\${path}\`)} />;
}`;
      
      content += pageComponent;
    }
    
    // Write to destination
    fs.writeFileSync(to, content);
    console.log(`✅ ${from} → ${to}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error migrating ${from}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Migration Summary:`);
console.log(`   ✅ Success: ${successCount}`);
console.log(`   ❌ Errors: ${errorCount}`);

if (successCount > 0) {
  console.log(`\n🗑️  Deleting /pages folder...`);
  try {
    fs.rmSync('pages', { recursive: true, force: true });
    console.log(`✅ /pages folder deleted`);
  } catch (error) {
    console.error(`❌ Error deleting /pages:`, error.message);
  }
  
  console.log(`\n🗑️  Deleting /lib folder if exists...`);
  try {
    if (fs.existsSync('lib')) {
      fs.rmSync('lib', { recursive: true, force: true });
      console.log(`✅ /lib folder deleted`);
    }
  } catch (error) {
    console.error(`❌ Error deleting /lib:`, error.message);
  }
}

console.log(`\n✨ Migration complete! Run: npm run dev\n`);
