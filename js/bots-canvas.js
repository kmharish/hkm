// ─── IoT BOTS CANVAS (About Section) ─────────────────────────────
(function () {
  const bc = document.getElementById('bots-canvas');
  const ctx = bc.getContext('2d');
  const W = 420, H = 420;
  bc.width = W; bc.height = H;

  const CYAN = '#00e5cc';
  const PINK = '#ff2d78';
  const BLUE = '#00aaff';
  const GOLD = '#f0c040';

  // Bot definitions — fixed positions in a network topology
  const bots = [
    { x: 210, y: 210, r: 22, col: CYAN, label: 'HUB',   type: 'hub'     },
    { x: 100, y: 100, r: 15, col: CYAN, label: 'DEV-1', type: 'device'  },
    { x: 330, y: 95,  r: 15, col: BLUE, label: 'DEV-2', type: 'device'  },
    { x: 355, y: 250, r: 15, col: CYAN, label: 'DEV-3', type: 'device'  },
    { x: 310, y: 360, r: 15, col: PINK, label: 'DEV-4', type: 'device'  },
    { x: 130, y: 360, r: 15, col: BLUE, label: 'DEV-5', type: 'device'  },
    { x: 60,  y: 250, r: 15, col: CYAN, label: 'DEV-6', type: 'device'  },
    { x: 210, y: 60,  r: 12, col: GOLD, label: 'GW',    type: 'gateway' },
    { x: 210, y: 370, r: 12, col: GOLD, label: 'GW',    type: 'gateway' },
  ];

  // Edges between bots
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
    [1,7],[2,7],[7,3],
    [5,8],[4,8],[6,8],
    [1,6],[2,3],[4,5],
  ];

  // Data packets travelling along edges
  const pkts = edges.map((e, i) => ({
    edge: e,
    t: Math.random(),
    speed: 0.004 + Math.random() * 0.007,
    col: [CYAN, PINK, BLUE, GOLD][i % 4],
    dir: Math.random() > 0.5 ? 1 : -1,
    active: Math.random() > 0.35,
  }));

  // Pulse rings per bot
  const pulses = bots.map(() => ({ r: 0, alpha: 0, timer: Math.random() * 120 }));

  // Speech-bubble "messages" popping from bots
  const MSGS = ['OTA_OK', 'FW:v4.2', 'PING', 'ACK', 'STATUS', 'SYNC', '0xFF', 'TX→'];
  const bubbles = [];

  let frame = 0;

  function spawnBubble() {
    const bi = 1 + Math.floor(Math.random() * (bots.length - 1));
    bubbles.push({ bi, msg: MSGS[Math.floor(Math.random() * MSGS.length)], life: 0, maxLife: 90, alpha: 0 });
  }

  function drawBot(b, t) {
    const pulse = 0.6 + 0.4 * Math.sin(t * 2 + bots.indexOf(b) * 0.8);

    if (b.type === 'hub') {
      // Outer glow ring
      const g = ctx.createRadialGradient(b.x, b.y, b.r * 0.5, b.x, b.y, b.r * 2.5);
      g.addColorStop(0, b.col + '55');
      g.addColorStop(1, b.col + '00');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Body hexagon
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(t * 0.3);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = Math.cos(a) * b.r, py = Math.sin(a) * b.r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.fillStyle = b.col + '18';
      ctx.fill();
      ctx.restore();

      // Inner dot
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = b.col;
      ctx.globalAlpha = pulse;
      ctx.fill();

      // Antenna
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - b.r);
      ctx.lineTo(b.x, b.y - b.r - 14);
      ctx.lineTo(b.x + 8, b.y - b.r - 22);
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x + 8, b.y - b.r - 22, 3, 0, Math.PI * 2);
      ctx.fillStyle = PINK;
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4);
      ctx.fill();

    } else if (b.type === 'gateway') {
      // Diamond shape
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(t * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, -b.r); ctx.lineTo(b.r, 0);
      ctx.lineTo(0, b.r);  ctx.lineTo(-b.r, 0);
      ctx.closePath();
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.fillStyle = b.col + '22';
      ctx.fill();
      ctx.restore();

    } else {
      // Device — small square body with antenna
      const s = b.r;
      ctx.save();
      ctx.translate(b.x, b.y);

      // Body
      ctx.beginPath();
      ctx.roundRect(-s * 0.75, -s * 0.55, s * 1.5, s * 1.1, 3);
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.85 * pulse;
      ctx.stroke();
      ctx.fillStyle = b.col + '14';
      ctx.fill();

      // Screen (tiny rect inside)
      ctx.fillStyle = b.col + '55';
      ctx.globalAlpha = pulse * 0.7;
      ctx.fillRect(-s * 0.42, -s * 0.35, s * 0.84, s * 0.5);

      // Antenna
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55);
      ctx.lineTo(0, -s * 1.2);
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      // Antenna tip blink
      ctx.beginPath();
      ctx.arc(0, -s * 1.25, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = b.col;
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 3 + bots.indexOf(b) * 1.3));
      ctx.fill();

      ctx.restore();
    }

    ctx.globalAlpha = 1;

    // Label
    ctx.font = `bold 9px 'Share Tech Mono', monospace`;
    ctx.fillStyle = b.col;
    ctx.globalAlpha = 0.65;
    ctx.textAlign = 'center';
    ctx.fillText(b.label, b.x, b.y + b.r + 13);
    ctx.globalAlpha = 1;
  }

  function drawFrame(ts) {
    frame++;
    const t = ts / 1000;
    ctx.clearRect(0, 0, W, H);

    // Background grid dots
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = CYAN;
    for (let gx = 20; gx < W; gx += 35) {
      for (let gy = 20; gy < H; gy += 35) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Draw edges
    edges.forEach(([a, b]) => {
      const ba = bots[a], bb = bots[b];
      const grd = ctx.createLinearGradient(ba.x, ba.y, bb.x, bb.y);
      grd.addColorStop(0, ba.col + '55');
      grd.addColorStop(1, bb.col + '55');
      ctx.beginPath();
      ctx.moveTo(ba.x, ba.y);
      ctx.lineTo(bb.x, bb.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw pulse rings
    pulses.forEach((p, i) => {
      p.timer--;
      if (p.timer <= 0) { p.r = 0; p.alpha = 0.8; p.timer = 80 + Math.random() * 120; }
      if (p.alpha > 0) {
        p.r  += 1.2;
        p.alpha -= 0.013;
        const b = bots[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r + p.r, 0, Math.PI * 2);
        ctx.strokeStyle = b.col;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw packets
    pkts.forEach(pk => {
      if (!pk.active) { if (Math.random() < 0.003) pk.active = true; return; }
      pk.t += pk.speed * pk.dir;
      if (pk.t > 1) { pk.t = 1; pk.dir = -1; if (Math.random() < 0.4) pk.active = false; }
      if (pk.t < 0) { pk.t = 0; pk.dir =  1; if (Math.random() < 0.4) pk.active = false; }
      const ba = bots[pk.edge[0]], bb = bots[pk.edge[1]];
      const px = ba.x + (bb.x - ba.x) * pk.t;
      const py = ba.y + (bb.y - ba.y) * pk.t;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = pk.col;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      // glow
      const g2 = ctx.createRadialGradient(px, py, 0, px, py, 9);
      g2.addColorStop(0, pk.col + 'aa');
      g2.addColorStop(1, pk.col + '00');
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fillStyle = g2;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw bots
    bots.forEach(b => drawBot(b, t));

    // Spawn + draw bubbles
    if (frame % 100 === 0) spawnBubble();
    for (let bi = bubbles.length - 1; bi >= 0; bi--) {
      const bub = bubbles[bi];
      bub.life++;
      bub.alpha = bub.life < 15 ? bub.life / 15 : bub.life > bub.maxLife - 15 ? (bub.maxLife - bub.life) / 15 : 1;
      if (bub.life > bub.maxLife) { bubbles.splice(bi, 1); continue; }
      const bot = bots[bub.bi];
      const bx = bot.x + bot.r + 6;
      const by = bot.y - bot.r - 8;
      ctx.save();
      ctx.globalAlpha = bub.alpha * 0.9;
      // bubble bg
      ctx.fillStyle = '#04080f';
      ctx.strokeStyle = bot.col;
      ctx.lineWidth = 1;
      const tw = ctx.measureText(bub.msg).width + 12;
      ctx.beginPath();
      ctx.roundRect(bx, by - 13, tw, 18, 3);
      ctx.fill();
      ctx.stroke();
      // tail
      ctx.beginPath();
      ctx.moveTo(bx, by + 3);
      ctx.lineTo(bx - 5, by + 8);
      ctx.lineTo(bx + 4, by + 5);
      ctx.closePath();
      ctx.fillStyle = '#04080f';
      ctx.fill();
      ctx.strokeStyle = bot.col;
      ctx.stroke();
      // text
      ctx.font = `8px 'Share Tech Mono', monospace`;
      ctx.fillStyle = bot.col;
      ctx.textAlign = 'left';
      ctx.fillText(bub.msg, bx + 6, by + 1);
      ctx.restore();
    }

    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
})();
