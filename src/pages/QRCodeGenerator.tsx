import { useState, useEffect } from 'react'
import { QrCode, Download } from 'lucide-react'
import QRCode from 'qrcode'
import SEOHead from '../components/SEOHead'

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [dataUrl, setDataUrl] = useState('')
  

  useEffect(() => {
    if (!text.trim()) { setDataUrl(''); return }
    QRCode.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [text, size])

  const download = (format: 'png' | 'svg') => {
    if (format === 'png' && dataUrl) {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'qrcode.png'
      a.click()
    } else if (format === 'svg') {
      QRCode.toString(text, { type: 'svg', margin: 2 }).then(svg => {
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'qrcode.svg'
        a.click()
        URL.revokeObjectURL(url)
      })
    }
  }

  return (
    <>
      <SEOHead title="QR Code Generator" description="Generate QR codes for URLs, text, and more. Download as PNG or SVG. Free online QR code maker." path="/qr-code-generator" keywords="qr code generator, qr code maker, create qr code, free qr code" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><QrCode className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Create QR codes for URLs, text, and more</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter URL or text..." value={text} onChange={e => setText(e.target.value)} />
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Size</span>
              <span className="text-blue-600 font-medium">{size}px</span>
            </div>
            <input type="range" min={128} max={512} step={32} value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-blue-600" />
          </div>

          {dataUrl && (
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                <img src={dataUrl} alt="QR Code" width={size} height={size} className="mx-auto" />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => download('png')} disabled={!dataUrl} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="w-4 h-4" /> PNG
            </button>
            <button onClick={() => download('svg')} disabled={!text.trim()} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="w-4 h-4" /> SVG
            </button>
          </div>
        </div>
      </div>
    </>
  )
}