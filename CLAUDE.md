# CLAUDE.md

Thaer Media marketing site (design / branding / social-media agency, live at https://thaerdesigner.com). Built with **Astro 7**, static output, deployed to GitHub Pages.

**Design source of truth: the live site's v2 design (Nov 2026).** This codebase is a performance rebuild of that site: same look, content and URLs. Reference screenshots of the live v2 are in `ui-ux-reference/screenshots/live-v2/`; the rebuild was verified against them (desktop page heights identical, ≤0.5% pixel difference). The older v1 spec in `ui-ux-reference/README.md` is historical only. `IMPROVEMENTS.md` (Arabic) tracks the open items.

## Commands

Node **≥ 22.23.4** is required (Astro 7.4 refuses to start on older Node). The dev machine had 22.23.1, so builds were run as `npx -y node@22.23.4 node_modules/astro/bin/astro.mjs build`.

- `npm run dev`
- `npm run build` (→ `dist/`). The first build encodes ~110 photos in about 1.5 minutes; later builds use the cache in `node_modules/.astro`.
- `npm run preview`

There are no tests.

## URLs (must not change: they're indexed and shared)

Arabic URLs are identical to the live site; English mirrors them under `/en/`.

| Arabic | English | |
| --- | --- | --- |
| `/` | `/en/` | |
| `/contact/` | `/en/contact/` | |
| `/socialmedia.courses1/` | `/en/socialmedia.courses1/` | Course page, linked from the promo slides |
| `/work.social/` | `/en/work.social/` | |
| `/work.brand/` | `/en/work.brand/` | Gallery key `identity` |
| `/work.print/` | `/en/work.print/` | |
| `/work.ads/` | `/en/work.ads/` | |

Routes are defined once in `ROUTES` (`src/lib/i18n.ts`). Pages in `src/pages/**/index.astro` are one-line wrappers around `src/views/*View.astro`. Always build links with `href(lang, routeKey, hash?)`: it's base-path and language aware.

## Content

- Everything editable is in `src/data/site.json`.
  - Bilingual fields are `{ar, en}`.
  - Headings with a coloured lead-in are `{kicker, title}`.
  - Numbering is derived from order.
  - Image paths are relative to `src/assets/`.
- `src/lib/site.ts` validates the JSON with zod (`astro/zod`, Zod 4) and checks that every image exists. Bad data fails the build with a readable list. When adding a field, update the schema there **and** the dashboard field list in `src/scripts/admin/fields.ts`.
- Interface strings that aren't client content (aria labels, slider labels, form validation messages) live in `ui` (`i18n.ts`) and `src/scripts/forms.ts`.
- **Language preference:** the toggle is a real link to the other language's URL, and the click stores `localStorage.lang`. An inline head script redirects to the stored language on later visits, using `<html data-alt>`. This matches the live site, where the language choice persisted.

## Images

Always render through `src/components/Img.astro`:

- It builds `<picture>` with AVIF q50 + WebP q75 at several widths, plus one JPEG fallback, via `getImage()`. `<Picture>` can't set a different quality per format, and AVIF at WebP's quality came out larger than WebP.
- `picture{display:contents}` (in `site.css`) makes the wrapper boxless, so the live site's `img` CSS rules apply unchanged.
- The hero and course portraits are `priority` (eager + `fetchpriority=high`). Everything else is lazy.

Gallery pages:

- Grid thumbnails come from the pipeline (the live site's hand-made `thumbs/` folder isn't needed).
- The lightbox uses one WebP per item (≤1600px; print artwork ≤2000px so signage text stays readable).
- Social frames get their aspect ratio from image metadata at build time, which the live site measured in the browser after load.

## CSS

`src/styles/site.css`, `home.css`, `contact.css`, `gallery.css` and `course.css` are the live site's stylesheets, **kept nearly verbatim** so the design matches. Edits are marked:

- **Removed blur.** `backdrop-filter` is gone from `.card--glass` and the base `.eyebrow`: they sit on a smooth gradient, where the blur was invisible but cost a compositing pass every scroll frame. It stays on `.nav::before` (14px), `.eyebrow--on-media` and the lightbox and slider buttons.
- **Glows without `filter: blur`.** `.service-card::after` and `.cta::before` use softer gradient stops instead, and animate only while on screen (`.glow-active`, toggled by an IntersectionObserver in `site.ts`; elements opt in with `data-glow`).
- **Additions at the end of `site.css`:** `picture{display:contents}`, CSS-only light/dark logo swap (`.logo-dark`/`.logo-light`), and `.btn--block{white-space:normal}`. The last one fixes a live-site bug: the long English course button pushed the form 22px outside its card on phones. `course.css` adds `minmax(0,1fr)` for the same reason.

**Stylesheet order matters** (page CSS overrides `site.css` at equal specificity). Each view imports `BaseLayout` first and its own CSS second. Never import `site.css` anywhere else (e.g. the dashboard). A second importer makes the build split it into a shared chunk that loads *after* page CSS. That happened once and broke the course page spacing; `admin.css` is self-contained for this reason.

## JS (`src/scripts/`, no framework; content is already in the HTML)

- **`site.ts`** (every page):
  - theme and language preference
  - header `.is-scrolled`, mobile menu, homepage scrollspy
  - `.reveal`/`.reveal-stagger` → `.is-visible`, plus the `glow-active` observer
  - floating WhatsApp: hidden while a form or the footer is visible
  - footer year
  - `contextmenu`/`dragstart` guard on portfolio images (as on the live site)
- **`home.ts`:**
  - metric counters
  - hero title fit (two `nowrap` lines, shrunk only if they overflow)
  - services with a gallery scroll to and highlight their work cover, instead of navigating (live behaviour)
  - the two carousels: `transform` track inside an `overflow:hidden` viewport, autoplay paused on hover/focus/off-screen/hidden tab, swipe, keyboard
- **`forms.ts`:** contact and course forms. Validation messages are bilingual, Arabic-Indic digits become Latin, and submitting opens `wa.me` with `greeting + "Label: value"` lines built from the field labels in `site.json`.
- **`gallery.ts`:** lightbox with counter, keyboard, swipe, and pinch / double-tap zoom.

## Content dashboard (`/admin/`)

The user's design: no server and no auth.

- It edits a copy of `site.json` in the browser, resizes and renames chosen images on the device (≤2400px WebP), and validates.
- It then hands over: (1) the images, plus a link to `github.com/<repo>/upload/<branch>/src/assets/<folder>`; (2) the JSON to paste at `github.com/<repo>/edit/<branch>/src/data/site.json`.
- The repo name comes from `GITHUB_REPOSITORY` at build time (Actions only).
- Fields are declared in `src/scripts/admin/fields.ts`. It's noindex and excluded from the sitemap.

## Deploy

- `.github/workflows/deploy.yml` builds on push to `main` and deploys to GitHub Pages. `SITE_URL`/`BASE_PATH` come from `actions/configure-pages`, and the image cache (`node_modules/.astro`) is restored **after** `npm ci`.
- **Custom domain:** thaerdesigner.com is currently served by the old static site. To switch, point the domain at GitHub Pages: repo Settings → Pages → Custom domain.

## Open

- **Expo Arabic** still loads from `db.onlinewebfonts.com`; its licence is unverified. Self-host it once confirmed.
- **IBM Plex Sans Arabic** (the live site's fallback) is not loaded, which saves ~100KB.
