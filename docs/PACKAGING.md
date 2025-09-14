# 📦 EduAssist Packaging Guide

Simple guide to build and package the EduAssist Chrome extension for distribution.

## Quick Start

### Build the Extension
Run the build script to create a distribution package:

**Windows (PowerShell):**
```powershell
.\scripts\build.ps1
```

**Windows (Command Prompt):**
```cmd
.\build.bat
```

This creates `eduassist-v1.0.0.zip` (~65KB) ready for installation.

## Manual Installation Instructions

### For Users
1. Download the `eduassist-v1.0.0.zip` file
2. Extract to a folder (e.g., `C:\EduAssist`)
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked" and select the extracted folder
6. The extension is now installed and ready to use!

### For Developers
1. Clone the repository
2. Run the build script to create a clean package
3. Test the packaged version before distribution

## Build Process Details

The build script:
- Creates a clean copy of essential files
- Includes: `manifest.json`, `src/`, `assets/`
- Excludes: development files, documentation, build tools
- Generates a ZIP file for distribution
- Shows file size and completion status

### Build Output
```
✅ Copied manifest.json
✅ Copied src/
✅ Copied assets/
📦 Created: eduassist-v1.0.0.zip (65.1 KB)
🎯 Ready for manual installation!
```

## File Structure

The packaged extension contains:
```
eduassist-v1.0.0/
├── manifest.json          # Extension configuration
├── src/                   # Source code
│   ├── background/        # Background scripts
│   ├── content/           # Content scripts  
│   ├── popup/             # Popup interface
│   ├── features/          # Platform integrations
│   └── utils/             # Helper utilities
└── assets/                # Styles and icons
    ├── css/               # Stylesheets
    └── icons/             # Extension icons
```

## Distribution

### Current Approach
- **Manual Installation Only**: Users download ZIP and install via developer mode
- **No Chrome Web Store**: Not published to Chrome Web Store
- **Direct Distribution**: Share ZIP file directly with users

### Installation Requirements
- Chrome or Edge browser (latest version recommended)
- Developer mode enabled in browser
- Basic computer skills for extracting ZIP files

## Version Management

- Current version: `1.0.0` (defined in `manifest.json`)
- Update version in `manifest.json` before building
- Build script automatically includes version in filename

## Troubleshooting

### Common Issues:

**Build Script Fails:**
- Ensure you're in the project root directory
- Check PowerShell execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Verify all source files exist

**Installation Problems:**
- Make sure Developer mode is enabled in Chrome
- Extract ZIP completely before loading
- Check that `manifest.json` exists in the extracted folder

**Extension Not Working:**
- Verify you're on Madrasati.sa or Noor platforms
- Check browser console for errors
- Reload the extension in Chrome extensions page

## License

EduAssist is licensed under CC BY-NC-SA 4.0. See `LICENSE` file for details.

---

**Ready to build! Run `.\build.bat` to get started. 🚀**