/* ============================================================
   PRIME PATHWY — CLIENT ONBOARDING PORTAL
   app.js — Front-End Logic
   WAT Framework: /tools/prime_pathwy_portal/
   ============================================================ */

'use strict';

// ---- STATE ---- //
const state = {
  currentUser: null,
  files: {
    before: [],
    after: []
  },
  uploaded: {
    before: false,
    after: false
  }
};

// ---- DEMO CREDENTIALS (Replace with backend auth) ---- //
const DEMO_USERS = [
  { email: 'client@primepathwy.com', password: 'Sovereign2026!', name: 'Client Account', initials: 'CA' },
  { email: 'demo@primepathwy.com',   password: 'demo1234',        name: 'Demo User',      initials: 'DU' }
];

// ---- INIT ---- //
document.addEventListener('DOMContentLoaded', () => {
  // Set today's date in service info
  const dateEl = document.getElementById('service-date-display');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }
});

/* ============================================================
   AUTH
   ============================================================ */

/**
 * Handle login form submission.
 * @param {Event} e
 */
function handleLogin(e) {
  e.preventDefault();

  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorEl       = document.getElementById('login-error');
  const loginBtn      = document.getElementById('login-btn');
  const btnText       = loginBtn.querySelector('.btn-text');
  const spinner       = document.getElementById('login-spinner');

  const email    = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Clear previous errors
  errorEl.classList.add('hidden');

  // Show loading state
  btnText.textContent = 'Verifying...';
  spinner.classList.remove('hidden');
  loginBtn.disabled = true;

  // Simulate async auth (replace with real API call)
  setTimeout(() => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      state.currentUser = user;
      loginSuccess(user);
    } else {
      // Show error
      errorEl.classList.remove('hidden');
      btnText.textContent = 'Access Portal';
      spinner.classList.add('hidden');
      loginBtn.disabled = false;
      passwordInput.value = '';
      passwordInput.focus();
    }
  }, 900);
}

/**
 * Transition to dashboard after successful login.
 * @param {Object} user
 */
function loginSuccess(user) {
  // Update user display
  const avatarEl = document.getElementById('user-avatar');
  const nameEl   = document.getElementById('user-display-name');
  if (avatarEl) avatarEl.textContent = user.initials;
  if (nameEl)   nameEl.textContent   = user.name;

  // Switch screens
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-dashboard').classList.add('active');
}

/**
 * Handle logout.
 */
function handleLogout() {
  state.currentUser = null;
  state.files = { before: [], after: [] };
  state.uploaded = { before: false, after: false };

  // Reset form
  document.getElementById('login-form').reset();
  document.getElementById('login-error').classList.add('hidden');
  const loginBtn = document.getElementById('login-btn');
  loginBtn.querySelector('.btn-text').textContent = 'Access Portal';
  loginBtn.querySelector('#login-spinner').classList.add('hidden');
  loginBtn.disabled = false;

  // Switch screens
  document.getElementById('screen-dashboard').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
}

/**
 * Toggle password visibility.
 */
function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ============================================================
   NAVIGATION
   ============================================================ */

/**
 * Show a dashboard tab.
 * @param {string} tabId
 * @param {HTMLElement} navEl
 */
function showTab(tabId, navEl) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');

  // Update page title
  const titles = {
    upload:    'Before & After Photo Upload',
    history:   'Service History',
    documents: 'Documents',
    profile:   'My Profile'
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = titles[tabId] || '';
}

/* ============================================================
   FILE HANDLING
   ============================================================ */

/**
 * Handle drag over event.
 * @param {DragEvent} e
 */
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

/**
 * Handle drag leave event.
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

/**
 * Handle file drop.
 * @param {DragEvent} e
 * @param {string} type - 'before' | 'after'
 */
function handleDrop(e, type) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  addFiles(files, type);
}

/**
 * Handle file input selection.
 * @param {Event} e
 * @param {string} type - 'before' | 'after'
 */
function handleFileSelect(e, type) {
  const files = Array.from(e.target.files);
  addFiles(files, type);
  // Reset input so same file can be re-selected
  e.target.value = '';
}

/**
 * Add files to state and render previews.
 * @param {File[]} files
 * @param {string} type
 */
function addFiles(files, type) {
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  const valid = files.filter(f => {
    if (f.size > MAX_SIZE) {
      showStatus(type, 'error', `${f.name} exceeds 25MB limit.`);
      return false;
    }
    return true;
  });

  state.files[type] = [...state.files[type], ...valid];
  renderPreviews(type);
}

/**
 * Render image previews for a given type.
 * @param {string} type
 */
function renderPreviews(type) {
  const grid = document.getElementById(type + '-preview-grid');
  if (!grid) return;

  grid.innerHTML = '';

  state.files[type].forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}" title="${file.name}" />
        <button class="preview-remove" onclick="removeFile('${type}', ${index})" aria-label="Remove">×</button>
      `;
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });

  // Show count
  if (state.files[type].length > 0) {
    const countEl = document.createElement('p');
    countEl.className = 'preview-count';
    countEl.textContent = `${state.files[type].length} photo${state.files[type].length !== 1 ? 's' : ''} selected`;
    grid.appendChild(countEl);
  }
}

/**
 * Remove a file from state.
 * @param {string} type
 * @param {number} index
 */
function removeFile(type, index) {
  state.files[type].splice(index, 1);
  renderPreviews(type);
}

/**
 * Clear all files for a type.
 * @param {string} type
 */
function clearFiles(type) {
  state.files[type] = [];
  state.uploaded[type] = false;
  renderPreviews(type);
  clearStatus(type);
}

/* ============================================================
   UPLOAD
   ============================================================ */

/**
 * Simulate file upload for a given type.
 * Replace the setTimeout block with a real fetch/FormData API call.
 * @param {string} type
 */
function uploadFiles(type) {
  const files = state.files[type];
  if (!files.length) {
    showStatus(type, 'error', 'No photos selected. Please add photos first.');
    return;
  }

  const btn = document.getElementById(type + '-upload-btn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';

  showStatus(type, 'uploading', `Uploading ${files.length} photo${files.length !== 1 ? 's' : ''}...`);

  // ---- REPLACE THIS BLOCK WITH REAL API CALL ---- //
  // Example:
  // const formData = new FormData();
  // files.forEach(f => formData.append('photos', f));
  // formData.append('type', type);
  // formData.append('serviceId', 'SERVICE-001');
  // fetch('/api/upload', { method: 'POST', body: formData })
  //   .then(res => res.json())
  //   .then(data => { ... })
  //   .catch(err => { ... });
  // ------------------------------------------------ //

  setTimeout(() => {
    state.uploaded[type] = true;
    btn.disabled = false;
    btn.textContent = type === 'before' ? 'Upload BEFORE Photos' : 'Upload AFTER Photos';
    showStatus(type, 'success', `${files.length} photo${files.length !== 1 ? 's' : ''} uploaded successfully. Timestamped & secured.`);
  }, 1500 + Math.random() * 800);
}

/**
 * Show upload status message.
 * @param {string} type
 * @param {'success'|'error'|'uploading'} level
 * @param {string} message
 */
function showStatus(type, level, message) {
  const el = document.getElementById(type + '-status');
  if (!el) return;

  const icons = {
    success:   '✓',
    error:     '✕',
    uploading: '↑'
  };

  el.innerHTML = `<span class="status-${level}">${icons[level]} ${message}</span>`;
}

/**
 * Clear status message.
 * @param {string} type
 */
function clearStatus(type) {
  const el = document.getElementById(type + '-status');
  if (el) el.innerHTML = '';
}

/* ============================================================
   SUBMIT SERVICE RECORD
   ============================================================ */

/**
 * Finalize and submit the complete service record.
 */
function submitServiceRecord() {
  if (!state.uploaded.before && !state.uploaded.after) {
    alert('Please upload at least one set of photos (Before or After) before submitting.');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    Submitting Record...
  `;

  // Simulate API call
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Finalize & Submit Service Record
    `;
    showSuccessModal();
  }, 1200);
}

/* ============================================================
   MODAL
   ============================================================ */

/**
 * Show the success confirmation modal.
 */
function showSuccessModal() {
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  const refId = 'PP-' + now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  document.getElementById('modal-timestamp').textContent = 'Submitted: ' + timestamp + ' PST';
  document.getElementById('modal-ref').textContent       = 'Reference ID: ' + refId;

  document.getElementById('success-modal').classList.remove('hidden');
}

/**
 * Close the success modal.
 */
function closeModal() {
  document.getElementById('success-modal').classList.add('hidden');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('success-modal');
  if (e.target === overlay) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
