// ─── HIGHLIGHT RIBBON TICKER ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hl-ticker').forEach((el, colIdx) => {
    const items = el.dataset.items.split(',').map(s => s.trim());
    let current = 0;

    const value = document.createElement('span');
    value.className = 'hl-ticker-value';
    value.textContent = items[0];
    el.appendChild(value);

    function cycle() {
      // Slide current item out upward
      value.style.transition = 'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease';
      value.style.transform = 'translateY(-110%)';
      value.style.opacity = '0';

      setTimeout(() => {
        current = (current + 1) % items.length;
        value.textContent = items[current];

        // Snap to below without transition, then animate in
        value.style.transition = 'none';
        value.style.transform = 'translateY(110%)';
        value.style.opacity = '0';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            value.style.transition = 'transform 0.46s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease';
            value.style.transform = 'translateY(0)';
            value.style.opacity = '1';
          });
        });
      }, 380);
    }

    // Stagger each column so they don't all flip at once
    setTimeout(() => {
      setInterval(cycle, 2800);
    }, colIdx * 700);
  });
});
