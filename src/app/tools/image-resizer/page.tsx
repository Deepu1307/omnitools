'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  ArrowLeft, 
  Download, 
  Image as ImageIcon, 
  CheckCircle, 
  Lock, 
  Unlock, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function ImageResizerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Resize settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(85);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Result output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WebP).');
      return;
    }

    setImageFile(file);
    setOriginalSize(file.size);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      processImage(img, img.naturalWidth, img.naturalHeight, quality, format);
    };
    img.src = objectUrl;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const processImage = (
    imgSrc?: HTMLImageElement,
    w = targetWidth,
    h = targetHeight,
    q = quality,
    fmt = format
  ) => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = imgSrc || new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // White background for JPEG if source was transparent
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOutputSize(blob.size);
            const downloadUrl = URL.createObjectURL(blob);
            setOutputUrl(downloadUrl);
          }
          setIsProcessing(false);
        },
        fmt,
        q / 100
      );
    };

    if (!imgSrc) {
      img.src = previewUrl;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savingsPercentage = originalSize && outputSize
    ? Math.round(((originalSize - outputSize) / originalSize) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Client-Side • Photos Never Leave Your Device</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Image Resizer & Compressor</h1>
        <p className="text-sm text-slate-500 mt-1">Resize, convert, and compress images with instant local preview and zero quality sacrifice.</p>
      </div>

      {/* Upload Box */}
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
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Select or Drop Your Image Here</h3>
          <p className="text-xs text-slate-400 mt-1.5">Supports PNG, JPG, and WebP up to 50MB</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow">
            Browse Image
          </button>
        </div>
      )}

      {/* In-tool Ad Banner */}
      <AdBanner slot="in-tool" />

      {/* Editing & Controls Area */}
      {previewUrl && originalDimensions && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-800">Resize Settings</h3>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setImageFile(null);
                  setOutputUrl(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Change Photo
              </button>
            </div>

            {/* Target Dimensions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dimensions (px)</label>
                <button
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                    lockAspectRatio ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>Aspect Ratio</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Width</span>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Height</span>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Quick scale presets */}
              <div className="flex gap-2 mt-2">
                {[0.25, 0.5, 0.75, 1].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => {
                      const w = Math.round(originalDimensions.width * scale);
                      const h = Math.round(originalDimensions.height * scale);
                      setTargetWidth(w);
                      setTargetHeight(h);
                      processImage(undefined, w, h);
                    }}
                    className="flex-1 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {scale * 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Quality</span>
                <span>{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuality(val);
                  processImage(undefined, targetWidth, targetHeight, val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      processImage(undefined, targetWidth, targetHeight, quality, fmt);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg uppercase transition-all ${
                      format === fmt
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {fmt.replace('image/', '')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => processImage()}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Apply Changes</span>
            </button>
          </div>

          {/* Preview & Download Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comparison Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-medium">Original</span>
                  <span className="font-bold text-slate-800 text-sm">{formatFileSize(originalSize)}</span>
                  <span className="text-xs text-slate-400 ml-1">({originalDimensions.width}×{originalDimensions.height})</span>
                </div>
                <div className="text-slate-300">→</div>
                <div>
                  <span className="text-[11px] text-indigo-500 block uppercase font-semibold">Resized Result</span>
                  <span className="font-bold text-indigo-700 text-sm">{formatFileSize(outputSize)}</span>
                  <span className="text-xs text-indigo-400 ml-1">({targetWidth}×{targetHeight})</span>
                </div>
              </div>

              {savingsPercentage > 0 && (
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {savingsPercentage}% Smaller!
                </div>
              )}

              {outputUrl && (
                <a
                  href={outputUrl}
                  download={`omnitools-resized.${format.replace('image/', '')}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </a>
              )}
            </div>

            {/* Visual Canvas Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center min-h-[360px] overflow-hidden">
              {outputUrl ? (
                <img
                  src={outputUrl}
                  alt="Resized Preview"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering preview...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
