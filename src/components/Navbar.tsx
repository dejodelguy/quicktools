import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
  Wrench, FileText, Braces, Type, Palette, Binary,
  QrCode, Calculator, Shield, GitCompare, FileCode, Menu, X, ChevronDown,
} from 'lucide-react'

const tools = [
  { name: 'Invoice Generator', path: '/invoice-generator', icon: FileText },
  { name: 'JSON Formatter', path: '/json-formatter', icon: Braces },
  { name: 'Word Counter', path: '/word-counter', icon: Type },
  { name: 'Color Converter', path: '/color-converter', icon: Palette },
  { name: 'Base64 Tool', path: '/base64-tool', icon: Binary },
  { name: 'QR Code Generator', path: '/qr-code-generator', icon: QrCode },
  { name: 'Percentage Calculator', path: '/percentage-calculator', icon: Calculator },
  { name: 'Password Generator', path: '/password-generator', icon: Shield },
  { name: 'Text Diff', path: '/text-diff', icon: GitCompare },
  { name: 'Markdown Preview', path: '/markdown-preview', icon: FileCode },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Wrench size={22} />
          QuickTools
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <div className="dropdown" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="dropdown-trigger"
            >
              Tools
              <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`dropdown-item ${location.pathname === tool.path ? 'active' : ''}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Icon size={16} />
                      {tool.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu md:hidden">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.path}
                to={tool.path}
                onClick={() => setMobileOpen(false)}
                className={location.pathname === tool.path ? 'active' : ''}
              >
                <Icon size={16} />
                {tool.name}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
