import { useState } from 'react'
import { Calculator } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'percent-of' | 'is-what-percent' | 'change'>('percent-of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const calc = () => {
    const na = parseFloat(a), nb = parseFloat(b)
    if (isNaN(na) || isNaN(nb)) { setResult(null); return }
    switch (mode) {
      case 'percent-of': setResult(`${na}% of ${nb} = ${((na / 100) * nb).toFixed(4).replace(/\.?0+$/, '')}`); break
      case 'is-what-percent': setResult(nb === 0 ? 'Cannot divide by zero' : `${na} is ${((na / nb) * 100).toFixed(4).replace(/\.?0+$/, '')}% of ${nb}`); break
      case 'change': setResult(na === 0 ? 'Cannot divide by zero' : `Change from ${na} to ${nb}: ${(((nb - na) / na) * 100).toFixed(4).replace(/\.?0+$/, '')}%`); break
    }
  }

  const labels: Record<typeof mode, [string, string]> = {
    'percent-of': ['Percentage (%)', 'Number'],
    'is-what-percent': ['Part', 'Whole'],
    'change': ['Original Value', 'New Value'],
  }

  return (
    <>
      <SEOHead title="Percentage Calculator" description="Calculate percentages, percentage change, and ratios. Free online percentage calculator with multiple modes." path="/percentage-calculator" keywords="percentage calculator, percent calculator, percentage change, what percent of" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Calculator className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Percentage Calculator</h1>
          <p className="text-gray-600">Calculate percentages, ratios, and percentage change</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {([['percent-of', 'X% of Y'], ['is-what-percent', 'X is ?% of Y'], ['change', '% Change']] as const).map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setResult(null) }} className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${mode === m ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>{label}</button>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels[mode][0]}</label>
              <input type="number" value={a} onChange={e => setA(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels[mode][1]}</label>
              <input type="number" value={b} onChange={e => setB(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
            </div>
          </div>

          <button onClick={calc} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg">Calculate</button>

          {result && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <span className="text-xl font-bold text-blue-700">{result}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}