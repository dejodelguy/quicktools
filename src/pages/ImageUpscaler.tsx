import { useState, useRef, useCallback } from 'react';
import { Maximize2, Upload, Download, Loader2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import AdPlaceholder from '../components/AdPlaceholder';

type Scale = 2 | 3 | 4;

export default function ImageUpscaler() {
  const [srcImage, setSrcImage] = useState<HTMLImageElement | null>(null);
  const [srcUrl, setSrcUrl] = useState('');
  const [srcDims, setSrcDims] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState<Scale>(2);
  const [resultUrl, setResultUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setSrcImage(img);
        setSrcUrl(reader.result as string);
        setSrcDims({ w: img.width, h: img.height });
        setResultUrl('');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleFile(file);
    },
    [handleFile],
  );

  const upscale = useCallback(async () => {
    if (!srcImage) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 50));

    try {
      let current = srcImage;
      let remaining = scale;

      while (remaining > 1) {
        const step = remaining >= 2 ? 2 : remaining;
        const w = Math.round(current.width * step);
        const h = Math.round(current.height * step);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(current, 0, 0, w, h);

        const stepImg = new Image();
        await new Promise<void>((resolve) => {
          stepImg.onload = () => resolve();
          stepImg.src = canvas.toDataURL('image/png');
        });
        current = stepImg;
        remaining = remaining / step;
      }

      setResultUrl(current.src);
    } finally {
      setProcessing(false);
    }
  }, [srcImage, scale]);

  const download = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `upscaled-${scale}x.png`;
    a.click();
  }, [resultUrl, scale]);

  const outW = srcDims.w * scale;
  const outH = srcDims.h * scale;

  return (
    <>
      <SEOHead
        title="Image Upscaler – Free Online Tool"
        description="Upscale images 2×, 3×, or 4× using browser-based canvas rendering. No upload to servers."
        path="/image-upscaler"
      />

      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-header-icon">
            <Maximize2 />
          </div>
          <div>
            <h1>Image Upscaler</h1>
            <p>Enlarge images up to 4× with high-quality canvas interpolation. Everything runs in your browser.</p>
          </div>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="tool-page-card">
          {!srcImage ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors"
            >
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Drop an image here or click to browse</span>
              <span className="text-sm text-gray-400 mt-1">Supports PNG, JPG, WebP</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Original ({srcDims.w} × {srcDims.h})</p>
                  <img src={srcUrl} alt="Original" className="max-h-60 mx-auto rounded" />
                </div>
                {resultUrl && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Upscaled ({outW} × {outH})</p>
                    <img src={resultUrl} alt="Upscaled" className="max-h-60 mx-auto rounded" />
                  </div>
                )}
              </div>

              {/* Scale selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Scale Factor</label>
                <div className="flex items-center gap-3">
                  {([2, 3, 4] as Scale[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setScale(s); setResultUrl(''); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scale === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {s}× ({srcDims.w * s} × {srcDims.h * s})
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={upscale}
                  disabled={processing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize2 className="w-4 h-4" />}
                  {processing ? 'Processing…' : 'Upscale'}
                </button>
                {resultUrl && (
                  <button
                    onClick={download}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <ul className="space-y-2 text-gray-600">
            <li>Upload any image (PNG, JPG, WebP)</li>
            <li>Choose your scale factor: 2×, 3×, or 4× enlargement</li>
            <li>Click <strong>Upscale</strong> — processing happens in your browser</li>
            <li>Download the upscaled result</li>
          </ul>
        </div>
      </div>
    </>
  );
}
