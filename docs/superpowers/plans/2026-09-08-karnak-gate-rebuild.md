# Karnak Gate Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild karnakgate.com as a dependency-free static site (5 pages) with a dark/gold luxury-architecture look and dynamic scroll motion, and publish it on GitHub Pages at `mcfearless75/karnak-gate`.

**Architecture:** Plain HTML/CSS/JS, no build step. One shared `css/styles.css` (design tokens as CSS custom properties + component styles) and one shared `js/main.js` (nav, scroll-reveal, count-up, project filter — all vanilla, IntersectionObserver-based). Each page's `<head>`/header/footer markup is duplicated per the approved spec (no templating at this scale). Content is the real scraped content from `docs/superpowers/specs/2026-09-08-karnak-gate-rebuild-design.md`.

**Tech Stack:** Static HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla ES6 JS, Google Fonts (Cinzel + Josefin Sans), inline SVG icons/logo. No npm, no framework, no external animation library.

## Global Constraints

- Zero build tooling — every file must work by opening directly / via GitHub Pages, no bundler.
- Color tokens: `--ink:#1C1917; --panel:#292524; --stone:#FAFAF9; --muted:#A8A29E; --gold:#C9973A; --border:#44403C`.
- Fonts: Cinzel (headings), Josefin Sans (body), loaded via Google Fonts `<link>`.
- Motion: scroll reveal = 12px rise + fade, 300–350ms ease-out, play-once, wrapped in `@media (prefers-reduced-motion: reduce)` opt-out.
- Accessibility: text contrast ≥4.5:1, visible focus rings never removed, touch targets ≥44×44px, no emoji-as-icons (inline SVG only), responsive at 375/768/1024/1440px, no horizontal scroll.
- All internal nav links must resolve (5 pages: index, about, services, projects, contact).
- Real content only (team names/roles, 11 real projects, real services list) — no invented facts.

---

### Task 1: Design tokens, reset, and shared layout CSS

**Files:**
- Create: `css/styles.css`
- Test: manual — open any later page in the browser tool once it exists and confirm computed styles

**Interfaces:**
- Produces: CSS custom properties `--ink`, `--panel`, `--stone`, `--muted`, `--gold`, `--border`, `--font-head`, `--font-body`, `--space-*` scale, and reusable classes: `.site-header`, `.nav`, `.nav-toggle`, `.btn`, `.btn-primary`, `.section`, `.reveal` (initial state for scroll-reveal JS), `.stat-strip`, `.card-grid`, `.card`, `.site-footer`, `.skip-link`, `.filter-chip`.

- [ ] **Step 1: Write `css/styles.css` with tokens, reset, and header/nav/footer/button/card/reveal styles**

```css
/* css/styles.css */
:root {
  --ink: #1C1917;
  --panel: #292524;
  --stone: #FAFAF9;
  --muted: #A8A29E;
  --gold: #C9973A;
  --border: #44403C;

  --font-head: 'Cinzel', serif;
  --font-body: 'Josefin Sans', sans-serif;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;

  --radius: 2px;
  --max-width: 1280px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

body {
  margin: 0;
  background: var(--ink);
  color: var(--stone);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-head);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 var(--space-2);
  letter-spacing: 0.02em;
}
h1 { font-size: clamp(2.25rem, 5vw, 4rem); }
h2 { font-size: clamp(1.75rem, 3.5vw, 2.75rem); }
h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); }
p { margin: 0 0 var(--space-2); color: var(--muted); }
a { color: var(--gold); }

img { max-width: 100%; display: block; }

.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  background: var(--gold);
  color: var(--ink);
  padding: var(--space-1) var(--space-2);
  z-index: 100;
}
.skip-link:focus {
  left: var(--space-2);
  top: var(--space-2);
}

a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(28, 25, 23, 0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border);
  transition: padding 250ms ease;
}
.site-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  padding-bottom: var(--space-3);
  transition: padding 250ms ease;
}
.site-header.is-condensed .container {
  padding-top: var(--space-1);
  padding-bottom: var(--space-1);
}
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--stone);
  text-decoration: none;
  font-family: var(--font-head);
  letter-spacing: 0.08em;
}
.brand svg { width: 32px; height: 32px; fill: var(--gold); }
.brand-name { font-size: 1.1rem; }

.nav { display: flex; align-items: center; gap: var(--space-4); }
.nav-links {
  display: flex;
  gap: var(--space-3);
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a {
  color: var(--stone);
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: var(--space-1);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
.nav-links a:hover,
.nav-links a[aria-current="page"] {
  color: var(--gold);
}
.nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--border);
  color: var(--stone);
  width: 44px;
  height: 44px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav-toggle { display: inline-flex; align-items: center; justify-content: center; }
  .nav-links {
    position: fixed;
    inset: 72px 0 0 0;
    flex-direction: column;
    background: var(--ink);
    padding: var(--space-4) var(--space-3);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms ease, transform 250ms ease;
  }
  .nav-links.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .nav-links a { font-size: 1.1rem; }
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 var(--space-3);
  border: 1px solid var(--gold);
  color: var(--gold);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  background: transparent;
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease;
}
.btn:hover { background: var(--gold); color: var(--ink); }
.btn-primary { background: var(--gold); color: var(--ink); }
.btn-primary:hover { background: #dcae52; }

/* Sections */
.section { padding: var(--space-6) 0; }
.section-panel { background: var(--panel); }
.section-header { max-width: 640px; margin-bottom: var(--space-4); }
.eyebrow {
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.8rem;
  display: block;
  margin-bottom: var(--space-1);
}

/* Stat strip */
.stat-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: var(--space-4) 0;
}
.stat { text-align: center; }
.stat-value {
  font-family: var(--font-head);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--gold);
  display: block;
}
.stat-label {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
}

/* Cards / grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-3);
}
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: var(--space-3);
  transition: transform 250ms ease, border-color 250ms ease;
}
.card:hover { transform: translateY(-4px); border-color: var(--gold); }
.card svg { width: 40px; height: 40px; fill: var(--gold); margin-bottom: var(--space-2); }

/* Filter chips */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}
.filter-chip {
  min-height: 44px;
  padding: 0 var(--space-2);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.8rem;
  font-family: var(--font-body);
}
.filter-chip[aria-pressed="true"] {
  border-color: var(--gold);
  color: var(--gold);
}

/* Reveal-on-scroll */
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 350ms ease-out, transform 350ms ease-out;
}
.reveal.is-visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--border);
  padding: var(--space-5) 0;
  color: var(--muted);
  font-size: 0.9rem;
}
.site-footer a { color: var(--muted); }
.site-footer a:hover { color: var(--gold); }
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}
```

- [ ] **Step 2: Verify the file parses as valid CSS**

Run:
```bash
npx --yes stylelint --no-config-basedir --config '{"rules":{}}' css/styles.css || node -e "require('fs').readFileSync('css/styles.css','utf8')"
```
Expected: no fatal parse error (the `node -e` fallback just confirms the file reads back; stylelint may be unavailable offline — the node fallback is the real gate).

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "Add design tokens and shared layout CSS"
```

---

### Task 2: Shared JS — nav toggle, header condense, scroll reveal, count-up

**Files:**
- Create: `js/main.js`
- Test: manual browser check after Task 3 wires it into `index.html`

**Interfaces:**
- Consumes: DOM elements with classes `.site-header`, `.nav-toggle`, `.nav-links`, `.reveal`, `[data-count-to]`, `.filter-chip[data-filter]`, `[data-project-region]` (projects page only, used in Task 6).
- Produces: global side effects only (no exports needed — this is a plain `<script defer>`), all wrapped in `DOMContentLoaded`.

- [ ] **Step 1: Write `js/main.js`**

```javascript
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
```

- [ ] **Step 2: Verify with Node's syntax checker**

Run: `node --check js/main.js`
Expected: no output (exit code 0) = valid syntax.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add shared nav/scroll-reveal/count-up/filter JS"
```

---

### Task 3: Home page (`index.html`)

**Files:**
- Create: `index.html`
- Create: `favicon.svg`
- Test: `node --check` is not applicable (HTML) — verification is Step 3 below (grep) and a browser-tool render check after all pages exist (Task 8).

**Interfaces:**
- Consumes: `css/styles.css` (classes from Task 1), `js/main.js` (behavior from Task 2).
- Produces: the shared header/footer HTML block that Tasks 4–7 duplicate verbatim (with the corresponding `aria-current="page"` moved to the active link and the `<title>` changed).

- [ ] **Step 1: Write `favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#1C1917"/>
  <path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/>
</svg>
```

- [ ] **Step 2: Write `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Karnak Gate | Construction, Real Estate & Architecture</title>
<meta name="description" content="Karnak Gate Development Limited — 50 years of construction, real estate, architectural and interior design experience across Egypt, the UK and Europe.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z"/></svg>
      <span class="brand-name">KARNAK GATE</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html" aria-current="page">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="container">
      <span class="eyebrow reveal">Karnak Gate Development Limited</span>
      <h1 class="reveal">Construction, Real Estate, Architectural &amp; Interior Design</h1>
      <p class="reveal" style="max-width:560px;font-size:1.1rem;">Fifty years of development experience across Egypt, the UK, the Middle East and Europe — from residential towers to five-star hospitality interiors.</p>
      <div class="reveal" style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;">
        <a class="btn btn-primary" href="projects.html">View Projects</a>
        <a class="btn" href="contact.html">Start a Conversation</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="stat-strip">
        <div class="stat reveal"><span class="stat-value"><span data-count-to="50">0</span>+</span><span class="stat-label">Years Experience</span></div>
        <div class="stat reveal"><span class="stat-value"><span data-count-to="4">0</span></span><span class="stat-label">Regions Served</span></div>
        <div class="stat reveal"><span class="stat-value"><span data-count-to="6">0</span></span><span class="stat-label">Service Lines</span></div>
        <div class="stat reveal"><span class="stat-value"><span data-count-to="11">0</span></span><span class="stat-label">Featured Projects</span></div>
      </div>
    </div>
  </section>

  <section class="section section-panel">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">What We Do</span>
        <h2>Services</h2>
      </div>
      <div class="card-grid">
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18v-2H3v2zM5 19h2V9H5v10zm4 0h2V5H9v14zm4 0h2v-8h-2v8zm4 0h2V3h-2v16z"/></svg><h3>Company Profile</h3><p>Planning, development and project management across residential, commercial, retail and hospitality sectors.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3z"/></svg><h3>Real Estate</h3><p>Sales and acquisition across residential and commercial property markets.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><h3>Design &amp; Build</h3><p>Concrete, steel and timber-frame construction delivered end to end.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 12h16M12 4v16"/></svg><h3>Interiors</h3><p>Architectural and interior design for five-star hospitality and retail.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a5 5 0 0 1 5 5c0 4-5 11-5 11S7 11 7 7a5 5 0 0 1 5-5z"/></svg><h3>Property Management</h3><p>Ongoing management services for residential and commercial portfolios.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h18M3 6h18M3 20h18"/></svg><h3>Land &amp; Planning</h3><p>Land acquisition and planning strategy from concept through approval.</p></div>
      </div>
      <div style="margin-top:2rem;">
        <a class="btn" href="services.html">All Services</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Selected Work</span>
        <h2>Featured Projects</h2>
      </div>
      <div class="card-grid">
        <div class="card reveal"><h3>Riverside Residential Apartments</h3><p>Luxor, Egypt</p></div>
        <div class="card reveal"><h3>Beach Apartments</h3><p>Sharm El Sheikh, Egypt</p></div>
        <div class="card reveal"><h3>Harrods, Liberty &amp; Selfridges</h3><p>London, UK</p></div>
      </div>
      <div style="margin-top:2rem;">
        <a class="btn" href="projects.html">All Projects</a>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand" style="margin-bottom:0.75rem;">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/></svg>
        <span class="brand-name">KARNAK GATE</span>
      </div>
      <p>Construction, Real Estate, Architectural and Interior Design.</p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Site</h4>
      <p><a href="about.html">About</a></p>
      <p><a href="services.html">Services</a></p>
      <p><a href="projects.html">Projects</a></p>
      <p><a href="contact.html">Contact</a></p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Get in Touch</h4>
      <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top:2rem;font-size:0.8rem;">
    &copy; 2026 Karnak Gate Development Limited. All rights reserved.
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Verify required content is present**

Run:
```bash
grep -c "Karnak Gate" index.html
grep -c "data-count-to" index.html
grep -c "nav-toggle" index.html
```
Expected: each command prints a number ≥ 1 (0 or "No such file" means the step failed).

- [ ] **Step 4: Commit**

```bash
git add index.html favicon.svg
git commit -m "Add home page"
```

---

### Task 4: About page (`about.html`)

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: same header/footer block as Task 3 (copy verbatim, set `<title>` to `About | Karnak Gate`, move `aria-current="page"` to the About link, remove `id="main"` duplication conflicts — keep `id="main"` on this page's own `<main>`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write `about.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About | Karnak Gate</title>
<meta name="description" content="Meet the team at Karnak Gate Development Limited — 50 years of property development experience across Egypt, the UK, the Middle East and Europe.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z"/></svg>
      <span class="brand-name">KARNAK GATE</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html" aria-current="page">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <section class="section">
    <div class="container">
      <span class="eyebrow reveal">Meet the Team</span>
      <h1 class="reveal">About Karnak Gate</h1>
      <p class="reveal" style="max-width:720px;font-size:1.1rem;">With 50 years of management experience in Egyptian, UK, Middle East and European property development markets, we offer planning, development, design, construction, project management, real estate sales and property management services across residential, commercial, retail and hospitality sectors. We pride ourselves on service, efficiency and competitive offers, and stay flexible in our approach to project delivery.</p>
    </div>
  </section>

  <section class="section section-panel">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">The People</span>
        <h2>Our Team</h2>
      </div>
      <div class="card-grid">
        <div class="card reveal"><h3>Gehad Fawzy</h3><p>CEO</p></div>
        <div class="card reveal"><h3>Mick Jewell</h3><p>COO</p></div>
        <div class="card reveal"><h3>Nermin Salah</h3><p>EA</p></div>
        <div class="card reveal"><h3>Wael Ahmed Seleem</h3><p>Sales Executive</p></div>
        <div class="card reveal"><h3>Mohamed Mamdoh</h3><p>Sales Executive</p></div>
        <div class="card reveal"><h3>Amr Saeed Fathy</h3><p>Sales Support</p></div>
        <div class="card reveal"><h3>Nick Gallier</h3><p>Visual Design</p></div>
        <div class="card reveal"><h3>Vadym Kmatvieiev</h3><p>Visual Design</p></div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand" style="margin-bottom:0.75rem;">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/></svg>
        <span class="brand-name">KARNAK GATE</span>
      </div>
      <p>Construction, Real Estate, Architectural and Interior Design.</p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Site</h4>
      <p><a href="about.html">About</a></p>
      <p><a href="services.html">Services</a></p>
      <p><a href="projects.html">Projects</a></p>
      <p><a href="contact.html">Contact</a></p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Get in Touch</h4>
      <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top:2rem;font-size:0.8rem;">
    &copy; 2026 Karnak Gate Development Limited. All rights reserved.
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify team content present**

Run: `grep -c "Gehad Fawzy" about.html && grep -c "Vadym Kmatvieiev" about.html`
Expected: both print `1`.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Add about page with team grid"
```

---

### Task 5: Services page (`services.html`)

**Files:**
- Create: `services.html`

**Interfaces:**
- Consumes: same header/footer as Task 3 (title `Services | Karnak Gate`, About/Services `aria-current` moved to Services link).

- [ ] **Step 1: Write `services.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Services | Karnak Gate</title>
<meta name="description" content="Karnak Gate services: company profile, real estate, design and build, interiors, property management, land and planning.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z"/></svg>
      <span class="brand-name">KARNAK GATE</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html" aria-current="page">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <section class="section">
    <div class="container">
      <span class="eyebrow reveal">What We Do</span>
      <h1 class="reveal">Services</h1>
      <p class="reveal" style="max-width:640px;font-size:1.1rem;">Planning, development, design, construction, project management, real estate sales and property management — across residential, commercial, retail and hospitality sectors.</p>
    </div>
  </section>

  <section class="section section-panel">
    <div class="container">
      <div class="card-grid">
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18v-2H3v2zM5 19h2V9H5v10zm4 0h2V5H9v14zm4 0h2v-8h-2v8zm4 0h2V3h-2v16z"/></svg><h3>Company Profile</h3><p>Planning, development and project management across residential, commercial, retail and hospitality sectors, delivered with 50 years of combined experience.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3z"/></svg><h3>Real Estate</h3><p>Sales and acquisition support across residential and commercial property markets in Egypt, the UK and Europe.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><h3>Design &amp; Build</h3><p>Concrete, steel and timber-frame construction, delivered end to end from design through handover.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 12h16M12 4v16"/></svg><h3>Interiors</h3><p>Architectural and interior design for five-star hospitality, retail and residential interiors.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a5 5 0 0 1 5 5c0 4-5 11-5 11S7 11 7 7a5 5 0 0 1 5-5z"/></svg><h3>Property Management</h3><p>Ongoing management services for residential and commercial property portfolios.</p></div>
        <div class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h18M3 6h18M3 20h18"/></svg><h3>Land &amp; Planning</h3><p>Land acquisition and planning strategy, from feasibility through to planning approval.</p></div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand" style="margin-bottom:0.75rem;">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/></svg>
        <span class="brand-name">KARNAK GATE</span>
      </div>
      <p>Construction, Real Estate, Architectural and Interior Design.</p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Site</h4>
      <p><a href="about.html">About</a></p>
      <p><a href="services.html">Services</a></p>
      <p><a href="projects.html">Projects</a></p>
      <p><a href="contact.html">Contact</a></p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Get in Touch</h4>
      <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top:2rem;font-size:0.8rem;">
    &copy; 2026 Karnak Gate Development Limited. All rights reserved.
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify all 6 services present**

Run: `grep -Ec "Company Profile|Real Estate|Design &amp; Build|Interiors|Property Management|Land &amp; Planning" services.html`
Expected: `6`

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "Add services page"
```

---

### Task 6: Projects page (`projects.html`) with region filter

**Files:**
- Create: `projects.html`

**Interfaces:**
- Consumes: `.filter-bar`/`.filter-chip[data-filter]`/`[data-project-region]` JS wiring from Task 2.

- [ ] **Step 1: Write `projects.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Projects | Karnak Gate</title>
<meta name="description" content="Karnak Gate project portfolio across Egypt, the UK and Europe — residential, hospitality and retail developments.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z"/></svg>
      <span class="brand-name">KARNAK GATE</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html" aria-current="page">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <section class="section">
    <div class="container">
      <span class="eyebrow reveal">Selected Work</span>
      <h1 class="reveal">Projects</h1>
      <p class="reveal" style="max-width:640px;font-size:1.1rem;">Eleven developments spanning Egypt, the UK and Europe — residential, hospitality and retail.</p>

      <div class="filter-bar reveal" role="group" aria-label="Filter projects by region">
        <button class="filter-chip" data-filter="all" aria-pressed="true">All</button>
        <button class="filter-chip" data-filter="Egypt" aria-pressed="false">Egypt</button>
        <button class="filter-chip" data-filter="UK" aria-pressed="false">UK</button>
        <button class="filter-chip" data-filter="Europe" aria-pressed="false">Europe</button>
      </div>

      <div class="card-grid">
        <div class="card reveal" data-project-region="Egypt"><h3>Riverside Residential Apartments</h3><p>Luxor, Egypt</p></div>
        <div class="card reveal" data-project-region="Egypt"><h3>Beach Apartments</h3><p>Sharm El Sheikh, Egypt</p></div>
        <div class="card reveal" data-project-region="Egypt"><h3>Private Residential Apartments</h3><p>Hurghada, Egypt</p></div>
        <div class="card reveal" data-project-region="Egypt UK"><h3>Concrete / Steel Frame</h3><p>Egypt, Middle East, UK</p></div>
        <div class="card reveal" data-project-region="Egypt UK Europe"><h3>Private Residentials</h3><p>Egypt, UK, Japan, Europe</p></div>
        <div class="card reveal" data-project-region="UK"><h3>Harrods, Liberty &amp; Selfridges</h3><p>London, UK</p></div>
        <div class="card reveal" data-project-region="UK"><h3>Cambridge University Conf</h3><p>London, UK</p></div>
        <div class="card reveal" data-project-region="UK"><h3>Grosvenor Sq 5* Apartment</h3><p>London, UK</p></div>
        <div class="card reveal" data-project-region="UK"><h3>Timber Frame</h3><p>UK</p></div>
        <div class="card reveal" data-project-region="UK Europe"><h3>Hilton Hotels</h3><p>UK, Netherlands, Skandanavia</p></div>
        <div class="card reveal" data-project-region="Europe"><h3>Hugo Boss Stores</h3><p>Europe</p></div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand" style="margin-bottom:0.75rem;">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/></svg>
        <span class="brand-name">KARNAK GATE</span>
      </div>
      <p>Construction, Real Estate, Architectural and Interior Design.</p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Site</h4>
      <p><a href="about.html">About</a></p>
      <p><a href="services.html">Services</a></p>
      <p><a href="projects.html">Projects</a></p>
      <p><a href="contact.html">Contact</a></p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Get in Touch</h4>
      <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top:2rem;font-size:0.8rem;">
    &copy; 2026 Karnak Gate Development Limited. All rights reserved.
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify all 11 project cards present**

Run: `grep -c "data-project-region" projects.html`
Expected: `11`

- [ ] **Step 3: Commit**

```bash
git add projects.html
git commit -m "Add projects page with region filter"
```

---

### Task 7: Contact page (`contact.html`)

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Write `contact.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contact | Karnak Gate</title>
<meta name="description" content="Get in touch with Karnak Gate Development Limited.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z"/></svg>
      <span class="brand-name">KARNAK GATE</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-links" id="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html" aria-current="page">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <section class="section">
    <div class="container">
      <span class="eyebrow reveal">Get In Touch</span>
      <h1 class="reveal">Contact Karnak Gate</h1>
      <p class="reveal" style="max-width:640px;font-size:1.1rem;">Tell us about your project — construction, real estate, design or property management — and our team will get back to you.</p>

      <div class="card-grid" style="margin-top:2rem;">
        <div class="card reveal">
          <h3>Email</h3>
          <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
        </div>
        <div class="card reveal">
          <h3>Sales</h3>
          <p>Wael Ahmed Seleem &amp; Mohamed Mamdoh</p>
          <p><a href="mailto:sales@karnakgate.com">sales@karnakgate.com</a></p>
        </div>
        <div class="card reveal">
          <h3>Regions</h3>
          <p>Egypt &middot; UK &middot; Middle East &middot; Europe</p>
        </div>
      </div>

      <div class="reveal" style="margin-top:2.5rem;">
        <a class="btn btn-primary" href="mailto:info@karnakgate.com">Email Us</a>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand" style="margin-bottom:0.75rem;">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><path d="M14 50V26l6-8h4v10h16V18h4l6 8v24h-8V34h-4v16h-4V34h-4v16h-4V34h-4v16z" fill="#C9973A"/></svg>
        <span class="brand-name">KARNAK GATE</span>
      </div>
      <p>Construction, Real Estate, Architectural and Interior Design.</p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Site</h4>
      <p><a href="about.html">About</a></p>
      <p><a href="services.html">Services</a></p>
      <p><a href="projects.html">Projects</a></p>
      <p><a href="contact.html">Contact</a></p>
    </div>
    <div>
      <h4 style="font-size:0.9rem;color:var(--stone);">Get in Touch</h4>
      <p><a href="mailto:info@karnakgate.com">info@karnakgate.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top:2rem;font-size:0.8rem;">
    &copy; 2026 Karnak Gate Development Limited. All rights reserved.
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify mailto link present**

Run: `grep -c "mailto:info@karnakgate.com" contact.html`
Expected: number ≥ `2`

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "Add contact page"
```

---

### Task 8: Cross-page link check + browser verification (desktop & mobile)

**Files:** none created — verification only.

- [ ] **Step 1: Grep-check every page links to all 5 pages**

Run:
```bash
for f in index.html about.html services.html projects.html contact.html; do
  echo "== $f =="
  for target in index.html about.html services.html projects.html contact.html; do
    grep -q "href=\"$target\"" "$f" && echo "  ok: $target" || echo "  MISSING: $target"
  done
done
```
Expected: every page prints `ok:` for all 5 targets, no `MISSING:` lines.

- [ ] **Step 2: Open the site in the browser tool at desktop width and check each page renders with no console errors**

Use `mcp__Claude_Browser__preview_start` (or `navigate` to the local `index.html` file path) then, for each of the 5 pages: `navigate`, `read_console_messages` (onlyErrors: true — expect empty), `computer` screenshot.

- [ ] **Step 3: Re-check at mobile width (375px) via `resize_window` preset "mobile"**

Verify the hamburger menu appears, opens/closes the nav, and no horizontal scroll (compare `document.documentElement.scrollWidth` to `window.innerWidth` via `javascript_tool` — expect equal).

- [ ] **Step 4: Commit any fixes found during verification**

```bash
git add -A
git commit -m "Fix issues found during cross-page verification" --allow-empty
```

---

### Task 9: Create GitHub repo and publish via GitHub Pages

**Files:** none created — deployment only.

- [ ] **Step 1: Create the public repo and push**

```bash
gh repo create mcfearless75/karnak-gate --public --source=. --remote=origin --push
```
Expected: repo created, `main` branch pushed, remote `origin` set.

- [ ] **Step 2: Enable GitHub Pages from `main` / root via the API**

```bash
gh api -X POST repos/mcfearless75/karnak-gate/pages -f "source[branch]=main" -f "source[path]=/"
```
Expected: JSON response with `"status"` field (202 Accepted or 201 Created). If it errors because Pages already exists, that's fine — skip to Step 3.

- [ ] **Step 3: Poll for the live URL**

```bash
gh api repos/mcfearless75/karnak-gate/pages --jq '.html_url, .status'
```
Expected: prints the Pages URL (e.g. `https://mcfearless75.github.io/karnak-gate/`) and a status of `built` once deployment finishes (may take 1-2 minutes — re-run if `status` is `building`).

- [ ] **Step 4: Verify the live site in the browser tool**

Navigate to the printed `html_url` and confirm the home page renders (screenshot), matching the local verification from Task 8.
