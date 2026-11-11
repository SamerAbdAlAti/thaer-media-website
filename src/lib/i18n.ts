export type Lang = 'ar' | 'en';
export type T = { ar: string; en: string };

export const other = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');
export const dirOf = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');
export const tr = (value: T, lang: Lang) => value[lang];

/* Arabic URLs are identical to the live site (thaerdesigner.com) so indexed and shared links keep
 * working; English mirrors them under /en/. */
export const ROUTES = {
  home: '',
  contact: 'contact/',
  course: 'socialmedia.courses1/',
  social: 'work.social/',
  identity: 'work.brand/',
  print: 'work.print/',
  ads: 'work.ads/',
} as const;
export type RouteKey = keyof typeof ROUTES;
export const GALLERIES = ['social', 'identity', 'print', 'ads'] as const;
export type GalleryKey = (typeof GALLERIES)[number];

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Base-aware, language-aware internal link. */
export function href(lang: Lang, route: RouteKey | '' = '', hash = ''): string {
  const path = route ? ROUTES[route] : '';
  return `${BASE}${lang === 'en' ? '/en/' : '/'}${path}${hash ? `#${hash}` : ''}`;
}

/** Root-relative path with the base prefix, for files in /public. */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}

export const formatPhone = (digits: string) => '+' + digits.replace(/^(\d{3})(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4');

/** Interface text that isn't client content (screen-reader labels, form messages). */
export const ui = {
  skip: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
  mainNav: { ar: 'القائمة الرئيسية', en: 'Main navigation' },
  homeLabel: { ar: 'Thaer Media — الرئيسية', en: 'Thaer Media — Home' },
  menu: { ar: 'القائمة', en: 'Menu' },
  theme: { ar: 'تبديل الوضع الفاتح والداكن', en: 'Toggle light and dark mode' },
  switchLang: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
  socialsLabel: { ar: 'حساباتنا على منصات التواصل', en: 'Our social accounts' },
  breadcrumb: { ar: 'مسار التصفح', en: 'Breadcrumb' },
  prevSlide: { ar: 'الشريحة السابقة', en: 'Previous slide' },
  nextSlide: { ar: 'الشريحة التالية', en: 'Next slide' },
  chooseSlide: { ar: 'اختيار الشريحة', en: 'Choose a slide' },
  slideOf: { ar: 'الشريحة {n} من {total}', en: 'Slide {n} of {total}' },
  prevReview: { ar: 'الرأي السابق', en: 'Previous review' },
  nextReview: { ar: 'الرأي التالي', en: 'Next review' },
  chooseReview: { ar: 'اختيار الرأي', en: 'Choose a review' },
  rated: { ar: 'تقييم 5 من 5', en: 'Rated 5 out of 5' },
  imageViewer: { ar: 'عارض الصور', en: 'Image viewer' },
  view: { ar: 'عرض', en: 'View' },
  close: { ar: 'إغلاق', en: 'Close' },
  prevImage: { ar: 'الصورة السابقة', en: 'Previous image' },
  nextImage: { ar: 'الصورة التالية', en: 'Next image' },
  galleryCount: { ar: '{n} {unit}', en: '{n} projects' },
} satisfies Record<string, T>;

export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
/** "4 أعمال" / "22 عملاً" (Arabic counted-noun rule used by the live site). */
export const galleryCount = (n: number, lang: Lang) =>
  lang === 'ar' ? `${n} ${n > 10 ? 'عملاً' : 'أعمال'}` : `${n} projects`;
