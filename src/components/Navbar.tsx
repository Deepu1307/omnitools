'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, Heart, Search, Command } from 'lucide-react';
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
    // If on homepage, smooth-scroll down to tools
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      setTimeout(() => {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo - Returns Home and resets */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">OmniTools<span className="text-indigo-600">.io</span></span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Free Client-Side Tools</span>
            </div>
          </Link>

          {/* Quick Search Bar / Cmd+K trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-400 text-xs font-medium transition-all shadow-sm max-w-xs w-56 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-left text-slate-500">Quick search...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Nav Categories: Filter tools directly on homepage or return to home with filter */}
          <nav className="hidden md:flex items-center gap-3.5 lg:gap-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Link 
              href="/?category=daily#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors text-indigo-600 font-bold"
            >
              ⚡ Daily
            </Link>
            <Link 
              href="/?category=popular#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors"
            >
              Popular
            </Link>
            <Link 
              href="/?category=media#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors"
            >
              Media
            </Link>
            <Link 
              href="/?category=pdf#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors"
            >
              PDF
            </Link>
            <Link 
              href="/?category=calculator#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors"
            >
              Finance & Calc
            </Link>
            <Link 
              href="/?category=security#tools" 
              onClick={handleNavClick}
              className="hover:text-indigo-600 transition-colors"
            >
              Security & Dev
            </Link>
          </nav>

          {/* Mobile search trigger + Support Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span className="hidden sm:inline">Support Creator</span>
            </a>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
