import { ExternalLink } from 'lucide-react'
import { AFFILIATES, type AffiliateKey } from '../utils/affiliate'

interface AffiliateBannerProps {
  affiliate: AffiliateKey
  className?: string
}

export default function AffiliateBanner({ affiliate, className = '' }: AffiliateBannerProps) {
  const aff = AFFILIATES[affiliate]
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{aff.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{aff.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{aff.description}</p>
          <a
            href={aff.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {aff.cta}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
