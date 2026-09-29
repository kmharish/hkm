/* Hero motif: a slowly rotating 3D node sphere — the device fleet.
 *
 * Real 3D (Fibonacci-sphere point cloud, yaw/pitch rotation, perspective
 * projection, depth-sorted draw with distance fog) rendered through the 2D
 * canvas API rather than WebGL. No library, ~6 KB, no CDN round-trip, and it
 * runs on hardware where a WebGL context would fail to acquire.
 *
 * Restraint is the point: it reads as texture behind the headline, not as a toy.
 */

const canvas = document.getElementById('hero-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tunables ---------- */
  const NODE_COUNT = 150;
  const LINK_DIST = 0.52;   // chord distance on the unit sphere
  const MAX_LINKS = 210;
  const PACKETS = 7;
  const CAM_Z = 3.1;        // camera distance in sphere radii
  const FOCAL = 1.9;

  /* ---------- palette, read from the stylesheet so themes stay in sync ---------- */
  let palette = readPalette();

  function readPalette() {
    const s = getComputedStyle(document.documentElement);
    const get = (n, fb) => (s.getPropertyValue(n).trim() || fb);
    return {
      accent: get('--accent', '#2850e0'),
      ink: get('--ink', '#0e1116'),
      line: get('--muted', '#6b7280'),
      surface: get('--surface', '#ffffff')
    };
  }

  matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => { palette = readPalette(); });

  /* ---------- geometry: evenly spread points via the golden angle ---------- */
  const nodes = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;      // 1 → -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    nodes.push({
      x: Math.cos(th) * r,
      y,
      z: Math.sin(th) * r,
      // a few nodes read as "hubs" — slightly larger, accent-coloured
      hub: i % 17 === 0
    });
  }

  const links = [];
  outer:
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
        links.push([i, j]);
        if (links.length >= MAX_LINKS) break outer;
      }
    }
  }

  const packets = [];
  for (let i = 0; i < PACKETS; i++) {
    packets.push({
      link: links[(i * 31) % links.length],
      t: Math.random(),
      speed: 0.14 + Math.random() * 0.16
    });
  }

  /* ---------- sizing ---------- */
  let w = 0, h = 0, cx = 0, cy = 0, radius = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    radius = Math.min(w, h) * 0.44;
  }

  /* ---------- projection ---------- */
  const proj = new Array(nodes.length);

  function project(yaw, pitch) {
    const cy1 = Math.cos(yaw), sy1 = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      // rotate: yaw about Y, then pitch about X
      const x1 = n.x * cy1 + n.z * sy1;
      const z1 = -n.x * sy1 + n.z * cy1;
      const y2 = n.y * cp - z1 * sp;
      const z2 = n.y * sp + z1 * cp;

      const scale = FOCAL / (CAM_Z - z2);
      proj[i] = {
        x: cx + x1 * scale * radius,
        y: cy - y2 * scale * radius,
        z: z2,
        // 0 at the back of the sphere, 1 at the front
        depth: (z2 + 1) / 2,
        hub: n.hub
      };
    }
  }

  /* ---------- drawing ---------- */
  function frame(yaw, pitch) {
    ctx.clearRect(0, 0, w, h);
    project(yaw, pitch);

    // links first, faded hard with depth so the back of the sphere recedes
    ctx.lineWidth = 1;
    for (let k = 0; k < links.length; k++) {
      const a = proj[links[k][0]], b = proj[links[k][1]];
      const d = (a.depth + b.depth) / 2;
      const alpha = 0.05 + Math.pow(d, 2.2) * 0.45;
      ctx.strokeStyle = withAlpha(palette.line, alpha);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // nodes, painted back to front
    const order = proj.map((p, i) => i).sort((i, j) => proj[i].z - proj[j].z);
    for (const i of order) {
      const p = proj[i];
      const d = p.depth;
      const r = (p.hub ? 3.1 : 1.8) * (0.6 + d * 0.8);
      ctx.fillStyle = withAlpha(p.hub ? palette.accent : palette.ink, 0.14 + Math.pow(d, 1.8) * 0.78);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // packets in transit along the mesh
    for (const pk of packets) {
      const a = proj[pk.link[0]], b = proj[pk.link[1]];
      const x = a.x + (b.x - a.x) * pk.t;
      const y = a.y + (b.y - a.y) * pk.t;
      const d = a.depth + (b.depth - a.depth) * pk.t;
      if (d < 0.45) continue; // hidden behind the sphere
      ctx.fillStyle = withAlpha(palette.accent, Math.pow(d, 2) * 0.95);
      ctx.beginPath();
      ctx.arc(x, y, 2.8 * (0.6 + d * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function withAlpha(color, alpha) {
    const c = color.trim();
    if (c.startsWith('#')) {
      const hex = c.length === 4
        ? c[1] + c[1] + c[2] + c[2] + c[3] + c[3]
        : c.slice(1, 7);
      const n = parseInt(hex, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }
    return c; // named/other formats: use as-is rather than guess
  }

  /* ---------- loop ---------- */
  let yaw = 0.6;
  let pitch = -0.22;
  let targetPitch = -0.22;
  let running = false;
  let last = 0;

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    yaw += dt * 0.115;
    pitch += (targetPitch - pitch) * 0.05;

    for (const pk of packets) {
      pk.t += dt * pk.speed;
      if (pk.t > 1) {
        pk.t = 0;
        pk.link = links[(Math.random() * links.length) | 0];
      }
    }

    frame(yaw, pitch);
    requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }

  function stop() { running = false; }

  /* ---------- wiring ---------- */
  resize();
  frame(yaw, pitch);
  canvas.classList.add('is-ready');

  if (!reduced) {
    // gentle parallax: the sphere tilts toward the pointer, nothing more
    window.addEventListener('pointermove', (e) => {
      targetPitch = -0.22 + ((e.clientY / window.innerHeight) - 0.5) * 0.5;
    }, { passive: true });

    // only animate while the hero is actually on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? start() : stop();
      }, { threshold: 0.05 }).observe(canvas);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  }

  const ro = new ResizeObserver(() => {
    resize();
    frame(yaw, pitch);
  });
  ro.observe(canvas);
}
