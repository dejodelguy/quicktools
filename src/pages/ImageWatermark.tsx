import { useState, useRef, useCallback } from 'react';
import { Droplets, Upload } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import AdPlaceholder from '../components/AdPlaceholder';

type Position = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

type WatermarkMode = 'text' | 'image';

const POSITIONS: { label: string; value: Position }[] = [
  { label: '↖', value: 'top-left' },
  { label: '↑', value: 'top-center' },
  { label: '↗', value: 'top-right' },
  { label: '←', value: 'middle-left' },
  { label: '●', value: 'center' },
  { label: '→', value: 'middle-right' },
  { label: '↙', value: 'bottom-left' },
  { label: '↓', value: 'bottom-center' },
  { label: '↘', value: 'bottom-right' },
];

const FONTS = ['Arial', 'Georgia', 'Courier New', 'Times New Roman', 'Verdana', 'Impact', 'Comic Sans MS'];

function getPositionCoords(
  position: Position,
  canvasW: number,
  canvasH: number,
  wmW: number,
  wmH: number,
  margin: number = 10,
): { x: number; y: number } {
  const positions: Record<Position, { x: number; y: number }> = {
    'top-left':      { x: margin, y: margin },
    'top-center':    { x: (canvasW - wmW) / 2, y: margin },
    'top-right':     { x: canvasW - wmW - margin, y: margin },
    'middle-left':   { x: margin, y: (canvasH - wmH) / 2 },
    'center':        { x: (canvasW - wmW) / 2, y: (canvasH - wmH) / 2 },
    'middle-right':  { x: canvasW - wmW - margin, y: (canvasH - wmH) / 2 },
    'bottom-left':   { x: margin, y: canvasH - wmH - margin },
    'bottom-center': { x: (canvasW - wmW) / 2, y: canvasH - wmH - margin },
    'bottom-right':  { x: canvasW - wmW - margin, y: canvasH - wmH - margin },
  };
  return positions[position];
}

export default function ImageWatermark() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [mode, setMode] = useState<WatermarkMode>('text');

  // Text watermark state
  const [text, setText] = useState('Sample Watermark');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontOpacity, setFontOpacity] = useState(0.5);

  // Image watermark state
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);
  const [wmImageUrl, setWmImageUrl] = useState<string>('');
  const [wmScale, setWmScale] = useState(30);
  const [wmImageOpacity, setWmImageOpacity] = useState(0.5);

  // Shared state
  const [position, setPosition] = useState<Position>('bottom-right');
  const [processing, setProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
  }, []);

  const handleWmImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setWmImageFile(f);
    setWmImageUrl(URL.createObjectURL(f));
  }, []);

  const applyWatermark = useCallback(async () => {
    if (!imageUrl) return;
    setProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (mode === 'text') {
        const fontSizeScaled = fontSize * (canvas.width / 800);
        ctx.font = `${fontSizeScaled}px "${font}"`;
        ctx.fillStyle = fontColor;
        ctx.globalAlpha = fontOpacity;

        const metrics = ctx.measureText(text);
        const textW = metrics.width;
        const textH = fontSizeScaled;

        const pos = getPositionCoords(position, canvas.width, canvas.height, textW, textH, 20);

        ctx.textBaseline = 'top';
        ctx.fillText(text, pos.x, pos.y);
      } else {
        if (!wmImageUrl) return;
        const wmImg = new Image();
        wmImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          wmImg.onload = () => resolve();
          wmImg.onerror = reject;
          wmImg.src = wmImageUrl;
        });

        const scale = wmScale / 100;
        const wmW = wmImg.width * scale;
        const wmH = wmImg.height * scale;

        const pos = getPositionCoords(position, canvas.width, canvas.height, wmW, wmH, 20);

        ctx.globalAlpha = wmImageOpacity;
        ctx.drawImage(wmImg, pos.x, pos.y, wmW, wmH);
      }

      ctx.globalAlpha = 1;
    } catch (err) {
      console.error('Watermark failed:', err);
      alert('Failed to apply watermark. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [imageUrl, mode, text, font, fontSize, fontColor, fontOpacity, wmImageUrl, wmScale, wmImageOpacity, position]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = imageFile ? imageFile.name.replace(/\.[^.]+$/, '') + '_watermarked.png' : 'watermarked.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }, [imageFile]);

  return (
    <>
      <SEOHead title="Image Watermark" description="Add text or image watermarks to your images online for free." path="/image-watermark" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-header-icon">
            <Droplets />
          </div>
          <div>
            <h1>Image Watermark</h1>
            <p>Add text or image watermarks to your photos. Free, runs in your browser.</p>
          </div>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="tool-page-card space-y-6">
          {/* Upload main image */}
          <div>
            <label>Upload Image</label>
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="max-h-44 rounded" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-gray-600 font-medium">Click or drag image here</span>
                  <span className="text-sm text-gray-400 mt-1">Supports PNG, JPG, WebP</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {imageUrl && (
            <>
              {/* Mode toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  Watermark Type
                </label>
                <div className="flex gap-3">
                  {(['text', 'image'] as WatermarkMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-colors ${
                        mode === m
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-gray-100  text-gray-700  hover:bg-gray-200 '
                      }`}
                    >
                      {m === 'text' ? 'Text Watermark' : 'Image Watermark'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text options */}
              {mode === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white  px-3 py-2 text-sm text-gray-900  focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">Font</label>
                      <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white  px-3 py-2 text-sm text-gray-900  focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {FONTS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">
                        Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min={12}
                        max={120}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">Color</label>
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700  mb-2">
                        Opacity: {Math.round(fontOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={fontOpacity * 100}
                        onChange={(e) => setFontOpacity(Number(e.target.value) / 100)}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image watermark options */}
              {mode === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-2">
                      Watermark Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWmImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100  "
                    />
                  </div>

                  {wmImageUrl && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700  mb-2">
                          Scale: {wmScale}%
                        </label>
                        <input
                          type="range"
                          min={5}
                          max={100}
                          value={wmScale}
                          onChange={(e) => setWmScale(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700  mb-2">
                          Opacity: {Math.round(wmImageOpacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={wmImageOpacity * 100}
                          onChange={(e) => setWmImageOpacity(Number(e.target.value) / 100)}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Position grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  Watermark Position
                </label>
                <div className="inline-grid grid-cols-3 gap-1 bg-gray-100  p-2 rounded-lg">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        position === p.value
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white dark:bg-gray-600 text-gray-600  hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                      title={p.value}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <button
                onClick={applyWatermark}
                disabled={processing || (mode === 'image' && !wmImageUrl)}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Applying...' : 'Apply Watermark'}
              </button>

              {/* Preview & download */}
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">Preview</label>
                <canvas
                  ref={canvasRef}
                  className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
                <button
                  onClick={handleDownload}
                  className="mt-3 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  Download Watermarked Image
                </button>
              </div>
            </>
          )}
        </div>

        <AdPlaceholder className="mt-8" />
      </div>
    </>
  );
}
