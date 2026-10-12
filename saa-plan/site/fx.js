// Celebration effects: canvas confetti/fireworks + Web Audio sounds. No dependencies.
window.FX = (() => {
  let fxOn = true, soundOn = true;
  let cv = null, ctx = null, W = 0, H = 0, raf = 0;
  let parts = [], rockets = [];
  let actx = null, bEl = null, bT = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["#ff9900", "#ffc061", "#0972d3", "#5aa9ff", "#8a3ffc", "#b58cff", "#1fbf5f", "#ff5c8a", "#ffe066"];
  const R = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const motion = () => fxOn && !reduce.matches;

  // ---------- canvas ----------
  function ensure() {
    if (cv) return;
    cv = document.createElement("canvas");
    cv.className = "fx-canvas";
    document.body.appendChild(cv);
    ctx = cv.getContext("2d");
    size();
    addEventListener("resize", size);
  }
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function center(el) {
    if (el && el.getBoundingClientRect) {
      const r = el.getBoundingClientRect();
      if (r.width || r.height) return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: W / 2, y: H / 2 };
  }

  function confetti(x, y, n, o = {}) {
    const { speed = 7, angle = -Math.PI / 2, spread = Math.PI * 2, gravity = 0.22, ttl = [50, 90], size = [4, 8] } = o;
    for (let i = 0; i < n; i++) {
      const a = angle + R(-spread / 2, spread / 2), v = speed * R(0.45, 1.1);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag: 0.986, life: 0,
        ttl: R(ttl[0], ttl[1]), c: pick(COLORS), s: R(size[0], size[1]), rot: R(0, 6.28), vr: R(-0.3, 0.3), rect: Math.random() < 0.65 });
    }
    run();
  }
  function sparks(x, y, n, c) {
    for (let i = 0; i < n; i++) {
      const a = R(0, 6.28), v = R(1.5, 6.5);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.06, drag: 0.975, life: 0,
        ttl: R(55, 95), c: Math.random() < 0.75 ? c : "#ffffff", s: R(2, 3.4), rot: 0, vr: 0, rect: false });
    }
  }
  function rocket(x, delay) {
    setTimeout(() => {
      ensure();
      rockets.push({ x, y: H + 10, vx: R(-0.8, 0.8), vy: -Math.sqrt(2 * 0.18 * R(H * 0.45, H * 0.75)), c: pick(COLORS) });
      if (soundOn) noise(0, 0.35, 0.025, 2500);
      run();
    }, delay);
  }
  function cannons(n) {
    const speed = Math.sqrt(0.5 * H * 0.85);
    const o = { speed, spread: 0.55, gravity: 0.25, ttl: [100, 150], size: [5, 9] };
    confetti(0, H, n, { ...o, angle: -Math.PI / 3 });
    confetti(W, H, n, { ...o, angle: (-Math.PI * 2) / 3 });
  }

  function run() {
    if (raf) return;
    const step = () => {
      ctx.clearRect(0, 0, W, H);
      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += 0.18;
        ctx.fillStyle = r.c;
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(r.x - r.vx * 3, r.y - r.vy * 3, 1.8, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.6, 0, 6.28); ctx.fill();
        if (r.vy >= -0.8) {
          sparks(r.x, r.y, 90, r.c);
          if (soundOn) noise(0, 0.5, 0.08, 700);
          return false;
        }
        return true;
      });
      parts = parts.filter(p => {
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
        const a = 1 - p.life / p.ttl;
        if (a <= 0 || p.y > H + 40) return false;
        ctx.globalAlpha = Math.min(1, a * 1.6);
        ctx.fillStyle = p.c;
        if (p.rect) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillRect(-p.s / 2, (-p.s / 4) * Math.abs(Math.cos(p.rot * 2)) - 0.5, p.s, (p.s / 2) * Math.abs(Math.cos(p.rot * 2)) + 1);
          ctx.restore();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s / 2, 0, 6.28); ctx.fill();
        }
        return true;
      });
      ctx.globalAlpha = 1;
      if (parts.length || rockets.length) raf = requestAnimationFrame(step);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    };
    raf = requestAnimationFrame(step);
  }

  // ---------- sound ----------
  function ac() {
    if (!actx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      actx = new C();
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(f, t, d, { type = "sine", vol = 0.1, to = null } = {}) {
    const a = ac(); if (!a) return;
    const t0 = a.currentTime + t, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d * 0.6);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + d + 0.02);
  }
  function noise(t, d, vol, freq) {
    const a = ac(); if (!a) return;
    const len = Math.floor(a.sampleRate * d), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf; f.type = "lowpass"; f.frequency.value = freq; g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination);
    src.start(a.currentTime + t);
  }
  const SND = {
    pop: () => tone(R(520, 700), 0, 0.09, { to: 1300, vol: 0.07 }),
    chime: () => { tone(880, 0, 0.3, { vol: 0.08 }); tone(1318.5, 0.09, 0.4, { vol: 0.07 }); },
    fanfare: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, i === 3 ? 0.7 : 0.22, { type: "triangle", vol: 0.1 })),
    finale: () => {
      SND.fanfare();
      [523.25, 659.25, 783.99].forEach(f => tone(f, 0.55, 1.2, { type: "triangle", vol: 0.06 }));
      tone(1046.5, 0.55, 1.3, { vol: 0.06 });
    },
    timer: () => { tone(784, 0, 0.35, { vol: 0.09 }); tone(1046.5, 0.25, 0.5, { vol: 0.08 }); tone(784, 0.8, 0.35, { vol: 0.09 }); tone(1046.5, 1.05, 0.5, { vol: 0.08 }); },
    clean: () => { tone(660, 0, 0.15, { vol: 0.06 }); tone(990, 0.08, 0.25, { vol: 0.06 }); },
    miss: () => tone(330, 0, 0.22, { type: "triangle", vol: 0.06, to: 220 })
  };
  const sound = n => { if (soundOn && SND[n]) SND[n](); };

  // ---------- banner ----------
  function banner(title, sub = "", kind = "day") {
    if (!bEl) {
      bEl = document.createElement("div");
      bEl.setAttribute("role", "status");
      document.body.appendChild(bEl);
    }
    bEl.className = "fx-banner k-" + kind;
    bEl.innerHTML = `<div class="b-t">${title}</div>${sub ? `<div class="b-s">${sub}</div>` : ""}`;
    void bEl.offsetWidth;
    bEl.classList.add("show");
    clearTimeout(bT);
    bT = setTimeout(() => bEl.classList.remove("show"), kind === "all" ? 5500 : kind === "week" ? 4500 : kind === "info" ? 2600 : 3200);
  }

  return {
    tick(el) { sound("pop"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 22, { speed: 6, spread: Math.PI * 1.2, ttl: [35, 65], size: [3, 6] }); },
    group(el) { sound("chime"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 70, { speed: 10, spread: Math.PI * 1.4, ttl: [50, 90] }); },
    day() { sound("fanfare"); if (!motion()) return; ensure(); cannons(110); for (let i = 0; i < 5; i++) rocket(R(W * 0.15, W * 0.85), 300 + i * 260); },
    week() { sound("finale"); if (!motion()) return; ensure(); for (let k = 0; k < 3; k++) setTimeout(() => cannons(140), k * 700); for (let i = 0; i < 10; i++) rocket(R(W * 0.1, W * 0.9), 200 + i * 220); },
    all() { sound("finale"); setTimeout(() => sound("finale"), 1600); if (!motion()) return; ensure(); for (let k = 0; k < 5; k++) setTimeout(() => cannons(160), k * 650); for (let i = 0; i < 20; i++) rocket(R(W * 0.08, W * 0.92), 150 + i * 190); },
    small(el) { sound("clean"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 40, { speed: 8, spread: Math.PI * 1.3 }); },
    banner, sound,
    unlock() { if (soundOn) ac(); },
    set(o) { if ("fx" in o) fxOn = !!o.fx; if ("sound" in o) soundOn = !!o.sound; }
  };
})();
