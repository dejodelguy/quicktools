import { useState } from 'react'
import { Landmark } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function LoanCalculator() {
  const [amount, setAmount] = useState('200000')
  const [rate, setRate] = useState('5.5')
  const [years, setYears] = useState('30')

  const principal = parseFloat(amount) || 0
  const annualRate = parseFloat(rate) || 0
  const months = (parseInt(years) || 0) * 12
  const monthlyRate = annualRate / 100 / 12

  const monthlyPayment = monthlyRate > 0 && months > 0
    ? principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : 0
  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - principal

  const fmt = (n: number) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <>
      <SEOHead title="Loan Calculator - Calculate Monthly Payments" description="Calculate loan monthly payments, total interest, and amortization schedule. Free online loan calculator." path="/loan-calculator" keywords="loan calculator, mortgage calculator, monthly payment calculator, interest calculator, loan amortization" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Landmark className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
          <p className="text-gray-600">Calculate monthly payments for any loan or mortgage.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Loan Amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Loan Term (years)</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {monthlyPayment > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-sm text-blue-600 mb-1">Monthly Payment</div>
                <div className="text-2xl font-bold text-blue-800">{fmt(monthlyPayment)}</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-sm text-green-600 mb-1">Total Payment</div>
                <div className="text-2xl font-bold text-green-800">{fmt(totalPayment)}</div>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-xl">
                <div className="text-sm text-red-600 mb-1">Total Interest</div>
                <div className="text-2xl font-bold text-red-800">{fmt(totalInterest)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}