# 📁 EduAssist Project Structure

```
EduAssist/
├── 📄 README.md                # Main documentation (Arabic/English)
├── 📄 LICENSE                  # CC BY-NC-SA 4.0 License
├── 📄 manifest.json            # Chrome Extension configuration
├── 📄 dev-build.bat            # 🚀 Development build (Windows)
├── 📄 CHANGELOG.md             # Release notes
├── 📄 PROJECT-STRUCTURE.md     # This file
│
├── 📁 scripts/                 # Build scripts
│   ├── build.ps1               # Production build script
│   ├── dev-build.ps1           # Development build script
│   └── README.md               # Build documentation
│
├── 📁 assets/                  # Extension assets
│   ├── css/
│   │   ├── content-styles.css  # Content script styles
│   │   └── popup-styles.css    # Popup interface styles
│   └── icons/
│       ├── icon16.png          # 16x16 icon
│       ├── icon48.png          # 48x48 icon
│       └── icon128.png         # 128x128 icon
│
├── 📁 src/                     # Source code
│   ├── background/
│   │   └── background.js       # Service worker
│   ├── content/
│   │   ├── content-main.js     # **CONSOLIDATED** content script
│   │   └── README.md           # Content script documentation
│   └── popup/
│       ├── popup.html          # Extension popup interface
│       └── popup.js            # Popup functionality
```

## 🏗️ Architecture

The extension uses a **consolidated architecture** where all functionality is embedded in `src/content/content-main.js`:

- ✅ **Platform Detection** - Madrasati & Noor platform detection
- ✅ **Data Extraction** - Student data, attendance, grades
- ✅ **UI Components** - Floating widget, modal interface
- ✅ **Export Functions** - JSON and CSV export
- ✅ **Error Handling** - Comprehensive error management

## 🚀 Development Workflow

1. **Make changes** to source files
2. **Run development build:** `.\dev-build.bat`
3. **Reload extension** in Chrome
4. **Test changes** on educational platforms

## 🎯 Key Features

- **Single File Deployment** - No module loading issues
- **CSP Compatible** - No eval() or unsafe-inline
- **Context Safe** - Runs in main window context
- **Arabic UI** - RTL interface support
- **`scripts/build.ps1`** - Main build script
- **`manifest.json`** - Extension configuration
- **`src/`** - All source code
- **`docs/`** - Complete documentation