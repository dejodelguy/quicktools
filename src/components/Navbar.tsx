import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
  Wrench, Menu, X, ChevronDown, Search,
  Image, FileText, Type, Code, ArrowRightLeft, Calculator, Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Category {
  name: string
  id: string
  icon: LucideIcon
  tools: { name: string; path: string }[]
}

const categories: Category[] = [
  {
    name: 'Image', id: 'image-tools', icon: Image,
    tools: [
      { name: 'Image Compressor', path: '/image-compressor' },
      { name: 'Image Resizer', path: '/image-resizer' },
      { name: 'Image Cropper', path: '/image-cropper' },
      { name: 'Image Converter', path: '/image-converter' },
      { name: 'Background Remover', path: '/background-remover' },
      { name: 'Image Color Picker', path: '/image-color-picker' },
      { name: 'Meme Generator', path: '/meme-generator' },
    ],
  },
  {
    name: 'PDF', id: 'pdf-tools', icon: FileText,
    tools: [
      { name: 'Image to PDF', path: '/image-to-pdf' },
      { name: 'PDF Merger', path: '/pdf-merger' },
    ],
  },
  {
    name: 'Text', id: 'text-tools', icon: Type,
    tools: [
      { name: 'Word Counter', path: '/word-counter' },
      { name: 'Lorem Ipsum Generator', path: '/lorem-ipsum-generator' },
      { name: 'Case Converter', path: '/case-converter' },
      { name: 'Text to Speech', path: '/text-to-speech' },
      { name: 'Text Diff', path: '/text-diff' },
      { name: 'Markdown Preview', path: '/markdown-preview' },
    ],
  },
  {
    name: 'Developer', id: 'developer-tools', icon: Code,
    tools: [
      { name: 'JSON Formatter', path: '/json-formatter' },
      { name: 'Hash Generator', path: '/hash-generator' },
      { name: 'UUID Generator', path: '/uuid-generator' },
      { name: 'Regex Tester', path: '/regex-tester' },
      { name: 'URL Encoder', path: '/url-encoder' },
      { name: 'Timestamp Converter', path: '/timestamp-converter' },
      { name: 'JWT Decoder', path: '/jwt-decoder' },
      { name: 'Cron Builder', path: '/cron-builder' },
      { name: 'HTML Minifier', path: '/html-minifier' },
      { name: 'CSS Minifier', path: '/css-minifier' },
      { name: 'JSON to CSV', path: '/json-to-csv' },
      { name: 'Password Strength', path: '/password-strength' },
    ],
  },
  {
    name: 'Converters', id: 'converters', icon: ArrowRightLeft,
    tools: [
      { name: 'Color Converter', path: '/color-converter' },
      { name: 'Base64 Tool', path: '/base64-tool' },
      { name: 'Unit Converter', path: '/unit-converter' },
      { name: 'Currency Converter', path: '/currency-converter' },
      { name: 'Number Base Converter', path: '/base-converter' },
      { name: 'Percentage Calculator', path: '/percentage-calculator' },
    ],
  },
  {
    name: 'Calculators', id: 'calculators', icon: Calculator,
    tools: [
      { name: 'Loan Calculator', path: '/loan-calculator' },
      { name: 'BMI Calculator', path: '/bmi-calculator' },
      { name: 'Age Calculator', path: '/age-calculator' },
      { name: 'Tip Calculator', path: '/tip-calculator' },
    ],
  },
  {
    name: 'Generators', id: 'generators', icon: Sparkles,
    tools: [
      { name: 'Invoice Generator', path: '/invoice-generator' },
      { name: 'Password Generator', path: '/password-generator' },
      { name: 'QR Code Generator', path: '/qr-code-generator' },
      { name: 'Privacy Policy Generator', path: '/privacy-policy-generator' },
      { name: 'Screen Ruler', path: '/screen-ruler' },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!activeDropdown) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [activeDropdown])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  const handleCategoryClick = (cat: Category) => {
    setActiveDropdown(null)
    setMobileOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById(cat.id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollTo: cat.id } })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Wrench size={22} />
          QuickTools
        </Link>

        {/* Desktop nav */}
        <div className="navbar-links" ref={dropdownRef}>
          {categories.map((cat) => {
            const Icon = cat.icon
            const isOpen = activeDropdown === cat.name
            return (
              <div key={cat.name} className="navbar-item-wrap">
                <button
                  className={`navbar-link ${isOpen ? 'open' : ''}`}
                  onClick={() => setActiveDropdown(isOpen ? null : cat.name)}
                  onMouseEnter={() => setActiveDropdown(cat.name)}
                >
                  <Icon size={15} />
                  {cat.name}
                  <ChevronDown size={13} className={`navbar-chevron ${isOpen ? 'open' : ''}`} />
                </button>
                {isOpen && (
                  <div className="navbar-dropdown" onMouseLeave={() => setActiveDropdown(null)}>
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className={`navbar-dropdown-item ${location.pathname === tool.path ? 'active' : ''}`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="navbar-mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="navbar-mobile">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.name} className="navbar-mobile-section">
                <button
                  className="navbar-mobile-heading"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <Icon size={16} />
                  {cat.name}
                </button>
                <div className="navbar-mobile-tools">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setMobileOpen(false)}
                      className={`navbar-mobile-link ${location.pathname === tool.path ? 'active' : ''}`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </nav>
  )
}
