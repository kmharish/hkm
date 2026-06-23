// Portfolio interactions: scroll reveals + count-up stats.
// Ported from the Claude Design component (Portfolio.dc.html) to vanilla JS.

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- scroll reveals ---
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var show = function (el) { el.classList.add('in'); };

    if (!prefersReduced && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
      // safety: reveal anything still hidden after 1.2s (above-fold timing)
      setTimeout(function () {
        els.forEach(function (el) { if (!el.classList.contains('in')) show(el); });
      }, 1200);
    } else {
      els.forEach(show);
    }

    // --- count-up stats ---
    var counters = Array.prototype.slice.call(
      document.querySelectorAll('[data-count-to]')
    );

    var animate = function (el, target, suffix, dur) {
      var start = performance.now();
      var tick = function (now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var suffix = el.getAttribute('data-count-suffix') || '';
      if (prefersReduced) { el.textContent = target + suffix; return; }

      var fired = false;
      var run = function () { if (fired) return; fired = true; animate(el, target, suffix, 1000); };

      if ('IntersectionObserver' in window) {
        var io2 = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { run(); io2.unobserve(e.target); }
          });
        }, { threshold: 0.4 });
        io2.observe(el);
        setTimeout(run, 1400); // safety for above-fold
      } else {
        run();
      }
    });
  });
})();
