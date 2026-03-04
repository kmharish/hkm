// ─── GSAP SCROLL ANIMATIONS ───────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Nav scroll style
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => {
    document.getElementById('navbar').classList.toggle('scrolled', self.scroll() > 80);
  }
});

// Set initial states
gsap.set(['.hero-tag','.hero-name','.hero-subtitle','.hero-desc','.hero-cta','.hero-status'], { y: 50, opacity: 0 });

// Hero entrance
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('.hero-tag',      { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0)
  .to('.hero-name',     { opacity:1, y:0, duration:0.9, ease:'power3.out' }, 0.18)
  .to('.hero-subtitle', { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.4)
  .to('.hero-desc',     { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.58)
  .to('.hero-cta',      { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.74)
  .to('.hero-status',   { opacity:1, y:0, duration:0.7, ease:'power3.out' }, 0.9);

// About section reveals
gsap.utils.toArray('.about-grid > *').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 82%' },
    opacity: 0, x: i === 0 ? -60 : 60, duration: 1.0, ease: 'power3.out'
  });
});

gsap.utils.toArray('.stat-box').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 90%' },
    opacity: 0, y: 40, duration: 0.65, delay: i * 0.12, ease: 'power3.out'
  });
});

// Section labels + titles
gsap.utils.toArray('.s-label').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, y: 20, duration: 0.55, ease: 'power2.out'
  });
});

gsap.utils.toArray('.s-title').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    opacity: 0, y: 50, duration: 0.85, ease: 'power3.out'
  });
});

// Skills stagger
gsap.utils.toArray('.sk').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#skills', start: 'top 72%' },
    opacity: 1, y: 0, duration: 0.55, delay: (i % 10) * 0.07, ease: 'power3.out'
  });
});

// Projects stagger
gsap.utils.toArray('.proj').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#projects', start: 'top 72%' },
    opacity: 1, y: 0, duration: 0.65, delay: i * 0.12, ease: 'power3.out'
  });
});

// Timeline items
gsap.utils.toArray('.tl-item').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 82%' },
    opacity: 1, x: 0, duration: 0.75, delay: i * 0.15, ease: 'power3.out'
  });
});

// Contact links
gsap.utils.toArray('.c-link').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 1, y: 0, duration: 0.6, delay: i * 0.12, ease: 'power3.out'
  });
});
