# PartsQuote - UK Car Parts Marketplace

> Next.js 16 App Router | TypeScript | Tailwind CSS

---

## 👋 NEW HERE? START HERE:

**📖 Read: `📖_READ_ME_FIRST.md`** or continue below ⬇️

---

## ⚠️ CRITICAL: SETUP REQUIRED FIRST

**🚨 THIS IS A NEXT.JS 16 PROJECT (NOT VITE)**

When you download this project:
- ❌ Files are in wrong locations (root instead of `src/`)
- ❌ You may see `App.tsx` (ignore it - it's old Vite remnant)
- ✅ You MUST run the setup script first

**The setup script will:**
- Move files into proper Next.js 16 structure
- Remove any Vite references
- Prepare the project to run with `npm run dev`

---

## 🚀 Quick Start (3 Commands)

### Step 1: Run Setup Script (REQUIRED - One Time Only)

Open terminal in the project folder and run:

**Mac/Linux:**
```bash
chmod +x SETUP.sh && ./SETUP.sh
```

**Windows PowerShell:**
```powershell
.\SETUP.ps1
```

**What this does:**
- ✅ Copies `components/` → `src/components/`
- ✅ Copies `pages/` → `src/pages/`
- ✅ Copies `guidelines/` → `src/guidelines/`
- ✅ Removes duplicate `styles/` folder
- ✅ Deletes `vite.config.ts` if it exists

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

---

### Step 4: Open Browser

Visit: **http://localhost:3000**

---

## ✅ Verify Setup Worked

After running the setup script, you should see:

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/          ✅ Copied here
├── pages/              ✅ Copied here
├── styles/             ✅ Only one styles folder
└── guidelines/         ✅ Copied here
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Homepage
├── components/            # After running setup script
│   ├── ui/               # Shadcn UI components
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── pages/                # After running setup script
│   ├── home.tsx
│   ├── about.tsx
│   └── ...
├── styles/
│   └── globals.css       # Design system
└── guidelines/
    └── Guidelines.md     # Design specifications
```

## 🎨 Design System

- **Primary Color**: `#F02801` (vibrant orange-red)
- **Typography**: Inter (headings) + Roboto (body)
- **Layout**: Max width 1200px
- **British English**: All content
- **Currency**: GBP (£)

See `src/guidelines/Guidelines.md` for complete specifications.

## 🔧 Tech Stack

- Next.js 16 (App Router)
- TypeScript 5.7
- Tailwind CSS v4
- Shadcn/UI + Radix UI
- Lucide React Icons
- Zustand (State)
- React Hook Form
- Recharts

## 📦 Features

- UK number plate lookup
- Vehicle identification
- Quote request system
- Supplier comparison
- Real-time messaging
- Order tracking
- Supplier portal
- Admin dashboard
- Fully responsive
- WCAG AA accessible

## 🛠️ Development

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## ⚠️ Important Notes

### Current State
This is a **pure Next.js 16 project** with App Router. The old Vite-style `App.tsx` routing has been removed.

### After Setup
After running the setup script, all your components and pages will be in `src/` directory using Next.js conventions.

### Path Aliases
Use `@/` for all imports:
```typescript
import { Button } from "@/components/ui/button";
import { HomePage } from "@/page-components/home";
```

## 🗺️ Routes (To Be Implemented)

- `/` - Homepage
- `/about` - About
- `/contact` - Contact  
- `/customer/quotes` - Quotes
- `/customer/chat` - Chat
- `/supplier/dashboard` - Supplier dashboard
- `/admin/dashboard` - Admin dashboard

## 📝 License

Private - Not for redistribution

---

**Built for UK drivers 🇬🇧**
