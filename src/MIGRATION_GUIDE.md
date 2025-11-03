# Pages Migration Guide

## Status: In Progress

The `/pages` folder contains legacy page component implementations that need to be integrated into the Next.js 15 App Router structure.

## Migration Strategy

Since the page component files are very large (1000+ lines each with complex logic), we have two options:

### Option 1: Component Library Approach (Recommended)
Keep page components as reusable components in `/components/page-components/`
- Maintains code organization
- Easier to test and maintain
- Components can be shared across routes

### Option 2: Inline Approach  
Move all logic directly into app router page files
- Simpler file structure
- Very large page.tsx files (3000+ lines)
- Harder to maintain

## Files to Migrate

| Source File | Destination | Status |
|------------|-------------|---------|
| /pages/home.tsx | /components/page-components/home.tsx | ⏳ Pending |
| /pages/about.tsx | /components/page-components/about.tsx | ⏳ Pending |
| /pages/auth.tsx | /components/page-components/auth.tsx | ⏳ Pending |
| /pages/chat.tsx | /components/page-components/chat.tsx | ⏳ Pending |
| /pages/contact.tsx | /components/page-components/contact.tsx | ⏳ Pending |
| /pages/history.tsx | /components/page-components/history.tsx | ⏳ Pending |
| /pages/how-it-works.tsx | /components/page-components/how-it-works.tsx | ⏳ Pending |
| /pages/notifications.tsx | /components/page-components/notifications.tsx | ⏳ Pending |
| /pages/parts-selection.tsx | /components/page-components/parts-selection.tsx | ⏳ Pending |
| /pages/products.tsx | /components/page-components/products.tsx | ⏳ Pending |
| /pages/quotes.tsx | /components/page-components/quotes.tsx | ⏳ Pending |
| /pages/request-flow.tsx | /components/page-components/request-flow.tsx | ⏳ Pending |
| /pages/supplier-dashboard.tsx | /components/page-components/supplier-dashboard.tsx | ⏳ Pending |
| /pages/supplier-onboarding.tsx | /components/page-components/supplier-onboarding.tsx | ⏳ Pending |
| /pages/supplier-profile.tsx | /components/page-components/supplier-profile.tsx | ⏳ Pending |
| /pages/suppliers-list.tsx | /components/page-components/suppliers-list.tsx | ⏳ Pending |
| /pages/suppliers.tsx | /components/page-components/suppliers.tsx | ⏳ Pending |
| /pages/admin-dashboard.tsx | /components/page-components/admin-dashboard.tsx | ⏳ Pending |
| /pages/vehicle-confirmation.tsx | /components/page-components/vehicle-confirmation.tsx | ⏳ Pending |

## Import Updates Needed

After migration, update imports in:

### App Router Files
- /app/(website)/page.tsx
- /app/(website)/about/page.tsx
- /app/(website)/auth/page.tsx
- /app/(website)/contact/page.tsx
- /app/(website)/how-it-works/page.tsx
- /app/(website)/parts-selection/page.tsx
- /app/(website)/supplier-profile/page.tsx
- /app/(website)/vehicle-confirmation/page.tsx
- /app/admin/dashboard/page.tsx
- /app/supplier/dashboard/page.tsx
- /app/supplier/onboarding/page.tsx
- /app/customer/quotes/page.tsx
- /app/customer/chat/page.tsx
- /app/customer/history/page.tsx
- /app/customer/notifications/page.tsx

### Legacy App.tsx
- /App.tsx (if still in use)

## Steps to Complete Migration

1. **Create /components/page-components/ directory**
2. **For each file in /pages:**
   - Copy to /components/page-components/
   - Update imports from `../components` to `@/components`
   - Add 'use client' if needed
   - Test the component
3. **Update all app router files:**
   - Change imports from `@/pages/[name]` to `@/components/page-components/[name]`
4. **Delete /pages folder**
5. **Delete /lib folder**
6. **Update /App.tsx** (if needed)

## Manual Steps Required

Due to file size (some files are 3000+ lines), this migration requires manual execution:

```bash
# 1. Create directory
mkdir -p components/page-components

# 2. Copy files (example for home.tsx)
cp pages/home.tsx components/page-components/home.tsx

# 3. Update imports in the copied file
# Change: import { Component } from "../components/..."
# To: import { Component } from "@/components/..."

# 4. Update app router file
# Change: import { HomePage } from '@/pages/home';
# To: import { HomePage } from '@/components/page-components/home';

# 5. Repeat for all 19 files

# 6. Clean up
rm -rf pages/
rm -rf lib/
```

## Testing Checklist

After migration, test:
- [ ] Home page loads correctly
- [ ] All public pages (about, contact, how-it-works, auth)
- [ ] Customer pages (quotes, chat, history, notifications)
- [ ] Supplier pages (dashboard, onboarding)
- [ ] Admin dashboard
- [ ] All navigation works
- [ ] No import errors in console
- [ ] No runtime errors

## Notes

- All page components use the pattern: `export function [Name]Page({ props })`
- They expect navigation callbacks: `onNavigate`, `onSignupClick`, etc.
- Most are client components ('use client') due to interactivity
- Some have complex state management that should be preserved

## Alternative: Automated Migration Script

A Node.js script could automate this:

```javascript
const fs = require('fs');
const path = require('path');

const pagesDir = 'pages';
const targetDir = 'components/page-components';

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Get all .tsx files in /pages
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  // Read source file
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  // Update imports
  content = content.replace(/from ['"]\.\.\//g, 'from "@/');
  content = content.replace(/from ['"]\.\//g, 'from "@/');
  
  // Write to target
  fs.writeFileSync(path.join(targetDir, file), content);
  console.log(`Migrated: ${file}`);
});

console.log('\nMigration complete! Now update app router imports.');
```

Run with: `node migrate-pages.js`
