/* ==========================================================================
   Web Audio API Sound Synthesizer for Portfolio
   Synthesizes Heavy Rain, Rolling Thunder, Screaming Crows, & Soaring Eagles!
   ========================================================================== */

class AudioEffectEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.rainGain = null;
    this.rainSource = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn("Web Audio API not supported on this browser", e);
    }
  }

  ensureContextUnlocked() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.rainGain) {
      this.rainGain.gain.value = 0;
    }
    return this.isMuted;
  }

  /* ------------------------------------------------------------------------
     1. Heavy Rain Atmosphere Synthesis
     ------------------------------------------------------------------------ */
  startRainSound() {
    if (this.isMuted || !this.audioCtx || this.rainSource) return;
    this.ensureContextUnlocked();

    const ctx = this.audioCtx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise formula for realistic rain patter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.rainSource = ctx.createBufferSource();
    this.rainSource.buffer = buffer;
    this.rainSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.rainGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.0);

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(ctx.destination);

    this.rainSource.start();
  }

  stopRainSound() {
    if (this.rainGain && this.audioCtx) {
      this.rainGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (this.rainSource) {
          try { this.rainSource.stop(); } catch(e){}
          this.rainSource = null;
        }
      }, 550);
    }
  }

  /* ------------------------------------------------------------------------
     2. Rolling Thunder Crack
     ------------------------------------------------------------------------ */
  playThunderSound() {
    if (this.isMuted || !this.audioCtx) return;
    this.ensureContextUnlocked();

    const now = this.audioCtx.currentTime;
    const duration = 2.6;
    const ctx = this.audioCtx;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + duration);
    filter.Q.setValueAtTime(5.0, now);

    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.9, now + 0.07);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    subOsc.connect(subGain);
    subGain.connect(gainNode);

    gainNode.connect(ctx.destination);

    noise.start(now);
    subOsc.start(now);

    noise.stop(now + duration);
    subOsc.stop(now + duration);
  }

  /* ------------------------------------------------------------------------
     3. Screaming Crow Caws
     ------------------------------------------------------------------------ */
  playCrowSound() {
    if (this.isMuted || !this.audioCtx) return;
    this.ensureContextUnlocked();

    const now = this.audioCtx.currentTime;
    const cawDelays = [0.15, 0.45, 0.85];
    cawDelays.forEach(delay => {
      this.synthesizeSingleCaw(now + delay);
    });
  }

  synthesizeSingleCaw(startTime) {
    const duration = 0.30;
    const ctx = this.audioCtx;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(680, startTime);
    osc1.frequency.exponentialRampToValueAtTime(360, startTime + duration);

    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(340, startTime);
    osc2.frequency.exponentialRampToValueAtTime(180, startTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, startTime);
    filter.frequency.linearRampToValueAtTime(480, startTime + duration);
    filter.Q.setValueAtTime(3.8, startTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, startTime);
    gainNode.gain.linearRampToValueAtTime(0.38, startTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  /* ------------------------------------------------------------------------
     4. Pleasant Soaring Eagle Call
     ------------------------------------------------------------------------ */
  playEagleSound() {
    if (this.isMuted || !this.audioCtx) return;
    this.ensureContextUnlocked();

    const now = this.audioCtx.currentTime;
    const duration = 0.95;
    const ctx = this.audioCtx;

    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(1800, now);
    carrier.frequency.exponentialRampToValueAtTime(3100, now + 0.25);
    carrier.frequency.exponentialRampToValueAtTime(1400, now + duration);

    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(120, now);
    modulator.frequency.linearRampToValueAtTime(60, now + duration);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(420, now);
    modGain.gain.exponentialRampToValueAtTime(40, now + duration);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(4.0, now);
    filter.gain.setValueAtTime(12, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.38, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    carrier.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    modulator.start(now);
    carrier.start(now);

    modulator.stop(now + duration);
    carrier.stop(now + duration);
  }
}

// Global Instance
window.audioEngine = new AudioEffectEngine();
