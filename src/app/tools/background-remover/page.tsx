'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  ArrowLeft, 
  Download, 
  Scissors, 
  Sparkles, 
  Pipette, 
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function BackgroundRemoverPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState<number>(30);
  const [feather, setFeather] = useState<number>(2);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      // Auto-sample top-left corner color as default background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
        processBackgroundRemoval(img, { r: pixel[0], g: pixel[1], b: pixel[2] }, tolerance, feather);
      }
    };
    img.src = url;
  };

  const processBackgroundRemoval = (
    imgSrc?: HTMLImageElement,
    color = targetColor,
    tol = tolerance,
    f = feather
  ) => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = imgSrc || new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Color distance algorithm
      const tolDist = tol * 2.5;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          Math.pow(r - color.r, 2) +
          Math.pow(g - color.g, 2) +
          Math.pow(b - color.b, 2)
        );

        if (dist < tolDist) {
          // Transparent
          data[i + 3] = 0;
        } else if (dist < tolDist + f * 10) {
          // Smooth edge alpha feathering
          const alphaFactor = (dist - tolDist) / (f * 10);
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    };

    if (!imgSrc) {
      img.src = previewUrl;
    }
  };

  const pickColorFromCanvas = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * e.currentTarget.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * e.currentTarget.naturalHeight);

    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const newColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
        setTargetColor(newColor);
        processBackgroundRemoval(img, newColor, tolerance, feather);
      }
    };
    img.src = previewUrl || '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 mb-3">
          <Scissors className="w-3.5 h-3.5" />
          <span>Client-Side Background Removal • High Quality PNG</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Instant Background Remover</h1>
        <p className="text-sm text-slate-500 mt-1">Make photo backgrounds transparent for logos, signatures, and product shots with zero server uploads.</p>
      </div>

      {!previewUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-12 text-center cursor-pointer bg-white transition-all shadow-sm hover:bg-slate-50/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Select Image to Cut Out Background</h3>
          <p className="text-xs text-slate-400 mt-1.5">Works best on solid, studio, white, or distinct backgrounds</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow">
            Browse Image
          </button>
        </div>
      )}

      <AdBanner slot="in-tool" />

      {previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-800">Cutout Controls</h3>
              <button
                onClick={() => { setPreviewUrl(null); setOutputUrl(null); }}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Change Photo
              </button>
            </div>

            {/* Selected Target Color */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Sample Background Color
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-slate-300 shadow-inner"
                  style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
                />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold block">RGB({targetColor.r}, {targetColor.g}, {targetColor.b})</span>
                  <span className="text-[11px] text-slate-400">Click anywhere on the original photo to sample</span>
                </div>
              </div>
            </div>

            {/* Tolerance Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Color Tolerance</span>
                <span>{tolerance}</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={tolerance}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTolerance(val);
                  processBackgroundRemoval(undefined, targetColor, val, feather);
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Edge Feathering Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Smooth Edges (Feather)</span>
                <span>{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                value={feather}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFeather(val);
                  processBackgroundRemoval(undefined, targetColor, tolerance, val);
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {outputUrl && (
              <a
                href={outputUrl}
                download="omnitools-transparent.png"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Transparent PNG</span>
              </a>
            )}
          </div>

          {/* Side by side Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original (Clickable to pick color) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Original (Click to Sample Color)
                </span>
                <div className="flex items-center justify-center min-h-[280px] cursor-crosshair overflow-hidden rounded-lg bg-slate-50">
                  <img
                    src={previewUrl}
                    alt="Original"
                    onClick={pickColorFromCanvas}
                    className="max-h-[340px] max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Transparent Output on Checkerboard */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-2">
                  Transparent Result
                </span>
                <div className="flex items-center justify-center min-h-[280px] overflow-hidden rounded-lg checkerboard-bg">
                  {outputUrl ? (
                    <img
                      src={outputUrl}
                      alt="Cutout Preview"
                      className="max-h-[340px] max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">Processing cutout...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
