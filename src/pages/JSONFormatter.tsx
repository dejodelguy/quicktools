import { useState } from 'react'
import { Braces, Copy, Check, Minimize2, Maximize2, AlertCircle } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const validate = () => {
    try {
      JSON.parse(input)
      setError('')
      alert('Valid JSON!')
    } catch (e: any) {
      setError(e.message)
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlightJSON = (json: string) => {
    return json
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]*?)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>')
      .replace(/([[\]{}])/g, '<span class="json-bracket">$1</span>')
  }

  return (
    <>
      <SEOHead title="JSON Formatter & Validator" description="Format, validate, and minify JSON data online. Free JSON beautifier with syntax highlighting. Instant, no signup." path="/json-formatter" keywords="json formatter, json validator, json beautifier, json minifier, format json online" />

      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Braces className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Formatter</h1>
          <p className="text-gray-600">Format, validate, and minify JSON data instantly</p>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
            <textarea
              className="w-full h-80 p-4 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder='{"name": "John", "age": 30, "city": "New York"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-3 mt-3">
              <button onClick={format} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Maximize2 className="w-4 h-4" /> Format
              </button>
              <button onClick={minify} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Minimize2 className="w-4 h-4" /> Minify
              </button>
              <button onClick={validate} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Validate
              </button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Output</label>
              {output && (
                <button onClick={copyOutput} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="w-full h-80 p-4 border border-gray-300 rounded-xl bg-gray-50 overflow-auto font-mono text-sm leading-relaxed">
              {output ? (
                <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightJSON(output) }} />
              ) : (
                <span className="text-gray-400">Formatted output will appear here...</span>
              )}
            </div>
          </div>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h2>
          <ul className="space-y-2 text-gray-600">
            <li>Paste your JSON data into the input field</li>
            <li>Click <strong>Format</strong> to beautify or <strong>Minify</strong> to compress</li>
            <li>Click <strong>Validate</strong> to check for syntax errors</li>
            <li>Copy the formatted output with one click</li>
          </ul>
        </div>
      </div>
    </>
  )
}