import { useState, useMemo } from 'react'
import { GitCompare } from 'lucide-react'
import SEOHead from '../components/SEOHead'

function diffLines(a: string, b: string) {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const result: { type: 'added' | 'removed' | 'unchanged'; text: string; lineNum?: number }[] = []
  const maxLen = Math.max(linesA.length, linesB.length)
  for (let i = 0; i < maxLen; i++) {
    const la = linesA[i], lb = linesB[i]
    if (la === undefined) result.push({ type: 'added', text: lb })
    else if (lb === undefined) result.push({ type: 'removed', text: la })
    else if (la === lb) result.push({ type: 'unchanged', text: la })
    else { result.push({ type: 'removed', text: la }); result.push({ type: 'added', text: lb }) }
  }
  return result
}

export default function TextDiff() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')

  const diff = useMemo(() => diffLines(textA, textB), [textA, textB])
  const stats = useMemo(() => ({
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length,
  }), [diff])

  return (
    <>
      <SEOHead title="Text Diff — Compare Two Texts" description="Compare two texts side by side and highlight differences. Free online text comparison tool." path="/text-diff" keywords="text diff, text comparison, compare text, diff tool, text difference checker" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><GitCompare className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Diff</h1>
          <p className="text-gray-600">Compare two texts and highlight the differences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Text</label>
            <textarea className="w-full h-48 p-4 border border-gray-300 rounded-xl text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Paste original text here..." value={textA} onChange={e => setTextA(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modified Text</label>
            <textarea className="w-full h-48 p-4 border border-gray-300 rounded-xl text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Paste modified text here..." value={textB} onChange={e => setTextB(e.target.value)} />
          </div>
        </div>

        {(textA || textB) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-green-600 font-medium">+{stats.added} added</span>
              <span className="text-red-600 font-medium">-{stats.removed} removed</span>
              <span className="text-gray-500">{stats.unchanged} unchanged</span>
            </div>
            <div className="font-mono text-sm border border-gray-200 rounded-lg overflow-hidden">
              {diff.map((d, i) => (
                <div key={i} className={`px-4 py-1.5 border-l-3 ${
                  d.type === 'added' ? 'diff-added' : d.type === 'removed' ? 'diff-removed' : 'diff-unchanged'
                }`}>
                  <span className="text-gray-400 select-none mr-3 inline-block w-6 text-right">{i + 1}</span>
                  {d.text || '\u00A0'}
                </div>
              ))}
              {diff.length === 0 && <div className="px-4 py-8 text-center text-gray-400">Enter text in both fields to compare</div>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}