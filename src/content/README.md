# 📄 Content Scripts

This directory contains the main content script for the EduAssist Chrome extension.

## 🏗️ Architecture

The extension uses a **consolidated architecture** where all functionality is embedded in a single file to ensure maximum compatibility with Chrome extension content script requirements.

### Files

- **`content-main.js`** - Main content script containing all functionality:
  - Platform detection (Madrasati, Noor)
  - Data extraction classes
  - UI components (floating widget, modal interface)
  - Main controller logic
  - Export functionality

## 🎯 Why Consolidated?

This approach was chosen to avoid common Chrome extension issues:
- ✅ No ES6 import/export compatibility issues
- ✅ No Content Security Policy (CSP) conflicts
- ✅ No script context isolation problems
- ✅ No dynamic loading complexities
- ✅ Guaranteed execution in the same context

## 🚀 Features

- **Platform Detection**: Automatically detects educational platforms
- **Floating Widget**: Draggable interface trigger
- **Data Extraction**: Student data, attendance, grades
- **Export Options**: JSON and CSV export
- **Arabic UI**: RTL interface for Arabic users
- **Error Handling**: Comprehensive error management

## 📱 Usage

The content script automatically initializes on supported educational platforms and provides a floating widget for user interaction.

## 🔧 Development

Since all code is consolidated in `content-main.js`, modifications should be made directly to that file. The modular class structure is preserved within the file for maintainability.