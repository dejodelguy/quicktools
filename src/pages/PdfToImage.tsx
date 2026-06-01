import { useState, useCallback } from 'react'
import { ImageIcon, Upload, Download, X } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

interface PageImage {
  dataUrl: string
  width: number
  height: number
}

const PDFJS_CDN = 'https://unpkg.com/pdfjs-dist@4.8.69'

let pdfjsLib: any = null
let pdfjsLoading: Promise<any> | null = null

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib
  if (pdfjsLoading) return pdfjsLoading
  pdfjsLoading = (async () => {
    const lib = await import(/* @vite-ignore */ `${PDFJS_CDN}/build/pdf.mjs`)
    lib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/build/pdf.worker.mjs`
    pdfjsLib = lib
    return lib
  })()
  return pdfjsLoading
}

export default function PdfToImage() {
  const [pdfName, setPdfName] = useState<string>('')
  const [pages, setPages] = useState<PageImage[]>([])
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const [quality, setQuality] = useState(0.92)
  const [scale, setScale] = useState(2)

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') return

    setPdfName(file.name.replace(/\.pdf$/i, ''))
    setPages([])
    setConverting(true)
    setProgress(0)

    try {
      const pdfjs = await loadPdfJs()
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      const results: PageImage[] = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!

        await page.render({ canvasContext: ctx, viewport }).promise

        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
        const dataUrl = canvas.toDataURL(mimeType, format === 'jpeg' ? quality : undefined)
        results.push({ dataUrl, width: viewport.width, height: viewport.height })
        setProgress(Math.round((i / numPages) * 100))
      }

      setPages(results)
    } catch (err) {
      console.error('PDF conversion error:', err)
      alert('Failed to convert PDF. Make sure it is a valid PDF file.')
    } finally {
      setConverting(false)
    }
  }, [format, quality, scale])

  const downloadPage = (idx: number) => {
    const page = pages[idx]
    const ext = format === 'jpeg' ? 'jpg' : 'png'
    const link = document.createElement('a')
    link.href = page.dataUrl
    link.download = `${pdfName}_page${idx + 1}.${ext}`
    link.click()
  }

  const downloadAll = async () => {
    if (pages.length === 1) {
      downloadPage(0)
      return
    }

    // Try to use a simple sequential download (browsers may block multiple)
    for (let i = 0; i < pages.length; i++) {
      downloadPage(i)
      await new Promise(r => setTimeout(r, 300))
    }
  }

  const clearAll = () => {
    setPages([])
    setPdfName('')
    setProgress(0)
  }

  return (
    <>
      <SEOHead
        title="PDF to Image - Convert PDF Pages to PNG/JPG Online Free"
        description="Convert PDF pages to PNG or JPG images online. Free, fast, no signup. Download individual pages or all at once."
        path="/pdf-to-image"
        keywords="pdf to image, pdf to png, pdf to jpg, convert pdf to image, pdf to picture"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to Image</h1>
          <p className="text-gray-600">Convert PDF pages to PNG or JPG images. Download individual pages or all at once.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Upload */}
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">
              {pdfName ? pdfName + '.pdf' : 'Click to upload a PDF'}
            </span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
          </label>

          {/* Options */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Format</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value as 'png' | 'jpeg')}
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Scale: {scale}x
              </label>
              <input
                type="range"
                min={1}
                max={4}
                step={0.5}
                value={scale}
                onChange={e => setScale(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            {format === 'jpeg' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            )}
          </div>

          {/* Progress */}
          {converting && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Converting pages...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Page thumbnails */}
          {pages.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  {pages.length} page{pages.length !== 1 ? 's' : ''} converted
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download All
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {pages.map((page, i) => (
                  <div key={i} className="relative group">
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${i + 1}`}
                        className="w-full h-32 object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 px-0.5">
                      <span className="text-xs text-gray-500">Page {i + 1}</span>
                      <button
                        onClick={() => downloadPage(i)}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        <Download className="w-3.5 h-3.5 inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}


        </div>

        <AdPlaceholder className="mt-8" />
      </div>
    </>
  )
}
