/* Content dashboard. No server and no login: it edits a copy of site.json in the browser, then
 * hands over (1) resized + renamed images to upload into the right folder and (2) the new JSON
 * to paste into GitHub. GitHub's build then validates everything and publishes. */
import { SECTIONS, type Field } from './fields';

type Payload = { site: any; assets: Record<string, string>; repo: string; branch: string; version: string };
type Pending = { blob: Blob; url: string; folder: string; name: string; before: number; after: number; downloaded: boolean };

const payload: Payload = JSON.parse(document.getElementById('admData')!.textContent!);
const publishedText = JSON.stringify(payload.site);
let state: any = structuredClone(payload.site);
const pending = new Map<string, Pending>(); // key = image path as written in site.json
const DRAFT_KEY = 'tm-admin-draft';

/* ---------------- tiny DOM helper ---------------- */
type Child = Node | string | null | undefined | false;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, any> = {}, ...kids: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k in el && typeof v !== 'string') (el as any)[k] = v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of kids) if (c) el.append(c);
  return el;
}
const getAt = (o: any, key: string) => (key === '' ? o : key.split('.').reduce((x, k) => x?.[k], o));
function setAt(o: any, key: string, v: any) {
  const ks = key.split('.');
  const last = ks.pop()!;
  const parent = ks.reduce((x, k) => (x[k] ??= {}), o);
  parent[last] = v;
}
const idFor = (path: string) => 'f' + path.replace(/[^a-zA-Z0-9]+/g, '-');
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);
const join = (p: string, k: string) => (k === '' ? p : p ? `${p}.${k}` : k);

/* ---------------- change tracking + draft ---------------- */
const status = document.getElementById('admStatus')!;
let draftTimer = 0;
function changed() {
  const dirty = JSON.stringify(state) !== publishedText;
  status.textContent = dirty ? 'تعديلات غير منشورة' : 'لا توجد تعديلات';
  status.classList.toggle('dirty', dirty);
  clearTimeout(draftTimer);
  draftTimer = window.setTimeout(() => {
    try {
      if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify({ base: payload.version, data: state, at: Date.now() }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch { /* storage full or blocked */ }
  }, 400);
}

/* ---------------- images ---------------- */
function thumbFor(path: string) {
  return pending.get(path)?.url ?? payload.assets[path] ?? '';
}
const toBlob = (c: HTMLCanvasElement, type: string, q?: number) => new Promise<Blob | null>((r) => c.toBlob(r, type, q));
const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 5)}`;
};

async function processImage(file: File, f: Extract<Field, { t: 'img' }>) {
  const base = `${f.name}-${stamp()}`;
  if (file.type === 'image/svg+xml') return { blob: file as Blob, name: `${base}.svg` };
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
  } catch {
    throw new Error('صيغة الصورة غير مدعومة في هذا المتصفح. حوّلها إلى JPG أو PNG وحاول مرة أخرى.');
  }
  const max = f.maxSize ?? 2400;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = h('canvas', { width: Math.round(bmp.width * scale), height: Math.round(bmp.height * scale) });
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  let blob = await toBlob(canvas, 'image/webp', 0.85);
  let ext = 'webp';
  if (!blob || blob.type !== 'image/webp') {
    // Browsers that can't encode WebP: keep transparency for PNGs, otherwise JPEG.
    const png = file.type === 'image/png';
    blob = await toBlob(canvas, png ? 'image/png' : 'image/jpeg', 0.85);
    ext = png ? 'png' : 'jpg';
  }
  if (!blob) throw new Error('تعذّرت معالجة الصورة.');
  return { blob, name: `${base}.${ext}` };
}

function prunePending() {
  const used = new Set<string>();
  JSON.stringify(state, (_k, v) => { if (typeof v === 'string' && pending.has(v)) used.add(v); return v; });
  for (const [p, item] of pending) if (!used.has(p)) { URL.revokeObjectURL(item.url); pending.delete(p); }
  renderPendingBadge();
}

/* ---------------- field renderers ---------------- */
function fieldWrap(f: { label: string; hint?: string }, id: string, ...kids: Child[]) {
  return h('div', { class: 'fld', id }, h('label', { class: 'fld-label', for: id + '-i' }, f.label), ...kids, f.hint ? h('p', { class: 'fld-hint' }, f.hint) : null);
}

function textInput(value: string, onInput: (v: string) => void, opts: { long?: boolean; dir: 'rtl' | 'ltr'; lang?: string; id?: string; type?: string }) {
  const long = opts.long || value.length > 70 || value.includes('\n');
  const el = long
    ? h('textarea', { rows: Math.min(8, Math.max(2, Math.ceil(value.length / 60) + (value.split('\n').length - 1))), dir: opts.dir, lang: opts.lang, id: opts.id })
    : h('input', { type: opts.type ?? 'text', dir: opts.dir, lang: opts.lang, id: opts.id });
  el.value = value;
  el.addEventListener('input', () => { onInput(el.value); changed(); });
  return el;
}

function renderField(f: Field, parent: any, path: string): HTMLElement {
  const p = join(path, f.k);
  const id = idFor(p);
  switch (f.t) {
    case 'T': {
      let v = getAt(parent, f.k);
      if (!v || typeof v !== 'object') { v = { ar: '', en: '' }; setAt(parent, f.k, v); }
      return fieldWrap(f, id, h('div', { class: 'pair' },
        h('span', { class: 'lang-tag' }, 'عربي'),
        textInput(v.ar ?? '', (x) => (v.ar = x), { long: f.long, dir: 'rtl', lang: 'ar', id: id + '-i' }),
        h('span', { class: 'lang-tag' }, 'English'),
        textInput(v.en ?? '', (x) => (v.en = x), { long: f.long, dir: 'ltr', lang: 'en' }),
      ));
    }
    case 'str':
      return fieldWrap(f, id, textInput(getAt(parent, f.k) ?? '', (x) => setAt(parent, f.k, x), { dir: f.ltr ? 'ltr' : 'rtl', id: id + '-i' }));
    case 'num': {
      const el = h('input', { type: 'number', min: '0', step: '1', id: id + '-i', dir: 'ltr' });
      el.value = String(getAt(parent, f.k) ?? '');
      el.addEventListener('input', () => { setAt(parent, f.k, el.value === '' ? '' : Number(el.value)); changed(); });
      return fieldWrap(f, id, el);
    }
    case 'url': {
      const wrap = fieldWrap(f, id);
      const draw = () => {
        wrap.querySelector('.url-body')?.remove();
        const body = h('div', { class: 'url-body' });
        if (f.skipIf?.(parent)) body.append(h('p', { class: 'fld-hint' }, 'يُؤخذ تلقائياً من بيانات التواصل.'));
        else body.append(textInput(getAt(parent, f.k) ?? '', (x) => setAt(parent, f.k, x), { dir: 'ltr', type: 'url', id: id + '-i' }));
        wrap.insertBefore(body, wrap.querySelector('.fld-hint'));
      };
      draw();
      wrap.addEventListener('admin:refresh', draw);
      return wrap;
    }
    case 'select': {
      const sel = h('select', { id: id + '-i' }, ...f.options.map(([v, label]) => h('option', { value: v }, label)));
      sel.value = getAt(parent, f.k) ?? f.options[0][0];
      sel.addEventListener('change', () => {
        setAt(parent, f.k, sel.value);
        changed();
        // fields depending on this one (e.g. social URL hidden for WhatsApp/Email)
        sel.closest('.item-body')?.querySelectorAll('.fld').forEach((x) => x.dispatchEvent(new Event('admin:refresh')));
        sel.closest('.item')?.dispatchEvent(new Event('admin:title'));
      });
      return fieldWrap(f, id, sel);
    }
    case 'img':
      return renderImage(f, parent, p, id);
    case 'group': {
      const obj = getAt(parent, f.k) ?? (setAt(parent, f.k, {}), getAt(parent, f.k));
      return h('fieldset', { class: 'grp', id }, h('legend', {}, f.label), ...f.fields.map((x) => renderField(x, obj, p)));
    }
    case 'list':
      return renderList(f, parent, p, id);
  }
}

function renderImage(f: Extract<Field, { t: 'img' }>, parent: any, path: string, id: string) {
  const wrap = fieldWrap(f, id);
  const body = h('div', { class: 'img-body' });
  wrap.insertBefore(body, wrap.querySelector('.fld-hint'));
  const draw = () => {
    const value: string = getAt(parent, f.k) ?? '';
    const src = value ? thumbFor(value) : '';
    const pend = pending.get(value);
    const file = h('input', { type: 'file', accept: 'image/*', id: id + '-i', class: 'sr-only' });
    file.addEventListener('change', async () => {
      const chosen = file.files?.[0];
      if (!chosen) return;
      body.classList.add('busy');
      try {
        const { blob, name } = await processImage(chosen, f);
        const newPath = `${f.folder}/${name}`;
        pending.set(newPath, { blob, url: URL.createObjectURL(blob), folder: f.folder, name, before: chosen.size, after: blob.size, downloaded: false });
        setAt(parent, f.k, newPath);
        prunePending();
        changed();
      } catch (e) {
        alert((e as Error).message);
      }
      body.classList.remove('busy');
      draw();
    });
    body.replaceChildren(
      h('div', { class: 'thumb' + (value && !src ? ' missing' : '') }, src ? h('img', { src, alt: '' }) : h('span', {}, value ? 'غير موجودة' : 'لا توجد صورة')),
      h('div', { class: 'img-meta' },
        h('code', { dir: 'ltr' }, value || '—'),
        pend ? h('span', { class: 'ok' }, `جديدة: ${kb(pend.before)} ← ${kb(pend.after)}`) : null,
        value && !src ? h('span', { class: 'err' }, 'هذه الصورة غير موجودة في الموقع. ارفعها أو اختر غيرها.') : null,
        h('div', { class: 'row' },
          h('label', { class: 'btn small', for: id + '-i' }, value ? 'تغيير الصورة' : 'اختيار صورة'),
          file,
          f.optional && value ? h('button', { type: 'button', class: 'btn small ghost', onclick: () => { setAt(parent, f.k, ''); prunePending(); changed(); draw(); } }, 'إزالة') : null,
        ),
      ),
    );
  };
  draw();
  return wrap;
}

function renderList(f: Extract<Field, { t: 'list' }>, parent: any, path: string, id: string) {
  const wrap = h('fieldset', { class: 'grp list', id }, h('legend', {}, f.label));
  if (f.hint) wrap.append(h('p', { class: 'fld-hint' }, f.hint));
  const itemsBox = h('div', { class: 'items' });
  wrap.append(itemsBox);
  let arr: any[] = getAt(parent, f.k);
  if (!Array.isArray(arr)) { arr = []; setAt(parent, f.k, arr); }
  const open = new Set<number>(arr.length <= 3 ? arr.map((_, i) => i) : []);

  const draw = () => {
    itemsBox.replaceChildren(...arr.map((item, i) => {
      const title = h('span', { class: 'item-title' }, f.itemTitle?.(item, i) ?? `#${i + 1}`);
      const move = (d: number) => (e: Event) => {
        e.preventDefault();
        const j = i + d;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        const oi = open.has(i), oj = open.has(j);
        open.delete(i); open.delete(j);
        if (oi) open.add(j);
        if (oj) open.add(i);
        changed(); draw();
      };
      const remove = (e: Event) => {
        e.preventDefault();
        if ((f.min ?? 0) >= arr.length) return alert(`يجب أن يبقى ${f.min} عنصر على الأقل.`);
        if (!confirm('حذف هذا العنصر؟')) return;
        arr.splice(i, 1);
        open.clear();
        prunePending(); changed(); draw();
      };
      const body = h('div', { class: 'item-body' });
      const fields = Array.isArray(f.item) ? f.item : [f.item];
      if (Array.isArray(f.item)) fields.forEach((x) => body.append(renderField(x, item, join(path, String(i)))));
      else body.append(renderField({ ...f.item, k: String(i) } as Field, arr, path));
      const det = h('details', { class: 'item', open: open.has(i) },
        h('summary', {}, title,
          h('span', { class: 'item-tools' },
            h('button', { type: 'button', class: 'icon-btn', title: 'تحريك للأعلى', onclick: move(-1), disabled: i === 0 }, '↑'),
            h('button', { type: 'button', class: 'icon-btn', title: 'تحريك للأسفل', onclick: move(1), disabled: i === arr.length - 1 }, '↓'),
            h('button', { type: 'button', class: 'icon-btn danger', title: 'حذف', onclick: remove }, '✕'),
          )),
        body);
      det.addEventListener('toggle', () => (det.open ? open.add(i) : open.delete(i)));
      det.addEventListener('input', () => (title.textContent = f.itemTitle?.(item, i) ?? `#${i + 1}`));
      det.addEventListener('admin:title', () => (title.textContent = f.itemTitle?.(item, i) ?? `#${i + 1}`));
      return det;
    }));
  };
  draw();
  wrap.append(h('button', { type: 'button', class: 'btn ghost add', onclick: () => { arr.push(f.newItem()); open.add(arr.length - 1); changed(); draw(); } }, '+ إضافة'));
  return wrap;
}

/* ---------------- navigation ---------------- */
const nav = document.getElementById('admNav')!;
const main = document.getElementById('admMain')!;
function showSection(sid: string) {
  const s = SECTIONS.find((x) => x.id === sid) ?? SECTIONS[0];
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.id === s.id));
  main.replaceChildren(h('h2', { class: 'sec-title' }, s.label), ...s.fields.map((f) => renderField(f, state, '')));
  main.focus({ preventScroll: true });
  scrollTo({ top: 0 });
}
function renderNav() {
  const groups = [...new Set(SECTIONS.map((s) => s.group))];
  nav.replaceChildren(...groups.map((g) => h('div', { class: 'nav-group' }, h('div', { class: 'nav-group-title' }, g),
    ...SECTIONS.filter((s) => s.group === g).map((s) => h('a', { href: `#${s.id}`, 'data-id': s.id }, s.label)))));
}
addEventListener('hashchange', () => showSection(location.hash.slice(1)));

/* ---------------- validation (mirrors the build's checks) ---------------- */
type Problem = { where: string; msg: string; id: string; section: string };
function validate(): Problem[] {
  const out: Problem[] = [];
  const walk = (fields: Field[], parent: any, path: string, where: string, section: string) => {
    for (const f of fields) {
      const p = join(path, f.k);
      const v = getAt(parent, f.k);
      const here = `${where} ← ${f.label}`;
      const add = (msg: string) => out.push({ where: here, msg, id: idFor(p), section });
      switch (f.t) {
        case 'T':
          if (!v?.ar?.trim()) add('النص العربي فارغ');
          if (!v?.en?.trim()) add('النص الإنجليزي فارغ');
          break;
        case 'str':
          if (!String(v ?? '').trim()) add('الحقل فارغ');
          else if (f.pattern && !f.pattern.test(v)) add(f.patternMsg ?? 'قيمة غير صحيحة');
          break;
        case 'num':
          if (!Number.isInteger(v) || v < 0) add('يجب أن يكون رقماً صحيحاً');
          break;
        case 'url':
          if (!f.skipIf?.(parent) && !/^https?:\/\/\S+$/.test(v ?? '')) add('رابط غير صحيح (يجب أن يبدأ بـ https://)');
          break;
        case 'img':
          if (!v) { if (!f.optional) add('لا توجد صورة'); }
          else if (!thumbFor(v)) add(`الصورة "${v}" غير موجودة`);
          break;
        case 'group':
          walk(f.fields, v ?? {}, p, here, section);
          break;
        case 'list':
          if ((v?.length ?? 0) < (f.min ?? 0)) add(`يجب وجود ${f.min} عنصر على الأقل`);
          (v ?? []).forEach((item: any, i: number) => {
            const label = `${here} #${i + 1}`;
            if (Array.isArray(f.item)) walk(f.item, item, join(p, String(i)), label, section);
            else walk([{ ...f.item, k: String(i), label: '' } as Field], v, p, label, section);
          });
          break;
      }
    }
  };
  for (const s of SECTIONS) walk(s.fields, state, '', s.label, s.id);
  return out;
}

/* Tidy before export: WhatsApp/Email social icons take their link from "contact". */
function exportData() {
  const data = structuredClone(state);
  for (const s of data.socials ?? []) if (s.key === 'whatsapp' || s.key === 'email') delete s.url;
  return JSON.stringify(data, null, 2) + '\n';
}

/* ---------------- save dialog ---------------- */
const dlg = document.getElementById('admSave') as HTMLDialogElement;
const dlgBody = document.getElementById('admSaveBody')!;
const gh = (kind: 'upload' | 'edit', path: string) => (payload.repo ? `https://github.com/${payload.repo}/${kind}/${payload.branch}/${path}` : '');

function download(blob: Blob, name: string) {
  const a = h('a', { href: URL.createObjectURL(blob), download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function openSave() {
  prunePending();
  const problems = validate();
  if (problems.length) {
    dlgBody.replaceChildren(
      h('h2', {}, `يوجد ${problems.length} مشكلة يجب إصلاحها أولاً`),
      h('ul', { class: 'problems' }, ...problems.slice(0, 60).map((x) => h('li', {},
        h('a', { href: `#${x.section}`, onclick: () => { dlg.close(); setTimeout(() => document.getElementById(x.id)?.scrollIntoView({ block: 'center' }), 50); } }, x.where),
        h('span', {}, ` — ${x.msg}`)))),
      h('div', { class: 'row end' }, h('button', { type: 'button', class: 'btn', onclick: () => dlg.close() }, 'رجوع للتعديل')),
    );
    dlg.showModal();
    return;
  }
  const folders = new Map<string, Pending[]>();
  for (const p of pending.values()) folders.set(p.folder, [...(folders.get(p.folder) ?? []), p]);
  let step = 0;
  const steps: HTMLElement[] = [];
  if (folders.size) {
    steps.push(h('li', {},
      h('h3', {}, `${++step}. نزّل الصور الجديدة وارفعها`),
      h('p', {}, 'كل مجموعة ترفع في مجلدها. ارفع الصور قبل لصق البيانات، حتى ينجح البناء من أول مرة.'),
      ...[...folders].map(([folder, items]) => h('div', { class: 'upload-box' },
        h('div', {}, h('strong', {}, 'المجلد: '), h('code', { dir: 'ltr' }, `src/assets/${folder}/`)),
        h('ul', { class: 'files' }, ...items.map((i) => h('li', { dir: 'ltr' }, `${i.name}  (${kb(i.after)})`))),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn', onclick: () => items.forEach((i, n) => setTimeout(() => { download(i.blob, i.name); i.downloaded = true; }, n * 350)) }, `تنزيل الصور (${items.length})`),
          payload.repo ? h('a', { class: 'btn ghost', href: gh('upload', `src/assets/${folder}`), target: '_blank', rel: 'noopener' }, 'فتح صفحة الرفع على GitHub ↗') : null,
        ),
        h('p', { class: 'fld-hint' }, 'في صفحة الرفع: اسحب الصور التي نزلت، ثم اضغط Commit changes.'),
      )),
    ));
  }
  const copyBtn = h('button', { type: 'button', class: 'btn' }, 'نسخ البيانات (JSON)');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(exportData()); copyBtn.textContent = 'تم النسخ ✓'; }
    catch { download(new Blob([exportData()], { type: 'application/json' }), 'site.json'); copyBtn.textContent = 'تعذّر النسخ، تم تنزيل الملف بدلاً منه'; }
  });
  steps.push(h('li', {},
    h('h3', {}, `${++step}. انسخ البيانات`),
    h('div', { class: 'row' }, copyBtn,
      h('button', { type: 'button', class: 'btn ghost', onclick: () => download(new Blob([exportData()], { type: 'application/json' }), 'site.json') }, 'تنزيل site.json (نسخة احتياطية)')),
  ));
  steps.push(h('li', {},
    h('h3', {}, `${++step}. الصقها في GitHub`),
    payload.repo
      ? h('a', { class: 'btn ghost', href: gh('edit', 'src/data/site.json'), target: '_blank', rel: 'noopener' }, 'فتح ملف البيانات على GitHub ↗')
      : h('p', {}, 'افتح الملف src/data/site.json في الريبو واضغط أيقونة القلم.'),
    h('p', {}, 'داخل المحرر: حدّد كل النص (Ctrl+A)، والصق (Ctrl+V)، ثم اضغط Commit changes.'),
  ));
  dlgBody.replaceChildren(
    h('h2', {}, 'النشر'),
    h('ol', { class: 'steps' }, ...steps),
    h('p', { class: 'note' }, 'الموقع يتحدث تلقائياً خلال دقيقة أو دقيقتين. إذا كان هناك خطأ، يبقى الموقع كما هو ويصلك بريد من GitHub يوضح المشكلة.'),
    h('div', { class: 'row end' }, h('button', { type: 'button', class: 'btn ghost', onclick: () => dlg.close() }, 'إغلاق')),
  );
  dlg.showModal();
}

/* ---------------- pending badge, import, reset ---------------- */
const pendingBadge = document.getElementById('admPending')!;
function renderPendingBadge() {
  pendingBadge.hidden = pending.size === 0;
  pendingBadge.textContent = `${pending.size} صورة جديدة بانتظار الرفع`;
}

document.getElementById('admSaveBtn')!.addEventListener('click', openSave);
document.getElementById('admReset')!.addEventListener('click', () => {
  if (!confirm('تجاهل كل التعديلات والرجوع للنسخة المنشورة؟')) return;
  state = structuredClone(payload.site);
  for (const p of pending.values()) URL.revokeObjectURL(p.url);
  pending.clear();
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  renderPendingBadge(); changed(); showSection(location.hash.slice(1));
});
const importInput = document.getElementById('admImport') as HTMLInputElement;
importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data?.home || !data?.galleries || !data?.contact) throw new Error();
    state = data;
    changed(); showSection(location.hash.slice(1));
  } catch {
    alert('هذا الملف ليس ملف بيانات صالحاً للموقع.');
  }
  importInput.value = '';
});
addEventListener('beforeunload', (e) => {
  if ([...pending.values()].some((p) => !p.downloaded)) e.preventDefault();
});

/* ---------------- start: restore draft if any ---------------- */
const banner = document.getElementById('admBanner')!;
try {
  const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
  if (draft?.data) {
    if (JSON.stringify(draft.data) === publishedText) localStorage.removeItem(DRAFT_KEY);
    else if (draft.base === payload.version) {
      state = draft.data;
      banner.hidden = false;
      banner.replaceChildren('تم استرجاع تعديلاتك غير المنشورة من آخر جلسة.');
    } else {
      banner.hidden = false;
      banner.replaceChildren(
        h('span', {}, 'لديك مسودة قديمة، لكن الموقع تحدّث بعدها. '),
        h('button', { type: 'button', class: 'btn small', onclick: () => { state = draft.data; banner.hidden = true; changed(); showSection(location.hash.slice(1)); } }, 'متابعة المسودة'),
        h('button', { type: 'button', class: 'btn small ghost', onclick: () => { localStorage.removeItem(DRAFT_KEY); banner.hidden = true; } }, 'البدء من النسخة المنشورة'),
      );
    }
  }
} catch { /* ignore broken draft */ }

renderNav();
showSection(location.hash.slice(1));
changed();
renderPendingBadge();
