import { useState } from 'react'
import { Binary, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function BaseConverter() {
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [copied, setCopied] = useState('')

  const convert = (toBase: number): string => {
    if (!input) return ''
    try {
      const num = parseInt(input, fromBase)
      if (isNaN(num)) return 'Invalid'
      return num.toString(toBase).toUpperCase()
    } catch { return 'Error' }
  }

  const copyText = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500) }

  const bases = [
    { base: 2, label: 'Binary' },
    { base: 8, label: 'Octal' },
    { base: 10, label: 'Decimal' },
    { base: 16, label: 'Hexadecimal' },
  ]

  return (
    <>
      <SEOHead title="Number Base Converter - Binary, Octal, Hex, Decimal" description="Convert numbers between binary, octal, decimal, and hexadecimal bases. Free online number base converter." path="/base-converter" keywords="base converter, binary converter, hex converter, octal converter, number system converter" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Binary className="w-7 h-7 text-indigo-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Number Base Converter</h1>
          <p className="text-gray-600">Convert numbers between binary, octal, decimal, and hex.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-3 mb-4">
            <select value={fromBase} onChange={e => setFromBase(Number(e.target.value))} className="p-2.5 border border-gray-300 rounded-lg text-sm">
              {bases.map(b => <option key={b.base} value={b.base}>{b.label} (base {b.base})</option>)}
            </select>
            <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())} className="flex-1 p-2.5 border border-gray-300 rounded-lg font-mono text-lg" placeholder="Enter number..." />
          </div>
          <div className="space-y-2">
            {bases.filter(b => b.base !== fromBase).map(b => {
              const result = convert(b.base)
              return (
                <button key={b.base} onClick={() => copyText(result, b.label)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div>
                    <div className="text-xs font-medium text-gray-500">{b.label} (base {b.base})</div>
                    <div className="font-mono text-lg font-bold text-gray-800">{result || '—'}</div>
                  </div>
                  {copied === b.label ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}