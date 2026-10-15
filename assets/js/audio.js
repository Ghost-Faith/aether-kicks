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
}

window.soundEngine = new SoundEngine();
