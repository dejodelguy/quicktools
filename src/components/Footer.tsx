import { Link } from 'react-router-dom'
import { Wrench, Heart } from 'lucide-react'
import { AFFILIATES } from '../utils/affiliate'

const toolLinks = [
  { name: 'Invoice Generator', path: '/invoice-generator' },
  { name: 'JSON Formatter', path: '/json-formatter' },
  { name: 'Word Counter', path: '/word-counter' },
  { name: 'Color Converter', path: '/color-converter' },
  { name: 'Base64 Tool', path: '/base64-tool' },
  { name: 'QR Code Generator', path: '/qr-code-generator' },
  { name: 'Percentage Calculator', path: '/percentage-calculator' },
  { name: 'Password Generator', path: '/password-generator' },
  { name: 'Text Diff', path: '/text-diff' },
  { name: 'Markdown Preview', path: '/markdown-preview' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Wrench className="w-5 h-5" />
              QuickTools
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free online tools to boost your productivity. No signup required, fast and easy to use.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {toolLinks.slice(0, 5).map((tool) => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">More Tools</h3>
            <ul className="space-y-2">
              {toolLinks.slice(5).map((tool) => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Recommended</h3>
            <ul className="space-y-2">
              {Object.values(AFFILIATES).map((aff) => (
                <li key={aff.name}>
                  <a
                    href={aff.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {aff.icon} {aff.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} QuickTools. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for productivity
          </p>
        </div>
      </div>
    </footer>
  )
}
