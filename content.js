// Content script for Twitter Link Rewriter
// Intercepts copy events and rewrites Twitter/X URLs

// Cross-browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

console.log('Twitter Link Rewriter: Content script loaded');

// Configuration for URL rewriting
let rewriteConfig = {
  mode: 'vxtwitter', // Options: 'vxtwitter', 'fxtwitter', 'nitter', 'clean', 'custom', 'original'
  nitterInstance: 'nitter.net',
  customRewrites: [] // Array of {name, pattern, replacement, enabled}
};

// Load configuration from storage
browserAPI.storage.sync.get(['rewriteMode', 'nitterInstance', 'customRewrites'], (result) => {
  if (result.rewriteMode) {
    rewriteConfig.mode = result.rewriteMode;
  }
  if (result.nitterInstance) {
    rewriteConfig.nitterInstance = result.nitterInstance;
  }
  if (result.customRewrites) {
    rewriteConfig.customRewrites = result.customRewrites;
  }
});

// Listen for storage changes
browserAPI.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.rewriteMode) {
      rewriteConfig.mode = changes.rewriteMode.newValue;
    }
    if (changes.nitterInstance) {
      rewriteConfig.nitterInstance = changes.nitterInstance.newValue;
    }
    if (changes.customRewrites) {
      rewriteConfig.customRewrites = changes.customRewrites.newValue;
    }
  }
});

/**
 * Apply custom rewrite rules to URL
 * @param {string} url - Original URL
 * @returns {string} - Rewritten URL
 */
function applyCustomRewrites(url) {
  let rewrittenUrl = url;
  
  // Apply each enabled custom rewrite rule
  for (const rule of rewriteConfig.customRewrites) {
    if (!rule.enabled) continue;
    
    try {
      // Support both string replacement and regex patterns
      if (rule.pattern.startsWith('/') && rule.pattern.includes('/')) {
        // Parse regex pattern (e.g., "/pattern/flags")
        const match = rule.pattern.match(/^\/(.+)\/([gimuy]*)$/);
        if (match) {
          const pattern = new RegExp(match[1], match[2]);
          rewrittenUrl = rewrittenUrl.replace(pattern, rule.replacement);
        }
      } else {
        // Simple string replacement with special variable support
        let pattern = rule.pattern;
        let replacement = rule.replacement;
        
        // Support common placeholders
        pattern = pattern.replace(/\{domain\}/g, '(www\\.)?(twitter|x)\\.com');
        
        const regex = new RegExp(pattern, 'g');
        rewrittenUrl = rewrittenUrl.replace(regex, replacement);
      }
    } catch (e) {
      console.error('Error applying custom rewrite rule:', rule, e);
    }
  }
  
  return rewrittenUrl;
}

/**
 * Rewrite Twitter/X URL based on configuration
 * @param {string} url - Original Twitter/X URL
 * @returns {string} - Rewritten URL
 */
function rewriteTwitterUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Only process Twitter/X URLs
    if (!urlObj.hostname.includes('twitter.com') && !urlObj.hostname.includes('x.com')) {
      return url;
    }

    switch (rewriteConfig.mode) {
      case 'vxtwitter':
        // Replace twitter.com/x.com with vxtwitter.com
        return url.replace(/https?:\/\/(www\.)?(twitter|x)\.com/, 'https://vxtwitter.com');
      
      case 'fxtwitter':
        // Replace twitter.com/x.com with fxtwitter.com
        return url.replace(/https?:\/\/(www\.)?(twitter|x)\.com/, 'https://fxtwitter.com');
      
      case 'nitter':
        // Replace twitter.com/x.com with nitter instance
        return url.replace(/https?:\/\/(www\.)?(twitter|x)\.com/, `https://${rewriteConfig.nitterInstance}`);
      
      case 'clean':
        // Remove tracking parameters
        const cleanUrl = new URL(url);
        const paramsToRemove = ['s', 't', 'ref_src', 'ref_url'];
        paramsToRemove.forEach(param => cleanUrl.searchParams.delete(param));
        return cleanUrl.toString();
      
      case 'custom':
        // Apply custom rewrite rules
        return applyCustomRewrites(url);
      
      case 'original':
      default:
        return url;
    }
  } catch (e) {
    console.error('Error rewriting URL:', e);
    return url;
  }
}

/**
 * Extract Twitter URL from the current page or share context
 * @returns {string|null} - The Twitter URL or null
 */
function getCurrentTwitterUrl() {
  // Try to get URL from the current page
  const currentUrl = window.location.href;
  
  // Check if we're on a tweet page
  if (currentUrl.match(/\/\/(twitter|x)\.com/)) {
    return currentUrl.split('?')[0]; // Remove any query parameters
  }
  
  return null;
}

// Track when "Copy link" button is clicked in share submenu
let copyLinkButtonClicked = false;
let copyLinkClickTime = 0;

// Monitor for "Copy link" button clicks in the share submenu
document.addEventListener('click', (e) => {
  // Check if clicked element is specifically the "Copy link" button
  const element = e.target.closest('[role="menuitem"]');
  
  if (element) {
    // Check for "Copy link" text in the button
    const text = element.textContent || element.innerText || '';
    const ariaLabel = element.getAttribute('aria-label') || '';
    
    // Match various possible text variations
    if (text.includes('Copy link') || ariaLabel.includes('Copy link') || 
        text.includes('Copy Link') || ariaLabel.includes('Copy Link')) {
      console.log('Twitter Link Rewriter: Copy link button clicked');
      copyLinkButtonClicked = true;
      copyLinkClickTime = Date.now();
      
      // Reset flag after 500ms
      setTimeout(() => {
        copyLinkButtonClicked = false;
      }, 500);
    }
  }
}, true);

// Method 1: Intercept copy events (only when Copy link button was clicked)
document.addEventListener('copy', (e) => {
  try {
    // Only intercept if the "Copy link" button was recently clicked
    const timeSinceClick = Date.now() - copyLinkClickTime;
    if (!copyLinkButtonClicked || timeSinceClick > 500) {
      return;
    }
    
    // Get the current selection
    const selection = window.getSelection().toString();
    
    // If there's a text selection, don't interfere
    if (selection && selection.trim().length > 0) {
      return;
    }
    
    // Check if we're on a tweet page
    const currentUrl = getCurrentTwitterUrl();
    if (currentUrl) {
      const rewrittenUrl = rewriteTwitterUrl(currentUrl);
      
      if (rewrittenUrl !== currentUrl) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', rewrittenUrl);
        console.log('Twitter Link Rewriter: URL rewritten', {
          original: currentUrl,
          rewritten: rewrittenUrl
        });
        
        // Show a subtle notification
        showNotification('Link rewritten to clipboard!');
      }
    }
  } catch (error) {
    console.error('Twitter Link Rewriter: Error in copy handler', error);
  }
});

// Method 2: Monitor clipboard writes after "Copy link" button click
document.addEventListener('click', (e) => {
  // Check if clicked element is specifically the "Copy link" button in share submenu
  const element = e.target.closest('[role="menuitem"]');
  
  if (element) {
    const text = element.textContent || element.innerText || '';
    const ariaLabel = element.getAttribute('aria-label') || '';
    
    if (text.includes('Copy link') || ariaLabel.includes('Copy link') ||
        text.includes('Copy Link') || ariaLabel.includes('Copy Link')) {
      console.log('Twitter Link Rewriter: Copy link button clicked, will rewrite clipboard');
      
      // Wait for Twitter to copy the link, then rewrite it
      setTimeout(() => {
        const currentUrl = getCurrentTwitterUrl();
        if (currentUrl) {
          const rewrittenUrl = rewriteTwitterUrl(currentUrl);
          if (rewrittenUrl !== currentUrl) {
            // Write to clipboard
            navigator.clipboard.writeText(rewrittenUrl).then(() => {
              console.log('Twitter Link Rewriter: Clipboard updated', {
                original: currentUrl,
                rewritten: rewrittenUrl
              });
              showNotification('Link rewritten to clipboard!');
            }).catch(err => {
              console.error('Twitter Link Rewriter: Failed to write to clipboard', err);
            });
          }
        }
      }, 100);
    }
  }
}, true);

/**
 * Show a subtle notification to the user
 * @param {string} message - Message to display
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1da1f2;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 3000);
}
