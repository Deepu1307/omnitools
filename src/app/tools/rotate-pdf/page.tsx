'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  RotateCw, 
  RotateCcw, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileText
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

interface PageItem {
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270
}

export default function RotatePdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setError(null);
    setDownloadUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = loadedDoc.getPageCount();
      
      const newPages: PageItem[] = Array.from({ length: count }, (_, i) => {
        const page = loadedDoc.getPage(i);
        const initialRotation = page.getRotation().angle || 0;
        return {
          pageNumber: i + 1,
          rotation: initialRotation,
        };
      });

      setPdfFile(file);
      setPages(newPages);
    } catch (err: any) {
      console.error(err);
      setError('Could not open PDF file. Make sure it is not corrupted or password-protected.');
    }
  };

  const rotatePage = (index: number, delta: number) => {
    setPages((prev) => {
      const copy = [...prev];
      const newAngle = (copy[index].rotation + delta + 360) % 360;
      copy[index] = { ...copy[index], rotation: newAngle };
      return copy;
    });
    setDownloadUrl(null);
  };

  const rotateAll = (delta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + delta + 360) % 360,
      }))
    );
    setDownloadUrl(null);
  };

  const resetAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 })));
    setDownloadUrl(null);
  };

  const saveRotatedPdf = async () => {
    if (!pdfFile || pages.length === 0) return;
    setIsRotating(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);

      pages.forEach((p, idx) => {
        const page = pdfDoc.getPage(idx);
        page.setRotation(degrees(p.rotation));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to rotate PDF. Please try again.');
    } finally {
      setIsRotating(false);
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
              <span>Instant Page Alignment • Zero Uploads</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rotate PDF Pages
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Permanently rotate PDF pages 90°, 180°, or 270°. Rotate individual pages or all pages at once with zero uploads.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% In-Browser</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workspace: PDF Upload & Page Grid (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {!pdfFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePdfUpload} 
                accept="application/pdf" 
                className="hidden" 
              />
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-indigo-100 flex items-center justify-center text-indigo-600">
                <RotateCw className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">
                  Select PDF file to rotate
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Rotate scanned documents, sideways pages, or entire PDFs.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Batch Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{pdfFile.name}</span>
                  <span className="text-xs text-slate-400">({pages.length} pages)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rotateAll(90)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-700 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Rotate All +90°</span>
                  </button>
                  <button
                    onClick={() => rotateAll(-90)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-700 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Rotate All -90°</span>
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Page Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs max-h-[500px] overflow-y-auto">
                {pages.map((p, idx) => (
                  <div 
                    key={p.pageNumber}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white transition-all text-center"
                  >
                    <div className="w-24 h-32 rounded-lg border border-slate-300 bg-white shadow-2xs flex items-center justify-center relative overflow-hidden transition-transform duration-300">
                      <div 
                        style={{ transform: `rotate(${p.rotation}deg)` }}
                        className="transition-transform duration-300 flex flex-col items-center justify-center p-2 text-slate-400 select-none"
                      >
                        <FileText className="w-8 h-8 text-indigo-400 mb-1" />
                        <span className="text-[10px] font-mono font-bold text-slate-600">PAGE {p.pageNumber}</span>
                        <div className="w-12 h-1 bg-slate-200 rounded mt-1" />
                        <div className="w-10 h-1 bg-slate-200 rounded mt-0.5" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1 rounded">
                        {p.rotation}°
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-700 mt-2">
                      Page {p.pageNumber}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => rotatePage(idx, -90)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 shadow-2xs"
                        title="Rotate left 90°"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => rotatePage(idx, 90)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 shadow-2xs"
                        title="Rotate right 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
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

        {/* Sidebar (1 column) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Export Rotated PDF
            </h3>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Clicking save permanently applies the new rotation angles to each page in your PDF document.
              </p>

              <button
                disabled={!pdfFile || isRotating}
                onClick={saveRotatedPdf}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isRotating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Rotation...</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4" />
                    <span>Save & Rotate PDF</span>
                  </>
                )}
              </button>

              {downloadUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PDF Rotated Successfully!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`Rotated-${pdfFile?.name || 'document.pdf'}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Rotated PDF</span>
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