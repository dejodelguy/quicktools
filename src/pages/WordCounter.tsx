import { useState, useMemo } from 'react'
import { Type, Clock, BookOpen, Mic } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

export default function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    if (!trimmed) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readTime: '0 min', speakTime: '0 min', keywords: [] as { word: string; count: number; pct: string }[] }

    const words = trimmed.split(/\s+/).length
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim()).length
    const readMin = Math.ceil(words / 200)
    const speakMin = Math.ceil(words / 130)

    const wordFreq: Record<string, number> = {}
    trimmed.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).forEach(w => {
      if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1
    })
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count, pct: ((count / words) * 100).toFixed(1) }))

    return { words, chars, charsNoSpaces, sentences, paragraphs, readTime: `${readMin} min`, speakTime: `${speakMin} min`, keywords }
  }, [text])

  const statCards = [
    { label: 'Words', value: stats.words, icon: Type },
    { label: 'Characters', value: stats.chars, icon: Type },
    { label: 'Sentences', value: stats.sentences, icon: BookOpen },
    { label: 'Paragraphs', value: stats.paragraphs, icon: BookOpen },
    { label: 'Read Time', value: stats.readTime, icon: Clock },
    { label: 'Speak Time', value: stats.speakTime, icon: Mic },
  ]

  return (
    <>
      <SEOHead title="Word Counter — Count Words, Characters & Reading Time" description="Free online word counter. Count words, characters, sentences, paragraphs, and estimate reading time. Analyze keyword density." path="/word-counter" keywords="word counter, character counter, word count, reading time calculator, keyword density" />

      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Type className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Counter</h1>
          <p className="text-gray-600">Count words, characters, sentences, and estimate reading time</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Icon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <AdPlaceholder size="leaderboard" />

        {stats.keywords.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keyword Density</h2>
            <div className="space-y-2">
              {stats.keywords.map(({ word, count, pct }) => (
                <div key={word} className="flex items-center gap-4">
                  <span className="w-32 font-mono text-sm text-gray-700">{word}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(parseFloat(pct) * 5, 100)}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-20 text-right">{count}x ({pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}