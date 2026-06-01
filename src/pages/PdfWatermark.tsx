import { useState } from 'react'
import { Stamp, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

export default function PdfWatermark() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [text, setText] = useState('CONFIDENTIAL')
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(30)
  const [rotation, setRotation] = useState(315)
  const [color, setColor] = useState('#999999')
  const [processing, setProcessing] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const data = await f.arrayBuffer()
    setFile({ name: f.name, data })
    const { PDFDocument } = await import('pdf-lib')
    const pdf = await PDFDocument.load(data)
    setPageCount(pdf.getPageCount())
  }

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return { r, g, b }
  }

  const addWatermark = async () => {
    if (!file || !text) return
    setProcessing(true)
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib')
      const pdf = await PDFDocument.load(file.data)
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      const pages = pdf.getPages()
      const { r, g, b } = hexToRgb(color)
      const alpha = opacity / 100

      pages.forEach(page => {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        const x = (width - textWidth) / 2
        const y = height / 2 - fontSize / 3

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: alpha,
          rotate: degrees(rotation),
        })
      })

      const bytes = await pdf.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '') + '_watermarked.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error adding watermark. Make sure the file is a valid PDF.')
    }
    setProcessing(false)
  }

  return (
    <>
      <SEOHead
        title="Add Watermark to PDF - Free Online PDF Watermark Tool"
        description="Add a text watermark to every page of your PDF. Customize font size, opacity, rotation angle, and color. Free online tool."
        path="/pdf-watermark"
        keywords="add watermark to pdf, pdf watermark, stamp pdf, confidential watermark, pdf text overlay"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Stamp className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Watermark to PDF</h1>
          <p className="text-gray-600">Stamp a text watermark diagonally across every page of your PDF.</p>
        </div>
        <AdPlaceholder size="leaderboard" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">{file ? file.name : 'Click to upload a PDF'}</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFile} />
          </label>

          {file && pageCount > 0 && (
            <div className="space-y-4 mb-4">
              <p className="text-sm text-gray-500">
                Total pages: <span className="font-semibold text-gray-700">{pageCount}</span>
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (24–72)</label>
                  <input
                    type="number"
                    min={24}
                    max={72}
                    value={fontSize}
                    onChange={e => setFontSize(Math.min(72, Math.max(24, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opacity ({opacity}%)</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={opacity}
                    onChange={e => setOpacity(Number(e.target.value))}
                    className="w-full mt-2 accent-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rotation (0–360°)</label>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={rotation}
                    onChange={e => setRotation(Math.min(360, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{color}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={addWatermark}
            disabled={!file || !text || processing}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {processing ? 'Adding Watermark...' : 'Add Watermark & Download'}
          </button>
        </div>
        <AdPlaceholder size="leaderboard" />
      </div>
    </>
  )
}
