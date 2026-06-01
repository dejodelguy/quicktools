import { useState, useRef, useCallback } from 'react'
import { FileCode, Download } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

type PageSize = 'a4' | 'letter' | 'legal'
type Orientation = 'portrait' | 'landscape'

const DEFAULT_HTML = `<div style="font-family: Arial, sans-serif; padding: 40px;">
  <h1 style="color: #1a1a2e;">Hello World</h1>
  <p style="color: #555; font-size: 16px; line-height: 1.6;">
    This is a sample HTML document. Edit the code on the left to see changes in real time.
  </p>
  <ul>
    <li>Supports custom styling</li>
    <li>Live preview</li>
    <li>Download as PDF</li>
  </ul>
</div>`

export default function HtmlToPdf() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [marginTop, setMarginTop] = useState(10)
  const [marginRight, setMarginRight] = useState(10)
  const [marginBottom, setMarginBottom] = useState(10)
  const [marginLeft, setMarginLeft] = useState(10)
  const [converting, setConverting] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const updatePreview = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(html)
    doc.close()
  }, [html])

  const handleConvert = async () => {
    if (!html.trim()) return
    setConverting(true)

    try {
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      // Create a temporary hidden container to render the HTML
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = orientation === 'portrait' ? '794px' : '1123px' // A4 at 96dpi
      container.style.background = '#fff'
      container.innerHTML = html
      document.body.appendChild(container)

      // Wait for images/fonts to load
      await new Promise(resolve => setTimeout(resolve, 300))

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      })

      document.body.removeChild(container)

      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      })

      const pageW = orientation === 'portrait' ? 210 : 297
      const pageH = orientation === 'portrait' ? 297 : 210
      const contentW = pageW - marginLeft - marginRight
      const contentH = pageH - marginTop - marginBottom

      const imgWidth = contentW
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = marginTop

      const imgData = canvas.toDataURL('image/png')

      // First page
      doc.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight)
      heightLeft -= contentH

      // Additional pages if content overflows
      while (heightLeft > 0) {
        position = marginTop - imgHeight + position
        doc.addPage()
        doc.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight)
        heightLeft -= contentH
      }

      doc.save('html-to-pdf.pdf')
    } catch (err) {
      console.error('PDF conversion error:', err)
      alert('Failed to convert HTML to PDF. Please check your HTML code.')
    } finally {
      setConverting(false)
    }
  }

  return (
    <>
      <SEOHead
        title="HTML to PDF - Convert HTML Code to PDF Online Free"
        description="Convert HTML code to PDF online. Live preview, custom page size, orientation, and margins. Free, fast, no signup."
        path="/html-to-pdf"
        keywords="html to pdf, convert html to pdf, html pdf converter, webpage to pdf, html code to pdf"
      />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileCode className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML to PDF</h1>
          <p className="text-gray-600">Convert HTML code to a PDF document with live preview and custom options.</p>
        </div>

        <AdPlaceholder size="leaderboard" />

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Page Size</label>
              <select
                value={pageSize}
                onChange={e => setPageSize(e.target.value as PageSize)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Orientation</label>
              <select
                value={orientation}
                onChange={e => setOrientation(e.target.value as Orientation)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Top / Bottom Margin (mm)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={marginTop}
                  onChange={e => setMarginTop(+e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="Top"
                />
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={marginBottom}
                  onChange={e => setMarginBottom(+e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="Bottom"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Left / Right Margin (mm)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={marginLeft}
                  onChange={e => setMarginLeft(+e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="Left"
                />
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={marginRight}
                  onChange={e => setMarginRight(+e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="Right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* HTML Input */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">HTML Code</span>
              <button
                onClick={() => setHtml('')}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={html}
              onChange={e => setHtml(e.target.value)}
              className="w-full flex-1 min-h-[400px] p-4 font-mono text-sm leading-relaxed resize-none border-0 rounded-b-xl focus:outline-none focus:ring-0 bg-gray-50"
              placeholder="Enter your HTML code here..."
              spellCheck={false}
            />
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Live Preview</span>
              <button
                onClick={updatePreview}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition-colors"
              >
                Refresh
              </button>
            </div>
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="w-full flex-1 min-h-[400px] rounded-b-xl border-0 bg-white"
              sandbox="allow-same-origin"
              onLoad={updatePreview}
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            disabled={converting || !html.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            {converting ? 'Converting...' : 'Download PDF'}
          </button>
        </div>

        <AdPlaceholder className="mt-8" />
      </div>
    </>
  )
}
