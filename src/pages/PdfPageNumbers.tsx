import { useState } from 'react'
import { Hash, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

type Position =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

const POSITION_OPTIONS: { value: Position; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
]

const MARGIN = 40 // points from edge

export default function PdfPageNumbers() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [position, setPosition] = useState<Position>('bottom-center')
  const [fontSize, setFontSize] = useState(12)
  const [startNumber, setStartNumber] = useState(1)
  const [prefix, setPrefix] = useState('Page ')
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

  const addPageNumbers = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const pdf = await PDFDocument.load(file.data)
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const pages = pdf.getPages()

      pages.forEach((page, i) => {
        const { width, height } = page.getSize()
        const text = `${prefix}${startNumber + i}`
        const textWidth = font.widthOfTextAtSize(text, fontSize)

        let x: number
        let y: number

        if (position.startsWith('top')) {
          y = height - MARGIN
        } else {
          y = MARGIN
        }

        if (position.endsWith('left')) {
          x = MARGIN
        } else if (position.endsWith('center')) {
          x = (width - textWidth) / 2
        } else {
          x = width - MARGIN - textWidth
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        })
      })

      const bytes = await pdf.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '') + '_numbered.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error adding page numbers. Make sure the file is a valid PDF.')
    }
    setProcessing(false)
  }

  return (
    <>
      <SEOHead
        title="Add Page Numbers to PDF - Free Online PDF Page Numbering Tool"
        description="Add page numbers to every page of your PDF. Choose position, font size, start number, and prefix. Free online tool."
        path="/pdf-page-numbers"
        keywords="add page numbers to pdf, pdf page numbering, number pdf pages, pdf page numbers, insert page numbers pdf"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Hash className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Page Numbers to PDF</h1>
          <p className="text-gray-600">Insert page numbers on every page of your PDF document.</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value as Position)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {POSITION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (8–24)</label>
                  <input
                    type="number"
                    min={8}
                    max={24}
                    value={fontSize}
                    onChange={e => setFontSize(Math.min(24, Math.max(8, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Number</label>
                  <input
                    type="number"
                    min={0}
                    value={startNumber}
                    onChange={e => setStartNumber(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  placeholder="e.g. Page "
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: <span className="font-mono">{prefix}{startNumber}</span>, <span className="font-mono">{prefix}{startNumber + 1}</span>, ...
                </p>
              </div>
            </div>
          )}

          <button
            onClick={addPageNumbers}
            disabled={!file || processing}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {processing ? 'Adding Page Numbers...' : 'Add Page Numbers & Download'}
          </button>
        </div>
        <AdPlaceholder size="leaderboard" />
      </div>
    </>
  )
}
