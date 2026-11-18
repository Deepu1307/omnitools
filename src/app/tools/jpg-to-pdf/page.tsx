'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  FileImage, 
  Download, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Plus,
  Settings2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

interface ImageItem {
  id: string;
  name: string;
  size: number;
  previewUrl: string;
  file: File;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setError(null);
    setDownloadUrl(null);

    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setError('Please select valid JPG, PNG, or WebP image files.');
      return;
    }

    const newItems: ImageItem[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
    setDownloadUrl(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const copy = [...prev];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
    setDownloadUrl(null);
  };

  // Embed file into PDF with direct buffer support for JPG/PNG and Canvas fallback for WebP
  const embedImageInPdf = async (pdfDoc: PDFDocument, file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Try direct native embedding first
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      try {
        return await pdfDoc.embedJpg(uint8);
      } catch (_) {}
    } else if (file.type === 'image/png') {
      try {
        return await pdfDoc.embedPng(uint8);
      } catch (_) {}
    }

    // Fallback: Convert any image (WebP, unsupported PNG/JPG) via Canvas
    return new Promise<any>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const w = img.naturalWidth || img.width || 800;
          const h = img.naturalHeight || img.height || 600;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context failure');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(async (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('Image conversion failed'));
              return;
            }
            try {
              const buf = await blob.arrayBuffer();
              const embedded = await pdfDoc.embedJpg(new Uint8Array(buf));
              resolve(embedded);
            } catch (err) {
              reject(err);
            }
          }, 'image/jpeg', 0.92);
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image: ${file.name}`));
      };
      img.src = url;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const embeddedImage = await embedImageInPdf(pdfDoc, item.file);
        const { width: imgWidth, height: imgHeight } = embeddedImage;

        let pageWidth = 595.28; // default A4 portrait (points)
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        if (pageSize !== 'fit' && orientation === 'landscape') {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate proportional scale inside margins
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;
        const scale = Math.min(usableWidth / imgWidth, usableHeight / imgHeight, 1);

        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        // Center on the page
        const x = margin + (usableWidth - drawWidth) / 2;
        const y = margin + (usableHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to convert images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const totalSizeKb = Math.round(images.reduce((acc, cur) => acc + cur.size, 0) / 1024);

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
              <span>High-Speed PDF Creator • Zero Uploads</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              JPG to PDF Converter
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Convert and merge multiple JPG, PNG, and WebP images into a single professional PDF document. Fast, safe, and 100% private.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Client-Side Secure</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Workspace (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]' 
                : 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/jpeg,image/png,image/webp" 
              multiple 
              className="hidden" 
            />
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <FileImage className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">
                Click to upload images, or drag & drop here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, and WebP images. Select multiple files at once.
              </p>
            </div>
            <button 
              type="button" 
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Select Images</span>
            </button>
          </div>

          {/* Selected Images List & Ordering */}
          {images.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Selected Images ({images.length})
                  </h3>
                  <span className="text-xs text-slate-400">• Total ~{totalSizeKb} KB</span>
                </div>
                <button
                  onClick={() => {
                    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
                    setImages([]);
                    setDownloadUrl(null);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {images.map((img, idx) => (
                  <div 
                    key={img.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.previewUrl} 
                        alt={img.name} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-0.5 left-0.5 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate" title={img.name}>
                        {img.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {Math.round(img.size / 1024)} KB
                      </p>

                      <div className="flex items-center gap-1 mt-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, 'up')}
                          className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, 'down')}
                          className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeImage(img.id)}
                          className="p-1 rounded bg-white hover:bg-rose-50 border border-slate-200 text-rose-500 ml-auto"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Sidebar Controls (1 column) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
              <Settings2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">PDF Document Settings</h3>
            </div>

            <div className="space-y-4">
              {/* Page Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'a4', label: 'A4' },
                    { id: 'letter', label: 'US Letter' },
                    { id: 'fit', label: 'Fit Image' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPageSize(item.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        pageSize === item.id 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              {pageSize !== 'fit' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'portrait', label: '📄 Portrait' },
                      { id: 'landscape', label: '📑 Landscape' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setOrientation(item.id as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          orientation === item.id 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Margins */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Page Margins
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'None' },
                    { val: 20, label: 'Small' },
                    { val: 40, label: 'Big' },
                  ].map((m) => (
                    <button
                      key={m.val}
                      onClick={() => setMargin(m.val)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        margin === m.val 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Convert CTA Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={images.length === 0 || isConverting}
                  onClick={convertToPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating PDF Document...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-4 h-4" />
                      <span>Convert to PDF ({images.length} {images.length === 1 ? 'image' : 'images'})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Download Ready Section */}
              {downloadUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your PDF is ready!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download="OmniTools-Converted-Images.pdf"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Document</span>
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