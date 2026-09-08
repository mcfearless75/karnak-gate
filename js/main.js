// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky header condense
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-condensed', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  // Count-up stats
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count-to'), 10);
      if (prefersReducedMotion || Number.isNaN(target)) {
        el.textContent = String(target);
        return;
      }
      const duration = 900;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  // Project region filter (projects.html only — no-op elsewhere)
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const chips = filterBar.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('[data-project-region]');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        const filter = chip.getAttribute('data-filter');
        projectCards.forEach((card) => {
          const regions = card.getAttribute('data-project-region');
          const show = filter === 'all' || regions.includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }
});
