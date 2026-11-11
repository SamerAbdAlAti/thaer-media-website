/* Contact and course forms: validate with inline bilingual messages, then open a ready-made
 * WhatsApp message built from the field labels (same format as the live site:
 * greeting, blank line, "Label: value" per field). No server involved. */
type Msg = { ar: string; en: string };
const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
const t = (m: Msg) => m[lang()];

const MSG: Record<string, Msg> = {
  required: { ar: 'هذا الحقل مطلوب.', en: 'This field is required.' },
  fullName: { ar: 'يرجى كتابة الاسم الكامل (الاسم الأول واسم العائلة).', en: 'Please enter your full name (first and last name).' },
  name: { ar: 'يرجى كتابة اسمك.', en: 'Please enter your name.' },
  phone: { ar: 'أدخل رقماً صحيحاً، ويُفضّل مع رمز الدولة.', en: 'Enter a valid number, ideally with the country code.' },
  email: { ar: 'أدخل بريداً إلكترونياً صحيحاً.', en: 'Enter a valid email address.' },
  details: { ar: 'اكتب بإيجاز الخدمة التي تحتاجها.', en: 'Briefly describe the service you need.' },
  ready: { ar: 'جهّزنا رسالتك في واتساب، اضغط «إرسال» هناك لإتمامها. إن لم يُفتح واتساب تلقائياً:', en: 'Your message is ready in WhatsApp. Press Send there to finish. If WhatsApp didn’t open:' },
  open: { ar: 'افتح واتساب', en: 'Open WhatsApp' },
};
const latinDigits = (v: string) => v.replace(/[٠-٩۰-۹]/g, (d) => String('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.indexOf(d) % 10));
const validators: Record<string, (v: string) => Msg | null> = {
  name: (v) => (v.length < 2 ? MSG.name : null),
  fullName: (v) => (v.split(' ').filter(Boolean).length < 2 ? MSG.fullName : null),
  phone: (v) => {
    const digits = v.replace(/\D/g, '');
    return !/^\+?[\d\s().-]+$/.test(v) || digits.length < 8 || digits.length > 15 ? MSG.phone : null;
  },
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? MSG.email : null),
  details: (v) => (v.length < 5 ? MSG.details : null),
};

document.querySelectorAll<HTMLFormElement>('form[data-wa-form]').forEach((form) => {
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-rule]'));
  const status = form.querySelector<HTMLElement>('[data-status]')!;

  const clean = (field: HTMLInputElement | HTMLTextAreaElement) => {
    let v = field.value.trim().replace(/[ \t]+/g, ' ');
    if (field.dataset.rule === 'phone') v = latinDigits(v);
    return v;
  };
  const show = (field: HTMLInputElement | HTMLTextAreaElement, error: Msg | null) => {
    const wrap = field.closest('.field')!;
    let note = wrap.querySelector<HTMLElement>('.field-error');
    if (!error) {
      wrap.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      note?.remove();
      return;
    }
    if (!note) {
      note = document.createElement('span');
      note.className = 'field-error';
      note.id = `${field.name}Error`;
      wrap.append(note);
    }
    note.textContent = t(error);
    wrap.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', note.id);
  };
  const check = (field: HTMLInputElement | HTMLTextAreaElement) => {
    const v = clean(field);
    const error = !v ? MSG.required : validators[field.dataset.rule!](v);
    show(field, error);
    return !error;
  };
  fields.forEach((field) => {
    field.addEventListener('blur', () => { if (field.value.trim()) check(field); });
    field.addEventListener('input', () => { if (field.closest('.field')!.classList.contains('is-invalid')) check(field); });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((f) => !check(f));
    if (invalid.length) { invalid[0].focus(); return; }
    const lines = [form.dataset.greeting ?? '', ''];
    for (const f of fields) lines.push(`${f.closest('.field')!.querySelector('.field-label')!.textContent!.trim()}: ${clean(f)}`);
    const link = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(link, '_blank', 'noopener');
    // With "noopener" browsers return null even on success, so always show a confirmation
    // that doubles as a fallback link (e.g. if a popup blocker stopped it).
    status.hidden = false;
    status.dataset.state = 'success';
    status.textContent = `${t(MSG.ready)} `;
    const a = document.createElement('a');
    a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = t(MSG.open);
    status.append(a);
  });
});
