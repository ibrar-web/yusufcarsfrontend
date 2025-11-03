# 🚀 Run This First - Quick Setup Guide

## Complete Migration in 3 Commands

### Linux/Mac Users:
```bash
chmod +x migrate-and-cleanup.sh
./migrate-and-cleanup.sh
npm install && npm run dev
```

### Windows Users:
```cmd
migrate-and-cleanup.bat
npm install
npm run dev
```

### Alternative (Any OS with Node.js):
```bash
node migrate-pages-script.js
rm -rf pages/ lib/ migrate-*.* *.md
npm install && npm run dev
```

## What This Does

1. ✅ Moves all 19 page components from `/pages` to `/components/page-components`
2. ✅ Updates all imports throughout the app
3. ✅ Deletes old `/pages` and `/lib` folders
4. ✅ Cleans up migration files
5. ✅ Installs dependencies (including Axios)
6. ✅ Starts development server

## After Running

Your app will be available at: **http://localhost:3000**

Test these pages:
- ✅ Home: http://localhost:3000
- ✅ About: http://localhost:3000/about
- ✅ Admin Dashboard: http://localhost:3000/admin/dashboard
- ✅ Supplier Dashboard: http://localhost:3000/supplier/dashboard
- ✅ Customer Quotes: http://localhost:3000/customer/quotes

## New Features Available

### 1. API Layer
```typescript
import { customerAPI, supplierAPI, adminAPI, webAPI } from '@/utils/apis';

// Example: Get customer quotes
const { data, error } = await customerAPI.getQuotes();
```

### 2. Axios Configuration
- ✅ Automatic auth token injection
- ✅ Global error handling  
- ✅ Request/response logging

### 3. Store Structure
Ready for state management (Zustand, Redux, etc.)

## Environment Setup

Create `.env.local`:
```bash
cp .env.example .env.local
```

Edit and add:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Quick API Usage Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { customerAPI } from '@/utils/apis';

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await customerAPI.getQuotes();
      if (data) setData(data);
    }
    loadData();
  }, []);

  return <div>{/* Use data here */}</div>;
}
```

## Documentation

- 📖 `SETUP_COMPLETE.md` - Full setup guide
- 📖 `/utils/README.md` - API usage documentation
- 📖 `/store/README.md` - State management guide
- 📖 `README.md` - Project overview

## Troubleshooting

**Migration fails?**
```bash
# Manual migration
mkdir -p components/page-components
cp pages/*.tsx components/page-components/
# Then update imports manually or use the Node script
```

**Import errors?**
```bash
npm install
rm -rf .next
npm run dev
```

**TypeScript errors?**
```bash
npm run build
# Fix any type errors shown
```

## That's It!

Your Next.js 15 PartsQuote application is now ready with:
- ✅ Proper App Router structure
- ✅ Complete API configuration
- ✅ State management setup
- ✅ All page components migrated
- ✅ TypeScript configured
- ✅ Axios integrated

**Happy coding! 🎉**
