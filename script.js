/* ============================================================
   PHOTOGRAPHY PORTFOLIO — script.js
   All interactive functionality
   ============================================================ */

/* ─── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ─── CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    // Dot snaps
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Ring lerps
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    raf = requestAnimationFrame(animateCursor);
  }
  raf = requestAnimationFrame(animateCursor);

  // Hover expand
  document.querySelectorAll('a, button, [data-cursor-expand]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });
})();

/* ─── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile menu
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ─── HERO SLIDESHOW ─────────────────────────────────────── */
(function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, 5000); }
  function stopTimer()  { clearInterval(timer); }

  goTo(0);
  startTimer();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
  });
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(t => observer.observe(t));
})();

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const end   = parseInt(el.dataset.count);
        const dur   = 1800;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / dur, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * end) + (el.dataset.suffix || '');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── GALLERY FILTER ─────────────────────────────────────── */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.photo-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.category === cat;

        if (match) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.04}s`;
          card.style.animation = 'none';
          // Force reflow then re-add
          void card.offsetWidth;
          card.style.animation = 'fade-in 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── READ MORE / SHOW LESS ──────────────────────────────── */
(function initReadMore() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.read-more-btn');
    if (!btn) return;

    const card = btn.closest('.photo-card');
    const full = card.querySelector('.photo-card-full');
    if (!full) return;

    const isOpen = full.classList.contains('expanded');
    full.classList.toggle('expanded', !isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? 'Read More' : 'Show Less';
    // Re-add ::after via class (handled by CSS .open::after)
  });
})();

/* ─── LIGHTBOX ───────────────────────────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbCapt  = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  if (!lb) return;

  document.addEventListener('click', e => {
    const card = e.target.closest('.photo-card-img');
    if (!card) return;

    const img = card.querySelector('img');
    if (!img) return;

    const title = card.closest('.photo-card').querySelector('.photo-card-title');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    if (lbCapt && title) lbCapt.textContent = title.textContent;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 500);
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ─── BACK TO TOP ────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── FLOATING PARTICLES ─────────────────────────────────── */
(function initParticles() {
  const containers = document.querySelectorAll('.particles');
  containers.forEach(container => {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        --dur: ${5 + Math.random() * 8}s;
        --delay: ${Math.random() * 6}s;
        width: ${Math.random() < 0.5 ? 1 : 2}px;
        height: ${Math.random() < 0.5 ? 1 : 2}px;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  });
})();

/* ─── CONTACT FORM ───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const success = document.getElementById('form-success');
    form.style.display = 'none';
    if (success) success.classList.add('show');
  });
})();

/* ─── PARALLAX ───────────────────────────────────────────── */
(function initParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  if (!sections.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2) / window.innerHeight;
      const bg = section.querySelector('.parallax-bg');
      if (bg) {
        bg.style.transform = `translateY(${(offset - 0.5) * 60}px)`;
      }
    });
  }, { passive: true });
})();

/* ─── SMOOTH PAGE TRANSITIONS ────────────────────────────── */
(function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  // Links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Skip anchor links, external, and # links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('slide-in');
      setTimeout(() => {
        window.location.href = href;
      }, 550);
    });
  });

  // Animate out on page load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('slide-in');
  });
})();

/* ─── TYPED TEXT EFFECT (hero subtitle) ─────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Capturing Moments in Time',
    'Telling Stories Through Light',
    'Finding Beauty in the Ordinary',
    'Framing the World Differently'
  ];

  let pIdx = 0, cIdx = 0, deleting = false;
  const SPEED_TYPE = 60, SPEED_DEL = 35, PAUSE = 2400;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }

  // Start after loader
  setTimeout(tick, 2600);
})();
