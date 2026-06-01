import { useState, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { RotateCw } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import AdPlaceholder from '../components/AdPlaceholder';

type RotationAngle = 90 | 180 | 270;

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<string>('all');
  const [rotation, setRotation] = useState<RotationAngle>(90);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const buffer = await f.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    setPageCount(pdf.getPageCount());
    setSelectedPages('all');
  }, []);

  const parsePages = (input: string, total: number): number[] => {
    if (input.trim().toLowerCase() === 'all') {
      return Array.from({ length: total }, (_, i) => i);
    }
    const pages: Set<number> = new Set();
    for (const part of input.split(',')) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(total, end); i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const num = Number(trimmed);
        if (!isNaN(num) && num >= 1 && num <= total) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRotate = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pages = pdf.getPages();
      const targetPages = parsePages(selectedPages, pages.length);

      for (const idx of targetPages) {
        const page = pages[idx];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotation) % 360));
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '_rotated.pdf');
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Rotation failed:', err);
      alert('Failed to rotate PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <SEOHead title="Rotate PDF Pages" description="Rotate PDF pages 90°, 180°, or 270° online for free." />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <RotateCw className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rotate PDF Pages</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
          </div>

          {file && pageCount > 0 && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                <strong>{file.name}</strong> — {pageCount} page{pageCount !== 1 ? 's' : ''}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pages to Rotate
                </label>
                <input
                  type="text"
                  value={selectedPages}
                  onChange={(e) => setSelectedPages(e.target.value)}
                  placeholder="all, or e.g. 1,3,5-8"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter "all" or page numbers separated by commas (e.g. 1,3,5-8)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotation Angle
                </label>
                <div className="flex gap-3">
                  {([90, 180, 270] as RotationAngle[]).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        rotation === angle
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <RotateCw className={`w-4 h-4 inline mr-1 ${rotation === angle ? '' : 'opacity-50'}`} style={{ transform: `rotate(${angle}deg)` }} />
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRotate}
                disabled={processing}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Rotating...' : 'Rotate & Download'}
              </button>
            </>
          )}
        </div>

        <AdPlaceholder className="mt-8" />
      </div>
    </>
  );
}
