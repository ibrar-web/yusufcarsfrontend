# PartsQuote - Next.js 16 Setup

Write-Host "🚀 PartsQuote - Next.js 16 Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Create required directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src/components/ui" -Force | Out-Null
New-Item -ItemType Directory -Path "src/pages" -Force | Out-Null
New-Item -ItemType Directory -Path "src/guidelines" -Force | Out-Null
Write-Host "✅ Directories created" -ForegroundColor Green

# Copy components
Write-Host "📦 Copying components..." -ForegroundColor Yellow
if (Test-Path "components") {
    Get-ChildItem -Path "components" -Recurse | Copy-Item -Destination {Join-Path "src/components" $_.FullName.Substring((Get-Item "components").FullName.Length)} -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Components copied to src/components/" -ForegroundColor Green
} else {
    Write-Host "⚠️  No components folder found (might already be copied)" -ForegroundColor Yellow
}

# Copy pages
Write-Host "📄 Copying pages..." -ForegroundColor Yellow
if (Test-Path "pages") {
    Get-ChildItem -Path "pages" -Recurse | Copy-Item -Destination {Join-Path "src/pages" $_.FullName.Substring((Get-Item "pages").FullName.Length)} -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Pages copied to src/pages/" -ForegroundColor Green
} else {
    Write-Host "⚠️  No pages folder found (might already be copied)" -ForegroundColor Yellow
}

# Copy guidelines
Write-Host "📋 Copying guidelines..." -ForegroundColor Yellow
if (Test-Path "guidelines") {
    Get-ChildItem -Path "guidelines" -Recurse | Copy-Item -Destination {Join-Path "src/guidelines" $_.FullName.Substring((Get-Item "guidelines").FullName.Length)} -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Guidelines copied to src/guidelines/" -ForegroundColor Green
} else {
    Write-Host "⚠️  No guidelines folder found (might already be copied)" -ForegroundColor Yellow
}

# Remove duplicate styles folder
Write-Host "🎨 Cleaning up styles..." -ForegroundColor Yellow
if (Test-Path "styles") {
    Remove-Item -Path "styles" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Removed duplicate styles folder (using src/styles/)" -ForegroundColor Green
} else {
    Write-Host "✅ No duplicate styles folder found" -ForegroundColor Green
}

# Delete vite config if it exists
if (Test-Path "vite.config.ts") {
    Write-Host "🗑️  Removing vite.config.ts..." -ForegroundColor Yellow
    Remove-Item "vite.config.ts" -Force
    Write-Host "✅ Removed Vite config" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Your structure is now:" -ForegroundColor Cyan
Write-Host "   src/" -ForegroundColor White
Write-Host "   ├── app/" -ForegroundColor White
Write-Host "   ├── components/" -ForegroundColor White
Write-Host "   ├── pages/" -ForegroundColor White
Write-Host "   ├── styles/" -ForegroundColor White
Write-Host "   └── guidelines/" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. npm install" -ForegroundColor White
Write-Host "   2. npm run dev" -ForegroundColor White
Write-Host "   3. Open http://localhost:3000" -ForegroundColor White
Write-Host ""
