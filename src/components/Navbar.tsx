'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, Heart, Search, Command, ChevronDown } from 'lucide-react';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      setTimeout(() => {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Bar */}
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Brand Logo - Fixed & Never Shrinks */}
            <Link 
              href="/" 
              className="flex items-center gap-3 shrink-0 group py-1"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  OmniTools<span className="text-indigo-600">.io</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1 leading-none">
                  Free Client-Side Tools
                </span>
              </div>
            </Link>

            {/* Quick Search Bar (Cmd+K trigger) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 text-xs font-medium transition-all shadow-2xs max-w-xs w-60 shrink-0"
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="flex-1 text-left text-slate-500 truncate">Quick search tools...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Right Action: Support Creator Button & Mobile Search */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 border border-slate-200"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
              >
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                <span>Support Creator</span>
              </a>
            </div>
          </div>

          {/* Secondary Streamlined Category Bar (Horizontal Scrollable on all devices) */}
          <div className="border-t border-slate-100 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth text-xs font-semibold whitespace-nowrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 shrink-0">
              Categories:
            </span>
            <Link 
              href="/?category=daily#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 transition-colors shrink-0 font-bold"
            >
              ⚡ Daily Essentials
            </Link>
            <Link 
              href="/?category=business#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              💼 Business & Local
            </Link>
            <Link 
              href="/?category=health#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              🥗 Health & BMI
            </Link>
            <Link 
              href="/?category=media#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              📸 Image & Video
            </Link>
            <Link 
              href="/?category=pdf#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              📄 PDF Utilities
            </Link>
            <Link 
              href="/?category=calculator#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              💰 Finance & Calc
            </Link>
            <Link 
              href="/?category=security#tools" 
              onClick={handleNavClick}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              🔐 Security & Dev
            </Link>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
