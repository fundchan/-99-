// Simple 8-bit sound synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime = 0) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playClick = () => {
  playTone(400, 'square', 0.05);
};

export const playCorrect = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Arpeggio C-E-G (C Major)
  playTone(523.25, 'square', 0.1, 0);       // C5
  playTone(659.25, 'square', 0.1, 0.1);     // E5
  playTone(783.99, 'square', 0.2, 0.2);     // G5
};

export const playWrong = () => {
  const ctx = getAudioContext();
  // Descending low tone
  playTone(150, 'sawtooth', 0.2, 0);
  playTone(100, 'sawtooth', 0.3, 0.1);
};