import { useState, useRef } from 'react'
import { Scaling, Upload, Download, Lock, Unlock } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageResizer() {
  const [src, setSrc] = useState('')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockRatio, setLockRatio] = useState(true)
  const [ratio, setRatio] = useState(1)
  const [result, setResult] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setSrc(url)
      const img = new window.Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setRatio(img.width / img.height)
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const handleWidth = (v: number) => {
    setWidth(v)
    if (lockRatio) setHeight(Math.round(v / ratio))
  }

  const handleHeight = (v: number) => {
    setHeight(v)
    if (lockRatio) setWidth(Math.round(v * ratio))
  }

  const resize = () => {
    if (!src || !canvasRef.current) return
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      setResult(canvas.toDataURL('image/png'))
    }
    img.src = src
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'resized.png'
    a.click()
  }

  return (
    <>
      <SEOHead title="Image Resizer - Resize Photos Online Free" description="Resize images online for free. Change dimensions of PNG, JPG, WebP images. Maintain aspect ratio. No signup required." path="/image-resizer" keywords="image resizer, resize photo, resize image online, change image dimensions, image scaler" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Scaling className="w-7 h-7 text-purple-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Resizer</h1>
          <p className="text-gray-600">Resize images to exact dimensions. Maintains aspect ratio by default.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image to resize</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4 items-end">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Width (px)</label>
                  <input type="number" value={width} onChange={e => handleWidth(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex justify-center">
                  <button onClick={() => setLockRatio(!lockRatio)} className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                    {lockRatio ? <Lock className="w-5 h-5 text-blue-600" /> : <Unlock className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Height (px)</label>
                  <input type="number" value={height} onChange={e => handleHeight(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <button onClick={resize} className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">Resize Image</button>
                {result && <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download</button>}
              </div>
              {result && <div className="border border-gray-200 rounded-lg overflow-hidden"><img src={result} alt="Resized" className="max-h-80 mx-auto" /></div>}
              <button onClick={() => { setSrc(''); setResult('') }} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}