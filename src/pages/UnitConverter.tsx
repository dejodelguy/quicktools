import { useState } from 'react'
import { Ruler, ArrowLeftRight } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const categories: Record<string, { label: string; units: Record<string, number> }> = {
  length: { label: 'Length', units: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 } },
  weight: { label: 'Weight', units: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 } },
  temperature: { label: 'Temperature', units: {} },
  volume: { label: 'Volume', units: { Liter: 1, Milliliter: 0.001, Gallon: 3.78541, Quart: 0.946353, Cup: 0.236588, 'Fluid Ounce': 0.0295735, Tablespoon: 0.0147868 } },
  area: { label: 'Area', units: { 'Square Meter': 1, 'Square Kilometer': 1000000, 'Square Foot': 0.092903, 'Square Inch': 0.00064516, 'Square Mile': 2589988.11, Acre: 4046.86, Hectare: 10000 } },
  speed: { label: 'Speed', units: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, Knot: 0.514444 } },
}

export default function UnitConverter() {
  const [cat, setCat] = useState('length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Foot')
  const [value, setValue] = useState('')

  const units = Object.keys(categories[cat].units)

  const convert = (): string => {
    const v = parseFloat(value)
    if (isNaN(v)) return ''
    if (cat === 'temperature') return convertTemp(v, fromUnit, toUnit)
    const base = v * categories[cat].units[fromUnit]
    return (base / categories[cat].units[toUnit]).toFixed(6).replace(/\.?0+$/, '')
  }

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit) }

  const changeCat = (c: string) => {
    setCat(c)
    const u = Object.keys(categories[c].units)
    if (u.length >= 2) { setFromUnit(u[0]); setToUnit(u[1]) }
  }

  return (
    <>
      <SEOHead title="Unit Converter - Convert Units Online Free" description="Convert between units of length, weight, volume, area, speed and temperature. Free online unit converter." path="/unit-converter" keywords="unit converter, measurement converter, length converter, weight converter, convert units online" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Ruler className="w-7 h-7 text-orange-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Converter</h1>
          <p className="text-gray-600">Convert between any units of measurement.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(categories).map(([key, { label }]) => (
              <button key={key} onClick={() => changeCat(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${cat === key ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{label}</button>
            ))}
          </div>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">From</label>
              <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm mb-2">{units.map(u => <option key={u}>{u}</option>)}</select>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="Enter value" />
            </div>
            <button onClick={swap} className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 mb-1"><ArrowLeftRight className="w-5 h-5 text-gray-600" /></button>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
              <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm mb-2">{units.map(u => <option key={u}>{u}</option>)}</select>
              <div className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg font-bold text-orange-700 min-h-[42px]">{convert() || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function convertTemp(v: number, from: string, to: string): string {
  let celsius: number
  if (from === 'Celsius') celsius = v
  else if (from === 'Fahrenheit') celsius = (v - 32) * 5 / 9
  else celsius = v - 273.15
  let result: number
  if (to === 'Celsius') result = celsius
  else if (to === 'Fahrenheit') result = celsius * 9 / 5 + 32
  else result = celsius + 273.15
  return result.toFixed(2)
}