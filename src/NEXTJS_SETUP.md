# PartsQuote - Next.js Migration Guide

## Overview

This application has been restructured from a single-page React app to a proper Next.js application with organized routing, middleware protection, and role-based access control.

## Project Structure

```
/app
├── layout.tsx                    # Root layout with fonts and global providers
├── middleware.ts                 # Route protection and authentication
│
├── (website)                     # Public website routes (route group)
│   ├── layout.tsx               # Website layout with Header/Footer
│   ├── page.tsx                 # Home page (/)
│   ├── how-it-works/            # (/how-it-works)
│   ├── about/                   # (/about)
│   ├── contact/                 # (/contact)
│   ├── auth/                    # (/auth)
│   ├── vehicle-confirmation/    # (/vehicle-confirmation)
│   ├── parts-selection/         # (/parts-selection)
│   └── supplier-profile/        # (/supplier-profile)
│
├── admin/                        # Admin portal (/admin/*)
│   ├── layout.tsx               # Admin sidebar layout
│   ├── dashboard/               # (/admin/dashboard)
│   ├── users/                   # (/admin/users)
│   ├── customers/               # (/admin/customers)
│   ├── suppliers/               # (/admin/suppliers)
│   ├── enquiries/               # (/admin/enquiries)
│   └── reports/                 # (/admin/reports)
│
├── supplier/                     # Supplier portal (/supplier/*)
│   ├── layout.tsx               # Supplier sidebar layout
│   ├── dashboard/               # (/supplier/dashboard)
│   └── onboarding/              # (/supplier/onboarding)
│
└── customer/                     # Customer area (/customer/*)
    ├── layout.tsx               # Customer layout with Header/Footer
    ├── quotes/                  # (/customer/quotes)
    ├── chat/                    # (/customer/chat)
    ├── history/                 # (/customer/history)
    └── notifications/           # (/customer/notifications)
```

## Route Protection

### Middleware (`/middleware.ts`)

The middleware automatically protects routes based on user roles stored in cookies:

- **Admin routes** (`/admin/*`): Require `user_role=admin`
- **Supplier routes** (`/supplier/*`): Require `user_role=supplier`
- **Customer routes** (`/customer/*`): Require `user_role=customer`
- **Public routes** (`/`, `/how-it-works`, `/about`, `/contact`, `/auth`): No authentication required

Unauthenticated users trying to access protected routes are redirected to `/auth` with a redirect parameter.

## Authentication Flow

### Current Implementation (Development)

The authentication currently uses **client-side cookies** for demonstration purposes:

```javascript
// Setting auth cookies (client-side)
document.cookie = `is_authenticated=true; path=/; max-age=86400`;
document.cookie = `user_role=admin; path=/; max-age=86400`;

// Clearing auth cookies
document.cookie = 'is_authenticated=; path=/; max-age=0';
document.cookie = 'user_role=; path=/; max-age=0';
```

### Production Implementation (Recommended)

For production, you should:

1. **Use Server-Side Sessions**: Implement proper server-side authentication with libraries like:
   - [NextAuth.js](https://next-auth.js.org/)
   - [Auth.js](https://authjs.dev/)
   - [Supabase Auth](https://supabase.com/auth)

2. **Secure Cookies**: Use HTTP-only, secure cookies:
   ```javascript
   // Server-side only
   cookies().set('session_token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 86400
   });
   ```

3. **JWT Tokens**: Use signed JWT tokens for stateless authentication

4. **Update Middleware**: Verify JWT tokens or session tokens in middleware

## Key Features

### 1. **Role-Based Layouts**

Each section has its own layout:

- **Website**: Header + Footer with auth dialogs
- **Admin**: Sidebar navigation with route-based highlighting
- **Supplier**: Sidebar navigation with notifications badge
- **Customer**: Header + Footer with customer-specific navigation

### 2. **State Management**

Cross-page data is handled through:

- **sessionStorage**: For vehicle data, part selections, etc.
- **URL parameters**: For supplier IDs, quote IDs
- **Route navigation**: Using Next.js router

### 3. **Admin Features**

Complete admin portal with:

- **Users Management**: View, suspend, activate users
- **Customers**: Track customer activity and spending
- **Suppliers**: Verify suppliers, view performance
- **Enquiries**: Monitor all platform enquiries
- **Reports**: Analytics dashboard with charts

### 4. **Responsive Design**

All pages are fully responsive with:

- Mobile-first sidebar navigation
- Breakpoints: 390px (mobile), 1024px (tablet), 1440px (desktop)
- Touch-friendly interfaces

## Installation & Setup

### 1. Install Dependencies

```bash
npm install next@latest react@latest react-dom@latest
npm install @types/node @types/react @types/react-dom --save-dev
```

### 2. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 3. Configure Next.js

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
```

### 4. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

Create `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API (if using external backend)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication (for production)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Migration from Old App.tsx

The old `App.tsx` routing has been migrated as follows:

| Old Route | New Route |
|-----------|-----------|
| `home` | `/` |
| `how-it-works` | `/how-it-works` |
| `about` | `/about` |
| `contact` | `/contact` |
| `auth` | `/auth` |
| `vehicle-confirmation` | `/vehicle-confirmation` |
| `parts-selection` | `/parts-selection` |
| `quotes` | `/customer/quotes` |
| `chat` | `/customer/chat` |
| `history` | `/customer/history` |
| `notifications` | `/customer/notifications` |
| `supplier-profile` | `/supplier-profile?id={id}` |
| `supplier-onboarding` | `/supplier/onboarding` |
| `supplier-dashboard` | `/supplier/dashboard` |
| `admin-dashboard` | `/admin/dashboard` |

## Testing Different Roles

To test different user roles:

### Admin Access
```javascript
// In browser console
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=admin; path=/';
// Then navigate to: http://localhost:3000/admin/dashboard
```

### Supplier Access
```javascript
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=supplier; path=/';
// Then navigate to: http://localhost:3000/supplier/dashboard
```

### Customer Access
```javascript
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=customer; path=/';
// Then navigate to: http://localhost:3000/customer/quotes
```

## Best Practices

### 1. **Server Components**

Most components can be server components for better performance:

```typescript
// app/page.tsx - Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

Use `'use client'` only when needed:
- useState, useEffect hooks
- Event handlers
- Browser APIs

### 2. **Data Fetching**

Use Next.js data fetching methods:

```typescript
// Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache'
  });
  return res.json();
}
```

### 3. **API Routes**

Create API routes in `/app/api`:

```typescript
// app/api/enquiries/route.ts
export async function GET() {
  const data = { /* ... */ };
  return Response.json(data);
}
```

### 4. **Image Optimization**

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image src="/path/to/image.jpg" alt="Description" width={500} height={300} />
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build for production:

```bash
npm run build
npm run start
```

## Troubleshooting

### Issue: "Module not found"
- Check import paths use `@/` alias
- Ensure `tsconfig.json` has correct paths configuration

### Issue: Middleware not working
- Ensure `middleware.ts` is in root directory
- Check cookie names match exactly

### Issue: Layout not applying
- Check folder structure uses correct naming
- Ensure layout.tsx files are named correctly

## Next Steps

1. **Implement real authentication** using NextAuth.js or Supabase
2. **Add API routes** for backend functionality
3. **Connect to database** (PostgreSQL, MongoDB, etc.)
4. **Add real-time features** using WebSockets or Supabase Realtime
5. **Implement proper error handling** with error.tsx files
6. **Add loading states** with loading.tsx files
7. **Optimize performance** with React Server Components
8. **Add E2E tests** with Playwright or Cypress

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth.js](https://next-auth.js.org/)
- [Vercel Deployment](https://vercel.com/docs)
