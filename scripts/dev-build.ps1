# EduAssist Development Build Script
# Builds and deploys extension directly to development folder for easy testing

param(
    [string]$DevPath = "C:\Users\mahdi\Desktop\eduassist-dev"
)

# Get version from manifest
$manifest = Get-Content -Path "manifest.json" -Raw | ConvertFrom-Json
$version = $manifest.version

Write-Host "Building EduAssist v$version for development..." -ForegroundColor Green

# Create or clean the development directory
if (Test-Path $DevPath) {
    Write-Host "Cleaning existing development folder..." -ForegroundColor Yellow
    Remove-Item -Path "$DevPath\*" -Recurse -Force
} else {
    Write-Host "Creating development folder..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DevPath -Force | Out-Null
}

# Copy files to development folder
Write-Host "Copying extension files..." -ForegroundColor Cyan

# Copy manifest
Copy-Item -Path "manifest.json" -Destination $DevPath
Write-Host "Copied manifest.json"

# Copy src folder
Copy-Item -Path "src" -Destination $DevPath -Recurse
Write-Host "Copied src"

# Copy assets folder
Copy-Item -Path "assets" -Destination $DevPath -Recurse
Write-Host "Copied assets"

# Get folder size
$folderSize = (Get-ChildItem -Path $DevPath -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeInKB = [math]::Round($folderSize / 1KB, 1)

Write-Host ""
Write-Host "Development build completed successfully!" -ForegroundColor Green
Write-Host "Location: $DevPath" -ForegroundColor Cyan
Write-Host "Size: $sizeInKB KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "To reload extension in Chrome:" -ForegroundColor Yellow
Write-Host "   1. Go to chrome://extensions/" -ForegroundColor White
Write-Host "   2. Find 'EduAssist' extension" -ForegroundColor White
Write-Host "   3. Click the reload button" -ForegroundColor White
Write-Host ""
Write-Host "Extension is ready for testing!" -ForegroundColor Green