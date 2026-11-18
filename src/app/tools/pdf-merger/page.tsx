'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Upload, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

interface UploadedPdfItem {
  id: string;
  file: File;
  pageCount: number;
}

export default function PdfMergerPage() {
  const [pdfItems, setPdfItems] = useState<UploadedPdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesUpload = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setStatus('Analyzing uploaded PDF files...');

    const newItems: UploadedPdfItem[] = [...pdfItems];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer);
          newItems.push({
            id: Math.random().toString(36).substring(7),
            file,
            pageCount: doc.getPageCount(),
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    setPdfItems(newItems);
    setIsProcessing(false);
    setStatus('');
    setDownloadUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const updated = [...pdfItems];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPdfItems(updated);
    setDownloadUrl(null);
  };

  const removeItem = (id: string) => {
    setPdfItems(pdfItems.filter((item) => item.id !== id));
    setDownloadUrl(null);
  };

  const handleMerge = async () => {
    if (pdfItems.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setStatus('Merging PDF pages into a single document...');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfItems) {
        const buffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus(`Successfully merged ${pdfItems.length} files (${mergedPdf.getPageCount()} total pages)!`);
    } catch (err) {
      alert('Failed to merge PDF files. Ensure files are not corrupted or protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = pdfItems.reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-File Combiner • 100% Client-Side Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PDF Merger & Combiner</h1>
        <p className="text-sm text-slate-500 mt-1">Combine multiple PDF documents into a single file in any order without uploading to servers.</p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFilesUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer bg-white transition-all shadow-sm hover:bg-slate-50/50 mb-8"
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
          accept="application/pdf"
          className="hidden"
        />
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-slate-800">Drop PDF Files Here or Click to Upload</h3>
        <p className="text-xs text-slate-400 mt-1.5">Upload 2 or more PDFs. You can reorder them before merging.</p>
        <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow">
          Select PDF Files
        </button>
      </div>

      {/* Reorder & Merge List */}
      {pdfItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base">Files to Merge ({pdfItems.length})</h4>
              <p className="text-xs text-slate-400">Total combined pages: {totalPages}</p>
            </div>
            <button
              onClick={() => { setPdfItems([]); setDownloadUrl(null); }}
              className="text-xs text-rose-500 hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {pdfItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">{item.file.name}</h5>
                    <span className="text-[11px] text-slate-400">{item.pageCount} page(s) • {(item.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === pdfItems.length - 1}
                    className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg ml-2"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {status && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{status}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleMerge}
              disabled={isProcessing || pdfItems.length < 2}
              className="flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Merging...' : `Merge ${pdfItems.length} PDF Files Now`}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="omnitools-merged.pdf"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </a>
            )}
          </div>
        </div>
      )}

      <AdBanner slot="in-tool" />
    </div>
  );
}
