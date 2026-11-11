/* Describes every editable field in src/data/site.json, with Arabic labels for the dashboard.
 * Keys can be dotted paths ("home.hero"). If you add a field to site.json (and to the zod schema in
 * src/lib/site.ts), add it here too so it appears in the dashboard. */

export type Field =
  | { t: 'T'; k: string; label: string; long?: boolean; hint?: string }
  | { t: 'str'; k: string; label: string; ltr?: boolean; hint?: string; pattern?: RegExp; patternMsg?: string }
  | { t: 'num'; k: string; label: string; hint?: string }
  | { t: 'url'; k: string; label: string; hint?: string; skipIf?: (parent: any) => boolean }
  | { t: 'select'; k: string; label: string; options: [string, string][] }
  | { t: 'img'; k: string; label: string; folder: string; name: string; maxSize?: number; optional?: boolean; hint?: string }
  | { t: 'group'; k: string; label: string; fields: Field[] }
  | {
      t: 'list'; k: string; label: string; item: Field[] | Field; newItem: () => unknown;
      itemTitle?: (item: any, i: number) => string; min?: number; hint?: string;
    };

export type Section = { id: string; label: string; group: string; fields: Field[] };

const T = (k: string, label: string, opts: { long?: boolean; hint?: string } = {}): Field => ({ t: 'T', k, label, ...opts });
const emptyT = () => ({ ar: '', en: '' });
const KICKER_HINT = 'الجزء الملوّن في بداية العنوان، مثل "خدماتنا:"';
const head = (k: string, label: string, withParagraph = true): Field => ({
  t: 'group', k, label,
  fields: [T('kicker', 'الجزء الملوّن من العنوان', { hint: KICKER_HINT }), T('title', 'باقي العنوان'), ...(withParagraph ? [T('paragraph', 'الوصف تحت العنوان', { long: true })] : [])],
});
const formField = (k: string, label: string): Field => ({ t: 'group', k, label, fields: [T('label', 'اسم الحقل'), T('placeholder', 'النص الإرشادي داخل الحقل')] });
const pageMeta = (k: string, extra: Field[] = []): Field => ({
  t: 'group', k, label: 'بيانات محركات البحث والمشاركة',
  fields: [T('title', 'عنوان تبويب المتصفح'), T('description', 'وصف الصفحة في نتائج البحث', { long: true }), T('ogTitle', 'العنوان عند مشاركة الرابط'), ...extra],
});

export const GALLERY_OPTIONS: [string, string][] = [
  ['social', 'تصاميم السوشيال ميديا'], ['identity', 'تصاميم الهوية البصرية'], ['print', 'تصاميم المطبوعات'], ['ads', 'نتائج الحملات الإعلانية'],
];
const SERVICE_ICONS: [string, string][] = [
  ['social', 'جوال (سوشيال ميديا)'], ['identity', 'قلم (هوية بصرية)'], ['print', 'طابعة (مطبوعات)'], ['ads', 'مكبّر صوت (إعلانات)'], ['content', 'كاميرا (محتوى)'], ['marketing', 'رسم بياني (تسويق)'],
];
const SOCIAL_KEYS: [string, string][] = [
  ['whatsapp', 'WhatsApp'], ['email', 'Email'], ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['linkedin', 'LinkedIn'],
  ['behance', 'Behance'], ['x', 'X'], ['threads', 'Threads'], ['tiktok', 'TikTok'], ['snapchat', 'Snapchat'],
];
const titleOf = (item: any, i: number) => `${String(i + 1).padStart(2, '0')} · ${item?.title?.ar || 'بدون عنوان'}`;
const altOf = (item: any, i: number) => `${String(i + 1).padStart(2, '0')} · ${item?.alt?.ar || ''}`;

const gallerySection = (key: string, name: string, item: Field[]): Section => ({
  id: `gallery-${key}`, group: 'معارض الأعمال', label: name,
  fields: [{
    t: 'group', k: `galleries.${key}`, label: `صفحة ${name}`,
    fields: [
      T('title', 'عنوان الصفحة'),
      T('intro', 'الوصف', { long: true }),
      { t: 'group', k: 'meta', label: 'بيانات محركات البحث والمشاركة', fields: [T('description', 'وصف الصفحة في نتائج البحث', { long: true }), T('ogTitle', 'العنوان عند مشاركة الرابط')] },
      {
        t: 'list', k: 'items', label: 'الأعمال', hint: 'الترتيب هنا هو ترتيب الظهور. ارفع الصور كما هي، وستُصغَّر تلقائياً.',
        itemTitle: altOf, newItem: () => (key === 'print' ? { cover: '', image: '', alt: emptyT() } : { image: '', alt: emptyT() }),
        item,
      },
    ],
  }],
});

export const SECTIONS: Section[] = [
  {
    id: 'general', group: 'عام', label: 'التواصل والفوتر',
    fields: [
      {
        t: 'group', k: 'contact', label: 'بيانات التواصل (تُستخدم في كل أزرار وروابط التواصل والنماذج)',
        fields: [
          { t: 'str', k: 'whatsappNumber', label: 'رقم واتساب', ltr: true, hint: 'أرقام فقط مع رمز الدولة، بدون + أو مسافات. مثال: 970599351383', pattern: /^\d{8,15}$/, patternMsg: 'أرقام فقط (8 إلى 15 رقم) مع رمز الدولة' },
          { t: 'str', k: 'email', label: 'البريد الإلكتروني', ltr: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, patternMsg: 'بريد إلكتروني غير صحيح' },
        ],
      },
      {
        t: 'list', k: 'socials', label: 'حسابات التواصل الاجتماعي (في الفوتر)', hint: 'واتساب والبريد يأخذان رابطهما من بيانات التواصل أعلاه تلقائياً.',
        newItem: () => ({ key: 'instagram', url: '' }),
        itemTitle: (it) => SOCIAL_KEYS.find(([k]) => k === it.key)?.[1] ?? it.key,
        item: [
          { t: 'select', k: 'key', label: 'المنصة', options: SOCIAL_KEYS },
          { t: 'url', k: 'url', label: 'الرابط', skipIf: (p) => p.key === 'whatsapp' || p.key === 'email' },
        ],
      },
      {
        t: 'group', k: 'footer', label: 'الفوتر',
        fields: [T('tagline', 'النبذة تحت الشعار', { long: true }), T('quickLinksTitle', 'عنوان عمود الروابط'), T('servicesTitle', 'عنوان عمود الخدمات'), T('contactTitle', 'عنوان عمود التواصل'), T('copyright', 'نص الحقوق'), T('homeButton', 'زر "الرئيسية" في الصفحات الداخلية'), T('whatsappButton', 'وصف زر واتساب العائم (لقارئات الشاشة)')],
      },
      { t: 'group', k: 'galleries.common', label: 'نصوص مشتركة في صفحات المعارض', fields: [T('breadcrumbWork', 'كلمة "أعمالنا" في مسار التصفح'), T('tabsLabel', 'وصف شريط المعارض (لقارئات الشاشة)')] },
    ],
  },
  {
    id: 'nav', group: 'عام', label: 'روابط القائمة',
    fields: [{ t: 'group', k: 'nav', label: 'أسماء روابط القائمة العلوية', fields: [T('home', 'الرئيسية'), T('services', 'خدماتنا'), T('work', 'أعمالنا'), T('about', 'من نحن'), T('process', 'كيف نعمل'), T('testimonials', 'آراء العملاء'), T('contact', 'تواصل معنا')] }],
  },
  {
    id: 'hero', group: 'الصفحة الرئيسية', label: 'الواجهة والأرقام',
    fields: [
      pageMeta('home.meta', [T('ogDescription', 'الوصف عند مشاركة الرابط', { long: true })]),
      {
        t: 'group', k: 'home.hero', label: 'الواجهة',
        fields: [
          T('eyebrow', 'الشارة الصغيرة فوق العنوان'),
          T('line1', 'سطر العنوان الأول'),
          T('line2', 'سطر العنوان الثاني (الملوّن)'),
          T('lead', 'الفقرة', { long: true }),
          T('primaryButton', 'الزر الرئيسي (إلى صفحة التواصل)'),
          T('secondaryButton', 'الزر الثاني (إلى الأعمال)'),
          { t: 'img', k: 'photo', label: 'الصورة الشخصية (الوضع الداكن)', folder: 'images', name: 'hero', hint: 'صورة عمودية، تُعرض بنسبة 4:5' },
          { t: 'img', k: 'photoLight', label: 'الصورة الشخصية (الوضع الفاتح)', folder: 'images', name: 'hero-light' },
          T('photoAlt', 'وصف الصورة (لقارئات الشاشة)'),
          T('badgeTop', 'الشارة العلوية على الصورة'),
          T('badgeBottom', 'الشارة السفلية على الصورة'),
        ],
      },
      { t: 'list', k: 'home.metrics', label: 'الأرقام', itemTitle: (it) => `${it?.value ?? ''}+ ${it?.label?.ar ?? ''}`, newItem: () => ({ value: 0, label: emptyT() }), item: [{ t: 'num', k: 'value', label: 'الرقم' }, T('label', 'الوصف')] },
    ],
  },
  {
    id: 'promo', group: 'الصفحة الرئيسية', label: 'سلايدر الدورة',
    fields: [{
      t: 'group', k: 'home.promo', label: 'السلايدر الإعلاني (يفتح صفحة الدورة)',
      fields: [
        T('cta', 'زر "سجّل الآن"'),
        T('label', 'وصف السلايدر (لقارئات الشاشة)'),
        {
          t: 'list', k: 'slides', label: 'الشرائح', hint: 'مقاس الصورة 1440×480. الزر يظهر فوق مكان مخصص في التصميم.', itemTitle: altOf,
          newItem: () => ({ image: { ar: '', en: '' }, alt: emptyT() }),
          item: [
            { t: 'group', k: 'image', label: 'الصورة (نسخة لكل لغة)', fields: [{ t: 'img', k: 'ar', label: 'النسخة العربية', folder: 'ad-slides', name: 'slide' }, { t: 'img', k: 'en', label: 'النسخة الإنجليزية', folder: 'ad-slides', name: 'slide-en' }] },
            T('alt', 'وصف الصورة'),
          ],
        },
      ],
    }],
  },
  {
    id: 'services', group: 'الصفحة الرئيسية', label: 'الخدمات',
    fields: [
      head('home.servicesHead', 'عنوان القسم'),
      { t: 'group', k: 'home.serviceLinks', label: 'نص الرابط أسفل كل بطاقة', fields: [T('work', 'للخدمات التي لها معرض'), T('request', 'للخدمات التي تفتح صفحة التواصل')] },
      {
        t: 'list', k: 'home.services', label: 'الخدمات', min: 1, itemTitle: titleOf,
        newItem: () => ({ icon: 'social', target: 'contact', title: emptyT(), desc: emptyT() }),
        item: [
          { t: 'select', k: 'icon', label: 'الأيقونة', options: SERVICE_ICONS },
          { t: 'select', k: 'target', label: 'عند الضغط', options: [...GALLERY_OPTIONS.map(([k, v]): [string, string] => [k, `معرض ${v}`]), ['contact', 'صفحة التواصل']] },
          T('title', 'اسم الخدمة'),
          T('desc', 'الوصف', { long: true }),
        ],
      },
    ],
  },
  {
    id: 'work', group: 'الصفحة الرئيسية', label: 'أعمالنا',
    fields: [
      head('home.workHead', 'عنوان القسم'),
      {
        t: 'list', k: 'home.workTeaser', label: 'بطاقات المعارض', itemTitle: titleOf,
        newItem: () => ({ gallery: 'social', cover: { ar: '', en: '' }, title: emptyT() }),
        item: [
          { t: 'select', k: 'gallery', label: 'المعرض', options: GALLERY_OPTIONS },
          { t: 'group', k: 'cover', label: 'صورة الغلاف (نسخة لكل لغة)', fields: [{ t: 'img', k: 'ar', label: 'الغلاف العربي', folder: 'work-covers/ar', name: 'cover' }, { t: 'img', k: 'en', label: 'الغلاف الإنجليزي', folder: 'work-covers/en', name: 'cover' }] },
          T('title', 'العنوان'),
        ],
      },
    ],
  },
  {
    id: 'about', group: 'الصفحة الرئيسية', label: 'من نحن',
    fields: [
      head('home.aboutHead', 'عنوان القسم', false),
      {
        t: 'group', k: 'home.about', label: 'المحتوى',
        fields: [
          { t: 'img', k: 'image', label: 'الصورة', folder: 'images', name: 'about', hint: 'تُعرض بنسبة 4:3' },
          T('imageAlt', 'وصف الصورة'),
          T('badge', 'الشارة على الصورة'),
          T('lead', 'الفقرة البارزة', { long: true }),
          T('paragraph', 'الفقرة', { long: true }),
          { t: 'list', k: 'points', label: 'النقاط', item: T('', 'النقطة'), newItem: emptyT, itemTitle: (it, i) => `${i + 1} · ${it?.ar || ''}` },
        ],
      },
    ],
  },
  {
    id: 'process', group: 'الصفحة الرئيسية', label: 'كيف نعمل',
    fields: [head('home.processHead', 'عنوان القسم', false), { t: 'list', k: 'home.process', label: 'الخطوات', hint: 'الترقيم يتم تلقائياً حسب الترتيب.', itemTitle: titleOf, newItem: () => ({ title: emptyT(), desc: emptyT() }), item: [T('title', 'اسم الخطوة'), T('desc', 'الوصف')] }],
  },
  {
    id: 'testimonials', group: 'الصفحة الرئيسية', label: 'آراء العملاء',
    fields: [
      head('home.testimonialsHead', 'عنوان القسم'),
      { t: 'list', k: 'home.testimonials', label: 'الآراء', min: 1, itemTitle: (it, i) => `${String(i + 1).padStart(2, '0')} · ${it?.quote?.ar?.slice(0, 40) || ''}`, newItem: () => ({ quote: emptyT(), author: emptyT() }), item: [T('quote', 'الرأي', { long: true }), T('author', 'اسم العميل / الشركة')] },
    ],
  },
  {
    id: 'cta', group: 'الصفحة الرئيسية', label: 'قسم "اطلب خدمتك"',
    fields: [{ t: 'group', k: 'home.cta', label: 'القسم الأخير في الصفحة الرئيسية', fields: [T('eyebrow', 'الشارة الصغيرة'), T('title', 'العنوان'), T('paragraph', 'الفقرة', { long: true }), T('button', 'الزر')] }],
  },
  gallerySection('social', 'تصاميم السوشيال ميديا', [{ t: 'img', k: 'image', label: 'التصميم', folder: 'gallery/social', name: 'social', hint: 'طولي (4:5) أو مربع (1:1)، يُعرض كاملاً بدون قص' }, T('alt', 'وصف التصميم')]),
  gallerySection('identity', 'تصاميم الهوية البصرية', [{ t: 'img', k: 'image', label: 'الصورة', folder: 'gallery/identity', name: 'identity' }, T('alt', 'وصف الهوية')]),
  gallerySection('print', 'تصاميم المطبوعات', [
    { t: 'img', k: 'cover', label: 'صورة العمل في مكانه (تظهر في الشبكة)', folder: 'gallery/print/covers', name: 'print-cover' },
    { t: 'img', k: 'image', label: 'التصميم نفسه (يظهر عند التكبير)', folder: 'gallery/print/artwork', name: 'print-art' },
    T('alt', 'وصف التصميم'),
  ]),
  gallerySection('ads', 'نتائج الحملات الإعلانية', [{ t: 'img', k: 'image', label: 'لقطة تقرير الحملة', folder: 'gallery/ads', name: 'ads', hint: 'تُعرض داخل شاشة بنسبة 1200×620' }, T('alt', 'وصف التقرير')]),
  {
    id: 'contactPage', group: 'صفحات أخرى', label: 'صفحة التواصل',
    fields: [{
      t: 'group', k: 'contactPage', label: 'صفحة التواصل',
      fields: [
        pageMeta('meta'),
        T('eyebrow', 'الشارة الصغيرة'), T('kicker', 'الجزء الملوّن من العنوان'), T('title', 'باقي العنوان'), T('lead', 'الفقرة', { long: true }),
        {
          t: 'group', k: 'form', label: 'النموذج (يفتح رسالة واتساب جاهزة)',
          fields: [T('greeting', 'أول سطر في رسالة واتساب'), formField('name', 'حقل الاسم'), formField('phone', 'حقل الجوال'), formField('details', 'حقل تفاصيل الخدمة'), T('submit', 'زر الإرسال'), T('note', 'الملاحظة تحت النموذج')],
        },
        T('whatsappLabel', 'بطاقة واتساب'), T('emailLabel', 'بطاقة البريد'), T('photoBadge', 'الشارة على الصورة'),
        head('stepsHead', 'عنوان قسم "كيف نبدأ"'),
        { t: 'list', k: 'steps', label: 'الخطوات', itemTitle: titleOf, newItem: () => ({ title: emptyT(), desc: emptyT() }), item: [T('title', 'العنوان'), T('desc', 'الوصف', { long: true })] },
      ],
    }],
  },
  {
    id: 'course', group: 'صفحات أخرى', label: 'صفحة الدورة',
    fields: [{
      t: 'group', k: 'course', label: 'صفحة الدورة (socialmedia.courses1)',
      fields: [
        pageMeta('meta'),
        { t: 'img', k: 'photo', label: 'صورة المدرب (الوضع الداكن)', folder: 'images', name: 'course' },
        { t: 'img', k: 'photoLight', label: 'صورة المدرب (الوضع الفاتح)', folder: 'images', name: 'course-light' },
        T('photoAlt', 'وصف الصورة'), T('photoBadge', 'الشارة على الصورة'),
        T('eyebrow', 'الشارة الصغيرة'), T('titleTop', 'السطر الأول من العنوان'), T('titleAccent', 'السطر الثاني (الملوّن)'), T('lead', 'الفقرة', { long: true }),
        T('durationLabel', 'عنوان "مدة الورشة"'), { t: 'str', k: 'durationValue', label: 'عدد الساعات', ltr: true }, T('durationUnit', 'وحدة المدة'),
        T('trainerLabel', 'عنوان "المدرب"'), T('trainerName', 'اسم المدرب'), T('trainerRole', 'تخصص المدرب'),
        T('cta', 'زر الحجز'),
        { t: 'group', k: 'register', label: 'قسم التسجيل', fields: [T('eyebrow', 'الشارة الصغيرة'), T('title', 'العنوان'), T('paragraph', 'الفقرة', { long: true }), { t: 'list', k: 'points', label: 'النقاط', item: T('', 'النقطة'), newItem: emptyT, itemTitle: (it, i) => `${i + 1} · ${it?.ar || ''}` }] },
        { t: 'group', k: 'form', label: 'نموذج التسجيل (يفتح رسالة واتساب جاهزة)', fields: [T('greeting', 'أول سطر في رسالة واتساب'), formField('fullName', 'حقل الاسم الكامل'), formField('whatsapp', 'حقل رقم الواتساب'), formField('email', 'حقل البريد'), T('submit', 'زر الإرسال')] },
      ],
    }],
  },
  {
    id: 'notFound', group: 'صفحات أخرى', label: 'صفحة 404',
    fields: [{ t: 'group', k: 'notFound', label: 'صفحة "غير موجودة"', fields: [T('title', 'العنوان'), T('text', 'النص', { long: true }), T('homeButton', 'زر الرئيسية'), T('workButton', 'زر الأعمال')] }],
  },
];
