# Icon Conversion Instructions

## Converting SVG to PNG

To convert the SVG icons to PNG format required by Chrome extensions:

### Option 1: Using Online Tools
1. Visit https://cloudconvert.com/svg-to-png
2. Upload each SVG file (icon16.svg, icon48.svg, icon128.svg)
3. Download the converted PNG files
4. Rename them to icon16.png, icon48.png, icon128.png

### Option 2: Using Inkscape (if installed)
```bash
inkscape icon16.svg --export-png=icon16.png --export-width=16 --export-height=16
inkscape icon48.svg --export-png=icon48.png --export-width=48 --export-height=48
inkscape icon128.svg --export-png=icon128.png --export-width=128 --export-height=128
```

### Option 3: Using ImageMagick (if installed)
```bash
magick convert icon16.svg icon16.png
magick convert icon48.svg icon48.png
magick convert icon128.svg icon128.png
```

## Icon Design Description
- **Colors**: Forest Green (#2E8B57) and Gold (#FFD700)
- **Theme**: Educational with book, graduation cap, and Arabic letter (ع)
- **Style**: Professional, clean, suitable for Saudi educational context
- **Sizes**: 16x16, 48x48, 128x128 pixels as required by Chrome extension manifest

## Note
For now, the extension can load with SVG files, but PNG is recommended for best compatibility.