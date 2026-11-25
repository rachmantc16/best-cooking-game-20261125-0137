// Dapur Ceria — tiny WebAudio sound cues, synthesised so the game needs no
// audio files. The context is created lazily on the first user gesture.

let context = null;

function ensureContext() {
  if (context === null) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    context = new AudioCtor();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

function tone(freq, at, dur, type = 'sine', gain = 0.08) {
  const ctx = ensureContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const start = ctx.currentTime + at;
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur);
}

export const sfx = {
  pick() { tone(520, 0, 0.07, 'triangle'); },
  plated() { tone(660, 0, 0.08, 'triangle'); tone(880, 0.06, 0.1, 'triangle'); },
  ding() { tone(1175, 0, 0.22, 'sine', 0.1); },
  served() { tone(523, 0, 0.1); tone(659, 0.09, 0.1); tone(784, 0.18, 0.16); },
  wrong() { tone(160, 0, 0.18, 'sawtooth', 0.05); },
  miss() { tone(320, 0, 0.14, 'sine'); tone(240, 0.12, 0.2, 'sine'); },
  bell() { tone(1568, 0, 0.12, 'sine', 0.05); },
  burn() { tone(110, 0, 0.25, 'sawtooth', 0.04); },
};
