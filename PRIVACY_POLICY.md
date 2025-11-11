# Privacy Policy for Twitter Link Rewriter

**Last Updated: November 10, 2025**

## Overview

Twitter Link Rewriter is committed to protecting your privacy. This privacy policy explains how our browser extension handles data and what information, if any, is collected or processed.

## Data Collection

**We do not collect, store, or transmit any personal data.**

Twitter Link Rewriter operates entirely within your browser and does not communicate with any external servers or third-party services.

## Information We Process Locally

The extension processes the following information locally on your device:

### 1. Twitter/X Page URLs
- **What:** The URL of Twitter/X pages you visit
- **Why:** To identify when you copy a tweet link and rewrite it according to your preferences
- **How:** The extension reads `window.location.href` only when you click the "Copy link" button
- **Storage:** URLs are not stored or logged anywhere

### 2. User Interactions
- **What:** Detection of clicks on the "Copy link" button in Twitter's share menu
- **Why:** To trigger the URL rewriting functionality
- **How:** Event listeners monitor clicks on specific UI elements on Twitter/X pages only
- **Storage:** Click events are not recorded, logged, or stored

### 3. Extension Settings
- **What:** Your preferences for URL rewriting (mode, custom rules, Nitter instance)
- **Why:** To remember your settings between browser sessions
- **How:** Settings are stored using Chrome's `chrome.storage.sync` API
- **Storage:** Stored locally in your browser; may sync across your devices if you're signed into Chrome/Firefox
- **Control:** You can clear these settings at any time by resetting the extension or removing it

## What We Do NOT Collect

We explicitly do NOT collect, access, store, or transmit:

- ❌ Personally identifiable information (name, email, address, etc.)
- ❌ Health information
- ❌ Financial or payment information
- ❌ Authentication information (passwords, credentials)
- ❌ Personal communications (emails, messages, DMs)
- ❌ Location data (GPS, IP address)
- ❌ Web browsing history
- ❌ Tweet content, profiles, or user data
- ❌ Search queries or typed information
- ❌ Mouse movements, scrolling, or keystroke data
- ❌ Analytics or usage statistics

## Permissions Explained

The extension requires the following browser permissions:

### `clipboardWrite`
- **Purpose:** To write the rewritten URL to your clipboard
- **Usage:** Only activated when you click "Copy link" on a Twitter/X post
- **Limitation:** Only writes URLs; does not read your clipboard

### `storage`
- **Purpose:** To save your extension settings locally
- **Usage:** Stores your rewrite mode preferences and custom rules
- **Limitation:** Only stores settings you explicitly configure; no tracking data

### Host Permissions (`twitter.com`, `x.com`)
- **Purpose:** To run the extension on Twitter/X websites
- **Usage:** Monitors "Copy link" button clicks and accesses page URLs
- **Limitation:** Only works on Twitter/X domains; no access to other websites

## Third-Party Services

The extension itself does not communicate with any third-party services. However:

- If you configure the extension to use a service like **vxTwitter**, **fxTwitter**, or **Nitter**, the rewritten URL will point to that service
- When you paste and visit those rewritten links, you will be subject to the privacy policies of those third-party services
- This extension does not control or assume responsibility for third-party services

## Data Security

Since the extension does not collect or transmit any data:

- All processing happens locally in your browser
- Settings are stored using browser-provided secure storage APIs
- No data leaves your device through this extension
- No servers, databases, or external connections are used

## Children's Privacy

This extension does not knowingly collect any information from anyone, including children under the age of 13. Since we do not collect any personal data, the extension is safe for users of all ages.

## Changes to Privacy Policy

If we make changes to this privacy policy, we will update the "Last Updated" date at the top of this document. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Open Source

This extension is open source. You can review the complete source code to verify our privacy claims:

- Content Script: `content.js` - Handles URL rewriting
- Background Script: `background.js` - Manages settings storage
- Popup: `popup.js` - Settings interface

## Your Rights and Control

You have complete control over this extension:

- **View Settings:** Click the extension icon to see your current configuration
- **Modify Settings:** Change or delete custom rules at any time
- **Reset Settings:** Remove and reinstall the extension to reset all settings
- **Uninstall:** Remove the extension to delete all stored settings

## Contact

If you have questions about this privacy policy or the extension's privacy practices, you can:

- Review the source code in the extension folder
- Open an issue on the project's repository (if applicable)
- Contact the developer through the Chrome Web Store or Firefox Add-ons page

## Compliance

This extension complies with:

- Chrome Web Store Developer Program Policies
- Firefox Add-on Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

Since no personal data is collected, most data protection regulations do not apply to this extension's operation.

---

**Summary:** Twitter Link Rewriter is a privacy-respecting browser extension that operates entirely locally on your device. It does not collect, store, or transmit any personal information. Your extension settings are stored locally in your browser and never leave your device through our extension.
