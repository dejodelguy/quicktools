import { useState } from 'react'
import { FileOutput, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

function parsePageRanges(input: string, maxPage: number): number[] {
  const pages: number[] = []
  const parts = input.split(',').map(s => s.trim()).filter(Boolean)
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > maxPage) continue
      for (let i = start; i <= end; i++) pages.push(i)
    } else {
      const num = parseInt(part, 10)
      if (!isNaN(num) && num >= 1 && num <= maxPage) pages.push(num)
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b)
}

export default function PdfPageExtractor() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageInput, setPageInput] = useState('')
  const [extracting, setExtracting] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const data = await f.arrayBuffer()
    setFile({ name: f.name, data })
    const { PDFDocument } = await import('pdf-lib')
    const pdf = await PDFDocument.load(data)
    setPageCount(pdf.getPageCount())
    setPageInput('')
  }

  const extract = async () => {
    if (!file || !pageInput.trim()) return
    const pages = parsePageRanges(pageInput, pageCount)
    if (pages.length === 0) {
      alert('No valid pages specified. Use format like: 1-3, 5, 8')
      return
    }
    setExtracting(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(file.data)
      const dest = await PDFDocument.create()
      const indices = pages.map(p => p - 1)
      const copied = await dest.copyPages(src, indices)
      copied.forEach(p => dest.addPage(p))
      const bytes = await dest.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '') + '_extracted.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error extracting pages. Make sure the file is a valid PDF.')
    }
    setExtracting(false)
  }

  const selectedPages = pageInput.trim() ? parsePageRanges(pageInput, pageCount) : []

  return (
    <>
      <SEOHead title="Extract PDF Pages - Extract Specific Pages from PDF" description="Extract specific pages from a PDF file. Pick page ranges and download a new PDF with only those pages. Free online tool." path="/pdf-page-extractor" keywords="extract pdf pages, split pdf, pdf page extractor, remove pages from pdf, select pdf pages" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileOutput className="w-7 h-7 text-red-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Extract PDF Pages</h1>
          <p className="text-gray-600">Select specific pages from a PDF and save them as a new file.</p>
        </div>
        <AdPlaceholder size="leaderboard" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">{file ? file.name : 'Click to upload a PDF'}</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFile} />
          </label>

          {file && pageCount > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">Total pages: <span className="font-semibold text-gray-700">{pageCount}</span></p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pages to extract</label>
              <input
                type="text"
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {pageInput.trim() && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPages.length > 0
                    ? `Will extract ${selectedPages.length} page(s): ${selectedPages.join(', ')}`
                    : 'No valid pages matched. Use format: 1-3, 5, 8'}
                </p>
              )}
            </div>
          )}

          <button onClick={extract} disabled={!file || selectedPages.length === 0 || extracting} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> {extracting ? 'Extracting...' : `Extract ${selectedPages.length || ''} Page${selectedPages.length !== 1 ? 's' : ''}`}
          </button>
        </div>
        <AdPlaceholder size="leaderboard" />
      </div>
    </>
  )
}
