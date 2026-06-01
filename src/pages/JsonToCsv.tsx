import { useState } from 'react'
import { FileJson, Copy, Check, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'

function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, newKey))
    } else {
      result[newKey] = val
    }
  }
  return result
}

export default function JsonToCsv() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try {
      setError('')
      let data = JSON.parse(input)
      if (!Array.isArray(data)) data = [data]
      const flat: Record<string, any>[] = data.map((d: any) => typeof d === 'object' ? flatten(d) : { value: d })
      const headers: string[] = [...new Set(flat.flatMap((r: any) => Object.keys(r)))]
      const csv = [
        headers.map(h => `"${h}"`).join(','),
        ...flat.map((row: any) => headers.map(h => {
          const v = row[h] ?? ''
          return `"${String(v).replace(/"/g, '""')}"`
        }).join(','))
      ].join('\n')
      setOutput(csv)
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([output], { type: 'text/csv' })); a.download = 'converted.csv'; a.click() }

  return (
    <>
      <SEOHead title="JSON to CSV Converter - Convert JSON to CSV Online" description="Convert JSON data to CSV format instantly. Supports nested objects. Free online JSON to CSV converter." path="/json-to-csv" keywords="json to csv, json to csv converter, convert json, json csv, json to spreadsheet" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileJson className="w-7 h-7 text-yellow-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON to CSV Converter</h1>
          <p className="text-gray-600">Convert JSON arrays to CSV format. Handles nested objects.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-yellow-500 mb-4" placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]' value={input} onChange={e => setInput(e.target.value)} />
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <button onClick={convert} className="w-full bg-yellow-600 text-white py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition-colors mb-4">Convert to CSV</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">CSV Output</span>
                <div className="flex gap-2">
                  <button onClick={copy} className="flex items-center gap-1.5 text-sm text-yellow-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
                  <button onClick={download} className="flex items-center gap-1.5 text-sm text-blue-600"><Download className="w-4 h-4" /> Download .csv</button>
                </div>
              </div>
              <pre className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-auto max-h-60">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}