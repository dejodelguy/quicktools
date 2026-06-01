import { useState } from 'react'
import { Paintbrush, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function CssMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify')
  const [copied, setCopied] = useState(false)

  const minify = (css: string) => css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()

  const beautify = (css: string) => {
    let result = ''
    let indent = 0
    for (const char of css) {
      if (char === '{') { result += ' {\n'; indent++ }
      else if (char === '}') { indent--; result += '\n' + '  '.repeat(indent) + '}\n' }
      else if (char === ';') { result += ';\n' }
      else if (char === '\n' || char === '\r') continue
      else {
        if (result.endsWith('\n')) result += '  '.repeat(indent)
        result += char
      }
    }
    return result.replace(/^\s*\n/gm, '').trim()
  }

  const process = () => setOutput(mode === 'minify' ? minify(input) : beautify(input))
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const savings = input && output ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <>
      <SEOHead title="CSS Minifier & Formatter - Minify/Beautify CSS" description="Minify or beautify CSS code online. Reduce stylesheet size or format for readability. Free." path="/css-minifier" keywords="css minifier, css formatter, css beautifier, minify css, compress css" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Paintbrush className="w-7 h-7 text-pink-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSS Minifier & Formatter</h1>
          <p className="text-gray-600">Minify or beautify CSS code instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMode('minify')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'minify' ? 'bg-white shadow text-pink-600' : 'text-gray-600'}`}>Minify</button>
              <button onClick={() => setMode('beautify')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'beautify' ? 'bg-white shadow text-pink-600' : 'text-gray-600'}`}>Beautify</button>
            </div>
            {savings > 0 && mode === 'minify' && <span className="text-sm text-green-600 font-medium">Saved {savings}%</span>}
          </div>
          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-pink-500 mb-4" placeholder="Paste CSS here..." value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={process} className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 transition-colors mb-4">{mode === 'minify' ? 'Minify' : 'Beautify'} CSS</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Output ({output.length} chars)</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-sm text-pink-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <pre className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-auto max-h-60 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}