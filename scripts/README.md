# 📁 Scripts

Simple build script for EduAssist extension.

## 🚀 Quick Build

```bash
# Build extension ZIP file
.\build.ps1

# Or use batch file (Windows)
..\build.bat
```

## � What it does

1. Copies `manifest.json`, `src/`, and `assets/` to a clean build
2. Creates `eduassist-v1.0.0.zip` 
3. Shows installation instructions
4. Opens the folder with the ZIP file

## 🔧 Installation

1. Run the build script
2. Extract the generated ZIP file
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the extracted folder

That's it! 🎉