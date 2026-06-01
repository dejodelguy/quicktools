import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
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
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand">
              <Wrench size={20} />
              QuickTools
            </Link>
            <p className="footer-desc">
              Free online tools to boost your productivity. No signup, no tracking, just tools that work.
            </p>
          </div>

          <div className="footer-col">
            <h3>Popular Tools</h3>
            {toolLinks.slice(0, 5).map((tool) => (
              <Link key={tool.path} to={tool.path}>{tool.name}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h3>More Tools</h3>
            {toolLinks.slice(5).map((tool) => (
              <Link key={tool.path} to={tool.path}>{tool.name}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h3>Recommended</h3>
            {Object.values(AFFILIATES).map((aff) => (
              <a
                key={aff.name}
                href={aff.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {aff.icon} {aff.name}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} QuickTools. All rights reserved.</p>
          <p>Built for people who get things done.</p>
        </div>
      </div>
    </footer>
  )
}
