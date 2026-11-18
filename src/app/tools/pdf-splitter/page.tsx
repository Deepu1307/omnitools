'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Layers,
  FileCheck
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '@/components/AdBanner';

export default function PdfSplitterPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF document.');
      return;
    }

    setErrorMessage('');
    setPdfFile(file);
    setIsProcessing(true);
    setStatusMessage('Reading PDF structure...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const total = pdfDoc.getPageCount();
      setPageCount(total);
      setRangeInput(total > 1 ? `1-${Math.min(3, total)}` : '1');
      setStatusMessage('');
    } catch (err) {
      setErrorMessage('Failed to parse PDF file. Ensure the file is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            pages.add(i - 1); // 0-based
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!pdfFile || pageCount === 0) return;
    setIsProcessing(true);
    setStatusMessage('Extracting selected pages...');

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const targetIndices = parseRanges(rangeInput, pageCount);

      if (targetIndices.length === 0) {
        setErrorMessage('Please specify at least one valid page number or range.');
        setIsProcessing(false);
        return;
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, targetIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setErrorMessage('');
      setStatusMessage(`Extracted ${targetIndices.length} page(s) successfully!`);
    } catch (err) {
      setErrorMessage('Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Private PDF Utility • Documents Never Uploaded</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PDF Splitter & Page Extractor</h1>
        <p className="text-sm text-slate-500 mt-1">Separate specific pages, chapters, or ranges from PDF files directly in your web browser.</p>
      </div>

      {!pdfFile ? (
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
            accept="application/pdf"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Select or Drag Your PDF Document</h3>
          <p className="text-xs text-slate-400 mt-1.5">No file size limits. 100% processed securely on your computer.</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow">
            Browse PDF File
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{pdfFile.name}</h4>
                <p className="text-xs text-slate-400">
                  {pageCount} page{pageCount === 1 ? '' : 's'} • {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => { setPdfFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium"
            >
              Choose Different PDF
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Page Range to Extract
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSplitPdf}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Extract Pages'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tip: You can use hyphens for ranges (e.g. <code>1-5</code>) and commas for individual pages (e.g. <code>1, 3, 7</code>). Maximum page: {pageCount}.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {downloadUrl && (
            <div className="pt-2">
              <a
                href={downloadUrl}
                download={`extracted-${pdfFile.name}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Extracted PDF</span>
              </a>
            </div>
          )}
        </div>
      )}

      <AdBanner slot="in-tool" />
    </div>
  );
}
