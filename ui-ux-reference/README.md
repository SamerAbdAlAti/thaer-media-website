# Thaer Media: UI/UX reference for the rebuild

A frozen snapshot of the current site, made on 2026-11-11. It shows what the site looks like, how it behaves, and the exact values behind it, so a rebuild in any stack can match it (or deliberately change it).

The original site's code (HTML, CSS, JS) was removed from the project on 2026-11-11 and sent to the Windows Recycle Bin, so this folder is now the record of it. The original brand images and all site copy (`data.js`) are kept in `source-assets/`. File paths below such as `assets/css/work.css` refer to the old site.

## What's in this folder

| Path | What it holds |
| --- | --- |
| `gallery.html` | Open in a browser to browse every screenshot, filterable by page, viewport, language and theme. |
| `screenshots/full-page/<page>/` | Full-length capture of all 8 pages × 3 viewports (desktop 1440, tablet 820, mobile 390) × 4 variants (AR/EN × dark/light). |
| `screenshots/first-screen/<page>/` | What a visitor sees before scrolling (above the fold), for home, one work page and contact. Mobile shots are @2x. |
| `screenshots/sections/` | Each homepage section cropped on its own (header, hero, services, work, about, process, testimonials, CTA, footer), plus contact-page and gallery blocks. Desktop and mobile, @2x. |
| `screenshots/states/` | Interaction states: hover, scrolled header, scrollspy, nav squeeze zone, mobile menu open, slider slides 1–3, lightbox, service-click focus ring, buttons, cards. @2x. |
| `video/` | Screen recordings of the motion: scroll reveals, hovers, slider, theme and language toggles, mobile menu, lightbox. |
| `measurements/computed-styles_*.json` | The browser's computed styles and rendered boxes for about 100 selectors per page, per viewport/variant. Use these to check exact sizes. |
| `measurements/design-tokens-resolved.json` | Every CSS custom property resolved in the dark and light themes. |
| `source-assets/` | Original files kept for the rebuild: logos, hero portrait (JPEG plus the high-resolution original PNG), About photos, work covers (AR and EN), service icons, favicon, and `data.js` with all site copy in both languages. |

File naming: `<viewport>_<lang>-<theme>.png`, for example `mobile-390_en-light.png`.

> The 6 `work-*.html` pages are one template filled with different data. They're all captured anyway, but they differ only in title, description and gallery images.

---

## 1. Site map and pages

| # | File | Purpose | Linked from |
| --- | --- | --- | --- |
| 1 | `index.html` | Homepage: hero, services, work teaser, about, process, testimonials, CTA | Logo and "الرئيسية" link everywhere |
| 2–6 | `work-social / identity / ads / print / content.html` | One gallery page per service | Homepage service cards and work cards |
| 7 | `work-marketing.html` | Gallery page for "Marketing Solutions" | **Nothing links to it (orphan).** The Marketing service card scrolls to `#work` instead. |
| 8 | `contact.html` | Contact methods (WhatsApp/email), a 3-step "how we start" block, social links | Every "تواصل" link, the hero's primary button, and the header CTA on inner pages |

**Navigation (header, all pages):** Home · Services · Work · About · Process · Testimonials · Contact. On inner pages the section links point to `index.html#section`. "Contact" always goes to `contact.html`.

**Header CTA "ابدأ مشروعك / Start a project":** on the **homepage it opens WhatsApp** in a new tab. On **every other page it goes to `contact.html`**. This inconsistency is probably unintended; pick one for the rebuild.

---

## 2. Visual language in one paragraph

The look is premium and dark: a deep teal-black canvas, warm **gold** used as the only accent, and frosted-glass surfaces with thin gold hairline borders. Big, tightly letter-spaced headings open with a gold "kicker" phrase. Brand cards are deep-teal gradient panels with a slow, blurred glow drifting behind them. Motion is soft and springy (`cubic-bezier(.2,.8,.2,1)`): elements fade and rise in on scroll, and cards lift on hover. The site is Arabic-first (RTL) with a full English (LTR) mirror. A light theme keeps the brand panels dark and turns the canvas into a warm cream with white cards.

---

## 3. Design tokens

### 3.1 Brand colors (fixed in both themes)

| Token | Value | Use |
| --- | --- | --- |
| `--gold` | `#e2b961` | Primary accent: gold button background, borders, dots, underline, glows |
| `--green` | `#11524e` | Brand teal (gradients, glows) |
| `--navy` | `#071b2f` | Gradient end stop |
| `--ink` | `#061b1b` | Text in the light theme |
| `--white` | `#f7f6f1` | Warm off-white text on surfaces that are **always dark** |
| `--muted` | `rgba(247,246,241,.68)` | Secondary text on always-dark surfaces |
| Gold-button text | `#000` | Always black on gold |

### 3.2 Theme tokens (these change with the theme)

| Token | Dark (default) | Light |
| --- | --- | --- |
| Page bg gradient (145°) | `#041314` → `#071e1e` 45% → `#061a2b` | `#fdfbf5` → `#f3ecd6` 45% → `#e6d6ac` |
| Radial glow 1 (900×500 at 8% 8%) | `rgba(17,82,78,.42)` | `rgba(17,82,78,.14)` |
| Radial glow 2 (800×500 at 92% 24%) | `rgba(226,185,97,.10)` | `rgba(226,185,97,.20)` |
| `--text` | `#f7f6f1` | `#061b1b` |
| `--text-muted` | `rgba(247,246,241,.68)` | `rgba(6,27,27,.62)` |
| `--gold-text` (gold used as text) | `#e2b961` | `#785a14` (bronze, ~6:1 contrast) |
| Glass fill (145° gradient) | `rgba(255,255,255,.075)` → `.025` | `rgba(255,255,255,.86)` → `.58` |
| `--line` (card border) | `rgba(226,185,97,.23)` | `rgba(120,90,20,.28)` |
| `--shadow` | `0 8px 20px rgba(0,0,0,.4), 0 22px 70px rgba(0,0,0,.34)` | `0 6px 16px rgba(20,20,15,.07), 0 20px 46px rgba(20,20,15,.09)` |
| Header bg | `rgba(8,31,31,.5)` → scrolled `rgba(6,20,21,.82)` | `rgba(250,247,238,.72)` → scrolled `.9` |
| Small chips/buttons tint (`--surface-rgb`) | white at 3–7% | ink `6,27,27` at 3–7% |
| Hairlines (footer, hero meta) | white at 7–8% | ink at 7–8% |
| Big step numbers (01–05) | gold at .24 / hover .42 | near-black `12,11,9` at .55 / hover .74 |

**Background texture:** a fixed 48px grid of 1px lines (2.5% opacity, the whole layer at 16%) that fades out by 72% of the viewport height (`mask-image`).

**The two rules the light theme depends on:**

1. **Brand panels stay dark in both themes.** These are service cards, work and gallery cards, the CTA box, the lightbox and the avatar. Text on them uses the fixed `--white`/`--muted`/`--gold`. Everything else (page, header, footer, `.glass` cards such as process steps, testimonials, contact cards and float chips) changes with the theme and uses `--text`/`--text-muted`/`--gold-text`.
2. **Gold as text on a background that changes with the theme must use `--gold-text`**, which is bronze in light mode. Plain `--gold` text on cream fails contrast (~1.7:1).

### 3.3 Brand-panel gradients (always dark)

| Element | Background |
| --- | --- |
| Service card | `linear-gradient(145deg, rgba(17,82,78,.72), rgba(7,43,44,.88))`. Hover: `.82` / `rgba(8,48,49,.94)` |
| Work cards 1–6 (fallback under cover photo) | 135°: `#0b5f59→#0b4147→#071f2d`, `#0a5a56→#0a3f47→#08232f`, `#0e625b→#0a4249→#08232f`, `#0a3e47→#0c5b55→#08242f`, `#0b5753→#0a3e46→#08232f`, `#0a4d50→#0d5c55→#08232f` |
| Gallery cards 1–6 (fallback) | 135°: `#0e514c→#071d2d`, `#0b2d37→#183f42`, `#183b37→#071b2f`, `#0b2330→#0d514d`, `#123a38→#071b2f`, `#0a2b31→#16433f` |
| Card text overlay | `linear-gradient(to top, rgba(3,13,17,.96), rgba(3,13,17,.28) 70%, transparent)` |
| CTA box | `radial-gradient(circle at 12% 10%, rgba(226,185,97,.20), transparent 28%)` over `linear-gradient(135deg, rgba(17,82,78,.68), rgba(6,27,47,.72))` |
| Hero photo frame | `linear-gradient(145deg, #0f514c, #082c31 58%, #071b2f)` |
| Hero orb (behind photo) | 430px circle, `radial-gradient(circle at 35% 30%, rgba(226,185,97,.32), rgba(17,82,78,.12) 45%, transparent 70%)`, blur 2px |
| Avatar | `radial-gradient(circle at 35% 30%, #e2b961, #11524e 55%, #071b2f)` |
| Icon tile | `linear-gradient(145deg, rgba(226,185,97,.22), rgba(226,185,97,.06))`, border `rgba(226,185,97,.4)` |
| Lightbox card | `linear-gradient(145deg, #11413f, #071b2f)`. Backdrop `rgba(3,10,14,.88)` + blur 6px |

### 3.4 Typography

| Font | Use | Weights | Source |
| --- | --- | --- | --- |
| **Expo Arabic** | All body and heading text when `dir=rtl` | 400, 600, 700–900 | `db.onlinewebfonts.com` (third-party host; for the rebuild, check the license and self-host) |
| **Manrope** | All text when `dir=ltr`, plus decorative numerals in both languages (step numbers, avatar, "TM" watermark) | 400–800 | Google Fonts |

| Role | Desktop | ≤980px | Notes |
| --- | --- | --- | --- |
| Hero H1 (2 lines: white + gold) | `clamp(38px, 4.4vw, 64px)` / lh 1.03 / ls -0.045em | `clamp(34px, 9vw, 46px)` / 1.08 | Each line is shrunk to fit on one line (min 70%) on desktop |
| Section H2 (with gold kicker) | `clamp(28px, 2.25vw, 32px)` / 1.15 / -0.035em | `clamp(25px, 7.2vw, 34px)`; ≤420 `clamp(24px, 7.5vw, 30px)` | Shrunk to one line (min 78%) on desktop |
| Inner-page H1 | `clamp(32px, 3.5vw, 50px)` / 1.08 / -0.035em | same | |
| CTA H2 | `clamp(34px, 4.8vw, 60px)` | 34px / 1.15 | Shrunk to one line (min 45%) on desktop |
| Hero paragraph | 18px / 1.9, muted | 16px / 1.85 | |
| Section description | 16px / 1.9, muted, max-width 700px | 15px, full width | |
| About lead | 22px / 1.75, text at 90% | 18px / 1.7 | |
| About body | 15px / 2.0, muted | | |
| Card title (service) | 20px | 19px / 1.35 | |
| Card body (service) | 16px / 1.8 | | |
| Work/gallery overlay | label 11px/800 gold · title 22px · body 14px/1.75 | title 20px · body 13px | |
| Step number | Manrope 800 44px | 36px | |
| Step title / body | 17px / 14px lh 1.8 | 16px / 13px | |
| Testimonial quote | `clamp(20px, 2.4vw, 31px)` / 1.65 | 19px / 1.7 | Stars: 18px, letter-spacing 4px |
| Hero metric number | 34px / 800 gold (`+12`) | 28px (≤420: 25px) | Label 300 weight |
| Hero metric text | 18px / 1.45 / 300 | 14px (≤420: 13px) | |
| Nav link | 14px / 600, muted, hover → text | 13px in the 981–1180 zone | |
| Buttons | 16px / 800 (gold) | | Lang toggle 13px/700 |
| Footer | title 800 gold-text · body 14px/1.9 · links 13px · copyright 12px at 42% | | |

**Rendered heading sizes, measured at 1440px after shrink-to-fit:** hero lines 63.4px (AR) and 59.5px / 63.4px (EN). Section H2s are 32px in both languages, so no shrink is needed. CTA H2 is 39.7px (AR) and 30.7px (EN). The values for every viewport are in `measurements/`.

**Kicker pattern:** every section heading starts with a gold phrase that ends in a colon, inside the same `<h2>` and at the same size, e.g. `<span class="section-kicker">خدماتنا:</span> ما نستطيع تقديمه…`. There's no separate small eyebrow label (that was tried and rejected twice).

### 3.5 Layout, spacing and radius

- **Container:** `min(1320px, 100% − 2×gutter)`. Gutter is **40px** at ≥981px. Below that, the homepage uses **24px**, while inner pages use **20px** (≤980) and **12px** (≤640). That's an inconsistency; unify it in the rebuild.
- **Breakpoints:** `>1180` desktop · `981–1180` header "squeeze zone" (tighter nav only) · `≤980` tablet/mobile (hamburger, single-column layouts) · `≤640` · `≤420` small phones.
- **Vertical rhythm:** sections `padding: 70px 0`. Section head: gap 8px, margin-bottom 42px (30 at ≤980, 24 at ≤420). Hero: `150px 0 70px` (≤980: `112px 0 48px`). Inner pages: `.page` `150px 0 100px` (≤980: `112px 0 70px`). Anchor offset `scroll-margin-top: 96px` (88px on mobile) so the fixed header doesn't cover headings.
- **Radius scale:** 11–12px (small buttons, chips, socials) · 14–15px (main buttons, icon tiles) · 16px (float chips, mobile dropdown) · 18px (process steps) · **20px = `--radius`** (cards, header pill) · 22–24px (lightbox, testimonials) · 28–30px (CTA, about collage, hero frame).
- **Grids:**

| Block | Desktop | ≤980 | ≤640 | ≤420 |
| --- | --- | --- | --- | --- |
| Hero | 2 cols `1fr 1fr`, gap 70, **always LTR order** (copy left, photo right, in both languages) | 1 col (copy then photo) | | buttons stack full width |
| Services (6) | 3 cols, gap 16 | 2 cols, gap 12 | 1 col | |
| Work teaser (5) | `auto-fit minmax(320px,1fr)`, gap 16 → 3+2 at 1440 | 1 col | | |
| About | `.94fr 1.06fr`, gap 70 (collage on the inline-start side) | 1 col | | |
| Process (5) | `auto-fit minmax(200px,1fr)`, gap 12 → 5 across | `minmax(150px,1fr)` | 2 cols | 1 col |
| Footer | `1.25fr .8fr .9fr 1fr`, gap 40 | 2 cols | | 1 col |
| Gallery (6) | 3 cols, gap 16 | 2 cols | 1 col | |
| Contact methods (2) | `auto-fit minmax(280px,1fr)`, gap 20 | 1 col | | |
| Contact steps (3) | `auto-fit minmax(220px,1fr)`, gap 16 | 1 col | | |

All grids that render data arrays use `auto-fit`/`minmax` or a fixed column count with no per-item rules, so adding or removing items never breaks the layout. Keep that property in the rebuild.

### 3.6 Motion

- **Easing everywhere:** `--ease: cubic-bezier(.2,.8,.2,1)`.
- **Hover lifts:** service card −7px; work, gallery, step and contact cards −6px; buttons −2px (gold adds `brightness(1.04)` and a bigger gold shadow); slider arrows `scale(1.06)`. Durations .25–.35s.
- **Work and gallery card hover:** image `scale(1.045)` over .65s. The overlay slides up from `translateY(10px)` to 0 (.4s; on mobile the overlay is always in place). Border becomes `rgba(226,185,97,.48)`.
- **Nav link hover/active:** a 2px gold underline grows `scaleX(0→1)` from the center (.3s).
- **Scroll reveal:** `.reveal` starts at `opacity 0; translateY(22px)` and moves to its final position over .7s when 8% visible. It plays once and never reverses.
- **Hero metrics:** fade up 14px, staggered .12s / .24s / .36s. The years counter counts 1 → 12 over 1.1s with an ease-out-cubic curve.
- **Ambient glow:** a blurred radial-gradient blob drifts inside every service card (8s loop) and work/gallery card (9s loop), with staggered delays. It only runs while the card is near the viewport (a separate IntersectionObserver with 200px margin; important for scroll performance). Disabled under `prefers-reduced-motion`.
- **Header:** after 24px of scroll the pill darkens and gains a shadow (.35s).
- **Theme toggle icon:** sun and moon cross-fade with scale .4↔1 and ±40° rotation (.3–.35s).
- **Testimonial slider:** `translateX` in pixels, .55s.
- **Lightbox:** card fades in and scales .94 → 1 (.28s). Closing plays the reverse before the dialog actually closes.
- **Smooth anchor scrolling:** `html { scroll-behavior: smooth }`.

### 3.7 Elevation and glass

`.glass` = 145° gradient fill (above) + 1px `--line` border + `inset 0 1px 0 rgba(surface,.09)` top highlight + `--shadow` + `backdrop-filter: blur(8px)`. Blur radii were deliberately halved for scroll performance (header 8px, cards 8px, slider buttons 6px). z-index: header 50; overlays inside cards 1–2; the lightbox is a native modal `<dialog>`.

---

## 4. Shared components

### 4.1 Header (identical on all 8 pages)

Screenshots: `screenshots/states/header/`, `screenshots/sections/home/*/0-header_*`.

- **Fixed floating pill**, 18px from the top (10px on mobile), inside the container. Min-height 64px (60px ≤980, 56px ≤420), radius 20px, padding 7px 16px, glass with a gold hairline `rgba(226,185,97,.16)`.
- **Order (in RTL, right to left):** logo (40px tall; 36px and 33px on smaller screens) → nav links centered (`margin-inline:auto`, gap 18px) → actions: theme toggle (40×40) · language button ("EN"/"AR") · gold CTA. In LTR the whole row mirrors.
- **Logo swap:** `logo.png` (white wordmark) in dark mode, `logo-light.png` (dark wordmark, same gold) in light mode.
- **Squeeze zone 981–1180px:** nav gap 10px, links 13px, CTA padding 14px.
- **≤980px:** links collapse behind a 40×40 "☰" button. The CTA is hidden. The dropdown is a full-width panel 8px under the pill (radius 16px, `rgba(nav-bg-scrolled,.94)`), with links stacked and centered as 11px-radius tiles; the active/hover tile gets a gold 10% tint.
- **Scrollspy (homepage only):** the link for the section in view gets `.active` (white text + underline). The hero maps to "Home".

### 4.2 Buttons

Screenshots: `screenshots/states/buttons/`.

| Button | Spec |
| --- | --- |
| Gold (primary) | h 48px, padding 0 20px, radius 14px, bg `--gold`, text black 800, border `rgba(226,185,97,.55)`, shadow `0 10px 28px rgba(226,185,97,.14)`. Hover: −2px, shadow .23, brightness 1.04 |
| Ghost (secondary) | h 48px, radius 14px, bg surface 3.5%, border `rgba(226,185,97,.25)`, text `--text` (fixed white inside the CTA box). Hover: bg gold 8%, −2px |
| Language / theme / menu | radius 11–12px, bg surface 4%, border `rgba(226,185,97,.22)` → hover .45 |
| Slider arrows | 44px circle, bg surface 14%, border surface 30%, blur 6px; hover 26% / 50% / scale 1.06 |
| Slider dots | 8px circles, surface 25%; active = gold, scale 1.25 |
| Lightbox close / prev / next | circles 44px / 52px (38 / 42 on mobile), white 10% bg, white 25% border |

On mobile the hero's two buttons share one row (`flex:1 1 0`). At ≤420 they stack full width.

### 4.3 Section head

A gold kicker and the heading share one `<h2>` (one size), then a muted description paragraph 8px below (max 700px). Text aligns to the language's start side. On desktop the heading is shrunk to fit one line (see 6.4).

### 4.4 Footer (identical on all pages)

Screenshots: `screenshots/sections/home/*/8-footer_*`, `screenshots/states/footer/`.

Four columns: **brand** (logo + tagline, max 320px) · **Links** (Services, Work, About, Contact) · **Services** (4 of the 6 services, all pointing to `#services`) · **Contact**: a wrapping row of 10 icon tiles (40×40, radius 12): WhatsApp, Email, Instagram, Facebook, LinkedIn, Behance, X, Threads, TikTok, Snapchat. Below that is a hairline and a centered copyright line, "© {year} Thaer Media. جميع الحقوق محفوظة.", at 12px. Top border is a 7% hairline.

---

## 5. Pages

### 5.1 Homepage (`index.html`)

Sections in order, each with a desktop and mobile crop in `screenshots/sections/home/`:

1. **Hero** (`min-height: 100svh`, content centered vertically)
   - Copy column: two-line H1 ("نوظِّفُ خبرتنا" in text color + "لنجاح علامتك التجارية" in gold), paragraph, buttons **"لنتحدث عن مشروعك"** (gold → contact.html) and **"شاهد أعمالنا"** (ghost → #work).
   - **Metrics row** under a hairline: `+12 عاماً من الخبرة` · `حلول تسويقية متكاملة` · `حضور عربي وعالمي` (3 equal columns on mobile).
   - Visual column: a glowing gold/teal orb behind a **portrait in a glass frame** (4:5, radius 30px, rotated 2°, inner gold hairline 14px in). The frame width is `min(500px, 100%, (100svh − 220px) × .8)` so the hero always fits one screen. Two **floating glass chips**: "إبداع × استراتيجية" (top, inline-end) and "تصميم • محتوى • إعلانات" (bottom, inline-start).
2. **Services**: 6 brand-panel cards (min-height 220px, padding 25px): gold icon tile (50px, icon inverted to white), title, description, decorative circle in the top inline-end corner, and the drifting glow. **Clicking a card** smooth-scrolls to the matching work card and gives it a gold focus ring for 2.2s. The Marketing card has no match and just jumps to `#work`.
3. **Work teaser**: 5 cards (min-height 320px; 280 on mobile, 250 at ≤420) with **cover photos that change per language** (`work-covers/ar|en/*.jpg`), a dark bottom overlay with a gold label ("01 · SOCIAL MEDIA"), title and one line of text. Each card links to its work page.
4. **About**: a collage on the inline-start side (480px tall): a large glass panel rotated −3° holding a photo in `mix-blend-mode: luminosity` over teal, with a gold oval outline and a faint "TM" watermark, plus two small glass tiles rotated 5° and 6° (gold-tinted and dark-tinted photos). The copy side has the H2, a lead paragraph, body text, and **4 bullets with gold glowing dots** in 2 columns sized to their content.
5. **Process**: 5 glass step cards: a big faded number 01–05, title, description, and a decorative circle outline in the bottom inline-start corner. Hover lifts the card and darkens the number.
6. **Testimonials**: one glass card per slide. A 90px gradient avatar ("01") sits beside ★★★★★, the quote (large, with a giant faint " glyph) and the author. Arrows sit inside the card on both edges with dots below. On mobile the arrows move below the card and align to the end.
7. **CTA**: a brand panel the full container width (radius 28px, padding 62px; 34/22 on mobile) with two decorative outline circles at the corners. Content column max 760px: kicker heading on one line, paragraph, **"تواصل عبر واتساب"** (gold) + **"راسلنا بالبريد"** (ghost).
8. **Footer**: see 4.4.

### 5.2 Work pages (`work-*.html`, one template)

- Header → page heading (H1 = service name, no kicker) + description → **gallery grid** of 6 cards (min-height 300px). Each card shows its image (or a fallback gradient + gold glow) and the overlay number, title and description → footer.
- **Lightbox** (`screenshots/states/lightbox/`): clicking or pressing Enter/Space on a card that has an image opens a modal. It has a dark blurred backdrop, a centered card (max 1000px wide) with the image (max height `min(64vh, 640px)`, `contain`) and a caption (number, title, description), a close button in the top inline-end corner, and prev/next buttons on the sides (hidden when there's only one image). Keyboard: Esc closes (with animation); ← and → step through images (they don't flip for RTL). A backdrop click closes it. Focus returns to the card that opened it, and page scroll is locked while it's open.
- Current content is placeholder: Picsum stock photos and "مساحة عمل / سيتم إضافة المشروع هنا." on every card.

### 5.3 Contact page (`contact.html`)

- H1 with kicker "لنبدأ: لنتحدث عن مشروعك" + paragraph.
- **2 contact method cards** (glass, padding 32px): gold icon tile (chat bubble / envelope), title, description, and the value pinned to the bottom in bold `--gold-text` (`+970 59 935 1383`, `thaeralqrenawi@gmail.com`, always LTR). The whole card is the link. Hover lifts it −6px with a gold border.
- Second head "كيف نبدأ: من أول رسالة إلى بداية العمل" (H2) + **3 glass step cards** (number in Manrope 32px).
- Footer.

---

## 6. Behaviour

### 6.1 Language (AR ⇄ EN)

- The default is Arabic/RTL. The `EN`/`AR` button swaps `<html lang dir>` and every element's text from its `data-ar`/`data-en` attributes. The choice is saved in `localStorage.lang` and applied **before first paint** by an inline `<head>` script, so the layout doesn't flip on load.
- In LTR the whole layout mirrors **except the hero grid**, which keeps copy on the left and the photo on the right in both languages.
- Fonts switch: Expo Arabic (RTL) ⇄ Manrope (LTR).
- The homepage work-card covers swap to the English versions. The tab title updates.
- The English copy is longer, so headings shrink more to stay on one line (expected).
- **Both languages share one URL** (client-side switch). That's bad for SEO; see the recommendations.

### 6.2 Theme (dark ⇄ light)

The sun/moon button toggles `data-theme="light"` on `<html>` (dark = no attribute). The choice is saved in `localStorage.theme` and applied before first paint. The logo image swaps. See 3.2 for exactly what changes.

### 6.3 Scroll

The header darkens after 24px. On the homepage, scrollspy highlights the current nav link. Reveal animations play once. Card glow loops run only while the cards are near the viewport.

### 6.4 One-line headings (desktop ≥981px only)

After load, after a language switch and after a resize (150ms debounce), each section H2, each hero H1 line and the CTA H2 are set to `nowrap` and their font size is scaled by `clientWidth / scrollWidth`. If even the minimum ratio (.78 / .70 / .45) doesn't fit, the heading wraps at full size. On mobile, headings wrap naturally. In a rebuild, `font-size: clamp()` plus shorter copy, or a fit-text utility, can do the same job.

### 6.5 Mobile menu

"☰" toggles the dropdown. **It doesn't close when a link is tapped, when you tap outside it, or on Esc, and it has no `aria-expanded`.** These are small UX gaps worth fixing in the rebuild.

### 6.6 Testimonials slider

Click-only: arrows and dots, looping. There's no autoplay, swipe or keyboard support. The slide count follows the data, and the dots are generated to match.

---

## 7. Content model (`source-assets/data.js`)

All copy and image paths sit in one `SITE_DATA` object (copy kept at `source-assets/data.js`; its comments are in Arabic, for the client). Every text field has the form `{ ar, en }`, and some contain inline HTML for the gold kicker span. A rebuild can lift this almost directly into a CMS or i18n JSON:

```text
contact      { whatsappUrl, whatsappDisplay, email, emailUrl }      ← single source for every contact link
headerCta    {ar,en}
socials[]    { key: whatsapp|email|instagram|facebook|linkedin|behance|x|threads|tiktok|snapchat, url }
nav[]        { href, ar, en }                                        ← 7 items
home.hero    { photo, heading, paragraph, primaryButton, secondaryButton, chipOne, chipTwo,
               yearsOfExperience: 12, metricYearsLabel, metricSolutions, metricPresence }
home.services[]   { slug, href, icon, title, desc }                  ← 6
home.workTeaser[] { slug, href, coverAr, coverEn, badge, title, desc } ← 5
home.about   { mainPhoto, miniPhotoOne, miniPhotoTwo, heading, lead, paragraph, bullets[4] }
home.process[]    { num, title, desc }                               ← 5
home.testimonials[] { avatar, quote, author }                        ← 3
home.cta     { heading, paragraph, whatsappButton, emailButton }
footer       { tagline, linksTitle, servicesTitle, contactTitle, servicesList[4], copyright }
work.<slug>  { title, description, gallery[]: { number, title, description, image } }   ← 6 slugs
contactPage  { title, heading, paragraph, methods[]: {type, title, description},
               processHeading, processParagraph, process[]: {num, title, description} }
```

## 8. Assets

The originals are in `source-assets/`, verified byte-for-byte against the old site's files before it was removed.

| Kept in `source-assets/` | Notes |
| --- | --- |
| `images/logo.png`, `logo-light.png` | Dark-theme and light-theme logos (the light one was generated by recoloring the original) |
| `images/hero-person.jpg` | Founder portrait as used on the site, 148 KB |
| `images/hero-person-original.png` | The same portrait at full quality (1122×1402, 2.5 MB). Use this as the source for the rebuild's image pipeline |
| `images/about-*.jpg` | 3 Unsplash stock photos (free tier). Not real team photos |
| `service-icons/*` | 5 PNG + 1 SVG. Drawn dark and inverted to white by CSS |
| `work-covers/ar/*.jpg`, `en/*.jpg` | Homepage work covers, one set per language |
| `icon/TH.png` | Favicon |
| `data.js` | All site copy (AR and EN), contact details, social links |

Not kept: the gallery placeholder photos (random Picsum images), unused leftovers from `assets/legacy/` and `assets/work-covers/*.svg`, and the site's HTML/CSS/JS. They're in the Recycle Bin if needed.

---

## 9. Known issues and rebuild recommendations

A prioritised version in Arabic, with fixes, effort estimates and an execution order, is in [`../IMPROVEMENTS.md`](../IMPROVEMENTS.md).

Bugs and inconsistencies to fix rather than copy:

1. The header CTA goes to WhatsApp on the homepage but to `contact.html` everywhere else.
2. `work-marketing.html` is orphaned. Either link it or drop the Marketing gallery.
3. The mobile menu doesn't close on link tap, outside tap or Esc, and has no `aria-expanded`/focus handling.
4. Mobile side gutters differ between page types. Measured at 390px wide: on the homepage the content **and the header pill** start 24px from the edge; on work pages and contact they start 12px from the edge (20px between 641 and 980px). The header changes width when you navigate between them.
5. Only the homepage has a `<meta name="description">`. There are no Open Graph or Twitter tags, no `hreflang`, and no canonical URLs.
6. The tab title on the homepage changes spelling after switching EN → AR (it uses a hardcoded string with tatweel "لنجــاح…" instead of `data.js` `meta.home.title`, which nothing uses).
7. The aria-labels on slider and lightbox buttons are Arabic only.
8. **In English (LTR) the slider and lightbox arrows point the wrong way (inward).** The buttons move sides with the direction (logical properties), but their chevron icons don't flip, so the left button shows `>` and the right one shows `<` (see `screenshots/sections/home/desktop-1440/6-testimonials_en-*.png`). In Arabic they're correct. Fix by mirroring the icons with `[dir=ltr] … svg { transform: scaleX(-1) }`, or pick icons by direction.
9. Images have no `width`/`height`, which risks layout shift.
10. The footer "Services" column lists 4 of the 6 services, and all of them point to `#services` instead of their pages.
11. **The testimonial quote can run under the arrow on its text side.** The end-side padding is 52px, but the arrow occupies 24–68px from the edge. Measured: the quote's text box overlaps the arrow by 15px at 1000, 1200, 1440 and 1920px, in AR and EN. Any line that fills the full width ends under the button. (Only the avatar side was fixed earlier.) Fix: `padding-inline-end: 88px`, the same as the start side.
12. **On phones and tablets, the lightbox's prev/next buttons are covered by the image and can't be tapped.** Hit-tested: covered at 390px and 820px; clickable at 640, 1024, 1100 and 1440px. The buttons come before the `<figure>` in the DOM and have no z-index, so wherever the image reaches the screen edge it paints on top of them (`screenshots/states/lightbox/mobile-open_*`). Fix: give `.lightbox-close, .lightbox-nav` a `z-index` above the figure.
13. The mobile dropdown's `backdrop-filter: blur(8px)` has no effect, because it sits inside `.nav`, which has its own backdrop-filter. The page behind shows sharp through the 94%-opaque panel (`screenshots/states/mobile/home-menu-open_*`). In the rebuild, render the dropdown outside the blurred pill, or make it opaque.

Recommendations for the rebuild:

- **Real per-language URLs** (`/` and `/en/`, or `/ar/` and `/en/`) with `hreflang`, server-rendered text and per-page meta. Keep the instant pre-paint theme script.
- **Self-host fonts** (and check the Expo Arabic license). Subset them and preload the RTL weights.
- Keep the **token system** in section 3 as-is (it already separates "fixed-dark brand panels" from "surfaces that change with the theme"). In Tailwind or similar, map these to theme variables rather than hard-coding colors.
- Rebuild the slider as a component with swipe, keyboard and optional autoplay (pause on hover). Respect `prefers-reduced-motion` for reveals too, not only the glows.
- Replace JS heading-fitting with `clamp()` sizes tuned per language, or `text-wrap: balance` plus shorter copy.
- Use `next/image` (or similar) for the covers and gallery: responsive sizes, AVIF/WebP, lazy loading and blur placeholders.
- Turn `data.js` into a CMS or i18n JSON. The schema in section 7 is already clean.
- Testimonials currently use number avatars ("01") and a generic author ("عميل Thaer Media"). The rebuild should support a real name, company and photo.
