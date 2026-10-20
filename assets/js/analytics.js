/**
 * AETHER KICKS - Market Price Analytics & Drop Raffle Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initDropCountdown();
  initRaffleSystem();
  initAnalyticsChart();
});

// Live Drop Countdown Timer
function initDropCountdown() {
  const hoursEl = document.getElementById('drop-hours');
  const minsEl = document.getElementById('drop-mins');
  const secsEl = document.getElementById('drop-secs');
  const msEl = document.getElementById('drop-ms');

  if (!hoursEl) return;

  // Target time: 14 hours, 32 minutes from now
  const targetTime = Date.now() + (14 * 3600 + 32 * 60 + 15) * 1000;
  let hasTriggered10mAlert = false;

  function updateTimer() {
    const remaining = Math.max(0, targetTime - Date.now());
    const h = Math.floor(remaining / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remaining % (1000 * 60)) / 1000);
    const ms = Math.floor((remaining % 1000) / 10);

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
    if (msEl) msEl.textContent = String(ms).padStart(2, '0');

    // Section 4 Atelier Preference: Deadstock Drop 10-Minute Priority Notification
    if (remaining <= 600000 && !hasTriggered10mAlert) {
      hasTriggered10mAlert = true;
      if (localStorage.getItem('aether_drop_notifications') === 'true' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('AETHER KICKS // LIVE DROP ALERT', {
            body: 'Atenção Colecionador: O drop exclusivo de grails inicia em menos de 10 minutos!',
            icon: 'assets/images/jordan-chicago.png'
          });
        } catch(e) {}
      }
    }

    if (remaining > 0) {
      requestAnimationFrame(updateTimer);
    }
  }

  requestAnimationFrame(updateTimer);
}

// Interactive Raffle Registration System
function initRaffleSystem() {
  const enterBtn = document.getElementById('btn-enter-raffle');
  const modal = document.getElementById('raffle-modal');
  const backdrop = document.getElementById('modal-backdrop');

  if (!enterBtn) return;

  enterBtn.addEventListener('click', () => {
    if (modal && backdrop) {
      modal.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundEngine) window.soundEngine.playSwoosh();
    }
  });

  const form = document.getElementById('raffle-entry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-inline"></span> Securing Verified Raffle Entry...`;

      setTimeout(() => {
        const ticketNum = 'RAF-' + Math.floor(10000 + Math.random() * 90000) + '-SNKRS';
        const modalBody = document.getElementById('raffle-modal-body');
        if (modalBody) {
          modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
              <div class="success-icon-wrap" style="margin: 0 auto 16px;">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style="font-size: 1.8rem; margin-bottom: 6px;">Raffle Ticket Issued!</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 18px;">Your entry has been cryptographically signed on the Aether Drop ledger.</p>
              
              <div style="background: rgba(255,255,255,0.05); border: 1px dashed var(--theme-primary); border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">CRYPTOGRAPHIC TICKET ID</div>
                <div style="font-size: 1.5rem; font-weight: 900; font-family: var(--font-mono); color: var(--theme-primary); margin: 6px 0;">${ticketNum}</div>
                <div style="font-size: 0.8rem; color: #4ade80;">STATUS: CONFIRMED FOR LIVE DRAW</div>
              </div>

              <button class="btn-primary" onclick="closeRaffleModal()">
                Done
              </button>
            </div>
          `;
        }

        if (window.soundEngine) window.soundEngine.playSuccess();
        launchConfetti();
      }, 1200);
    });
  }
}

function closeRaffleModal() {
  const modal = document.getElementById('raffle-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal && backdrop) {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Market Price History Interactive Chart
function initAnalyticsChart() {
  const points = [
    { text: "Jan 2020 • Baseline Valuation: $220 • Mint Condition", year: "2020", price: 220, change: "Baseline" },
    { text: "Nov 2021 • Sotheby's Auction Milestone: $310 (+40.9%)", year: "2021", price: 310, change: "+40.9%" },
    { text: "Aug 2022 • Deadstock Archive Resale: $290 (-6.4%)", year: "2022", price: 290, change: "-6.4%" },
    { text: "May 2023 • European Collector Liquidity: $380 (+31.0%)", year: "2023", price: 380, change: "+31.0%" },
    { text: "Jan 2024 • Paris Fashion Week Hype: $360 (-5.2%)", year: "2024", price: 360, change: "-5.2%" },
    { text: "Sep 2025 • NFC Cryptoseal Genesis: $460 (+27.7%)", year: "2025", price: 460, change: "+27.7%" },
    { text: "Live 2026 • Certified Vault Median: $540 (+17.4% ALL-TIME HIGH)", year: "2026", price: 540, change: "+17.4% ATH" }
  ];

  const tooltip = document.getElementById('chart-tooltip');
  const dots = document.querySelectorAll('.chart-dot');

  function showTooltip(dot, idx) {
    const pt = points[idx];
    if (!tooltip || !pt) return;

    tooltip.innerHTML = `
      <div style="font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 7px;">
        <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--theme-primary, #dc2626); box-shadow: 0 0 8px var(--theme-primary, #dc2626);"></span>
        <span>${pt.text}</span>
      </div>
    `;
    tooltip.classList.add('active');
    tooltip.style.opacity = '1';

    // Calculate position relative to container
    const container = tooltip.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
      const dotCenterX = (dotRect.left - containerRect.left) + dotRect.width / 2;
      const dotCenterY = (dotRect.top - containerRect.top);

      tooltip.style.left = `${dotCenterX}px`;
      tooltip.style.top = `${dotCenterY - 14}px`;
      tooltip.style.transform = 'translate(-50%, -100%)';
    }

    // Highlight active dot with pulsing glow
    dots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');

    if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
      window.soundEngine.playClick();
    }
  }

  function hideTooltip(dot) {
    if (tooltip) {
      tooltip.classList.remove('active');
      tooltip.style.opacity = '0';
    }
    if (dot) dot.classList.remove('active');
  }

  dots.forEach((dot, index) => {
    const idx = parseInt(dot.dataset.index !== undefined ? dot.dataset.index : index, 10);

    dot.addEventListener('mouseenter', () => showTooltip(dot, idx));
    dot.addEventListener('mouseleave', () => hideTooltip(dot));
    dot.addEventListener('focus', () => showTooltip(dot, idx));
    dot.addEventListener('blur', () => hideTooltip(dot));

    // Touch support for mobile devices
    dot.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      showTooltip(dot, idx);
    }, { passive: true });

    dot.addEventListener('pointerdown', () => {
      showTooltip(dot, idx);
    });
  });

  // Tap anywhere outside chart to dismiss tooltip on mobile
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.chart-svg-container')) {
      if (tooltip) {
        tooltip.classList.remove('active');
        tooltip.style.opacity = '0';
      }
      dots.forEach(d => d.classList.remove('active'));
    }
  }, { passive: true });

  // Timeframe filter pills interactivity
  const filterPills = document.querySelectorAll('.analytics-filter-pills .btn-hud-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (window.soundEngine) window.soundEngine.playClick();

      const timeframe = pill.textContent.trim().toLowerCase();
      const statVal = document.querySelector('.analytics-stats-row .stat-box:nth-child(2) .stat-val');
      if (statVal) {
        if (timeframe.includes('30')) statVal.textContent = '+6.4% ↗';
        else if (timeframe.includes('90')) statVal.textContent = '+14.2% ↗';
        else if (timeframe.includes('1')) statVal.textContent = '+28.5% ↗';
        else statVal.textContent = '+145.4% ↗';
      }
    });
  });
}

window.initAnalyticsChart = initAnalyticsChart;
window.closeRaffleModal = closeRaffleModal;
