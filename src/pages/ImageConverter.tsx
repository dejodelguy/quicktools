import { useState, useRef } from 'react'
import { RefreshCw, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageConverter() {
  const [src, setSrc] = useState('')
  const [result, setResult] = useState('')
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formats = [
    { label: 'PNG', value: 'image/png' as const, ext: 'png' },
    { label: 'JPG', value: 'image/jpeg' as const, ext: 'jpg' },
    { label: 'WebP', value: 'image/webp' as const, ext: 'webp' },
  ]

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setSrc(ev.target?.result as string); setResult('') }
    reader.readAsDataURL(file)
  }

  const convert = () => {
    if (!src || !canvasRef.current) return
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      setResult(canvas.toDataURL(format, 0.92))
    }
    img.src = src
  }

  const download = () => {
    if (!result) return
    const ext = formats.find(f => f.value === format)?.ext || 'png'
    const a = document.createElement('a')
    a.href = result
    a.download = `converted.${ext}`
    a.click()
  }

  return (
    <>
      <SEOHead title="Image Format Converter - Convert PNG, JPG, WebP Online" description="Convert images between PNG, JPG, and WebP formats online. Free, fast, no signup." path="/image-converter" keywords="image converter, png to jpg, jpg to png, webp converter, image format converter" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4"><RefreshCw className="w-7 h-7 text-cyan-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Format Converter</h1>
          <p className="text-gray-600">Convert images between PNG, JPG, and WebP formats instantly.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image to convert</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div className="flex gap-2 mb-4">
                {formats.map(f => (
                  <button key={f.value} onClick={() => setFormat(f.value)} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${format === f.value ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{f.label}</button>
                ))}
              </div>
              <div className="flex gap-3 mb-4">
                <button onClick={convert} className="flex-1 bg-cyan-600 text-white py-2.5 rounded-lg font-medium hover:bg-cyan-700 transition-colors">Convert</button>
                {result && <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download</button>}
              </div>
              {result && <div className="border border-gray-200 rounded-lg overflow-hidden"><img src={result} alt="Converted" className="max-h-80 mx-auto" /></div>}
              <button onClick={() => { setSrc(''); setResult('') }} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}