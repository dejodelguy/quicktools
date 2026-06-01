import { useState } from 'react'
import { FileImage, Upload, Download, X } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function ImageToPdf() {
  const [images, setImages] = useState<{ url: string; name: string }[]>([])
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [generating, setGenerating] = useState(false)

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, { url: ev.target?.result as string, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx))

  const generatePdf = async () => {
    if (images.length === 0) return
    setGenerating(true)
    // Simple PDF generation using canvas and jsPDF-like approach
    // We'll create a basic PDF manually
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation, unit: 'mm', format: pageSize === 'fit' ? 'a4' : pageSize })
    const pageW = orientation === 'portrait' ? 210 : 297
    const pageH = orientation === 'portrait' ? 297 : 210
    const margin = 10

    for (let i = 0; i < images.length; i++) {
      if (i > 0) doc.addPage()
      const img = new window.Image()
      await new Promise<void>(resolve => {
        img.onload = () => {
          const maxW = pageW - margin * 2
          const maxH = pageH - margin * 2
          let w = img.width
          let h = img.height
          const scale = Math.min(maxW / w, maxH / h)
          w *= scale
          h *= scale
          const x = (pageW - w) / 2
          const y = (pageH - h) / 2
          doc.addImage(images[i].url, 'JPEG', x, y, w, h)
          resolve()
        }
        img.src = images[i].url
      })
    }

    doc.save('images.pdf')
    setGenerating(false)
  }

  return (
    <>
      <SEOHead title="Image to PDF - Convert Photos to PDF Online Free" description="Convert images to PDF online. Combine multiple photos into one PDF file. Free, fast, no signup." path="/image-to-pdf" keywords="image to pdf, photo to pdf, jpg to pdf, png to pdf, convert images to pdf" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileImage className="w-7 h-7 text-red-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image to PDF</h1>
          <p className="text-gray-600">Convert images to PDF. Combine multiple photos into one document.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">Click to add images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  <div className="text-xs text-gray-500 truncate mt-1">{img.name}</div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Page Size</label>
              <select value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="w-full p-2.5 border border-gray-300 rounded-lg">
                <option value="a4">A4</option><option value="letter">Letter</option><option value="fit">Fit to Image</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Orientation</label>
              <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full p-2.5 border border-gray-300 rounded-lg">
                <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <button onClick={generatePdf} disabled={images.length === 0 || generating} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> {generating ? 'Generating PDF...' : `Generate PDF (${images.length} images)`}
          </button>
        </div>
      </div>
    </>
  )
}