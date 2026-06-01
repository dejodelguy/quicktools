import { useState } from 'react'
import { Fingerprint, Copy, Check, RefreshCw } from 'lucide-react'
import SEOHead from '../components/SEOHead'

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()])
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState(false)

  const generate = () => setUuids(Array.from({ length: count }, () => uuidv4()))
  const copyAll = () => { navigator.clipboard.writeText(uuids.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <SEOHead title="UUID Generator - Generate Unique Identifiers Online" description="Generate UUID v4 unique identifiers online. Bulk generate up to 100 UUIDs at once. Free, no signup." path="/uuid-generator" keywords="uuid generator, guid generator, unique id, uuid v4, random id generator" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Fingerprint className="w-7 h-7 text-sky-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UUID Generator</h1>
          <p className="text-gray-600">Generate unique identifiers (UUID v4) for your applications.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Count</label>
              <input type="number" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
            </div>
            <button onClick={generate} className="self-end flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"><RefreshCw className="w-4 h-4" /> Generate</button>
          </div>
          <div className="space-y-2 mb-4">
            {uuids.map((u, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm text-gray-800 break-all">{u}</code>
              </div>
            ))}
          </div>
          <button onClick={copyAll} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>
    </>
  )
}