# PartsQuote - Complete Next.js 16 Setup Guide

## 🚨 IMPORTANT: Your Current Issue

You downloaded the code and it has files in the **wrong locations**. This guide will fix it.

### Current Problem:
```
❌ components/          (should be in src/components/)
❌ pages/              (should be in src/pages/)
❌ styles/             (duplicate - should only be src/styles/)
❌ App.tsx             (old Vite entry - ignore it)
```

### What We Need:
```
✅ src/components/     (all components here)
✅ src/pages/          (all pages here)
✅ src/styles/         (only one styles folder)
✅ src/app/            (Next.js routes)
```

---

## 🔧 FIX #1: Manual Setup (Recommended)

**Do this in your terminal INSIDE the project folder:**

### Mac/Linux:
```bash
# Create directories
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/guidelines

# Copy all components
cp -r components/* src/components/

# Copy all pages
cp -r pages/* src/pages/

# Copy guidelines
cp -r guidelines/* src/guidelines/

# Remove duplicate styles folder (keep only src/styles/)
rm -rf styles

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Windows PowerShell:
```powershell
# Create directories
New-Item -ItemType Directory -Path "src/components/ui" -Force
New-Item -ItemType Directory -Path "src/pages" -Force
New-Item -ItemType Directory -Path "src/guidelines" -Force

# Copy all components
Copy-Item -Path "components/*" -Destination "src/components/" -Recurse -Force

# Copy all pages
Copy-Item -Path "pages/*" -Destination "src/pages/" -Recurse -Force

# Copy guidelines
Copy-Item -Path "guidelines/*" -Destination "src/guidelines/" -Recurse -Force

# Remove duplicate styles folder
Remove-Item -Path "styles" -Recurse -Force -ErrorAction SilentlyContinue

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 🔧 FIX #2: Use the Scripts (Alternative)

If the scripts don't work, they just do the same as Fix #1 above.

---

## ✅ Verification

After running the commands, your structure should look like:

```
your-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx       ✅
│   │   └── page.tsx         ✅
│   ├── components/          ✅ (copied from root)
│   │   ├── ui/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── ...
│   ├── pages/              ✅ (copied from root)
│   │   ├── home.tsx
│   │   ├── about.tsx
│   │   └── ...
│   ├── styles/             ✅
│   │   └── globals.css
│   └── guidelines/         ✅
│       └── Guidelines.md
├── components/             ⚠️ (old - can delete after verifying)
├── pages/                  ⚠️ (old - can delete after verifying)
├── App.tsx                 ⚠️ (old Vite file - ignore it)
├── next.config.mjs         ✅
├── package.json            ✅
└── tsconfig.json           ✅
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies (if not done already)
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

### Expected Output:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 3.2s
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/components/...'"

**Cause:** Files not in `src/` directory  
**Fix:** Run the copy commands above

### Error: "Module not found"

**Cause:** Dependencies not installed  
**Fix:** Run `npm install`

### Error: "Port 3000 already in use"

**Cause:** Another Next.js server running  
**Fix:** Kill the process or use: `npm run dev -- -p 3001`

### Still seeing Vite references?

**Cause:** You might have `vite.config.ts` file  
**Fix:** Delete it: `rm vite.config.ts` (Mac/Linux) or `Remove-Item vite.config.ts` (Windows)

---

## 📁 File Structure Explanation

### Why `src/`?
Next.js 16 supports both root-level and `src/` directory structures. We use `src/` for better organization.

### Why keep old `components/` and `pages/`?
We copy instead of move so you can verify everything works before deleting originals.

### What about `App.tsx`?
It's the old Vite entry point. **Ignore it completely**. Next.js uses `src/app/layout.tsx` and `src/app/page.tsx` instead.

---

## 🎯 After Setup Works

Once you see the homepage at http://localhost:3000, you can:

1. **Delete old folders** (after verifying):
   ```bash
   rm -rf components pages guidelines
   ```

2. **Start building routes:**
   - Create `src/app/about/page.tsx` for `/about`
   - Create `src/app/quotes/page.tsx` for `/quotes`
   - etc.

3. **Convert pages to routes:**
   Move content from `src/pages/about.tsx` into `src/app/about/page.tsx`

---

## 💡 Key Points

✅ **This is Next.js 16** - NOT Vite  
✅ **App Router** - File-based routing  
✅ **TypeScript** - With `@/` path aliases  
✅ **No Vite** - Ignore `App.tsx`, it's from old setup  

---

**Need help? Check the error message and refer to the Troubleshooting section above.**
