'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Heart, Search, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">OmniTools<span className="text-indigo-600">.io</span></span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Free Client-Side Tools</span>
          </div>
        </Link>

        {/* Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/#popular" className="hover:text-indigo-600 transition-colors">Popular Tools</Link>
          <Link href="/#media" className="hover:text-indigo-600 transition-colors">Image & Video</Link>
          <Link href="/#pdf" className="hover:text-indigo-600 transition-colors">PDF Tools</Link>
          <Link href="/#developer" className="hover:text-indigo-600 transition-colors">Developer Tools</Link>
          <Link href="/#calculators" className="hover:text-indigo-600 transition-colors">Calculators</Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span className="hidden sm:inline">Support Creator</span>
          </a>
        </div>
      </div>
    </header>
  );
}
