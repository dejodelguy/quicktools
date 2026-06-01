import { useState } from 'react'
import { Binary, Copy, Check, Upload } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const process = () => {
    try {
      setError('')
      if (mode === 'encode') {
        let result = btoa(unescape(encodeURIComponent(input)))
        if (urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_')
        setOutput(result)
      } else {
        let inp = input
        if (urlSafe) inp = inp.replace(/-/g, '+').replace(/_/g, '/')
        setOutput(decodeURIComponent(escape(atob(inp))))
      }
    } catch (e: any) {
      setError('Invalid input for decoding. Make sure it\'s valid Base64.')
      setOutput('')
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setOutput(result)
      setMode('encode')
    }
    reader.readAsDataURL(file)
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SEOHead title="Base64 Encoder & Decoder" description="Encode and decode Base64 strings online free. Supports text and file conversion with URL-safe option." path="/base64-tool" keywords="base64 encoder, base64 decoder, base64 converter, encode decode base64" />

      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Binary className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Base64 Encoder & Decoder</h1>
          <p className="text-gray-600">Encode and decode Base64 strings instantly</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>Encode</button>
              <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>Decode</button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} className="rounded" />
              URL-safe
            </label>
          </div>

          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'} value={input} onChange={e => setInput(e.target.value)} />

          <div className="flex gap-3 mb-4">
            <button onClick={process} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" /> File
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Output</span>
                <button onClick={copyOutput} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm break-all max-h-48 overflow-auto">{output}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}