/**
 * Web Audio API Engine
 * Procedural synthesizers, sound effect generators, and timeline audio mixer
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.destinationStreamNode = null;
    this.activeNodes = [];
    this.currentBgmType = null;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

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

  // --- PROCEDURAL SOUND EFFECTS (SFX) ---
  playSfx(sfxType, volume = 0.8) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (sfxType) {
      case 'sfxWhoosh': {
        // Bandpass noise sweep
        const bufferSize = this.ctx.sampleRate * 1.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
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
        gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 1.2);
        break;
      }

      case 'sfxImpact': {
        // Sub bass pitch drop + boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

        oscGain.gain.setValueAtTime(volume * 0.9, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.8);
        break;
      }

      case 'sfxRiser': {
        // Ascending saw synth riser
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
        oscGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.6);
        break;
      }

      case 'sfxGlitch': {
        // Digital chirp static
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
        gain.connect(this.masterGain);

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
    const synthNotes = [130.81, 155.56, 174.61, 196.00, 233.08]; // C minor pentatonic

    let step = 0;
    const playNoteStep = () => {
      if (!this.currentBgmType || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Bass note on each beat
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
      bassGain.connect(this.masterGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.35);

      // Hi-hat noise on half-beats
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
        hhGain.connect(this.masterGain);

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

  // Synchronize audio playback with timeline playhead
  syncTimeline(currentTime, isPlaying, audioClips) {
    if (!isPlaying) {
      this.stopBgm();
      return;
    }

    // Find active audio clips at currentTime
    const activeBgm = audioClips.find(
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

