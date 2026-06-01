import { useState } from 'react'
import { DollarSign, ArrowLeftRight } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88,
  CNY: 7.24, INR: 83.12, MXN: 17.15, BRL: 4.97, KRW: 1320, SEK: 10.42, NOK: 10.55,
  DKK: 6.87, NZD: 1.63, SGD: 1.34, HKD: 7.82, TRY: 28.95, ZAR: 18.63, GHS: 12.1,
  NGN: 780, KES: 153, EGP: 30.9, AED: 3.67, SAR: 3.75, THB: 35.2, PHP: 56.2,
  MYR: 4.65, IDR: 15600, VND: 24300, PLN: 4.05, CZK: 22.5, HUF: 355, RON: 4.57,
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')

  const convert = (): string => {
    const v = parseFloat(amount)
    if (isNaN(v)) return ''
    const usd = v / RATES[from]
    return (usd * RATES[to]).toFixed(2)
  }

  const swap = () => { setFrom(to); setTo(from) }

  const codes = Object.keys(RATES).sort()

  return (
    <>
      <SEOHead title="Currency Converter - Convert Currencies Online" description="Convert between 35+ currencies with live-like rates. Free online currency converter." path="/currency-converter" keywords="currency converter, money converter, exchange rate, forex converter, convert currency" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"><DollarSign className="w-7 h-7 text-green-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency Converter</h1>
          <p className="text-gray-600">Convert between 35+ world currencies.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-xl font-bold" />
          </div>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg">{codes.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <button onClick={swap} className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"><ArrowLeftRight className="w-5 h-5 text-gray-600" /></button>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
              <select value={to} onChange={e => setTo(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg">{codes.map(c => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-sm text-green-600 mb-1">{amount} {from} =</div>
            <div className="text-3xl font-bold text-green-800">{convert()} {to}</div>
            <div className="text-xs text-green-500 mt-2">Rate: 1 {from} = {(RATES[to] / RATES[from]).toFixed(4)} {to}</div>
          </div>
        </div>
      </div>
    </>
  )
}