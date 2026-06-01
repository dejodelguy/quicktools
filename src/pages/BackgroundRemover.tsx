import { useState, useRef } from 'react'
import { Eraser, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function BackgroundRemover() {
  const [src, setSrc] = useState('')
  const [result, setResult] = useState('')
  const [tolerance, setTolerance] = useState(30)
  const [processing, setProcessing] = useState(false)
  const [clickColor, setClickColor] = useState<[number, number, number] | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setSrc(ev.target?.result as string); setResult(''); setClickColor(null) }
    reader.readAsDataURL(file)
  }

  const pickBg = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
    const [r, g, b] = canvas.getContext('2d')!.getImageData(Math.round(x), Math.round(y), 1, 1).data
    setClickColor([r, g, b])
  }

  const removeBg = () => {
    if (!canvasRef.current || !clickColor) return
    setProcessing(true)
    setTimeout(() => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const [tr, tg, tb] = clickColor
      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - tr
        const dg = data[i + 1] - tg
        const db = data[i + 2] - tb
        const dist = Math.sqrt(dr * dr + dg * dg + db * db)
        if (dist < tolerance * 4.4) {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
      setResult(canvas.toDataURL('image/png'))
      setProcessing(false)
    }, 50)
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'no-bg.png'
    a.click()
  }

  return (
    <>
      <SEOHead title="Background Remover - Remove Image Background Free" description="Remove image backgrounds online for free. Click to select background color and remove it. Download as PNG with transparency." path="/background-remover" keywords="background remover, remove background, transparent background, bg remover, erase background" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Eraser className="w-7 h-7 text-red-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Background Remover</h1>
          <p className="text-gray-600">Remove solid-color backgrounds from images. Click to select the color to remove.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div className="mb-4">
                <canvas ref={el => {
                  if (el && src) {
                    const img = new window.Image()
                    img.onload = () => {
                      const maxW = 600
                      const scale = img.width > maxW ? maxW / img.width : 1
                      el.width = Math.round(img.width * scale)
                      el.height = Math.round(img.height * scale)
                      el.getContext('2d')!.drawImage(img, 0, 0, el.width, el.height)
                    }
                    img.src = src
                  }
                }} onClick={pickBg} className="w-full cursor-crosshair rounded-lg border border-gray-200" style={{ display: 'block' }} />
              </div>
              {clickColor && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: `rgb(${clickColor.join(',')})` }} />
                  <span className="text-sm text-gray-600">Selected: rgb({clickColor.join(', ')})</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Tolerance: {tolerance}</label>
                    <input type="range" min="5" max="100" value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={removeBg} disabled={!clickColor || processing} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">{processing ? 'Processing...' : 'Remove Background'}</button>
                {result && <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download PNG</button>}
              </div>
              {result && <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden" style={{ backgroundImage: 'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 20px 20px' }}><img src={result} alt="Result" className="max-h-80 mx-auto" /></div>}
              <button onClick={() => { setSrc(''); setResult(''); setClickColor(null) }} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}