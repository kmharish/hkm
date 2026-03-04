// ─── THREE.JS IoT NODE NETWORK (Hero Background) ─────────────────
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 28);

const NODE_COUNT = 110;
const CONNECT_DIST = 10;
const nodeData = [];

// Light-theme palette: navy, blue, sky
const navyMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
const blueMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
const skyMat  = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const nodeGeo = new THREE.SphereGeometry(0.18, 6, 6);
const palettes = [navyMat, navyMat, navyMat, blueMat, blueMat, skyMat];

for (let i = 0; i < NODE_COUNT; i++) {
  const mat = palettes[Math.floor(Math.random() * palettes.length)];
  const mesh = new THREE.Mesh(nodeGeo, mat.clone());
  mesh.position.set(
    (Math.random() - 0.5) * 70,
    (Math.random() - 0.5) * 45,
    (Math.random() - 0.5) * 35
  );
  scene.add(mesh);
  nodeData.push({
    mesh,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.4 + Math.random() * 0.8,
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.008
    )
  });
}

const LINE_PAIRS = [];
const lineMat = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.18 });

for (let i = 0; i < NODE_COUNT; i++) {
  for (let j = i + 1; j < NODE_COUNT; j++) {
    const d = nodeData[i].mesh.position.distanceTo(nodeData[j].mesh.position);
    if (d < CONNECT_DIST) {
      const pts = [nodeData[i].mesh.position.clone(), nodeData[j].mesh.position.clone()];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, lineMat.clone());
      scene.add(line);
      LINE_PAIRS.push({ line, i, j, geo });
    }
  }
}

const mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  nodeData.forEach(n => {
    n.mesh.position.addScaledVector(n.vel, 1);
    ['x','y','z'].forEach(ax => {
      const lim = ax === 'z' ? 17 : (ax === 'y' ? 22 : 35);
      if (Math.abs(n.mesh.position[ax]) > lim) n.vel[ax] *= -1;
    });
    const pulse = 0.5 + 0.5 * Math.sin(t * n.pulseSpeed + n.phase);
    n.mesh.material.opacity = 0.3 + 0.5 * pulse;
    n.mesh.material.transparent = true;
    const s = 0.7 + 0.5 * pulse;
    n.mesh.scale.setScalar(s);
  });

  LINE_PAIRS.forEach(({ line, i, j, geo }) => {
    const a = nodeData[i].mesh.position;
    const b = nodeData[j].mesh.position;
    const d = a.distanceTo(b);
    const vis = d < CONNECT_DIST;
    line.visible = vis;
    if (vis) {
      line.material.opacity = (1 - d / CONNECT_DIST) * 0.2;
      const pos = geo.attributes.position;
      pos.setXYZ(0, a.x, a.y, a.z);
      pos.setXYZ(1, b.x, b.y, b.z);
      pos.needsUpdate = true;
    }
  });

  camera.position.x += (mouse.x * 3 - camera.position.x) * 0.03;
  camera.position.y += (mouse.y * 2 - camera.position.y) * 0.03;
  scene.rotation.y = t * 0.02;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
