/**
 * Loads src/data/site.json, validates it, and resolves image paths.
 * Runs at build time only. If the JSON is wrong (missing field, typo in an image path),
 * the build stops with a readable list of problems instead of publishing a broken site.
 */
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import raw from '../data/site.json';
import { GALLERIES } from './i18n';

const T = z.object({ ar: z.string().min(1), en: z.string().min(1) });
const Head = z.object({ kicker: T, title: T, paragraph: T });
const HeadNoP = z.object({ kicker: T, title: T });
const Field = z.object({ label: T, placeholder: T });
const OgImage = z.object({ src: z.string(), width: z.number().int(), height: z.number().int(), alt: T });
const SOCIAL_KEYS = ['whatsapp', 'email', 'instagram', 'facebook', 'linkedin', 'behance', 'x', 'threads', 'tiktok', 'snapchat'] as const;
export const SERVICE_ICONS = ['social', 'identity', 'ads', 'print', 'content', 'marketing'] as const;
const GalleryKey = z.enum(GALLERIES);
const Item = z.object({ image: z.string().min(1), alt: T });

const GalleryMeta = z.object({ description: T, ogTitle: T, ogImage: OgImage });
const Gallery = z.object({ title: T, intro: T, meta: GalleryMeta, items: z.array(Item) });

const SiteSchema = z.object({
  contact: z.object({
    whatsappNumber: z.string().regex(/^\d{8,15}$/, 'digits only, with country code, e.g. 970599351383'),
    email: z.email(),
  }),
  socials: z.array(z.object({ key: z.enum(SOCIAL_KEYS), url: z.url().optional() })),
  nav: z.object({ home: T, services: T, work: T, about: T, process: T, testimonials: T, contact: T }),
  footer: z.object({ tagline: T, quickLinksTitle: T, servicesTitle: T, contactTitle: T, copyright: T, homeButton: T, whatsappButton: T }),
  home: z.object({
    meta: z.object({ title: T, description: T, ogTitle: T, ogDescription: T, ogImage: OgImage }),
    hero: z.object({
      eyebrow: T, line1: T, line2: T, lead: T, primaryButton: T, secondaryButton: T,
      photo: z.string(), photoLight: z.string(), photoAlt: T, badgeTop: T, badgeBottom: T,
    }),
    metrics: z.array(z.object({ value: z.number().int().nonnegative(), label: T })),
    promo: z.object({ label: T, cta: T, slides: z.array(z.object({ image: T, alt: T })) }),
    servicesHead: Head,
    serviceLinks: z.object({ work: T, request: T }),
    services: z.array(z.object({ icon: z.enum(SERVICE_ICONS), target: z.union([GalleryKey, z.literal('contact')]), title: T, desc: T })).min(1),
    workHead: Head,
    workTeaser: z.array(z.object({ gallery: GalleryKey, cover: T, title: T })),
    aboutHead: HeadNoP,
    about: z.object({ image: z.string(), imageAlt: T, badge: T, lead: T, paragraph: T, points: z.array(T) }),
    processHead: HeadNoP,
    process: z.array(z.object({ title: T, desc: T })),
    testimonialsHead: Head,
    testimonials: z.array(z.object({ quote: T, author: T })).min(1),
    cta: z.object({ eyebrow: T, title: T, paragraph: T, button: T }),
  }),
  galleries: z.object({
    common: z.object({ breadcrumbWork: T, tabsLabel: T }),
    social: Gallery,
    identity: Gallery,
    // Print designs show a photo of the work in place (cover) and open the flat artwork (image).
    print: Gallery.extend({ items: z.array(Item.extend({ cover: z.string().min(1) })) }),
    ads: Gallery,
  }),
  contactPage: z.object({
    meta: z.object({ title: T, description: T, ogTitle: T, ogImage: OgImage }),
    eyebrow: T, kicker: T, title: T, lead: T,
    form: z.object({ greeting: T, name: Field, phone: Field, details: Field, submit: T, note: T }),
    whatsappLabel: T, emailLabel: T, photoBadge: T,
    stepsHead: Head,
    steps: z.array(z.object({ title: T, desc: T })),
  }),
  course: z.object({
    meta: z.object({ title: T, description: T, ogTitle: T, ogImage: OgImage }),
    photo: z.string(), photoLight: z.string(), photoAlt: T, photoBadge: T,
    eyebrow: T, titleTop: T, titleAccent: T, lead: T,
    durationLabel: T, durationValue: z.string(), durationUnit: T,
    trainerLabel: T, trainerName: T, trainerRole: T, cta: T,
    register: z.object({ eyebrow: T, title: T, paragraph: T, points: z.array(T) }),
    form: z.object({ greeting: T, fullName: Field, whatsapp: Field, email: Field, submit: T }),
  }),
  notFound: z.object({ title: T, text: T, homeButton: T, workButton: T }),
});

export type Site = z.infer<typeof SiteSchema>;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

/* ---------------- images ----------------
 * Every image in site.json is a path relative to src/assets/ (e.g. "gallery/social/02.jpg").
 * Photos go through astro:assets (resized + converted to AVIF/WebP at build time), so the
 * client can upload photos straight from a camera or phone without slowing the site down. */
const RASTER = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG}', { eager: true });
const SVG = import.meta.glob<string>('/src/assets/**/*.svg', { eager: true, query: '?url', import: 'default' });

export type ResolvedImage = { kind: 'raster'; meta: ImageMetadata } | { kind: 'svg'; url: string };

export function resolveImage(path: string): ResolvedImage {
  const key = `/src/assets/${path.replace(/^\/+/, '').replace(/^src\/assets\//, '')}`;
  if (RASTER[key]) return { kind: 'raster', meta: RASTER[key].default };
  if (SVG[key]) return { kind: 'svg', url: SVG[key] };
  throw new Error(`Image not found: "${path}" (looked for ${key})`);
}

export function rasterImage(path: string): ImageMetadata {
  const r = resolveImage(path);
  if (r.kind !== 'raster') throw new Error(`Expected a photo (jpg/png/webp), got SVG: "${path}"`);
  return r.meta;
}

/** Every image under src/assets/, for the dashboard's thumbnails and its "does this image exist" check. */
export function listAssets() {
  const rel = (k: string) => k.replace(/^\/src\/assets\//, '');
  return [
    ...Object.entries(RASTER).map(([k, m]) => ({ path: rel(k), kind: 'raster' as const, meta: m.default })),
    ...Object.entries(SVG).map(([k, url]) => ({ path: rel(k), kind: 'svg' as const, url })),
  ];
}

/* ---------------- load + validate ---------------- */
function load(): Site {
  const parsed = SiteSchema.safeParse(raw);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`);
    throw new Error(`src/data/site.json has ${lines.length} problem(s):\n${lines.join('\n')}`);
  }
  const d = parsed.data;
  const g = d.galleries;
  const paths: [string, string][] = [
    ['home.hero.photo', d.home.hero.photo], ['home.hero.photoLight', d.home.hero.photoLight],
    ['home.about.image', d.home.about.image],
    ['course.photo', d.course.photo], ['course.photoLight', d.course.photoLight],
    ...d.home.promo.slides.flatMap((s, i) => [[`home.promo.slides.${i}.image.ar`, s.image.ar], [`home.promo.slides.${i}.image.en`, s.image.en]] as [string, string][]),
    ...d.home.workTeaser.flatMap((w, i) => [[`home.workTeaser.${i}.cover.ar`, w.cover.ar], [`home.workTeaser.${i}.cover.en`, w.cover.en]] as [string, string][]),
    ...GALLERIES.flatMap((k) => g[k].items.map((it, i) => [`galleries.${k}.items.${i}.image`, it.image] as [string, string])),
    ...g.print.items.map((it, i) => [`galleries.print.items.${i}.cover`, it.cover] as [string, string]),
  ];
  const missing = paths.filter(([, p]) => { try { resolveImage(p); return false; } catch { return true; } });
  if (missing.length) {
    throw new Error(
      `src/data/site.json points to ${missing.length} image(s) that don't exist in src/assets/:\n` +
        missing.map(([field, p]) => `  • ${field}: "${p}"`).join('\n'),
    );
  }
  return d;
}

export const site = load();

export const whatsappUrl = (message = '') => `https://wa.me/${site.contact.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
export const emailUrl = () => `mailto:${site.contact.email}`;
export const pad2 = (n: number) => String(n).padStart(2, '0');
