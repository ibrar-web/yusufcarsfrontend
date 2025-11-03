# Pages Migration - Action Required

## Current Situation

The `/pages` folder contains 19 large page component files (each 1000-3000 lines) that are imported by the Next.js 15 app router files.

## Why Manual Migration is Needed

The AI assistant cannot:
- Execute bash/shell commands to move files
- Run Node.js scripts to automate file operations  
- Copy large files in a single operation (file size limits)

## Quick Migration Steps

### Option 1: Use the Automated Script (Recommended)

Run the provided migration script:

```bash
node migrate-pages-script.js
```

This will:
1. Create `/components/page-components/` directory
2. Copy all files from `/pages` to `/components/page-components`
3. Update imports from relative (`../components`) to absolute (`@/components`)
4. Update all app router files to import from new location
5. Provide confirmation and next steps

After the script runs successfully:
```bash
# Delete old folders
rm -rf pages/
rm -rf lib/

# Delete migration files
rm migrate-pages-script.js
rm MIGRATION_GUIDE.md
rm PAGES_MIGRATION_README.md

# Test the app
npm run dev
```

### Option 2: Manual Migration

If you prefer to do it manually:

```bash
# 1. Create target directory
mkdir -p components/page-components

# 2. Copy files
cp pages/*.tsx components/page-components/

# 3. Update imports in copied files
# In each file in components/page-components/, replace:
#   from "../components/     →  from "@/components/
#   from "../styles/         →  from "@/styles/

# You can use sed for batch replacement:
cd components/page-components
sed -i 's/from "\.\.\/components\//from "@\/components\//g' *.tsx
sed -i 's/from "\.\.\/styles\//from "@\/styles\//g' *.tsx
cd ../..

# 4. Update app router imports
# In each app router file, replace:
#   from '@/pages/           →  from '@/components/page-components/
#   from './pages/           →  from '@/components/page-components/
#   from '../pages/          →  from '@/components/page-components/

# Batch update with sed:
find app -name "*.tsx" -type f -exec sed -i 's/@\/pages\//@\/components\/page-components\//g' {} +
sed -i 's/@\/pages\//@\/components\/page-components\//g' App.tsx

# 5. Clean up
rm -rf pages/
rm -rf lib/
```

### Option 3: Keep as-is (Not Recommended)

You can keep the `/pages` folder, but rename it to clarify it's not Next.js pages:

```bash
mv pages page-components-legacy
```

Then update all imports:
```bash
find app -name "*.tsx" -type f -exec sed -i 's/@\/pages\//@\/page-components-legacy\//g' {} +
sed -i 's/\.\/pages\//\.\/page-components-legacy\//g' App.tsx
```

## Files That Will Be Migrated

| File | Size (approx) | Used By |
|------|---------------|---------|
| home.tsx | ~3000 lines | app/(website)/page.tsx |
| about.tsx | ~800 lines | app/(website)/about/page.tsx |
| auth.tsx | ~600 lines | app/(website)/auth/page.tsx |
| chat.tsx | ~900 lines | app/customer/chat/page.tsx |
| contact.tsx | ~500 lines | app/(website)/contact/page.tsx |
| history.tsx | ~700 lines | app/customer/history/page.tsx |
| how-it-works.tsx | ~900 lines | app/(website)/how-it-works/page.tsx |
| notifications.tsx | ~400 lines | app/customer/notifications/page.tsx |
| parts-selection.tsx | ~1200 lines | app/(website)/parts-selection/page.tsx |
| products.tsx | ~1100 lines | Legacy/unused? |
| quotes.tsx | ~1500 lines | app/customer/quotes/page.tsx |
| request-flow.tsx | ~1000 lines | Legacy/used by App.tsx |
| supplier-dashboard.tsx | ~1200 lines | app/supplier/dashboard/page.tsx |
| supplier-onboarding.tsx | ~1800 lines | app/supplier/onboarding/page.tsx |
| supplier-profile.tsx | ~1400 lines | app/(website)/supplier-profile/page.tsx |
| suppliers-list.tsx | ~800 lines | Legacy/unused? |
| suppliers.tsx | ~600 lines | Legacy/unused? |
| admin-dashboard.tsx | ~1100 lines | app/admin/dashboard/page.tsx |
| vehicle-confirmation.tsx | ~800 lines | app/(website)/vehicle-confirmation/page.tsx |

## Import Updates Needed

### App Router Files (16 files)

```
app/(website)/page.tsx
app/(website)/about/page.tsx
app/(website)/auth/page.tsx
app/(website)/contact/page.tsx
app/(website)/how-it-works/page.tsx
app/(website)/parts-selection/page.tsx
app/(website)/supplier-profile/page.tsx
app/(website)/vehicle-confirmation/page.tsx
app/admin/dashboard/page.tsx
app/supplier/dashboard/page.tsx
app/supplier/onboarding/page.tsx
app/customer/quotes/page.tsx
app/customer/chat/page.tsx
app/customer/history/page.tsx
app/customer/notifications/page.tsx
App.tsx (legacy wrapper)
```

### Pattern to Replace

**Before:**
```typescript
import { HomePage } from '@/pages/home';
import { AboutPage } from '@/pages/about';
```

**After:**
```typescript
import { HomePage } from '@/components/page-components/home';
import { AboutPage } from '@/components/page-components/about';
```

## Testing After Migration

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check console for import errors**

3. **Test each page:**
   - ✅ Home page (/)
   - ✅ About (/about)
   - ✅ Contact (/contact)
   - ✅ How It Works (/how-it-works)
   - ✅ Auth (/auth)
   - ✅ Vehicle Confirmation (/vehicle-confirmation)
   - ✅ Parts Selection (/parts-selection)
   - ✅ Supplier Profile (/supplier-profile)
   - ✅ Admin Dashboard (/admin/dashboard)
   - ✅ Supplier Dashboard (/supplier/dashboard)
   - ✅ Supplier Onboarding (/supplier/onboarding)
   - ✅ Customer Quotes (/customer/quotes)
   - ✅ Customer Chat (/customer/chat)
   - ✅ Customer History (/customer/history)
   - ✅ Customer Notifications (/customer/notifications)

4. **Verify no TypeScript errors:**
   ```bash
   npm run build
   ```

## Why This Structure?

**Next.js 15 App Router Best Practices:**
- `/app/*` = Routes and layouts only
- `/components/*` = Reusable components (including page components)
- `/lib/*` = Utilities and helpers
- `/pages/*` = ❌ Conflicts with Next.js legacy routing

By moving to `/components/page-components/`, we:
- Follow Next.js 15 conventions
- Keep code organized
- Avoid naming conflicts
- Make it clear these are components, not routes

## Need Help?

If you encounter issues:

1. Check the browser console for import errors
2. Check the terminal for TypeScript errors
3. Verify file paths are correct
4. Ensure all files were copied
5. Check that imports were updated correctly

## After Successful Migration

Delete these migration helper files:
```bash
rm migrate-pages-script.js
rm MIGRATION_GUIDE.md
rm PAGES_MIGRATION_README.md
```

✨ Your Next.js 15 app router structure will be clean and properly organized!
