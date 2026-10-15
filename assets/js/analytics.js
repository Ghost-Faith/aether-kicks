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
    { month: 'Oct 25', price: 420 },
    { month: 'Dec 25', price: 445 },
    { month: 'Feb 26', price: 430 },
    { month: 'Apr 26', price: 470 },
    { month: 'Jun 26', price: 460 },
    { month: 'Aug 26', price: 495 },
    { month: 'Oct 26', price: 540 }
  ];

  const tooltip = document.getElementById('chart-tooltip');
  const dots = document.querySelectorAll('.chart-dot');

  dots.forEach(dot => {
    dot.addEventListener('mouseenter', (e) => {
      const idx = dot.dataset.index;
      const pt = points[idx];
      if (tooltip && pt) {
        tooltip.innerHTML = `<strong>${pt.month}</strong>: $${pt.price} USD`;
        tooltip.style.opacity = '1';
        const containerRect = tooltip.parentElement ? tooltip.parentElement.getBoundingClientRect() : { left: 0, top: 0 };
        const rect = dot.getBoundingClientRect();
        tooltip.style.left = `${(rect.left - containerRect.left) + rect.width / 2 - 40}px`;
        tooltip.style.top = `${(rect.top - containerRect.top) - 36}px`;
      }
      if (window.soundEngine) window.soundEngine.playClick();
    });

    dot.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.opacity = '0';
    });
  });
}

window.closeRaffleModal = closeRaffleModal;
