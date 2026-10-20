/**
 * AETHER KICKS - Authentication & Floating Sneaker Physics
 * Damped 3D Parallax & Synchronized Lighting Reactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initSneakerParallax();
  initFormInteractions();
});

// Interactive 3D Mouse Parallax on Floating Sneaker with Smooth Damping
function initSneakerParallax() {
  const stage = document.querySelector('.floating-sneaker-stage');
  const shoeWrap = document.querySelector('.floating-shoe-wrap');
  const shadow = document.querySelector('.floating-shoe-shadow');
  const halo = document.querySelector('.shoe-halo-glow');
  const pane = document.querySelector('.auth-shoe-pane');

  if (!stage || !shoeWrap || !pane) return;

  let bounds = pane.getBoundingClientRect();
  window.addEventListener('resize', () => {
    bounds = pane.getBoundingClientRect();
  });

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;
  let animId = null;

  function updatePhysics() {
    if (isHovering) {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      const time = Date.now() * 0.0025;
      const floatY = Math.sin(time) * 10 - 10;

      const tiltX = -currentY * 26;
      const tiltY = currentX * 30;
      const rotZ = -12 + currentX * 8;

      shoeWrap.style.transform = `perspective(1000px) translateY(${floatY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotZ}deg) scale3d(1.04, 1.04, 1.04)`;
      
      if (shadow) {
        const shadowScale = (1 - Math.abs(currentY) * 0.18) * (1 - (floatY / -10) * 0.12);
        shadow.style.transform = `translateX(${currentX * 36}px) scale(${shadowScale})`;
      }

      if (halo) {
        halo.style.transform = `translate(calc(-50% + ${currentX * 30}px), calc(-50% + ${currentY * 30}px)) scale(1.15)`;
      }

      animId = requestAnimationFrame(updatePhysics);
    } else {
      currentX += (0 - currentX) * 0.1;
      currentY += (0 - currentY) * 0.1;

      if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
        const tiltX = -currentY * 26;
        const tiltY = currentX * 30;
        shoeWrap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${-12 + currentX * 8}deg)`;
        animId = requestAnimationFrame(updatePhysics);
      } else {
        shoeWrap.style.transform = '';
        if (shadow) shadow.style.transform = '';
        if (halo) halo.style.transform = '';
        cancelAnimationFrame(animId);
      }
    }
  }

  pane.addEventListener('mouseenter', () => {
    isHovering = true;
    bounds = pane.getBoundingClientRect();
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(updatePhysics);
  });

  pane.addEventListener('mousemove', (e) => {
    targetX = ((e.clientX - bounds.left) / bounds.width) - 0.5;
    targetY = ((e.clientY - bounds.top) / bounds.height) - 0.5;
  });

  pane.addEventListener('mouseleave', () => {
    isHovering = false;
  });
}

// Form Validation, Password Toggle, and Demo Helpers
function initFormInteractions() {
  // Toggle password visibility
  document.querySelectorAll('.btn-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        ` : `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        `;
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });

  // Portuguese / EU Sneaker Sizing & Dynamic Unit Switcher
  const SNEAKER_SIZING_TABLE = window.AETHER_SIZING_TABLE || [
    { eu: '38',   us: '5.5',  uk: '5',   cm: '24.0' },
    { eu: '38.5', us: '6',    uk: '5.5', cm: '24.0' },
    { eu: '39',   us: '6.5',  uk: '6',   cm: '24.5' },
    { eu: '40',   us: '7',    uk: '6',   cm: '25.0' },
    { eu: '40.5', us: '7.5',  uk: '6.5', cm: '25.5' },
    { eu: '41',   us: '8',    uk: '7',   cm: '26.0' },
    { eu: '42',   us: '8.5',  uk: '7.5', cm: '26.5' },
    { eu: '42.5', us: '9',    uk: '8',   cm: '27.0' },
    { eu: '43',   us: '9.5',  uk: '8.5', cm: '27.5' },
    { eu: '44',   us: '10',   uk: '9',   cm: '28.0' },
    { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
    { eu: '45',   us: '11',   uk: '10',  cm: '29.0' },
    { eu: '46',   us: '12',   uk: '11',  cm: '30.0' }
  ];

  let currentRegUnit = localStorage.getItem('aether_size_unit') || 'EU';
  let selectedRegEu = '42'; // Pre-selected Portugal grail size

  const regGrid = document.getElementById('reg-size-grid');
  const regUnitSwitcher = document.getElementById('reg-unit-switcher');
  const regBadgeText = document.getElementById('reg-size-badge-text');
  const hiddenSizeInput = document.getElementById('selected-size-pref');
  const hiddenUnitInput = document.getElementById('selected-size-unit');

  function renderRegisterSizes() {
    if (!regGrid) return;
    regGrid.innerHTML = '';

    SNEAKER_SIZING_TABLE.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `reg-size-pill ${item.eu === selectedRegEu ? 'active' : ''}`;
      btn.dataset.eu = item.eu;

      let mainVal = '';
      let subVal = '';

      if (currentRegUnit === 'EU') {
        mainVal = item.eu;
        subVal = `US ${item.us}`;
      } else if (currentRegUnit === 'US') {
        mainVal = `US ${item.us}`;
        subVal = `EU ${item.eu}`;
      } else if (currentRegUnit === 'UK') {
        mainVal = `UK ${item.uk}`;
        subVal = `EU ${item.eu}`;
      } else if (currentRegUnit === 'CM') {
        mainVal = `${item.cm} cm`;
        subVal = `EU ${item.eu}`;
      }

      btn.innerHTML = `<span class="size-val">${mainVal}</span><small class="size-sub">${subVal}</small>`;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRegEu = item.eu;
        updateSelectedSizeState(item);
        if (window.soundEngine) window.soundEngine.playClick();
      });

      regGrid.appendChild(btn);
    });

    const activeItem = SNEAKER_SIZING_TABLE.find(s => s.eu === selectedRegEu) || SNEAKER_SIZING_TABLE[6];
    updateSelectedSizeState(activeItem, false);
  }

  function updateSelectedSizeState(item, rerenderGrid = true) {
    if (!item) return;

    if (rerenderGrid && regGrid) {
      regGrid.querySelectorAll('.reg-size-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.eu === item.eu);
      });
    }

    if (regBadgeText) {
      regBadgeText.textContent = `EU ${item.eu} (US ${item.us} • UK ${item.uk} • ${item.cm} cm)`;
    }

    if (hiddenSizeInput) {
      hiddenSizeInput.value = `EU ${item.eu} / US ${item.us}`;
    }

    if (hiddenUnitInput) {
      hiddenUnitInput.value = currentRegUnit;
    }

    localStorage.setItem('aether_preferred_size', `EU ${item.eu} (US ${item.us})`);
    localStorage.setItem('aether_size_unit', currentRegUnit);
  }

  // Setup Unit Switcher Buttons
  if (regUnitSwitcher) {
    regUnitSwitcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
      // sync initial active state with currentRegUnit
      btn.classList.toggle('active', btn.dataset.unit === currentRegUnit);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentRegUnit = btn.dataset.unit;
        regUnitSwitcher.querySelectorAll('.unit-toggle-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        localStorage.setItem('aether_size_unit', currentRegUnit);
        renderRegisterSizes();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  // Initial render on register page
  if (regGrid) {
    renderRegisterSizes();
  }

  // ---------------------------------------------------------------------------
  // 1-Click Instant Login (VIP Collector & Root Admin)
  // ---------------------------------------------------------------------------
  const btnOneClickCollector = document.getElementById('btn-one-click-collector');
  if (btnOneClickCollector) {
    btnOneClickCollector.addEventListener('click', async (e) => {
      e.preventDefault();
      btnOneClickCollector.disabled = true;
      btnOneClickCollector.innerHTML = '<span>⚡ Unlocking Vault...</span>';
      if (window.soundEngine) window.soundEngine.playSwoosh();

      const collectorUser = {
        id: 'usr_vip_002',
        email: 'collector@aetherkicks.com',
        name: 'Matheus Silva VIP',
        full_name: 'Matheus Silva VIP',
        role: 'vip_member',
        tier: 'VIP GRAIL COLLECTOR',
        preferred_size: 'EU 43 (US 9.5)'
      };

      let session = null;
      if (window.AetherDB && typeof window.AetherDB.signSession === 'function') {
        session = await window.AetherDB.signSession(collectorUser);
      } else {
        session = { payload: collectorUser, signature: 'demo_sig', token: 'AK_SESSION' };
      }

      localStorage.setItem('aether_user', JSON.stringify(collectorUser));
      localStorage.setItem('aether_user_session', JSON.stringify(session));

      if (window.soundEngine) window.soundEngine.playSuccess();
      const isPT = (localStorage.getItem('aether_lang') || 'pt') === 'pt';
      if (typeof window.showToast === 'function') {
        window.showToast(isPT ? '⚡ Acesso 1-Clique: Bem-vindo Matheus Silva VIP! A redirecionar...' : '⚡ 1-Click Access: Welcome Matheus Silva VIP! Redirecting...', 'success');
      }

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  }

  // ---------------------------------------------------------------------------
  // AUTH TOAST & RATE LIMITING INFRASTRUCTURE
  // ---------------------------------------------------------------------------
  const getLang = () => localStorage.getItem('aether_lang') || 'pt';

  const triggerToast = (msg, type = 'info') => {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else if (typeof showToast === 'function') {
      showToast(msg, type);
    } else {
      console.log(`[Toast ${type}]`, msg);
    }
  };

  const RATE_LIMIT_KEY = 'aether_login_fails';
  const MAX_FAILS = 5;
  const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  const LOCKOUT_MS = 60 * 1000;    // 60 seconds lockout

  function getLoginFailState() {
    try {
      const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) return { count: 0, firstFailTime: 0, lockUntil: 0 };
      const parsed = JSON.parse(raw);
      return {
        count: parseInt(parsed.count || 0, 10),
        firstFailTime: parseInt(parsed.firstFailTime || 0, 10),
        lockUntil: parseInt(parsed.lockUntil || 0, 10)
      };
    } catch (e) {
      return { count: 0, firstFailTime: 0, lockUntil: 0 };
    }
  }

  function checkLoginRateLimit() {
    const state = getLoginFailState();
    const now = Date.now();
    if (state.lockUntil && state.lockUntil > now) {
      const remainingSec = Math.ceil((state.lockUntil - now) / 1000);
      return { locked: true, remaining: remainingSec };
    }
    return { locked: false, remaining: 0 };
  }

  function recordLoginFail() {
    const state = getLoginFailState();
    const now = Date.now();
    let count = state.count;
    let firstFailTime = state.firstFailTime;

    if (!firstFailTime || (now - firstFailTime) > WINDOW_MS) {
      count = 1;
      firstFailTime = now;
    } else {
      count += 1;
    }

    let lockUntil = 0;
    if (count >= MAX_FAILS) {
      lockUntil = now + LOCKOUT_MS;
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
      count,
      firstFailTime,
      lockUntil
    }));

    return {
      locked: count >= MAX_FAILS,
      count,
      remaining: count >= MAX_FAILS ? 60 : 0
    };
  }

  function clearLoginFails() {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  }

  const REG_THROTTLE_KEY = 'aether_last_reg_submit';
  const REG_THROTTLE_MS = 3000; // 3 seconds burst protection

  function isRegistrationThrottled() {
    try {
      const last = parseInt(sessionStorage.getItem(REG_THROTTLE_KEY) || '0', 10);
      const now = Date.now();
      if (last > 0 && (now - last) < REG_THROTTLE_MS) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  function recordRegistrationSubmit() {
    sessionStorage.setItem(REG_THROTTLE_KEY, Date.now().toString());
  }

  // ---------------------------------------------------------------------------
  // Standard Login Form Submission (Hardened with PBKDF2 & HMAC Sessions)
  // ---------------------------------------------------------------------------
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isPT = getLang() === 'pt';
      const btn = loginForm.querySelector('.btn-auth-submit');

      try {
        const email = (document.getElementById('login-email')?.value || '').trim();
        const pass = (document.getElementById('login-password')?.value || '').trim();

        // 1. Check Rate Limiting Lockout
        const rateLimit = checkLoginRateLimit();
        if (rateLimit.locked) {
          if (window.soundEngine && typeof window.soundEngine.playSecurityAlarm === 'function') {
            window.soundEngine.playSecurityAlarm();
          }
          triggerToast(
            isPT
              ? `⏳ Demasiadas tentativas falhadas. Por favor aguarde ${rateLimit.remaining} segundos.`
              : `⏳ Too many failed attempts. Please wait ${rateLimit.remaining} seconds.`,
            'warning'
          );
          return;
        }

        // 2. Validate Empty Input Fields
        if (!email) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor introduza o seu endereço de email.'
              : '⚠️ Please enter your email.',
            'warning'
          );
          document.getElementById('login-email')?.focus();
          return;
        }

        if (!pass) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor introduza a sua palavra-passe.'
              : '⚠️ Please enter your password.',
            'warning'
          );
          document.getElementById('login-password')?.focus();
          return;
        }

        // 3. Authenticate with AetherDB
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="spinner-inline"></span> ${isPT ? 'A verificar credenciais no Atelier...' : 'Verifying Cryptographic Credentials...'}`;
        }
        if (window.soundEngine) window.soundEngine.playSwoosh();

        let authenticatedUser = null;
        let authResult = null;
        if (window.AetherDB && typeof window.AetherDB.authenticateUser === 'function') {
          authResult = await window.AetherDB.authenticateUser(email, pass, { structured: true });
          if (authResult && authResult.success) {
            authenticatedUser = authResult.user;
          }
        }

        if (authenticatedUser) {
          clearLoginFails();

          const session = authenticatedUser._session || (window.AetherDB ? await window.AetherDB.signSession(authenticatedUser) : null);
          localStorage.setItem('aether_user', JSON.stringify({
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            name: authenticatedUser.full_name || authenticatedUser.name,
            tier: authenticatedUser.role === 'admin' ? 'Root Architect' : 'VIP GRAIL COLLECTOR',
            role: authenticatedUser.role
          }));

          if (session) {
            localStorage.setItem('aether_user_session', JSON.stringify(session));
            if (authenticatedUser.role === 'admin') {
              sessionStorage.setItem('aether_admin_authenticated', 'true');
              sessionStorage.setItem('aether_admin_token', session.token);
              sessionStorage.setItem('aether_admin_user', JSON.stringify(authenticatedUser));
              sessionStorage.setItem('aether_admin_last_activity', Date.now().toString());
            }
          }

          const urlParams = new URLSearchParams(window.location.search);
          const rawRedirect = urlParams.get('redirect');
          const isSafeRedirect = rawRedirect && /^(\/?[a-zA-Z0-9_\-]+\.html(?:[?#][^\s]*)?)$/.test(rawRedirect.trim()) && !rawRedirect.startsWith('//');
          const safeRedirect = isSafeRedirect ? rawRedirect.trim() : null;

          if (window.soundEngine) window.soundEngine.playSuccess();
          const userName = authenticatedUser.full_name || authenticatedUser.name || email.split('@')[0];
          triggerToast(
            isPT
              ? `✨ Bem-vindo de volta, ${userName}! A aceder ao cofre...`
              : `✨ Welcome back, ${userName}! Accessing vault...`,
            'success'
          );

          setTimeout(() => {
            if (authenticatedUser.role === 'admin') {
              window.location.href = 'admin.html';
            } else if (safeRedirect) {
              window.location.href = safeRedirect;
            } else {
              window.location.href = 'index.html';
            }
          }, 900);
        } else {
          // Record failed attempt for rate limiting
          const failStatus = recordLoginFail();

          if (window.soundEngine && typeof window.soundEngine.playSecurityAlarm === 'function') {
            window.soundEngine.playSecurityAlarm();
          } else if (window.soundEngine) {
            window.soundEngine.playClick();
          }

          if (failStatus.locked) {
            triggerToast(
              isPT
                ? `⏳ Demasiadas tentativas falhadas. Por favor aguarde ${failStatus.remaining} segundos.`
                : `⏳ Too many failed attempts. Please wait ${failStatus.remaining} seconds.`,
              'warning'
            );
          } else {
            // Check if email exists in AetherDB to distinguish account not found vs wrong password
            let userExists = false;
            if (window.AetherDB && typeof window.AetherDB.checkUserExists === 'function') {
              userExists = await window.AetherDB.checkUserExists(email);
            } else if (authResult && authResult.reason === 'USER_NOT_FOUND') {
              userExists = false;
            }

            if (!userExists) {
              // Prominent Luxury Toast: Account does not exist
              triggerToast(
                isPT
                  ? '❌ Esta conta não existe no Atelier. Verifique o email ou crie uma nova conta.'
                  : '❌ Account does not exist. Check your email or create an account.',
                'error'
              );
              const emailInput = document.getElementById('login-email');
              if (emailInput) emailInput.focus();
            } else {
              // Prominent Luxury Toast: Password incorrect
              triggerToast(
                isPT
                  ? '❌ Palavra-passe incorreta. Por favor tente novamente.'
                  : '❌ Incorrect password. Please try again.',
                'error'
              );
              const passInput = document.getElementById('login-password');
              if (passInput) {
                passInput.value = '';
                passInput.focus();
              }
            }
          }

          if (btn) {
            btn.disabled = false;
            btn.innerHTML = isPT ? 'Entrar no Cofre / Sign In' : 'Sign In to Vault';
          }
        }
      } catch (err) {
        console.error('[AetherAuth] Sign In error:', err);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = isPT ? 'Entrar no Cofre / Sign In' : 'Sign In to Vault';
        }
        triggerToast(
          isPT
            ? '❌ Erro ao validar credenciais. Por favor tente novamente.'
            : '❌ Error validating credentials. Please try again.',
          'error'
        );
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Register Form Submission (Hardened with PBKDF2 Hashing & Verification)
  // ---------------------------------------------------------------------------
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isPT = getLang() === 'pt';
      const btn = regForm.querySelector('.btn-auth-submit');

      try {
        // 1. Throttle / Burst Protection
        if (isRegistrationThrottled()) {
          triggerToast(
            isPT
              ? '⚠️ Por favor aguarde um momento antes de tentar novamente.'
              : '⚠️ Please wait a moment before trying again.',
            'warning'
          );
          return;
        }

        const name = (document.getElementById('reg-name')?.value || '').trim();
        const tag = (document.getElementById('reg-tag')?.value || '').trim() || `@${(name || 'collector').toLowerCase().replace(/\s+/g, '_')}`;
        const email = (document.getElementById('reg-email')?.value || '').trim();
        const pass = (document.getElementById('reg-password')?.value || '').trim();
        const passConf = (document.getElementById('reg-confirm-password')?.value || '').trim();
        const preferredSize = hiddenSizeInput ? hiddenSizeInput.value : 'EU 42 / US 8.5';

        // 2. Validate Name
        if (!name) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor introduza o seu nome completo.'
              : '⚠️ Please enter your full name.',
            'warning'
          );
          document.getElementById('reg-name')?.focus();
          return;
        }

        // 3. Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor introduza um endereço de email válido.'
              : '⚠️ Please enter a valid email address.',
            'warning'
          );
          document.getElementById('reg-email')?.focus();
          return;
        }

        // 4. Check if Email ALREADY exists in AetherDB
        let emailExists = false;
        if (window.AetherDB && typeof window.AetherDB.checkUserExists === 'function') {
          emailExists = await window.AetherDB.checkUserExists(email);
        }
        if (emailExists) {
          if (window.soundEngine && typeof window.soundEngine.playSecurityAlarm === 'function') {
            window.soundEngine.playSecurityAlarm();
          } else if (window.soundEngine) {
            window.soundEngine.playClick();
          }
          triggerToast(
            isPT
              ? '⚠️ Este email já se encontra registado no Atelier. Por favor inicie sessão.'
              : '⚠️ This email is already registered. Please sign in.',
            'warning'
          );
          document.getElementById('reg-email')?.focus();
          return;
        }

        // 5. Validate Password
        if (!pass) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor introduza uma palavra-passe.'
              : '⚠️ Please enter a password.',
            'warning'
          );
          document.getElementById('reg-password')?.focus();
          return;
        }

        if (pass.length < 6) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ A palavra-passe deve ter pelo menos 6 caracteres.'
              : '⚠️ The password must be at least 6 characters.',
            'warning'
          );
          document.getElementById('reg-password')?.focus();
          return;
        }

        // 6. Validate Password Confirmation
        if (!passConf) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ Por favor confirme a sua palavra-passe.'
              : '⚠️ Please confirm your password.',
            'warning'
          );
          document.getElementById('reg-confirm-password')?.focus();
          return;
        }

        if (pass !== passConf) {
          if (window.soundEngine) window.soundEngine.playClick();
          triggerToast(
            isPT
              ? '⚠️ As palavras-passe não coincidem. Por favor confirme a palavra-passe.'
              : '⚠️ Passwords do not match. Please verify.',
            'warning'
          );
          document.getElementById('reg-confirm-password')?.focus();
          return;
        }

        // All validations passed - record throttle timestamp
        recordRegistrationSubmit();

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="spinner-inline"></span> ${isPT ? 'A criar credenciais PBKDF2 e cofre...' : 'Hashing PBKDF2 Passkey & Creating Vault...'}`;
        }
        if (window.soundEngine) window.soundEngine.playSwoosh();

        let registeredUser = null;
        if (window.AetherDB && typeof window.AetherDB.addUser === 'function') {
          registeredUser = await window.AetherDB.addUser({
            email: email,
            password: pass,
            name: name,
            full_name: name,
            tag: tag,
            role: 'collector',
            preferred_size: preferredSize
          });
        }

        const userProfile = {
          id: (registeredUser && registeredUser.id) || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          email: email,
          name: name,
          full_name: name,
          tag: tag,
          tier: 'NEW SNEAKERHEAD MEMBER',
          role: 'collector',
          preferredSize: preferredSize,
          preferredUnit: currentRegUnit
        };

        const session = window.AetherDB ? await window.AetherDB.signSession(userProfile) : null;
        localStorage.setItem('aether_user', JSON.stringify(userProfile));
        if (session) localStorage.setItem('aether_user_session', JSON.stringify(session));

        if (window.soundEngine) window.soundEngine.playSuccess();
        if (typeof launchConfetti === 'function') launchConfetti();

        triggerToast(
          isPT
            ? '✨ Conta de Colecionador criada com sucesso! A preparar o cofre...'
            : '✨ Collector account created successfully! Preparing vault...',
          'success'
        );

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1100);
      } catch (err) {
        console.error('[AetherAuth] Registration error:', err);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = isPT ? 'Criar Cofre de Colecionador' : 'Create Collector Vault';
        }
        triggerToast(
          isPT
            ? `❌ Erro no registo: ${err.message || 'Falha ao criar conta.'}`
            : `❌ Registration error: ${err.message || 'Failed to create account.'}`,
          'error'
        );
      }
    });
  }
}
