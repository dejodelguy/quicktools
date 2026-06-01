import { useState, useCallback } from 'react'
import { FileMinus, Upload, Download, FileText } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

function parsePageRanges(input: string, maxPage: number): number[] {
  const pages = new Set<number>()
  const parts = input.split(',').map(s => s.trim()).filter(Boolean)
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= maxPage) pages.add(i)
      }
    } else {
      const num = parseInt(part, 10)
      if (!isNaN(num) && num >= 1 && num <= maxPage) pages.add(num)
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function PdfPageRemover() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [pagesToRemove, setPagesToRemove] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const loadPdf = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setError('')
    setThumbnailUrl(null)
    const data = await f.arrayBuffer()
    setFile({ name: f.name, data })

    try {
      const { PDFDocument } = await import('pdf-lib')
      const pdf = await PDFDocument.load(data)
      const count = pdf.getPageCount()
      setPageCount(count)

      // Generate thumbnail of first page
      const thumbPdf = await PDFDocument.create()
      const [firstPage] = await thumbPdf.copyPages(pdf, [0])
      thumbPdf.addPage(firstPage)
      const thumbBytes = await thumbPdf.save()
      const blob = new Blob([new Uint8Array(thumbBytes)], { type: 'application/pdf' })
      setThumbnailUrl(URL.createObjectURL(blob))
    } catch {
      setError('Failed to load PDF. Make sure the file is a valid PDF.')
      setFile(null)
      setPageCount(0)
    }
  }, [])

  const removePages = async () => {
    if (!file || !pageCount) return
    setError('')
    const indices = parsePageRanges(pagesToRemove, pageCount)
    if (indices.length === 0) {
      setError('Enter valid page numbers to remove (e.g., 1, 3, 5-7).')
      return
    }
    if (indices.length >= pageCount) {
      setError('Cannot remove all pages from the PDF.')
      return
    }

    setProcessing(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const srcPdf = await PDFDocument.load(file.data)
      const newPdf = await PDFDocument.create()

      const removeSet = new Set(indices.map(p => p - 1)) // convert to 0-indexed
      const keepIndices = srcPdf.getPageIndices().filter(i => !removeSet.has(i))
      const copiedPages = await newPdf.copyPages(srcPdf, keepIndices)
      copiedPages.forEach(p => newPdf.addPage(p))

      const bytes = await newPdf.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '') + '_removed.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Error processing PDF. Please try again.')
    }
    setProcessing(false)
  }

  const parsedPreview = pagesToRemove.trim()
    ? parsePageRanges(pagesToRemove, pageCount)
    : []

  return (
    <>
      <SEOHead
        title="Remove PDF Pages - Delete Pages from PDF Online Free"
        description="Remove specific pages from a PDF file. Delete unwanted pages by number or range. Free online PDF page remover, no signup."
        path="/pdf-page-remover"
        keywords="remove pdf pages, delete pdf pages, pdf page remover, remove pages from pdf, pdf page deletion"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileMinus className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Remove PDF Pages</h1>
          <p className="text-gray-600">Delete specific pages from a PDF file by page number or range.</p>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Upload */}
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">
              {file ? file.name : 'Click to upload a PDF'}
            </span>
            {file && <span className="text-xs text-gray-500 mt-1">{pageCount} pages</span>}
            <input type="file" accept=".pdf" className="hidden" onChange={loadPdf} />
          </label>

          {/* Thumbnail preview */}
          {thumbnailUrl && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-20 h-28 bg-white border border-gray-200 rounded overflow-hidden flex-shrink-0">
                <object data={thumbnailUrl} type="application/pdf" className="w-full h-full" aria-label="PDF preview">
                  <div className="flex items-center justify-center w-full h-full">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                </object>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{file?.name}</p>
                <p className="text-xs text-gray-500">{pageCount} pages</p>
              </div>
            </div>
          )}

          {/* Page input */}
          {file && pageCount > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pages to remove
              </label>
              <input
                type="text"
                value={pagesToRemove}
                onChange={e => setPagesToRemove(e.target.value)}
                placeholder="e.g., 1, 3, 5-7"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              {parsedPreview.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Will remove {parsedPreview.length} page{parsedPreview.length !== 1 ? 's' : ''}: {parsedPreview.join(', ')}{' '}
                  — keeping {pageCount - parsedPreview.length} page{pageCount - parsedPreview.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Action */}
          <button
            onClick={removePages}
            disabled={!file || !pagesToRemove.trim() || processing}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {processing ? 'Processing...' : 'Remove Pages & Download'}
          </button>
        </div>

        <AdPlaceholder size="medium-rectangle" />
      </div>
    </>
  )
}
