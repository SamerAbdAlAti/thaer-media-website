/* Every page: theme, language preference, header + menu, scrollspy, reveal-on-scroll, card glows,
 * floating WhatsApp visibility, footer year, and the portfolio "don't save" guard.
 * Behaviour mirrors the live site's site.js; content is already in the HTML (built by Astro). */
const doc = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isHome = document.body.dataset.page === 'home';

/* ---------- theme ---------- */
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const light = doc.getAttribute('data-theme') !== 'light';
  if (light) doc.setAttribute('data-theme', 'light');
  else doc.removeAttribute('data-theme');
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = light ? '#f4f9f5' : '#063632';
  try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch { /* storage unavailable */ }
});

/* ---------- language: remember the choice (the head script redirects returning visitors) ---------- */
document.getElementById('langToggle')?.addEventListener('click', (e) => {
  try { localStorage.setItem('lang', (e.currentTarget as HTMLElement).dataset.lang ?? 'ar'); } catch { /* ignore */ }
});

/* ---------- header ---------- */
const header = document.querySelector<HTMLElement>('.site-header');
let ticking = false;
const onScroll = () => { header?.classList.toggle('is-scrolled', scrollY > 16); ticking = false; };
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const menuBtn = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => { menuBtn.setAttribute('aria-expanded', String(open)); navLinks.classList.toggle('is-open', open); };
  menuBtn.addEventListener('click', () => setOpen(!isOpen()));
  navLinks.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setOpen(false); menuBtn.focus(); } });
  document.addEventListener('pointerdown', (e) => { if (isOpen() && !(e.target as Element).closest('.nav')) setOpen(false); });
  matchMedia('(min-width:1081px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}

/* ---------- scrollspy (homepage) ---------- */
if (isHome && 'IntersectionObserver' in window) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#navLinks a'));
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}

/* ---------- reveal on scroll (one-way) ---------- */
const reveals = document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger, .gallery-item');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible', 'is-revealed'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      el.classList.add('is-visible');
      io.unobserve(el);
      // After the entrance, cards switch back to their own (faster) hover transitions.
      if (el.classList.contains('reveal-stagger')) setTimeout(() => el.classList.add('is-revealed'), 1300);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
}

/* ---------- ambient glows: animate only while on screen ----------
   Separate from the reveal on purpose: reveal is one-way, glows must stop when off screen. */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const glowIO = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('glow-active', e.isIntersecting);
  }, { rootMargin: '150px 0px' });
  document.querySelectorAll('[data-glow]').forEach((el) => glowIO.observe(el));
}

/* ---------- floating WhatsApp: hidden while a form or the footer is on screen ---------- */
const floatBtn = document.querySelector<HTMLElement>('.floating-whatsapp');
const watched = Array.from(document.querySelectorAll('form, .site-footer'));
if (floatBtn && watched.length && 'IntersectionObserver' in window) {
  const visible = new Set<Element>();
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    floatBtn.classList.toggle('is-hidden', visible.size > 0);
  }, { rootMargin: '0px 0px -40px 0px' });
  watched.forEach((el) => obs.observe(el));
}

/* ---------- footer year (the page is static; keep it current between rebuilds) ---------- */
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

/* ---------- discourage casual saving of portfolio artwork ---------- */
const guard = (e: Event) => { if ((e.target as Element)?.closest?.('.gallery-item img, .lightbox img')) e.preventDefault(); };
document.addEventListener('contextmenu', guard);
document.addEventListener('dragstart', guard);
