'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  PenTool, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Calendar,
  User,
  RotateCcw,
  Check
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

export default function SignPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState<string>('');
  const [penColor, setPenColor] = useState<string>('#0f172a'); // slate-900 / black
  const [penSize, setPenSize] = useState<number>(2.5);
  const [includeDate, setIncludeDate] = useState<boolean>(true);
  const [includeName, setIncludeName] = useState<boolean>(false);
  const [signaturePosition, setSignaturePosition] = useState<'bottom-right' | 'bottom-left' | 'bottom-center'>('bottom-right');
  const [signatureScale, setSignatureScale] = useState<'small' | 'medium' | 'large'>('medium');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const hasDrawnRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    hasDrawnRef.current = true;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setError(null);
    setDownloadUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = loadedDoc.getPageCount();
      setPdfFile(file);
      setPdfPageCount(count);
      setSelectedPage(1);
    } catch (err: any) {
      console.error(err);
      setError('Could not open PDF file. Make sure it is not corrupted or password-protected.');
    }
  };

  // Convert Type Signature or Canvas to PNG ArrayBuffer
  const getSignaturePngBytes = async (): Promise<Uint8Array | null> => {
    if (signatureMode === 'type') {
      if (!typedName.trim()) return null;
      const offscreen = document.createElement('canvas');
      offscreen.width = 450;
      offscreen.height = 160;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = penColor;
      ctx.font = 'italic 52px "Brush Script MT", "Caveat", "Segoe Script", cursive';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(typedName.trim(), offscreen.width / 2, offscreen.height / 2);

      return new Promise((resolve) => {
        offscreen.toBlob((blob) => {
          if (!blob) return resolve(null);
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      });
    } else {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawnRef.current) return null;

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      });
    }
  };

  const signAndExportPdf = async () => {
    if (!pdfFile) {
      setError('Please select a PDF document first.');
      return;
    }

    const signatureBytes = await getSignaturePngBytes();
    if (!signatureBytes) {
      setError('Please draw or type your signature before applying.');
      return;
    }

    setIsSigning(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const originalBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(originalBuffer);
      const pageIndex = Math.min(Math.max(selectedPage - 1, 0), pdfDoc.getPageCount() - 1);
      const targetPage = pdfDoc.getPage(pageIndex);
      const { width: pWidth, height: pHeight } = targetPage.getSize();

      // Embed signature image
      const sigImage = await pdfDoc.embedPng(signatureBytes);
      
      // Determine size
      let sigWidth = 140;
      if (signatureScale === 'small') sigWidth = 100;
      if (signatureScale === 'large') sigWidth = 180;
      const sigHeight = (sigImage.height / sigImage.width) * sigWidth;

      // Position logic
      let x = pWidth - sigWidth - 50; // default bottom-right
      let y = 60;

      if (signaturePosition === 'bottom-left') {
        x = 50;
      } else if (signaturePosition === 'bottom-center') {
        x = (pWidth - sigWidth) / 2;
      }

      // Draw the signature
      targetPage.drawImage(sigImage, {
        x,
        y,
        width: sigWidth,
        height: sigHeight,
      });

      // Draw Metadata text (Date, Signer) if checked
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let textY = y - 14;

      if (includeName && typedName.trim()) {
        targetPage.drawText(`Digitally Signed by: ${typedName.trim()}`, {
          x,
          y: textY,
          size: 8,
          font,
          color: rgb(0.3, 0.35, 0.4),
        });
        textY -= 12;
      }

      if (includeDate) {
        const dateStr = new Date().toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        targetPage.drawText(`Date: ${dateStr}`, {
          x,
          y: textY,
          size: 8,
          font,
          color: rgb(0.3, 0.35, 0.4),
        });
      }

      const signedBytes = await pdfDoc.save();
      const blob = new Blob([signedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign PDF. Please try again.');
    } finally {
      setIsSigning(false);
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
              <span>Legally Binding • 100% Private E-Sign</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign PDF Document Free
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Draw or type your signature and stamp it on contracts, forms, and agreements. 100% free with zero cloud uploads.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Uploads • Safe</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: PDF Selector & Signature Pad */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: PDF Document Upload */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900">Upload PDF Document</h3>
              </div>
              {pdfFile && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready ({pdfPageCount} {pdfPageCount === 1 ? 'page' : 'pages'})
                </span>
              )}
            </div>

            {!pdfFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePdfUpload} 
                  accept="application/pdf" 
                  className="hidden" 
                />
                <FileText className="w-8 h-8 text-indigo-500" />
                <p className="text-xs font-bold text-slate-700">Select PDF document to sign</p>
                <p className="text-[11px] text-slate-400">Contracts, invoices, lease agreements, or receipts</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 truncate">
                  <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{pdfFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {Math.round(pdfFile.size / 1024)} KB • {pdfPageCount} {pdfPageCount === 1 ? 'page' : 'pages'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setDownloadUrl(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Remove PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Signature Studio (Draw or Type) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">Create Your Signature</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSignatureMode('draw')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    signatureMode === 'draw' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  ✍️ Draw
                </button>
                <button
                  onClick={() => setSignatureMode('type')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    signatureMode === 'type' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  ⌨️ Type
                </button>
              </div>
            </div>

            {signatureMode === 'draw' ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Ink Color:</span>
                    <button
                      onClick={() => setPenColor('#0f172a')}
                      className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition-all ${penColor === '#0f172a' ? 'scale-125 border-indigo-500' : 'border-transparent'}`}
                      title="Black"
                    />
                    <button
                      onClick={() => setPenColor('#1d4ed8')}
                      className={`w-5 h-5 rounded-full bg-blue-700 border-2 transition-all ${penColor === '#1d4ed8' ? 'scale-125 border-indigo-500' : 'border-transparent'}`}
                      title="Navy Blue"
                    />
                    <button
                      onClick={() => setPenColor('#dc2626')}
                      className={`w-5 h-5 rounded-full bg-red-600 border-2 transition-all ${penColor === '#dc2626' ? 'scale-125 border-indigo-500' : 'border-transparent'}`}
                      title="Red"
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Pad</span>
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl bg-slate-50 overflow-hidden relative cursor-crosshair shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={180}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-44 touch-none"
                  />
                  <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-400 font-mono">
                    Sign inside the box
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Type your full legal name:
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Johnathan Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3"
                />
                {typedName && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Generated Signature Preview:
                    </p>
                    <p 
                      style={{ color: penColor }}
                      className="text-3xl italic font-serif py-2 tracking-wide"
                    >
                      {typedName}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Sidebar: Placement & Export */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Placement Options
            </h3>

            <div className="space-y-4">
              {/* Target Page */}
              {pdfPageCount > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sign On Page:
                  </label>
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {Array.from({ length: pdfPageCount }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1} of {pdfPageCount}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Position */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stamp Position:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'bottom-center', label: 'Center' },
                    { id: 'bottom-right', label: 'Bottom Right' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setSignaturePosition(pos.id as any)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        signaturePosition === pos.id 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Signature Size:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['small', 'medium', 'large'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSignatureScale(s)}
                      className={`px-2 py-1.5 rounded-xl text-xs capitalize font-bold border transition-all ${
                        signatureScale === s 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Add Timestamp Date Stamp</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeName}
                    onChange={(e) => setIncludeName(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Add Signer Name Label</span>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={!pdfFile || isSigning}
                  onClick={signAndExportPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSigning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing Document...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      <span>Sign & Save PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Download Ready Section */}
              {downloadUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Signed PDF Ready!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`Signed-${pdfFile?.name || 'document.pdf'}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed PDF</span>
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