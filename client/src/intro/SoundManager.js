/**
 * SoundManager — generates soft paper sounds via Web Audio API.
 * No external audio files required. Muted by default.
 * Users must interact with the page before audio context can start.
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = true;
  }

  _init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      console.warn('[SoundManager] Web Audio API not supported.');
    }
  }

  /**
   * Generates a short filtered-noise burst that resembles a paper rustle.
   * @param {number} durationSec - Duration of the sound in seconds
   * @param {number} volume - Gain multiplier (0–1)
   */
  _playNoise(durationSec = 0.25, volume = 0.12) {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Band-pass filter centred around 2.5 kHz for a papery timbre
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 0.6;

    // Short amplitude envelope: quick attack, exponential decay
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(now);
    source.stop(now + durationSec);
  }

  /** Soft swish — envelope opens */
  playEnvelopeOpen() {
    this._playNoise(0.4, 0.1);
  }

  /** Gentle crinkle — paper unfolds */
  playPaperUnfold() {
    this._playNoise(0.55, 0.08);
    setTimeout(() => this._playNoise(0.3, 0.06), 300);
  }

  /** Toggle mute state. Returns new muted value. */
  toggle() {
    this.muted = !this.muted;
    if (!this.muted) this._init();
    return this.muted;
  }

  get isMuted() {
    return this.muted;
  }
}

// Singleton — shared across the entire intro
export const soundManager = new SoundManager();
