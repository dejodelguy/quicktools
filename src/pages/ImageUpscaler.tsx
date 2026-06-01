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

    // Allow UI to update before heavy work
    await new Promise((r) => setTimeout(r, 50));

    try {
      // Step-by-step upscaling: 2× at a time for better quality
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
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Maximize2 className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">Image Upscaler</h1>
        </div>
        <p className="text-gray-400 mb-8">
          Enlarge images up to 4× with high-quality canvas interpolation. Everything runs in your browser.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-500 transition mb-6"
        >
          <Upload className="w-10 h-10 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">Drop an image here or click to browse</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {srcImage && (
          <div className="space-y-6">
            {/* Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Original ({srcDims.w} × {srcDims.h})</p>
                <img src={srcUrl} alt="Original" className="max-h-60 mx-auto rounded" />
              </div>
              {resultUrl && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Upscaled ({outW} × {outH})</p>
                  <img src={resultUrl} alt="Upscaled" className="max-h-60 mx-auto rounded" />
                </div>
              )}
            </div>

            {/* Scale selector */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400">Scale:</span>
              {([2, 3, 4] as Scale[]).map((s) => (
                <label key={s} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="scale"
                    checked={scale === s}
                    onChange={() => { setScale(s); setResultUrl(''); }}
                    className="accent-indigo-500"
                  />
                  <span>{s}× ({srcDims.w * s} × {srcDims.h * s})</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={upscale}
                disabled={processing}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium disabled:opacity-50 transition"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize2 className="w-4 h-4" />}
                {processing ? 'Processing…' : 'Upscale'}
              </button>
              {resultUrl && (
                <button
                  onClick={download}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              )}
            </div>
          </div>
        )}

        <AdPlaceholder />
      </div>
    </>
  );
}
