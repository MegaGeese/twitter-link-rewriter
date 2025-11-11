// Background service worker for Twitter Link Rewriter
// Handles extension initialization and storage management

console.log('Twitter Link Rewriter: Background service worker loaded');

// Set default configuration on installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Twitter Link Rewriter: Extension installed');
    
    // Set default configuration
    chrome.storage.sync.set({
      rewriteMode: 'vxtwitter',
      nitterInstance: 'nitter.net',
      customRewrites: []
    }, () => {
      console.log('Twitter Link Rewriter: Default configuration set');
    });
  } else if (details.reason === 'update') {
    console.log('Twitter Link Rewriter: Extension updated');
    
    // Migrate existing users to have customRewrites array
    chrome.storage.sync.get(['customRewrites'], (result) => {
      if (!result.customRewrites) {
        chrome.storage.sync.set({ customRewrites: [] });
      }
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConfig') {
    // Return current configuration
    chrome.storage.sync.get(['rewriteMode', 'nitterInstance', 'customRewrites'], (result) => {
      sendResponse({
        rewriteMode: result.rewriteMode || 'vxtwitter',
        nitterInstance: result.nitterInstance || 'nitter.net',
        customRewrites: result.customRewrites || []
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'setConfig') {
    // Update configuration
    const config = {
      rewriteMode: request.rewriteMode,
      nitterInstance: request.nitterInstance
    };
    
    if (request.customRewrites !== undefined) {
      config.customRewrites = request.customRewrites;
    }
    
    chrome.storage.sync.set(config, () => {
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
});
