# Development Guide - PartsQuote Next.js 15

## 🏗️ Architecture Overview

This project uses **Next.js 15 App Router** with a multi-portal architecture organized by user roles.

### Key Architectural Decisions

1. **Route Groups** - Using `(website)` to keep public pages at root without affecting URLs
2. **Parallel Layouts** - Each section (admin, supplier, customer) has its own layout
3. **Middleware Protection** - Centralized route protection based on cookies/JWT
4. **Client/Server Split** - Strategic use of 'use client' for interactivity
5. **Shared Components** - Reusable UI components in `/components`

## 📐 Folder Structure Explained

```
app/
├── layout.tsx                    # Root layout (applies to all pages)
│                                 # - Fonts, metadata, Toaster
│
├── (website)/                    # Route group (doesn't add /website to URLs)
│   ├── layout.tsx               # Public layout (Header + Footer)
│   ├── page.tsx                 # Home page at /
│   └── [feature]/page.tsx       # Other public pages
│
├── admin/                        # Admin routes start with /admin
│   ├── layout.tsx               # Sidebar layout for admin
│   └── [page]/page.tsx          # Admin pages
│
├── supplier/                     # Supplier routes start with /supplier
│   ├── layout.tsx               # Sidebar layout for supplier
│   └── [page]/page.tsx          # Supplier pages
│
└── customer/                     # Customer routes start with /customer
    ├── layout.tsx               # Header + Footer layout
    └── [page]/page.tsx          # Customer pages
```

## 🔧 Development Workflow

### Starting Development

```bash
# Start dev server with hot reload
npm run dev

# Open in browser
# http://localhost:3000
```

### Creating a New Page

#### 1. Public Page (e.g., /terms)

```bash
# Create folder and file
mkdir -p app/(website)/terms
touch app/(website)/terms/page.tsx
```

```typescript
// app/(website)/terms/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="font-['Inter'] text-[#0F172A]">
        Terms & Conditions
      </h1>
      {/* Content */}
    </div>
  );
}
```

#### 2. Admin Page (e.g., /admin/settings)

```bash
mkdir -p app/admin/settings
touch app/admin/settings/page.tsx
```

```typescript
// app/admin/settings/page.tsx
'use client';

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="font-['Inter'] text-[#0F172A]">Settings</h1>
      {/* Content */}
    </div>
  );
}
```

### Creating a New Component

```bash
# Create component file
touch components/my-component.tsx
```

```typescript
// components/my-component.tsx
import { cn } from './ui/utils';

interface MyComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('rounded-lg p-4', className)}>
      {children}
    </div>
  );
}
```

### Using the Component

```typescript
import { MyComponent } from '@/components/my-component';

export default function Page() {
  return <MyComponent>Content</MyComponent>;
}
```

## 🎨 Styling Guidelines

### Tailwind Class Naming

Always use the brand design system:

```typescript
// ✅ Good - Using design system colors
<div className="bg-[#F02801] text-white">

// ❌ Bad - Using generic Tailwind colors
<div className="bg-red-500 text-white">

// ✅ Good - Using design system fonts
<h1 className="font-['Inter']">Title</h1>
<p className="font-['Roboto']">Body text</p>

// ❌ Bad - Not specifying fonts
<h1>Title</h1>
```

### Component Styling Pattern

```typescript
// components/example.tsx
import { cn } from './ui/utils';

export function Example({ className }: { className?: string }) {
  return (
    <div className={cn(
      // Base styles
      'rounded-lg border border-[#E2E8F0] p-6',
      // Hover/focus states
      'hover:border-[#F02801] transition-colors',
      // Allow override with className prop
      className
    )}>
      <h3 className="font-['Inter'] text-[#0F172A]">Title</h3>
      <p className="font-['Roboto'] text-[#475569] mt-2">Description</p>
    </div>
  );
}
```

## 🔐 Authentication Patterns

### Current Demo Implementation

```typescript
// Setting auth (client-side)
'use client';

function LoginButton() {
  const handleLogin = (role: 'admin' | 'supplier' | 'customer') => {
    document.cookie = `is_authenticated=true; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    router.push(`/${role}/dashboard`);
  };
  
  return <button onClick={() => handleLogin('admin')}>Login as Admin</button>;
}
```

### Production Implementation (Example)

```typescript
// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getSession() {
  const token = cookies().get('session_token')?.value;
  
  if (!token) return null;
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload;
  } catch {
    return null;
  }
}

// middleware.ts
import { NextResponse } from 'next/server';
import { getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
  
  return NextResponse.next();
}
```

## 📡 Data Fetching Patterns

### Server Component (Preferred)

```typescript
// app/admin/users/page.tsx
async function getUsers() {
  const res = await fetch('http://localhost:3001/api/users', {
    cache: 'no-store', // or 'force-cache' or { next: { revalidate: 60 } }
  });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Client Component

```typescript
// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### With API Route

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch from database
  const users = await db.user.findMany();
  
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  
  return NextResponse.json(user, { status: 201 });
}
```

## 🧪 Testing

### Unit Tests (Example with Vitest)

```typescript
// components/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests (Example with Playwright)

```typescript
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test('admin can view dashboard', async ({ page }) => {
  // Set auth cookies
  await page.context().addCookies([
    { name: 'is_authenticated', value: 'true', path: '/', domain: 'localhost' },
    { name: 'user_role', value: 'admin', path: '/', domain: 'localhost' },
  ]);
  
  await page.goto('/admin/dashboard');
  await expect(page).toHaveTitle(/Admin Dashboard/);
});
```

## 🚀 Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

// ✅ Good - Using Next.js Image
<Image 
  src="/car.jpg" 
  alt="Car" 
  width={500} 
  height={300}
  priority // for above-the-fold images
/>

// ❌ Bad - Using regular img tag
<img src="/car.jpg" alt="Car" />
```

### Dynamic Imports

```typescript
// For large components that aren't needed immediately
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // disable server-side rendering if needed
});
```

### Metadata for SEO

```typescript
// app/admin/users/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users Management',
  description: 'Manage all platform users',
};

export default function UsersPage() {
  // ...
}
```

## 🐛 Debugging

### Server Console

Server components log to terminal:

```typescript
export default async function Page() {
  console.log('This logs in terminal'); // ← Check terminal
  return <div>Page</div>;
}
```

### Client Console

Client components log to browser:

```typescript
'use client';

export default function Page() {
  console.log('This logs in browser'); // ← Check browser console
  return <div>Page</div>;
}
```

### Debugging Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  console.log('Path:', request.nextUrl.pathname); // Logs in terminal
  console.log('Cookies:', request.cookies.getAll());
  return NextResponse.next();
}
```

## 📚 Common Patterns

### Form Handling

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        router.push('/success');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="field" required />
      <button disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Toast Notifications

```typescript
'use client';

import { toast } from 'sonner@2.0.3';

export default function Page() {
  const handleAction = async () => {
    try {
      await someAction();
      toast.success('Action completed successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return <button onClick={handleAction}>Do Action</button>;
}
```

### Conditional Rendering

```typescript
export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {/* Dialog content */}
        </Dialog>
      )}
    </>
  );
}
```

## 🔍 Troubleshooting

### "Module not found"

```bash
# Check tsconfig.json has correct paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Import should use @/ alias
import { Component } from '@/components/component';
```

### "use client" Required

If you see errors about hooks, add 'use client':

```typescript
'use client'; // ← Add this at top

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState();
  // ...
}
```

### Middleware Not Working

1. Check file is named `middleware.ts` (not `middleware.tsx`)
2. Check it's in root directory (next to `app/`)
3. Check matcher config is correct
4. Restart dev server

### Styles Not Applying

1. Check Tailwind classes are valid
2. Check `globals.css` is imported in root layout
3. Clear `.next` cache: `rm -rf .next`
4. Restart dev server

## 📖 Further Reading

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips

1. **Use Server Components by Default** - Only add 'use client' when needed
2. **Leverage Layouts** - Put shared UI in layout files
3. **Type Everything** - Use TypeScript for better DX
4. **Follow Design System** - Use design tokens consistently
5. **Mobile First** - Design for mobile, enhance for desktop
6. **Accessibility** - Test with keyboard navigation
7. **Performance** - Use Next.js Image, dynamic imports
8. **Security** - Never expose secrets client-side

---

Happy coding! 🚀
