import { useState } from 'react'
import { Receipt } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPercent, setTipPercent] = useState(18)
  const [people, setPeople] = useState(1)

  const billAmount = parseFloat(bill) || 0
  const tipAmount = billAmount * tipPercent / 100
  const total = billAmount + tipAmount
  const perPerson = people > 0 ? total / people : total
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount

  const fmt = (n: number) => '$' + n.toFixed(2)

  return (
    <>
      <SEOHead title="Tip Calculator - Calculate Tips and Split Bills" description="Calculate tips and split bills between any number of people. Free online tip calculator." path="/tip-calculator" keywords="tip calculator, gratuity calculator, bill splitter, split the check, restaurant tip" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-lime-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Receipt className="w-7 h-7 text-lime-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tip Calculator</h1>
          <p className="text-gray-600">Calculate tips and split bills between people.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Bill Amount ($)</label>
            <input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-lg" placeholder="0.00" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Tip: {tipPercent}%</label>
            <div className="flex gap-2">
              {[10, 15, 18, 20, 25].map(t => (
                <button key={t} onClick={() => setTipPercent(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tipPercent === t ? 'bg-lime-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t}%</button>
              ))}
            </div>
            <input type="range" min="0" max="50" value={tipPercent} onChange={e => setTipPercent(Number(e.target.value))} className="w-full mt-2" />
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-1">Split Between</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 bg-gray-100 rounded-lg text-xl font-bold">-</button>
              <span className="text-xl font-bold w-12 text-center">{people}</span>
              <button onClick={() => setPeople(people + 1)} className="w-10 h-10 bg-gray-100 rounded-lg text-xl font-bold">+</button>
              <span className="text-sm text-gray-500 ml-1">people</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-lime-50 rounded-xl">
              <div className="text-sm text-lime-600 mb-1">Tip Amount</div>
              <div className="text-2xl font-bold text-lime-800">{fmt(tipAmount)}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-600 mb-1">Total</div>
              <div className="text-2xl font-bold text-blue-800">{fmt(total)}</div>
            </div>
            {people > 1 && (
              <>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-sm text-purple-600 mb-1">Tip / Person</div>
                  <div className="text-2xl font-bold text-purple-800">{fmt(tipPerPerson)}</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-sm text-amber-600 mb-1">Total / Person</div>
                  <div className="text-2xl font-bold text-amber-800">{fmt(perPerson)}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}