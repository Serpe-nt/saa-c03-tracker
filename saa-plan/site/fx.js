// Celebration effects: canvas confetti/fireworks + Web Audio sounds + banner, toast and badges. No dependencies.
// A ladder, from small to large: step → block → quiz unlocked → day → week → all, plus a sound and stars on every quiz
// answer and bigger bursts at each streak mark.
window.FX = (() => {
  let fxOn = true, soundOn = true;
  let cv = null, ctx = null, W = 0, H = 0, raf = 0;
  let parts = [], rockets = [], rings = [], flashes = [];
  let actx = null, out = null, bEl = null, vEl = null, bT = 0, tEl = null, tT = 0, bdWrap = null, glowT = 0;
  const bdQ = [];   // badges waiting for a free place
  const MAX_PARTS = 6000;   // the biggest celebrations stay smooth on a slow machine
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["#ff9900", "#ffc061", "#0972d3", "#5aa9ff", "#8a3ffc", "#b58cff", "#1fbf5f", "#ff5c8a", "#ffe066"];
  const GOLD = ["#ffe066", "#ffc061", "#ff9900", "#fff3b0", "#ffffff"];
  const HOT = ["#ffe066", "#ff9900", "#ff7a00", "#e5383b", "#ffffff"];    // a run of 5 or more
  const EPIC = ["#b58cff", "#8a3ffc", "#ff5c8a", "#ffe066", "#ffffff"];   // a run of 20 or more
  const R = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const motion = () => fxOn && !reduce.matches;
  // A modal dialog sits in the browser's top layer, above everything else on the page:
  // whatever must show while one is open (the quiz) has to live inside it. With two open
  // (the break reminder over a quiz), the later one in the page is the one on top.
  const host = () => { const d = document.querySelectorAll("dialog[open]"); return d.length ? d[d.length - 1] : document.body; };

  // ---------- canvas ----------
  function ensure() {
    if (!cv) {
      cv = document.createElement("canvas");
      cv.className = "fx-canvas";
      ctx = cv.getContext("2d");
      addEventListener("resize", size);
    }
    const h = host();
    if (cv.parentNode !== h) { h.appendChild(cv); size(); }
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

  // shapes: "rect" (paper), "dot", "star"; a particle with ch draws that character (an emoji)
  function confetti(x, y, n, o = {}) {
    const { speed = 7, angle = -Math.PI / 2, spread = Math.PI * 2, gravity = 0.22, ttl = [50, 90], size = [4, 8], shapes = ["rect", "rect", "dot"], colors = COLORS } = o;
    n = Math.min(n, MAX_PARTS - parts.length);
    for (let i = 0; i < n; i++) {
      const a = angle + R(-spread / 2, spread / 2), v = speed * R(0.45, 1.1);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag: 0.986, life: 0,
        ttl: R(ttl[0], ttl[1]), c: pick(colors), s: R(size[0], size[1]), rot: R(0, 6.28), vr: R(-0.3, 0.3), shape: pick(shapes) });
    }
    run();
  }
  const stars = (x, y, n, o = {}) => confetti(x, y, n, { speed: 8, ttl: [40, 75], size: [7, 13], gravity: 0.16, shapes: ["star"], colors: GOLD, ...o });
  function sparks(x, y, n, c, speed = 6.5) {
    n = Math.min(n, MAX_PARTS - parts.length);
    for (let i = 0; i < n; i++) {
      const a = R(0, 6.28), v = R(1.5, speed);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.06, drag: 0.975, life: 0,
        ttl: R(55, 95), c: Math.random() < 0.75 ? c : "#ffffff", s: R(2, 3.4), rot: 0, vr: 0, shape: "dot" });
    }
    run();
  }
  // an expanding ring where something was finished
  function ring(x, y, c, delay = 0) {
    setTimeout(() => { ensure(); rings.push({ x, y, r: 8, c, life: 0, ttl: 30 }); run(); }, delay);
  }
  // characters falling from the top of the screen
  function rain(chars, n) {
    n = Math.min(n, MAX_PARTS - parts.length);
    for (let i = 0; i < n; i++) {
      parts.push({ x: R(0, W), y: R(-H * 0.6, -20), vx: R(-0.6, 0.6), vy: R(2, 5), g: 0.03, drag: 1, life: 0,
        ttl: R(150, 240), c: "#fff", s: R(18, 30), rot: R(-0.4, 0.4), vr: R(-0.03, 0.03), ch: pick(chars) });
    }
    run();
  }
  // big: a firework of the top rungs, with a second colour, a ring and glitter, and a louder bang
  function rocket(x, delay, big = false) {
    setTimeout(() => {
      ensure();
      rockets.push({ x, y: H + 10, vx: R(-0.8, 0.8), vy: -Math.sqrt(2 * 0.18 * R(H * (big ? 0.5 : 0.45), H * (big ? 0.85 : 0.75))), c: pick(COLORS), c2: pick(COLORS), big });
      if (soundOn) noise(0, 0.35, 0.025, 2500);
      run();
    }, delay);
  }
  function cannons(n) {
    const speed = Math.sqrt(0.5 * H * 0.85);
    const o = { speed, spread: 0.55, gravity: 0.25, ttl: [100, 150], size: [5, 9], shapes: ["rect", "rect", "dot", "star"] };
    confetti(0, H, n, { ...o, angle: -Math.PI / 3 });
    confetti(W, H, n, { ...o, angle: (-Math.PI * 2) / 3 });
  }
  // run fn after ms, on a canvas in whatever is on top by then
  const later = (ms, fn) => setTimeout(() => { if (!motion()) return; ensure(); fn(); }, ms);
  // a soft glow over the whole screen, fading out (rgb = "r,g,b"). Gentle and never more than two a second.
  function flash(rgb, peak = 0.3, delay = 0) {
    later(delay, () => { flashes.push({ rgb, peak, life: 0, ttl: 34 }); run(); });
  }
  // a fountain of confetti from the bottom edge for ms milliseconds
  function fountain(x, ms, delay = 0) {
    later(delay, () => {
      const end = Date.now() + ms;
      const id = setInterval(() => {
        if (Date.now() > end || !motion()) return clearInterval(id);
        ensure();
        confetti(x, H + 4, 5, { speed: Math.sqrt(2 * 0.24 * H * R(0.7, 1)), spread: 0.36, gravity: 0.24, ttl: [90, 140], size: [5, 9], shapes: ["rect", "rect", "dot", "star"] });
      }, 40);
    });
  }
  // The open dialog's edge lights up (a long run of right answers). A box-shadow, not a transform:
  // a transform would move the fixed layers inside the dialog (canvas, badges) with it.
  function glow(c) {
    const h = host();
    if (h === document.body) return;
    h.style.setProperty("--fx-glow", c);
    h.classList.remove("fx-glow"); void h.offsetWidth; h.classList.add("fx-glow");
    clearTimeout(glowT);
    glowT = setTimeout(() => h.classList.remove("fx-glow"), 1300);
  }
  function starPath(r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
    ctx.closePath(); ctx.fill();
  }

  function run() {
    if (raf) return;
    const step = () => {
      ctx.clearRect(0, 0, W, H);
      flashes = flashes.filter(f => {
        f.life++;
        const a = f.peak * (1 - f.life / f.ttl) ** 2;
        if (f.life >= f.ttl) return false;
        const x = W / 2, y = H * 0.4, g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(W, H) * 0.8);
        g.addColorStop(0, `rgba(${f.rgb},1)`); g.addColorStop(1, `rgba(${f.rgb},0)`);
        ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        return true;
      });
      rings = rings.filter(g => {
        g.life++; g.r += 5.5 * (1 - g.life / g.ttl) + 1;
        const a = 1 - g.life / g.ttl;
        if (a <= 0) return false;
        ctx.globalAlpha = a * 0.8; ctx.strokeStyle = g.c; ctx.lineWidth = 1 + 4 * a;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 6.28); ctx.stroke();
        return true;
      });
      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += 0.18;
        ctx.fillStyle = r.c;
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(r.x - r.vx * 3, r.y - r.vy * 3, 1.8, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.6, 0, 6.28); ctx.fill();
        if (r.vy >= -0.8) {
          if (r.big) {
            sparks(r.x, r.y, 130, r.c, 8.5); sparks(r.x, r.y, 50, r.c2, 5);
            rings.push({ x: r.x, y: r.y, r: 8, c: r.c, life: 0, ttl: 34 });
            stars(r.x, r.y, 12, { speed: 5, gravity: 0.07, ttl: [50, 90], size: [4, 8] });
          } else sparks(r.x, r.y, 90, r.c);
          if (soundOn) noise(0, r.big ? 0.8 : 0.5, r.big ? 0.1 : 0.08, r.big ? 520 : 700);
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
        if (p.ch) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.font = `${p.s}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(p.ch, 0, 0);
          ctx.restore();
        } else if (p.shape === "rect") {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillRect(-p.s / 2, (-p.s / 4) * Math.abs(Math.cos(p.rot * 2)) - 0.5, p.s, (p.s / 2) * Math.abs(Math.cos(p.rot * 2)) + 1);
          ctx.restore();
        } else if (p.shape === "star") {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); starPath(p.s / 2); ctx.restore();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s / 2, 0, 6.28); ctx.fill();
        }
        return true;
      });
      ctx.globalAlpha = 1;
      if (parts.length || rockets.length || rings.length || flashes.length) raf = requestAnimationFrame(step);
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
      // a limiter in front of the speakers: the top rungs stack many notes, bangs and drums at once
      out = actx.createDynamicsCompressor();
      out.threshold.value = -8; out.knee.value = 4; out.ratio.value = 12; out.attack.value = 0.003; out.release.value = 0.2;
      out.connect(actx.destination);
    }
    if (actx.state !== "running") Promise.resolve(actx.resume()).catch(() => {});   // iOS also says "interrupted" after a call or the app in the background
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
    o.connect(g).connect(out);
    o.start(t0); o.stop(t0 + d + 0.02);
  }
  function noise(t, d, vol, freq, type = "lowpass") {
    const a = ac(); if (!a) return;
    const len = Math.floor(a.sampleRate * d), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf; f.type = type; f.frequency.value = freq; g.gain.value = vol;
    src.connect(f).connect(g).connect(out);
    src.start(a.currentTime + t);
  }
  // A pentatonic scale from C5: step i of a day plays note i, so the sound climbs as the day fills up.
  const PENTA = [0, 2, 4, 7, 9];
  const hz = i => 523.25 * 2 ** ((PENTA[i % 5] + 12 * Math.floor(i / 5)) / 12);
  // building blocks of the bigger sounds: a bass drum, a snare roll that swells, a held major chord, notes running up
  const boom = (t, vol = 0.2) => { tone(120, t, 0.5, { vol, to: 45 }); noise(t, 0.22, 0.05, 260); };
  const roll = (t, d, vol = 0.05) => { for (let s = 0; s < d; s += 0.055) noise(t + s, 0.05, vol * (0.35 + 0.65 * s / d), 4200); };
  const chord = (t, d, root = 523.25, vol = 0.045) => [1, 1.26, 1.498, 2].forEach(m => tone(root * m, t, d, { type: "triangle", vol }));
  const glitter = (t, from = 7, n = 8) => { for (let j = 0; j < n; j++) tone(hz(Math.min(from, 9) + j % 7), t + j * 0.045, 0.12, { vol: 0.028 }); };
  // a run of right answers: 1 up to 3, 5, 10, 15, 20, 30 in a row
  const tier = n => n >= 30 ? 6 : n >= 20 ? 5 : n >= 15 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : 1;
  const SND = {
    pop: () => tone(R(520, 700), 0, 0.09, { to: 1300, vol: 0.07 }),
    note: (i = 0) => { const k = Math.max(0, Math.min(i, 12)); tone(hz(k), 0, 0.14, { type: "triangle", vol: 0.09 }); tone(hz(k) * 2, 0.045, 0.2, { vol: 0.035 }); },
    chime: () => { tone(880, 0, 0.3, { vol: 0.08 }); tone(1318.5, 0.09, 0.4, { vol: 0.07 }); },
    block: () => { [0, 2, 3, 5].forEach((k, j) => tone(hz(k), j * 0.075, j === 3 ? 0.55 : 0.17, { type: "triangle", vol: 0.09 })); tone(hz(5) * 2, 0.3, 0.5, { vol: 0.03 }); },
    unlock: () => { tone(440, 0, 0.28, { to: 880, vol: 0.07 }); tone(1318.5, 0.22, 0.5, { vol: 0.07 }); tone(1760, 0.34, 0.5, { vol: 0.04 }); },
    // a right answer: a bright rising pair that climbs a note with each answer of the run (n = the run now)
    right: (n = 1) => {
      const f = hz(Math.max(0, Math.min(n - 1, 10))) / 2;
      tone(f, 0, 0.1, { type: "triangle", vol: 0.08 }); tone(f * 1.5, 0.065, 0.2, { type: "triangle", vol: 0.08 });
      if (n >= 5) tone(f * 3, 0.1, 0.22, { vol: 0.03 });
    },
    // a wrong answer: a low "uh-oh" going down
    wrong: () => { tone(233, 0, 0.14, { type: "square", vol: 0.032, to: 208 }); tone(175, 0.13, 0.3, { type: "square", vol: 0.032, to: 131 }); },
    // a run of 3 or more broken: a crack and a falling whistle after the "uh-oh"
    broke: () => { noise(0.42, 0.3, 0.05, 2500, "highpass"); tone(880, 0.42, 0.55, { vol: 0.045, to: 110 }); },
    // a streak mark: the arpeggio grows with the tier, then glitter, a drum and a chord
    combo: (n = 3) => {
      const t = tier(n), k = Math.min(Math.floor(n / 3), 5), m = 3 + Math.min(t, 4);
      for (let j = 0; j < m; j++) tone(hz(k + j), j * 0.07, j === m - 1 ? 0.35 : 0.1, { type: "triangle", vol: 0.08 });
      if (t >= 2) glitter(m * 0.07, k + 5, 3 + t);
      if (t >= 3) { boom(0, 0.14 + t * 0.02); chord(m * 0.07, 0.5 + t * 0.15, hz(k) / 2, 0.035); }
      if (t >= 5) { roll(0.5, 0.4, 0.04); boom(0.9, 0.22); chord(0.9, 1.1, hz(k), 0.035); }
    },
    fanfare: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, i === 3 ? 0.7 : 0.22, { type: "triangle", vol: 0.1 })),
    finale: () => {
      SND.fanfare();
      [523.25, 659.25, 783.99].forEach(f => tone(f, 0.55, 1.2, { type: "triangle", vol: 0.06 }));
      tone(1046.5, 0.55, 1.3, { vol: 0.06 });
    },
    // the top rungs: a day, a week, the whole plan. Each longer and fuller than the one before.
    day: () => {
      boom(0); SND.fanfare();
      chord(0.5, 1.5); tone(130.81, 0.5, 1.5, { type: "triangle", vol: 0.08 }); boom(0.5, 0.16);
      glitter(0.6, 7, 9);
    },
    week: () => {
      roll(0, 0.9);
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, 0.9 + i * 0.1, i === 4 ? 0.9 : 0.2, { type: "triangle", vol: 0.1 }));
      boom(0.9, 0.24); boom(1.4, 0.2);
      chord(1.4, 2); tone(130.81, 1.4, 2, { type: "triangle", vol: 0.09 }); tone(65.41, 1.4, 2, { type: "triangle", vol: 0.07 });
      glitter(1.5, 7, 11); glitter(2.3, 9, 8);
    },
    all: () => {
      roll(0, 1.3, 0.06); boom(1.3, 0.26);
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => tone(f, 1.3 + i * 0.12, i === 7 ? 1.2 : 0.22, { type: "triangle", vol: 0.1 }));
      boom(2.26, 0.24);
      chord(2.26, 2.6, 523.25, 0.05); tone(130.81, 2.26, 2.6, { type: "triangle", vol: 0.1 }); tone(65.41, 2.26, 2.6, { type: "triangle", vol: 0.08 });
      glitter(2.4, 7, 12); glitter(3.2, 9, 10);
      roll(3.9, 0.7, 0.05); boom(4.6, 0.26);
      chord(4.6, 2.8, 783.99, 0.04); chord(4.6, 2.8, 523.25, 0.04); glitter(4.7, 10, 12);
    },
    timer: () => { tone(784, 0, 0.35, { vol: 0.09 }); tone(1046.5, 0.25, 0.5, { vol: 0.08 }); tone(784, 0.8, 0.35, { vol: 0.09 }); tone(1046.5, 1.05, 0.5, { vol: 0.08 }); },
    // the break has run past 10 minutes: an insistent double knock, three times
    nag: () => { for (let k = 0; k < 3; k++) { tone(988, k * 0.42, 0.12, { type: "square", vol: 0.05 }); tone(740, k * 0.42 + 0.14, 0.16, { type: "square", vol: 0.05 }); } },
    level: () => { [0, 2, 4, 5, 7].forEach((k, j) => tone(hz(k + 5), j * 0.07, j === 4 ? 0.6 : 0.15, { type: "triangle", vol: 0.09 })); tone(hz(12) * 2, 0.36, 0.7, { vol: 0.035 }); },
    clean: () => { tone(660, 0, 0.15, { vol: 0.06 }); tone(990, 0.08, 0.25, { vol: 0.06 }); },
    miss: () => tone(330, 0, 0.22, { type: "triangle", vol: 0.06, to: 220 })
  };
  const sound = (n, arg) => { if (soundOn && SND[n]) SND[n](arg); };

  // ---------- banner (centre of the screen) and toast (a short line above the buttons) ----------
  // The top rungs (day, week, all) stay up longer, carry a big icon that stamps in, and dim the page around them
  // (the veil, an effect: only with motion). Returns how long the banner stays, so what comes next can wait for it.
  const BANNER_MS = { all: 9000, week: 6500, day: 4600, block: 2300, info: 2600 };
  const TOP = { day: 1, week: 1, all: 1 };
  function banner(title, sub = "", kind = "day", icon = "") {
    if (!bEl) { bEl = document.createElement("div"); bEl.setAttribute("role", "status"); }
    if (!vEl) { vEl = document.createElement("div"); vEl.setAttribute("aria-hidden", "true"); }
    if (bEl.parentNode !== host()) host().appendChild(bEl);
    const ms = BANNER_MS[kind] || 3200, veil = TOP[kind] && motion();
    if (veil && vEl.parentNode !== host()) host().appendChild(vEl);
    vEl.className = "fx-veil k-" + kind;
    bEl.className = "fx-banner k-" + kind;
    bEl.innerHTML = `${icon ? `<div class="b-i">${icon}</div>` : ""}<div class="b-t">${title}</div>${sub ? `<div class="b-s">${sub}</div>` : ""}`;
    void bEl.offsetWidth;
    bEl.classList.add("show");
    if (veil) vEl.classList.add("show");
    clearTimeout(bT);
    bT = setTimeout(() => { bEl.classList.remove("show"); vEl.classList.remove("show"); }, ms);
    return ms;
  }
  function toast(html, kind = "") {
    if (!tEl) { tEl = document.createElement("div"); tEl.setAttribute("role", "status"); }
    if (tEl.parentNode !== host()) host().appendChild(tEl);
    tEl.className = "fx-toast" + (kind ? " k-" + kind : "");
    tEl.innerHTML = html;
    void tEl.offsetWidth;
    tEl.classList.add("show");
    clearTimeout(tT);
    tT = setTimeout(() => tEl.classList.remove("show"), 2100);
  }
  // A badge drops in at the top of the screen: right answers in a row, a record, a level, a badge earned.
  // Two at most are on screen; the rest wait their turn, so each one is seen for its full three seconds.
  // tier: bronze | silver | gold | epic | level. Like the banner, it carries information, so it shows with
  // effects off too (without the stars).
  function badge(icon, title, sub = "", tier = "gold") {
    bdQ.push([icon, title, sub, tier]);
    bdNext();
  }
  function bdNext() {
    if (!bdWrap) { bdWrap = document.createElement("div"); bdWrap.className = "fx-badges"; bdWrap.setAttribute("role", "status"); }
    // the badges on screen belonged to the dialog that has closed: don't bring them back over the page
    if (bdWrap.parentNode !== host()) { bdWrap.replaceChildren(); host().appendChild(bdWrap); }
    while (bdQ.length && bdWrap.querySelectorAll(".fx-badge:not(.out)").length < 2) bdShow(...bdQ.shift());
  }
  function bdShow(icon, title, sub, tier) {
    const el = document.createElement("div");
    el.className = "fx-badge k-" + tier;
    el.innerHTML = `<span class="bd-i">${icon}</span><span class="bd-x"><span class="bd-t">${title}</span>${sub ? `<span class="bd-s">${sub}</span>` : ""}</span>`;
    bdWrap.appendChild(el);
    // stars burst from the medal once it has landed
    setTimeout(() => {
      if (!el.isConnected || !motion()) return;
      ensure();
      const p = center(el.querySelector(".bd-i"));
      ring(p.x, p.y, tier === "epic" ? "#b58cff" : "#ffe066");
      stars(p.x, p.y, tier === "epic" || tier === "level" ? 26 : 14, { speed: 6.5, gravity: 0.14, ttl: [30, 60], size: [5, 11], colors: tier === "epic" ? ["#b58cff", "#8a3ffc", "#ffe066", "#ffffff"] : GOLD });
    }, 420);
    setTimeout(() => { el.classList.add("out"); bdNext(); }, 3000);
    setTimeout(() => el.remove(), 3500);
  }

  return {
    // one step done. n = how many steps of the day are done now (the note climbs); big = a long step such as a lab or a lecture
    step(el, { n = 1, big = false } = {}) {
      sound("note", n - 1);
      if (!motion()) return;
      ensure();
      const p = center(el);
      ring(p.x, p.y, "#5fd37a");
      confetti(p.x, p.y, big ? 70 : 36, { speed: big ? 10.5 : 7.5, spread: Math.PI * 1.3, ttl: [40, 80], size: [3, 7], shapes: ["rect", "rect", "dot", "star"] });
      if (big) { ring(p.x, p.y, "#ffc061", 140); stars(p.x, p.y, 16, { speed: 9 }); rocket(R(W * 0.3, W * 0.7), 180); }
    },
    // a block of the day done (a lecture, its labs, a build…)
    block(el) {
      sound("block");
      if (!motion()) return;
      ensure();
      const p = center(el);
      ring(p.x, p.y, "#ff9900"); ring(p.x, p.y, "#ffe066", 160);
      stars(p.x, p.y, 28, { speed: 11 });
      cannons(48);
      rocket(R(W * 0.2, W * 0.45), 260); rocket(R(W * 0.55, W * 0.8), 520);
    },
    // every step of the day done: the quiz is open
    quizOpen() {
      sound("unlock");
      if (!motion()) return;
      ensure();
      const x = W / 2, y = H * 0.42;
      ring(x, y, "#5aa9ff"); ring(x, y, "#b58cff", 150); ring(x, y, "#5aa9ff", 300);
      stars(x, y, 34, { speed: 10, colors: ["#5aa9ff", "#b58cff", "#ffffff", "#ffe066"] });
    },
    // a small burst of stars: a right answer, a self-check you knew. No sound of its own.
    sparkle(el) {
      if (!motion()) return;
      ensure();
      const p = center(el);
      stars(p.x, p.y, 12, { speed: 5.5, ttl: [24, 46], size: [5, 10], gravity: 0.1 });
    },
    // A right answer in a quiz (not the mock exam). n = right answers in a row now: the note climbs with it and the
    // stars grow and heat up. el = the verdict, meter = the combo meter in the quiz header (it gets a ring).
    right(n, el, meter) {
      sound("right", n);
      if (!motion()) return;
      ensure();
      const p = center(el);
      stars(p.x, p.y, Math.min(12 + n * 2, 34), { speed: 5.5 + Math.min(n, 10) * 0.25, ttl: [24, 50], size: [5, 10], gravity: 0.1, colors: n >= 5 ? HOT : GOLD });
      if (!meter) return;
      const m = center(meter);
      ring(m.x, m.y, n >= 5 ? "#ff7a00" : "#ffe066");
      if (n >= 3) sparks(m.x, m.y, 8 + n, n >= 5 ? "#ff7a00" : "#ffc061", 4);
    },
    // A wrong answer in a quiz. was = the run it ended: from 3 on, the meter cracks and its pieces fall.
    wrong(was, meter) {
      sound("wrong");
      if (was >= 3) sound("broke");
      if (!motion() || was < 3 || !meter) return;
      ensure();
      const m = center(meter);
      confetti(m.x, m.y, Math.min(14 + was * 2, 50), { speed: 4.5, gravity: 0.3, ttl: [30, 60], size: [3, 7], shapes: ["rect", "dot"], colors: ["#9fb3c8", "#e5383b", "#6b7c93", "#ffffff"] });
    },
    // A streak mark (3, 5, 10, 15, 20, 25, 30 in a row): the burst grows with the tier. From 5: cannons;
    // from 10: a glow round the quiz, a soft flash, flames falling and rockets; from 20 in purple.
    combo(n, el, meter) {
      sound("right", n);
      setTimeout(() => sound("combo", n), 120);
      if (!motion()) return;
      ensure();
      const t = tier(n), p = center(el), m = meter ? center(meter) : p, cols = t >= 5 ? EPIC : t >= 2 ? HOT : GOLD;
      ring(p.x, p.y, "#ffe066"); ring(m.x, m.y, t >= 5 ? "#b58cff" : "#ff7a00", 90);
      stars(p.x, p.y, Math.min(16 + n * 2, 64), { speed: 7.5 + t, colors: cols });
      confetti(m.x, m.y, 18 + t * 8, { speed: 5 + t, angle: Math.PI / 2, spread: Math.PI * 1.1, ttl: [40, 80], size: [3, 7], shapes: ["rect", "dot", "star"], colors: cols });
      if (t >= 2) cannons(20 + t * 14);
      if (t >= 3) {
        glow(t >= 5 ? "#8a3ffc" : "#ff7a00");
        flash(t >= 5 ? "181,140,255" : "255,153,0", 0.1 + t * 0.025);
        rain(t >= 5 ? ["🔥", "🌟", "💎", "⚡"] : ["🔥", "⚡"], 10 + t * 8);
        for (let i = 0; i < t - 1; i++) rocket(R(W * 0.15, W * 0.85), 150 + i * 220, t >= 5);
      }
    },
    // a quiz passed with every answer right
    perfect() {
      sound("finale");
      if (!motion()) return;
      ensure();
      rain(["⭐", "✨", "💯"], 70);
      cannons(120);
      for (let i = 0; i < 6; i++) rocket(R(W * 0.12, W * 0.88), 200 + i * 240);
    },
    // a quiz passed (the day's celebration follows when the results are closed)
    pass() {
      sound("fanfare");
      if (!motion()) return;
      ensure();
      cannons(70);
      stars(W / 2, H * 0.35, 30, { speed: 11 });
      rocket(R(W * 0.25, W * 0.75), 250);
    },
    tick(el) { sound("pop"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 22, { speed: 6, spread: Math.PI * 1.2, ttl: [35, 65], size: [3, 6] }); },
    group(el) { sound("chime"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 70, { speed: 10, spread: Math.PI * 1.4, ttl: [50, 90] }); },
    // The top rungs, much bigger than a passed or perfect quiz: a flash, rings and stars from the banner, waves of
    // cannons, a fountain from the bottom, emoji rain in waves and big fireworks. Each rung longer and fuller.
    day() {
      sound("day");
      if (!motion()) return;
      ensure();
      const x = W / 2, y = H * 0.38, chars = ["🎉", "⭐", "✨", "🎊"];
      flash("255,214,102", 0.3);
      ring(x, y, "#ff9900"); ring(x, y, "#ffe066", 160); ring(x, y, "#5fd37a", 320);
      stars(x, y, 50, { speed: 14 });
      for (let k = 0; k < 3; k++) later(k * 600, () => cannons(150));
      rain(chars, 60); later(1400, () => rain(chars, 40));
      fountain(x, 2400, 300);
      for (let i = 0; i < 10; i++) rocket(R(W * 0.12, W * 0.88), 250 + i * 260, true);
    },
    week() {
      sound("week");
      if (!motion()) return;
      ensure();
      const x = W / 2, y = H * 0.38, chars = ["🏆", "⭐", "🎉", "🥇", "✨"];
      flash("255,214,102", 0.36); flash("255,153,0", 0.28, 1500);
      ["#ffe066", "#ff9900", "#5aa9ff", "#b58cff"].forEach((c, k) => ring(x, y, c, k * 170));
      stars(x, y, 80, { speed: 16 });
      for (let k = 0; k < 5; k++) later(k * 560, () => cannons(170));
      for (let k = 0; k < 3; k++) later(k * 1100, () => rain(chars, 60));
      fountain(W * 0.2, 3800, 200); fountain(W * 0.8, 3800, 200);
      for (let i = 0; i < 14; i++) rocket(R(W * 0.08, W * 0.92), 200 + i * 220, true);
      for (let i = 0; i < 6; i++) rocket(W * (0.1 + i * 0.16), 3600, true);   // the closing volley
    },
    all() {
      sound("all");
      setTimeout(() => sound("finale"), 7200);
      if (!motion()) return;
      ensure();
      const x = W / 2, y = H * 0.38, chars = ["🚀", "🏆", "⭐", "🎓", "🎉", "💯"];
      flash("255,214,102", 0.4); flash("181,140,255", 0.3, 2300); flash("95,211,122", 0.3, 4600);
      COLORS.forEach((c, k) => ring(x, y, c, k * 150));
      stars(x, y, 110, { speed: 18 });
      for (let k = 0; k < 8; k++) later(k * 600, () => cannons(180));
      for (let k = 0; k < 5; k++) later(k * 1200, () => rain(chars, 60));
      fountain(W * 0.15, 6000, 200); fountain(x, 6000, 600); fountain(W * 0.85, 6000, 200);
      for (let i = 0; i < 26; i++) rocket(R(W * 0.06, W * 0.94), 150 + i * 210, true);
      for (const at of [2300, 4600, 7200]) for (let i = 0; i < 8; i++) rocket(W * (0.07 + i * 0.123), at, true);   // volleys on the beats
    },
    small(el) { sound("clean"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 40, { speed: 8, spread: Math.PI * 1.3 }); },
    banner, toast, badge, sound,
    unlock() { if (soundOn) ac(); },
    // fx-off on <html> stops the decorative CSS loops too (the combo meter's flicker); prefers-reduced-motion stops them all
    set(o) { if ("fx" in o) { fxOn = !!o.fx; document.documentElement.classList.toggle("fx-off", !fxOn); } if ("sound" in o) soundOn = !!o.sound; }
  };
})();
