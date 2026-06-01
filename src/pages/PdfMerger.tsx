import { useState } from 'react'
import { FilePlus, Upload, Download, X, GripVertical } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function PdfMerger() {
  const [files, setFiles] = useState<{ name: string; data: ArrayBuffer }[]>([])
  const [merging, setMerging] = useState(false)

  const addFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || [])
    const newFiles = await Promise.all(fileList.map(async f => ({
      name: f.name,
      data: await f.arrayBuffer()
    })))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx))

  const moveFile = (from: number, to: number) => {
    const arr = [...files]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setFiles(arr)
  }

  const merge = async () => {
    if (files.length < 2) return
    setMerging(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      for (const file of files) {
        const pdf = await PDFDocument.load(file.data)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const bytes = await merged.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error merging PDFs. Make sure all files are valid PDFs.')
    }
    setMerging(false)
  }

  return (
    <>
      <SEOHead title="Merge PDF - Combine PDF Files Online Free" description="Merge multiple PDF files into one. Reorder pages, combine documents. Free online PDF merger, no signup." path="/pdf-merger" keywords="merge pdf, combine pdf, pdf merger, join pdf files, merge pdf online" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FilePlus className="w-7 h-7 text-red-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge PDF Files</h1>
          <p className="text-gray-600">Combine multiple PDF files into one. Drag to reorder.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-colors mb-4">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">Click to add PDF files</span>
            <input type="file" accept=".pdf" multiple className="hidden" onChange={addFiles} />
          </label>

          {files.length > 0 && (
            <div className="space-y-2 mb-4">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-sm font-medium text-gray-700 truncate">{f.name}</span>
                  <span className="text-xs text-gray-500">#{i + 1}</span>
                  {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="text-xs text-blue-600 hover:underline">↑</button>}
                  {i < files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="text-xs text-blue-600 hover:underline">↓</button>}
                  <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          <button onClick={merge} disabled={files.length < 2 || merging} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>
        </div>
      </div>
    </>
  )
}