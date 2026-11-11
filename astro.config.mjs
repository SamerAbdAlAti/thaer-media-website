// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The GitHub Actions workflow passes these from actions/configure-pages, so the same build works
// on a custom domain (BASE_PATH empty) and on username.github.io/repo-name (BASE_PATH "/repo-name").
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements and would eat the
  // space after the gold kicker in every heading. Keep the classic HTML whitespace behaviour.
  compressHTML: true,
  build: {
    // Small per-page CSS is inlined (no extra request); the shared stylesheet stays a cached file.
    inlineStylesheets: 'auto',
  },
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // The sitemap needs absolute URLs, so it's only generated when the site URL is known (CI build).
  integrations: site
    ? [sitemap({
        i18n: { defaultLocale: 'ar', locales: { ar: 'ar', en: 'en' } },
        filter: (page) => !page.includes('/admin/'),
      })]
    : [],
});
