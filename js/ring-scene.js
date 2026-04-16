// ─── 3D TORUS RING — Hero (pixelates on scroll) ───────────────────
(function () {
  const canvas = document.getElementById('ring-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  let fullW = window.innerWidth;
  let fullH = window.innerHeight;
  renderer.setSize(fullW, fullH);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, fullW / fullH, 0.1, 100);
  camera.position.set(0, 0, 16);

  // ── Lighting (warm palette) ─────────────────────────────────────

  // Soft warm ambient
  scene.add(new THREE.AmbientLight(0xccaa88, 0.5));

  // Key light: warm white from upper-left-front
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.0);
  keyLight.position.set(-5, 7, 9);
  scene.add(keyLight);

  // Fill light: terracotta tint from right
  const fillLight = new THREE.DirectionalLight(0xc96442, 1.0);
  fillLight.position.set(7, -2, 5);
  scene.add(fillLight);

  // Rim light: warm dark from behind
  const rimLight = new THREE.DirectionalLight(0x331a0a, 1.0);
  rimLight.position.set(0, -6, -8);
  scene.add(rimLight);

  // ── Torus geometry ──────────────────────────────────────────────
  const geo = new THREE.TorusGeometry(5, 1.05, 32, 128);
  const mat = new THREE.MeshPhongMaterial({
    color:     0x8a4528,   // dark terracotta / bronze
    specular:  0xddaa77,   // warm gold specular highlight
    shininess: 180,
    emissive:  0x1a0f08,   // very dark warm glow
  });

  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI * 0.12;
  scene.add(ring);

  // ── Mouse parallax ──────────────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Scroll tracking ─────────────────────────────────────────────
  let scrollRatio  = 0;
  let pixelScale   = 1;

  window.addEventListener('scroll', () => {
    scrollRatio = window.scrollY / window.innerHeight;
  }, { passive: true });

  window.addEventListener('resize', () => {
    fullW = window.innerWidth;
    fullH = window.innerHeight;
    camera.aspect = fullW / fullH;
    camera.updateProjectionMatrix();
    if (pixelScale <= 1.5) renderer.setSize(fullW, fullH);
  });

  // ── Render loop ─────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    ring.rotation.y  = t * 0.55;
    ring.rotation.z  = Math.sin(t * 0.18) * 0.07;
    ring.rotation.x += (Math.PI * 0.12 + mouse.y * 0.12 - ring.rotation.x) * 0.04;

    // ── Pixelation ──────────────────────────────────────────────
    const scrollIn      = Math.max(0, scrollRatio - 0.06);
    const targetScale   = 1 + scrollIn * scrollIn * 36;
    pixelScale         += (targetScale - pixelScale) * 0.1;

    // ── Opacity — fade out as ring leaves the hero ───────────────
    const opacity = Math.max(0, 1 - Math.max(0, scrollRatio - 0.08) * 4.2);
    canvas.style.opacity = opacity;

    if (opacity <= 0.01) {
      canvas.style.visibility = 'hidden';
      return;
    }
    canvas.style.visibility = 'visible';

    const ps = Math.max(1, Math.round(pixelScale));
    const rw = Math.max(8, Math.floor(fullW / ps));
    const rh = Math.max(8, Math.floor(fullH / ps));

    renderer.setSize(rw, rh, false);
    canvas.style.width  = fullW + 'px';
    canvas.style.height = fullH + 'px';

    renderer.render(scene, camera);
  }

  animate();
})();
