import { useState, useRef, useCallback, useEffect } from 'react'
import { Crop, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageCropper() {
  const [src, setSrc] = useState('')
  const [result, setResult] = useState('')
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 300, h: 300 })
  const [dragging, setDragging] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startCrop, setStartCrop] = useState(crop)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
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
        const maxW = 600
        const scale = img.width > maxW ? maxW / img.width : 1
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        setImgSize({ w, h })
        setCrop({ x: Math.round(w * 0.1), y: Math.round(h * 0.1), w: Math.round(w * 0.8), h: Math.round(h * 0.8) })
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    setDragging(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartCrop({ ...crop })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - startPos.x
    const dy = e.clientY - startPos.y
    const sc = startCrop
    if (dragging === 'move') {
      setCrop({ ...sc, x: Math.max(0, Math.min(sc.x + dx, imgSize.w - sc.w)), y: Math.max(0, Math.min(sc.y + dy, imgSize.h - sc.h)) })
    } else if (dragging === 'se') {
      setCrop({ ...sc, w: Math.max(50, Math.min(sc.w + dx, imgSize.w - sc.x)), h: Math.max(50, Math.min(sc.h + dy, imgSize.h - sc.y)) })
    } else if (dragging === 'nw') {
      const nw = Math.max(50, sc.w - dx)
      const nh = Math.max(50, sc.h - dy)
      setCrop({ x: sc.x + sc.w - nw, y: sc.y + sc.h - nh, w: nw, h: nh })
    }
  }, [dragging, startPos, startCrop, imgSize])

  const handleMouseUp = useCallback(() => setDragging(null), [])

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp) }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const doCrop = () => {
    if (!src || !canvasRef.current) return
    const img = new window.Image()
    img.onload = () => {
      const scaleX = img.width / imgSize.w
      const scaleY = img.height / imgSize.h
      const canvas = canvasRef.current!
      canvas.width = Math.round(crop.w * scaleX)
      canvas.height = Math.round(crop.h * scaleY)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, Math.round(crop.x * scaleX), Math.round(crop.y * scaleY), canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
      setResult(canvas.toDataURL('image/png'))
    }
    img.src = src
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'cropped.png'
    a.click()
  }

  return (
    <>
      <SEOHead title="Image Cropper - Crop Photos Online Free" description="Crop images online for free. Select custom area and download cropped image. Works with PNG, JPG, WebP." path="/image-cropper" keywords="image cropper, crop photo, crop image online, image crop tool" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Crop className="w-7 h-7 text-orange-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Cropper</h1>
          <p className="text-gray-600">Crop images to your desired area. Drag handles to adjust selection.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload an image to crop</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div ref={containerRef} className="relative inline-block mb-4 border border-gray-200 rounded-lg overflow-hidden select-none" style={{ width: imgSize.w, height: imgSize.h }}>
                <img src={src} alt="Source" style={{ width: imgSize.w, height: imgSize.h }} draggable={false} />
                <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x}px ${crop.y}px, ${crop.x}px ${crop.y + crop.h}px, ${crop.x + crop.w}px ${crop.y + crop.h}px, ${crop.x + crop.w}px ${crop.y}px, ${crop.x}px ${crop.y}px)` }} />
                <div className="absolute border-2 border-white cursor-move" style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }} onMouseDown={e => handleMouseDown(e, 'move')} />
                <div className="absolute w-3 h-3 bg-white border border-gray-400 cursor-nw-resize" style={{ left: crop.x - 6, top: crop.y - 6 }} onMouseDown={e => handleMouseDown(e, 'nw')} />
                <div className="absolute w-3 h-3 bg-white border border-gray-400 cursor-se-resize" style={{ left: crop.x + crop.w - 6, top: crop.y + crop.h - 6 }} onMouseDown={e => handleMouseDown(e, 'se')} />
              </div>
              <div className="flex gap-3 mb-4">
                <button onClick={doCrop} className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors">Crop Image</button>
                {result && <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download</button>}
              </div>
              {result && <div className="border border-gray-200 rounded-lg overflow-hidden"><img src={result} alt="Cropped" className="max-h-60 mx-auto" /></div>}
              <button onClick={() => { setSrc(''); setResult('') }} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}