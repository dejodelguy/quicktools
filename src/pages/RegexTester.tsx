import { useState, useMemo } from 'react'
import { Regex } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')
  const [error, setError] = useState('')

  const { matches } = useMemo(() => {
    if (!pattern || !testStr) return { matches: [] }
    try {
      const m = [...testStr.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
      setError('')
      const allMatches: { text: string; index: number; groups: string[] }[] = []
      for (const match of m) {
        allMatches.push({ text: match[0], index: match.index!, groups: match.slice(1) })
      }
      return { matches: allMatches }
    } catch (e: any) {
      setError(e.message)
      return { matches: [] }
    }
  }, [pattern, flags, testStr])

  return (
    <>
      <SEOHead title="Regex Tester - Test Regular Expressions Online" description="Test and debug regular expressions online. Real-time matching with highlights. Supports JavaScript regex." path="/regex-tester" keywords="regex tester, regex editor, regular expression tester, regex debugger, regex online" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Regex className="w-7 h-7 text-rose-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regex Tester</h1>
          <p className="text-gray-600">Test and debug regular expressions with real-time matching.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">/</span>
              <input type="text" value={pattern} onChange={e => setPattern(e.target.value)} className="w-full p-2.5 pl-7 pr-7 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-rose-500" placeholder="Enter regex pattern..." />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">/</span>
            </div>
            <input type="text" value={flags} onChange={e => setFlags(e.target.value)} className="w-20 p-2.5 border border-gray-300 rounded-lg font-mono text-sm text-center" placeholder="flags" />
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-rose-500 mb-4" placeholder="Test string..." value={testStr} onChange={e => setTestStr(e.target.value)} />
          {matches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{matches.length} match{matches.length !== 1 ? 'es' : ''}</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {matches.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-medium">#{i + 1}</span>
                    <div>
                      <code className="text-sm text-gray-800 bg-rose-50 px-1 rounded">"{m.text}"</code>
                      <span className="text-xs text-gray-500 ml-2">index {m.index}</span>
                      {m.groups.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">Groups: {m.groups.map((g, j) => <code key={j} className="bg-gray-100 px-1 rounded ml-1">${g || '(empty)'}</code>)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}