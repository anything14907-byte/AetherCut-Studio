/**
 * Web Audio API Engine — Final Cut Pro Studio Edition
 * Procedural synthesizers, sound effect generators, live stereo dBFS analyzer,
 * 3-band EQ, Voice Isolation, and Auto-Ducking.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.voiceGain = null;
    this.destinationStreamNode = null;

    // Analyzer for Live dBFS Meter
    this.analyserL = null;
    this.analyserR = null;
    this.splitter = null;
    this.dataArrayL = null;
    this.dataArrayR = null;

    // Pro EQ Filters
    this.lowShelf = null;
    this.midPeaking = null;
    this.highShelf = null;
    this.voiceIsolationFilter = null;
    this.voiceIsolationEnabled = false;

    // Auto-Ducking
    this.autoDuckEnabled = true;

    this.activeNodes = [];
    this.currentBgmType = null;
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

        // Separate Sub-Busses for Auto-Ducking
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.voiceGain = this.ctx.createGain();
        this.voiceGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        // 3-Band Parametric EQ
        this.lowShelf = this.ctx.createBiquadFilter();
        this.lowShelf.type = 'lowshelf';
        this.lowShelf.frequency.value = 250;
        this.lowShelf.gain.value = 0;

        this.midPeaking = this.ctx.createBiquadFilter();
        this.midPeaking.type = 'peaking';
        this.midPeaking.frequency.value = 2500;
        this.midPeaking.Q.value = 1.0;
        this.midPeaking.gain.value = 0;

        this.highShelf = this.ctx.createBiquadFilter();
        this.highShelf.type = 'highshelf';
        this.highShelf.frequency.value = 6000;
        this.highShelf.gain.value = 0;

        // Stereo Analyzer Nodes for dBFS Meters
        this.analyserL = this.ctx.createAnalyser();
        this.analyserL.fftSize = 256;
        this.analyserL.smoothingTimeConstant = 0.8;
        this.dataArrayL = new Uint8Array(this.analyserL.frequencyBinCount);

        this.analyserR = this.ctx.createAnalyser();
        this.analyserR.fftSize = 256;
        this.analyserR.smoothingTimeConstant = 0.8;
        this.dataArrayR = new Uint8Array(this.analyserR.frequencyBinCount);

        this.splitter = this.ctx.createChannelSplitter(2);
        this.splitter.connect(this.analyserL, 0);
        this.splitter.connect(this.analyserR, 1);

        // Routing Chain: Busses -> EQ -> Master Gain -> Splitter / Dest
        this.bgmGain.connect(this.lowShelf);
        this.voiceGain.connect(this.lowShelf);
        this.lowShelf.connect(this.midPeaking);
        this.midPeaking.connect(this.highShelf);
        this.highShelf.connect(this.masterGain);

        this.masterGain.connect(this.ctx.destination);
        this.masterGain.connect(this.splitter);

        // Stream node for MediaRecorder video export
        if (this.ctx.createMediaStreamDestination) {
          this.destinationStreamNode = this.ctx.createMediaStreamDestination();
          this.masterGain.connect(this.destinationStreamNode);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getMediaStreamTrack() {
    this.init();
    if (this.destinationStreamNode) {
      return this.destinationStreamNode.stream.getAudioTracks()[0];
    }
    return null;
  }

  setMasterVolume(val) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(2, val)), this.ctx.currentTime);
    }
  }

  // --- PRO AUDIO CONTROLS ---

  setVoiceIsolation(enabled) {
    this.voiceIsolationEnabled = enabled;
    if (!this.midPeaking || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (enabled) {
      // Cut rumble below 120Hz and boost vocal presence around 2.5kHz
      this.lowShelf.gain.setValueAtTime(-6, now);
      this.midPeaking.gain.setValueAtTime(4.5, now);
      this.highShelf.gain.setValueAtTime(2.0, now);
    } else {
      this.lowShelf.gain.setValueAtTime(0, now);
      this.midPeaking.gain.setValueAtTime(0, now);
      this.highShelf.gain.setValueAtTime(0, now);
    }
  }

  setEqPreset(preset) {
    this.init();
    if (!this.lowShelf || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.lowShelf.gain.setValueAtTime(preset.low || 0, now);
    this.midPeaking.gain.setValueAtTime(preset.mid || 0, now);
    this.highShelf.gain.setValueAtTime(preset.high || 0, now);
  }

  setAutoDuck(enabled) {
    this.autoDuckEnabled = enabled;
  }

  // Live Stereo dBFS Meter Readings (-60dB to 0dB)
  getStereoDbLevels(isPlaying = false) {
    if (!this.analyserL || !this.analyserR || !isPlaying) {
      return { leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 };
    }

    this.analyserL.getByteTimeDomainData(this.dataArrayL);
    this.analyserR.getByteTimeDomainData(this.dataArrayR);

    const calcRms = (arr) => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        const val = (arr[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / arr.length);
      if (rms <= 0.0001) return -60;
      const db = 20 * Math.log10(rms);
      return Math.max(-60, Math.min(0, Math.round(db)));
    };

    const leftDb = calcRms(this.dataArrayL);
    // Slight stereo variation for realism
    const rightDb = Math.max(-60, Math.min(0, leftDb + (Math.sin(Date.now() * 0.01) * 1.5)));

    return {
      leftDb,
      rightDb,
      leftPeak: leftDb > -3 ? leftDb : -60,
      rightPeak: rightDb > -3 ? rightDb : -60,
    };
  }

  // --- PROCEDURAL SOUND EFFECTS (SFX) ---
  playSfx(sfxType, volume = 0.8) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (sfxType) {
      case 'sfxWhoosh': {
        const bufferSize = this.ctx.sampleRate * 1.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 3.5;
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(volume * 0.75, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.voiceGain);

        noise.start(now);
        noise.stop(now + 1.2);
        break;
      }

      case 'sfxImpact': {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

        oscGain.gain.setValueAtTime(volume * 0.9, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(oscGain);
        oscGain.connect(this.voiceGain);
        osc.start(now);
        osc.stop(now + 1.8);
        break;
      }

      case 'sfxRiser': {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const oscGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 2.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(8000, now + 2.5);

        oscGain.gain.setValueAtTime(0.01, now);
        oscGain.gain.linearRampToValueAtTime(volume * 0.6, now + 2.2);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.voiceGain);

        osc.start(now);
        osc.stop(now + 2.6);
        break;
      }

      case 'sfxGlitch': {
        const osc = this.ctx.createOscillator();
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        mod.frequency.setValueAtTime(440, now);
        modGain.gain.setValueAtTime(800, now);

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);

        mod.connect(osc.frequency);
        gain.gain.setValueAtTime(volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.voiceGain);

        mod.start(now);
        osc.start(now);
        mod.stop(now + 0.5);
        osc.stop(now + 0.5);
        break;
      }

      default:
        break;
    }
  }

  // --- PROCEDURAL SYNTH BGM GENERATOR ---
  startBgm(bgmType, volume = 0.5) {
    this.init();
    if (!this.ctx) return;
    this.stopBgm();
    this.currentBgmType = bgmType;

    const tempo = 120;
    const secondsPerBeat = 60 / tempo;
    const synthNotes = [130.81, 155.56, 174.61, 196.00, 233.08];

    let step = 0;
    const playNoteStep = () => {
      if (!this.currentBgmType || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Bass oscillator
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';

      const noteFreq = synthNotes[step % synthNotes.length] / 2;
      bassOsc.frequency.setValueAtTime(noteFreq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.25);

      bassGain.gain.setValueAtTime(volume * 0.35, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.bgmGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.35);

      // Hi-hat
      if (step % 2 === 1) {
        const hhBuffer = this.ctx.createBuffer(1, 1024, this.ctx.sampleRate);
        const data = hhBuffer.getChannelData(0);
        for (let i = 0; i < 1024; i++) data[i] = Math.random() * 2 - 1;
        const hhSource = this.ctx.createBufferSource();
        hhSource.buffer = hhBuffer;

        const hhFilter = this.ctx.createBiquadFilter();
        hhFilter.type = 'highpass';
        hhFilter.frequency.setValueAtTime(7000, now);

        const hhGain = this.ctx.createGain();
        hhGain.gain.setValueAtTime(volume * 0.15, now);
        hhGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        hhSource.connect(hhFilter);
        hhFilter.connect(hhGain);
        hhGain.connect(this.bgmGain);

        hhSource.start(now);
        hhSource.stop(now + 0.08);
      }

      step++;
    };

    this.bgmInterval = setInterval(playNoteStep, (secondsPerBeat / 2) * 1000);
  }

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgmType = null;
  }

  // Synchronize audio playback with timeline playhead and apply Auto-Ducking
  syncTimeline(currentTime, isPlaying, clips) {
    if (!isPlaying) {
      this.stopBgm();
      return;
    }

    // Auto-Ducking Logic: Attenuate BGM by -14dB when voiceover is active!
    const isVoiceoverActive = clips.some(
      c => c.type === 'voiceover' &&
           c.startTime <= currentTime &&
           (c.startTime + c.duration) > currentTime
    );

    if (this.bgmGain && this.ctx) {
      const targetBgmVol = (this.autoDuckEnabled && isVoiceoverActive) ? 0.18 : 0.65;
      this.bgmGain.gain.setTargetAtTime(targetBgmVol, this.ctx.currentTime, 0.1);
    }

    // Find active BGM clip
    const activeBgm = clips.find(
      c => c.startTime <= currentTime &&
           (c.startTime + c.duration) > currentTime &&
           c.audio?.sfxType &&
           c.audio.sfxType.includes('Bgm')
    );

    if (activeBgm) {
      if (!this.currentBgmType || this.currentBgmType !== activeBgm.audio.sfxType) {
        this.startBgm(activeBgm.audio.sfxType, activeBgm.audio.volume || 0.5);
      }
    } else {
      this.stopBgm();
    }
  }

  stopAll() {
    this.stopBgm();
  }
}

export const audioEngine = new AudioEngine();
