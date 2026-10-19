/**
 * Web Audio API Sound Synthesizer
 * Provides spatial UI sound effects without requiring external audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.hasInteracted = false;

    // Check localStorage
    const saved = localStorage.getItem('aether_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }

    // Init audio context on first user gesture
    const unlock = () => {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasInteracted = true;
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('aether_sound_enabled', this.enabled);
    if (this.enabled) {
      this.playBeep(620, 0.08, 'sine');
    }
    return this.enabled;
  }

  playBeep(freq = 440, duration = 0.08, type = 'sine', gainVal = 0.12) {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context might fail silently
    }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.playBeep(850, 0.04, 'triangle', 0.08);
    } catch(e) {}
  }

  playSwoosh() {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch(e) {}
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => {
          this.playBeep(freq, 0.22, 'sine', 0.1);
        }, i * 75);
      });
    } catch(e) {}
  }

  playSwitch() {
    this.playBeep(420, 0.06, 'triangle', 0.06);
  }

  playLaserVerify() {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      // High-tech rising laser chirp followed by harmonic chime
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Shimmering harmonic chime
      [880, 1108.73, 1318.51, 1760].forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.28, 'sine', 0.06);
        }, 80 + idx * 55);
      });
    } catch(e) {}
  }

  playSecurityAlarm() {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      // Jarring harsh double buzz for invalid passkey or brute-force lockout
      const now = this.ctx.currentTime;
      [0, 0.14].forEach(offset => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now + offset);
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch(e) {}
  }

  playVaultUnlock() {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      // Deep mechanical vault unbolt thump + metallic release click
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      setTimeout(() => {
        this.playBeep(1200, 0.05, 'triangle', 0.09);
      }, 120);
    } catch(e) {}
  }
}

window.soundEngine = new SoundEngine();
