import { useState, useEffect } from 'react'
import { Clock, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function TimestampConverter() {
  const [now, setNow] = useState(Date.now())
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'unix' | 'iso'>('unix')
  const [copied, setCopied] = useState('')

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  const convert = () => {
    try {
      if (inputType === 'unix') {
        const ts = parseInt(input)
        const ms = input.length <= 10 ? ts * 1000 : ts
        return new Date(ms)
      }
      return new Date(input)
    } catch { return null }
  }

  const date = convert()
  const unixSec = Math.floor(now / 1000)
  const iso = new Date(now).toISOString()

  const copyText = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500) }

  return (
    <>
      <SEOHead title="Timestamp Converter - Unix Timestamp to Date Online" description="Convert Unix timestamps to human-readable dates and vice versa. Live current timestamp. Free online converter." path="/timestamp-converter" keywords="timestamp converter, unix timestamp, epoch converter, timestamp to date, date to timestamp" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Clock className="w-7 h-7 text-emerald-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timestamp Converter</h1>
          <p className="text-gray-600">Convert between Unix timestamps and human-readable dates.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg mb-6">
            <div>
              <div className="text-xs text-emerald-600 font-medium">Current Unix Timestamp</div>
              <button onClick={() => copyText(String(unixSec), 'unix')} className="flex items-center gap-2 font-mono text-lg font-bold text-emerald-800">
                {unixSec} {copied === 'unix' ? <Check className="w-4 h-4" /> : <Copy className="w-3 h-3 opacity-50" />}
              </button>
            </div>
            <div>
              <div className="text-xs text-emerald-600 font-medium">Current ISO 8601</div>
              <button onClick={() => copyText(iso, 'iso')} className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-800 break-all">
                {iso} {copied === 'iso' ? <Check className="w-4 h-4" /> : <Copy className="w-3 h-3 opacity-50 shrink-0" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mb-4">
            <select value={inputType} onChange={e => setInputType(e.target.value as any)} className="p-2.5 border border-gray-300 rounded-lg text-sm">
              <option value="unix">Unix Timestamp</option><option value="iso">ISO 8601 / Date String</option>
            </select>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-2.5 border border-gray-300 rounded-lg font-mono text-sm" placeholder={inputType === 'unix' ? '1700000000' : '2024-01-15T12:00:00Z'} />
          </div>
          {date && !isNaN(date.getTime()) && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Unix (seconds)', val: String(Math.floor(date.getTime() / 1000)) },
                { label: 'Unix (milliseconds)', val: String(date.getTime()) },
                { label: 'ISO 8601', val: date.toISOString() },
                { label: 'UTC', val: date.toUTCString() },
                { label: 'Local', val: date.toLocaleString() },
                { label: 'Relative', val: getRelative(date.getTime()) },
              ].map(({ label, val }) => (
                <button key={label} onClick={() => copyText(val, label)} className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-sm font-mono text-gray-800 break-all">{val} {copied === label && <Check className="w-3 h-3 inline text-green-600" />}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function getRelative(ts: number): string {
  const diff = Date.now() - ts
  const abs = Math.abs(diff)
  const suffix = diff > 0 ? 'ago' : 'from now'
  if (abs < 60000) return 'just now'
  if (abs < 3600000) return Math.floor(abs / 60000) + ' min ' + suffix
  if (abs < 86400000) return Math.floor(abs / 3600000) + ' hr ' + suffix
  return Math.floor(abs / 86400000) + ' days ' + suffix
}