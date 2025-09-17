// @ts-nocheck
// Menu music controller: plays only in non-game states and exposes bass amplitude via CSS variable --title-glow.

class MenuMusicController {
  private audioCtx: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private el: HTMLAudioElement | null = null;
  private analyser: AnalyserNode | null = null;
  private data: Uint8Array | null = null;
  private rafId: number | null = null;
  private active = false;
  private started = false;
  private gainNode: GainNode | null = null; // master menu music gain (post-analyser)
  private readonly baseGain = 0.6; // historical baseline used previously
  private volumePercent = 141; // default ~ +3 dB (10^(3/20) ≈ 1.4125 => 141%)

  constructor() {
    const stored = parseFloat(localStorage.getItem('tvsl_musicVolPct') || '');
    if (!isNaN(stored) && stored >= 0 && stored <= 150) this.volumePercent = stored;
  }

  setVolumePercent(p: number) {
    const clamped = Math.min(150, Math.max(0, p));
    this.volumePercent = clamped;
    localStorage.setItem('tvsl_musicVolPct', String(clamped));
    this.updateGain();
  }

  getVolumePercent(): number { return this.volumePercent; }

  getVolumeDb(): number {
    if (this.volumePercent <= 0) return -Infinity;
    const linear = this.volumePercent / 100;
    return 20 * Math.log10(linear);
  }

  private updateGain() {
    if (this.gainNode) {
      const linear = this.volumePercent / 100; // 100% == baseline (0 dB rel.)
      this.gainNode.gain.value = this.baseGain * linear;
    }
  }

  init() {
    if (this.started) return;
    this.started = true;
    // Create element (use public path)
  // Respect Vite base path so production subfolder works
  const base = (import.meta as any).env?.BASE_URL || (window as any).__vite_base__ || '/';
  this.el = new Audio(base + 'DasEpicMusic.ogg');
    this.el.loop = true;
    this.el.preload = 'auto';
    this.el.crossOrigin = 'anonymous';
    console.log('[MenuMusic] init created element, waiting for gesture');
    // Autoplay policies require user gesture; listen to several possible interactions.
    const gestures = ['click','pointerdown','keydown','touchstart'];
    const once = (ev)=>{
      gestures.forEach(g=>document.removeEventListener(g, once));
      this.userActivate();
    };
    gestures.forEach(g=>document.addEventListener(g, once, { passive:true }));
    // If already user-interacted before init (edge case), try immediate activation after short delay
    setTimeout(()=>{
      if (!this.audioCtx && document.visibilityState === 'visible') {
        // Attempt silent start; will fail quietly if not allowed
        this.userActivate();
      }
    }, 800);
  }

  private userActivate = () => {
    if (!this.el) return;
    try {
      console.log('[MenuMusic] userActivate');
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!this.source) { // guard against duplicate creation which throws InvalidStateError
        this.source = this.audioCtx.createMediaElementSource(this.el);
      }
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256; // small for performance
      this.data = new Uint8Array(this.analyser.frequencyBinCount);
      this.gainNode = this.audioCtx.createGain();
      this.updateGain();
      this.source.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      const attemptPlay = () => {
        this.el.play().then(()=>{
          console.log('[MenuMusic] playback started');
          if (!this.rafId) this.loop();
        }).catch(err=>{
          console.warn('[MenuMusic] play blocked, will retry on next gesture', err);
        });
      };
      if (this.el.readyState >= 2) attemptPlay(); else {
        this.el.addEventListener('canplay', attemptPlay, { once:true });
      }
      this.active = true;
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  }

  playIfMenu() {
    if (!this.el) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(()=>console.log('[MenuMusic] context resumed')).catch(()=>{});
    }
    if (this.el && this.el.paused) {
      this.el.play().then(()=>console.log('[MenuMusic] resumed')).catch(err=>{
        console.warn('[MenuMusic] resume blocked', err);
      });
    }
    this.active = true;
  }

  fadeOutAndPause(duration = 1000) {
    if (!this.audioCtx || !this.el || !this.source) return;
    if (!this.active) return;
    const startVol = (this.audioCtx as any).currentGainValue || 0.6;
    const start = performance.now();
    const el = this.el;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const vol = (1 - k) * startVol;
      el.volume = vol;
      if (k < 1) requestAnimationFrame(step); else { el.pause(); el.volume = startVol; }
    };
    requestAnimationFrame(step);
    this.active = false;
  }

  loop() {
    if (!this.analyser || !this.data) return;
    this.analyser.getByteFrequencyData(this.data);
    // Bass bins: take first ~6 bins
    let bass = 0;
    for (let i = 0; i < 6; i++) bass += this.data[i];
    bass /= (6 * 255); // 0..1
  // Boost & shape amplitude (0..1): scale, soft knee, ease out near 1
  let boosted = bass * 1.6; // amplify
  // Soft clip
  if (boosted > 1) boosted = 1 - Math.exp(-3 * (boosted - 1)); // gentle compression above 1
  boosted = Math.min(1, boosted);
  // Non-linear to increase mid sensitivity (cubic ease-out variant)
  const shaped = 1 - Math.pow(1 - boosted, 3);
  const prev = parseFloat(document.documentElement.style.getPropertyValue('--title-glow') || '0');
  const smoothed = prev + (shaped - prev) * 0.25; // faster follow
  document.documentElement.style.setProperty('--title-glow', smoothed.toFixed(3));
  // Bright emphasis variable (stronger near 1)
  const bright = Math.pow(smoothed, 1.6);
  document.documentElement.style.setProperty('--title-glow-bright', bright.toFixed(3));
    // If context gets suspended (tab switch) resume on visibility
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(()=>{});
    }
    this.rafId = requestAnimationFrame(()=>this.loop());
  }
}

export const menuMusic = new MenuMusicController();
