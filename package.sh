#!/bin/bash

# Package script for Twitter Link Rewriter extension
# Creates distribution packages for Chrome and Firefox

set -e

echo "📦 Twitter Link Rewriter - Package Builder"
echo "=========================================="

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo "Version: $VERSION"

# Create dist directory
mkdir -p dist
echo "✓ Created dist directory"

# Files to include in the package
FILES=(
  "manifest.json"
  "background.js"
  "content.js"
  "popup.html"
  "popup.js"
  "PRIVACY_POLICY.md"
  "README.md"
  "icons/"
)

# Package for Chrome
CHROME_ZIP="dist/twitter-link-rewriter-chrome-v${VERSION}.zip"
echo ""
echo "📦 Creating Chrome package..."
zip -q -r "$CHROME_ZIP" "${FILES[@]}"
CHROME_SIZE=$(du -h "$CHROME_ZIP" | cut -f1)
echo "✓ Chrome package created: $CHROME_ZIP ($CHROME_SIZE)"

# Package for Firefox (same files)
FIREFOX_ZIP="dist/twitter-link-rewriter-firefox-v${VERSION}.zip"
echo ""
echo "📦 Creating Firefox package..."
cp "$CHROME_ZIP" "$FIREFOX_ZIP"
FIREFOX_SIZE=$(du -h "$FIREFOX_ZIP" | cut -f1)
echo "✓ Firefox package created: $FIREFOX_ZIP ($FIREFOX_SIZE)"

# Summary
echo ""
echo "=========================================="
echo "✓ Packaging complete!"
echo ""
echo "Packages created:"
ls -lh dist/*.zip | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "Next steps:"
echo "  • Chrome: Upload to https://chrome.google.com/webstore/devconsole"
echo "  • Firefox: Upload to https://addons.mozilla.org/developers/"
