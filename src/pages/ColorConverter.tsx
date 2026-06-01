import { useState, useMemo } from 'react'
import { Palette, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [Math.round(hue2rgb(p, q, h + 1/3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1/3) * 255)]
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#2563eb')
  const [copied, setCopied] = useState('')

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgb ? rgbToHsl(...rgb) : null, [rgb])

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const palettes = useMemo(() => {
    if (!hsl) return { complementary: [], analogous: [], triadic: [] }
    const gen = (offsets: number[]) => offsets.map(o => {
      const [r, g, b] = hslToRgb((hsl[0] + o + 360) % 360, hsl[1], hsl[2])
      return rgbToHex(r, g, b)
    })
    return {
      complementary: gen([0, 180]),
      analogous: gen([0, 30, -30]),
      triadic: gen([0, 120, 240]),
    }
  }, [hsl])

  const formats = rgb && hsl ? [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.join(', ')})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
  ] : []

  return (
    <>
      <SEOHead title="Color Converter — HEX, RGB, HSL" description="Convert colors between HEX, RGB, and HSL formats instantly. Generate complementary, analogous, and triadic color palettes." path="/color-converter" keywords="color converter, hex to rgb, rgb to hsl, color palette generator, color picker" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Palette className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Converter</h1>
          <p className="text-gray-600">Convert between HEX, RGB, and HSL color formats</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-20 h-20 rounded-lg cursor-pointer border-0" />
              <div>
                <label className="text-sm font-medium text-gray-700">HEX</label>
                <input type="text" value={hex} onChange={e => { if (/^#[0-9a-f]{0,6}$/i.test(e.target.value)) setHex(e.target.value) }} className="block mt-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm w-32" />
              </div>
            </div>
            <div className="flex-1 w-full h-20 rounded-lg" style={{ backgroundColor: hex }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {formats.map(({ label, value }) => (
            <button key={label} onClick={() => copy(label, value)} className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 transition-colors">
              <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-900">{value}</span>
                {copied === label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {Object.entries(palettes).map(([name, colors]) => (
            <div key={name} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 capitalize mb-3">{name} Palette</h3>
              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <button key={i} onClick={() => setHex(c)} className="flex-1 group">
                    <div className="h-16 rounded-lg transition-transform group-hover:scale-105" style={{ backgroundColor: c }} />
                    <span className="text-xs font-mono text-gray-500 mt-1 block">{c.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}