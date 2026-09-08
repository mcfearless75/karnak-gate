# Images

This site currently ships with no raster imagery — the hero and section
backgrounds use CSS gradients, and the Egyptian gate/pylon mark is inline SVG
(`favicon.svg`, and inline in each page's header/footer). No usable project
photography could be recovered from the original Wix site (its images were
lazy-loaded/blurred placeholders served from the Wix CDN).

## Adding real photography

Drop optimized images into this folder using the following naming
convention, then reference them from the relevant page:

- `hero-*.jpg` — full-bleed hero backgrounds (recommended ≥ 1920px wide)
- `project-<slug>.jpg` — one photo per project card in `projects.html`,
  e.g. `project-riverside-residential-luxor.jpg`
- `team-<name-slug>.jpg` — headshots for `about.html`, e.g. `team-gehad-fawzy.jpg`

Prefer `.webp` (with a `.jpg` fallback via `<picture>`) for anything above
~150KB, and always set explicit `width`/`height` attributes on `<img>` tags
to avoid layout shift.
