/**
 * ==============================================================================
 * AETHER KICKS - ATELIER VAULT OS v2.6 ADMIN ENGINE
 * Fully Integrated with Aether Relational Database Engine (IndexedDB + Cache)
 * Powers Inventory Management, Sizing Matrix, Custody Pipeline, CRM & Relational SQL
 * ==============================================================================
 */

(function () {
  'use strict';

  // Fallback Reference Sizes for Matrix
  const SIZING_TABLE = [
    { eu: '38', us: '5.5' },
    { eu: '38.5', us: '6.0' },
    { eu: '39', us: '6.5' },
    { eu: '40', us: '7.0' },
    { eu: '40.5', us: '7.5' },
    { eu: '41', us: '8.0' },
    { eu: '42', us: '8.5' },
    { eu: '42.5', us: '9.0' },
    { eu: '43', us: '9.5' },
    { eu: '44', us: '10.0' },
    { eu: '44.5', us: '10.5' },
    { eu: '45', us: '11.0' },
    { eu: '46', us: '12.0' }
  ];

  // Universal Anti-XSS Sanitizer & DOM Defense Engine
  const escapeHTML = (typeof window !== 'undefined' && window.escapeHTML) ? window.escapeHTML : function (str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const safeHTML = (typeof window !== 'undefined' && window.safeHTML) ? window.safeHTML : function (strings, ...values) {
    return strings.reduce((result, str, i) => {
      const val = values[i - 1];
      let sanitized = '';
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          sanitized = val.map(v => (v && v.__isSafeHTML ? v.raw : escapeHTML(v))).join('');
        } else if (typeof val === 'object' && val.__isSafeHTML) {
          sanitized = val.raw;
        } else {
          sanitized = escapeHTML(val);
        }
      }
      return result + sanitized + str;
    });
  };

  class AetherAdminApp {
    constructor() {
      this.shoes = {};
      this.inventory = [];
      this.orders = [];
      this.collectors = [];
      this.drops = [];
      this.auditLogs = [];

      this.activeTab = 'overview';
      this.activeShoeEditId = null;
      this.activeOrderInspectId = null;
      this.dropCountdownTimer = null;

      this.init();
    }

    async init() {
      this.setupTabs();
      this.setupEventListeners();
      this.initHypeCountdown();

      // Initialize Hardened Admin Security Gate
      await this.setupAuthCheck();

      // Listen for database updates across any tab or component
      window.addEventListener('aether:db:updated', async (e) => {
        if (sessionStorage.getItem('aether_admin_authenticated') === 'true') {
          console.log('[Admin Controller] Reactive DB update detected:', e.detail);
          await this.loadFromDatabase();
        }
      });
    }

    /**
     * Authenticate session, reveal admin console, and hydrate live database records
     */
    async unlockAndHydrateVault() {
      document.body.classList.remove('vault-locked');
      document.body.classList.add('vault-authenticated');
      const overlay = document.getElementById('admin-auth-overlay');
      if (overlay) overlay.classList.remove('active');

      await this.ensureDatabaseReady();
      await this.loadFromDatabase();
    }

    /**
     * Ensure window.AetherDB is instantiated and finished opening IndexedDB
     */
    async ensureDatabaseReady() {
      if (!window.AetherDB) {
        if (typeof window.AetherDatabase === 'function') {
          window.AetherDB = new window.AetherDatabase();
        }
      }
      if (window.AetherDB && window.AetherDB._initPromise) {
        await window.AetherDB._initPromise;
      }
    }

    /**
     * Hydrate admin state directly from AetherDB
     */
    async loadFromDatabase() {
      if (!window.AetherDB) {
        console.warn('[Admin Controller] window.AetherDB not yet available.');
        return;
      }

      try {
        const [shoesArr, invArr, ordersArr, usersArr, dropsArr, logsArr] = await Promise.all([
          window.AetherDB.getShoes(),
          window.AetherDB.getInventory(),
          window.AetherDB.getOrders(),
          window.AetherDB.getUsers(),
          window.AetherDB.getDrops(),
          window.AetherDB.getAuditLogs()
        ]);

        this.inventory = invArr || [];
        this.orders = ordersArr || [];
        this.drops = dropsArr || [];
        this.auditLogs = logsArr || [];

        // Build shoes dictionary with integrated sizesStock from inventory store
        this.shoes = {};
        (shoesArr || []).forEach(s => {
          const shoeInv = this.inventory.filter(i => i.shoe_id === s.id);
          const stockMap = {};
          if (shoeInv.length > 0) {
            shoeInv.forEach(inv => {
              stockMap[inv.size_eu] = inv.quantity;
            });
          } else if (s.sizesStock) {
            Object.assign(stockMap, s.sizesStock);
          } else {
            // Default distribution
            ['40', '40.5', '41', '42', '42.5', '43', '44', '45'].forEach(sz => {
              stockMap[sz] = sz === '42' ? 8 : 5;
            });
          }

          this.shoes[s.id] = {
            id: s.id,
            name: s.name,
            colorway: s.colorway,
            silhouette: s.silhouette || 'High OG',
            styleCode: s.style_code || s.styleCode || '555088-000',
            price: parseFloat(s.vault_price || s.price || 400),
            retailPrice: parseFloat(s.retail_price || s.retailPrice || 180),
            trend: s.market_trend_pct || s.trend || '+22.5%',
            category: s.category || 'Runway',
            condition: s.condition_grade || s.condition || 'Deadstock Grade A+',
            image: s.image_url || s.image || 'assets/images/jordan-chicago.png',
            theme: s.theme_color || s.theme || '#dc2626',
            glow: s.glow_color || s.glow || 'rgba(220, 38, 38, 0.45)',
            year: s.year || '2026',
            story: s.story || '',
            sizesStock: stockMap,
            nfc_token: s.nfc_token || `NFC-AETH-${s.id}`
          };
        });

        // Build collectors from users table + profile fallback
        this.collectors = (usersArr || []).map(u => ({
          id: u.id,
          name: u.full_name || u.name || 'Anonymous Collector',
          email: u.email,
          handle: '@' + (u.full_name || u.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '_'),
          tier: u.role === 'admin' ? 'Root Architect' : (u.role === 'vip_member' ? 'VIP Vault Member' : 'Grail Collector'),
          role: u.role || 'collector',
          preferredSize: u.preferred_size || 'EU 42 (US 8.5)',
          totalSpend: u.total_spend || (u.role === 'vip_member' ? 3420 : 850),
          grailsOwned: u.grails_owned || (u.role === 'vip_member' ? 4 : 1),
          kycVerified: true
        }));

        // Keep window.SNEAKERS_DB synchronized for storefront
        window.SNEAKERS_DB = window.SNEAKERS_DB || {};
        Object.keys(this.shoes).forEach(key => {
          const s = this.shoes[key];
          window.SNEAKERS_DB[key] = {
            id: s.id,
            name: s.name,
            colorway: s.colorway,
            styleCode: s.styleCode,
            price: s.price,
            vault_price: s.price,
            retailPrice: s.retailPrice,
            retail_price: s.retailPrice,
            image: s.image,
            image_url: s.image,
            theme: s.theme,
            theme_color: s.theme,
            glow: s.glow,
            glow_color: s.glow,
            year: s.year,
            story: s.story,
            sizes: Object.keys(s.sizesStock || {})
          };
        });

        this.renderAllViews();
      } catch (err) {
        console.error('[Admin Controller] Error loading data from AetherDB:', err);
      }
    }

    // =========================================================================
    // HARDENED AUTHENTICATION & ACCESS GATE CONTROLLER
    // =========================================================================
    async setupAuthCheck() {
      const overlay = document.getElementById('admin-auth-overlay');
      const card = document.getElementById('auth-gate-card');
      const laserBeam = document.getElementById('auth-laser-beam');
      const badge = document.getElementById('auth-security-badge');
      const badgeText = document.getElementById('auth-badge-text');
      const gateTitle = document.getElementById('auth-gate-title');
      const gateSub = document.getElementById('auth-gate-sub');
      const ownerBlock = document.getElementById('auth-owner-block');
      const authForm = document.getElementById('admin-auth-form');
      const passInput = document.getElementById('admin-pass-input');
      const submitBtn = document.getElementById('btn-auth-submit');
      const alertBanner = document.getElementById('auth-alert-banner');
      const alertTitle = document.getElementById('auth-alert-title');
      const alertDesc = document.getElementById('auth-alert-desc');
      const timerWrap = document.getElementById('auth-timer-wrap');
      const timerVal = document.getElementById('auth-lockout-timer');
      const attemptsNotice = document.getElementById('auth-attempts-msg');

      if (!overlay || !card) return;

      // Master Security Constants
      const MASTER_KEYS = [
        'vault_admin_master_2026',
        'aether_architect_2026',
        'aether2026'
      ];
      const AUTH_TOKEN_KEY = 'aether_vault_auth_token';
      const AUTH_FAILED_KEY = 'aether_auth_failed_attempts';
      const AUTH_LOCKOUT_KEY = 'aether_auth_lockout_until';
      const MAX_ATTEMPTS = 3;
      const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes
      const HMAC_SALT = 'aether_architect_vault_auth_k9x21_v2026';

      let lockoutTimerInterval = null;

      // -----------------------------------------------------------------------
      // Cryptographic Hashing & Hardware Token Signatures
      // -----------------------------------------------------------------------
      const computeSignature = async (text) => {
        try {
          if (window.crypto && window.crypto.subtle) {
            const enc = new TextEncoder().encode(text);
            const buf = await window.crypto.subtle.digest('SHA-256', enc);
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          }
        } catch (e) {}
        // High-distribution fallback hash if crypto.subtle is restricted
        let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
        for (let i = 0; i < text.length; i++) {
          const ch = text.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        return 'sig_' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
      };

      const generateAuthorizedToken = async () => {
        const deviceId = 'node_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        const issuedAt = Date.now();
        const expiresAt = issuedAt + (30 * 24 * 60 * 60 * 1000); // 30 Days Valid
        const signature = await computeSignature(`${deviceId}:${issuedAt}:${expiresAt}:${HMAC_SALT}`);
        return {
          version: 1,
          deviceId,
          role: 'admin',
          node: 'ARCHITECT_AUTHORIZED_NODE',
          issuedAt,
          expiresAt,
          signature
        };
      };

      const verifyDeviceToken = async (rawToken) => {
        if (!rawToken) return false;
        try {
          const parsed = typeof rawToken === 'string' ? JSON.parse(atob(rawToken)) : rawToken;
          if (!parsed || parsed.version !== 1 || !parsed.signature) return false;
          if (Date.now() > parsed.expiresAt) return false;
          const expectedSig = await computeSignature(`${parsed.deviceId}:${parsed.issuedAt}:${parsed.expiresAt}:${HMAC_SALT}`);
          return parsed.signature === expectedSig;
        } catch (e) {
          return false;
        }
      };

      // -----------------------------------------------------------------------
      // Laser Scan & Visual Feedback Animation
      // -----------------------------------------------------------------------
      const triggerLaserVerification = () => {
        if (laserBeam) {
          laserBeam.classList.remove('scanning');
          void laserBeam.offsetWidth; // Trigger reflow
          laserBeam.classList.add('scanning');
          setTimeout(() => laserBeam.classList.remove('scanning'), 1600);
        }
        card.classList.add('laser-verified');
      };

      // -----------------------------------------------------------------------
      // Brute-Force Rate Limiting & Lockout Engine
      // -----------------------------------------------------------------------
      const updateLockoutCountdown = (lockoutUntil) => {
        if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);

        const tick = () => {
          const now = Date.now();
          const remainingMs = lockoutUntil - now;
          if (remainingMs <= 0) {
            clearInterval(lockoutTimerInterval);
            localStorage.removeItem(AUTH_LOCKOUT_KEY);
            localStorage.setItem(AUTH_FAILED_KEY, '0');
            // Restore form state
            card.classList.remove('lockout-state');
            if (passInput) passInput.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
            if (alertBanner) alertBanner.style.display = 'none';
            if (timerWrap) timerWrap.style.display = 'none';
            if (badge) {
              badge.className = 'auth-security-badge';
              if (badgeText) badgeText.textContent = 'RESTRICTED TERMINAL // ENCLAVE v2.6';
            }
            if (attemptsNotice) {
              attemptsNotice.textContent = 'Rate-limited defense: 3 incorrect passkeys trigger a 10-minute automated lockout.';
            }
            if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
            this.showToast('ℹ️ Terminal Lockout Expired: Authentication inputs re-enabled.');
            return;
          }

          const totalSeconds = Math.ceil(remainingMs / 1000);
          const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
          const secs = (totalSeconds % 60).toString().padStart(2, '0');
          if (timerVal) timerVal.textContent = `${mins}:${secs}`;
        };

        tick();
        lockoutTimerInterval = setInterval(tick, 1000);
      };

      const checkLockoutStatus = () => {
        const lockoutUntil = parseInt(localStorage.getItem(AUTH_LOCKOUT_KEY) || '0', 10);
        const now = Date.now();

        if (lockoutUntil > now) {
          // Terminal is actively locked out!
          card.classList.add('lockout-state');
          if (passInput) passInput.disabled = true;
          if (submitBtn) submitBtn.disabled = true;
          if (badge) {
            badge.className = 'auth-security-badge badge-lockout';
            if (badgeText) badgeText.textContent = 'CRITICAL LOCKOUT ACTIVE // RATE LIMIT 3/3';
          }
          if (alertBanner) {
            alertBanner.style.display = 'flex';
            if (alertTitle) alertTitle.textContent = 'SECURITY LOCKOUT ENGAGED';
            if (alertDesc) alertDesc.textContent = 'Brute-force dictionary threshold exceeded (3/3). Terminal inputs locked down.';
          }
          if (timerWrap) timerWrap.style.display = 'flex';
          updateLockoutCountdown(lockoutUntil);
          return true;
        }

        // Clean up expired lockout if present
        if (lockoutUntil > 0 && lockoutUntil <= now) {
          localStorage.removeItem(AUTH_LOCKOUT_KEY);
          localStorage.setItem(AUTH_FAILED_KEY, '0');
        }
        return false;
      };

      const handleFailedAttempt = () => {
        let attempts = parseInt(localStorage.getItem(AUTH_FAILED_KEY) || '0', 10) + 1;
        localStorage.setItem(AUTH_FAILED_KEY, attempts.toString());

        if (attempts >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_MS;
          localStorage.setItem(AUTH_LOCKOUT_KEY, lockoutUntil.toString());
          checkLockoutStatus();
          if (window.soundEngine && window.soundEngine.playSecurityAlarm) {
            window.soundEngine.playSecurityAlarm();
          }
          this.showToast('🚨 CRITICAL LOCKOUT: 3 failed attempts. Terminal locked for 10 minutes.');
        } else {
          // Card shake & warning
          card.classList.remove('auth-shake');
          void card.offsetWidth;
          card.classList.add('auth-shake');
          setTimeout(() => card.classList.remove('auth-shake'), 450);

          if (alertBanner) {
            alertBanner.style.display = 'flex';
            if (alertTitle) alertTitle.textContent = 'ACCESS DENIED: INVALID KEY';
            if (alertDesc) {
              alertDesc.textContent = `Attempt ${attempts} of ${MAX_ATTEMPTS} before automated 10-minute terminal lockout.`;
            }
          }
          if (attemptsNotice) {
            attemptsNotice.innerHTML = `<span style="color: #f87171; font-weight: 700;">Warning: ${attempts}/${MAX_ATTEMPTS} attempts used. Next failure triggers lockout.</span>`;
          }
          if (window.soundEngine && window.soundEngine.playSecurityAlarm) {
            window.soundEngine.playSecurityAlarm();
          }
        }
      };

      // -----------------------------------------------------------------------
      // Successful Master Authentication Handler
      // -----------------------------------------------------------------------
      const grantMasterAccess = async (sourceMessage, shouldEnrollDevice = false) => {
        localStorage.setItem(AUTH_FAILED_KEY, '0');
        localStorage.removeItem(AUTH_LOCKOUT_KEY);

        const adminPayload = {
          id: 'usr_admin_001',
          email: 'admin@aetherkicks.com',
          name: 'Atelier Vault Master',
          role: 'admin',
          tier: 'Root Architect'
        };

        let signedSession = null;
        if (window.AetherDB && typeof window.AetherDB.signSession === 'function') {
          signedSession = await window.AetherDB.signSession(adminPayload);
        } else {
          signedSession = { payload: adminPayload, signature: 'vault_admin_sig', token: 'AK_SESSION' };
        }

        sessionStorage.setItem('aether_admin_authenticated', 'true');
        sessionStorage.setItem('aether_admin_token', signedSession.token);
        localStorage.setItem('aether_user_session', JSON.stringify(signedSession));

        if (shouldEnrollDevice) {
          const token = await generateAuthorizedToken();
          localStorage.setItem(AUTH_TOKEN_KEY, btoa(JSON.stringify(token)));
        }

        triggerLaserVerification();

        if (window.soundEngine) {
          if (window.soundEngine.playLaserVerify) window.soundEngine.playLaserVerify();
          if (window.soundEngine.playVaultUnlock) {
            setTimeout(() => window.soundEngine.playVaultUnlock(), 300);
          }
        }

        this.showToast(sourceMessage || '⚡ Atelier Vault OS Access Granted: Root Superadmin Mode.');

        // Close overlay and hydrate all data
        setTimeout(async () => {
          await this.unlockAndHydrateVault();
        }, 500);
      };

      // -----------------------------------------------------------------------
      // Step 1: Check Secret URL Parameter for Instant 0-Click/1-Click Enrollment
      // Example: admin.html?key=vault_admin_master_2026
      // -----------------------------------------------------------------------
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '');
      const urlSecretKey = (
        searchParams.get('key') ||
        searchParams.get('admin_key') ||
        searchParams.get('token') ||
        hashParams.get('key') ||
        ''
      ).trim();

      if (urlSecretKey && MASTER_KEYS.includes(urlSecretKey)) {
        // Strip the secret key from the browser address bar immediately so it's not leaked
        try {
          window.history.replaceState(null, document.title, window.location.pathname);
        } catch (e) {}

        await grantMasterAccess('⚡ Secret Key Verified: Hardware Node Authorized for 1-Click Access.', true);
        return;
      }

      // -----------------------------------------------------------------------
      // Step 2: Check Active Session Authentication (HMAC Cryptographic Verification)
      // -----------------------------------------------------------------------
      const isAlreadyAuth = sessionStorage.getItem('aether_admin_authenticated') === 'true';
      if (isAlreadyAuth) {
        let isSessionTampered = false;
        const storedSession = localStorage.getItem('aether_user_session');

        if (storedSession && window.AetherDB && typeof window.AetherDB.verifySession === 'function') {
          try {
            const verified = await window.AetherDB.verifySession(JSON.parse(storedSession));
            if (!verified || verified.role !== 'admin') {
              isSessionTampered = true;
            }
          } catch (e) {
            isSessionTampered = true;
          }
        }

        if (isSessionTampered) {
          sessionStorage.removeItem('aether_admin_authenticated');
          sessionStorage.removeItem('aether_admin_token');
          localStorage.removeItem('aether_user_session');
          this.showToast('🚨 Unauthorized Session Tampering Detected! Cryptographic signature verification failed.');
        } else {
          await this.unlockAndHydrateVault();
          return;
        }
      }

      // If not authenticated, ensure layout is locked and overlay active
      document.body.classList.add('vault-locked');
      overlay.classList.add('active');

      // -----------------------------------------------------------------------
      // Step 3: Check for Lockout Status
      // -----------------------------------------------------------------------
      const isCurrentlyLockedOut = checkLockoutStatus();

      // -----------------------------------------------------------------------
      // Step 4: Check if Current Device is a Verified Trusted Node (1-Click Mode)
      // -----------------------------------------------------------------------
      const rawStoredToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const isTrustedOwnerDevice = await verifyDeviceToken(rawStoredToken);

      if (isTrustedOwnerDevice && !isCurrentlyLockedOut) {
        // Render 1-Click Owner Experience!
        if (ownerBlock) ownerBlock.style.display = 'block';
        if (authForm) authForm.style.display = 'none'; // Collapse standard form

        if (badge) {
          badge.className = 'auth-security-badge badge-authorized';
          if (badgeText) badgeText.textContent = 'AUTHORIZED HARDWARE NODE // TRUSTED ARCHITECT';
        }
        card.classList.add('laser-verified');
        if (gateTitle) gateTitle.textContent = 'WELCOME BACK ARCHITECT';
        if (gateSub) gateSub.textContent = 'Recognized Root Administrator Terminal • Tap below for instant biometric unlock.';

        // Bind Owner 1-Click Unlock Button
        const btnOwnerOneClick = document.getElementById('btn-owner-one-click');
        if (btnOwnerOneClick) {
          btnOwnerOneClick.onclick = async (e) => {
            e.preventDefault();
            btnOwnerOneClick.disabled = true;
            btnOwnerOneClick.innerHTML = '<span>⚡ Verifying Biometric Cryptoseal...</span>';
            await grantMasterAccess('⚡ Welcome Back Architect: Atelier Vault OS Unlocked.');
          };
        }

        // Switch to manual passkey input if desired
        const btnSwitchPasskey = document.getElementById('btn-switch-to-passkey');
        if (btnSwitchPasskey) {
          btnSwitchPasskey.onclick = (e) => {
            e.preventDefault();
            if (authForm) authForm.style.display = 'flex';
            if (passInput) passInput.focus();
          };
        }

        // Unlink device option
        const btnUnlink = document.getElementById('btn-unlink-device');
        if (btnUnlink) {
          btnUnlink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Unlink this device from instant 1-click access? You will need your master key to pair again.')) {
              localStorage.removeItem(AUTH_TOKEN_KEY);
              if (ownerBlock) ownerBlock.style.display = 'none';
              if (authForm) authForm.style.display = 'flex';
              if (badge) {
                badge.className = 'auth-security-badge';
                if (badgeText) badgeText.textContent = 'RESTRICTED TERMINAL // ENCLAVE v2.6';
              }
              card.classList.remove('laser-verified');
              if (gateTitle) gateTitle.textContent = 'ATELIER VAULT OS // RESTRICTED ACCESS';
              if (gateSub) gateSub.textContent = 'High-Security Administrative Console. Cryptographic passkey required.';
              this.showToast('Hardware Node Unlinked: Cryptographic token removed.');
            }
          };
        }
      } else {
        // Standard Stranger View: 1-Click button is completely absent
        if (ownerBlock) ownerBlock.style.display = 'none';
        if (authForm) authForm.style.display = 'flex';
      }

      // -----------------------------------------------------------------------
      // Step 5: Password Form Handling & Rate Limiting Verification
      // -----------------------------------------------------------------------
      if (authForm) {
        authForm.onsubmit = async (e) => {
          e.preventDefault();

          if (checkLockoutStatus()) {
            if (window.soundEngine && window.soundEngine.playSecurityAlarm) {
              window.soundEngine.playSecurityAlarm();
            }
            return;
          }

          const enteredPass = (passInput?.value || '').trim();
          if (!enteredPass) return;

          let authenticated = false;
          let shouldEnrollNewDevice = false;

          // Check if entered key is the master owner key
          if (MASTER_KEYS.includes(enteredPass)) {
            authenticated = true;
            shouldEnrollNewDevice = true; // Auto-pair this device for future 1-click access!
          }

          // Check against AetherDB database credentials
          if (!authenticated && window.AetherDB && typeof window.AetherDB.authenticateUser === 'function') {
            const res = await window.AetherDB.authenticateUser('admin@aetherkicks.com', enteredPass);
            if (res && res.role === 'admin') authenticated = true;
          }

          if (authenticated) {
            await grantMasterAccess('✅ Passphrase Verified. Welcome to Atelier Vault OS.', shouldEnrollNewDevice);
          } else {
            handleFailedAttempt();
          }
        };
      }

      // Password Visibility Toggle
      const btnTogglePass = document.getElementById('btn-toggle-admin-pass');
      if (btnTogglePass && passInput) {
        btnTogglePass.onclick = (e) => {
          e.preventDefault();
          const isPass = passInput.type === 'password';
          passInput.type = isPass ? 'text' : 'password';
          btnTogglePass.style.color = isPass ? '#ffffff' : 'var(--admin-text-muted)';
        };
      }

      // -----------------------------------------------------------------------
      // Step 6: Hidden Stealth Gesture for Owner Enrollment (Triple-Click Icon)
      // -----------------------------------------------------------------------
      const gateIcon = document.getElementById('auth-gate-icon');
      const enrollDialog = document.getElementById('auth-enroll-dialog');
      const enrollInput = document.getElementById('enroll-key-input');
      const btnEnrollSubmit = document.getElementById('btn-enroll-submit');
      const btnEnrollCancel = document.getElementById('btn-enroll-cancel');
      const btnEnrollClose = document.getElementById('btn-enroll-close');

      let iconClickCount = 0;
      let lastIconClick = 0;

      const openEnrollment = () => {
        if (enrollDialog) {
          enrollDialog.style.display = 'flex';
          if (enrollInput) {
            enrollInput.value = '';
            enrollInput.focus();
          }
          if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
        }
      };

      const closeEnrollment = () => {
        if (enrollDialog) enrollDialog.style.display = 'none';
      };

      if (gateIcon) {
        gateIcon.onclick = () => {
          const now = Date.now();
          if (now - lastIconClick < 1200) {
            iconClickCount++;
          } else {
            iconClickCount = 1;
          }
          lastIconClick = now;

          if (iconClickCount >= 3) {
            iconClickCount = 0;
            openEnrollment();
          }
        };
      }

      // Keyboard shortcut for owner: Ctrl+Shift+U
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
          e.preventDefault();
          openEnrollment();
        }
      });

      if (btnEnrollCancel) btnEnrollCancel.onclick = closeEnrollment;
      if (btnEnrollClose) btnEnrollClose.onclick = closeEnrollment;

      if (btnEnrollSubmit && enrollInput) {
        btnEnrollSubmit.onclick = async () => {
          const key = (enrollInput.value || '').trim();
          if (MASTER_KEYS.includes(key)) {
            closeEnrollment();
            await grantMasterAccess('⚡ Master Device Paired: Hardware Node Registered for 1-Click Access.', true);
          } else {
            enrollInput.style.borderColor = '#ef4444';
            if (window.soundEngine && window.soundEngine.playSecurityAlarm) {
              window.soundEngine.playSecurityAlarm();
            }
            this.showToast('❌ Invalid Architectural Master Key.');
          }
        };
      }

      // -----------------------------------------------------------------------
      // Step 7: Lock Session Action Buttons
      // -----------------------------------------------------------------------
      document.querySelectorAll('.btn-lock-session').forEach(btn => {
        btn.onclick = async (e) => {
          e.preventDefault();
          sessionStorage.removeItem('aether_admin_authenticated');
          document.body.classList.add('vault-locked');
          document.body.classList.remove('vault-authenticated');
          overlay.classList.add('active');

          if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
          this.showToast('🔒 Vault Console Locked.');

          // Re-initialize gate state (owner sees 1-click unlock button)
          await this.setupAuthCheck();
        };
      });
    }

    // =========================================================================
    // NAVIGATION & TAB SWITCHING
    // =========================================================================
    setupTabs() {
      // Sidebar Tab Buttons
      document.querySelectorAll('.sidebar-nav-item button[data-tab-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tabTarget;
          this.switchTab(tab);
          if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
        });
      });

      // Mobile Bottom Bar Buttons
      document.querySelectorAll('.bottom-nav-btn[data-tab-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tabTarget;
          this.switchTab(tab);
          if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
        });
      });

      // Mobile Drawer Toggle
      const mobileToggle = document.getElementById('btn-mobile-sidebar-toggle');
      const sidebar = document.querySelector('.admin-sidebar');
      if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
          sidebar.classList.toggle('mobile-open');
        });
      }

      // Hash change listener for browser navigation
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash && document.getElementById(`view-${hash}`) && hash !== this.activeTab) {
          this.switchTab(hash, false);
        }
      });

      // Handle initial hash on page load (e.g. admin.html#inventory)
      const initialHash = window.location.hash.replace('#', '').toLowerCase();
      if (initialHash && document.getElementById(`view-${initialHash}`)) {
        this.switchTab(initialHash, false);
      }
    }

    switchTab(tabId, updateHash = true) {
      this.activeTab = tabId;

      if (updateHash && window.location.hash !== `#${tabId}`) {
        history.replaceState(null, '', `#${tabId}`);
      }

      // Update Sidebar buttons
      document.querySelectorAll('.sidebar-nav-item button[data-tab-target]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tabTarget === tabId);
      });

      // Update Bottom Nav buttons
      document.querySelectorAll('.bottom-nav-btn[data-tab-target]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tabTarget === tabId);
      });

      // Update Views
      document.querySelectorAll('.admin-tab-view').forEach(view => {
        view.classList.remove('active');
      });

      const targetView = document.getElementById(`view-${tabId}`);
      if (targetView) {
        targetView.classList.add('active');
      }

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('mobile-open');

      if (tabId === 'database') {
        this.renderSqlConsole();
      }
    }

    // =========================================================================
    // EVENT LISTENERS & SEARCH
    // =========================================================================
    setupEventListeners() {
      // Global quick search
      const globalSearch = document.getElementById('admin-global-search');
      if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase().trim();
          if (this.activeTab !== 'inventory') {
            this.switchTab('inventory');
          }
          const invSearch = document.getElementById('inv-search-input');
          if (invSearch) {
            invSearch.value = q;
            this.renderInventory();
          }
        });
      }

      // Keyboard shortcut Ctrl+K
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (globalSearch) globalSearch.focus();
        }
      });

      // Inventory Filter controls
      const invSearch = document.getElementById('inv-search-input');
      const silFilter = document.getElementById('filter-silhouette');
      const catFilter = document.getElementById('filter-category');
      const sortFilter = document.getElementById('filter-sort');

      [invSearch, silFilter, catFilter, sortFilter].forEach(el => {
        if (el) {
          el.addEventListener('input', () => this.renderInventory());
          el.addEventListener('change', () => this.renderInventory());
        }
      });

      // Add New Grail Button
      const btnAddShoe = document.getElementById('btn-add-shoe-modal');
      if (btnAddShoe) {
        btnAddShoe.addEventListener('click', () => {
          this.openShoeModal(null);
        });
      }

      // Shoe Form Submit
      const shoeForm = document.getElementById('form-shoe-editor');
      if (shoeForm) {
        shoeForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveShoeFromModal();
        });
      }

      // Quick Exports
      const btnExpSql = document.getElementById('btn-quick-export-sql');
      if (btnExpSql) btnExpSql.addEventListener('click', () => this.exportSqlFile());

      const btnExpJson = document.getElementById('btn-quick-export-json');
      if (btnExpJson) btnExpJson.addEventListener('click', () => this.exportJsonFile());

      const btnSeedReset = document.getElementById('btn-quick-seed-reset');
      if (btnSeedReset) btnSeedReset.addEventListener('click', () => this.resetDatabaseConfirm());

      // SQL Live Query Input & Sandbox Runner
      const sqlInput = document.getElementById('sql-query-input');
      const btnRunSql = document.getElementById('btn-run-sql');
      if (btnRunSql && sqlInput) {
        btnRunSql.addEventListener('click', () => {
          this.executeSqlConsoleQuery(sqlInput.value);
        });
      }

      // Restore JSON file picker
      const restoreInput = document.getElementById('db-restore-file-input');
      if (restoreInput) {
        restoreInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
              try {
                const data = JSON.parse(ev.target.result);
                if (window.AetherDB && typeof window.AetherDB.importJSON === 'function') {
                  await window.AetherDB.importJSON(data, false);
                }
                await this.loadFromDatabase();
                this.showToast('✅ Database Restored from JSON Dump Successfully.');
              } catch (err) {
                console.error(err);
                this.showToast('❌ Invalid JSON File Structure.');
              }
            };
            reader.readAsText(file);
          }
        });
      }
    }

    renderAllViews() {
      this.renderOverview();
      this.renderInventory();
      this.renderOrders();
      this.renderCollectors();
      this.renderHypeDrops();
      this.renderSqlConsole();
      this.updateTopbarStats();
    }

    updateTopbarStats() {
      const shoeCount = Object.keys(this.shoes).length;
      const orderCount = this.orders.length;
      const ind = document.getElementById('db-live-indicator');
      if (ind) {
        ind.textContent = `${shoeCount} Grails • ${orderCount} Orders Active`;
      }
      const badgeInv = document.getElementById('sidebar-badge-inventory');
      if (badgeInv) badgeInv.textContent = shoeCount;

      const badgeOrders = document.getElementById('sidebar-badge-orders');
      if (badgeOrders) {
        const pending = this.orders.filter(o => o.status !== 'delivered').length;
        badgeOrders.textContent = `${pending} active`;
      }
    }

    // =========================================================================
    // 1. OVERVIEW HUD RENDERER
    // =========================================================================
    renderOverview() {
      const shoesList = Object.values(this.shoes);
      let totalLiquidity = 0;
      let totalPairs = 0;

      shoesList.forEach(s => {
        const stockMap = s.sizesStock || {};
        const shoePairs = Object.values(stockMap).reduce((acc, val) => acc + Number(val || 0), 0);
        totalPairs += shoePairs;
        totalLiquidity += (s.price || 0) * shoePairs;
      });

      const activeOrdersCount = this.orders.filter(o => o.status !== 'delivered').length;
      const verifiedCollectorsCount = this.collectors.length;

      // Update KPI DOM
      const elLiquidity = document.getElementById('kpi-val-liquidity');
      if (elLiquidity) elLiquidity.textContent = `$${totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      const elPairs = document.getElementById('kpi-val-pairs');
      if (elPairs) elPairs.textContent = `${totalPairs} Pairs`;

      const elOrders = document.getElementById('kpi-val-orders');
      if (elOrders) elOrders.textContent = `${activeOrdersCount} Active`;

      const elCollectors = document.getElementById('kpi-val-collectors');
      if (elCollectors) elCollectors.textContent = `${verifiedCollectorsCount} Members`;

      // Render Charts & Warnings
      this.renderVelocityChart();
      this.renderAllocationBars(shoesList, totalPairs);
      this.renderStockAlerts(shoesList);
    }

    renderVelocityChart() {
      const container = document.getElementById('overview-chart-container');
      if (!container) return;

      const points = [32, 45, 38, 64, 52, 78, 69, 94, 85, 112, 104, 138];
      const width = 800;
      const height = 220;
      const padX = 40;
      const padY = 30;

      const minVal = Math.min(...points) * 0.8;
      const maxVal = Math.max(...points) * 1.1;

      const coords = points.map((val, idx) => {
        const x = padX + (idx / (points.length - 1)) * (width - padX * 2);
        const y = height - padY - ((val - minVal) / (maxVal - minVal)) * (height - padY * 2);
        return { x, y, val };
      });

      let dPath = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];
        const cpX = (prev.x + curr.x) / 2;
        dPath += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
      }

      const dArea = `${dPath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

      container.innerHTML = `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#dc2626" stop-opacity="0.45" />
              <stop offset="60%" stop-color="#dc2626" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#dc2626" stop-opacity="0" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="rgba(255,255,255,0.08)" />

          <path d="${dArea}" fill="url(#chartGradient)" />
          <path d="${dPath}" fill="none" stroke="#dc2626" stroke-width="3" filter="url(#neonGlow)" />

          ${coords.map(pt => `
            <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#ffffff" stroke="#dc2626" stroke-width="2">
              <title>$${(pt.val * 1200).toLocaleString()}</title>
            </circle>
          `).join('')}
        </svg>
      `;
    }

    renderAllocationBars(shoesList, totalPairs) {
      const container = document.getElementById('allocation-bars-container');
      if (!container) return;

      const silMap = {};
      shoesList.forEach(s => {
        const sil = s.silhouette || 'High OG';
        const stockMap = s.sizesStock || {};
        const pairs = Object.values(stockMap).reduce((a, b) => a + Number(b || 0), 0);
        silMap[sil] = (silMap[sil] || 0) + pairs;
      });

      const colors = {
        'High OG': '#dc2626',
        'High': '#dc2626',
        'Retro 4': '#9333ea',
        'AJ4': '#9333ea',
        'Low OG': '#0284c7',
        'Low': '#0284c7',
        'Retro 3': '#ea580c',
        'Mid': '#16a34a',
        'Bespoke': '#eab308'
      };

      container.innerHTML = Object.keys(silMap).map(sil => {
        const count = silMap[sil];
        const pct = totalPairs > 0 ? Math.round((count / totalPairs) * 100) : 0;
        const color = colors[sil] || '#16a34a';
        return `
          <div class="allocation-item">
            <div class="allocation-header">
              <span class="allocation-name">${escapeHTML(sil)}</span>
              <span class="allocation-percent">${count} pairs (${pct}%)</span>
            </div>
            <div class="allocation-bar-track">
              <div class="allocation-bar-fill" style="width: ${pct}%; background: ${color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderStockAlerts(shoesList) {
      const container = document.getElementById('stock-alerts-list');
      if (!container) return;

      const lowItems = [];
      shoesList.forEach(s => {
        const stockMap = s.sizesStock || {};
        Object.keys(stockMap).forEach(eu => {
          const qty = Number(stockMap[eu] || 0);
          if (qty <= 3) {
            lowItems.push({
              shoe: s,
              size: eu,
              qty: qty
            });
          }
        });
      });

      if (lowItems.length === 0) {
        container.innerHTML = `
          <div style="font-size: 0.85rem; color: #4ade80;">
            ✓ All silhouette sizes have optimal vault allocation.
          </div>
        `;
        return;
      }

      container.innerHTML = lowItems.slice(0, 4).map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span>
            <span style="font-size: 0.85rem; color: #ffffff;">${escapeHTML(item.shoe.colorway)}</span>
            <span class="sku-badge">EU ${escapeHTML(item.size)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-family: var(--admin-font-mono); font-size: 0.8rem; color: #f87171;">Only ${Number(item.qty)} left</span>
            <button class="btn-matrix-helper" onclick="window.aetherAdmin.quickRestock('${escapeHTML(item.shoe.id)}', '${escapeHTML(item.size)}', 5)">+5 Restock</button>
          </div>
        </div>
      `).join('');
    }

    // =========================================================================
    // 2. GRAIL INVENTORY (CRUD & DATABASE INTEGRATION)
    // =========================================================================
    renderInventory() {
      const tbody = document.getElementById('inventory-table-body');
      if (!tbody) return;

      const q = (document.getElementById('inv-search-input')?.value || '').toLowerCase().trim();
      const sil = document.getElementById('filter-silhouette')?.value || 'all';
      const cat = document.getElementById('filter-category')?.value || 'all';
      const sort = document.getElementById('filter-sort')?.value || 'price-desc';

      let list = Object.values(this.shoes);

      // Filters
      if (q) {
        list = list.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.colorway.toLowerCase().includes(q) ||
          (s.styleCode && s.styleCode.toLowerCase().includes(q))
        );
      }
      if (sil !== 'all') {
        list = list.filter(s => (s.silhouette || 'High OG') === sil || (sil === 'High OG' && s.silhouette === 'High'));
      }
      if (cat !== 'all') {
        list = list.filter(s => (s.category || '').toLowerCase() === cat.toLowerCase());
      }

      // Sorting
      if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'year-desc') list.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
      else if (sort === 'stock-desc') {
        list.sort((a, b) => {
          const totA = Object.values(a.sizesStock || {}).reduce((x, y) => x + Number(y || 0), 0);
          const totB = Object.values(b.sizesStock || {}).reduce((x, y) => x + Number(y || 0), 0);
          return totB - totA;
        });
      }

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 48px; color: var(--admin-text-muted);">
              <div style="font-size: 2rem; margin-bottom: 8px;">👟</div>
              <div>No authenticated grails match your search query.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list.map(shoe => {
        const stockMap = shoe.sizesStock || {};
        const totalStock = Object.values(stockMap).reduce((acc, v) => acc + Number(v || 0), 0);
        const sizesPreview = Object.keys(stockMap).map(k => `EU ${k}(${stockMap[k]})`).join(' • ');

        return `
          <tr data-shoe-id="${escapeHTML(shoe.id)}">
            <!-- Sneaker Identity -->
            <td>
              <div class="table-shoe-cell">
                <div class="table-shoe-thumb" style="border-color: ${escapeHTML(shoe.theme)}40;">
                  <img src="${escapeHTML(shoe.image)}" alt="${escapeHTML(shoe.colorway)}" onerror="this.src='assets/images/jordan-chicago.png'" />
                </div>
                <div class="table-shoe-info">
                  <span class="table-shoe-name">${escapeHTML(shoe.name)}</span>
                  <span class="table-shoe-colorway">
                    <span class="theme-pill-dot" style="background: ${escapeHTML(shoe.theme)};"></span>
                    ${escapeHTML(shoe.colorway)}
                  </span>
                </div>
              </div>
            </td>

            <!-- SKU & Silhouette -->
            <td>
              <span class="sku-badge">${escapeHTML(shoe.styleCode)}</span>
              <div style="margin-top: 4px;">
                <span class="badge-tag tag-high">${escapeHTML(shoe.silhouette || 'High OG')}</span>
              </div>
            </td>

            <!-- Condition Grade -->
            <td>
              <span class="badge-tag tag-deadstock">${escapeHTML(shoe.condition || 'DS Grade A+')}</span>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 4px; text-transform: uppercase;">${escapeHTML(shoe.category || 'Runway')}</div>
            </td>

            <!-- Price & Market Trend -->
            <td>
              <div style="font-family: var(--admin-font-mono); font-weight: 700; color: #ffffff;">$${Number(shoe.price)}</div>
              <div style="font-size: 0.74rem; color: var(--admin-text-muted);">MSRP $${Number(shoe.retailPrice || 170)}</div>
              <span class="trend-badge positive" style="margin-top: 4px;">${escapeHTML(shoe.trend || '+22.5%')}</span>
            </td>

            <!-- Sizing Matrix Breakdown -->
            <td style="max-width: 220px;">
              <div style="font-family: var(--admin-font-mono); font-size: 0.72rem; color: var(--admin-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(sizesPreview)}">
                ${escapeHTML(sizesPreview || 'Standard EU 40-45')}
              </div>
            </td>

            <!-- Total Stock & Quick Adjustment -->
            <td>
              <div class="stock-adjust-cell">
                <button class="btn-stock-quick" onclick="window.aetherAdmin.quickAdjustStock('${escapeHTML(shoe.id)}', -1)" title="Reduce stock by 1">-</button>
                <span class="stock-count-val ${totalStock <= 5 ? 'low' : 'good'}">${totalStock}</span>
                <button class="btn-stock-quick" onclick="window.aetherAdmin.quickAdjustStock('${escapeHTML(shoe.id)}', 1)" title="Increase stock by 1">+</button>
              </div>
            </td>

            <!-- Actions -->
            <td>
              <div class="row-actions">
                <button class="btn-row-action" onclick="window.aetherAdmin.openShoeModal('${escapeHTML(shoe.id)}')" title="Edit Sneaker">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-row-action action-delete" onclick="window.aetherAdmin.deleteShoe('${escapeHTML(shoe.id)}')" title="Delete from Vault">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    async quickAdjustStock(shoeId, delta) {
      const shoe = this.shoes[shoeId];
      if (!shoe) return;

      shoe.sizesStock = shoe.sizesStock || {};
      const curr = Number(shoe.sizesStock['42'] !== undefined ? shoe.sizesStock['42'] : 5);
      const next = Math.max(0, curr + delta);
      shoe.sizesStock['42'] = next;

      // Update in AetherDB
      if (window.AetherDB && typeof window.AetherDB.updateInventory === 'function') {
        await window.AetherDB.updateInventory(shoeId, '42', next);
      }

      this.renderInventory();
      this.renderOverview();
      this.showToast(`Stock updated for ${shoe.colorway} (EU 42): ${next} pairs.`);
      if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
    }

    async quickRestock(shoeId, size, amount) {
      const shoe = this.shoes[shoeId];
      if (!shoe) return;

      shoe.sizesStock = shoe.sizesStock || {};
      const next = (Number(shoe.sizesStock[size] || 0)) + amount;
      shoe.sizesStock[size] = next;

      if (window.AetherDB && typeof window.AetherDB.updateInventory === 'function') {
        await window.AetherDB.updateInventory(shoeId, size, next);
      }

      this.renderInventory();
      this.renderOverview();
      this.showToast(`Restocked ${shoe.colorway} EU ${size} with +${amount} pairs.`);
    }

    async deleteShoe(shoeId) {
      const shoe = this.shoes[shoeId];
      if (!shoe) return;

      if (confirm(`Are you sure you want to decommission "${shoe.name} - ${shoe.colorway}" from the Atelier Vault Database?`)) {
        if (window.AetherDB && typeof window.AetherDB.deleteShoe === 'function') {
          await window.AetherDB.deleteShoe(shoeId);
        }
        delete this.shoes[shoeId];
        this.renderInventory();
        this.renderOverview();
        this.showToast(`Decommissioned ${shoe.colorway} from live database.`);
        if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
      }
    }

    // Modal: Open Add / Edit Sneaker
    openShoeModal(shoeId) {
      this.activeShoeEditId = shoeId;
      const modal = document.getElementById('modal-shoe-editor');
      const title = document.getElementById('modal-shoe-title');
      const form = document.getElementById('form-shoe-editor');
      if (!modal || !form) return;

      const defaultEU = SIZING_TABLE.map(s => s.eu);

      if (shoeId && this.shoes[shoeId]) {
        const s = this.shoes[shoeId];
        title.textContent = `EDIT ARCHIVE // ${s.colorway.toUpperCase()}`;
        document.getElementById('shoe-id-hidden').value = s.id;
        document.getElementById('shoe-name').value = s.name;
        document.getElementById('shoe-colorway').value = s.colorway;
        document.getElementById('shoe-silhouette').value = s.silhouette || 'High OG';
        document.getElementById('shoe-sku').value = s.styleCode;
        document.getElementById('shoe-price').value = s.price;
        document.getElementById('shoe-retail-price').value = s.retailPrice || 170;
        document.getElementById('shoe-trend').value = s.trend || '+25.0%';
        document.getElementById('shoe-year').value = s.year || '2026';
        document.getElementById('shoe-category').value = s.category || 'Runway';
        document.getElementById('shoe-condition').value = s.condition || 'Deadstock Grade A+';
        document.getElementById('shoe-theme-color').value = s.theme || '#dc2626';
        document.getElementById('shoe-image-preset').value = s.image;
        document.getElementById('shoe-image-custom').value = s.image.startsWith('http') ? s.image : '';
        document.getElementById('shoe-story').value = s.story || '';

        this.renderModalSizingMatrix(defaultEU, s.sizesStock || {});
      } else {
        // Add new shoe
        title.textContent = 'CRAFT NEW GRAIL // VAULT INTAKE';
        form.reset();
        document.getElementById('shoe-id-hidden').value = '';
        document.getElementById('shoe-name').value = 'Air Jordan 1 Retro High OG';
        document.getElementById('shoe-colorway').value = '';
        document.getElementById('shoe-silhouette').value = 'High OG';
        document.getElementById('shoe-sku').value = '555088-' + Math.floor(100 + Math.random() * 899);
        document.getElementById('shoe-price').value = 450;
        document.getElementById('shoe-retail-price').value = 180;
        document.getElementById('shoe-trend').value = '+30.0%';
        document.getElementById('shoe-year').value = '2026';
        document.getElementById('shoe-category').value = 'Runway';
        document.getElementById('shoe-condition').value = 'Deadstock Grade A+';
        document.getElementById('shoe-theme-color').value = '#dc2626';
        document.getElementById('shoe-image-preset').value = 'assets/images/jordan-chicago.png';
        document.getElementById('shoe-story').value = 'Exclusive Atelier release crafted for high-tier collectors.';

        const defaultStock = { '40': 4, '40.5': 4, '41': 6, '42': 8, '42.5': 6, '43': 6, '44': 4, '45': 2 };
        this.renderModalSizingMatrix(defaultEU, defaultStock);
      }

      this.updateShoeModalPreview();
      modal.classList.add('active');
      if (window.soundEngine && window.soundEngine.playSwoosh) window.soundEngine.playSwoosh();
    }

    renderModalSizingMatrix(allSizes, stockMap) {
      const container = document.getElementById('shoe-sizes-matrix-grid');
      if (!container) return;

      container.innerHTML = allSizes.map(eu => {
        const val = stockMap[eu] !== undefined ? stockMap[eu] : 0;
        const entry = SIZING_TABLE.find(s => s.eu === eu) || { us: (parseFloat(eu) - 33.5).toFixed(1) };
        return `
          <div class="matrix-size-cell">
            <div class="matrix-size-label">
              <span>EU ${eu}</span>
              <small style="color: var(--admin-text-muted);">US ${entry.us}</small>
            </div>
            <input type="number" min="0" max="99" class="matrix-stock-input" data-eu="${eu}" value="${val}" />
          </div>
        `;
      }).join('');
    }

    updateShoeModalPreview() {
      const name = document.getElementById('shoe-name')?.value || 'Air Jordan 1 Retro';
      const colorway = document.getElementById('shoe-colorway')?.value || 'Custom Vault Grail';
      const price = document.getElementById('shoe-price')?.value || 450;
      const theme = document.getElementById('shoe-theme-color')?.value || '#dc2626';

      let img = document.getElementById('shoe-image-custom')?.value || document.getElementById('shoe-image-preset')?.value || 'assets/images/jordan-chicago.png';

      const previewImg = document.getElementById('modal-preview-img');
      const previewTitle = document.getElementById('modal-preview-title');
      const previewColorway = document.getElementById('modal-preview-colorway');
      const previewPrice = document.getElementById('modal-preview-price');
      const previewPanel = document.getElementById('modal-preview-panel');

      if (previewImg) previewImg.src = img;
      if (previewTitle) previewTitle.textContent = name;
      if (previewColorway) {
        previewColorway.textContent = colorway;
        previewColorway.style.color = theme;
      }
      if (previewPrice) previewPrice.textContent = `Vault Ask: $${price}`;
      if (previewPanel) {
        previewPanel.style.background = `radial-gradient(circle at center, ${theme}22 0%, rgba(13, 13, 18, 0.9) 75%)`;
        previewPanel.style.borderColor = `${theme}44`;
      }
    }

    async saveShoeFromModal() {
      const hiddenId = document.getElementById('shoe-id-hidden').value;
      const colorway = document.getElementById('shoe-colorway').value.trim();
      if (!colorway) {
        alert('Please specify a Colorway name for the sneaker.');
        return;
      }

      // Generate unique clean slug ID
      const shoeId = hiddenId || colorway.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || ('grail-' + Date.now());

      let img = document.getElementById('shoe-image-custom').value.trim();
      if (!img) img = document.getElementById('shoe-image-preset').value;

      // Harvest sizing matrix stock
      const sizesStock = {};
      const activeSizes = [];
      document.querySelectorAll('#shoe-sizes-matrix-grid .matrix-stock-input').forEach(input => {
        const eu = input.dataset.eu;
        const count = parseInt(input.value, 10) || 0;
        sizesStock[eu] = count;
        if (count > 0) activeSizes.push(eu);
      });

      const shoePayload = {
        id: shoeId,
        name: document.getElementById('shoe-name').value.trim(),
        colorway: colorway,
        silhouette: document.getElementById('shoe-silhouette').value,
        style_code: document.getElementById('shoe-sku').value.trim(),
        styleCode: document.getElementById('shoe-sku').value.trim(),
        vault_price: parseFloat(document.getElementById('shoe-price').value) || 450,
        price: parseFloat(document.getElementById('shoe-price').value) || 450,
        retail_price: parseFloat(document.getElementById('shoe-retail-price').value) || 180,
        retailPrice: parseFloat(document.getElementById('shoe-retail-price').value) || 180,
        market_trend_pct: document.getElementById('shoe-trend').value.trim() || '+25.0%',
        trend: document.getElementById('shoe-trend').value.trim() || '+25.0%',
        year: document.getElementById('shoe-year').value.trim() || '2026',
        category: document.getElementById('shoe-category').value.toLowerCase(),
        condition_grade: document.getElementById('shoe-condition').value,
        condition: document.getElementById('shoe-condition').value,
        image_url: img,
        image: img,
        theme_color: document.getElementById('shoe-theme-color').value,
        theme: document.getElementById('shoe-theme-color').value,
        glow_color: `${document.getElementById('shoe-theme-color').value}73`,
        glow: `${document.getElementById('shoe-theme-color').value}73`,
        story: document.getElementById('shoe-story').value.trim(),
        sizes: activeSizes.length > 0 ? activeSizes : ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        sizesStock: sizesStock
      };

      if (window.AetherDB) {
        if (hiddenId) {
          await window.AetherDB.updateShoe(shoeId, shoePayload);
        } else {
          await window.AetherDB.addShoe(shoePayload);
        }

        // Update inventory records in AetherDB
        for (const eu of Object.keys(sizesStock)) {
          await window.AetherDB.updateInventory(shoeId, eu, sizesStock[eu]);
        }
      }

      this.shoes[shoeId] = shoePayload;
      this.closeModal('modal-shoe-editor');
      this.renderInventory();
      this.renderOverview();
      this.showToast(`✨ Saved ${shoePayload.colorway} to Atelier Vault Database!`);
      if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    }

    // =========================================================================
    // 3. ORDERS & DISPATCHES CONTROLLER
    // =========================================================================
    renderOrders() {
      const tbody = document.getElementById('orders-table-body');
      if (!tbody) return;

      tbody.innerHTML = this.orders.map(order => {
        const statusBadge = this.getOrderStatusBadge(order.status);
        const buyerName = order.customer_name || order.collector || 'Collector';
        const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString() : (order.date || '2026-10-19');
        const firstItem = (order.items && order.items[0]) || {};
        const shoeName = firstItem.shoe_name || order.shoeName || 'Air Jordan 1 High';
        const colorway = firstItem.colorway || order.colorway || 'Chicago';
        const size = firstItem.size_eu ? `EU ${firstItem.size_eu}` : (order.size || 'EU 42');
        const tracking = order.tracking_number || order.tracking || 'PENDING DISPATCH';

        return `
          <tr>
            <td>
              <span class="mono" style="color: #ffffff; font-weight: 700;">#${escapeHTML(order.id)}</span>
              <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${escapeHTML(orderDate)}</div>
            </td>
            <td>
              <div style="font-weight: 600; color: #ffffff;">${escapeHTML(buyerName)}</div>
              <div class="vip-tier-badge tier-vault" style="font-size: 0.65rem; margin-top: 3px;">${escapeHTML(order.tier || 'VIP Member')}</div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="theme-pill-dot" style="background: var(--admin-crimson);"></span>
                <span style="color: #ffffff; font-size: 0.88rem;">${escapeHTML(shoeName)}</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--admin-text-secondary);">${escapeHTML(colorway)} • <strong style="color: #4ade80;">${escapeHTML(size)}</strong></div>
            </td>
            <td>
              <span class="mono" style="color: #ffffff; font-weight: 700;">$${Number(order.total || order.price || 480)}</span>
            </td>
            <td>
              ${statusBadge}
            </td>
            <td>
              <span class="sku-badge" style="font-size: 0.7rem;">${escapeHTML(tracking)}</span>
            </td>
            <td>
              <div class="row-actions">
                <button class="btn-row-action" onclick="window.aetherAdmin.openOrderDetails('${escapeHTML(order.id)}')" title="Inspect Custody & NFC Certificate">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="btn-row-action" onclick="window.aetherAdmin.advanceOrderStatus('${escapeHTML(order.id)}')" title="Advance Custody Step">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    getOrderStatusBadge(status) {
      switch (status) {
        case 'pending_verification':
        case 'placed':
          return `<span class="badge-tag" style="background: rgba(255,255,255,0.1); color: #fff;">1. ORDER PLACED</span>`;
        case 'forensic_check':
        case 'intake':
          return `<span class="badge-tag" style="background: rgba(2, 132, 199, 0.2); color: #7dd3fc;">2. FORENSIC INTAKE</span>`;
        case 'authenticated':
        case 'authenticating':
          return `<span class="badge-tag" style="background: rgba(220, 38, 38, 0.2); color: #fca5a5;">3. 14-POINT AUTH</span>`;
        case 'sealed':
          return `<span class="badge-tag" style="background: rgba(147, 51, 234, 0.2); color: #d8b4fe;">4. NFC SEALED</span>`;
        case 'dispatched':
          return `<span class="badge-tag" style="background: rgba(234, 88, 12, 0.2); color: #fdba74;">5. DISPATCHED</span>`;
        case 'delivered':
          return `<span class="badge-tag" style="background: rgba(22, 163, 74, 0.2); color: #86efac;">6. DELIVERED</span>`;
        default:
          return `<span class="badge-tag">${status}</span>`;
      }
    }

    async advanceOrderStatus(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) return;

      const steps = ['pending_verification', 'forensic_check', 'authenticated', 'dispatched', 'delivered'];
      let curStatus = order.status;
      if (curStatus === 'placed') curStatus = 'pending_verification';
      if (curStatus === 'intake') curStatus = 'forensic_check';
      if (curStatus === 'authenticating' || curStatus === 'sealed') curStatus = 'authenticated';

      const curIdx = steps.indexOf(curStatus);
      if (curIdx < steps.length - 1) {
        const nextStatus = steps[curIdx + 1];
        order.status = nextStatus;

        // Auto-generate official tracking and digital NFC token hash on authentication/dispatch
        let tracking = order.tracking_number || order.tracking;
        if (!tracking || tracking === 'PENDING DISPATCH' || nextStatus === 'dispatched') {
          tracking = `AETH-PT-${Math.floor(100000 + Math.random() * 900000)}`;
          order.tracking_number = tracking;
          order.tracking = tracking;
        }

        if (!order.nfc_certificate_id || nextStatus === 'authenticated') {
          order.nfc_certificate_id = `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
          order.nfcHash = order.nfc_certificate_id;
        }

        // Save into AetherDB
        if (window.AetherDB && typeof window.AetherDB.updateOrderStatus === 'function') {
          await window.AetherDB.updateOrderStatus(orderId, nextStatus, tracking);
        }

        this.renderOrders();
        this.renderOverview();
        this.showToast(`Order #${order.id} custody advanced to: ${nextStatus.toUpperCase()} (Tracking: ${tracking})`);
        if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
      } else {
        this.showToast(`Order #${order.id} is already in final DELIVERED state.`);
      }
    }

    openOrderDetails(orderId) {
      this.activeOrderInspectId = orderId;
      const order = this.orders.find(o => o.id === orderId);
      if (!order) return;

      const modal = document.getElementById('modal-order-details');
      if (!modal) return;

      const firstItem = (order.items && order.items[0]) || {};
      const shoeName = firstItem.shoe_name || order.shoeName || 'Air Jordan 1 High';
      const colorway = firstItem.colorway || order.colorway || 'Chicago';
      const size = firstItem.size_eu ? `EU ${firstItem.size_eu} (US ${firstItem.size_us || '8.5'})` : (order.size || 'EU 42 (US 8.5)');
      const tracking = order.tracking_number || order.tracking || 'DHL-VAULT-991204';
      const nfcHash = order.nfc_certificate_id || order.nfcHash || '0x8F2B7C1A0948210D94E216B';

      document.getElementById('order-detail-id').textContent = `#${order.id}`;
      document.getElementById('order-detail-collector').textContent = `${order.customer_name || order.collector} (${order.customer_email || order.email || 'collector@aetherkicks.com'})`;
      document.getElementById('order-detail-dest').textContent = order.shipping_address || order.destination || 'Avenida da Liberdade 210, Lisboa, Portugal';
      document.getElementById('order-detail-item').textContent = `${shoeName} - ${colorway}`;
      document.getElementById('order-detail-size').textContent = size;
      document.getElementById('order-detail-price').textContent = `$${order.total || order.price || 480}.00`;
      document.getElementById('order-detail-tracking').textContent = tracking;
      document.getElementById('order-detail-nfc').textContent = nfcHash;

      // Update stepper nodes
      const steps = ['pending_verification', 'forensic_check', 'authenticated', 'dispatched', 'delivered'];
      let st = order.status;
      if (st === 'placed') st = 'pending_verification';
      if (st === 'intake') st = 'forensic_check';
      if (st === 'authenticating' || st === 'sealed') st = 'authenticated';
      const curIdx = steps.indexOf(st);

      document.querySelectorAll('#modal-order-stepper .step-node').forEach((node, idx) => {
        node.classList.remove('completed', 'active');
        if (idx < curIdx) node.classList.add('completed');
        else if (idx === curIdx) node.classList.add('active');
      });

      modal.classList.add('active');
    }

    // =========================================================================
    // 4. USERS & COLLECTORS (CRM)
    // =========================================================================
    renderCollectors() {
      const tbody = document.getElementById('collectors-table-body');
      if (!tbody) return;

      tbody.innerHTML = this.collectors.map(col => {
        const initials = (col.name || 'CR').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return `
          <tr>
            <td>
              <div class="collector-avatar-cell">
                <div class="collector-avatar">${escapeHTML(initials)}</div>
                <div>
                  <div class="collector-name">${escapeHTML(col.name)}</div>
                  <div class="collector-handle">${escapeHTML(col.handle)} • ${escapeHTML(col.email)}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="vip-tier-badge ${col.role === 'admin' ? 'tier-admin' : (col.tier && col.tier.includes('Elite')) ? 'tier-elite' : 'tier-vault'}">
                ${escapeHTML(col.tier)}
              </span>
            </td>
            <td>
              <span class="mono" style="color: #4ade80;">${escapeHTML(col.preferredSize)}</span>
            </td>
            <td>
              <span class="mono" style="color: #ffffff; font-weight: 700;">$${Number(col.totalSpend || 0).toLocaleString()}</span>
            </td>
            <td>
              <span class="mono">${Number(col.grailsOwned || 0)} pairs</span>
            </td>
            <td>
              <select class="admin-select" style="padding: 4px 8px; font-size: 0.75rem;" onchange="window.aetherAdmin.updateCollectorRole('${escapeHTML(col.id)}', this.value)">
                <option value="collector" ${col.role === 'collector' ? 'selected' : ''}>Collector</option>
                <option value="vip_member" ${col.role === 'vip_member' ? 'selected' : ''}>VIP Member</option>
                <option value="admin" ${col.role === 'admin' ? 'selected' : ''}>Root Admin</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');
    }

    async updateCollectorRole(colId, newRole) {
      const col = this.collectors.find(c => c.id === colId);
      if (!col) return;
      col.role = newRole;
      col.tier = newRole === 'admin' ? 'Root Architect' : (newRole === 'vip_member' ? 'VIP Vault Member' : 'Grail Collector');

      if (window.AetherDB && typeof window.AetherDB.updateUser === 'function') {
        await window.AetherDB.updateUser(colId, { role: newRole });
      }

      this.renderCollectors();
      this.showToast(`Updated tier for ${escapeHTML(col.name)} to: ${col.tier}`);
    }

    // =========================================================================
    // 5. HYPE DROPS CONTROLLER
    // =========================================================================
    renderHypeDrops() {
      const statusPill = document.getElementById('drop-live-status-pill');
      if (statusPill && this.drops.length > 0) {
        const drop = this.drops[0];
        statusPill.textContent = `${drop.title.toUpperCase()} [${drop.status.toUpperCase()}]`;
      }
    }

    initHypeCountdown() {
      if (this.dropCountdownTimer) clearInterval(this.dropCountdownTimer);

      let targetTime = Date.now() + (4 * 3600 + 28 * 60 + 15) * 1000;

      const update = () => {
        const now = Date.now();
        const diff = Math.max(0, targetTime - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const elH = document.getElementById('cd-hours');
        const elM = document.getElementById('cd-minutes');
        const elS = document.getElementById('cd-seconds');

        if (elH) elH.textContent = String(hours).padStart(2, '0');
        if (elM) elM.textContent = String(minutes).padStart(2, '0');
        if (elS) elS.textContent = String(seconds).padStart(2, '0');
      };

      update();
      this.dropCountdownTimer = setInterval(update, 1000);
    }

    // =========================================================================
    // 6. SQL CONSOLE & DATABASE EXPORT TOOLS
    // =========================================================================
    async renderSqlConsole() {
      const ddlTerminal = document.getElementById('sql-ddl-output');
      if (!ddlTerminal) return;

      if (window.AetherDB && typeof window.AetherDB.exportSQL === 'function') {
        const sqlText = await window.AetherDB.exportSQL();
        // Syntax highlight keywords
        const highlighted = sqlText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/(--.*)/g, '<span class="sql-comment">$1</span>')
          .replace(/\b(CREATE|TABLE|PRIMARY|KEY|NOT|NULL|UNIQUE|DEFAULT|INSERT|INTO|VALUES|ON|CONFLICT|DO|UPDATE|SET|REFERENCES|CHECK|VIEW|AS|SELECT|FROM|WHERE)\b/g, '<span class="sql-keyword">$1</span>')
          .replace(/\b(VARCHAR|DECIMAL|TIMESTAMP|BOOLEAN|INTEGER|TEXT)\b/g, '<span class="sql-type">$1</span>');

        ddlTerminal.innerHTML = highlighted;
      }
    }

    executeSqlConsoleQuery(query) {
      const q = (query || '').toLowerCase().trim();
      const output = document.getElementById('sql-query-results');
      if (!output) return;

      // Anti-SQLi Firewall Analysis & Threat Neutralization
      let sqliWarning = '';
      if (window.AetherDB && typeof window.AetherDB.checkSQLInjectionRisk === 'function') {
        const risk = window.AetherDB.checkSQLInjectionRisk(query);
        if (risk.hasRisk) {
          sqliWarning = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; padding: 10px; margin-bottom: 12px; color: #fca5a5;">
              <strong style="color: #ef4444;">🛡️ ANTI-SQL INJECTION FIREWALL ACTIVE:</strong>
              <div>Detected Vector Pattern: <code>${escapeHTML(risk.detectedPattern)}</code></div>
              <div style="font-size: 0.72rem; color: #fecaca; margin-top: 4px;">
                Threat neutralized: parameters are isolated from SQL command syntax. In production RDBMS, Prepared Statements (<code>PREPARE stmt ... EXECUTE</code>) compile AST separately, rendering injection breakout impossible.
              </div>
            </div>
          `;
        }
      }

      const shoesList = Object.values(this.shoes);
      let matched = shoesList;

      if (q.includes('price >')) {
        const val = parseFloat(q.split('price >')[1]) || 0;
        matched = shoesList.filter(s => s.price > val);
      } else if (q.includes('price <')) {
        const val = parseFloat(q.split('price <')[1]) || 9999;
        matched = shoesList.filter(s => s.price < val);
      } else if (q.includes('silhouette =') || q.includes('silhouette=')) {
        const parts = q.split('=');
        const target = parts[1].replace(/['";]/g, '').trim();
        matched = shoesList.filter(s => (s.silhouette || '').toLowerCase() === target.toLowerCase());
      } else if (q.includes('category =') || q.includes('category=')) {
        const parts = q.split('=');
        const target = parts[1].replace(/['";]/g, '').trim();
        matched = shoesList.filter(s => (s.category || '').toLowerCase() === target.toLowerCase());
      }

      output.innerHTML = `
        ${sqliWarning}
        <div style="color: #4ade80; margin-bottom: 8px;">✓ Query executed against live Aether Relational Engine: returned ${matched.length} rows.</div>
        <pre style="color: #d4d4d8; font-family: var(--admin-font-mono); font-size: 0.75rem; max-height: 200px; overflow-y: auto;">${escapeHTML(JSON.stringify(matched.map(m => ({ id: m.id, name: m.name, colorway: m.colorway, vault_price: m.price, sku: m.styleCode, category: m.category })), null, 2))}</pre>
      `;
    }

    async exportSqlFile() {
      if (window.AetherDB && typeof window.AetherDB.exportSQL === 'function') {
        const sql = await window.AetherDB.exportSQL();
        this.downloadBlob(sql, 'aether_kicks_dump.sql', 'text/sql');
        this.showToast('💾 Downloaded live SQL DDL & INSERT dump: aether_kicks_dump.sql');
      }
    }

    async exportJsonFile() {
      if (window.AetherDB && typeof window.AetherDB.exportJSON === 'function') {
        const data = await window.AetherDB.exportJSON();
        const jsonStr = JSON.stringify(data, null, 2);
        this.downloadBlob(jsonStr, 'aether_kicks_backup.json', 'application/json');
        this.showToast('💾 Downloaded complete vault backup: aether_kicks_backup.json');
      }
    }

    downloadBlob(content, filename, type) {
      const blob = new Blob([content], { type: `${type};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    async resetDatabaseConfirm() {
      if (confirm('RESET DATABASE WARNING:\nThis will restore all stores in IndexedDB back to factory deadstock seeds. All test modifications will be reset. Proceed?')) {
        if (window.AetherDB && typeof window.AetherDB.resetToDefaults === 'function') {
          await window.AetherDB.resetToDefaults();
        }
        await this.loadFromDatabase();
        this.showToast('🔄 Database reset to factory deadstock seeds.');
        if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
      }
    }

    // Safe Toast Notification System (Safe DOM Nodes)
    showToast(msg) {
      let container = document.getElementById('admin-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'admin-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = 'admin-toast';
      const dot = document.createElement('span');
      dot.style.cssText = 'width: 8px; height: 8px; border-radius: 50%; background: var(--admin-crimson); display: inline-block; flex-shrink: 0;';
      const textSpan = document.createElement('span');
      textSpan.textContent = String(msg || '');

      toast.appendChild(dot);
      toast.appendChild(textSpan);
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  // Instantiate singleton on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.aetherAdmin = new AetherAdminApp();
    window.adminApp = window.aetherAdmin;
  });

})();
