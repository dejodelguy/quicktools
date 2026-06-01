import { useState } from 'react'
import { Ruler } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ScreenRuler() {
  const [unit, setUnit] = useState<'px' | 'cm' | 'in'>('px')
  const [dpi, setDpi] = useState(96)

  const pxPerUnit = { px: 1, cm: dpi / 2.54, in: dpi }

  return (
    <>
      <SEOHead title="Screen Ruler - Measure Pixels Online" description="Measure pixels on your screen with this online ruler tool. Supports px, cm, and inches." path="/screen-ruler" keywords="screen ruler, pixel ruler, online ruler, measure pixels, screen measurement tool" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Ruler className="w-7 h-7 text-teal-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Screen Ruler</h1>
          <p className="text-gray-600">Measure pixels, centimeters, and inches on your screen.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['px', 'cm', 'in'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-4 py-2 rounded-md text-sm font-medium ${unit === u ? 'bg-white shadow text-teal-600' : 'text-gray-600'}`}>{u}</button>
              ))}
            </div>
            {unit !== 'px' && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">DPI</label>
                <input type="number" value={dpi} onChange={e => setDpi(Number(e.target.value))} className="w-20 p-1.5 border border-gray-300 rounded text-sm" />
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="relative h-12 bg-gradient-to-r from-teal-50 to-white" style={{ minWidth: '800px' }}>
              {Array.from({ length: 81 }, (_, i) => {
                const isMajor = i % 10 === 0
                const isMid = i % 5 === 0
                return (
                  <div key={i} className="absolute top-0" style={{ left: i * 10 }}>
                    <div className={`w-px ${isMajor ? 'h-8 bg-teal-700' : isMid ? 'h-5 bg-teal-500' : 'h-3 bg-teal-300'}`} />
                    {isMajor && <span className="absolute top-8 text-xs text-teal-700 font-mono -translate-x-1/2">{i}</span>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p><strong>Tip:</strong> Use your browser zoom (Ctrl+0 to reset) for accurate measurements. Each small mark = 1 unit ({unit}).</p>
            {unit !== 'px' && <p className="mt-1">1 {unit} = {pxPerUnit[unit].toFixed(1)} px at {dpi} DPI</p>}
          </div>
        </div>
      </div>
    </>
  )
}