# Images

Real photography pulled from the live Wix site's CDN (static.wixstatic.com),
resized/compressed for web with sharp. Not placeholders.

- `hero-karnak-gate.jpg` — Karnak Temple pylon at sunset, used as the home hero background.
- `about-temple.jpg`, `about-office.jpg` — Karnak Temple ruins and a 3D render of the
  Karnak Gate office lobby, used as About page accents.
- `team-*.jpg` — team headshots. **Note:** on the live Wix site, four of the eight
  (Nermin Salah, Amr Saeed Fathy, Nick Gallier, Vadym Kmatvieiev) are generic stock
  photography, not real personal photos — that's carried over as-is from what's
  currently live. Gehad Fawzy and Mick Jewell are cropped from one real photo of the
  two of them together; Wael Ahmed Seleem and Mohamed Mamdoh are real personal photos.
  Swap any of these for real headshots whenever you have them — same filename, square
  aspect ratio, ≥320×320px.
- `project-*.jpg` — one photo per project card in `projects.html` / the home page
  featured-projects section, matched by content (e.g. the actual Hugo Boss store
  interior for "Hugo Boss Stores", the actual Luxor riverside pool/apartment block
  for "Riverside Residential Apartments"). A few (Private Residentials, Hilton
  Hotels) use the closest available generic match rather than a project-specific
  photo, since the source site didn't have one for every project.

## Adding new photography

Drop optimized images into this folder using the existing naming convention and
reference them from the relevant page. Prefer `.webp` (with a `.jpg` fallback via
`<picture>`) for anything above ~150KB, and always set explicit `width`/`height`
attributes on `<img>` tags to avoid layout shift.
