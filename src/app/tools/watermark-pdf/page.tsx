'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Stamp, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Eye,
  Sliders
} from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

export default function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState<number>(48);
  const [opacity, setOpacity] = useState<number>(0.25);
  const [rotationAngle, setRotationAngle] = useState<number>(-45);
  const [watermarkColor, setWatermarkColor] = useState<'gray' | 'red' | 'blue' | 'black'>('gray');
  const [layoutMode, setLayoutMode] = useState<'center' | 'bottom' | 'repeat'>('center');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = ['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'SAMPLE', 'INTERNAL USE ONLY'];

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setError(null);
    setDownloadUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPdfFile(file);
      setPageCount(loadedDoc.getPageCount());
    } catch (err: any) {
      console.error(err);
      setError('Unable to parse PDF. Ensure the file is not corrupted or password-protected.');
    }
  };

  const applyWatermark = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF document first.');
      return;
    }
    if (!watermarkText.trim()) {
      setError('Watermark text cannot be empty.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const originalBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(originalBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Determine RGB color
      let colorRgb = rgb(0.5, 0.5, 0.5); // gray
      if (watermarkColor === 'red') colorRgb = rgb(0.85, 0.15, 0.15);
      if (watermarkColor === 'blue') colorRgb = rgb(0.12, 0.35, 0.85);
      if (watermarkColor === 'black') colorRgb = rgb(0.05, 0.05, 0.05);

      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        if (layoutMode === 'center') {
          // Center watermark diagonally
          const x = width / 2 - (textWidth / 2) * Math.cos((rotationAngle * Math.PI) / 180);
          const y = height / 2 - (textWidth / 2) * Math.sin((rotationAngle * Math.PI) / 180);

          page.drawText(watermarkText, {
            x: Math.max(x, 20),
            y: Math.max(y, 20),
            size: fontSize,
            font,
            color: colorRgb,
            opacity,
            rotate: degrees(rotationAngle),
          });
        } else if (layoutMode === 'bottom') {
          // Subtle horizontal footer watermark
          page.drawText(watermarkText, {
            x: width / 2 - textWidth / 2,
            y: 35,
            size: Math.min(fontSize, 20),
            font,
            color: colorRgb,
            opacity: Math.max(opacity, 0.4),
          });
        } else if (layoutMode === 'repeat') {
          // 3x repeating grid
          const positions = [
            { x: width * 0.25, y: height * 0.75 },
            { x: width * 0.5, y: height * 0.5 },
            { x: width * 0.75, y: height * 0.25 },
          ];

          for (const pos of positions) {
            page.drawText(watermarkText, {
              x: pos.x - textWidth / 4,
              y: pos.y,
              size: fontSize * 0.75,
              font,
              color: colorRgb,
              opacity,
              rotate: degrees(rotationAngle),
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to apply watermark. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link 
          href="/#tools" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Document Protection • Zero Uploads</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Watermark PDF Tool
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Stamp custom text watermarks across every page of your PDF with custom angles, colors, and opacity. 100% private.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Uploads</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Controls (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">1. Select Target PDF</h3>
              {pdfFile && (
                <span className="text-xs font-semibold text-emerald-600">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} Loaded
                </span>
              )}
            </div>

            {!pdfFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePdfUpload} 
                  accept="application/pdf" 
                  className="hidden" 
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                  <Stamp className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">Choose a PDF file to watermark</p>
                <p className="text-[11px] text-slate-400">All processing is done inside your browser</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 truncate">
                  <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{pdfFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {Math.round(pdfFile.size / 1024)} KB • {pageCount} pages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setDownloadUrl(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Watermark Text & Presets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              2. Watermark Text & Presets
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL or Company Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Popular Quick Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setWatermarkText(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        watermarkText === preset 
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Preview Card */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-slate-100/60 relative overflow-hidden flex items-center justify-center min-h-[160px]">
                <div 
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    opacity: opacity,
                    fontSize: `${fontSize * 0.6}px`,
                    color: watermarkColor === 'red' ? '#dc2626' : watermarkColor === 'blue' ? '#2563eb' : '#475569'
                  }}
                  className="font-black tracking-wider uppercase select-none pointer-events-none transition-all duration-200 whitespace-nowrap"
                >
                  {watermarkText || 'WATERMARK'}
                </div>
                <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400">
                  Live Style Preview
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Sidebar Settings (1 column) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Typography & Angle
            </h3>

            <div className="space-y-4">
              {/* Opacity Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span>Transparency / Opacity</span>
                  <span className="font-mono text-indigo-600">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.80"
                  step="0.02"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono text-indigo-600">{fontSize} pt</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="72"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gray', label: 'Gray', hex: 'bg-slate-500' },
                    { id: 'red', label: 'Red', hex: 'bg-rose-500' },
                    { id: 'blue', label: 'Blue', hex: 'bg-blue-600' },
                    { id: 'black', label: 'Black', hex: 'bg-slate-900' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setWatermarkColor(c.id as any)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        watermarkColor === c.id 
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-2xs' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${c.hex}`} />
                      <span className="text-[10px] font-bold text-slate-700">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Angle Orientation
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: -45, label: 'Diagonal ↗' },
                    { val: 0, label: 'Horizontal →' },
                    { val: 90, label: 'Vertical ↑' },
                  ].map((a) => (
                    <button
                      key={a.val}
                      onClick={() => setRotationAngle(a.val)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        rotationAngle === a.val 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Layout Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'center', label: 'Centered' },
                    { id: 'repeat', label: 'Tiled 3x' },
                    { id: 'bottom', label: 'Footer' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setLayoutMode(m.id as any)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        layoutMode === m.id 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={!pdfFile || isProcessing}
                  onClick={applyWatermark}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Watermarking PDF...</span>
                    </>
                  ) : (
                    <>
                      <Stamp className="w-4 h-4" />
                      <span>Apply Watermark to PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Download Ready Section */}
              {downloadUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PDF Watermarked Successfully!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`Watermarked-${pdfFile?.name || 'document.pdf'}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Watermarked PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <AdBanner slot="sidebar" />
        </div>
      </div>
    </div>
  );
}