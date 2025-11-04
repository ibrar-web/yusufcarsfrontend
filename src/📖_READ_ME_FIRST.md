# 📖 READ ME FIRST - PartsQuote Setup

## 🎯 Quick Start (Just 3 Commands!)

```bash
# 1. Setup (Mac/Linux)
chmod +x SETUP.sh && ./SETUP.sh

# 1. Setup (Windows PowerShell)
.\SETUP.ps1

# 2. Install
npm install

# 3. Run
npm run dev
```

Then open: **http://localhost:3000**

---

## 📚 Documentation Files

We've created several guides to help you:

| File | Purpose | When to Read |
|------|---------|--------------|
| **START_HERE.md** | Quick start guide | Read FIRST |
| **README.md** | Full project documentation | After setup |
| **SETUP_CHECKLIST.md** | Step-by-step checklist | Follow during setup |
| **MIGRATION_VISUAL.md** | Visual diagrams | Understand the structure |
| **TROUBLESHOOTING.md** | Fix common problems | When you hit issues |
| **COMPLETE_SETUP_GUIDE.md** | Detailed manual setup | If scripts don't work |

---

## ⚡ Too Long, Didn't Read?

**Just run these 3 commands:**

### Mac/Linux:
```bash
chmod +x SETUP.sh && ./SETUP.sh
npm install
npm run dev
```

### Windows:
```powershell
.\SETUP.ps1
npm install
npm run dev
```

---

## 🤔 Why Do I Need Setup?

Figma Make exports files in a flat structure, but Next.js 16 needs them organized in `src/`.

**The setup script automatically:**
- ✅ Moves components to `src/components/`
- ✅ Moves pages to `src/pages/`
- ✅ Removes Vite references
- ✅ Prepares Next.js structure

**Without setup:**
- ❌ Files in wrong locations
- ❌ Import errors
- ❌ Won't run

---

## ✅ How to Know It Worked?

After running setup + npm install + npm run dev:

1. **Terminal shows:**
   ```
   ▲ Next.js 15.1.4
   - Local:        http://localhost:3000
   ✓ Ready in 2.5s
   ```

2. **Browser shows:**
   - PartsQuote homepage
   - No console errors (press F12)

3. **File structure:**
   ```
   src/
   ├── app/
   ├── components/    ✅
   ├── pages/         ✅
   ├── styles/        ✅
   └── guidelines/    ✅
   ```

---

## 🆘 Having Issues?

1. **Read:** `TROUBLESHOOTING.md`
2. **Check:** Browser console (F12)
3. **Check:** Terminal for errors
4. **Try:** Delete `.next` and restart:
   ```bash
   rm -rf .next && npm run dev
   ```

---

## 🚀 After Setup

Start building routes! Examples:

```typescript
// src/app/about/page.tsx
export default function About() {
  return <div>About Page</div>;
}

// src/app/quotes/page.tsx
export default function Quotes() {
  return <div>Quotes Page</div>;
}
```

File structure = Routes:
- `src/app/about/page.tsx` → `/about`
- `src/app/quotes/page.tsx` → `/quotes`

---

## 📝 Important Notes

1. **This is Next.js 16** (NOT Vite)
2. **App.tsx exists but is NOT used** (ignore it)
3. **Use `@/` for imports** (e.g., `import { Button } from "@/components/ui/button"`)
4. **Old folders at root can be deleted** after verifying setup works

---

## 🎉 Ready?

**Run the 3 commands at the top of this file!**

See you at http://localhost:3000 🚀
