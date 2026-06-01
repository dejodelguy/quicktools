import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileStack, Upload, ArrowUp, ArrowDown, Trash2, Download, Loader2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import AdPlaceholder from '../components/AdPlaceholder';

interface PageEntry {
  index: number;
  objectUrl: string;
}

export default function PdfOrganizer() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [fileName, setFileName] = useState('');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    setPdfBytes(bytes);
    setFileName(file.name);

    const pdfDoc = await PDFDocument.load(buf);
    const count = pdfDoc.getPageCount();
    setPageCount(count);

    const blob = new Blob([buf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    setPages(
      Array.from({ length: count }, (_, i) => ({
        index: i,
        objectUrl: `${url}#page=${i + 1}`,
      }))
    );
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') handleFile(file);
    },
    [handleFile]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= pages.length) return;
    setPages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const removePage = (idx: number) => {
    setPages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    movePage(dragIdx, idx);
    setDragIdx(idx);
  };

  const handleDragEnd = () => setDragIdx(null);

  const generate = async () => {
    if (!pdfBytes) return;
    setProcessing(true);
    try {
      const srcDoc = await PDFDocument.load(pdfBytes);
      const outDoc = await PDFDocument.create();
      const indices = pages.map((p) => p.index);
      const copied = await outDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => outDoc.addPage(p));
      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes as any], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName.replace(/\.pdf$/i, '') + '_reordered.pdf';
      a.click();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <SEOHead title="PDF Organizer — Reorder PDF Pages" description="Drag and drop to reorder pages in your PDF, then download the reorganized file." />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <FileStack className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold">PDF Organizer</h1>
        </div>

        {pages.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-16 text-center cursor-pointer hover:border-indigo-500 transition"
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">Drop a PDF here or click to upload</p>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleInput} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {fileName} — {pageCount} pages, {pages.length} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPages([]); setPdfBytes(null); setFileName(''); setPageCount(0); }}
                  className="text-sm px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={generate}
                  disabled={processing || pages.length === 0}
                  className="text-sm px-4 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Reordered PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((page, idx) => (
                <div
                  key={`${page.index}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-lg border bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition ${
                    dragIdx === idx ? 'ring-2 ring-indigo-500 scale-95' : 'hover:shadow-md'
                  }`}
                >
                  <div className="absolute top-1 left-1 z-10 bg-indigo-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow">
                    {idx + 1}
                  </div>

                  <div className="absolute top-1 right-1 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => movePage(idx, idx - 1)} className="bg-white/90 dark:bg-gray-700/90 rounded p-0.5 hover:bg-gray-200" title="Move up">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => movePage(idx, idx + 1)} className="bg-white/90 dark:bg-gray-700/90 rounded p-0.5 hover:bg-gray-200" title="Move down">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removePage(idx)} className="bg-white/90 dark:bg-gray-700/90 rounded p-0.5 hover:bg-red-200 text-red-600" title="Remove">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <object data={page.objectUrl} type="application/pdf" className="w-full h-40 pointer-events-none" />
                </div>
              ))}
            </div>
          </>
        )}

        <AdPlaceholder className="mt-10" />
      </div>
    </>
  );
}
