// Quiz logic with no DOM: picking questions, shuffling, grading, spaced repetition, weak spots.
// Loaded by the page (window.QZ) and by the Node tests (tests/*.test.mjs).
window.QZ = (() => {
  const DAILY = 30;                       // questions per end-of-day quiz
  const PASS = 0.9;                       // share needed to complete the day
  const MOCK = { n: 65, minutes: 130, split: [20, 17, 15, 13] };   // exam guide weights 30/26/24/20 %
  const MIX = [9, 8, 7, 6];               // the same weights for a 30-question mix
  const SRS_DAYS = [1, 2, 4];             // a missed question comes back after 1, 2, then 4 days
  const STEP = 3;                         // questions in a "try this step" practice round
  const FOUNDATION = 6;                   // pools 1–6 are foundation level, the later ones exam level

  // ---------- helpers ----------
  function shuffle(a, rand = Math.random) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const range = n => Array.from({ length: n }, (_, i) => i);
  function addDays(iso, n) {
    const [y, m, d] = iso.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + n));
    return t.toISOString().slice(0, 10);
  }
  const index = bank => { const o = {}; bank.forEach(q => { o[q.id] = q; }); return o; };
  const needed = n => Math.ceil(PASS * n);
  const passed = (score, n) => score >= needed(n);

  // Priority: never seen → answered wrong last time → seen longest ago. Random inside each tier.
  function rank(qs, stats, rand = Math.random) {
    const tier = q => { const s = stats[q.id]; return !s ? 0 : s.last ? 2 : 1; };
    return shuffle(qs, rand)
      .map(q => ({ q, t: tier(q), at: (stats[q.id] || {}).at || "" }))
      .sort((a, b) => a.t - b.t || (a.t === 2 ? (a.at < b.at ? -1 : a.at > b.at ? 1 : 0) : 0))
      .map(r => r.q);
  }
  const take = (qs, n, stats, rand) => rank(qs, stats, rand).slice(0, n);

  // Take counts[i] from groups[i]; if a group runs short, fill from what is left anywhere.
  function stratified(groups, counts, stats, rand = Math.random) {
    const out = [], used = new Set();
    groups.forEach((g, i) => take(g, counts[i], stats, rand).forEach(q => { out.push(q); used.add(q.id); }));
    const total = counts.reduce((a, b) => a + b, 0);
    if (out.length < total) take(groups.flat().filter(q => !used.has(q.id)), total - out.length, stats, rand).forEach(q => out.push(q));
    return shuffle(out, rand);
  }

  // ---------- the plan's topics ----------
  // What each day teaches, from the topics of its steps (STEP_TAGS): own = that day, sofar = that day and every day before it.
  function topics(plan, stepTags) {
    const out = {}, sofar = new Set();
    for (const d of plan) {
      if (!d.id) continue;
      const own = new Set(d.groups.flatMap(g => g.items.flatMap(it => stepTags[it[0]] || [])));
      own.forEach(t => sofar.add(t));
      out[d.id] = { own, sofar: new Set(sofar) };
    }
    return out;
  }
  const NONE = { own: new Set(), sofar: new Set() };
  const about = (q, set) => q.tags.some(t => set.has(t));
  const within = (q, set) => q.tags.every(t => set.has(t));
  const studied = bank => bank.filter(q => q.day !== "mock");
  const doms = spec => spec.slice(4).split(",").map(Number).filter(n => n >= 1 && n <= 4);
  // The questions a "tags" day draws on: about one of the day's topics, and about nothing that comes later in the plan.
  const dayPool = (d, tp, bank) => { const t = tp[d.id] || NONE; return studied(bank).filter(q => about(q, t.own) && within(q, t.sofar)); };

  // ---------- picking ----------
  // A day's quiz field: "tags" (the day's topics), "review" (everything so far), "dom:1,2" (exam domains),
  // "weak" (your weakest topics), "exam" (weighted like the exam). No field: no quiz that day.
  const hasQuiz = d => !!d.quiz;
  function describe(d) {
    const k = d.quiz || "";
    if (k === "review") return "Mixed review of everything so far";
    if (k === "weak") return "Built from your weakest topics and past misses";
    if (k === "exam") return "Mixed from all four domains, weighted like the exam";
    if (k.startsWith("dom:")) { const ds = doms(k); return `Exam ${ds.length > 1 ? "domains" : "domain"} ${ds.join(" and ")}, exam-style questions`; }
    return "On today's topics";
  }

  function pickDay(d, tp, bank, stats, rand = Math.random) {
    const k = d.quiz || "", pool = studied(bank), t = tp[d.id] || NONE;
    if (k === "weak") return pickWeak(pool, stats, DAILY, rand);
    if (k === "exam") return stratified(range(4).map(i => pool.filter(q => q.dom === i + 1)), MIX, stats, rand);
    if (k.startsWith("dom:")) {
      const ds = doms(k), each = Math.floor(DAILY / ds.length);
      return stratified(ds.map(n => pool.filter(q => q.dom === n)), ds.map((_, i) => each + (i < DAILY - each * ds.length ? 1 : 0)), stats, rand);
    }
    const taught = pool.filter(q => within(q, t.sofar));
    if (k === "review") return shuffle(take(taught, DAILY, stats, rand), rand);
    if (k !== "tags") return [];
    // Today's topics first. New questions before seen ones, and among the new ones the foundation level before the exam level.
    const own = rank(taught.filter(q => about(q, t.own)), stats, rand)
      .map((q, i) => ({ q, i, l: stats[q.id] ? 2 : q.day > FOUNDATION ? 1 : 0 }))
      .sort((a, b) => a.l - b.l || a.i - b.i).slice(0, DAILY).map(r => r.q);
    // A short day is filled from earlier topics, then from anything left.
    for (const more of [taught, pool]) {
      if (own.length >= DAILY) break;
      const have = new Set(own.map(q => q.id));
      own.push(...take(more.filter(q => !have.has(q.id)), DAILY - own.length, stats, rand));
    }
    return shuffle(own, rand);
  }

  // Questions from the topics you get wrong most, past misses first, at most 6 per topic.
  function pickWeak(pool, stats, n, rand = Math.random) {
    const w = tagWeakness(pool, stats);
    const score = q => {
      const s = stats[q.id];
      const tierBonus = !s ? 0.3 : s.last ? 0 : 1;
      return Math.max(...q.tags.map(t => w[t] ?? 0.5)) + tierBonus + rand() * 0.2;
    };
    const sorted = pool.map(q => ({ q, s: score(q) })).sort((a, b) => b.s - a.s).map(r => r.q);
    const out = [], per = {};
    for (const q of sorted) {
      if (out.length >= n) break;
      const t = q.tags[0];
      if ((per[t] || 0) >= 6) continue;
      per[t] = (per[t] || 0) + 1;
      out.push(q);
    }
    for (const q of sorted) { if (out.length >= n) break; if (!out.includes(q)) out.push(q); }
    return shuffle(out, rand);
  }
  // Share of wrong answers per tag, smoothed so one miss doesn't dominate; unseen tags count as 0.5.
  function tagWeakness(pool, stats) {
    const agg = {};
    for (const q of pool) {
      const s = stats[q.id];
      if (!s) continue;
      for (const t of q.tags) { const a = agg[t] || (agg[t] = [0, 0]); a[0] += s.seen - s.right; a[1] += s.seen; }
    }
    const w = {};
    for (const t in agg) w[t] = (agg[t][0] + 1) / (agg[t][1] + 2);
    return w;
  }

  // Mock: unseen mock-set questions first, then unseen study questions, split by domain like the exam.
  function pickMock(bank, stats, rand = Math.random) {
    const pool = bank.filter(q => q.day === "mock").concat(studied(bank));
    const tier = q => { const s = stats[q.id]; return !s ? 0 : s.last ? 2 : 1; };
    const out = [];
    for (let d = 1; d <= 4; d++) {
      const g = shuffle(pool.filter(q => q.dom === d), rand)
        .map(q => ({ q, t: tier(q), m: q.day === "mock" ? 0 : 1, at: (stats[q.id] || {}).at || "" }))
        .sort((a, b) => a.t - b.t || a.m - b.m || (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
      g.slice(0, MOCK.split[d - 1]).forEach(r => out.push(r.q));
    }
    return shuffle(out, rand);
  }

  // Warm-up: due reviews first, then questions you last answered yesterday (misses first).
  function pickWarmup(bank, stats, srs, today, n = 5, rand = Math.random) {
    const by = index(bank);
    const out = dueIds(srs, today).filter(id => by[id]).slice(0, n).map(id => by[id]);
    if (out.length < n) {
      const have = new Set(out.map(q => q.id)), yday = addDays(today, -1);
      const y = shuffle(bank.filter(q => !have.has(q.id) && stats[q.id] && stats[q.id].at === yday), rand)
        .sort((a, b) => stats[a.id].last - stats[b.id].last);
      out.push(...y.slice(0, n - out.length));
    }
    return shuffle(out, rand);
  }
  function pickReview(bank, srs, today, n = 15) {
    const by = index(bank);
    return dueIds(srs, today).filter(id => by[id]).slice(0, n).map(id => by[id]);
  }
  // Questions for one plan step: those that name it (ref) and those on a topic it teaches (tags = its STEP_TAGS).
  function forStep(id, tags, bank) {
    const set = new Set(tags || []);
    return bank.filter(q => q.ref.includes(id) || about(q, set));
  }
  // Step practice: questions that name the step first, then its topics as a question's main topic, then as a side topic;
  // the mock pool last, so practice does not use up the mock exam.
  function pickStep(id, tags, bank, stats, n = STEP, rand = Math.random) {
    const set = new Set(tags || []);
    const far = q => (q.ref.includes(id) ? 0 : set.has(q.tags[0]) ? 1 : 2) + (q.day === "mock" ? 3 : 0);
    return rank(forStep(id, tags, bank), stats, rand)
      .map((q, i) => ({ q, i, f: far(q) }))
      .sort((a, b) => a.f - b.f || a.i - b.i)
      .slice(0, n).map(r => r.q);
  }

  // ---------- answering ----------
  const order = (q, rand = Math.random) => shuffle(range(q.o.length), rand);
  function isRight(q, chosen) {
    if (!chosen || chosen.length !== q.a.length) return false;
    return q.a.every(i => chosen.includes(i));
  }
  function record(stats, id, right, today) {
    const s = stats[id] || (stats[id] = { seen: 0, right: 0, last: 0, at: "" });
    s.seen++; if (right) s.right++;
    s.last = right ? 1 : 0; s.at = today;
  }

  // ---------- spaced repetition ----------
  function srsMiss(srs, id, today) { srs[id] = { step: 0, due: addDays(today, SRS_DAYS[0]) }; }
  // A correct answer only counts once the question is due; three on-time correct answers retire it.
  function srsHit(srs, id, today) {
    const s = srs[id];
    if (!s || s.due > today) return;
    s.step++;
    if (s.step >= SRS_DAYS.length) delete srs[id];
    else s.due = addDays(today, SRS_DAYS[s.step]);
  }
  function dueIds(srs, today) {
    return Object.keys(srs).filter(id => srs[id].due <= today).sort((a, b) => (srs[a].due < srs[b].due ? -1 : srs[a].due > srs[b].due ? 1 : 0));
  }

  // ---------- weak spots ----------
  function weakTags(bank, stats, minSeen = 2) {
    const agg = {};
    for (const q of bank) {
      const s = stats[q.id];
      if (!s) continue;
      for (const t of q.tags) {
        const a = agg[t] || (agg[t] = { tag: t, seen: 0, right: 0 });
        a.seen += s.seen; a.right += s.right;
      }
    }
    return Object.values(agg).filter(a => a.seen >= minSeen)
      .map(a => ({ tag: a.tag, seen: a.seen, right: a.right, acc: a.right / a.seen }))
      .sort((x, y) => x.acc - y.acc || y.seen - x.seen);
  }
  function domainAcc(bank, stats) {
    const r = [[0, 0], [0, 0], [0, 0], [0, 0]];
    for (const q of bank) { const s = stats[q.id]; if (s) { r[q.dom - 1][0] += s.right; r[q.dom - 1][1] += s.seen; } }
    return r;
  }
  function mockResult(qs, answers) {
    const dom = [[0, 0], [0, 0], [0, 0], [0, 0]];
    let score = 0;
    for (const q of qs) {
      const ok = isRight(q, answers[q.id]);
      if (ok) score++;
      dom[q.dom - 1][1]++; if (ok) dom[q.dom - 1][0]++;
    }
    return { score, n: qs.length, pct: qs.length ? Math.round(score / qs.length * 100) : 0, dom };
  }

  return {
    DAILY, PASS, MOCK, SRS_DAYS, STEP, needed, passed, describe, hasQuiz,
    shuffle, addDays, rank, stratified, topics, dayPool, forStep,
    pickDay, pickWeak, pickMock, pickWarmup, pickReview, pickStep,
    order, isRight, record, srsMiss, srsHit, dueIds, weakTags, tagWeakness, domainAcc, mockResult
  };
})();
