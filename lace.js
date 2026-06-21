// PixelLace — Cross-stitch ornament rendering system
const PixelLace = {
  color: '#c42b2b',
  colorDim: 'rgba(196, 43, 43, 0.15)',
  px: 4,        // pixel/stitch size
  gap: 1,       // gap between stitches (gives the cross-stitch look)

  // Pattern definitions: 1 = stitch, 0 = empty
  patterns: {
    // Single cross-stitch X (5x5)
    stitch: [
      [1,0,0,0,1],
      [0,1,0,1,0],
      [0,0,1,0,0],
      [0,1,0,1,0],
      [1,0,0,0,1],
    ],

    // Diamond doily ornament (16x16, radially symmetric)
    doily: [
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0],
      [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0],
      [0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
      [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1],
      [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1],
      [0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
      [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0],
      [0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0],
      [0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0],
      [0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    ],

    // Rose/floral motif (10x10)
    rose: [
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,0,0,1,1,0,0],
      [0,1,1,0,1,1,0,1,1,0],
      [1,1,0,1,0,0,1,0,1,1],
      [1,1,0,1,0,0,1,0,1,1],
      [0,1,1,0,1,1,0,1,1,0],
      [0,0,1,1,0,0,1,1,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,0,0,0,0],
    ],

    // Horizontal border strip (5 rows, 16 cols repeating)
    borderH: [
      [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    ],

    // Corner ornament (10x10, for top-left — flip for others)
    corner: [
      [1,1,1,1,1,1,1,1,0,0],
      [1,0,0,0,0,0,0,1,0,0],
      [1,0,1,0,1,0,0,0,1,0],
      [1,0,0,1,0,1,0,0,0,0],
      [1,0,1,0,1,0,0,0,0,0],
      [1,0,0,1,0,0,1,0,0,0],
      [1,0,0,0,0,1,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
    ],

    // Large ornamental frame corner (12x12)
    frameCorner: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,0,0,1],
      [1,0,0,1,0,1,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,0,0,0,0,0],
      [1,0,0,1,0,1,0,0,0,0,0,0],
      [1,0,1,0,1,0,0,0,0,0,0,0],
      [1,0,0,1,0,0,0,0,0,0,0,0],
      [1,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,0,0,0,0,0,0,0,0,0],
    ],
  },

  // Render a pattern to a canvas at given pixel size
  renderPattern(pattern, ps, color) {
    const c = document.createElement('canvas');
    c.width = pattern[0].length * ps;
    c.height = pattern.length * ps;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color || this.color;
    const g = this.gap;
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x]) {
          ctx.fillRect(x * ps, y * ps, ps - g, ps - g);
        }
      }
    }
    return c;
  },

  // Render a pattern flipped
  renderFlipped(pattern, ps, color, flipX, flipY) {
    const c = document.createElement('canvas');
    const w = pattern[0].length;
    const h = pattern.length;
    c.width = w * ps;
    c.height = h * ps;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color || this.color;
    const g = this.gap;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (pattern[y][x]) {
          const px = flipX ? (w - 1 - x) : x;
          const py = flipY ? (h - 1 - y) : y;
          ctx.fillRect(px * ps, py * ps, ps - g, ps - g);
        }
      }
    }
    return c;
  },

  // Animate a frame being stitched around an element
  animateFrame(container, duration) {
    const canvas = document.createElement('canvas');
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated;z-index:5;';
    container.style.position = 'relative';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const ps = this.px;
    const color = this.color;
    const g = this.gap;
    const stitches = [];
    const pad = 16; // padding from edge

    // Build stitch list: border + corner ornaments
    // Top edge
    for (let x = pad; x < w - pad; x += ps * 4) {
      const pattern = this.patterns.stitch;
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          if (pattern[py][px]) {
            stitches.push({ x: x + px * ps, y: pad + py * ps });
          }
        }
      }
    }
    // Right edge
    for (let y = pad; y < h - pad; y += ps * 4) {
      const pattern = this.patterns.stitch;
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          if (pattern[py][px]) {
            stitches.push({ x: w - pad - pattern[0].length * ps + px * ps, y: y + py * ps });
          }
        }
      }
    }
    // Bottom edge
    for (let x = w - pad; x > pad; x -= ps * 4) {
      const pattern = this.patterns.stitch;
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          if (pattern[py][px]) {
            stitches.push({ x: x - pattern[0].length * ps + px * ps, y: h - pad - pattern.length * ps + py * ps });
          }
        }
      }
    }
    // Left edge
    for (let y = h - pad; y > pad; y -= ps * 4) {
      const pattern = this.patterns.stitch;
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          if (pattern[py][px]) {
            stitches.push({ x: pad + px * ps, y: y - pattern.length * ps + py * ps });
          }
        }
      }
    }

    // Corner ornaments (frameCorner pattern at each corner)
    const fc = this.patterns.frameCorner;
    const corners = [
      { ox: pad, oy: pad, fx: false, fy: false },
      { ox: w - pad - fc[0].length * ps, oy: pad, fx: true, fy: false },
      { ox: pad, oy: h - pad - fc.length * ps, fx: false, fy: true },
      { ox: w - pad - fc[0].length * ps, oy: h - pad - fc.length * ps, fx: true, fy: true },
    ];
    corners.forEach(c => {
      for (let y = 0; y < fc.length; y++) {
        for (let x = 0; x < fc[y].length; x++) {
          if (fc[y][x]) {
            const px = c.fx ? (fc[0].length - 1 - x) : x;
            const py = c.fy ? (fc.length - 1 - y) : y;
            stitches.push({ x: c.ox + px * ps, y: c.oy + py * ps, corner: true });
          }
        }
      }
    });

    // Animate: draw stitches progressively
    let i = 0;
    const perFrame = Math.max(1, Math.floor(stitches.length / (duration / 16)));
    const dimColor = this.colorDim;

    function draw() {
      for (let j = 0; j < perFrame && i < stitches.length; j++, i++) {
        const s = stitches[i];
        ctx.fillStyle = s.corner ? color : color;
        ctx.fillRect(s.x, s.y, ps - g, ps - g);
        // Add dim glow
        ctx.fillStyle = dimColor;
        ctx.fillRect(s.x - 1, s.y - 1, ps + 1, ps + 1);
        ctx.fillStyle = color;
        ctx.fillRect(s.x, s.y, ps - g, ps - g);
      }
      if (i < stitches.length) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  },

  // Tile a border pattern across an element
  renderBorder(container, position) {
    const canvas = document.createElement('canvas');
    const pattern = this.patterns.borderH;
    const ps = this.px;
    const w = container.offsetWidth || 800;
    const tilesNeeded = Math.ceil(w / (pattern[0].length * ps)) + 1;

    canvas.width = tilesNeeded * pattern[0].length * ps;
    canvas.height = pattern.length * ps;
    canvas.style.cssText = 'width:100%;image-rendering:pixelated;display:block;';

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;

    for (let t = 0; t < tilesNeeded; t++) {
      const ox = t * pattern[0].length * ps;
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          if (pattern[y][x]) {
            ctx.fillRect(ox + x * ps, y * ps, ps - this.gap, ps - this.gap);
          }
        }
      }
    }

    container.appendChild(canvas);
  },

  // Render corner ornaments on a card element
  renderCorners(element) {
    const pattern = this.patterns.corner;
    const ps = 3; // smaller for cards
    const positions = [
      { fx: false, fy: false, css: 'top:0;left:0;' },
      { fx: true, fy: false, css: 'top:0;right:0;' },
      { fx: false, fy: true, css: 'bottom:0;left:0;' },
      { fx: true, fy: true, css: 'bottom:0;right:0;' },
    ];

    positions.forEach(pos => {
      const c = pos.fx || pos.fy
        ? this.renderFlipped(pattern, ps, this.color, pos.fx, pos.fy)
        : this.renderPattern(pattern, ps, this.color);
      c.style.cssText = `position:absolute;${pos.css}pointer-events:none;image-rendering:pixelated;z-index:3;`;
      element.appendChild(c);
    });
  },

  // Initialize all lace elements on the page
  init() {
    // Render doily ornaments
    document.querySelectorAll('.lace-doily').forEach(el => {
      const c = this.renderPattern(this.patterns.doily, 4, this.color);
      c.style.imageRendering = 'pixelated';
      el.appendChild(c);
    });

    // Render rose ornaments
    document.querySelectorAll('.lace-rose').forEach(el => {
      const c = this.renderPattern(this.patterns.rose, 5, this.color);
      c.style.imageRendering = 'pixelated';
      el.appendChild(c);
    });

    // Render border dividers
    document.querySelectorAll('.lace-divider').forEach(el => {
      this.renderBorder(el);
    });

    // Render corner ornaments on cards
    document.querySelectorAll('.lace-corners').forEach(el => {
      this.renderCorners(el);
    });

    // Animate hero frames on scroll into view
    document.querySelectorAll('.lace-frame-canvas').forEach(el => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const parent = el.closest('.hero__image, .about-spread__image, .contact-info');
            if (parent) {
              this.animateFrame(parent, 2500);
            }
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(el);
    });

    // Loader doily
    const loaderLace = document.querySelector('.loader__lace');
    if (loaderLace) {
      const c = this.renderPattern(this.patterns.doily, 5, this.color);
      c.style.imageRendering = 'pixelated';
      c.style.animation = 'spin 4s linear infinite';
      loaderLace.appendChild(c);

      // Add spin animation
      if (!document.getElementById('lace-keyframes')) {
        const style = document.createElement('style');
        style.id = 'lace-keyframes';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PixelLace.init());
