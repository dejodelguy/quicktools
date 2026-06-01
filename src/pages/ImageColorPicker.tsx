import { useState, useRef } from 'react'
import { Pipette, Upload, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageColorPicker() {
  const [src, setSrc] = useState('')
  const [colors, setColors] = useState<string[]>([])
  const [copied, setCopied] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setSrc(ev.target?.result as string)
      setColors([])
    }
    reader.readAsDataURL(file)
  }

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
    const ctx = canvas.getContext('2d')!
    const [r, g, b] = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    if (!colors.includes(hex)) setColors(prev => [hex, ...prev].slice(0, 12))
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <>
      <SEOHead title="Image Color Picker - Extract Colors from Photos" description="Pick colors from any image. Click on pixels to get hex, RGB values. Free online color picker tool." path="/image-color-picker" keywords="image color picker, color picker from image, extract colors, photo color picker, eyedropper tool" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Pipette className="w-7 h-7 text-indigo-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Color Picker</h1>
          <p className="text-gray-600">Click anywhere on an image to pick its color.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image to pick colors</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <canvas ref={el => {
                if (el && src) {
                  const img = new window.Image()
                  img.onload = () => {
                    el.width = img.width
                    el.height = img.height
                    el.getContext('2d')!.drawImage(img, 0, 0)
                  }
                  img.src = src
                }
              }} onClick={pickColor} className="w-full max-h-96 object-contain cursor-crosshair rounded-lg border border-gray-200" style={{ display: 'block' }} />
              {colors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Picked Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(hex => (
                      <button key={hex} onClick={() => copyColor(hex)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: hex }} />
                        <span className="font-mono text-sm">{hex}</span>
                        {copied === hex ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setSrc(''); setColors([]) }} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}