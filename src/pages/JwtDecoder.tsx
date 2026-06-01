import { useState } from 'react'
import { Key, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState('')

  const decode = () => {
    if (!token) return null
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const decode64 = (s: string) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')))
      return {
        header: decode64(parts[0]),
        payload: decode64(parts[1]),
        signature: parts[2],
      }
    } catch { return null }
  }

  const decoded = decode()

  const copyJson = (obj: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2))
    setCopied(label)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <>
      <SEOHead title="JWT Decoder - Decode JSON Web Tokens Online" description="Decode and inspect JWT tokens online. View header, payload, and signature. Free JWT decoder." path="/jwt-decoder" keywords="jwt decoder, jwt parser, json web token, decode jwt, jwt inspector" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Key className="w-7 h-7 text-violet-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JWT Decoder</h1>
          <p className="text-gray-600">Decode and inspect JSON Web Tokens.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <textarea className="w-full h-24 p-4 border border-gray-300 rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-violet-500 mb-4" placeholder="Paste your JWT token here (eyJhbGci...)" value={token} onChange={e => setToken(e.target.value)} />
          {decoded && (
            <div className="space-y-3">
              {[
                { label: 'Header', data: decoded.header, color: 'red' },
                { label: 'Payload', data: decoded.payload, color: 'blue' },
              ].map(({ label, data, color }) => (
                <div key={label} className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold text-${color}-700`}>{label}</span>
                    <button onClick={() => copyJson(data, label)} className="flex items-center gap-1 text-xs text-${color}-600">
                      {copied === label ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === label ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-gray-800 overflow-auto max-h-40">{JSON.stringify(data, null, 2)}</pre>
                </div>
              ))}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-sm font-bold text-gray-700">Signature</span>
                <div className="font-mono text-xs text-gray-600 break-all mt-1">{decoded.signature}</div>
              </div>
              {decoded.payload.exp && (
                <div className="text-sm text-gray-500">
                  Expires: {new Date(decoded.payload.exp * 1000).toLocaleString()}
                  {Date.now() > decoded.payload.exp * 1000 && <span className="text-red-600 font-medium ml-2">(EXPIRED)</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}