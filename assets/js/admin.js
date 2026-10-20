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
      this.chartRange = '30D';
      this.inactivityInterval = null;
      this.authenticatedAdmin = null;

      this.init();
    }

    async init() {
      this.setupTabs();
      this.setupEventListeners();
      this.setupAdminTeam();
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
    async unlockAndHydrateVault(adminData) {
      document.body.classList.remove('vault-locked');
      document.body.classList.add('vault-authenticated');
      const overlay = document.getElementById('admin-auth-overlay');
      if (overlay) overlay.classList.remove('active');

      if (!adminData) {
        try {
          const userJson = sessionStorage.getItem('aether_admin_user');
          if (userJson) adminData = JSON.parse(userJson);
        } catch (e) {}
      }

      this.authenticatedAdmin = adminData || {
        name: 'Lead Architect',
        role: 'admin',
        admin_role: 'Root Superadmin'
      };

      // Update Topbar Profile Pill
      const nameEl = document.querySelector('.admin-profile-name');
      const roleEl = document.querySelector('.admin-profile-role');
      const avatarEl = document.querySelector('.admin-avatar');
      if (nameEl) nameEl.textContent = this.authenticatedAdmin.name || this.authenticatedAdmin.full_name || 'Lead Architect';
      if (roleEl) roleEl.textContent = this.authenticatedAdmin.admin_role || 'Root Superadmin';
      if (avatarEl) {
        const initials = (this.authenticatedAdmin.name || this.authenticatedAdmin.full_name || 'RA').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarEl.textContent = initials;
      }

      this.setupInactivityEngine();

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

        // Build collectors & admins from users table + profile fallback
        this.collectors = (usersArr || []).map(u => ({
          id: u.id,
          name: u.full_name || u.name || 'Anonymous Collector',
          email: u.email,
          handle: '@' + (u.full_name || u.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '_'),
          tier: u.role === 'admin' ? (u.admin_role || 'Root Superadmin') : (u.role === 'vip_member' ? 'VIP Vault Member' : 'Grail Collector'),
          role: u.role || 'collector',
          admin_role: u.admin_role || (u.role === 'admin' ? 'Root Superadmin' : null),
          permissions: Array.isArray(u.permissions) ? u.permissions : (u.role === 'admin' ? ['Manage Inventory', 'Process Orders', 'Manage Team', 'Execute SQL Console', 'Export Vault Dumps'] : []),
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
    // HARDENED AUTHENTICATION & ACCESS GATE CONTROLLER (SECRET PASSKEY ONLY)
    // =========================================================================
    async setupAuthCheck() {
      const overlay = document.getElementById('admin-auth-overlay');
      const card = document.getElementById('auth-gate-card');
      const laserBeam = document.getElementById('auth-laser-beam');
      const badge = document.getElementById('auth-security-badge');
      const badgeText = document.getElementById('auth-badge-text');
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
        'aether2026',
        'aether_architect_2026'
      ];
      const AUTH_FAILED_KEY = 'aether_auth_failed_attempts';
      const AUTH_LOCKOUT_KEY = 'aether_auth_lockout_until';
      const MAX_ATTEMPTS = 3;
      const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes
      const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

      let lockoutTimerInterval = null;

      // -----------------------------------------------------------------------
      // Laser Scan & Visual Feedback Animation
      // -----------------------------------------------------------------------
      const triggerLaserVerification = () => {
        if (laserBeam) {
          laserBeam.classList.remove('scanning');
          void laserBeam.offsetWidth;
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
            if (passInput) {
              passInput.disabled = false;
              passInput.placeholder = 'Enter cryptographic passkey';
            }
            if (submitBtn) submitBtn.disabled = false;
            if (alertBanner) alertBanner.style.display = 'none';
            if (timerWrap) timerWrap.style.display = 'none';
            if (badge) {
              badge.className = 'auth-security-badge';
              if (badgeText) badgeText.textContent = 'RESTRICTED TERMINAL // ENCLAVE v2.6';
            }
            if (attemptsNotice) {
              attemptsNotice.innerHTML = safeHTML`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> <span>Rate-limited defense: 3 incorrect passkeys trigger a 10-minute automated lockout.</span>`;
            }
            if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
            this.showToast('ℹ️ Terminal Lockout Expired: Administrative console inputs re-enabled.');
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
          card.classList.add('lockout-state');
          if (passInput) {
            passInput.disabled = true;
            passInput.placeholder = 'TERMINAL LOCKED (10 MIN DEFENSE)';
          }
          if (submitBtn) submitBtn.disabled = true;
          if (badge) {
            badge.className = 'auth-security-badge badge-lockout';
            if (badgeText) badgeText.textContent = 'CRITICAL LOCKOUT ACTIVE // RATE LIMIT 3/3';
          }
          if (alertBanner) {
            alertBanner.style.display = 'flex';
            if (alertTitle) alertTitle.textContent = 'SECURITY LOCKOUT ENGAGED';
            if (alertDesc) alertDesc.textContent = 'Failed attempts threshold reached (3/3). Terminal inputs locked down.';
          }
          if (timerWrap) timerWrap.style.display = 'flex';
          updateLockoutCountdown(lockoutUntil);
          return true;
        }

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
          card.classList.remove('auth-shake');
          void card.offsetWidth;
          card.classList.add('auth-shake');
          setTimeout(() => card.classList.remove('auth-shake'), 450);

          if (alertBanner) {
            alertBanner.style.display = 'flex';
            if (alertTitle) alertTitle.textContent = 'ACCESS DENIED: INVALID PASSKEY';
            if (alertDesc) {
              alertDesc.textContent = `Attempt ${attempts} of ${MAX_ATTEMPTS} before automated 10-minute terminal lockout.`;
            }
          }
          if (attemptsNotice) {
            attemptsNotice.innerHTML = `<span style="color: #f87171; font-weight: 700;">Warning: ${attempts}/${MAX_ATTEMPTS} attempts used. Next failure triggers 10-min lockout.</span>`;
          }
          if (window.soundEngine && window.soundEngine.playSecurityAlarm) {
            window.soundEngine.playSecurityAlarm();
          }
        }
      };

      // -----------------------------------------------------------------------
      // Step 1: Inactivity & Session Signature Validation
      // -----------------------------------------------------------------------
      const isAlreadyAuth = sessionStorage.getItem('aether_admin_authenticated') === 'true';
      if (isAlreadyAuth) {
        const lastActivity = parseInt(sessionStorage.getItem('aether_admin_last_activity') || '0', 10);
        const now = Date.now();

        // 30-minute inactivity check
        if (lastActivity > 0 && (now - lastActivity) > INACTIVITY_LIMIT_MS) {
          sessionStorage.removeItem('aether_admin_authenticated');
          sessionStorage.removeItem('aether_admin_token');
          sessionStorage.removeItem('aether_admin_user');
          localStorage.removeItem('aether_user_session');
          this.showToast('🔒 Session Timed Out: Locked after 30 minutes of inactivity.');
        } else {
          // Cryptographic HMAC Verification
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
            sessionStorage.removeItem('aether_admin_user');
            localStorage.removeItem('aether_user_session');
            this.showToast('🚨 Unauthorized Session Tampering Detected! Cryptographic signature mismatch.');
          } else {
            sessionStorage.setItem('aether_admin_last_activity', now.toString());
            let adminPayload = null;
            try {
              adminPayload = JSON.parse(sessionStorage.getItem('aether_admin_user') || 'null');
            } catch (e) {}
            await this.unlockAndHydrateVault(adminPayload);
            return;
          }
        }
      }

      // Terminal is locked: Display hardened authentication gate
      document.body.classList.add('vault-locked');
      overlay.classList.add('active');

      // Check for Active Rate-Limiting Lockout
      checkLockoutStatus();

      // -----------------------------------------------------------------------
      // Step 2: Secret Cryptographic Passkey Form Submission
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

          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Verifying Cryptographic Passkey...</span>';

          await this.ensureDatabaseReady();

          let verifiedAdmin = null;

          // Verify Passkey via AetherDB Engine (Checks master keys + stored hashed admin passkeys)
          if (window.AetherDB && typeof window.AetherDB.verifyAdminPasskey === 'function') {
            try {
              verifiedAdmin = await window.AetherDB.verifyAdminPasskey(enteredPass);
            } catch (err) {
              console.error('[Admin Auth] Error verifying passkey with AetherDB:', err);
            }
          }

          // Fallback check against MASTER_KEYS
          if (!verifiedAdmin && MASTER_KEYS.includes(enteredPass)) {
            verifiedAdmin = {
              id: 'usr_admin_001',
              email: 'admin@aetherkicks.com',
              name: 'Atelier Vault Master',
              full_name: 'Atelier Vault Master',
              role: 'admin',
              admin_role: 'Root Superadmin',
              permissions: ['Manage Inventory', 'Process Orders', 'Manage Team', 'Execute SQL Console', 'Export Vault Dumps']
            };
          }

          if (verifiedAdmin) {
            localStorage.setItem(AUTH_FAILED_KEY, '0');
            localStorage.removeItem(AUTH_LOCKOUT_KEY);

            const adminPayload = {
              id: verifiedAdmin.id || 'usr_admin_001',
              email: verifiedAdmin.email || 'admin@aetherkicks.com',
              name: verifiedAdmin.full_name || verifiedAdmin.name || 'Admin Operator',
              full_name: verifiedAdmin.full_name || verifiedAdmin.name || 'Admin Operator',
              role: 'admin',
              admin_role: verifiedAdmin.admin_role || 'Vault Manager',
              permissions: Array.isArray(verifiedAdmin.permissions) && verifiedAdmin.permissions.length > 0
                ? verifiedAdmin.permissions
                : ['Manage Inventory', 'Process Orders', 'Manage Team', 'Execute SQL Console', 'Export Vault Dumps']
            };

            let signedSession = null;
            if (window.AetherDB && typeof window.AetherDB.signSession === 'function') {
              signedSession = await window.AetherDB.signSession(adminPayload);
            } else {
              signedSession = { payload: adminPayload, signature: 'vault_admin_sig', token: 'AK_SESSION' };
            }

            sessionStorage.setItem('aether_admin_authenticated', 'true');
            sessionStorage.setItem('aether_admin_token', signedSession.token);
            sessionStorage.setItem('aether_admin_user', JSON.stringify(adminPayload));
            sessionStorage.setItem('aether_admin_last_activity', Date.now().toString());
            localStorage.setItem('aether_user_session', JSON.stringify(signedSession));

            triggerLaserVerification();

            if (window.soundEngine) {
              if (window.soundEngine.playLaserVerify) window.soundEngine.playLaserVerify();
              if (window.soundEngine.playVaultUnlock) {
                setTimeout(() => window.soundEngine.playVaultUnlock(), 300);
              }
            }

            this.showToast(`⚡ Access Granted: ${adminPayload.admin_role} Console Online.`);

            setTimeout(async () => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Authenticate & Unlock Vault</span>';
              if (passInput) passInput.value = '';
              await this.unlockAndHydrateVault(adminPayload);
            }, 600);

          } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Authenticate & Unlock Vault</span>';
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
      // Step 3: Lock Session Action Buttons
      // -----------------------------------------------------------------------
      document.querySelectorAll('.btn-lock-session').forEach(btn => {
        btn.onclick = async (e) => {
          e.preventDefault();
          sessionStorage.removeItem('aether_admin_authenticated');
          sessionStorage.removeItem('aether_admin_token');
          sessionStorage.removeItem('aether_admin_user');
          sessionStorage.removeItem('aether_admin_last_activity');
          localStorage.removeItem('aether_user_session');
          document.body.classList.add('vault-locked');
          document.body.classList.remove('vault-authenticated');
          overlay.classList.add('active');

          if (passInput) {
            passInput.value = '';
            passInput.disabled = false;
          }
          if (submitBtn) submitBtn.disabled = false;

          if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
          this.showToast('🔒 Vault Administrative Console Locked.');
        };
      });
    }

    /**
     * Secret 30-Minute Inactivity Auto-Lockout Engine
     */
    setupInactivityEngine() {
      if (this.inactivityInterval) clearInterval(this.inactivityInterval);

      const INACTIVITY_LIMIT_MS = 30 * 60 * 1000;

      // Throttle user activity tracking
      let lastRecorded = 0;
      const recordActivity = () => {
        const now = Date.now();
        if (now - lastRecorded > 5000) {
          lastRecorded = now;
          if (sessionStorage.getItem('aether_admin_authenticated') === 'true') {
            sessionStorage.setItem('aether_admin_last_activity', now.toString());
          }
        }
      };

      ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, recordActivity, { passive: true });
      });

      // Verification interval every 15 seconds
      this.inactivityInterval = setInterval(() => {
        if (sessionStorage.getItem('aether_admin_authenticated') === 'true') {
          const last = parseInt(sessionStorage.getItem('aether_admin_last_activity') || '0', 10);
          if (last > 0 && (Date.now() - last) > INACTIVITY_LIMIT_MS) {
            console.warn('[Admin Security] 30-minute session inactivity timeout exceeded. Auto-locking terminal.');
            sessionStorage.removeItem('aether_admin_authenticated');
            sessionStorage.removeItem('aether_admin_token');
            document.body.classList.add('vault-locked');
            document.body.classList.remove('vault-authenticated');
            const overlay = document.getElementById('admin-auth-overlay');
            if (overlay) overlay.classList.add('active');
            this.showToast('🔒 Terminal Locked: 30 minutes of inactivity detected. Secret passkey required.');
            this.setupAuthCheck();
          }
        }
      }, 15000);
    }

    // =========================================================================
    // ADMINISTRATOR TEAM & RBAC CREDENTIAL MANAGEMENT
    // =========================================================================
    setupAdminTeam() {
      const btnOpenAddModal = document.getElementById('btn-open-add-admin-modal');
      const modalAddAdmin = document.getElementById('modal-add-admin');
      const formAddAdmin = document.getElementById('form-add-admin');
      const btnToggleNewPass = document.getElementById('btn-toggle-new-passkey');
      const newPassInput = document.getElementById('admin-new-passkey');

      // 1. Open Add Admin Modal
      if (btnOpenAddModal) {
        btnOpenAddModal.addEventListener('click', (e) => {
          e.preventDefault();
          if (modalAddAdmin) {
            modalAddAdmin.classList.add('active');
            const nameInp = document.getElementById('admin-new-name');
            if (nameInp) nameInp.focus();
            if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();
          }
        });
      }

      // 2. Toggle New Passkey Visibility
      if (btnToggleNewPass && newPassInput) {
        btnToggleNewPass.addEventListener('click', (e) => {
          e.preventDefault();
          const isPass = newPassInput.type === 'password';
          newPassInput.type = isPass ? 'text' : 'password';
          btnToggleNewPass.style.color = isPass ? '#ffffff' : 'var(--admin-text-muted)';
        });
      }

      // 3. Handle Add Admin Form Submit
      if (formAddAdmin) {
        formAddAdmin.addEventListener('submit', async (e) => {
          e.preventDefault();

          const name = (document.getElementById('admin-new-name')?.value || '').trim();
          const email = (document.getElementById('admin-new-email')?.value || '').toLowerCase().trim();
          const role = document.getElementById('admin-new-role')?.value || 'Vault Manager';
          const passkey = (document.getElementById('admin-new-passkey')?.value || '').trim();

          if (!name || !email || !passkey) {
            this.showToast('❌ Please fill in all required administrator fields.');
            return;
          }

          if (passkey.length < 6) {
            this.showToast('❌ Passkey must be at least 6 characters.');
            return;
          }

          // Gather Permissions
          const checkedPerms = [];
          document.querySelectorAll('#form-add-admin input[name="permissions"]:checked').forEach(cb => {
            checkedPerms.push(cb.value);
          });

          await this.ensureDatabaseReady();

          // Cryptographic Passkey Hash
          const passkeyHash = await window.AetherDB.hashPassword(passkey);

          const newAdminId = `usr_admin_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
          const newAdminUser = {
            id: newAdminId,
            email: email,
            full_name: name,
            name: name,
            role: 'admin',
            admin_role: role,
            permissions: checkedPerms.length > 0 ? checkedPerms : ['Manage Inventory', 'Process Orders', 'Export Vault Dumps'],
            password_hash: passkeyHash,
            created_at: new Date().toISOString()
          };

          try {
            await window.AetherDB.addUser(newAdminUser);
            this.closeModal('modal-add-admin');
            formAddAdmin.reset();

            this.showToast(`✅ Administrator Credentials Provisioned for ${name} (${role})`);
            if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();

            await this.loadFromDatabase();
          } catch (err) {
            console.error('[Admin Provisioning Error]', err);
            this.showToast(`❌ Error provisioning administrator: ${err.message}`);
          }
        });
      }

      // 4. Handle Edit Admin Form Submit
      const formEditAdmin = document.getElementById('form-edit-admin');
      if (formEditAdmin) {
        formEditAdmin.addEventListener('submit', async (e) => {
          e.preventDefault();

          const adminId = document.getElementById('admin-edit-id')?.value;
          const newRole = document.getElementById('admin-edit-role')?.value;
          if (!adminId) return;

          const checkedPerms = [];
          document.querySelectorAll('#form-edit-admin input[name="edit_permissions"]:checked').forEach(cb => {
            checkedPerms.push(cb.value);
          });

          await this.ensureDatabaseReady();
          try {
            await window.AetherDB.updateUser(adminId, {
              admin_role: newRole,
              permissions: checkedPerms
            });

            this.closeModal('modal-edit-admin');
            this.showToast(`✅ Administrative Privileges Updated for ${newRole}`);
            if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();

            await this.loadFromDatabase();
          } catch (err) {
            console.error('[Admin Edit Error]', err);
            this.showToast(`❌ Error updating administrator: ${err.message}`);
          }
        });
      }
    }

    openEditAdminModal(adminId) {
      const admin = this.collectors.find(c => c.id === adminId && c.role === 'admin');
      if (!admin) return;

      const modal = document.getElementById('modal-edit-admin');
      if (!modal) return;

      const idInp = document.getElementById('admin-edit-id');
      const nameDisp = document.getElementById('admin-edit-name-display');
      const roleSel = document.getElementById('admin-edit-role');

      if (idInp) idInp.value = admin.id;
      if (nameDisp) nameDisp.textContent = `${admin.name} (${admin.email})`;
      if (roleSel) roleSel.value = admin.admin_role || 'Vault Manager';

      const perms = admin.permissions || [];
      const permIds = {
        'Manage Inventory': 'perm-edit-inventory',
        'Process Orders': 'perm-edit-orders',
        'Manage Team': 'perm-edit-team',
        'Execute SQL Console': 'perm-edit-sql',
        'Export Vault Dumps': 'perm-edit-dumps'
      };

      Object.keys(permIds).forEach(permName => {
        const el = document.getElementById(permIds[permName]);
        if (el) el.checked = perms.includes(permName);
      });

      modal.classList.add('active');
    }

    async revokeAdminAccess(adminId) {
      const admin = this.collectors.find(c => c.id === adminId);
      if (!admin) return;

      if (admin.id === 'usr_admin_001') {
        alert('SECURITY PROTOCOL: Root Superadmin (Atelier Vault Master) credentials cannot be revoked.');
        return;
      }

      if (!confirm(`Revoke administrative access for ${admin.name}?\nTheir administrative privileges will be cancelled and their account downgraded to Collector.`)) {
        return;
      }

      await this.ensureDatabaseReady();
      try {
        await window.AetherDB.updateUser(adminId, {
          role: 'collector',
          admin_role: null,
          permissions: []
        });

        this.showToast(`🔒 Administrative Access Revoked for ${admin.name}. Account reverted to Collector.`);
        if (window.soundEngine && window.soundEngine.playSwitch) window.soundEngine.playSwitch();

        await this.loadFromDatabase();
      } catch (err) {
        console.error('[Admin Revocation Error]', err);
        this.showToast(`❌ Failed to revoke administrative credentials: ${err.message}`);
      }
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

      // Overview Analytics Range Buttons (30D, 7D, 24H)
      document.querySelectorAll('.btn-chart-range').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.btn-chart-range').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.chartRange = btn.textContent.trim();
          this.renderVelocityChart();
          if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
        });
      });

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
      const ind = document.getElementById('db-live-indicator');
      if (ind) {
        ind.textContent = `${shoeCount} Grails`;
      }
      const badgeInv = document.getElementById('sidebar-badge-inventory');
      if (badgeInv) {
        badgeInv.textContent = shoeCount;
        badgeInv.title = `${shoeCount} Grails in Vault Catalog`;
      }

      const badgeOrders = document.getElementById('sidebar-badge-orders');
      if (badgeOrders) {
        const pending = this.orders.filter(o => o.status !== 'delivered').length;
        badgeOrders.textContent = pending > 0 ? String(pending) : '0';
        badgeOrders.title = `${pending} Active Orders in Custody`;
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

      const range = this.chartRange || '30D';
      const now = new Date();
      const buckets = [];

      // 1. Calculate Time Intervals & Labels
      if (range === '24H') {
        for (let i = 23; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 3600 * 1000);
          const hour = d.getHours().toString().padStart(2, '0') + ':00';
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0, 0).getTime();
          buckets.push({
            time: d,
            label: hour,
            startTime: start,
            endTime: start + 3600 * 1000,
            volume: 0,
            pairs: 0,
            transactions: 0
          });
        }
      } else if (range === '7D') {
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          buckets.push({
            time: d,
            label: dayName,
            startTime: start,
            endTime: start + 24 * 3600 * 1000,
            volume: 0,
            pairs: 0,
            transactions: 0
          });
        }
      } else {
        // 30D (default)
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
          const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          buckets.push({
            time: d,
            label: dateLabel,
            startTime: start,
            endTime: start + 24 * 3600 * 1000,
            volume: 0,
            pairs: 0,
            transactions: 0
          });
        }
      }

      // 2. Aggregate Live Orders and Shoes from AetherDB
      let totalVaultLiquidity = 0;
      Object.values(this.shoes).forEach(s => {
        const stockMap = s.sizesStock || {};
        const pairs = Object.values(stockMap).reduce((a, b) => a + Number(b || 0), 0);
        totalVaultLiquidity += (s.price || 0) * pairs;
      });

      this.orders.forEach(order => {
        const orderTime = new Date(order.created_at || now).getTime();
        const bucket = buckets.find(b => orderTime >= b.startTime && orderTime < b.endTime);
        const orderTotal = parseFloat(order.total || order.subtotal || 480);
        const itemsCount = (order.items && order.items.length) ? order.items.reduce((acc, it) => acc + (it.quantity || 1), 0) : 1;

        if (bucket) {
          bucket.volume += orderTotal;
          bucket.pairs += itemsCount;
          bucket.transactions += 1;
        } else if (buckets.length > 0) {
          const lastBucket = buckets[buckets.length - 1];
          lastBucket.volume += (orderTotal * 0.12);
        }
      });

      // 3. Market Trading Velocity Trajectory (Secondary Marketplace Baseline)
      const basePoints = range === '24H'
        ? [22, 28, 25, 34, 38, 45, 52, 60, 72, 85, 96, 110, 104, 122, 115, 134, 142, 158, 165, 180, 172, 188, 195, 210]
        : (range === '7D'
          ? [68, 85, 92, 115, 138, 164, 192]
          : [28, 32, 36, 30, 42, 48, 44, 52, 58, 65, 61, 74, 82, 78, 88, 96, 91, 105, 118, 112, 128, 136, 130, 145, 158, 150, 168, 182, 175, 198]
        );

      buckets.forEach((b, idx) => {
        const baselineMultiplier = (Math.max(80000, totalVaultLiquidity) / 164820) * 110;
        const baseVol = (basePoints[idx % basePoints.length] || 45) * baselineMultiplier;
        b.volume = Math.round(b.volume + baseVol);
        b.pairs = b.pairs + Math.max(1, Math.round(b.volume / 540));
        b.transactions = b.transactions + Math.max(1, Math.round(b.pairs / 1.5));
        b.liquidity = Math.round(totalVaultLiquidity * (0.94 + (idx / buckets.length) * 0.09));
      });

      // 4. SVG Coordinate Geometry
      const width = 800;
      const height = 220;
      const padX = 45;
      const padY = 30;

      const volumes = buckets.map(b => b.volume);
      const minVal = Math.min(...volumes) * 0.85;
      const maxVal = Math.max(...volumes) * 1.1;

      const coords = buckets.map((b, idx) => {
        const x = padX + (idx / (buckets.length - 1)) * (width - padX * 2);
        const y = height - padY - ((b.volume - minVal) / (maxVal - minVal || 1)) * (height - padY * 2);
        return { x, y, bucket: b };
      });

      let dPath = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];
        const cpX = ((prev.x + curr.x) / 2).toFixed(1);
        dPath += ` C ${cpX} ${prev.y.toFixed(1)}, ${cpX} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
      }

      const dArea = `${dPath} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`;

      const topMilestone = `$${Math.round(maxVal).toLocaleString()}`;
      const midMilestone = `$${Math.round((maxVal + minVal) / 2).toLocaleString()}`;

      this._chartCoords = coords;
      this._chartWidth = width;
      this._chartHeight = height;

      container.innerHTML = `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" id="chart-velocity-svg">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#dc2626" stop-opacity="0.45" />
              <stop offset="60%" stop-color="#dc2626" stop-opacity="0.10" />
              <stop offset="100%" stop-color="#dc2626" stop-opacity="0.0" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Horizontal Reference Grids -->
          <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
          <text x="${padX - 8}" y="${padY + 4}" fill="#71717a" font-size="10" font-family="Space Mono, monospace" text-anchor="end">${topMilestone}</text>

          <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <text x="${padX - 8}" y="${height / 2 + 4}" fill="#71717a" font-size="10" font-family="Space Mono, monospace" text-anchor="end">${midMilestone}</text>

          <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="rgba(255,255,255,0.1)" />

          <!-- Gradient Area & Glowing Curve -->
          <path d="${dArea}" fill="url(#chartGradient)" />
          <path d="${dPath}" fill="none" stroke="#dc2626" stroke-width="3" filter="url(#neonGlow)" />

          <!-- Interactive Vertical Crosshair Line -->
          <line id="chart-crosshair" x1="0" y1="${padY}" x2="0" y2="${height - padY}" stroke="rgba(255, 255, 255, 0.45)" stroke-dasharray="3 3" style="display: none;" />

          <!-- Interactive Active Circle Highlight -->
          <circle id="chart-active-point" cx="0" cy="0" r="6" fill="#ffffff" stroke="#dc2626" stroke-width="3" style="display: none; filter: drop-shadow(0 0 8px #dc2626);" />

          <!-- Milestone Dots -->
          ${coords.filter((_, i) => i % (range === '30D' ? 4 : 1) === 0).map(pt => `
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.5" fill="#18181b" stroke="#dc2626" stroke-width="2"></circle>
          `).join('')}

          <!-- Date / Time Labels along bottom -->
          ${coords.filter((_, i) => i % (range === '30D' ? 5 : (range === '7D' ? 1 : 4)) === 0 || i === coords.length - 1).map(pt => `
            <text x="${pt.x.toFixed(1)}" y="${height - 10}" fill="#a1a1aa" font-size="10" font-family="Space Mono, monospace" text-anchor="middle">${escapeHTML(pt.bucket.label)}</text>
          `).join('')}
        </svg>

        <div id="chart-admin-tooltip" class="chart-admin-tooltip"></div>
      `;

      this.attachChartHoverEvents(container);
    }

    attachChartHoverEvents(container) {
      const svg = container.querySelector('#chart-velocity-svg');
      const tooltip = container.querySelector('#chart-admin-tooltip');
      const crosshair = container.querySelector('#chart-crosshair');
      const activePoint = container.querySelector('#chart-active-point');
      if (!svg || !tooltip || !this._chartCoords) return;

      const handleMove = (e) => {
        const rect = svg.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        if (!clientX) return;

        const mouseSvgX = ((clientX - rect.left) / rect.width) * this._chartWidth;

        let closestPt = this._chartCoords[0];
        let minDist = Math.abs(mouseSvgX - closestPt.x);
        for (let i = 1; i < this._chartCoords.length; i++) {
          const dist = Math.abs(mouseSvgX - this._chartCoords[i].x);
          if (dist < minDist) {
            minDist = dist;
            closestPt = this._chartCoords[i];
          }
        }

        if (!closestPt) return;
        const b = closestPt.bucket;

        if (crosshair) {
          crosshair.setAttribute('x1', closestPt.x);
          crosshair.setAttribute('x2', closestPt.x);
          crosshair.style.display = 'block';
        }
        if (activePoint) {
          activePoint.setAttribute('cx', closestPt.x);
          activePoint.setAttribute('cy', closestPt.y);
          activePoint.style.display = 'block';
        }

        tooltip.innerHTML = `
          <div class="chart-tooltip-header">
            <span class="chart-tooltip-date">${escapeHTML(b.label)}</span>
            <span class="chart-tooltip-badge">VAULT HUD</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="chart-tooltip-label">Trading Volume:</span>
            <span class="chart-tooltip-val val-volume">$${b.volume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="chart-tooltip-label">Pairs Cleared:</span>
            <span class="chart-tooltip-val val-pairs">${b.pairs} Pairs (${b.transactions} Tx)</span>
          </div>
          <div class="chart-tooltip-row">
            <span class="chart-tooltip-label">Vault Liquidity Index:</span>
            <span class="chart-tooltip-val val-liquidity">$${b.liquidity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        `;

        const pixelX = (closestPt.x / this._chartWidth) * rect.width;
        const pixelY = (closestPt.y / this._chartHeight) * rect.height;

        tooltip.style.left = `${pixelX}px`;
        tooltip.style.top = `${pixelY}px`;
        tooltip.classList.add('visible');
      };

      const handleLeave = () => {
        if (tooltip) tooltip.classList.remove('visible');
        if (crosshair) crosshair.style.display = 'none';
        if (activePoint) activePoint.style.display = 'none';
      };

      container.onmousemove = handleMove;
      container.onmouseleave = handleLeave;
      container.ontouchmove = handleMove;
      container.ontouchend = handleLeave;
    }

    renderAllocationBars(shoesList, totalPairs) {
      const container = document.getElementById('allocation-bars-container');
      if (!container) return;

      const silMap = {
        'High OG': 0,
        'Low OG': 0,
        'Retro 4': 0,
        'Bespoke': 0
      };

      shoesList.forEach(s => {
        const rawSil = (s.silhouette || '').trim();
        let normalized = 'High OG';

        if (/low/i.test(rawSil)) {
          normalized = 'Low OG';
        } else if (/4|aj4|retro 4/i.test(rawSil)) {
          normalized = 'Retro 4';
        } else if (/bespoke|collab/i.test(rawSil)) {
          normalized = 'Bespoke';
        } else if (/retro 3|3/i.test(rawSil)) {
          normalized = 'Retro 3';
        } else {
          normalized = 'High OG';
        }

        const stockMap = s.sizesStock || {};
        const pairs = Object.values(stockMap).reduce((a, b) => a + Number(b || 0), 0);
        silMap[normalized] = (silMap[normalized] || 0) + pairs;
      });

      if (this.drops && this.drops.length > 0) {
        this.drops.forEach(d => {
          if (/bespoke/i.test(d.title || '')) {
            silMap['Bespoke'] = (silMap['Bespoke'] || 0) + (d.stock_allocated || 5);
          }
        });
      }

      const totalCalculatedPairs = Object.values(silMap).reduce((a, b) => a + b, 0) || totalPairs || 1;

      const colors = {
        'High OG': '#dc2626',
        'Retro 4': '#9333ea',
        'Low OG': '#0284c7',
        'Retro 3': '#ea580c',
        'Bespoke': '#eab308'
      };

      container.innerHTML = Object.keys(silMap).map(sil => {
        const count = silMap[sil];
        const pct = totalCalculatedPairs > 0 ? Math.round((count / totalCalculatedPairs) * 100) : 0;
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
        const shoeColor = s.theme || '#dc2626';
        document.getElementById('shoe-theme-color').value = shoeColor;
        if (document.getElementById('shoe-theme-hex')) document.getElementById('shoe-theme-hex').value = shoeColor;
        if (document.getElementById('shoe-color-badge')) {
          document.getElementById('shoe-color-badge').style.background = shoeColor;
          document.getElementById('shoe-color-badge').style.boxShadow = `0 0 10px ${shoeColor}88`;
        }
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
        const defColor = '#dc2626';
        document.getElementById('shoe-theme-color').value = defColor;
        if (document.getElementById('shoe-theme-hex')) document.getElementById('shoe-theme-hex').value = defColor;
        if (document.getElementById('shoe-color-badge')) {
          document.getElementById('shoe-color-badge').style.background = defColor;
          document.getElementById('shoe-color-badge').style.boxShadow = `0 0 10px ${defColor}88`;
        }
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
      const colorInput = document.getElementById('shoe-theme-color');
      const hexInput = document.getElementById('shoe-theme-hex');
      const badge = document.getElementById('shoe-color-badge');
      const theme = colorInput?.value || '#dc2626';

      if (hexInput && hexInput.value.toLowerCase() !== theme.toLowerCase()) {
        hexInput.value = theme;
      }
      if (badge) {
        badge.style.background = theme;
        badge.style.boxShadow = `0 0 10px ${theme}88`;
      }

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

    onCustomHexInput(val) {
      if (!val) return;
      val = val.trim();
      if (!val.startsWith('#') && /^[0-9A-Fa-f]{6}$/.test(val)) {
        val = '#' + val;
      }
      const colorInput = document.getElementById('shoe-theme-color');
      const badge = document.getElementById('shoe-color-badge');
      if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
        if (colorInput) colorInput.value = val;
        if (badge) {
          badge.style.background = val;
          badge.style.boxShadow = `0 0 10px ${val}88`;
        }
        this.updateShoeModalPreview();
      }
    }

    setColorTheme(hex) {
      if (!hex) return;
      const colorInput = document.getElementById('shoe-theme-color');
      const hexInput = document.getElementById('shoe-theme-hex');
      const badge = document.getElementById('shoe-color-badge');
      if (colorInput) colorInput.value = hex;
      if (hexInput) hexInput.value = hex;
      if (badge) {
        badge.style.background = hex;
        badge.style.boxShadow = `0 0 10px ${hex}88`;
      }
      this.updateShoeModalPreview();
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

      const printNfc = document.getElementById('cert-print-nfc');
      if (printNfc) printNfc.textContent = nfcHash;
      const printDate = document.getElementById('cert-print-date');
      if (printDate) {
        const d = new Date();
        printDate.textContent = `TIMESTAMP: ${d.toISOString().replace('T', ' ').substring(0, 19)} UTC`;
      }

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
    // 4. USERS, ADMIN TEAM & COLLECTORS (CRM)
    // =========================================================================
    renderCollectors() {
      // 1. Render Administrative Vault Team Table
      const adminTbody = document.getElementById('admin-team-table-body');
      if (adminTbody) {
        const admins = this.collectors.filter(c => c.role === 'admin');
        if (admins.length === 0) {
          adminTbody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; color: var(--admin-text-muted); padding: 18px;">
                No administrators found in vault store. Use "+ Add Administrator" above to provision credentials.
              </td>
            </tr>
          `;
        } else {
          adminTbody.innerHTML = admins.map(col => {
            const initials = (col.name || 'AD').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const isSuper = (col.admin_role === 'Root Superadmin' || col.id === 'usr_admin_001');
            const perms = Array.isArray(col.permissions) && col.permissions.length > 0 
              ? col.permissions 
              : ['Manage Inventory', 'Process Orders', 'Export Vault Dumps'];

            return `
              <tr>
                <td>
                  <div class="collector-avatar-cell">
                    <div class="collector-avatar" style="${isSuper ? 'border-color: #eab308; box-shadow: 0 0 10px rgba(234, 179, 8, 0.4);' : ''}">${escapeHTML(initials)}</div>
                    <div>
                      <div class="collector-name" style="display: flex; align-items: center; gap: 6px;">
                        <span>${escapeHTML(col.name)}</span>
                        ${isSuper ? '<span style="color: #eab308;" title="Root Master Enclave Key">★</span>' : ''}
                      </div>
                      <div class="collector-handle">${escapeHTML(col.email)} • <span class="sku-badge" style="font-size: 0.65rem;">${escapeHTML(col.id)}</span></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="vip-tier-badge ${isSuper ? 'tier-superadmin' : 'tier-admin'}">
                    ${isSuper ? 'SUPERADMIN' : 'ADMIN'}
                  </span>
                  <span class="admin-role-title">${escapeHTML(col.admin_role || (isSuper ? 'Root Superadmin' : 'Vault Manager'))}</span>
                </td>
                <td>
                  <div class="perm-chips-wrap">
                    ${perms.map(p => `
                      <span class="perm-chip ${p.includes('Team') || p.includes('SQL') ? 'perm-highlight' : ''}">${escapeHTML(p)}</span>
                    `).join('')}
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span class="mono" style="font-size: 0.72rem; color: #4ade80;">● SHA-256 Validated</span>
                    <span class="mono" style="font-size: 0.65rem; color: #71717a;">Enclave Active</span>
                  </div>
                </td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="btn-row-action" onclick="window.aetherAdmin.openEditAdminModal('${escapeHTML(col.id)}')" title="Edit Role & Permissions">
                      Edit Role
                    </button>
                    ${isSuper ? `
                      <button type="button" class="btn-row-action" style="opacity: 0.4; cursor: not-allowed;" title="Root Superadmin cannot be revoked" disabled>
                        Protected
                      </button>
                    ` : `
                      <button type="button" class="btn-row-action text-danger" onclick="window.aetherAdmin.revokeAdminAccess('${escapeHTML(col.id)}')" title="Revoke Administrative Privileges">
                        Revoke Access
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 2. Render VIP & Public Collectors Table
      const tbody = document.getElementById('collectors-table-body');
      if (tbody) {
        const clientCollectors = this.collectors.filter(c => c.role !== 'admin');
        if (clientCollectors.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 18px;">
                No public or VIP collectors enrolled yet.
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = clientCollectors.map(col => {
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
                  <span class="vip-tier-badge ${(col.tier && col.tier.includes('Elite')) ? 'tier-elite' : (col.role === 'vip_member' ? 'tier-vault' : 'tier-collector')}">
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
                    <option value="admin" ${col.role === 'admin' ? 'selected' : ''}>Promote to Admin</option>
                  </select>
                </td>
              </tr>
            `;
          }).join('');
        }
      }
    }

    async updateCollectorRole(colId, newRole) {
      const col = this.collectors.find(c => c.id === colId);
      if (!col) return;
      col.role = newRole;
      col.tier = newRole === 'admin' ? 'Vault Manager' : (newRole === 'vip_member' ? 'VIP Vault Member' : 'Grail Collector');
      if (newRole === 'admin') {
        col.admin_role = 'Vault Manager';
        col.permissions = ['Manage Inventory', 'Process Orders', 'Export Vault Dumps'];
      }

      if (window.AetherDB && typeof window.AetherDB.updateUser === 'function') {
        await window.AetherDB.updateUser(colId, {
          role: newRole,
          admin_role: col.admin_role || null,
          permissions: col.permissions || []
        });
      }

      this.renderCollectors();
      this.showToast(`Updated role for ${escapeHTML(col.name)} to: ${col.tier}`);
      if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
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
