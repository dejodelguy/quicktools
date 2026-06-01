import { useState, useRef, useCallback } from 'react'
import { RotateCw, Upload, Download, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

export default function RotateImage() {
  const [src, setSrc] = useState('')
  const [result, setResult] = useState('')
  const [angle, setAngle] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png')
  const [quality, setQuality] = useState(92)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setSrc(url)
      setResult('')
      setAngle(0)
      setFlipH(false)
      setFlipV(false)
      const img = new window.Image()
      img.onload = () => { imgRef.current = img }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const applyTransform = useCallback(() => {
    if (!src || !canvasRef.current || !imgRef.current) return
    const img = imgRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const rad = (angle * Math.PI) / 180

    // Calculate bounding box for rotated image
    const cos = Math.abs(Math.cos(rad))
    const sin = Math.abs(Math.sin(rad))
    const newW = Math.ceil(img.width * cos + img.height * sin)
    const newH = Math.ceil(img.width * sin + img.height * cos)

    canvas.width = newW
    canvas.height = newH

    ctx.clearRect(0, 0, newW, newH)
    ctx.save()
    ctx.translate(newW / 2, newH / 2)
    ctx.rotate(rad)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    ctx.restore()

    const mime = format
    const q = format === 'image/jpeg' ? quality / 100 : undefined
    setResult(canvas.toDataURL(mime, q))
  }, [src, angle, flipH, flipV, format, quality])

  const rotate90CW = () => setAngle(prev => (prev + 90) % 360)
  const rotate90CCW = () => setAngle(prev => (prev - 90 + 360) % 360)
  const rotate180 = () => setAngle(prev => (prev + 180) % 360)

  const download = () => {
    if (!result) return
    const ext = format === 'image/jpeg' ? 'jpg' : 'png'
    const a = document.createElement('a')
    a.href = result
    a.download = `rotated.${ext}`
    a.click()
  }

  const reset = () => {
    setSrc('')
    setResult('')
    setAngle(0)
    setFlipH(false)
    setFlipV(false)
    imgRef.current = null
  }

  return (
    <>
      <SEOHead
        title="Rotate Image - Flip & Rotate Photos Online Free"
        description="Rotate and flip images online for free. Rotate 90°, 180°, or any custom angle. Flip horizontal or vertical. Export as PNG or JPG. No signup required."
        path="/rotate-image"
        keywords="rotate image, flip image, rotate photo online, image rotation tool, flip photo"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <RotateCw className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rotate Image</h1>
          <p className="text-gray-600">Rotate and flip images with precision. Supports any angle and both axes.</p>
        </div>

        <AdPlaceholder />

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image to rotate</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div className="space-y-5">
              {/* Preview of source image */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img src={result || src} alt="Preview" className="max-h-80 mx-auto" />
              </div>

              {/* Quick rotation buttons */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Quick Rotate</label>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={rotate90CCW} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <RotateCcw className="w-4 h-4" /> 90° CCW
                  </button>
                  <button onClick={rotate180} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    180°
                  </button>
                  <button onClick={rotate90CW} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <RotateCw className="w-4 h-4" /> 90° CW
                  </button>
                  <button onClick={() => setFlipH(!flipH)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm font-medium ${flipH ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <FlipHorizontal className="w-4 h-4" /> Flip H
                  </button>
                  <button onClick={() => setFlipV(!flipV)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm font-medium ${flipV ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <FlipVertical className="w-4 h-4" /> Flip V
                  </button>
                </div>
              </div>

              {/* Custom angle slider */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Custom Angle: {angle}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>

              {/* Export settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Format</label>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value as 'image/png' | 'image/jpeg')}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                  </select>
                </div>
                {format === 'image/jpeg' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Quality: {quality}%</label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={e => setQuality(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button onClick={applyTransform} className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Apply Transform
                </button>
                {result && (
                  <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>

              <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700">
                Choose different image
              </button>
            </div>
          )}
        </div>

        <AdPlaceholder />
      </div>
    </>
  )
}
