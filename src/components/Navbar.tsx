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

  // Close dropdown on outside click
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
            <Wrench className="w-6 h-6" />
            QuickTools
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                          location.pathname === tool.path ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
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
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === tool.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
