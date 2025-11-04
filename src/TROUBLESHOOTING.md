# 🔧 Troubleshooting Guide

## Problem: "Still showing Vite + Next.js mixed"

### Solution:
After downloading, you MUST run the setup script:

**Mac/Linux:**
```bash
chmod +x SETUP.sh && ./SETUP.sh
npm install
npm run dev
```

**Windows:**
```powershell
.\SETUP.ps1
npm install
npm run dev
```

---

## Problem: "Files not in src/ directory"

### Check:
```bash
ls src/
```

### Expected output:
```
app/  components/  pages/  styles/  guidelines/
```

### If you see only "app" and "styles":
You haven't run the setup script yet. Run it now:
```bash
./SETUP.sh
```

---

## Problem: "Cannot find module '@/components/...'"

### Cause:
Files not copied to `src/components/` yet

### Solution:
```bash
# Run setup script first
./SETUP.sh

# Then install
npm install

# Then run
npm run dev
```

---

## Problem: "vite.config.ts still exists"

### Solution:
Delete it manually:

**Mac/Linux:**
```bash
rm vite.config.ts
```

**Windows:**
```powershell
Remove-Item vite.config.ts
```

The setup script should do this, but if it doesn't, delete it manually.

---

## Problem: "Two styles folders"

### Solution:
```bash
# Delete the root one, keep src/styles/
rm -rf styles  # Mac/Linux
Remove-Item -Path styles -Recurse -Force  # Windows
```

---

## Problem: "Module not found: Can't resolve 'X'"

### Solutions:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Problem: "Port 3000 already in use"

### Solution:
Use a different port:
```bash
npm run dev -- -p 3001
```

Or kill the existing process:
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Problem: "Error: Invalid hook call"

### Cause:
Multiple React versions or incorrect imports

### Solution:
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

## Problem: "Setup script won't run"

### Mac/Linux - Permission denied:
```bash
chmod +x SETUP.sh
./SETUP.sh
```

### Windows - Script disabled:
```powershell
# Allow scripts to run
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Then run
.\SETUP.ps1
```

---

## Problem: "App.tsx causing issues"

### Explanation:
`App.tsx` is from the old Vite setup. **Ignore it completely.**

Next.js 16 uses:
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Homepage

### You can delete App.tsx:
```bash
rm App.tsx  # Mac/Linux
Remove-Item App.tsx  # Windows
```

But it won't affect Next.js since it's not imported anywhere.

---

## Problem: "TypeScript errors about paths"

### Check tsconfig.json has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### If missing, add it and restart:
```bash
npm run dev
```

---

## Problem: "Styles not loading"

### Check:
1. `src/styles/globals.css` exists
2. `src/app/layout.tsx` imports it:
   ```typescript
   import "@/styles/globals.css";
   ```

### Solution:
If import is missing, add it to the top of `src/app/layout.tsx`

---

## Problem: "Page is blank / white screen"

### Check browser console:
Press F12 → Console tab → Look for errors

### Common causes:
1. **Components not in src/**: Run setup script
2. **Dependencies not installed**: Run `npm install`
3. **TypeScript errors**: Check terminal for errors

### Solution:
```bash
# Full reset
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## Still Having Issues?

### Verify your setup step-by-step:

1. **Check Node version:**
   ```bash
   node -v  # Should be 18.17 or higher
   ```

2. **Check file structure:**
   ```bash
   ls src/
   # Should show: app components pages styles guidelines
   ```

3. **Check package.json scripts:**
   ```bash
   cat package.json | grep "\"dev\""
   # Should show: "dev": "next dev"
   ```

4. **Check for errors in terminal:**
   Look for red error messages when running `npm run dev`

5. **Check browser console:**
   Press F12, look for red errors

---

## Clean Start (Nuclear Option)

If nothing works, do a complete clean start:

```bash
# 1. Delete everything
rm -rf node_modules package-lock.json .next

# 2. Run setup script again
./SETUP.sh

# 3. Fresh install
npm install

# 4. Start dev server
npm run dev
```

---

**Last Resort:** Re-download the project from Figma Make and start over.
