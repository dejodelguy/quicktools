const BASE_URL = 'https://quicktools.vercel.app'

interface SitemapRoute {
  path: string
  priority: string
  changefreq: string
}

const routes: SitemapRoute[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  // Original 10
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
  // Image Tools (high SEO priority)
  { path: '/image-compressor', priority: '0.9', changefreq: 'monthly' },
  { path: '/image-resizer', priority: '0.9', changefreq: 'monthly' },
  { path: '/image-cropper', priority: '0.8', changefreq: 'monthly' },
  { path: '/image-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/background-remover', priority: '0.9', changefreq: 'monthly' },
  { path: '/image-color-picker', priority: '0.7', changefreq: 'monthly' },
  { path: '/meme-generator', priority: '0.8', changefreq: 'monthly' },
  // PDF Tools (high SEO priority)
  { path: '/image-to-pdf', priority: '0.9', changefreq: 'monthly' },
  { path: '/pdf-merger', priority: '0.9', changefreq: 'monthly' },
  // Text Tools
  { path: '/lorem-ipsum-generator', priority: '0.7', changefreq: 'monthly' },
  { path: '/case-converter', priority: '0.7', changefreq: 'monthly' },
  { path: '/text-to-speech', priority: '0.8', changefreq: 'monthly' },
  // Dev Tools
  { path: '/hash-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/uuid-generator', priority: '0.7', changefreq: 'monthly' },
  { path: '/regex-tester', priority: '0.8', changefreq: 'monthly' },
  { path: '/url-encoder', priority: '0.7', changefreq: 'monthly' },
  { path: '/timestamp-converter', priority: '0.7', changefreq: 'monthly' },
  { path: '/jwt-decoder', priority: '0.7', changefreq: 'monthly' },
  { path: '/cron-builder', priority: '0.7', changefreq: 'monthly' },
  { path: '/html-minifier', priority: '0.8', changefreq: 'monthly' },
  { path: '/css-minifier', priority: '0.8', changefreq: 'monthly' },
  { path: '/json-to-csv', priority: '0.7', changefreq: 'monthly' },
  { path: '/password-strength', priority: '0.8', changefreq: 'monthly' },
  // Converters
  { path: '/unit-converter', priority: '0.9', changefreq: 'monthly' },
  { path: '/currency-converter', priority: '0.9', changefreq: 'monthly' },
  { path: '/base-converter', priority: '0.7', changefreq: 'monthly' },
  // Calculators
  { path: '/loan-calculator', priority: '0.9', changefreq: 'monthly' },
  { path: '/bmi-calculator', priority: '0.9', changefreq: 'monthly' },
  { path: '/age-calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tip-calculator', priority: '0.8', changefreq: 'monthly' },
  // Other
  { path: '/privacy-policy-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/screen-ruler', priority: '0.6', changefreq: 'monthly' },
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
