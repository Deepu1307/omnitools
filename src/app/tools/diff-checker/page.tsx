'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Split, 
  ArrowLeft, 
  Sparkles, 
  ArrowLeftRight, 
  Check, 
  Trash2,
  FileText
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function DiffCheckerPage() {
  const [originalText, setOriginalText] = useState<string>(
    'The client agrees to pay the service provider on a monthly basis.\nPayment is due within 30 days of invoice.\nAll services are provided as-is without additional warranties.'
  );
  const [modifiedText, setModifiedText] = useState<string>(
    'The client agrees to pay the service provider on a bi-weekly basis.\nPayment is due within 14 days of invoice.\nAll services are provided with a 100% satisfaction guarantee.'
  );

  const getDiffLines = () => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');
    const maxLen = Math.max(origLines.length, modLines.length);
    const diff = [];

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] ?? null;
      const mod = modLines[i] ?? null;

      if (orig === mod) {
        diff.push({ type: 'same', orig, mod });
      } else {
        if (orig !== null && mod !== null) {
          diff.push({ type: 'changed', orig, mod });
        } else if (orig !== null) {
          diff.push({ type: 'removed', orig, mod: '' });
        } else {
          diff.push({ type: 'added', orig: '', mod });
        }
      }
    }
    return diff;
  };

  const diffLines = getDiffLines();
  const changedCount = diffLines.filter((d) => d.type !== 'same').length;

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
            <Split className="w-3.5 h-3.5" />
            <span>Daily Essential • Compare Documents & Text Drafts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Text & Document Diff Checker</h1>
          <p className="text-sm text-slate-500 mt-1">Compare two text drafts, contracts, or code snippets side-by-side with color-coded additions and deletions.</p>
        </div>

        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap Texts</span>
        </button>
      </div>

      {/* Input Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Original Text</span>
            <button onClick={() => setOriginalText('')} className="text-xs text-slate-400 hover:text-rose-500">Clear</button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={8}
            placeholder="Paste original text or draft here..."
            className="w-full flex-1 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-mono resize-none leading-relaxed text-slate-800"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Modified / New Text</span>
            <button onClick={() => setModifiedText('')} className="text-xs text-slate-400 hover:text-rose-500">Clear</button>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            rows={8}
            placeholder="Paste modified text here to compare changes..."
            className="w-full flex-1 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-mono resize-none leading-relaxed text-slate-800"
          />
        </div>
      </div>

      {/* Comparison View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Side-by-Side Comparison</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {changedCount} difference{changedCount === 1 ? '' : 's'} detected
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Removed
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Added
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 text-slate-100 font-mono text-xs">
          <div className="divide-y divide-slate-800">
            {diffLines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-2 divide-x divide-slate-800">
                {/* Original side */}
                <div className={`p-3 whitespace-pre-wrap leading-relaxed ${
                  line.type === 'changed' || line.type === 'removed' ? 'bg-rose-950/60 text-rose-200' : 'text-slate-300'
                }`}>
                  <span className="text-slate-500 select-none mr-2">{idx + 1}</span>
                  {line.orig || <span className="text-slate-600 select-none">-</span>}
                </div>

                {/* Modified side */}
                <div className={`p-3 whitespace-pre-wrap leading-relaxed ${
                  line.type === 'changed' || line.type === 'added' ? 'bg-emerald-950/60 text-emerald-200' : 'text-slate-300'
                }`}>
                  <span className="text-slate-500 select-none mr-2">{idx + 1}</span>
                  {line.mod || <span className="text-slate-600 select-none">-</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
