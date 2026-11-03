/**
 * Real Client-Side Video Export Engine
 * Uses canvas.captureStream(30) + MediaRecorder + Web Audio destination track
 * 100% free, zero watermarks, 100% client-side!
 */

import { audioEngine } from './audioEngine';

export class ExportEngine {
  constructor() {
    this.isExporting = false;
    this.shouldCancel = false;
  }

  cancel() {
    this.shouldCancel = true;
    this.isExporting = false;
  }

  async exportVideo(project, renderFrameCallback, onProgress) {
    if (this.isExporting) return;
    this.isExporting = true;
    this.shouldCancel = false;

    const width = project.width || (project.aspectRatio === '9:16' ? 1080 : 1920);
    const height = project.height || (project.aspectRatio === '9:16' ? 1920 : 1080);
    const fps = project.fps || 30;
    const duration = project.duration || 15.0;
    const totalFrames = Math.ceil(duration * fps);

    // Create an off-DOM dedicated export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext('2d');

    // 1. Create MediaStream from canvas
    const videoStream = exportCanvas.captureStream(fps);

    // 2. Mix Web Audio API track if available
    const audioTrack = audioEngine.getMediaStreamTrack();
    if (audioTrack) {
      videoStream.addTrack(audioTrack);
    }

    // Determine supported mime type
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(videoStream, {
      mimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps high-quality bitrate
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    const completionPromise = new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const filename = `${(project.title || 'aethercut_video').toLowerCase().replace(/[^a-z0-9]/g, '_')}_export.webm`;
          
          // Trigger browser download automatically
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          resolve({ blob, url, filename });
        } catch (err) {
          reject(err);
        }
      };

      mediaRecorder.onerror = (e) => reject(e);
    });

    mediaRecorder.start();

    // Start background soundtrack if available
    const bgmClip = project.clips.find(c => c.audio?.sfxType && c.audio.sfxType.includes('Bgm'));
    if (bgmClip) {
      audioEngine.startBgm(bgmClip.audio.sfxType, bgmClip.audio.volume || 0.6);
    }

    const startTime = performance.now();

    // Frame-by-frame timeline progression
    for (let frame = 0; frame <= totalFrames; frame++) {
      if (this.shouldCancel) {
        mediaRecorder.stop();
        audioEngine.stopAll();
        this.isExporting = false;
        throw new Error('Export cancelled by user.');
      }

      const currentTime = frame / fps;

      // Render frame onto the export canvas
      renderFrameCallback(exportCtx, width, height, currentTime, project.clips);

      // Play SFX when playhead hits them
      const sfxClips = project.clips.filter(c => c.trackId === 'A1' && c.audio?.sfxType && !c.audio.sfxType.includes('Bgm'));
      sfxClips.forEach(sfx => {
        if (Math.abs(sfx.startTime - currentTime) < (1 / fps)) {
          audioEngine.playSfx(sfx.audio.sfxType, sfx.audio.volume || 0.8);
        }
      });

      // Update progress
      const percent = Math.min(100, Math.round((frame / totalFrames) * 100));
      const elapsed = (performance.now() - startTime) / 1000;
      const rate = frame / (elapsed || 0.001);
      const remainingFrames = totalFrames - frame;
      const remainingSec = Math.max(0, Math.round(remainingFrames / (rate || 30)));

      if (onProgress) {
        onProgress({
          frame,
          totalFrames,
          percent,
          currentTime,
          remainingSec,
          previewCanvas: exportCanvas
        });
      }

      // Small delay to allow canvas stream capture and UI responsiveness
      await new Promise(r => setTimeout(r, 20));
    }

    audioEngine.stopAll();
    mediaRecorder.stop();
    this.isExporting = false;

    return completionPromise;
  }
}

export const exportEngine = new ExportEngine();

