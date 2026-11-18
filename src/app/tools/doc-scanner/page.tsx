'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Scan, 
  Upload, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  RotateCw, 
  FileText, 
  Sliders, 
  CheckCircle2,
  Camera
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

type FilterMode = 'bw' | 'grayscale' | 'enhanced' | 'original';

export default function DocScannerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('bw');
  const [contrast, setContrast] = useState<number>(30);
  const [brightness, setBrightness] = useState<number>(10);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    processFilter(url, filterMode, contrast, brightness, 0);
  };

  const processFilter = (
    srcUrl = previewUrl,
    mode = filterMode,
    c = contrast,
    b = brightness,
    rot = rotation
  ) => {
    if (!srcUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const isSideways = rot % 180 !== 0;
      canvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
      canvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const factor = (259 * (c + 255)) / (255 * (259 - c));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let bVal = data[i + 2];

        // Apply brightness
        r += b;
        g += b;
        bVal += b;

        // Luminance calculation
        const gray = 0.299 * r + 0.587 * g + 0.114 * bVal;

        if (mode === 'bw') {
          // Document High-Contrast Binarization
          const threshold = 135 - c * 0.5;
          const finalVal = gray > threshold ? 255 : 0;
          data[i] = finalVal;
          data[i + 1] = finalVal;
          data[i + 2] = finalVal;
        } else if (mode === 'grayscale') {
          // Smooth grayscale with contrast
          const contrastGray = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
          data[i] = contrastGray;
          data[i + 1] = contrastGray;
          data[i + 2] = contrastGray;
        } else if (mode === 'enhanced') {
          // Color text enhancement
          data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
          data[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
          data[i + 2] = Math.min(255, Math.max(0, factor * (bVal - 128) + 128));
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setOutputImageUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    };
    img.src = srcUrl;
  };

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    processFilter(previewUrl, filterMode, contrast, brightness, newRot);
  };

  const handleDownloadPdf = async () => {
    if (!outputImageUrl) return;
    setIsExportingPdf(true);
    try {
      const res = await fetch(outputImageUrl);
      const imgBytes = await res.arrayBuffer();
      const pdfDoc = await PDFDocument.create();

      const img = await pdfDoc.embedPng(imgBytes);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'scanned-document.pdf';
      a.click();
    } catch (e) {
      alert('Failed to generate PDF document.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Scan className="w-3.5 h-3.5" />
          <span>Document Scanner • PDF & High-Res PNG • 100% Private</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Document Scanner & PDF Enhancer</h1>
        <p className="text-sm text-slate-500 mt-1">Convert photos of documents, receipts, and notes into clean, high-contrast black & white scans.</p>
      </div>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-12 text-center cursor-pointer bg-white transition-all shadow-sm hover:bg-slate-50/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Upload or Capture Document Photo</h3>
          <p className="text-xs text-slate-400 mt-1.5">Take a photo of paper, receipt, book page, or handwritten notes</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow">
            Browse Document Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-800">Scanner Filter</h3>
              <button
                onClick={() => { setPreviewUrl(null); setOutputImageUrl(null); }}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Scan Another
              </button>
            </div>

            {/* Filter Modes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Scan Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bw', label: 'B&W Scan' },
                  { id: 'grayscale', label: 'Grayscale' },
                  { id: 'enhanced', label: 'Color Enhance' },
                  { id: 'original', label: 'Original' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFilterMode(f.id as FilterMode);
                      processFilter(previewUrl, f.id as FilterMode, contrast, brightness, rotation);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      filterMode === f.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Text Contrast</span>
                <span>{contrast}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={contrast}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setContrast(val);
                  processFilter(previewUrl, filterMode, val, brightness, rotation);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Brightness Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Brightness</span>
                <span>{brightness}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="60"
                value={brightness}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBrightness(val);
                  processFilter(previewUrl, filterMode, contrast, val, rotation);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Rotation */}
            <div>
              <button
                onClick={handleRotate}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate 90° ({rotation}°)</span>
              </button>
            </div>

            {/* Export Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{isExportingPdf ? 'Exporting PDF...' : 'Download as Scanned PDF'}</span>
              </button>

              {outputImageUrl && (
                <a
                  href={outputImageUrl}
                  download="scanned-document.png"
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean PNG</span>
                </a>
              )}
            </div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-2 bg-slate-100 rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center min-h-[460px] overflow-hidden">
            {outputImageUrl ? (
              <img
                src={outputImageUrl}
                alt="Scanned Document"
                className="max-h-[540px] max-w-full object-contain shadow-md rounded bg-white"
              />
            ) : (
              <div className="text-slate-400 text-xs">Applying document filter...</div>
            )}
          </div>
        </div>
      )}

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
