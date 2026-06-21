/* ========== APP.JS — Core interactions ========== */

// ---- CUSTOM CURSOR ----
const cursor = document.querySelector('.custom-cursor');
if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .featured__card, .release-entry, .event-card, .roster-panel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
}

// ---- MOBILE NAV ----
const hamburger = document.querySelector('.mobile-hamburger');
const mobileOverlay = document.querySelector('.mobile-overlay');
if (hamburger && mobileOverlay) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
  mobileOverlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
    });
  });
}

// ---- ACTIVE SIDEBAR LINK ----
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.sidebar__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- LOADER ----
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (!loader) return;

  setTimeout(() => {
    loader.style.transition = 'opacity 0.6s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      initGSAP();
    }, 600);
  }, 1200);
});

// ---- GSAP ANIMATIONS ----
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // --- Hero animations ---
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    gsap.from(heroTitle, {
      y: 80, opacity: 0, duration: 1.2,
      ease: 'power3.out'
    });
    gsap.from('.hero__sub', {
      y: 30, opacity: 0, duration: 0.8,
      delay: 0.4, ease: 'power2.out'
    });
    gsap.from('.hero__desc', {
      y: 30, opacity: 0, duration: 0.8,
      delay: 0.6, ease: 'power2.out'
    });
    gsap.from('.hero__image img', {
      scale: 1.15, opacity: 0, duration: 1.4,
      delay: 0.3, ease: 'power2.out'
    });
  }

  // --- Featured cards stagger ---
  const cards = gsap.utils.toArray('.featured__card');
  if (cards.length) {
    gsap.set(cards, { y: 40, opacity: 0 });
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 40, opacity: 0, duration: 0.3, stagger: 0.05, overwrite: true })
    });
  }

  // --- Manifesto word-by-word reveal ---
  const manifesto = document.querySelector('.manifesto__text');
  if (manifesto) {
    const words = manifesto.querySelectorAll('.word');
    gsap.set(words, { opacity: 0, y: 12 });

    ScrollTrigger.create({
      trigger: manifesto,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        gsap.to(words, {
          opacity: 1, y: 0, duration: 0.5,
          stagger: 0.04, ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(words, { opacity: 0, y: 12, duration: 0.3, stagger: 0.01 });
      }
    });
  }

  // --- Events row slide-in ---
  const eventCards = gsap.utils.toArray('.event-card');
  if (eventCards.length) {
    gsap.set(eventCards, { x: -30, opacity: 0 });
    ScrollTrigger.batch(eventCards, {
      start: 'top 92%',
      onEnter: batch => gsap.to(batch, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { x: -30, opacity: 0, duration: 0.3, stagger: 0.05, overwrite: true })
    });
  }

  // --- Lace divider scale-in ---
  gsap.utils.toArray('.lace-divider').forEach(div => {
    gsap.from(div, {
      scrollTrigger: {
        trigger: div,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      scaleX: 0, duration: 0.8,
      ease: 'power2.inOut'
    });
  });

  // --- Release entries ---
  gsap.utils.toArray('.release-entry').forEach((entry, i) => {
    gsap.from(entry, {
      scrollTrigger: {
        trigger: entry,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 60, opacity: 0, duration: 0.8,
      ease: 'power2.out'
    });
  });

  // --- About spread reveals ---
  gsap.utils.toArray('.about-spread').forEach(spread => {
    gsap.from(spread.querySelectorAll('h2, h3, p, .stat__number, .stat__label'), {
      scrollTrigger: {
        trigger: spread,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 40, opacity: 0, stagger: 0.1,
      duration: 0.7, ease: 'power2.out'
    });
  });

  // --- Roster GSAP horizontal scroll (desktop) ---
  const rosterPanels = document.querySelector('.roster-panels');
  const rosterSection = document.querySelector('.roster-section');
  if (rosterPanels && rosterSection && window.innerWidth > 768) {
    const panels = gsap.utils.toArray('.roster-panel');
    const totalScrollWidth = rosterPanels.scrollWidth - window.innerWidth + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w'));

    gsap.to(rosterPanels, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: rosterSection,
        pin: true,
        scrub: 1,
        end: () => `+=${totalScrollWidth}`,
        invalidateOnRefresh: true,
      }
    });

    panels.forEach(panel => {
      gsap.from(panel.querySelector('.roster-panel__info'), {
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.utils.toArray('.roster-panel').length > 3
            ? undefined : undefined,
          start: 'left 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40, opacity: 0, duration: 0.6
      });
    });
  }

  // --- Contact form field reveals ---
  gsap.utils.toArray('.contact-form label, .contact-form input, .contact-form textarea, .contact-form select, .contact-form button').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 20, opacity: 0, duration: 0.5,
      delay: i * 0.05,
      ease: 'power2.out'
    });
  });

  // --- Timeline items ---
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'left 80%',
        toggleActions: 'play none none reverse'
      },
      x: 40, opacity: 0, duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // --- Parallax on hero image ---
  const heroImg = document.querySelector('.hero__image img');
  if (heroImg) {
    gsap.to(heroImg, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 80,
      scale: 1.08,
      ease: 'none'
    });
  }

  // --- Contact info lace frame animation ---
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) {
    ScrollTrigger.create({
      trigger: contactInfo,
      start: 'top 60%',
      onEnter: () => PixelLace.animateFrame(contactInfo, 2000)
    });
  }
}

// Fallback if GSAP not loaded
if (typeof gsap === 'undefined') {
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  });
}
