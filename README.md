# Twitter Link Rewriter

A cross-browser extension for Chrome and Firefox that automatically rewrites Twitter/X links when you copy them using the share button. Perfect for sharing tweets with better embeds or privacy-friendly alternatives!

## ✨ Features

- 🔄 **Automatic URL Rewriting** - Intercepts clipboard when copying Twitter/X links
- 🎨 **Multiple Rewrite Modes**:
  - **vxTwitter** - Better embeds for Discord/Telegram
  - **fxTwitter** - Alternative embed service
  - **Nitter** - Privacy-friendly Twitter frontend (customizable instance)
  - **Clean URL** - Removes tracking parameters
  - **Original** - Keeps URLs unchanged
- 🌐 **Cross-Browser Compatible** - Works on both Chrome and Firefox
- ⚙️ **Easy Configuration** - Simple popup interface to change settings
- 🔔 **Visual Feedback** - Notifications when links are rewritten

## 📦 Installation

### Chrome

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `twitter link rewriter` folder
6. The extension is now installed! 🎉

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Navigate to the `twitter link rewriter` folder and select `manifest.json`
5. The extension is now installed! 🎉

**Note:** For permanent installation in Firefox, you'll need to sign the extension through Mozilla's Add-on Developer Hub.

## 🚀 Usage

1. **Install the extension** following the instructions above
2. **Navigate to Twitter/X** (twitter.com or x.com)
3. **Open any tweet** you want to share
4. **Click the share button** and select "Copy link"
5. **The URL is automatically rewritten** based on your settings!

### Configuring the Extension

1. Click the extension icon in your browser toolbar
2. Select your preferred rewrite mode:
   - **vxTwitter** - Converts links to vxtwitter.com (great for Discord)
   - **fxTwitter** - Converts links to fxtwitter.com
   - **Nitter** - Converts links to your chosen Nitter instance
   - **Clean URL** - Removes tracking parameters only
   - **Custom Rules** - Use your own rewrite rules (see below)
   - **Original** - Disables rewriting
3. Click "Save Settings"

### Creating Custom Rewrite Rules

The extension now supports custom rewrite rules for maximum flexibility!

1. Click the extension icon
2. Select "Custom Rules" mode
3. Click "+ Add Rule" to create a new rule
4. Fill in the form:
   - **Rule Name**: A descriptive name for your rule
   - **Pattern**: The text or regex pattern to match
   - **Replacement**: What to replace the pattern with

**Pattern Examples:**
- `https://{domain}` - Use `{domain}` as a placeholder for `twitter.com` or `x.com`
- `/twitter\.com/g` - Regex pattern with flags
- `https://twitter.com` - Simple string match

**Replacement Examples:**
- `https://nitter.net` - Replace with a different domain
- `https://example.com` - Any custom service
- `$1custom.com$2` - Use `$1`, `$2` for regex capture groups

**Example Custom Rules:**

| Name | Pattern | Replacement | Result |
|------|---------|-------------|--------|
| Nitter EU | `https://{domain}` | `https://nitter.eu` | Links go to nitter.eu |
| ThreadReader | `https://{domain}` | `https://threadreaderapp.com` | Convert to thread reader |
| Archive | `/^https:\/\//` | `https://archive.is/` | Archive all links |

> 📖 **See [CUSTOM_RULES_EXAMPLES.md](CUSTOM_RULES_EXAMPLES.md) for 20+ ready-to-use custom rule examples!**

## 🛠️ How It Works

The extension uses two methods to intercept and rewrite URLs:

1. **Copy Event Listener** - Monitors copy events on Twitter pages
2. **Click Monitoring** - Detects share button clicks and rewrites the clipboard

When a Twitter/X URL is detected, it's automatically rewritten according to your configuration before being placed on the clipboard.

## 📋 Examples

### Original Twitter URL
```
https://twitter.com/user/status/1234567890123456789
```

### Rewritten URLs

**vxTwitter Mode:**
```
https://vxtwitter.com/user/status/1234567890123456789
```

**fxTwitter Mode:**
```
https://fxtwitter.com/user/status/1234567890123456789
```

**Nitter Mode:**
```
https://nitter.net/user/status/1234567890123456789
```

**Clean URL Mode:**
```
https://twitter.com/user/status/1234567890123456789
(tracking parameters removed)
```

## 🔒 Privacy

This extension:
- ✅ Only runs on Twitter/X websites
- ✅ Stores settings locally in your browser
- ✅ Does NOT collect any data
- ✅ Does NOT send data to external servers
- ✅ Only requires clipboard write permission

## 🎨 Customization

### Managing Custom Rules

- **Enable/Disable**: Click the checkbox next to a rule to enable or disable it
- **Delete**: Click the "Delete" button to remove a rule
- **Multiple Rules**: Create multiple rules that will be applied in order
- **Test**: Rules are applied immediately when you save settings

### Tips for Custom Rules

1. **Test your patterns** - Make sure they match what you expect
2. **Use {domain}** - Built-in placeholder that matches both twitter.com and x.com
3. **Regex power** - Use regex for advanced patterns: `/pattern/flags`
4. **Capture groups** - Use $1, $2, etc. in replacements for regex matches
5. **Order matters** - Rules are applied in the order they appear

### Advanced Pattern Examples

**Remove specific query parameters:**
```
Pattern: /[?&]s=[^&]+/g
Replacement: (empty)
```

**Add parameters to all links:**
```
Pattern: /(status\/\d+)/
Replacement: $1?lang=en
```

**Route through a proxy:**
```
Pattern: https://{domain}
Replacement: https://myproxy.com/fetch?url=https://twitter.com
```

## 🐛 Troubleshooting

**Extension not working?**
- Make sure you're on twitter.com or x.com
- Check that the extension is enabled in your browser
- Try refreshing the Twitter page

**URLs not being rewritten?**
- Check your extension settings (click the icon)
- Make sure you're using the share button's "Copy link" feature
- Check the browser console for any errors

**Firefox-specific issues?**
- Make sure you're using Firefox 109 or later
- Try reinstalling the extension as a temporary add-on

## 📝 File Structure

```
twitter link rewriter/
├── manifest.json           # Extension configuration
├── content.js             # Main content script (URL rewriting logic)
├── background.js          # Background service worker
├── popup.html             # Settings popup UI
├── popup.js               # Settings popup logic
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## 🔧 Development

To modify the extension:

1. Edit the source files
2. Reload the extension in your browser:
   - **Chrome:** Go to `chrome://extensions/` and click the reload icon
   - **Firefox:** Go to `about:debugging` and click "Reload"
3. Refresh the Twitter page to test changes

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Credits

- vxTwitter - https://github.com/dylanpdx/BetterTwitFix
- fxTwitter - https://github.com/FixTweet/FxTwitter
- Nitter - https://github.com/zedeus/nitter

---

Made with ❤️ for better Twitter link sharing
