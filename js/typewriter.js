// ─── TYPEWRITER EFFECT ────────────────────────────────────────────
const phrases = [
  'Software Engineer',
  'IoT Backend Developer',
  'Associate Tech Lead',
  'Spring Boot Engineer',
  'Cloud-Native Builder',
];
let pi = 0, ci = 0, deleting = false;
const typed = document.getElementById('typed');

function typeLoop() {
  const phrase = phrases[pi % phrases.length];
  if (!deleting) {
    typed.textContent = phrase.slice(0, ci + 1);
    ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typed.textContent = phrase.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; pi++; setTimeout(typeLoop, 300); return; }
  }
  setTimeout(typeLoop, deleting ? 55 : 90);
}
setTimeout(typeLoop, 1200);
