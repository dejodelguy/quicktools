import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function AgeCalculator() {
  const [birth, setBirth] = useState('')

  const calc = () => {
    if (!birth) return null
    const b = new Date(birth)
    const now = new Date()
    if (b > now) return null
    let years = now.getFullYear() - b.getFullYear()
    let months = now.getMonth() - b.getMonth()
    let days = now.getDate() - b.getDate()
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const totalDays = Math.floor((now.getTime() - b.getTime()) / 86400000)
    const nextBirthday = new Date(now.getFullYear(), b.getMonth(), b.getDate())
    if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    const daysToNext = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000)
    return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7), totalMonths: years * 12 + months, daysToNext }
  }

  const result = calc()

  return (
    <>
      <SEOHead title="Age Calculator - Calculate Your Exact Age" description="Calculate your exact age in years, months, days, weeks, and more. Free online age calculator." path="/age-calculator" keywords="age calculator, how old am i, age from date of birth, birthday calculator" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4"><CalendarDays className="w-7 h-7 text-amber-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Calculator</h1>
          <p className="text-gray-600">Calculate your exact age from date of birth.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-1">Date of Birth</label>
            <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" />
          </div>
          {result && (
            <div>
              <div className="text-center p-6 bg-amber-50 rounded-xl mb-4">
                <div className="text-5xl font-bold text-amber-800">{result.years}</div>
                <div className="text-amber-600 font-medium">years, {result.months} months, {result.days} days</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Months', val: result.totalMonths },
                  { label: 'Total Weeks', val: result.totalWeeks },
                  { label: 'Total Days', val: result.totalDays },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{val.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                🎂 Next birthday in <strong>{result.daysToNext}</strong> days
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}