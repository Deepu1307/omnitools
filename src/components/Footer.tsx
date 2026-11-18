'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock, Mail } from 'lucide-react';
import { TOOLS } from '@/types/tools';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      {/* Trust & Privacy Highlights */}
      <div className="border-b border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">100% Privacy Focused</h5>
              <p className="text-xs text-slate-500">Files and inputs are processed locally in your browser. Never uploaded to servers.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">Blazing Fast Speed</h5>
              <p className="text-xs text-slate-500">Zero queue time, no bandwidth limits, and instant results on any device.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">Always Free & No Watermarks</h5>
              <p className="text-xs text-slate-500">Supported by non-intrusive sponsorships and developer contributions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <span className="font-bold text-lg text-slate-900">OmniTools.io</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated suite of free, high-speed, client-side tools designed for creators, developers, students, and everyday internet users.
            </p>
          </div>

          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Consumer & Media</h6>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/tools/image-resizer" className="hover:text-indigo-600">Image Resizer & Compressor</Link></li>
              <li><Link href="/tools/background-remover" className="hover:text-indigo-600">Background Remover</Link></li>
              <li><Link href="/tools/pdf-splitter" className="hover:text-indigo-600">PDF Splitter & Extractor</Link></li>
              <li><Link href="/tools/video-clipper" className="hover:text-indigo-600">Video Clipper & Trimmer</Link></li>
              <li><Link href="/tools/age-calculator" className="hover:text-indigo-600">Age & Milestone Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Developer & Cloud</h6>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/tools/json-to-types" className="hover:text-indigo-600">JSON to Types (TS/Python/Go)</Link></li>
              <li><Link href="/tools/cloud-cost-calculator" className="hover:text-indigo-600">Cloud Storage & Egress Estimator</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Stay Updated</h6>
            <p className="text-xs text-slate-500 mb-3">
              Get notified when we launch new free tools and productivity utilities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} OmniTools. Built with privacy and speed in mind.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
