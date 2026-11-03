/**
 * Web Speech API Voiceover Service
 * Synthesizes speech locally in the browser with pitch/rate/voice controls.
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSupported = !!this.synth;
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  speak(text, { voiceURI, rate = 1.0, pitch = 1.0, onEnd, onBoundary } = {}) {
    if (!this.synth) return;
    this.synth.cancel(); // cancel any active utterance

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (voiceURI) {
      const voice = this.voices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
      if (voice) utterance.voice = voice;
    }

    if (onBoundary) {
      utterance.onboundary = (e) => onBoundary(e);
    }
    if (onEnd) {
      utterance.onend = () => onEnd();
    }

    this.synth.speak(utterance);
    return utterance;
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Estimate duration of speech text based on word count and rate
  estimateDuration(text, rate = 1.0) {
    const wordCount = text.trim().split(/\s+/).length;
    // Average speech rate is ~140 words per minute (2.33 words/second)
    const baseSeconds = wordCount / (2.33 * (rate || 1.0));
    return Math.max(1.5, Math.round(baseSeconds * 10) / 10);
  }
}

export const speechService = new SpeechService();

