/*
  Animated body figures showing how each move is done.

  A figure is a simple skeleton seen from the side, facing right.
  Each pose lists absolute segment angles in degrees:
    0 = pointing up, 90 = forward (right), 180 = down, 270 = back (left).
  T = torso (hip → neck), H = head, bend = spine curve (+ rounds up, − sags),
  na1/na2 = near upper arm / forearm, fa1/fa2 = far arm,
  nl1/nl2 = near thigh / shin, fl1/fl2 = far leg, nf/ff = feet.
  The near limbs are drawn dark, the far limbs light.
  `focus` lists the muscles the move works; they get a soft glow.

  The figure is automatically set on the ground, and the `anchor` joint stays
  in place while it moves (e.g. feet in a squat). `ik: true` keeps the hands
  planted where they were in pose A (push-ups).
*/
(function () {
  const L = { torso: 40, shoulder: 37, neck: 11, head: 8, upper: 18, fore: 17, thigh: 25, shin: 25, foot: 9 };
  const GROUND = 120, W = 200;

  const STAND = { T: 0, bend: 0, na1: 180, na2: 180, fa1: 180, fa2: 180, nl1: 180, nl2: 180, fl1: 180, fl2: 180, nf: 90, ff: 90 };
  const PRONE = { T: 90, H: 90, nl1: 270, nl2: 270, fl1: 270, fl2: 270, nf: 180, ff: 180 };
  const KNEEL4 = { T: 74, H: 85, na1: 180, na2: 180, fa1: 180, fa2: 180, nl1: 180, nl2: 270, fl1: 180, fl2: 270, nf: 270, ff: 270 };
  const arms = a => ({ na1: a, na2: a, fa1: a, fa2: a });

  const FIGS = {
    // seen from the front: arms out to the sides, hands tracing small circles
    "Arm circles":      { focus: "shoulders", mode: "wave", dur: 1.4, anchor: "hip", front: true,
                          a: { na1: 90, na2: 90, fa1: 270, fa2: 270, nl1: 172, nl2: 180, fl1: 188, fl2: 180, nf: 180, ff: 180 },
                          wave: { na1: 6, na2: 14, fa1: -6, fa2: -14 } },
    "Incline push-ups": { focus: "chest arms", anchor: "nToe", ik: true, prop: "counter",
                          a: { T: 38, H: 45, ...arms(158), nl1: 218, nl2: 218, fl1: 218, fl2: 218, nf: 150, ff: 150 },
                          b: { T: 54, H: 60, nl1: 234, nl2: 234, fl1: 234, fl2: 234, nf: 160, ff: 160 } },
    "Squats":           { focus: "thighs glutes", anchor: "nAnkle", a: {}, b: { T: 40, H: 25, ...arms(90), nl1: 105, nl2: 200, fl1: 105, fl2: 200 } },
    "Glute bridge":     { focus: "glutes", anchor: "nAnkle",
                          a: { T: 270, H: 270, ...arms(90), nl1: 50, nl2: 190, fl1: 50, fl2: 190 },
                          b: { T: 250, H: 270, na1: 70, na2: 70, fa1: 70, fa2: 70, nl1: 82, nl2: 180, fl1: 82, fl2: 180 } },
    "Dead bug":         { focus: "core", anchor: "hip",
                          a: { T: 270, H: 270, ...arms(0), nl1: 0, nl2: 90, fl1: 0, fl2: 90, nf: 0, ff: 0 },
                          b: { na1: 280, na2: 280, fl1: 80, fl2: 80, ff: 350 } },
    "Child's pose":     { focus: "back", anchor: "nAnkle", dur: 5,
                          a: { T: 97, H: 115, na1: 105, na2: 100, fa1: 105, fa2: 100, nl1: 130, nl2: 270, fl1: 130, fl2: 270, nf: 270, ff: 270, bend: 3 },
                          b: { T: 94, H: 112, bend: 4 } },

    "March in place":   { focus: "thighs", anchor: "hip", dur: 1.6, hold: 0.15,
                          a: { nl1: 95, nl2: 180, nf: 100, na1: 205, na2: 165, fa1: 150, fa2: 75 },
                          b: { fl1: 95, fl2: 180, ff: 100, nl1: 180, nf: 90, fa1: 205, fa2: 165, na1: 150, na2: 75 } },
    "Bird dog":         { focus: "core back", anchor: "nKnee", a: { ...KNEEL4 }, b: { na1: 82, na2: 82, H: 80, fl1: 272, fl2: 272, ff: 272 } },
    "Reverse lunge":    { focus: "thighs glutes", anchor: "fAnkle",
                          a: {}, b: { fl1: 100, fl2: 180, nl1: 195, nl2: 265, nf: 250 } },
    "Prone Y raise":    { focus: "shoulders upperback", anchor: "hip", a: { ...PRONE, ...arms(103) }, b: { T: 86, H: 80, ...arms(78) } },
    "Side plank":       { focus: "core", anchor: "nKnee", dur: 4,
                          a: { T: 73, H: 73, na1: 180, na2: 90, fa1: 10, fa2: 10, nl1: 253, nl2: 295, fl1: 253, fl2: 295, nf: 205, ff: 205 },
                          b: { T: 71, H: 71 } },
    "Hip flexor stretch": { focus: "hipflexor", anchor: "fAnkle", dur: 4,
                          a: { nl1: 180, nl2: 270, nf: 270, fl1: 90, fl2: 180, ...arms(150) },
                          b: { T: -6, H: -4, nl1: 200, fl1: 80, fl2: 190 } },

    "Cat–cow":          { focus: "back", anchor: "nKnee", dur: 4, a: { ...KNEEL4, H: 150, bend: 8 }, b: { H: 45, bend: -6 } },
    "Calf raises":      { focus: "calves", anchor: "nToe", a: {}, b: { nf: 140, ff: 140 } },
    "Knee push-ups":    { focus: "chest arms", anchor: "nKnee", ik: true,
                          a: { T: 56, H: 62, ...arms(180), nl1: 236, nl2: 270, fl1: 236, fl2: 270, nf: 270, ff: 270 },
                          b: { T: 76, H: 82, nl1: 256, fl1: 256 } },
    // belly and hips stay down; chest, arms and straight legs lift into a gentle banana curve
    "Superman hold":    { focus: "back glutes", anchor: "hip", dur: 4.5, hold: 1.8,
                          a: { ...PRONE, H: 100, ...arms(97), nf: 248, ff: 248 },
                          b: { T: 72, H: 78, bend: -4, ...arms(66), nl1: 285, nl2: 285, fl1: 285, fl2: 285, nf: 255, ff: 255 } },
    "Plank":            { focus: "core", anchor: "nToe", dur: 4,
                          a: { T: 84, H: 86, na1: 180, na2: 90, fa1: 180, fa2: 90, nl1: 264, nl2: 264, fl1: 264, fl2: 264, nf: 170, ff: 170 },
                          b: { T: 84.6, H: 87 } },
    "Forward fold":     { focus: "hamstrings", anchor: "nAnkle", hold: 1.5,
                          a: {}, b: { T: 120, H: 150, na1: 145, na2: 155, fa1: 145, fa2: 155, nl1: 160, nl2: 195, fl1: 160, fl2: 195 } },
  };

  // ---------- geometry ----------
  const rad = a => a * Math.PI / 180;
  const dir = a => [Math.sin(rad(a)), -Math.cos(rad(a))];
  const add = (p, a, len) => { const d = dir(a); return [p[0] + d[0] * len, p[1] + d[1] * len]; };

  function solveArm(sh, target, bendSign) {
    const dx = target[0] - sh[0], dy = target[1] - sh[1];
    const d = Math.min(Math.hypot(dx, dy), L.upper + L.fore - 0.01);
    const base = Math.atan2(dy, dx);
    const ang = Math.acos((L.upper ** 2 + d ** 2 - L.fore ** 2) / (2 * L.upper * d)) * bendSign;
    const elbow = [sh[0] + Math.cos(base + ang) * L.upper, sh[1] + Math.sin(base + ang) * L.upper];
    return [elbow, [sh[0] + Math.cos(base) * d, sh[1] + Math.sin(base) * d]];
  }

  // pose angles → joint positions (hip at origin)
  function skeleton(p) {
    const j = { hip: [0, 0] };
    j.neck = add(j.hip, p.T, L.torso);
    j.shoulder = add(j.hip, p.T, L.shoulder);
    j.head = add(j.neck, p.H ?? p.T, L.neck);
    for (const s of ["n", "f"]) {
      j[s + "Elbow"] = add(j.shoulder, p[s + "a1"], L.upper);
      j[s + "Hand"] = add(j[s + "Elbow"], p[s + "a2"], L.fore);
      j[s + "Knee"] = add(j.hip, p[s + "l1"], L.thigh);
      j[s + "Ankle"] = add(j[s + "Knee"], p[s + "l2"], L.shin);
      j[s + "Toe"] = add(j[s + "Ankle"], p[s + "f"], L.foot);
    }
    return j;
  }

  // radius of the body at each joint, so limbs rest on the floor rather than sink into it
  const R = { head: 8, neck: 7, shoulder: 7, hip: 7.5, Elbow: 3.2, Hand: 2.6, Knee: 5, Ankle: 2.8, Toe: 2.2 };
  function lowest(j) {
    let y = -Infinity;
    for (const k in j) y = Math.max(y, j[k][1] + (R[k] ?? R[k.slice(1)] ?? 0));
    return y;
  }

  // Precompute per-figure data: full poses, hand targets, horizontal anchor
  function prepare(f) {
    if (f._ready) return f;
    f.A = { ...STAND, ...f.a };
    if (f.A.H === undefined) f.A.H = f.A.T;
    f.B = { ...f.A, ...f.b };
    const ja = skeleton(f.A);
    const anc = ja[f.anchor || "nAnkle"];
    f.handOff = { n: [ja.nHand[0] - anc[0], ja.nHand[1] - anc[1]], f: [ja.fHand[0] - anc[0], ja.fHand[1] - anc[1]] };
    // centre the figure on its pose-A/B extent
    let minX = Infinity, maxX = -Infinity;
    for (const pose of [f.A, f.B]) {
      const j = skeleton(pose), a = j[f.anchor || "nAnkle"];
      for (const k in j) { minX = Math.min(minX, j[k][0] - a[0]); maxX = Math.max(maxX, j[k][0] - a[0]); }
    }
    f.anchorX = W / 2 - (minX + maxX) / 2;
    f._ready = true;
    return f;
  }

  function frame(f, t) {
    const p = {};
    for (const k in f.A) p[k] = typeof f.A[k] === "number" ? f.A[k] + (f.B[k] - f.A[k]) * t : f.A[k];
    if (f.wave) for (const k in f.wave) p[k] = f.A[k] + f.wave[k] * Math.sin(2 * Math.PI * t);
    const j = skeleton(p);
    const anchor = f.anchor || "nAnkle";
    if (f.ik) {
      const a = j[anchor];
      for (const s of ["n", "f"]) {
        const target = [a[0] + f.handOff[s][0], a[1] + f.handOff[s][1]];
        [j[s + "Elbow"], j[s + "Hand"]] = solveArm(j.shoulder, target, 1);
      }
    }
    const dx = f.anchorX - j[anchor][0], dy = GROUND - lowest(j);
    for (const k in j) j[k] = [j[k][0] + dx, j[k][1] + dy];
    return { j, bend: p.bend || 0 };
  }

  // ---------- drawing ----------
  const pt = p => p[0].toFixed(1) + " " + p[1].toFixed(1);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const norm = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };

  // Smooth outline around a polyline with a radius at each point (a tapered limb)
  function tube(pts, rs) {
    const n = pts.length, left = [], right = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      const t = norm([b[0] - a[0], b[1] - a[1]]), no = [-t[1], t[0]];
      left.push([pts[i][0] + no[0] * rs[i], pts[i][1] + no[1] * rs[i]]);
      right.push([pts[i][0] - no[0] * rs[i], pts[i][1] - no[1] * rs[i]]);
    }
    const r0 = rs[0].toFixed(1), rn = rs[n - 1].toFixed(1);
    return "M" + left.map(pt).join(" L") +
      ` A${rn} ${rn} 0 0 0 ${pt(right[n - 1])} L` + right.reverse().map(pt).join(" L") +
      ` A${r0} ${r0} 0 0 0 ${pt(left[0])} Z`;
  }
  // a limb segment from a to b; radii given at fractions along it
  const seg = (a, b, stops) => tube(stops.map(([t]) => lerp(a, b, t)), stops.map(([, r]) => r));

  function torsoCurve(j, bend) {
    const h = j.hip, n = j.neck, d = norm([n[0] - h[0], n[1] - h[1]]);
    const front = [-d[1], d[0]];               // perpendicular, toward the chest
    // quadratic bezier hip → neck, bend pushes the middle toward the back (+) or belly (−)
    const back = [-front[0], -front[1]];
    const ctrl = [(h[0] + n[0]) / 2 + back[0] * bend * 2, (h[1] + n[1]) / 2 + back[1] * bend * 2];
    const at = t => [
      (1 - t) ** 2 * h[0] + 2 * (1 - t) * t * ctrl[0] + t * t * n[0],
      (1 - t) ** 2 * h[1] + 2 * (1 - t) * t * ctrl[1] + t * t * n[1]];
    return { at, front, d };
  }

  function arm(j, s) {
    return seg(j.shoulder, j[s + "Elbow"], [[0, 4.3], [0.4, 4.5], [1, 3.2]]) +
           seg(j[s + "Elbow"], j[s + "Hand"], [[0, 3.3], [0.3, 3.4], [1, 2.3]]) +
           seg(j[s + "Hand"], lerp(j[s + "Elbow"], j[s + "Hand"], 1.15), [[0, 2.5], [1, 2]]);
  }
  function leg(j, s) {
    const heel = lerp(j[s + "Toe"], j[s + "Ankle"], 1.25);
    return seg(j.hip, j[s + "Knee"], [[0, 6.6], [0.35, 6.4], [1, 4.4]]) +
           seg(j[s + "Knee"], j[s + "Ankle"], [[0, 4.3], [0.3, 4.7], [1, 2.6]]) +
           seg(heel, j[s + "Toe"], [[0, 2.6], [1, 2]]);
  }

  // where each focus area sits on the body: [path, radius] pairs to glow
  function focusShapes(f, j, torso) {
    const out = [];
    const onTorso = (t0, t1, side, r) => {
      const off = [torso.front[0] * side, torso.front[1] * side];
      const pts = [0, 0.5, 1].map(k => { const p = torso.at(t0 + (t1 - t0) * k); return [p[0] + off[0], p[1] + off[1]]; });
      out.push(tube(pts, [r, r * 1.1, r]));
    };
    const both = fn => { fn("n"); fn("f"); };
    for (const area of (f.focus || "").split(" ")) {
      if (area === "chest") onTorso(0.62, 0.9, 3.5, 4.6);
      if (area === "core") onTorso(0.2, 0.55, 3, 4.4);
      if (area === "back") onTorso(0.3, 0.85, -3.5, 4.4);
      if (area === "upperback") onTorso(0.65, 0.95, -3.5, 4.4);
      if (area === "glutes") onTorso(-0.02, 0.18, -4, 5.6);
      if (area === "shoulders") both(s => out.push(seg(j.shoulder, j[s + "Elbow"], [[0, 5.4], [0.4, 4.6]])));
      if (area === "arms") both(s => out.push(seg(j.shoulder, j[s + "Elbow"], [[0.2, 3.8], [0.9, 3]])));
      if (area === "thighs") both(s => out.push(seg(j.hip, j[s + "Knee"], [[0.15, 5.4], [0.85, 4]])));
      if (area === "hamstrings") both(s => out.push(seg(j.hip, j[s + "Knee"], [[0.15, 5], [0.85, 3.8]])));
      if (area === "calves") both(s => out.push(seg(j[s + "Knee"], j[s + "Ankle"], [[0.15, 4], [0.6, 3.4]])));
      if (area === "hipflexor") out.push(seg(j.hip, j.nKnee, [[0, 5.6], [0.5, 4.6]]));
    }
    return out;
  }

  function svgFor(f, j, bend, uid, pulse) {
    const torso = torsoCurve(j, bend);
    const tPts = [0, 0.2, 0.42, 0.62, 0.8, 1].map(torso.at);
    const torsoPath = tube(tPts, [7.6, 7.2, 6.6, 7.6, 8, 6.6]);
    const neckPath = seg(j.neck, j.head, [[0, 3.6], [0.6, 3.2]]);
    const H = Math.atan2(j.head[1] - j.neck[1], j.head[0] - j.neck[0]) * 180 / Math.PI + 90;
    const head = `<ellipse cx="${j.head[0].toFixed(1)}" cy="${j.head[1].toFixed(1)}" rx="6.6" ry="7.8" transform="rotate(${H.toFixed(1)} ${j.head[0].toFixed(1)} ${j.head[1].toFixed(1)})"/>`;

    // soft shadow under the figure
    let minX = Infinity, maxX = -Infinity;
    for (const k in j) { minX = Math.min(minX, j[k][0]); maxX = Math.max(maxX, j[k][0]); }
    const shadow = `<ellipse class="fig-shadow" cx="${((minX + maxX) / 2).toFixed(1)}" cy="${GROUND + 1}" rx="${((maxX - minX) / 2 + 12).toFixed(1)}" ry="3.2"/>`;

    let prop = "";
    if (f.prop === "counter" && f._counter) {
      const [x, y] = f._counter;
      prop = `<path class="fig-prop" d="M${x - 5} ${y + 2.6} h44 v${GROUND - y - 2.6} h-44 Z"/>`;
    }
    const farCls = f.front ? "fig-body" : "fig-far";
    const glow = focusShapes(f, j, torso).map(d => `<path d="${d}"/>`).join("");
    return `<defs><filter id="glow-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
      ${shadow}${prop}
      <g class="${farCls}"><path d="${arm(j, "f")}"/><path d="${leg(j, "f")}"/></g>
      <g class="fig-body">
        <path d="${torsoPath}"/><path d="${neckPath}"/>${head}
        <path class="fig-limb" d="${leg(j, "n")}"/><path class="fig-limb" d="${arm(j, "n")}"/>
      </g>
      <g class="fig-glow" style="opacity:${(0.45 + 0.35 * pulse).toFixed(2)}">
        <g filter="url(#glow-${uid})">${glow}</g><g class="fig-glow-core">${glow}</g>
      </g>`;
  }

  const ease = x => 0.5 - Math.cos(Math.PI * x) / 2;

  // Phase 0..1 of the cycle → blend 0..1 between pose A and B
  function blend(f, phase) {
    if (f.mode === "loop" || f.mode === "wave") return phase;
    const hold = (f.hold ?? 0.5) / (f.dur || 3);
    const move = 0.5 - hold;
    if (phase < hold / 2) return 0;
    if (phase < hold / 2 + move) return ease((phase - hold / 2) / move);
    if (phase < hold * 1.5 + move) return 1;
    if (phase < 1 - hold / 2) return 1 - ease((phase - hold * 1.5 - move) / move);
    return 0;
  }

  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const active = new Map(); // svg element → {f, start}
  let raf = null;

  function tick(now) {
    for (const [el, s] of active) {
      if (!el.isConnected) { active.delete(el); continue; }
      const phase = reduceMotion ? 0.5 : ((now - s.start) / 1000 / (s.f.dur || 3)) % 1;
      const { j, bend } = frame(s.f, blend(s.f, phase));
      const pulse = reduceMotion ? 1 : 0.5 + 0.5 * Math.sin(now / 1000 * Math.PI * 1.2);
      el.innerHTML = svgFor(s.f, j, bend, s.uid, pulse);
    }
    raf = active.size ? requestAnimationFrame(tick) : null;
  }

  // Public: animate the figure for `name` inside the given <svg>. Returns false if none exists.
  window.Figures = {
    has: name => !!FIGS[name],
    play(el, name) {
      const f = FIGS[name];
      if (!f) { active.delete(el); el.innerHTML = ""; return false; }
      prepare(f);
      if (f.prop === "counter") { const { j } = frame(f, 0); f._counter = j.nHand; }
      el.setAttribute("viewBox", `0 0 ${W} 130`);
      active.set(el, { f, start: performance.now(), uid: el.id || "fig" });
      if (!raf) raf = requestAnimationFrame(tick);
      return true;
    },
    stop(el) { active.delete(el); },
    // for checking poses during development: draw a still at blend t (0 = pose A, 1 = pose B)
    still(el, name, t) {
      const f = prepare(FIGS[name]);
      if (f.prop === "counter") f._counter = frame(f, 0).j.nHand;
      el.setAttribute("viewBox", `0 0 ${W} 130`);
      const { j, bend } = frame(f, t);
      el.innerHTML = svgFor(f, j, bend, "still" + Math.random().toString(36).slice(2, 7), 1);
    },
  };
})();
