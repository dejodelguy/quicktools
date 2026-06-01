import { useState, useMemo } from 'react'
import { FileCode, Copy, Check, Maximize2, Minimize2 } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import SEOHead from '../components/SEOHead'

const SAMPLE = `# Hello World

This is a **Markdown** editor with *live preview*.

## Features

- Real-time preview
- Syntax highlighting
- HTML export
- Fullscreen mode

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Bold | ✅ |
| Italic | ✅ |
| Links | ✅ |
| Images | ✅ |

> This is a blockquote

[Visit GitHub](https://github.com)
`

export default function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE)
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState<'editor' | 'preview' | null>(null)

  const html = useMemo(() => {
    const raw = marked.parse(md) as string
    return DOMPurify.sanitize(raw)
  }, [md])

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const editorClass = fullscreen === 'editor' ? 'fixed inset-0 z-50 bg-white p-4' : ''
  const previewClass = fullscreen === 'preview' ? 'fixed inset-0 z-50 bg-white p-4' : ''

  return (
    <>
      <SEOHead title="Markdown Preview — Live Editor" description="Write and preview Markdown in real time. Export clean HTML. Free online Markdown editor with live preview." path="/markdown-preview" keywords="markdown editor, markdown preview, markdown to html, live markdown" />

      <div className={`${fullscreen ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}`}>
        {!fullscreen && (
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileCode className="w-7 h-7 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Markdown Preview</h1>
            <p className="text-gray-600">Write Markdown and see the rendered preview in real time</p>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${fullscreen ? 'h-full' : ''}`}>
          <div className={`${editorClass} flex flex-col`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Markdown</span>
              <button onClick={() => setFullscreen(fullscreen === 'editor' ? null : 'editor')} className="p-1.5 rounded hover:bg-gray-100">
                {fullscreen === 'editor' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            <textarea className="flex-1 w-full min-h-[400px] p-4 border border-gray-300 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={md} onChange={e => setMd(e.target.value)} />
          </div>

          <div className={`${previewClass} flex flex-col`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Preview</span>
              <div className="flex gap-2">
                <button onClick={copyHtml} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy HTML'}
                </button>
                <button onClick={() => setFullscreen(fullscreen === 'preview' ? null : 'preview')} className="p-1.5 rounded hover:bg-gray-100">
                  {fullscreen === 'preview' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[400px] p-6 border border-gray-300 rounded-xl bg-white overflow-auto markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </>
  )
}