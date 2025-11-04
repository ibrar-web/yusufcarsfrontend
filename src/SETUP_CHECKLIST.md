# ✅ Setup Checklist

Follow these steps in order:

---

## Step 1: Run Setup Script ✅

**Mac/Linux:**
```bash
chmod +x SETUP.sh && ./SETUP.sh
```

**Windows:**
```powershell
.\SETUP.ps1
```

**Expected output:**
```
✅ Directories created
✅ Components copied to src/components/
✅ Pages copied to src/pages/
✅ Guidelines copied to src/guidelines/
✅ Removed duplicate styles folder
✅ Setup Complete!
```

---

## Step 2: Install Dependencies ✅

```bash
npm install
```

**Expected output:**
```
added 300+ packages in 30s
```

---

## Step 3: Start Dev Server ✅

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.1.4
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## Step 4: Open Browser ✅

Navigate to: **http://localhost:3000**

**Expected result:**
- Homepage loads
- No errors in browser console (F12)
- You see the PartsQuote landing page

---

## Verification

### Check file structure:
```bash
ls src/
```

**Should show:**
```
app  components  pages  styles  guidelines
```

### Check no Vite config:
```bash
ls vite.config.ts
```

**Should show:**
```
ls: vite.config.ts: No such file or directory
```
(This is good - means it was deleted)

### Check only one styles folder:
```bash
ls styles
```

**Should show:**
```
ls: styles: No such file or directory
```
(This is good - only src/styles should exist)

---

## Troubleshooting

### ❌ Setup script won't run
**Mac/Linux:** Run `chmod +x SETUP.sh` first  
**Windows:** Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### ❌ Cannot find module errors
Run setup script first, then `npm install`

### ❌ Port 3000 in use
Use: `npm run dev -- -p 3001`

### ❌ Page is blank
Check browser console (F12) for errors  
Run: `rm -rf .next && npm run dev`

---

## After Setup Success

Once you see the homepage at http://localhost:3000:

1. ✅ **You're ready to develop!**
2. 🗑️ **Optional:** Delete old root folders:
   ```bash
   rm -rf components pages guidelines
   ```
3. 📝 **Optional:** Delete App.tsx:
   ```bash
   rm App.tsx
   ```

These are safe to delete after verifying everything works.

---

## Next Steps

Start building your routes:
- Create `src/app/about/page.tsx` for `/about`
- Create `src/app/quotes/page.tsx` for `/quotes`
- Create `src/app/customer/dashboard/page.tsx` for `/customer/dashboard`

See Next.js documentation for more: https://nextjs.org/docs

---

**Need help? Check TROUBLESHOOTING.md**
