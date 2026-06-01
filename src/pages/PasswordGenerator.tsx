import { useState, useCallback } from 'react'
import { Shield, Copy, Check, RefreshCw } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [excludeSimilar, setExcludeSimilar] = useState(false)

  const generate = useCallback(() => {
    let pool = ''
    if (opts.upper) pool += CHARS.upper
    if (opts.lower) pool += CHARS.lower
    if (opts.numbers) pool += CHARS.numbers
    if (opts.symbols) pool += CHARS.symbols
    if (!pool) { setPassword('Select at least one character type'); return }
    if (excludeSimilar) pool = pool.replace(/[lI1O0]/g, '')
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    setPassword(Array.from(arr, x => pool[x % pool.length]).join(''))
  }, [length, opts, excludeSimilar])

  const strength = password.length < 8 ? { label: 'Weak', color: 'strength-weak', width: '20%' }
    : password.length < 12 ? { label: 'Fair', color: 'strength-fair', width: '40%' }
    : password.length < 16 ? { label: 'Good', color: 'strength-good', width: '60%' }
    : password.length < 24 ? { label: 'Strong', color: 'strength-strong', width: '80%' }
    : { label: 'Very Strong', color: 'strength-very-strong', width: '100%' }

  const copyPw = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SEOHead title="Password Generator — Strong Secure Passwords" description="Generate strong, secure passwords online. Customizable length, character types, and strength meter. Free, no signup." path="/password-generator" keywords="password generator, random password, strong password, secure password generator" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Shield className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Generator</h1>
          <p className="text-gray-600">Generate strong, secure passwords with one click</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Generated password */}
          <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <code className="flex-1 font-mono text-lg break-all select-all">{password || 'Click Generate'}</code>
            <button onClick={copyPw} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
            </button>
          </div>

          {/* Strength bar */}
          {password && (
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Strength</span>
                <span className="font-medium text-gray-700">{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
              </div>
            </div>
          )}

          {/* Length */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Length</span>
              <span className="font-bold text-blue-600">{length}</span>
            </div>
            <input type="range" min={4} max={128} value={length} onChange={e => setLength(+e.target.value)} className="w-full accent-blue-600" />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              ['upper', 'Uppercase (A-Z)'],
              ['lower', 'Lowercase (a-z)'],
              ['numbers', 'Numbers (0-9)'],
              ['symbols', 'Symbols (!@#$)'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={opts[key]} onChange={e => setOpts({ ...opts, [key]: e.target.checked })} className="rounded" />
                {label}
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-6 p-2 rounded-lg hover:bg-gray-50">
            <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} className="rounded" />
            Exclude similar characters (l, I, 1, O, 0)
          </label>

          <button onClick={generate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg">
            <RefreshCw className="w-5 h-5" /> Generate Password
          </button>
        </div>
      </div>
    </>
  )
}