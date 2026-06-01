import { useState } from 'react'
import { Hash, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

async function hash(algo: string, text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState('')

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  const generate = async () => {
    if (!input) return
    const res: Record<string, string> = {}
    for (const algo of algorithms) {
      res[algo] = await hash(algo, input)
    }
    setResults(res)
  }

  const copyHash = (algo: string) => {
    navigator.clipboard.writeText(results[algo])
    setCopied(algo)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <>
      <SEOHead title="Hash Generator - SHA-1, SHA-256, SHA-512 Online" description="Generate hash values for text using SHA-1, SHA-256, SHA-384, SHA-512 algorithms. Free online hash generator." path="/hash-generator" keywords="hash generator, sha256, sha1, sha512, hash calculator, text hash, checksum generator" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Hash className="w-7 h-7 text-violet-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hash Generator</h1>
          <p className="text-gray-600">Generate cryptographic hashes for any text input.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <textarea className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 mb-4" placeholder="Enter text to hash..." value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={generate} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors mb-4">Generate Hashes</button>
          {Object.keys(results).length > 0 && (
            <div className="space-y-3">
              {algorithms.map(algo => (
                <div key={algo} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 w-16">{algo}</span>
                  <code className="flex-1 text-sm text-gray-800 break-all">{results[algo]}</code>
                  <button onClick={() => copyHash(algo)} className="shrink-0">{copied === algo ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}