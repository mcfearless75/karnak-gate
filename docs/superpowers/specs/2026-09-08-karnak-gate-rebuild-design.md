# Karnak Gate Website Rebuild — Design Spec

Date: 2026-09-08
Status: Approved

## Summary

Rebuild karnakgate.com (currently a Wix site) as a fast, dependency-free static
site with a fresher, more dynamic look, and publish it via GitHub Pages from a
new repo `mcfearless75/karnak-gate`.

## Source content (scraped from the live Wix site)

- **Company**: Karnak Gate Development Limited
- **Tagline**: Construction, Real Estate, Architectural and Interior Design
- **Logo motif**: black/white silhouette of an Egyptian temple pylon (gate),
  referencing Karnak Temple — rebuilt as clean inline SVG rather than reused
  as a raster.
- **Services**: Company Profile, Real Estate, Design & Build, Interiors,
  Property Management, Land & Planning
- **About**: 50 years of management experience across Egyptian, UK, Middle
  East and European property development markets. Services: planning,
  development, design, construction, project management, real estate sales,
  property management — residential, commercial, retail, hospitality.
  Team (8): Gehad Fawzy (CEO), Mick Jewell (COO), Nermin Salah (EA), Wael
  Ahmed Seleem (Sales Executive), Mohamed Mamdoh (Sales Executive), Amr Saeed
  Fathy (Sales Support), Nick Gallier (Visual Design), Vadym Kmatvieiev
  (Visual Design).
- **Projects** (11, real names/locations from the live site):
  Riverside Residential Apartments — Luxor, Egypt;
  Beach Apartments — Sharm El Sheikh, Egypt;
  Private Residential Apartments — Hurghada, Egypt;
  Concrete / Steel Frame — Egypt, Middle East, UK;
  Private Residentials — Egypt, UK, Japan, Europe;
  Harrods, Liberty & Selfridges — London, UK;
  Cambridge University Conf — London, UK;
  Grosvenor Sq 5* Apartment — London, UK;
  Timber Frame — UK;
  Hilton Hotels — UK, Netherlands, Skandanavia;
  Hugo Boss Stores — Europe.
- No real photography was recoverable from the Wix CDN (lazy-loaded/blurred
  placeholders with low reuse value) — imagery is placeholder/generated
  architectural line art in the brand palette, not fake stock photos passed
  off as real projects. Documented `/images` structure so real photos can
  be dropped in later.

## Goals

- Feel like a high-end architecture/property-development studio: dynamic,
  not a generic template.
- Zero build tooling — plain HTML/CSS/JS, deploys straight to GitHub Pages.
- Reuse real content (team, project list, services, company story).
- Accessible, responsive, fast (no external JS framework/animation library).

## Non-goals

- No backend/CMS, no contact-form submission handling (static `mailto:`
  contact page only).
- No pixel-for-pixel clone of the Wix site — this is a redesign.
- No real project photography (none was scrapeable) — placeholder visuals
  only, with a documented path to swap in real photos later.

## Information architecture

Five pages, shared header/footer markup duplicated per page (no templating
needed at this scale):

1. `index.html` — Home: full-bleed hero (gate mark + tagline), stat strip
   (50 years / 3+ regions / 6 service lines), services preview grid,
   featured projects preview, CTA.
2. `about.html` — Company story + team grid (8 members, real names/roles).
3. `services.html` — 6 services as icon + description cards.
4. `projects.html` — Filterable grid of the 11 real projects, filter chips
   by region (Egypt / UK / Europe).
5. `contact.html` — Contact details, `mailto:` CTA, social links.

## Visual system

Grounded in `ui-ux-pro-max` design-system + domain lookups (Real Estate
Luxury typography pairing; "Premium dark + gold accent" luxury color
profile; Hero-Centric landing pattern; Scroll Reveal/Subtle motion spec).

- **Typography**: Cinzel (headings, classical/monumental — echoes the gate
  motif) + Josefin Sans (body).
- **Color** (dark-first):
  - `--ink` (background): `#1C1917`
  - `--panel` (secondary surface): `#292524`
  - `--stone` (foreground text): `#FAFAF9`
  - `--muted` (secondary text): `#A8A29E`
  - `--gold` (accent, brightened for on-dark contrast): `#C9973A`
  - `--border`: `#44403C`
- **Motion**: 12px rise + fade-in on scroll via IntersectionObserver,
  300–350ms ease-out, plays once per element, fully disabled under
  `prefers-reduced-motion: reduce`. No external animation library.
- Sticky header that condenses on scroll; mobile hamburger nav; animated
  count-up on the stat strip; hover zoom/tilt on project & service cards;
  project grid filter-by-region (vanilla JS); smooth-scroll anchors.

## Accessibility

- Text contrast ≥ 4.5:1 in all states.
- Visible focus rings on every interactive element (never removed).
- Touch targets ≥ 44×44px.
- No emoji-as-icons — inline SVG icons only.
- Responsive at 375 / 768 / 1024 / 1440px, no horizontal scroll.
- `prefers-reduced-motion` respected everywhere motion is used.

## File structure

```
/
├── index.html
├── about.html
├── services.html
├── projects.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── (placeholder SVG/generated art; README on how to swap in real photos)
└── favicon.svg
```

## Deployment

- New public GitHub repo: `mcfearless75/karnak-gate`.
- Static files at repo root, GitHub Pages served from `main` / `(root)` —
  no build step, no GitHub Actions workflow required.
- Confirm live Pages URL with the user once enabled.

## Testing / verification

- Manual check in the browser tool at desktop + mobile viewport widths.
- Verify all internal nav links resolve, reduced-motion is respected, and
  no console errors.
