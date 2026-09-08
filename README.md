# Karnak Gate

Static rebuild of [karnakgate.com](https://www.karnakgate.com/) — Karnak Gate
Development Limited (construction, real estate, architectural & interior
design) — moving off Wix to a fast, dependency-free static site published on
GitHub Pages.

## Stack

Plain HTML5 / CSS3 / vanilla ES6 JavaScript. No build step, no framework, no
npm install — every file works by opening it directly or serving the repo
root as static files.

## Structure

```
index.html      Home
about.html      Company story + team
services.html   Services
projects.html   Project portfolio (filterable by region)
contact.html    Contact details
css/styles.css  Design tokens + shared styles
js/main.js      Nav, scroll-reveal, count-up stats, project filter
images/         Placeholder for real project/team photography (see images/README.md)
```

## Local development

No build tooling required — just serve the folder statically, e.g.:

```bash
python -m http.server 4173
```

then open `http://localhost:4173`.

## Design

See [`docs/superpowers/specs/2026-09-08-karnak-gate-rebuild-design.md`](docs/superpowers/specs/2026-09-08-karnak-gate-rebuild-design.md)
for the full design spec (content sourced from the live Wix site, visual
system, accessibility requirements) and
[`docs/superpowers/plans/2026-09-08-karnak-gate-rebuild.md`](docs/superpowers/plans/2026-09-08-karnak-gate-rebuild.md)
for the implementation plan.

## Deployment

Published via GitHub Pages from `main` / `(root)` — no Actions workflow
needed.
