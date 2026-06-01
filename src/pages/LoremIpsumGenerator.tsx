import { useState } from 'react'
import { AlignLeft, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function generate(count: number, type: 'words' | 'sentences' | 'paragraphs'): string {
  const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)]
  if (type === 'words') return Array.from({ length: count }, pick).join(' ')
  if (type === 'sentences') return Array.from({ length: count }, () => {
    const len = 8 + Math.floor(Math.random() * 12)
    const s = Array.from({ length: len }, pick).join(' ')
    return s.charAt(0).toUpperCase() + s.slice(1) + '.'
  }).join(' ')
  return Array.from({ length: count }, () => {
    const sentences = 3 + Math.floor(Math.random() * 4)
    return Array.from({ length: sentences }, () => {
      const len = 8 + Math.floor(Math.random() * 12)
      const s = Array.from({ length: len }, pick).join(' ')
      return s.charAt(0).toUpperCase() + s.slice(1) + '.'
    }).join(' ')
  }).join('\n\n')
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3)
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [output, setOutput] = useState('')
  const [startLorem, setStartLorem] = useState(true)
  const [copied, setCopied] = useState(false)

  const gen = () => {
    let text = generate(count, type)
    if (startLorem) text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + text
    setOutput(text)
  }

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <SEOHead title="Lorem Ipsum Generator - Placeholder Text Generator" description="Generate lorem ipsum placeholder text. Choose paragraphs, sentences, or words. Free online tool." path="/lorem-ipsum-generator" keywords="lorem ipsum, placeholder text, dummy text generator, lipsum, lorem ipsum generator" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4"><AlignLeft className="w-7 h-7 text-amber-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lorem Ipsum Generator</h1>
          <p className="text-gray-600">Generate placeholder text for your designs and layouts.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Count</label>
              <input type="number" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2.5 border border-gray-300 rounded-lg">
                <option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 cursor-pointer">
                <input type="checkbox" checked={startLorem} onChange={e => setStartLorem(e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-600">Start with "Lorem ipsum"</span>
              </label>
            </div>
          </div>
          <button onClick={gen} className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 transition-colors mb-4">Generate Text</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Generated Text</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-80 overflow-auto">{output}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}