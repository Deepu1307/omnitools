import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
        Oops! This tool doesn&apos;t exist yet.
      </h1>

      <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
        The tool or page you are looking for may have moved or doesn&apos;t exist. Explore our 30+ client-side utilities or return to the main dashboard.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm shadow-indigo-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All 30+ Tools</span>
        </Link>
        <Link
          href="/contact"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Request This Tool</span>
        </Link>
      </div>
    </div>
  );
}
