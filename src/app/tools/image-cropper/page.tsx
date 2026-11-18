'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Crop, 
  Upload, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Check, 
  Maximize2,
  Sliders,
  RefreshCw
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface AspectPreset {
  id: string;
  name: string;
  ratio: number | null; // width / height
  badge: string;
}

const PRESETS: AspectPreset[] = [
  { id: '1:1', name: 'Square', ratio: 1, badge: 'Instagram Post / Avatar' },
  { id: '9:16', name: 'Vertical Reel', ratio: 9 / 16, badge: 'Reels / TikTok / Shorts' },
  { id: '16:9', name: 'Landscape', ratio: 16 / 9, badge: 'YouTube / Twitter' },
  { id: '4:5', name: 'Portrait', ratio: 4 / 5, badge: 'Instagram Portrait' },
  { id: 'free', name: 'Freeform', ratio: null, badge: 'Custom Size' },
];

export default function ImageCropperPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<AspectPreset>(PRESETS[0]);
  const [cropWidthPercent, setCropWidthPercent] = useState<number>(80);
  const [cropXPercent, setCropXPercent] = useState<number>(10);
  const [cropYPercent, setCropYPercent] = useState<number>(10);
  const [croppedOutputUrl, setCroppedOutputUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    generateCrop(url, selectedPreset, 80, 10, 10);
  };

  const generateCrop = (
    srcUrl = previewUrl,
    preset = selectedPreset,
    wPercent = cropWidthPercent,
    xPercent = cropXPercent,
    yPercent = cropYPercent
  ) => {
    if (!srcUrl) return;

    const img = new Image();
    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;

      // Determine crop rectangle in pixels
      const cropW = Math.round((origW * wPercent) / 100);
      let cropH = cropW;

      if (preset.ratio !== null) {
        cropH = Math.round(cropW / preset.ratio);
        if (cropH > origH) {
          cropH = origH;
          // adjust width
          const adjustedW = Math.round(cropH * preset.ratio);
        }
      } else {
        cropH = Math.round((origH * wPercent) / 100);
      }

      const maxStartX = Math.max(0, origW - cropW);
      const maxStartY = Math.max(0, origH - cropH);

      const startX = Math.round((maxStartX * xPercent) / 100);
      const startY = Math.round((maxStartY * yPercent) / 100);

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedOutputUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };
    img.src = srcUrl;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 mb-3">
          <Crop className="w-3.5 h-3.5" />
          <span>Social Media Formats • 100% In-Browser Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Social Media Image & Canvas Cropper</h1>
        <p className="text-sm text-slate-500 mt-1">Crop photos to exact ratios for Instagram posts, Reels, YouTube thumbnails, and avatars.</p>
      </div>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-3xl p-12 text-center cursor-pointer bg-white transition-all shadow-sm hover:bg-slate-50/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <Crop className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Select Image to Crop</h3>
          <p className="text-xs text-slate-400 mt-1.5">Supports PNG, JPG, WebP</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 transition-colors shadow">
            Browse Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-800">Aspect Presets</h3>
              <button
                onClick={() => { setPreviewUrl(null); setCroppedOutputUrl(null); }}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Change Photo
              </button>
            </div>

            {/* Ratio Presets */}
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPreset(p);
                    generateCrop(previewUrl, p, cropWidthPercent, cropXPercent, cropYPercent);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedPreset.id === p.id
                      ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{p.name} ({p.id})</span>
                    <span className="text-[11px] text-slate-400">{p.badge}</span>
                  </div>
                  {selectedPreset.id === p.id && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              ))}
            </div>

            {/* Position & Zoom Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Crop Zoom (Scale)</span>
                  <span>{cropWidthPercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropWidthPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCropWidthPercent(val);
                    generateCrop(previewUrl, selectedPreset, val, cropXPercent, cropYPercent);
                  }}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Horizontal Position</span>
                  <span>{cropXPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropXPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCropXPercent(val);
                    generateCrop(previewUrl, selectedPreset, cropWidthPercent, val, cropYPercent);
                  }}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Vertical Position</span>
                  <span>{cropYPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropYPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCropYPercent(val);
                    generateCrop(previewUrl, selectedPreset, cropWidthPercent, cropXPercent, val);
                  }}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {croppedOutputUrl && (
              <a
                href={croppedOutputUrl}
                download={`omnitools-cropped-${selectedPreset.id.replace(':', '-')}.png`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped Photo</span>
              </a>
            )}
          </div>

          {/* Live Cropped Result Preview */}
          <div className="lg:col-span-2 bg-slate-100 rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center min-h-[460px] overflow-hidden">
            {croppedOutputUrl ? (
              <img
                src={croppedOutputUrl}
                alt="Cropped Preview"
                className="max-h-[500px] max-w-full object-contain shadow-lg rounded-xl bg-white"
              />
            ) : (
              <div className="text-slate-400 text-xs">Generating crop preview...</div>
            )}
          </div>
        </div>
      )}

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
