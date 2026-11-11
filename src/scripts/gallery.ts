/* Portfolio pages: lightbox with keyboard arrows, swipe, and pinch / double-tap zoom on touch
 * screens. Ported from the live site's gallery.js; the grid itself is built by Astro. */
const box = document.getElementById('lightbox') as HTMLDialogElement | null;
const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.gallery-open'));

if (box && buttons.length) {
  const img = box.querySelector<HTMLImageElement>('[data-img]')!;
  const counter = box.querySelector<HTMLElement>('[data-counter]')!;
  const rtl = () => document.documentElement.dir === 'rtl';
  let index = 0;
  let trigger: HTMLElement | null = null;

  /* zoom state */
  let scale = 1, panX = 0, panY = 0, lastTap = 0;
  let gesture: { type: 'pinch'; d: number; scale: number } | { type: 'pan'; x: number; y: number; panX: number; panY: number } | { type: 'swipe'; x: number; y: number } | null = null;
  const apply = (animate: boolean) => {
    const maxX = (img.offsetWidth * (scale - 1)) / 2;
    const maxY = (img.offsetHeight * (scale - 1)) / 2;
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
    img.style.transition = animate ? 'transform .2s ease' : 'none';
    img.style.transform = scale > 1 ? `translate(${panX}px, ${panY}px) scale(${scale})` : '';
    box.classList.toggle('is-zoomed', scale > 1);
  };
  const resetZoom = () => { scale = 1; panX = 0; panY = 0; gesture = null; img.style.transform = ''; box.classList.remove('is-zoomed'); };

  const show = (i: number) => {
    index = (i + buttons.length) % buttons.length;
    resetZoom();
    box.classList.add('is-loading');
    img.src = buttons[index].dataset.full!;
    img.alt = buttons[index].dataset.alt ?? '';
    counter.textContent = `${index + 1} / ${buttons.length}`;
    // Preload the neighbours so prev/next feel instant.
    for (const j of [index - 1, index + 1]) new Image().src = buttons[(j + buttons.length) % buttons.length].dataset.full!;
  };
  img.addEventListener('load', () => box.classList.remove('is-loading'));

  const open = (i: number, from: HTMLElement) => {
    trigger = from;
    show(i);
    box.showModal();
    document.documentElement.classList.add('has-modal');
    requestAnimationFrame(() => box.classList.add('is-open'));
  };
  const close = () => { if (box.open) box.close(); };
  box.addEventListener('close', () => {
    box.classList.remove('is-open');
    document.documentElement.classList.remove('has-modal');
    resetZoom();
    trigger?.focus();
  });

  buttons.forEach((btn, i) => btn.addEventListener('click', () => open(i, btn)));
  box.querySelector('[data-close]')!.addEventListener('click', close);
  box.querySelectorAll<HTMLButtonElement>('.lightbox-nav').forEach((btn) => btn.addEventListener('click', () => show(index + (btn.dataset.dir === 'next' ? 1 : -1))));
  box.addEventListener('click', (e) => { const el = e.target as Element; if (el === box || el.classList.contains('lightbox-stage')) close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    show(index + ((e.key === 'ArrowLeft') === rtl() ? 1 : -1));
  });

  /* touch: swipe, pinch and double-tap zoom */
  const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  img.addEventListener('touchstart', (e) => {
    const [a, b] = Array.from(e.touches);
    if (b) gesture = { type: 'pinch', d: dist(a, b), scale };
    else if (scale > 1) gesture = { type: 'pan', x: a.clientX, y: a.clientY, panX, panY };
    else gesture = { type: 'swipe', x: a.clientX, y: a.clientY };
  }, { passive: true });
  img.addEventListener('touchmove', (e) => {
    if (!gesture) return;
    const [a, b] = Array.from(e.touches);
    if (gesture.type === 'pinch' && b) {
      e.preventDefault();
      scale = Math.max(1, Math.min(4, (gesture.scale * dist(a, b)) / gesture.d));
      apply(false);
    } else if (gesture.type === 'pan' && a) {
      e.preventDefault();
      panX = gesture.panX + a.clientX - gesture.x;
      panY = gesture.panY + a.clientY - gesture.y;
      apply(false);
    }
  }, { passive: false });
  img.addEventListener('touchend', (e) => {
    if (!gesture) return;
    const touch = e.changedTouches[0];
    if (gesture.type === 'swipe' && touch) {
      const dx = touch.clientX - gesture.x, dy = touch.clientY - gesture.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) show(index + ((rtl() ? dx > 0 : dx < 0) ? 1 : -1));
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        const now = Date.now();
        if (now - lastTap < 300) { scale = 2.2; panX = 0; panY = 0; apply(true); lastTap = 0; } else lastTap = now;
      }
    } else if (gesture.type === 'pan' && touch && Math.abs(touch.clientX - gesture.x) < 10 && Math.abs(touch.clientY - gesture.y) < 10) {
      const now = Date.now();
      if (now - lastTap < 300) { scale = 1; panX = 0; panY = 0; apply(true); lastTap = 0; } else lastTap = now;
    }
    if (!e.touches.length) gesture = null;
  });
  // Desktop: double-click toggles zoom.
  img.addEventListener('dblclick', () => { scale = scale > 1 ? 1 : 2; panX = 0; panY = 0; apply(true); });
}
