import { useState, useRef } from 'react'
import { Image, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageCompressor() {
  const [original, setOriginal] = useState<string | null>(null)
  const [compressed, setCompressed] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(80)
  const [processing, setProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setOriginal(ev.target?.result as string)
      setCompressed(null)
      setCompressedSize(0)
    }
    reader.readAsDataURL(file)
  }

  const compress = () => {
    if (!original || !canvasRef.current) return
    setProcessing(true)
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100)
      setCompressed(dataUrl)
      setCompressedSize(Math.round(dataUrl.length * 0.75))
      setProcessing(false)
    }
    img.src = original
  }

  const download = () => {
    if (!compressed) return
    const a = document.createElement('a')
    a.href = compressed
    a.download = 'compressed.jpg'
    a.click()
  }

  const savings = originalSize > 0 && compressedSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0

  return (
    <>
      <SEOHead title="Image Compressor - Compress PNG, JPG, WebP Online Free" description="Compress images online without losing quality. Reduce file size of PNG, JPG, and WebP images. Free, fast, no signup." path="/image-compressor" keywords="image compressor, compress image, reduce image size, compress png, compress jpg, image optimizer" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Image className="w-7 h-7 text-green-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Compressor</h1>
          <p className="text-gray-600">Reduce image file size without losing quality. Supports PNG, JPG, and WebP.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!original ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Click or drag image here</span>
              <span className="text-sm text-gray-400 mt-1">Supports PNG, JPG, WebP</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Original</div>
                  <div className="font-bold text-gray-900">{(originalSize / 1024).toFixed(0)} KB</div>
                </div>
                {compressedSize > 0 && (
                  <>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="flex-1 text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600">Compressed</div>
                      <div className="font-bold text-green-700">{(compressedSize / 1024).toFixed(0)} KB</div>
                    </div>
                    <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600">Saved</div>
                      <div className="font-bold text-blue-700">{savings}%</div>
                    </div>
                  </>
                )}
              </div>
              <div className="mb-4">
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Quality</span>
                  <span className="text-sm text-gray-500">{quality}%</span>
                </label>
                <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-3 mb-4">
                <button onClick={compress} disabled={processing} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {processing ? 'Compressing...' : 'Compress Image'}
                </button>
                {compressed && (
                  <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
              <button onClick={() => { setOriginal(null); setCompressed(null) }} className="text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}