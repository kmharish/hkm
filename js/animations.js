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
gsap.set(['.hero-tag','.hero-name','.hero-subtitle','.hero-desc','.hero-cta','.hero-status'], { y: 24 });

// Hero entrance
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('.hero-tag',      { opacity:1, y:0, duration:0.6, ease:'power2.out' }, 0)
  .to('.hero-name',     { opacity:1, y:0, duration:0.7, ease:'power2.out' }, 0.2)
  .to('.hero-subtitle', { opacity:1, y:0, duration:0.6, ease:'power2.out' }, 0.4)
  .to('.hero-desc',     { opacity:1, y:0, duration:0.6, ease:'power2.out' }, 0.55)
  .to('.hero-cta',      { opacity:1, y:0, duration:0.6, ease:'power2.out' }, 0.7)
  .to('.hero-status',   { opacity:1, y:0, duration:0.6, ease:'power2.out' }, 0.85);

// About section reveals
gsap.utils.toArray('.about-grid > *').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    opacity: 0, x: i === 0 ? -30 : 30, duration: 0.8, ease: 'power2.out'
  });
});

gsap.utils.toArray('.stat-box').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, y: 20, duration: 0.5, delay: i * 0.1, ease: 'power2.out'
  });
});

// Skills stagger
gsap.utils.toArray('.sk').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#skills', start: 'top 70%' },
    opacity: 1, y: 0, duration: 0.45, delay: (i % 10) * 0.06, ease: 'power2.out'
  });
});

// Projects stagger
gsap.utils.toArray('.proj').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#projects', start: 'top 70%' },
    opacity: 1, y: 0, duration: 0.55, delay: i * 0.1, ease: 'power2.out'
  });
});

// Timeline items
gsap.utils.toArray('.tl-item').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    opacity: 1, x: 0, duration: 0.65, delay: i * 0.15, ease: 'power2.out'
  });
});

// Contact links
gsap.utils.toArray('.c-link').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '#contact', start: 'top 75%' },
    opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power2.out'
  });
});

// Section title reveals
gsap.utils.toArray('.s-title').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out'
  });
});
