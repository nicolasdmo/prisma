/* ============================================================
   PRISMA — Audio Engine (Web Audio API)
   Genera música ambiente que evoluciona con las respuestas
   ============================================================ */

class PrismaAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverb = null;
    this.isPlaying = false;
    this.nodes = [];
    this.moodA = 0; // 0-1: cuánto domina el polo A (interior/analítico/racional/planificador)
    this.moodB = 0; // 0-1: cuánto domina el polo B
    this.currentEje = 1;
    this._rafId = null;
  }

  /* ---- Init ---- */
  async init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(0, this.ctx.currentTime);
      this.reverb = await this._createReverb();
      this.delay = this._createDelay();
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 2000;
      this.filter.Q.value = 0.8;

      // Chain: master → filter → reverb → delay → destination
      this.master.connect(this.filter);
      this.filter.connect(this.reverb);
      this.reverb.connect(this.delay.input);
      this.delay.output.connect(this.ctx.destination);
      // Dry signal too
      this.filter.connect(this.ctx.destination);

      return true;
    } catch (e) {
      console.warn('Audio no disponible:', e);
      return false;
    }
  }

  /* ---- Create Reverb (Convolution) ---- */
  async _createReverb() {
    const convolver = this.ctx.createConvolver();
    const duration = 3;
    const decay = 2;
    const length = this.ctx.sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    convolver.buffer = impulse;

    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.35;
    convolver.connect(reverbGain);

    const wet = { connect: (dest) => reverbGain.connect(dest) };
    const dryConvolver = { connect: (dest) => { convolver.connect(dest); } };

    // Wrapper
    const wrapper = this.ctx.createGain();
    wrapper.gain.value = 1;
    wrapper.connect(convolver);
    convolver.connect(reverbGain);

    return wrapper;
  }

  /* ---- Create Delay ---- */
  _createDelay() {
    const delayNode = this.ctx.createDelay(1);
    delayNode.delayTime.value = 0.38;
    const feedbackGain = this.ctx.createGain();
    feedbackGain.gain.value = 0.25;
    const outputGain = this.ctx.createGain();
    outputGain.gain.value = 0.2;

    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(outputGain);

    return { input: delayNode, output: outputGain };
  }

  /* ---- Start ---- */
  start() {
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this._buildAmbience();
    // Fade in
    this.master.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 3);
  }

  /* ---- Stop ---- */
  stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
    setTimeout(() => {
      this.nodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch(e){} });
      this.nodes = [];
      this.isPlaying = false;
    }, 2200);
  }

  /* ---- Build ambience layers ---- */
  _buildAmbience() {
    this._addDrone();
    this._addPad();
    this._addHarmonic();
    this._addSubtle();
    this._startLFO();
  }

  /* Base drone — fundamental note shifts with mood */
  _addDrone() {
    const freq = this._getMoodFreq();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    this.nodes.push(osc);
    this._dronGain = gain;
    this._droneOsc = osc;
  }

  /* Pad — slow attack warm sound */
  _addPad() {
    const freq = this._getMoodFreq() * 1.5;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'triangle';
    osc2.type = 'sawtooth';
    osc1.frequency.value = freq;
    osc2.frequency.value = freq * 1.01; // slight detune for warmth
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 4);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.master);
    osc1.start(); osc2.start();
    this.nodes.push(osc1, osc2);
    this._padGain = gain;
  }

  /* Harmonic overtone */
  _addHarmonic() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = this._getMoodFreq() * 2;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    this.nodes.push(osc);
    this._harmonicOsc = osc;
    this._harmonicGain = gain;
  }

  /* Subtle high texture */
  _addSubtle() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = this._getMoodFreq() * 3;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    this.nodes.push(osc);
    this._subtleOsc = osc;
  }

  /* LFO — slow filter sweep creates movement */
  _startLFO() {
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08; // very slow
    lfoGain.gain.value = 600;
    lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    lfo.start();
    this.nodes.push(lfo);
  }

  /* ---- Get frequency based on mood ---- */
  _getMoodFreq() {
    // Base frequencies for each eje + pole combination
    // Interior/Analítico → A2 (110Hz), deep and grounded
    // Exterior/Intuitivo → G3 (196Hz), bright and open
    const freqs = {
      1: { A: 110, B: 164.81 }, // Energía: Interior=A2, Exterior=E3
      2: { A: 130.81, B: 174.61 }, // Percepción: Analítico=C3, Intuitivo=F3
      3: { A: 138.59, B: 155.56 }, // Decisión: Racional=C#3, Empático=Eb3
      4: { A: 110, B: 196 }        // Estilo: Planificador=A2, Flexible=G3
    };
    const eje = freqs[this.currentEje] || freqs[1];
    const ratio = this.moodB / Math.max(1, this.moodA + this.moodB);
    return eje.A + (eje.B - eje.A) * ratio;
  }

  /* ---- Update mood based on answers ---- */
  updateMood(polo, eje) {
    if (!this.ctx || !this.isPlaying) return;
    this.currentEje = eje;
    if (polo === 'A') this.moodA++;
    else this.moodB++;

    const now = this.ctx.currentTime;
    const targetFreq = this._getMoodFreq();
    const ratio = this.moodB / Math.max(1, this.moodA + this.moodB);

    // Smoothly shift drone frequency
    if (this._droneOsc) {
      this._droneOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + 2);
    }
    if (this._harmonicOsc) {
      this._harmonicOsc.frequency.exponentialRampToValueAtTime(targetFreq * 2, now + 2);
    }
    if (this._subtleOsc) {
      this._subtleOsc.frequency.exponentialRampToValueAtTime(targetFreq * 3, now + 2);
    }

    // Shift filter cutoff (A answers = darker, B answers = brighter)
    const cutoff = 800 + ratio * 2400;
    this.filter.frequency.exponentialRampToValueAtTime(cutoff, now + 2);

    // Shift reverb wet level (A=more reverb=more space, B=drier=more social)
    // (simplified via master gain variation)
  }

  /* ---- Sound effects ---- */
  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSuccess() {
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + i * 0.12;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  playTransition() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  /* ---- Volume ---- */
  setVolume(v) {
    if (!this.ctx) return;
    this.master.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.5);
  }

  /* ---- Resume context (browsers require user gesture) ---- */
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

// Global instance
window.prismaAudio = new PrismaAudio();
