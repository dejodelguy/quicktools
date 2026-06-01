import { useState } from 'react'
import { Heart } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  const calcBmi = (): { bmi: number; category: string; color: string } | null => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    if (!w || !h) return null
    let bmi: number
    if (unit === 'metric') bmi = w / ((h / 100) ** 2)
    else bmi = (w / (h ** 2)) * 703
    let category: string, color: string
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600' }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-600' }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-600' }
    else { category = 'Obese'; color = 'text-red-600' }
    return { bmi: Math.round(bmi * 10) / 10, category, color }
  }

  const result = calcBmi()

  return (
    <>
      <SEOHead title="BMI Calculator - Calculate Body Mass Index" description="Calculate your Body Mass Index (BMI) online. Supports metric and imperial units. Free, instant results." path="/bmi-calculator" keywords="bmi calculator, body mass index, bmi chart, weight calculator, health calculator" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Heart className="w-7 h-7 text-pink-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI Calculator</h1>
          <p className="text-gray-600">Calculate your Body Mass Index instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-md text-sm font-medium ${unit === 'metric' ? 'bg-white shadow text-pink-600' : 'text-gray-600'}`}>Metric (kg/cm)</button>
            <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-md text-sm font-medium ${unit === 'imperial' ? 'bg-white shadow text-pink-600' : 'text-gray-600'}`}>Imperial (lbs/in)</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder={unit === 'metric' ? '70' : '154'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder={unit === 'metric' ? '175' : '69'} />
            </div>
          </div>
          {result && (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="text-5xl font-bold mb-2">{result.bmi}</div>
              <div className={`text-xl font-medium ${result.color}`}>{result.category}</div>
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <span className="text-blue-600">{'<'}18.5 Underweight</span>
                <span className="text-green-600">18.5-24.9 Normal</span>
                <span className="text-yellow-600">25-29.9 Overweight</span>
                <span className="text-red-600">30+ Obese</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}