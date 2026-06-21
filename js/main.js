/* ═══════════════════════════════════════════
   NULL v4 — JS
   Catalogue interactions, overlay, terminal,
   pixel lace, cursor, transitions
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Loader
  const loader = document.querySelector('.loader');
  if (loader) setTimeout(() => loader.classList.add('done'), 900);

  // ── Active cmd link
  const pg = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.cmd__link').forEach(l => {
    const h = l.getAttribute('href');
    if (h === pg || (pg === '' && h === 'index.html') ||
        (l.dataset.overlay && pg === 'index.html')) {
      // Don't auto-activate overlay links
      if (!l.dataset.overlay) l.classList.add('active');
    }
    if (h === pg) l.classList.add('active');
  });

  // ── Reveals
  if (RM) {
    document.querySelectorAll('.reveal, .stagger > *').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none'; el.classList.add('in');
    });
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal, .stagger').forEach(el => obs.observe(el));
  }

  // ── Stagger delay via CSS custom property
  document.querySelectorAll('.stagger').forEach(stag => {
    Array.from(stag.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  // ═════════════════════════════════════════
  // PIXEL LACE ENGINE
  // ═════════════════════════════════════════
  const AC = [196, 43, 43];
  const AC_D = [138, 30, 30];

  const BORDER_TRIM = [
    [1,0,1,0,1,0,1,0],
    [0,1,0,0,0,1,0,0],
    [1,0,0,2,0,0,1,0],
    [0,0,2,2,2,0,0,1],
    [1,0,0,2,0,0,1,0],
    [0,1,0,0,0,1,0,0],
    [1,0,1,0,1,0,1,0],
  ];

  const FLORAL = [
    [0,0,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,2,2,1,0,0,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,1,2,0,1,1,0,2,1,0,0],
    [0,1,2,0,1,0,0,1,0,2,1,0],
    [1,2,0,1,0,0,0,0,1,0,2,1],
    [1,2,0,1,0,0,0,0,1,0,2,1],
    [0,1,2,0,1,0,0,1,0,2,1,0],
    [0,0,1,2,0,1,1,0,2,1,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,0,0,1,2,2,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0],
  ];

  function drawPx(ctx, pattern, x, y, ps, progress) {
    const rows = pattern.length, cols = pattern[0].length;
    const total = rows * cols;
    const vis = Math.floor(total * (progress || 1));
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pattern[r][c] > 0) {
          n++;
          if (n > vis) return;
          const col = pattern[r][c] === 1 ? AC : AC_D;
          const a = pattern[r][c] === 1 ? 0.9 : 0.5;
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
          ctx.fillRect(x + c * ps, y + r * ps, ps, ps);
        }
      }
    }
  }

  // ── Lace stitch-in borders
  function initLaceStitch() {
    if (RM) return;
    document.querySelectorAll('.lace-stitch').forEach(el => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;height:14px;display:block;image-rendering:pixelated;';
      el.appendChild(canvas);
      let prog = 0, tgt = 0;

      const sObs = new IntersectionObserver(entries => {
        entries.forEach(e => { tgt = e.isIntersecting ? 1 : 0; });
      }, { threshold: 0.1 });
      sObs.observe(el);

      function anim() {
        prog += (tgt - prog) * 0.04;
        const r = el.getBoundingClientRect();
        canvas.width = r.width; canvas.height = 14;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, 14);
        const tw = 16;
        const total = Math.ceil(canvas.width / tw);
        const vis = Math.floor(total * prog);
        for (let i = 0; i < vis; i++) drawPx(ctx, BORDER_TRIM, i * tw, 0, 2, 1);
        if (prog > 0 && prog < 1) drawPx(ctx, BORDER_TRIM, vis * tw, 0, 2, (total * prog) - vis);
        requestAnimationFrame(anim);
      }
      anim();
    });
  }

  // ── Catalogue row expand/collapse
  function initCatalogue() {
    document.querySelectorAll('.catalogue__row').forEach(row => {
      row.addEventListener('click', () => {
        const detail = row.nextElementSibling;
        if (!detail || !detail.classList.contains('catalogue__detail')) return;

        const wasOpen = detail.classList.contains('open');
        // Close all
        document.querySelectorAll('.catalogue__detail.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.catalogue__row--expanded').forEach(r => r.classList.remove('catalogue__row--expanded'));

        if (!wasOpen) {
          detail.classList.add('open');
          row.classList.add('catalogue__row--expanded');
        }
      });
    });
  }

  // ── About overlay
  function initOverlay() {
    const aboutLink = document.querySelector('[data-overlay="about"]');
    const overlay = document.getElementById('about-overlay');
    const closeBtn = overlay?.querySelector('.overlay__close');

    if (aboutLink && overlay) {
      aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ── Custom cursor
  function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor || window.innerWidth <= 768) return;
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function upd() {
      cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
      cursor.style.left = Math.floor(cx) + 'px';
      cursor.style.top = Math.floor(cy) + 'px';
      requestAnimationFrame(upd);
    }
    upd();
    document.querySelectorAll('a, button, .catalogue__row, .roster-panel').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ── Ambient floating lace particles on catalogue page
  function initAmbientLace() {
    const canvas = document.getElementById('ambient-lace');
    if (!canvas || RM) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.2, vy: -Math.random() * 0.3 - 0.05,
        size: Math.random() > 0.5 ? 2 : 1,
        alpha: Math.random() * 0.25 + 0.05,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, w, h);
      frame++;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.015;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        ctx.globalAlpha = p.alpha * (0.4 + 0.6 * Math.sin(p.pulse));
        ctx.fillStyle = `rgb(${AC[0]},${AC[1]},${AC[2]})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });

      // Subtle floral motif floating
      if (frame % 2 === 0) {
        ctx.globalAlpha = 0.04 + 0.02 * Math.sin(frame * 0.01);
        const fx = (w / 2) + Math.sin(frame * 0.003) * 200;
        const fy = (h / 2) + Math.cos(frame * 0.004) * 150;
        drawPx(ctx, FLORAL, fx, fy, 3, 1);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ── Page transitions
  const transition = document.querySelector('.page-transition');
  if (transition && !RM) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !link.dataset.overlay) {
        link.addEventListener('click', e => {
          e.preventDefault();
          document.body.style.filter = 'invert(1)';
          setTimeout(() => document.body.style.filter = '', 40);
          setTimeout(() => {
            transition.style.transformOrigin = 'bottom';
            transition.style.transform = 'scaleY(1)';
            transition.style.transition = 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)';
          }, 60);
          setTimeout(() => window.location.href = href, 400);
        });
      }
    });
    window.addEventListener('pageshow', () => {
      transition.style.transformOrigin = 'top';
      transition.style.transform = 'scaleY(0)';
      transition.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.05s';
    });
  }

  // ── Filters (releases page uses catalogue with filters)
  const fBtns = document.querySelectorAll('[data-filter]');
  const fRows = document.querySelectorAll('[data-cat]');
  if (fBtns.length > 0 && fRows.length > 0) {
    fBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        fBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        fRows.forEach(row => {
          const show = f === 'all' || row.dataset.cat === f;
          row.style.transition = 'opacity 0.3s, max-height 0.3s';
          row.style.opacity = show ? '1' : '0';
          row.style.maxHeight = show ? '200px' : '0';
          row.style.overflow = 'hidden';
          if (show) setTimeout(() => { row.style.maxHeight = ''; row.style.overflow = ''; }, 300);
        });
      });
    });
  }

  // ── Contact form
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      if (btn) { btn.textContent = '> SENT'; setTimeout(() => { btn.textContent = 'SEND MESSAGE'; form.reset(); }, 3000); }
    });
  }

  // ── Init
  initLaceStitch();
  initCatalogue();
  initOverlay();
  initCursor();
  initAmbientLace();
});
