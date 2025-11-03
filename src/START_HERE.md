# ⚡ START HERE - Complete Migration in One Command

## Run This Single Command:

```bash
node EXECUTE_MIGRATION_NOW.js && npm install && npm run dev
```

## What This Does:

1. ✅ Reads all 15 page files from `/pages`
2. ✅ Updates imports from `../components` to `@/components`
3. ✅ Adds `'use client'` directive
4. ✅ Creates Next.js page wrappers with router
5. ✅ Writes directly to app router `page.tsx` files
6. ✅ Deletes `/pages` folder
7. ✅ Deletes `/lib` folder
8. ✅ Installs Axios
9. ✅ Starts dev server

## Files That Will Be Migrated:

```
pages/about.tsx              → app/(website)/about/page.tsx
pages/home.tsx               → app/(website)/page.tsx
pages/auth.tsx               → app/(website)/auth/page.tsx
pages/contact.tsx            → app/(website)/contact/page.tsx
pages/how-it-works.tsx       → app/(website)/how-it-works/page.tsx
pages/parts-selection.tsx    → app/(website)/parts-selection/page.tsx
pages/supplier-profile.tsx   → app/(website)/supplier-profile/page.tsx
pages/vehicle-confirmation.tsx → app/(website)/vehicle-confirmation/page.tsx
pages/admin-dashboard.tsx    → app/admin/dashboard/page.tsx
pages/supplier-dashboard.tsx → app/supplier/dashboard/page.tsx
pages/supplier-onboarding.tsx → app/supplier/onboarding/page.tsx
pages/quotes.tsx             → app/customer/quotes/page.tsx
pages/chat.tsx               → app/customer/chat/page.tsx
pages/history.tsx            → app/customer/history/page.tsx
pages/notifications.tsx      → app/customer/notifications/page.tsx
```

## After Migration:

Your app will be running at: **http://localhost:3000**

### Test These Pages:
- ✅ http://localhost:3000 (Home)
- ✅ http://localhost:3000/about (About)
- ✅ http://localhost:3000/contact (Contact)
- ✅ http://localhost:3000/how-it-works (How It Works)
- ✅ http://localhost:3000/auth (Authentication)
- ✅ http://localhost:3000/admin/dashboard (Admin)
- ✅ http://localhost:3000/supplier/dashboard (Supplier)
- ✅ http://localhost:3000/customer/quotes (Customer)

## Using the New API Layer:

```typescript
import { customerAPI, supplierAPI, adminAPI, webAPI } from '@/utils/apis';

// Example: Fetch customer quotes
const { data, error } = await customerAPI.getQuotes();
if (data) {
  console.log('Quotes:', data);
}

// Example: Submit part request
const result = await webAPI.submitPartRequest({
  vehicleInfo: vehicleData,
  partCategory: 'Engine',
  partName: 'Oil Filter'
});
```

## Environment Setup:

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Clean Up After Success:

Once everything works, delete these files:
```bash
rm -rf migrate-*.* EXECUTE_MIGRATION_NOW.js *.md
```

## Troubleshooting:

**If migration fails:**
```bash
# Check Node.js version (need 18+)
node --version

# Try again
node EXECUTE_MIGRATION_NOW.js
```

**If dev server won't start:**
```bash
rm -rf .next
npm install
npm run dev
```

**If you see import errors:**
- Make sure all files migrated successfully
- Check console output for any error messages
- Verify TypeScript config is correct

## That's It!

**One command. Complete migration. Ready to build.** 🚀

```bash
node EXECUTE_MIGRATION_NOW.js && npm install && npm run dev
```
