export const AFFILIATES = {
  quickbooks: {
    url: 'https://quickbooks.example.com/aff',
    name: 'QuickBooks',
    description: 'Manage your invoices, expenses, and accounting with the #1 small business cloud accounting software.',
    cta: 'Try QuickBooks Free',
    icon: '📊',
  },
  freshbooks: {
    url: 'https://freshbooks.example.com/aff',
    name: 'FreshBooks',
    description: 'The best invoicing software for freelancers and small businesses. Send professional invoices in seconds.',
    cta: 'Try FreshBooks Free',
    icon: '📄',
  },
  wave: {
    url: 'https://waveapps.example.com/aff',
    name: 'Wave Accounting',
    description: 'Free accounting software for small businesses. Invoicing, accounting, and receipt scanning — all free.',
    cta: 'Sign Up Free',
    icon: '🌊',
  },
  nordvpn: {
    url: 'https://nordvpn.example.com/aff',
    name: 'NordVPN',
    description: 'Stay safe online with the best VPN service. Protect your privacy and browse securely.',
    cta: 'Get NordVPN Deal',
    icon: '🔒',
  },
  canva: {
    url: 'https://canva.example.com/aff',
    name: 'Canva Pro',
    description: 'Design professional graphics, presentations, and social media posts with Canva Pro.',
    cta: 'Try Canva Pro Free',
    icon: '🎨',
  },
}

export type AffiliateKey = keyof typeof AFFILIATES
