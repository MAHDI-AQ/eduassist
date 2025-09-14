# 📁 EduAssist Project Structure

```
EduAssist/
├── 📄 README.md                # Main documentation (Arabic/English)
├── 📄 LICENSE                  # CC BY-NC-SA 4.0 License
├── 📄 manifest.json            # Chrome Extension configuration
├── 📄 build.bat                # 🚀 Quick build (Windows)
├── 📄 CHANGELOG.md             # Release notes
├── 📄 PRE-RELEASE-CHECKLIST.md # Quality checklist
│
├── 📁 assets/                  # Extension assets
│   ├── css/
│   │   ├── content-styles.css  # Content script styles
│   │   └── popup-styles.css    # Popup interface styles
│   └── icons/
│       ├── icon16.svg          # 16x16 icon
│       ├── icon48.svg          # 48x48 icon
│       └── icon128.svg         # 128x128 icon
│
├── 📁 src/                     # Source code
│   ├── background/
│   │   └── background.js       # Service worker
│   ├── content/
│   │   └── content-main.js     # Main content script
│   ├── features/
│   │   ├── madrasati.js        # Madrasati platform features
│   │   └── noor.js             # Noor system features
│   ├── popup/
│   │   ├── popup.html          # Extension popup interface
│   │   └── popup.js            # Popup functionality
│   └── utils/
│       ├── helpers.js          # Utility functions
│       └── jquery.min.js       # jQuery library
│
├── 📁 docs/                    # Documentation
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   ├── DISTRIBUTION.md         # Chrome Web Store guide
│   ├── GIT_SETUP.md           # Git repository setup
│   ├── PACKAGING.md           # Build guide
│   └── PROJECT_STATUS.md      # Project status
│
└── 📁 scripts/                 # Build scripts
    ├── README.md              # Scripts documentation
    └── build.ps1              # 🔧 Main build script
```

## 🚀 Quick Start

1. **Build extension:** `build.bat`
2. **Extract ZIP file**
3. **Install in Chrome:** Extensions → Developer mode → Load unpacked

## 🎯 Key Files

- **`build.bat`** - One-click build for Windows
- **`scripts/build.ps1`** - Main build script
- **`manifest.json`** - Extension configuration
- **`src/`** - All source code
- **`docs/`** - Complete documentation