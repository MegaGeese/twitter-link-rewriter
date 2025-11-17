// Popup script for Twitter Link Rewriter settings

// Cross-browser API compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let customRewrites = [];

// Load current settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Show/hide Nitter instance input based on selection
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const nitterGroup = document.getElementById('nitter-instance-group');
      const customRulesSection = document.getElementById('custom-rules-section');
      
      if (radio.value === 'nitter') {
        nitterGroup.style.display = 'block';
      } else {
        nitterGroup.style.display = 'none';
      }
      
      if (radio.value === 'custom') {
        customRulesSection.style.display = 'block';
      } else {
        customRulesSection.style.display = 'none';
      }
    });
  });
  
  // Add rule button
  document.getElementById('add-rule-button').addEventListener('click', showAddRuleForm);
  
  // Save settings button
  document.getElementById('save-button').addEventListener('click', saveSettings);
});

/**
 * Load settings from storage and update UI
 */
function loadSettings() {
  browserAPI.storage.sync.get(['rewriteMode', 'nitterInstance', 'customRewrites'], (result) => {
    const mode = result.rewriteMode || 'vxtwitter';
    const nitterInstance = result.nitterInstance || 'nitter.net';
    customRewrites = result.customRewrites || [];
    
    // Set radio button
    const radio = document.getElementById(`mode-${mode}`);
    if (radio) {
      radio.checked = true;
      
      // Show Nitter input if Nitter is selected
      if (mode === 'nitter') {
        document.getElementById('nitter-instance-group').style.display = 'block';
      }
      
      // Show custom rules section if Custom is selected
      if (mode === 'custom') {
        document.getElementById('custom-rules-section').style.display = 'block';
      }
    }
    
    // Set Nitter instance
    document.getElementById('nitter-instance').value = nitterInstance;
    
    // Render custom rules
    renderCustomRules();
  });
}

/**
 * Save settings to storage
 */
function saveSettings() {
  const selectedMode = document.querySelector('input[name="mode"]:checked');
  if (!selectedMode) {
    return;
  }
  
  const mode = selectedMode.value;
  const nitterInstance = document.getElementById('nitter-instance').value.trim() || 'nitter.net';
  
  browserAPI.storage.sync.set({
    rewriteMode: mode,
    nitterInstance: nitterInstance,
    customRewrites: customRewrites
  }, () => {
    // Show success feedback
    const button = document.getElementById('save-button');
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.classList.add('saved');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('saved');
    }, 2000);
  });
}

/**
 * Render the list of custom rewrite rules
 */
function renderCustomRules() {
  const container = document.getElementById('custom-rules-list');
  
  if (customRewrites.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">No custom rules yet. Click "+ Add Rule" to create one.</div>';
    return;
  }
  
  container.innerHTML = '';
  
  customRewrites.forEach((rule, index) => {
    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'rule-item';
    
    // Create elements
    const header = document.createElement('div');
    header.className = 'rule-header';
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.className = 'rule-toggle';
    toggle.checked = rule.enabled;
    toggle.addEventListener('change', () => toggleRule(index));
    
    const name = document.createElement('span');
    name.className = 'rule-name';
    name.textContent = rule.name;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'rule-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteRule(index));
    
    header.appendChild(toggle);
    header.appendChild(name);
    header.appendChild(deleteBtn);
    
    const pattern = document.createElement('div');
    pattern.className = 'rule-pattern';
    pattern.innerHTML = `<strong>Pattern:</strong> ${escapeHtml(rule.pattern)}`;
    
    const replacement = document.createElement('div');
    replacement.className = 'rule-replacement';
    replacement.innerHTML = `<strong>Replace:</strong> ${escapeHtml(rule.replacement)}`;
    
    ruleDiv.appendChild(header);
    ruleDiv.appendChild(pattern);
    ruleDiv.appendChild(replacement);
    
    container.appendChild(ruleDiv);
  });
}

/**
 * Show form to add a new rule
 */
function showAddRuleForm() {
  const container = document.getElementById('custom-rules-list');
  
  // Check if form already exists
  if (document.querySelector('.rule-form')) {
    return;
  }
  
  const formDiv = document.createElement('div');
  formDiv.className = 'rule-form';
  
  // Create form groups
  const nameGroup = document.createElement('div');
  nameGroup.className = 'form-group';
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Rule Name:';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'new-rule-name';
  nameInput.placeholder = 'e.g., My Custom Rewrite';
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameInput);
  
  const patternGroup = document.createElement('div');
  patternGroup.className = 'form-group';
  const patternLabel = document.createElement('label');
  patternLabel.textContent = 'Pattern:';
  const patternInput = document.createElement('input');
  patternInput.type = 'text';
  patternInput.id = 'new-rule-pattern';
  patternInput.placeholder = 'e.g., https://{domain} or /twitter\\.com/g';
  patternGroup.appendChild(patternLabel);
  patternGroup.appendChild(patternInput);
  
  const replacementGroup = document.createElement('div');
  replacementGroup.className = 'form-group';
  const replacementLabel = document.createElement('label');
  replacementLabel.textContent = 'Replacement:';
  const replacementInput = document.createElement('input');
  replacementInput.type = 'text';
  replacementInput.id = 'new-rule-replacement';
  replacementInput.placeholder = 'e.g., https://nitter.net';
  replacementGroup.appendChild(replacementLabel);
  replacementGroup.appendChild(replacementInput);
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'form-buttons';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'form-save';
  saveBtn.textContent = 'Save Rule';
  saveBtn.addEventListener('click', saveNewRule);
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'form-cancel';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', cancelAddRule);
  buttonsDiv.appendChild(saveBtn);
  buttonsDiv.appendChild(cancelBtn);
  
  formDiv.appendChild(nameGroup);
  formDiv.appendChild(patternGroup);
  formDiv.appendChild(replacementGroup);
  formDiv.appendChild(buttonsDiv);
  
  container.insertBefore(formDiv, container.firstChild);
  nameInput.focus();
}

/**
 * Save a new custom rule
 */
function saveNewRule() {
  const name = document.getElementById('new-rule-name').value.trim();
  const pattern = document.getElementById('new-rule-pattern').value.trim();
  const replacement = document.getElementById('new-rule-replacement').value.trim();
  
  if (!name || !pattern || !replacement) {
    alert('Please fill in all fields');
    return;
  }
  
  customRewrites.push({
    name: name,
    pattern: pattern,
    replacement: replacement,
    enabled: true
  });
  
  cancelAddRule();
  renderCustomRules();
}

/**
 * Cancel adding a new rule
 */
function cancelAddRule() {
  const form = document.querySelector('.rule-form');
  if (form) {
    form.remove();
  }
}

/**
 * Toggle a rule's enabled state
 */
function toggleRule(index) {
  customRewrites[index].enabled = !customRewrites[index].enabled;
}

/**
 * Delete a custom rule
 */
function deleteRule(index) {
  if (confirm(`Delete rule "${customRewrites[index].name}"?`)) {
    customRewrites.splice(index, 1);
    renderCustomRules();
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
