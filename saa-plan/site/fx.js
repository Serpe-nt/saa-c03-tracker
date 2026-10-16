// Celebration effects: canvas confetti/fireworks + Web Audio sounds + banner, toast and badges. No dependencies.
// A ladder, from small to large: step → block → quiz unlocked → day → week → all, plus sparkles for right answers and streaks.
window.FX = (() => {
  let fxOn = true, soundOn = true;
  let cv = null, ctx = null, W = 0, H = 0, raf = 0;
  let parts = [], rockets = [], rings = [];
  let actx = null, bEl = null, bT = 0, tEl = null, tT = 0, bdWrap = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["#ff9900", "#ffc061", "#0972d3", "#5aa9ff", "#8a3ffc", "#b58cff", "#1fbf5f", "#ff5c8a", "#ffe066"];
  const GOLD = ["#ffe066", "#ffc061", "#ff9900", "#fff3b0", "#ffffff"];
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
    for (let i = 0; i < n; i++) {
      const a = angle + R(-spread / 2, spread / 2), v = speed * R(0.45, 1.1);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag: 0.986, life: 0,
        ttl: R(ttl[0], ttl[1]), c: pick(colors), s: R(size[0], size[1]), rot: R(0, 6.28), vr: R(-0.3, 0.3), shape: pick(shapes) });
    }
    run();
  }
  const stars = (x, y, n, o = {}) => confetti(x, y, n, { speed: 8, ttl: [40, 75], size: [7, 13], gravity: 0.16, shapes: ["star"], colors: GOLD, ...o });
  function sparks(x, y, n, c) {
    for (let i = 0; i < n; i++) {
      const a = R(0, 6.28), v = R(1.5, 6.5);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.06, drag: 0.975, life: 0,
        ttl: R(55, 95), c: Math.random() < 0.75 ? c : "#ffffff", s: R(2, 3.4), rot: 0, vr: 0, shape: "dot" });
    }
  }
  // an expanding ring where something was finished
  function ring(x, y, c, delay = 0) {
    setTimeout(() => { ensure(); rings.push({ x, y, r: 8, c, life: 0, ttl: 30 }); run(); }, delay);
  }
  // characters falling from the top of the screen
  function rain(chars, n) {
    for (let i = 0; i < n; i++) {
      parts.push({ x: R(0, W), y: R(-H * 0.6, -20), vx: R(-0.6, 0.6), vy: R(2, 5), g: 0.03, drag: 1, life: 0,
        ttl: R(150, 240), c: "#fff", s: R(18, 30), rot: R(-0.4, 0.4), vr: R(-0.03, 0.03), ch: pick(chars) });
    }
    run();
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
    const o = { speed, spread: 0.55, gravity: 0.25, ttl: [100, 150], size: [5, 9], shapes: ["rect", "rect", "dot", "star"] };
    confetti(0, H, n, { ...o, angle: -Math.PI / 3 });
    confetti(W, H, n, { ...o, angle: (-Math.PI * 2) / 3 });
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
      if (parts.length || rockets.length || rings.length) raf = requestAnimationFrame(step);
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
  // A pentatonic scale from C5: step i of a day plays note i, so the sound climbs as the day fills up.
  const PENTA = [0, 2, 4, 7, 9];
  const hz = i => 523.25 * 2 ** ((PENTA[i % 5] + 12 * Math.floor(i / 5)) / 12);
  const SND = {
    pop: () => tone(R(520, 700), 0, 0.09, { to: 1300, vol: 0.07 }),
    note: (i = 0) => { const k = Math.max(0, Math.min(i, 12)); tone(hz(k), 0, 0.14, { type: "triangle", vol: 0.09 }); tone(hz(k) * 2, 0.045, 0.2, { vol: 0.035 }); },
    chime: () => { tone(880, 0, 0.3, { vol: 0.08 }); tone(1318.5, 0.09, 0.4, { vol: 0.07 }); },
    block: () => { [0, 2, 3, 5].forEach((k, j) => tone(hz(k), j * 0.075, j === 3 ? 0.55 : 0.17, { type: "triangle", vol: 0.09 })); tone(hz(5) * 2, 0.3, 0.5, { vol: 0.03 }); },
    unlock: () => { tone(440, 0, 0.28, { to: 880, vol: 0.07 }); tone(1318.5, 0.22, 0.5, { vol: 0.07 }); tone(1760, 0.34, 0.5, { vol: 0.04 }); },
    combo: (n = 3) => { const k = Math.min(Math.floor(n / 2), 9); tone(hz(k), 0, 0.09, { type: "triangle", vol: 0.08 }); tone(hz(k + 2), 0.07, 0.11, { type: "triangle", vol: 0.08 }); tone(hz(k + 4), 0.14, 0.24, { type: "triangle", vol: 0.08 }); },
    fanfare: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, i === 3 ? 0.7 : 0.22, { type: "triangle", vol: 0.1 })),
    finale: () => {
      SND.fanfare();
      [523.25, 659.25, 783.99].forEach(f => tone(f, 0.55, 1.2, { type: "triangle", vol: 0.06 }));
      tone(1046.5, 0.55, 1.3, { vol: 0.06 });
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
  const BANNER_MS = { all: 5500, week: 4500, day: 3200, block: 2300, info: 2600 };
  function banner(title, sub = "", kind = "day") {
    if (!bEl) { bEl = document.createElement("div"); bEl.setAttribute("role", "status"); }
    if (bEl.parentNode !== host()) host().appendChild(bEl);
    bEl.className = "fx-banner k-" + kind;
    bEl.innerHTML = `<div class="b-t">${title}</div>${sub ? `<div class="b-s">${sub}</div>` : ""}`;
    void bEl.offsetWidth;
    bEl.classList.add("show");
    clearTimeout(bT);
    bT = setTimeout(() => bEl.classList.remove("show"), BANNER_MS[kind] || 3200);
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
  // They stack (at most three) and float away after a few seconds. tier: bronze | silver | gold | epic | level.
  // Like the banner, it carries information, so it shows with effects off too (without the stars).
  function badge(icon, title, sub = "", tier = "gold") {
    if (!bdWrap) { bdWrap = document.createElement("div"); bdWrap.className = "fx-badges"; bdWrap.setAttribute("role", "status"); }
    if (bdWrap.parentNode !== host()) host().appendChild(bdWrap);
    const el = document.createElement("div");
    el.className = "fx-badge k-" + tier;
    el.innerHTML = `<span class="bd-i">${icon}</span><span class="bd-x"><span class="bd-t">${title}</span>${sub ? `<span class="bd-s">${sub}</span>` : ""}</span>`;
    bdWrap.appendChild(el);
    while (bdWrap.children.length > 3) bdWrap.firstChild.remove();
    // stars burst from the medal once it has landed
    setTimeout(() => {
      if (!el.isConnected || !motion()) return;
      ensure();
      const p = center(el.querySelector(".bd-i"));
      ring(p.x, p.y, tier === "epic" ? "#b58cff" : "#ffe066");
      stars(p.x, p.y, tier === "epic" || tier === "level" ? 26 : 14, { speed: 6.5, gravity: 0.14, ttl: [30, 60], size: [5, 11], colors: tier === "epic" ? ["#b58cff", "#8a3ffc", "#ffe066", "#ffffff"] : GOLD });
    }, 420);
    setTimeout(() => el.classList.add("out"), 3000);
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
    // several right answers in a row
    combo(n, el) {
      sound("combo", n);
      if (!motion()) return;
      ensure();
      const p = center(el);
      ring(p.x, p.y, "#ffe066");
      stars(p.x, p.y, Math.min(10 + n * 2, 44), { speed: 7 + Math.min(n, 12) * 0.3 });
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
    day() { sound("fanfare"); if (!motion()) return; ensure(); cannons(120); rain(["🎉", "⭐", "✨"], 34); for (let i = 0; i < 6; i++) rocket(R(W * 0.15, W * 0.85), 300 + i * 250); },
    week() { sound("finale"); if (!motion()) return; ensure(); rain(["🏆", "⭐", "🎉"], 50); for (let k = 0; k < 3; k++) setTimeout(() => cannons(140), k * 700); for (let i = 0; i < 10; i++) rocket(R(W * 0.1, W * 0.9), 200 + i * 220); },
    all() { sound("finale"); setTimeout(() => sound("finale"), 1600); if (!motion()) return; ensure(); rain(["🚀", "🏆", "⭐", "🎓"], 90); for (let k = 0; k < 5; k++) setTimeout(() => cannons(160), k * 650); for (let i = 0; i < 20; i++) rocket(R(W * 0.08, W * 0.92), 150 + i * 190); },
    small(el) { sound("clean"); if (!motion()) return; ensure(); const p = center(el); confetti(p.x, p.y, 40, { speed: 8, spread: Math.PI * 1.3 }); },
    banner, toast, badge, sound,
    unlock() { if (soundOn) ac(); },
    set(o) { if ("fx" in o) fxOn = !!o.fx; if ("sound" in o) soundOn = !!o.sound; }
  };
})();
