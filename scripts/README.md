# Development Build Scripts

This folder contains scripts for building and deploying the EduAssist extension.

## Scripts

### `dev-build.ps1`
Development build script that:
- Cleans and rebuilds the extension
- Copies files directly to development folder
- Optimized for rapid development/testing cycle

**Usage:**
```powershell
# Use default path (C:\Users\mahdi\Desktop\eduassist-dev)
.\scripts\dev-build.ps1

# Use custom path
.\scripts\dev-build.ps1 -DevPath "C:\path\to\your\folder"
```

### `build.ps1`
Production build script that:
- Creates packaged .zip file
- Includes version info and installation instructions
- Used for distribution

**Usage:**
```powershell
.\scripts\build.ps1
```

## Development Workflow

1. **Initial Setup:**
   ```powershell
   .\scripts\dev-build.ps1
   ```
   - Load the extension in Chrome from `C:\Users\mahdi\Desktop\eduassist-dev`

2. **Development Cycle:**
   - Make changes to source files
   - Run `.\dev-build.bat` (double-click or from terminal)
   - Reload extension in Chrome (click 🔄 button in chrome://extensions/)
   - Test changes

3. **Quick Access:**
   - Double-click `dev-build.bat` in the root folder
   - Or run from PowerShell: `.\scripts\dev-build.ps1`

## Notes

- Development folder is automatically cleaned on each build
- Extension must be loaded as "unpacked" in Chrome developer mode
- Changes take effect immediately after reload in Chrome
- No need to manually extract or copy files

That's it! 🎉