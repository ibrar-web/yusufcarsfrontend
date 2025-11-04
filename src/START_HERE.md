# 🚀 START HERE - PartsQuote Setup

## What You Downloaded

You have a **Next.js 16 project**, but files are in the **wrong locations**.

### Current State (Wrong):
```
❌ components/      (at root - should be in src/)
❌ pages/          (at root - should be in src/)
❌ App.tsx         (old Vite file - ignore it)
```

### Target State (Correct):
```
✅ src/components/  (moved here)
✅ src/pages/      (moved here)
✅ src/app/        (Next.js routes - already correct)
```

---

## 🎯 3 Commands to Fix It

Open terminal in this folder and run:

### 1. Run Setup Script

**Mac/Linux:**
```bash
chmod +x SETUP.sh && ./SETUP.sh
```

**Windows PowerShell:**
```powershell
.\SETUP.ps1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:3000
```

---

## That's It! ✨

After these 3 commands, you'll have a working Next.js 16 app.

---

## What the Setup Script Does

1. Creates `src/components/`, `src/pages/`, `src/guidelines/`
2. Copies all files from root into `src/`
3. Removes duplicate `styles/` folder
4. Deletes `vite.config.ts` if it exists

---

## Need Help?

See `TROUBLESHOOTING.md` for common issues.

---

## Why This Happens

Figma Make exports files in a flat structure. Next.js 16 needs them in `src/`.
The setup script organizes everything properly.

---

**Ready? Run the 3 commands above! 🚀**
