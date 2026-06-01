import { useState } from 'react'
import { Scissors, Upload, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

interface SplitResult {
  name: string
  url: string
  pages: string
}

function parseRanges(input: string, maxPage: number): number[][] | null {
  const parts = input.split(',').map(s => s.trim()).filter(Boolean)
  const ranges: number[][] = []
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > maxPage) return null
      const indices: number[] = []
      for (let i = start; i <= end; i++) indices.push(i - 1)
      ranges.push(indices)
    } else {
      const page = parseInt(part, 10)
      if (isNaN(page) || page < 1 || page > maxPage) return null
      ranges.push([page - 1])
    }
  }
  return ranges.length > 0 ? ranges : null
}

export default function SplitPdf() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [ranges, setRanges] = useState('')
  const [splitting, setSplitting] = useState(false)
  const [results, setResults] = useState<SplitResult[]>([])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const data = await f.arrayBuffer()
    const { PDFDocument } = await import('pdf-lib')
    const pdf = await PDFDocument.load(data)
    setFile({ name: f.name, data })
    setPageCount(pdf.getPageCount())
    setResults([])
    setRanges('')
  }

  const split = async () => {
    if (!file || !pageCount) return
    const parsed = parseRanges(ranges, pageCount)
    if (!parsed) {
      alert('Invalid page ranges. Use format like: 1-3, 5, 7-10')
      return
    }
    setSplitting(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const srcPdf = await PDFDocument.load(file.data)
      const newResults: SplitResult[] = []

      for (let i = 0; i < parsed.length; i++) {
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(srcPdf, parsed[i])
        pages.forEach(p => newPdf.addPage(p))
        const bytes = await newPdf.save()
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const label = parsed[i].length === 1
          ? `Page ${parsed[i][0] + 1}`
          : `Pages ${parsed[i][0] + 1}-${parsed[i][parsed[i].length - 1] + 1}`
        newResults.push({ name: `part_${i + 1}.pdf`, url, pages: label })
      }

      setResults(newResults)
    } catch {
      alert('Error splitting PDF. Make sure the file is a valid PDF.')
    }
    setSplitting(false)
  }

  const reset = () => {
    results.forEach(r => URL.revokeObjectURL(r.url))
    setFile(null)
    setPageCount(0)
    setRanges('')
    setResults([])
  }

  return (
    <>
      <SEOHead
        title="Split PDF - Extract Pages from PDF Online Free"
        description="Split PDF files by page ranges. Extract specific pages or ranges from any PDF document. Free online PDF splitter, no signup."
        path="/split-pdf"
        keywords="split pdf, extract pdf pages, pdf splitter, divide pdf, split pdf online"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Split PDF</h1>
          <p className="text-gray-600">Extract specific pages or page ranges from a PDF document.</p>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!file ? (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors mb-4">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600 font-medium">Click to upload a PDF file</span>
              <input type="file" accept=".pdf" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({pageCount} page{pageCount !== 1 ? 's' : ''})</span>
                </div>
                <button onClick={reset} className="text-xs text-blue-600 hover:underline">Change file</button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Page ranges to extract</label>
                <input
                  type="text"
                  value={ranges}
                  onChange={e => setRanges(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate ranges with commas. Each range becomes a separate PDF.</p>
              </div>

              <button
                onClick={split}
                disabled={!ranges.trim() || splitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                {splitting ? 'Splitting...' : 'Split PDF'}
              </button>
            </>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Download split files:</h3>
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  download={r.name}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="flex-1 text-sm font-medium text-gray-700">{r.pages}</span>
                  <span className="text-xs text-green-600 font-medium">Download</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
