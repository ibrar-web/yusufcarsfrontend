# PartsQuote - Quick Start Guide

## 🚨 Action Required: Pages Migration

Your Next.js 15 application is ready, but needs one manual step to complete the migration.

## What's the Issue?

The `/pages` folder contains page component implementations (not routes). In Next.js 15 App Router:
- ❌ `/pages/*` = Legacy routing (not used in App Router)
- ✅ `/app/*` = Your routes (already set up correctly)
- ✅ `/components/*` = Reusable components (where page components should live)

## Quick Fix (2 minutes)

### Step 1: Run the Migration Script

```bash
node migrate-pages-script.js
```

This automatically:
- Creates `/components/page-components/`
- Copies all 19 page files from `/pages`
- Updates all imports
- Prepares everything for deletion

### Step 2: Delete Old Folders

```bash
rm -rf pages/
rm -rf lib/
```

### Step 3: Clean Up Migration Files

```bash
rm migrate-pages-script.js
rm MIGRATION_GUIDE.md  
rm PAGES_MIGRATION_README.md
rm QUICK_START.md
```

### Step 4: Test

```bash
npm run dev
```

Visit http://localhost:3000 and test the application.

## ✅ That's It!

Your app is now properly structured for Next.js 15.

---

## Alternative: Manual Steps

If you prefer manual migration, see `PAGES_MIGRATION_README.md` for detailed instructions.

---

## What's Already Done

✅ Next.js 15 App Router structure  
✅ All routes configured (`/app/*`)  
✅ Middleware with route protection  
✅ Layouts for each section  
✅ All UI components  
✅ TypeScript configuration  
✅ Tailwind CSS v4 setup  
✅ Package.json with all dependencies  

## Project Structure After Migration

```
partsquote-uk/
├── app/                           # Next.js 15 routes
│   ├── (website)/                # Public pages
│   ├── admin/                    # Admin portal
│   ├── supplier/                 # Supplier portal
│   ├── customer/                 # Customer area
│   └── layout.tsx               # Root layout
├── components/                    # Reusable components
│   ├── page-components/          # Page implementations ← NEW!
│   ├── ui/                       # UI library (Shadcn)
│   ├── header.tsx               # Navigation
│   ├── footer.tsx               # Footer
│   └── ...other components
├── styles/                        # Global styles
├── middleware.ts                  # Auth & routing
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript config
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure your environment variables
3. See `README.md` for detailed configuration

## Documentation

- 📖 **README.md** - Complete project documentation
- 🛠️ **DEVELOPMENT.md** - Development guide and patterns
- 🔐 **Authentication** - See middleware.ts for role-based access

## Testing Different Roles

Open browser console and run:

```javascript
// Test as Admin
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=admin; path=/';
location.href = '/admin/dashboard';

// Test as Supplier
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=supplier; path=/';
location.href = '/supplier/dashboard';

// Test as Customer
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=customer; path=/';
location.href = '/customer/quotes';
```

## Key Features

### Admin Portal (`/admin/*`)
- User management
- Customer tracking
- Supplier verification
- Enquiry monitoring
- Analytics & reports

### Supplier Portal (`/supplier/*`)
- Dashboard with statistics
- Enquiry management
- Quote submission
- Messaging system
- Profile settings

### Customer Area (`/customer/*`)
- Browse and compare quotes
- Chat with suppliers
- Order history
- Notifications

### Public Website (`/`)
- Home with vehicle lookup
- How it works
- About us
- Contact
- Supplier profiles
- Authentication

## Design System

- **Colors**: Orange-red primary (#F02801), clean whites
- **Typography**: Inter for headings, Roboto for body
- **Spacing**: 12-16px border radius, generous whitespace
- **British English**: Registration plates, GBP currency

## Next Steps

1. ✅ Complete the pages migration (above)
2. 🔐 Implement real authentication (NextAuth.js or Supabase)
3. 📡 Add API routes for backend
4. 💾 Connect database (PostgreSQL/Supabase)
5. 🧪 Add tests (Vitest + Playwright)
6. 🚀 Deploy to Vercel

## Support

See detailed guides in:
- `README.md` - Full documentation
- `DEVELOPMENT.md` - Development patterns
- `PAGES_MIGRATION_README.md` - Migration details
- `Guidelines.md` - Design system spec

---

**Ready to go? Run the migration script and start building! 🚀**

```bash
node migrate-pages-script.js && rm -rf pages/ lib/ && npm run dev
```
