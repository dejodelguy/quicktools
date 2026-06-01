import { useState } from 'react'
import { Code, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function HtmlMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify')
  const [copied, setCopied] = useState(false)

  const minify = (html: string) => html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim()

  const beautify = (html: string) => {
    let result = ''
    let indent = 0
    const lines = html.replace(/(>)\s*(<)/g, '$1\n$2').split('\n')
    for (let line of lines) {
      line = line.trim()
      if (!line) continue
      if (line.match(/^<\//)) indent = Math.max(0, indent - 1)
      result += '  '.repeat(indent) + line + '\n'
      if (line.match(/^<[^/!][^>]*[^/]>$/i) && !line.match(/^<(br|hr|img|input|meta|link)/i)) indent++
    }
    return result.trim()
  }

  const process = () => setOutput(mode === 'minify' ? minify(input) : beautify(input))
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const savings = input && output ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <>
      <SEOHead title="HTML Minifier & Formatter - Minify/Beautify HTML" description="Minify or beautify HTML code online. Reduce file size or format for readability. Free, instant." path="/html-minifier" keywords="html minifier, html formatter, html beautifier, minify html, compress html" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Code className="w-7 h-7 text-orange-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML Minifier & Formatter</h1>
          <p className="text-gray-600">Minify or beautify HTML code instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMode('minify')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'minify' ? 'bg-white shadow text-orange-600' : 'text-gray-600'}`}>Minify</button>
              <button onClick={() => setMode('beautify')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'beautify' ? 'bg-white shadow text-orange-600' : 'text-gray-600'}`}>Beautify</button>
            </div>
            {savings > 0 && mode === 'minify' && <span className="text-sm text-green-600 font-medium">Saved {savings}%</span>}
          </div>
          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-orange-500 mb-4" placeholder="Paste HTML here..." value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={process} className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors mb-4">{mode === 'minify' ? 'Minify' : 'Beautify'} HTML</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Output ({output.length} chars)</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-sm text-orange-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <pre className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-auto max-h-60 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}