import { useState } from 'react'
import { CaseSensitive, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState('')

  const cases = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'Sentence case', fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
    { label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: 'snake_case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
    { label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
    { label: 'aLtErNaTiNg', fn: (s: string) => s.split('').map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join('') },
  ]

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <>
      <SEOHead title="Case Converter - Convert Text Case Online" description="Convert text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case and more. Free online case converter." path="/case-converter" keywords="case converter, uppercase, lowercase, title case, camelcase, snake case, text case converter" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4"><CaseSensitive className="w-7 h-7 text-teal-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Converter</h1>
          <p className="text-gray-600">Convert text between different cases instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <textarea className="w-full h-32 p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4" placeholder="Type or paste your text here..." value={input} onChange={e => setInput(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            {cases.map(c => {
              const result = input ? c.fn(input) : ''
              return (
                <button key={c.label} onClick={() => copyText(result, c.label)} disabled={!input} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-left">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-0.5">{c.label}</div>
                    <div className="text-sm text-gray-800 truncate max-w-[200px]">{result || '...'}</div>
                  </div>
                  {copied === c.label ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}