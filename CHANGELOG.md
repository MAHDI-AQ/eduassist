# Changelog

All notable changes to EduAssist will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Future features will be listed here

### Changed
- Future changes will be listed here

### Fixed
- Future bug fixes will be listed here

## [1.0.1] - 2025-09-14

### Fixed
- **Critical**: Fixed service worker registration failure (Status code: 15)
- **Critical**: Fixed `TypeError: Cannot read properties of undefined (reading 'onClicked')` in background script
- Enhanced Chrome extension API availability checks with proper null-safe validation
- Added comprehensive error handling throughout the background service worker
- Fixed unsafe API access for `chrome.contextMenus` and `chrome.alarms` APIs
- Removed reference to non-existent welcome.html file
- Improved extension startup reliability with better error recovery

### Changed
- Updated manifest version to match build script (1.0.1)
- Wrapped entire service worker in error handling for better stability
- Enhanced logging for better debugging and error tracking
- Improved graceful degradation when Chrome APIs are unavailable

### Technical Improvements
- Added try-catch blocks to all async operations in background script
- Implemented safer API detection using optional chaining and typeof checks
- Added error logging to Chrome storage for debugging purposes
- Enhanced build process stability

## [1.0.0] - 2025-09-14

### Added
- Initial release of EduAssist
- Complete Madrasati platform integration
  - Student data export functionality
  - Attendance tracking and reporting
  - Class management tools
  - Virtual classroom integration
- Comprehensive Noor system support
  - Administrative data extraction
  - Student guidance report generation
  - Grade calculation tools
  - Report viewer enhancements
- Bilingual interface (Arabic/English)
- Local data processing for complete privacy
- Open source under CC BY-NC-SA 4.0 license
- Chrome Manifest V3 compliance
- Modern responsive UI design
- Comprehensive documentation

### Security
- All data processing occurs locally in browser
- No external data transmission
- Secure Chrome storage for settings
- Zero user tracking or analytics

### Technical
- Modern ES6+ JavaScript implementation
- jQuery 3.7.1 integration
- CSS with RTL support
- Modular architecture with feature separation
- Cross-browser compatibility (Chrome, Edge, Opera, Brave)

---

## Release Categories

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Any bug fixes

### Security
- Security improvements

### Technical
- Technical improvements and optimizations