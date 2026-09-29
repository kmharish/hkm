/* Page interactions: scroll reveals, count-up stats, nav state.
   No dependencies. Everything degrades to a fully readable page if JS is off. */

(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var $$ = function (sel) {
      return Array.prototype.slice.call(document.querySelectorAll(sel));
    };

    /* ---------- current year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------- scroll reveals ---------- */
    var reveals = $$('.reveal');
    var show = function (el) { el.classList.add('is-in'); };

    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(show);
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          show(e.target);
          io.unobserve(e.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

      reveals.forEach(function (el) { io.observe(el); });

      // Safety net: never leave content invisible if the observer misfires.
      setTimeout(function () { reveals.forEach(show); }, 2500);
    }

    /* ---------- count-up stats ---------- */
    function countUp(el, target, suffix, duration) {
      var start = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    $$('[data-count-to]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var suffix = el.getAttribute('data-count-suffix') || '';

      if (reduced || !('IntersectionObserver' in window)) {
        el.textContent = target + suffix;
        return;
      }

      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io2.unobserve(e.target);
          countUp(el, target, suffix, 1100);
        });
      }, { threshold: 0.5 });
      io2.observe(el);
    });

    /* ---------- nav: border on scroll + section highlight ---------- */
    var nav = document.getElementById('nav');
    var onScroll = function () {
      if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var links = $$('.nav__link');
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }
  });
})();
