import { useState, useRef } from 'react'
import { Smile, Upload, Download, Type } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function MemeGenerator() {
  const [src, setSrc] = useState('')
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [fontSize, setFontSize] = useState(36)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setSrc(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const generate = () => {
    if (!src || !canvasRef.current) return
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3
      ctx.textAlign = 'center'
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize + 10)
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize + 10)
      }
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 15)
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 15)
      }
    }
    img.src = src
  }

  const download = () => {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = 'meme.png'
    a.click()
  }

  return (
    <>
      <SEOHead title="Meme Generator - Create Memes Online Free" description="Create custom memes online. Upload an image, add top and bottom text, download. Free meme maker." path="/meme-generator" keywords="meme generator, meme maker, create meme, meme creator, funny meme generator" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Smile className="w-7 h-7 text-yellow-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meme Generator</h1>
          <p className="text-gray-600">Create custom memes with your own images.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!src ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-yellow-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Upload a template image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Top Text</label>
                  <input type="text" value={topText} onChange={e => setTopText(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="TOP TEXT" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Bottom Text</label>
                  <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="BOTTOM TEXT" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">Font Size: {fontSize}px</label>
                <input type="range" min="16" max="72" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-3 mb-4">
                <button onClick={generate} className="flex-1 bg-yellow-600 text-white py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"><Type className="w-4 h-4" /> Generate Meme</button>
                <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download</button>
              </div>
              <button onClick={() => { setSrc(''); setTopText(''); setBottomText('') }} className="text-sm text-gray-500 hover:text-gray-700">Choose different image</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}