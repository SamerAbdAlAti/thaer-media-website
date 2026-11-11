/* Homepage: counters, hero title fit, services → work shortcut, and the two carousels
 * (promo + testimonials). Ported from the live site's home.js. */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const doc = document.documentElement;
const rtl = () => doc.dir === 'rtl';

/* ---------- metrics count up when they come into view (real numbers are already in the HTML) ---------- */
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((c) => io.observe(c));
}

/* ---------- hero title: always exactly two lines ----------
   Each line is nowrap; if a line is wider than its column, the title shrinks just enough to fit. */
const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
  const fit = () => {
    heroTitle.style.fontSize = '';
    const box = heroTitle.clientWidth;
    const widest = Math.max(...Array.from(heroTitle.querySelectorAll('.hero-line')).map((line) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      return range.getBoundingClientRect().width;
    }));
    if (widest > box) heroTitle.style.fontSize = `${(parseFloat(getComputedStyle(heroTitle).fontSize) * box) / widest * 0.98}px`;
  };
  let timer = 0;
  addEventListener('resize', () => { clearTimeout(timer); timer = window.setTimeout(fit, 100); });
  document.fonts?.ready.then(fit);
}

/* ---------- services with a portfolio: scroll to its cover in "Our work" and highlight it ---------- */
document.querySelector('.services-grid')?.addEventListener('click', (event) => {
  const e = event as MouseEvent;
  const card = (e.target as Element).closest<HTMLElement>('.service-card[data-work]');
  if (!card || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const cover = document.querySelector<HTMLElement>(`.work-card[data-work="${CSS.escape(card.dataset.work!)}"]`);
  if (!cover) return;
  e.preventDefault();
  cover.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
  document.querySelectorAll('.work-card.is-focus').forEach((el) => el.classList.remove('is-focus'));
  cover.classList.add('is-focus');
  clearTimeout(Number(cover.dataset.focusTimer));
  cover.dataset.focusTimer = String(window.setTimeout(() => cover.classList.remove('is-focus'), 2600));
  setTimeout(() => cover.focus({ preventScroll: true }), reduceMotion.matches ? 0 : 600);
});

/* ---------- carousel ----------
   The clipping viewport and the moving track are separate elements (moving the clipped element
   itself would carry its clip boundary away with it). */
function carousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('.slider-track')!;
  const viewport = root.querySelector<HTMLElement>('.slider-viewport')!;
  const slides = Array.from(track.children) as HTMLElement[];
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.slider-dot'));
  const delay = Number(root.dataset.autoplay) || 0;
  let index = 0;
  let timer: number | undefined;
  let paused = false;
  let inView = true;
  if (slides.length < 2) return;

  const go = (next: number, user = false) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(${(rtl() ? 1 : -1) * index * 100}%)`;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      // Make sure the current and the next image are requested.
      if (active || i === (index + 1) % slides.length) slide.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
    if (user) restart();
  };
  const stop = () => { clearInterval(timer); timer = undefined; };
  function restart() {
    stop();
    if (!delay || paused || !inView || reduceMotion.matches || document.hidden) return;
    timer = window.setInterval(() => go(index + 1), delay);
  }

  root.querySelectorAll<HTMLButtonElement>('.slider-arrow').forEach((btn) => btn.addEventListener('click', () => go(index + (btn.dataset.dir === 'next' ? 1 : -1), true)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i, true)));
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const forward = (e.key === 'ArrowLeft') === rtl();
    go(index + (forward ? 1 : -1), true);
  });
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { paused = true; stop(); } });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { paused = false; restart(); } });
  root.addEventListener('focusin', () => { paused = true; stop(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget as Node)) { paused = false; restart(); } });
  document.addEventListener('visibilitychange', restart);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; restart(); }, { threshold: 0.3 }).observe(root);
  }

  // Swipe on touch screens.
  let startX: number | null = null;
  let startY = 0;
  let moved = false;
  viewport.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; startX = e.clientX; startY = e.clientY; moved = false; });
  viewport.addEventListener('pointermove', (e) => { if (startX !== null && Math.abs(e.clientX - startX) > 10) moved = true; });
  viewport.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    go(index + ((rtl() ? dx > 0 : dx < 0) ? 1 : -1), true);
  });
  viewport.addEventListener('pointercancel', () => { startX = null; });
  // Don't follow the slide's link after a swipe.
  viewport.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

  go(0);
  restart();
}
document.querySelectorAll<HTMLElement>('[data-slider]').forEach(carousel);
