@echo off
REM PartsQuote Pages Migration Script (Windows)
REM This script migrates all page components from /pages to /components/page-components

echo Starting PartsQuote Pages Migration...
echo.

REM Step 1: Create target directory
echo Creating /components/page-components directory...
if not exist "components\page-components" mkdir "components\page-components"

REM Step 2: Copy files
echo Copying page component files...
xcopy /Y /I "pages\*.tsx" "components\page-components\"

REM Step 3: Run Node.js script to update imports
echo Updating imports...
node migrate-pages-script.js

REM Step 4: Delete old folders
echo Removing old /pages folder...
if exist "pages" rmdir /S /Q "pages"
if exist "lib" rmdir /S /Q "lib"

REM Step 5: Clean up
echo Cleaning up migration files...
if exist "migrate-pages-script.js" del "migrate-pages-script.js"
if exist "MIGRATION_GUIDE.md" del "MIGRATION_GUIDE.md"
if exist "PAGES_MIGRATION_README.md" del "PAGES_MIGRATION_README.md"
if exist "QUICK_START.md" del "QUICK_START.md"

echo.
echo Migration complete!
echo.
echo Next steps:
echo   1. npm install
echo   2. npm run dev
echo   3. Test at http://localhost:3000
echo.
pause
