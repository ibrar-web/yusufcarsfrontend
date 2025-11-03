# PartsQuote - UK Car Parts Marketplace

> **Next.js 15 App Router Implementation** - A minimal, high-trust car parts quote marketplace for UK drivers with complete role-based access control.

## 🚀 Features

### Multi-Portal Architecture
- **Public Website** - Landing pages, vehicle lookup, part selection
- **Admin Portal** - User management, enquiry monitoring, analytics & reports
- **Supplier Portal** - Dashboard, enquiry management, messaging, settings
- **Customer Area** - Quote browsing, chat with suppliers, order history

### Key Capabilities
- ✅ UK number plate lookup & vehicle identification
- ✅ Multi-step quote request flow
- ✅ Real-time quote comparison
- ✅ Integrated messaging system
- ✅ Supplier verification & ratings
- ✅ Comprehensive admin analytics
- ✅ Mobile-responsive design (390px, 1024px, 1440px)
- ✅ WCAG AA accessibility compliance
- ✅ Role-based route protection with middleware

## 📁 Project Structure

```
app/
├── layout.tsx                      # Root layout (fonts, metadata)
├── middleware.ts                   # Route protection & auth
│
├── (website)/                      # Public routes group
│   ├── layout.tsx                  # Header/Footer layout
│   ├── page.tsx                    # Home (/)
│   ├── how-it-works/
│   ├── about/
│   ├── contact/
│   ├── auth/
│   ├── vehicle-confirmation/
│   ├── parts-selection/
│   └── supplier-profile/
│
├── admin/                          # Admin portal (/admin/*)
│   ├── layout.tsx                  # Sidebar layout
│   ├── dashboard/
│   ├── users/
│   ├── customers/
│   ├── suppliers/
│   ├── enquiries/
│   └── reports/
│
├── supplier/                       # Supplier portal (/supplier/*)
│   ├── layout.tsx                  # Sidebar layout
│   ├── dashboard/
│   ├── enquiries/
│   ├── messages/
│   ├── settings/
│   └── onboarding/
│
└── customer/                       # Customer area (/customer/*)
    ├── layout.tsx                  # Header/Footer layout
    ├── quotes/
    ├── chat/
    ├── history/
    └── notifications/

components/
├── header.tsx                      # Main navigation
├── footer.tsx                      # Footer with links
├── number-plate-input.tsx          # UK plate input
├── quote-card.tsx                  # Quote display
├── supplier-card.tsx               # Supplier info
├── chat-bubble.tsx                 # Message display
└── ui/                            # Shadcn/UI components

pages/                              # Legacy page components
└── [page-name].tsx                # Reusable page logic

styles/
└── globals.css                     # Global styles & theme
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: v19
- **TypeScript**: v5.6
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner
- **Forms**: React Hook Form

## 📦 Installation

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd partsquote-uk

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 🔐 Authentication & Route Protection

### Current Implementation (Development)

The app uses cookie-based authentication for demonstration:

```javascript
// Setting auth (client-side for demo)
document.cookie = 'is_authenticated=true; path=/; max-age=86400';
document.cookie = 'user_role=admin; path=/; max-age=86400';
```

### Middleware Protection

The `middleware.ts` file protects routes based on user roles:

| Route Pattern | Required Role | Redirect |
|--------------|---------------|----------|
| `/admin/*` | `admin` | `/auth?role=admin` |
| `/supplier/*` | `supplier` | `/auth?role=supplier` |
| `/customer/*` | `customer` | `/auth?role=customer` |
| `/, /about, /contact` | Public | None |

### Testing Different Roles

Open browser console on any page:

**Test as Admin:**
```javascript
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=admin; path=/';
location.href = '/admin/dashboard';
```

**Test as Supplier:**
```javascript
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=supplier; path=/';
location.href = '/supplier/dashboard';
```

**Test as Customer:**
```javascript
document.cookie = 'is_authenticated=true; path=/';
document.cookie = 'user_role=customer; path=/';
location.href = '/customer/quotes';
```

**Clear Auth:**
```javascript
document.cookie = 'is_authenticated=; path=/; max-age=0';
document.cookie = 'user_role=; path=/; max-age=0';
location.href = '/';
```

## 🎨 Design System

### Color Palette

```css
/* Primary */
--primary: #F02801;           /* Bright orange-red */
--primary-hover: #D22301;     /* Darker on hover */

/* Neutrals */
--ink: #0F172A;              /* Primary text */
--subtle-ink: #475569;        /* Secondary text */
--muted-bg: #F1F5F9;         /* Background */
--border: #E2E8F0;           /* Borders */

/* Feedback */
--success: #22C55E;          /* Green */
--warning: #F59E0B;          /* Amber */
--danger: #F02801;           /* Red */
```

### Typography

- **Headings**: Inter (semibold/bold)
- **Body Text**: Roboto (regular)
- **Sizes**: H1: 48px, H2: 32px, H3: 24px, Body: 16px

### Spacing & Style

- **Border Radius**: 12-16px
- **Shadows**: Subtle (blur 24px, opacity 8-10%)
- **Breakpoints**: 390px (mobile), 1024px (tablet), 1440px (desktop)

## 📄 Key Pages

### Admin Portal

#### Dashboard (`/admin/dashboard`)
- Platform statistics and KPIs
- Recent activity feed
- Quick actions for common tasks

#### Users (`/admin/users`)
- View all users (customers, suppliers, admins)
- Filter by role and status
- Suspend/activate accounts
- Send emails

#### Customers (`/admin/customers`)
- Customer activity tracking
- Enquiry and order history
- Revenue statistics

#### Suppliers (`/admin/suppliers`)
- Supplier verification management
- Performance metrics
- Rating and response times

#### Enquiries (`/admin/enquiries`)
- Monitor all platform enquiries
- Track quote submissions
- View conversion rates

#### Reports (`/admin/reports`)
- Analytics dashboard with charts
- Enquiries by category
- Supplier performance
- Monthly trends

### Supplier Portal

#### Dashboard (`/supplier/dashboard`)
- Active enquiries overview
- Quote acceptance rate
- Recent activity

#### Enquiries (`/supplier/enquiries`)
- Browse customer enquiries
- Submit quotes with pricing
- Track quote status

#### Messages (`/supplier/messages`)
- Chat with customers
- Manage conversations
- View enquiry context

#### Settings (`/supplier/settings`)
- Business profile management
- Notification preferences
- Security settings

### Customer Area

#### Quotes (`/customer/quotes`)
- Compare supplier quotes
- Filter and sort options
- Accept quotes

#### Chat (`/customer/chat`)
- Message suppliers
- Discuss requirements
- Attach files

#### History (`/customer/history`)
- Past enquiries
- Completed orders
- Track status

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="PartsQuote"

# API Configuration (if using external backend)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication (Production)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Next.js Config

`next.config.js` is already configured with:
- React Strict Mode
- Image optimization for Unsplash
- Compression enabled
- Security headers

### TypeScript Config

`tsconfig.json` includes:
- Path aliases (`@/*`)
- Strict mode enabled
- Next.js plugin integration

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Other Platforms

```bash
# Build
npm run build

# The .next folder contains the production build
# Serve it with:
npm start
```

Works on: Netlify, AWS Amplify, Railway, Render, etc.

## 🔄 Migration from Old Routing

| Old Route | New Route |
|-----------|-----------|
| `home` | `/` |
| `admin-dashboard` | `/admin/dashboard` |
| `supplier-dashboard` | `/supplier/dashboard` |
| `supplier-onboarding` | `/supplier/onboarding` |
| `quotes` | `/customer/quotes` |
| `chat` | `/customer/chat` |
| `history` | `/customer/history` |
| `notifications` | `/customer/notifications` |

## 📝 Next Steps

### Production Readiness

1. **Implement Real Authentication**
   - Use NextAuth.js or Supabase Auth
   - Add JWT token validation
   - Secure HTTP-only cookies

2. **Add API Routes**
   ```typescript
   // app/api/enquiries/route.ts
   export async function GET() {
     const data = await fetchFromDatabase();
     return Response.json(data);
   }
   ```

3. **Connect Database**
   - PostgreSQL with Prisma
   - Or use Supabase
   - Add data persistence

4. **Add Error Boundaries**
   ```typescript
   // app/error.tsx
   'use client';
   export default function Error({ error, reset }) {
     return <ErrorComponent />;
   }
   ```

5. **Add Loading States**
   ```typescript
   // app/admin/loading.tsx
   export default function Loading() {
     return <Skeleton />;
   }
   ```

6. **Optimize Performance**
   - Use Server Components where possible
   - Implement streaming
   - Add ISR for static content

7. **Add Tests**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Component tests (Testing Library)

8. **SEO Optimization**
   - Add meta tags
   - Create sitemap
   - Implement structured data

## 📚 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- Components use British English
- Styling matches design system
- All pages are responsive
- Accessibility standards met

## 📄 License

[Your License Here]

## 👥 Team

Built with ❤️ for UK drivers

---

**Version**: 2.0.0  
**Framework**: Next.js 15  
**Last Updated**: November 2024
