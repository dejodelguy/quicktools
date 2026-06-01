import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description: string
  path?: string
  keywords?: string
}

export default function SEOHead({ title, description, path = '/', keywords }: SEOHeadProps) {
  const url = `https://quicktools.vercel.app${path}`
  const fullTitle = `${title} | QuickTools`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="QuickTools" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'QuickTools',
        url: url,
        description: description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}</script>
    </Helmet>
  )
}
