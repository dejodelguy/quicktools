import { useState } from 'react'
import { Link, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [component, setComponent] = useState(false)
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(component ? encodeURIComponent(input) : encodeURI(input))
      } else {
        setOutput(component ? decodeURIComponent(input) : decodeURI(input))
      }
    } catch (e: any) {
      setOutput('Error: ' + e.message)
    }
  }

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <SEOHead title="URL Encoder & Decoder - Encode URLs Online" description="Encode and decode URLs online. Convert special characters to URL-safe format. Free, instant, no signup." path="/url-encoder" keywords="url encoder, url decoder, url encode, url decode, percent encoding, urlencode" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Link className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Encoder & Decoder</h1>
          <p className="text-gray-600">Encode or decode URLs and URI components instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'encode' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>Encode</button>
              <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'decode' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>Decode</button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={component} onChange={e => setComponent(e.target.checked)} className="rounded" />
              URI Component
            </label>
          </div>
          <textarea className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL...'} value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={process} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Result</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-sm text-blue-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm break-all">{output}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}