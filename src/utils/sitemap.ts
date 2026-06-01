const BASE_URL = 'https://quicktools.vercel.app'

interface SitemapRoute {
  path: string
  priority: string
  changefreq: string
}

const routes: SitemapRoute[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/invoice-generator', priority: '0.9', changefreq: 'monthly' },
  { path: '/json-formatter', priority: '0.9', changefreq: 'monthly' },
  { path: '/word-counter', priority: '0.9', changefreq: 'monthly' },
  { path: '/color-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/base64-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/qr-code-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/percentage-calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/password-generator', priority: '0.9', changefreq: 'monthly' },
  { path: '/text-diff', priority: '0.8', changefreq: 'monthly' },
  { path: '/markdown-preview', priority: '0.8', changefreq: 'monthly' },
]

export function generateSitemap(): string {
  const urls = routes.map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
