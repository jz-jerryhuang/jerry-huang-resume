/* ============================================================
   Jerry Huang — Interactive Résumé · main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('jzh-theme');
  if (saved) root.setAttribute('data-theme', saved);
  themeToggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('jzh-theme', next);
  });

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById('nav');
  const onScroll = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav__links');
  burger.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav__link')) {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active section in nav ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const sections = navLinks.map(function (l) { return document.querySelector(l.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Expandable timeline items ---------- */
  document.querySelectorAll('.tl-item__header').forEach(function (header) {
    header.addEventListener('click', function () {
      const item = header.closest('.tl-item');
      const open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!open));
      header.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const runCounter = function (el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1400;
    const start = performance.now();
    const step = function (now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---------- Hero canvas: subtle particle network ---------- */
  const canvas = document.getElementById('heroCanvas');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && canvas.getContext && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles, raf;
    const COUNT = 56, LINK_DIST = 130;

    const accent = function () {
      return getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00d6c2';
    };

    const resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = function () {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
        });
      }
    };

    const draw = function () {
      ctx.clearRect(0, 0, w, h);
      const col = accent();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.globalAlpha = 0.55; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = col; ctx.globalAlpha = 0.12 * (1 - dist / LINK_DIST);
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const start = function () { resize(); init(); cancelAnimationFrame(raf); draw(); };
    window.addEventListener('resize', function () { resize(); init(); });
    start();
  }
})();
