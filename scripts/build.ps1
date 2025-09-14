# EduAssist Build Script
# Creates a clean ZIP file for manual Chrome installation

param([string]$version = "1.0.2")

Write-Host "Building EduAssist v$version..." -ForegroundColor Green

# Get project root and create build folder
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
$buildDir = "build"
$zipFile = "eduassist-v$version.zip"

# Clean previous build
if (Test-Path $buildDir) { Remove-Item -Recurse -Force $buildDir }
if (Test-Path $zipFile) { Remove-Item -Force $zipFile }
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null

# Copy extension files
$files = @("manifest.json", "src", "assets")
foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item -Recurse $file "$buildDir\" -Force
        Write-Host "Copied $file" -ForegroundColor Green
    }
}

# Create ZIP
Compress-Archive -Path "$buildDir\*" -DestinationPath $zipFile -Force
Remove-Item -Recurse -Force $buildDir

$sizeKB = [math]::Round((Get-Item $zipFile).Length / 1KB, 1)
Write-Host "Built successfully: $zipFile ($sizeKB KB)" -ForegroundColor Green

# Show installation instructions
Write-Host ""
Write-Host "Installation Instructions:" -ForegroundColor Yellow
Write-Host "1. Extract $zipFile to a folder" -ForegroundColor White
Write-Host "2. Open Chrome -> chrome://extensions/" -ForegroundColor White  
Write-Host "3. Enable 'Developer mode' (top-right toggle)" -ForegroundColor White
Write-Host "4. Click 'Load unpacked'" -ForegroundColor White
Write-Host "5. Select the extracted folder" -ForegroundColor White

# Open folder
Start-Process "explorer.exe" "/select,$(Resolve-Path $zipFile)"