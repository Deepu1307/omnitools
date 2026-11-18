'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ImageIcon, 
  Scissors, 
  FileText, 
  Calendar, 
  Video, 
  Code2, 
  Cloud, 
  Search, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  QrCode,
  TrendingUp,
  Layers,
  Key,
  ShieldAlert
} from 'lucide-react';
import { TOOLS, Tool } from '@/types/tools';
import AdBanner from '@/components/AdBanner';

function HomeContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'popular', label: '⭐ Popular' },
    { id: 'media', label: 'Image & Video' },
    { id: 'pdf', label: 'PDF Utilities' },
    { id: 'calculator', label: 'Finance & Calc' },
    { id: 'security', label: 'Security & Dev' },
  ];

  // Reactively sync category whenever URL query params change (e.g. from nav clicks)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return tool.isPopular;
    if (selectedCategory === 'security') return tool.category === 'security' || tool.category === 'developer';
    return tool.category === selectedCategory;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'ImageIcon': return <ImageIcon className="w-6 h-6 text-sky-500" />;
      case 'ScissorsIcon': return <Scissors className="w-6 h-6 text-rose-500" />;
      case 'FileTextIcon': return <FileText className="w-6 h-6 text-emerald-500" />;
      case 'CalendarIcon': return <Calendar className="w-6 h-6 text-amber-500" />;
      case 'VideoIcon': return <Video className="w-6 h-6 text-purple-500" />;
      case 'CodeIcon': return <Code2 className="w-6 h-6 text-indigo-500" />;
      case 'CloudIcon': return <Cloud className="w-6 h-6 text-cyan-500" />;
      case 'QrCodeIcon': return <QrCode className="w-6 h-6 text-indigo-600" />;
      case 'TrendingUpIcon': return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'LayersIcon': return <Layers className="w-6 h-6 text-teal-600" />;
      case 'ShieldAlertIcon': return <ShieldAlert className="w-6 h-6 text-rose-600" />;
      case 'KeyIcon': return <Key className="w-6 h-6 text-amber-600" />;
      default: return <Sparkles className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Server Uploads • 100% Client-Side Privacy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Essential Everyday Tools, <br />
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Built for Pure Speed & Privacy
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Free, private, in-browser utilities for photos, videos, PDFs, calculations, and developer workflows. No signup, no watermarks, no bandwidth caps.
        </p>

        {/* Search Bar with Cmd+K hint */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g., qr code, split pdf, age, password)..."
            className="w-full pl-11 pr-16 py-3.5 text-sm sm:text-base rounded-2xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Category Pills */}
        <div id="tools" className="flex flex-wrap items-center justify-center gap-2 mt-6 scroll-mt-24">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                // Also reflect in URL without full reload
                const url = new URL(window.location.href);
                if (cat.id === 'all') url.searchParams.delete('category');
                else url.searchParams.set('category', cat.id);
                window.history.pushState({}, '', url.toString());
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Monetization / Partner Banner */}
      <AdBanner slot="top-banner" />

      {/* Tools Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {selectedCategory === 'all' ? 'All Free Tools' : `${categories.find(c => c.id === selectedCategory)?.label}`}
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No tools found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => { 
                setSearchQuery(''); 
                setSelectedCategory('all');
                const url = new URL(window.location.href);
                url.searchParams.delete('category');
                window.history.pushState({}, '', url.toString());
              }}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      {getToolIcon(tool.icon)}
                    </div>
                    {tool.badge && (
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SEO & Features Section */}
      <section className="mt-20 pt-12 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Millions Prefer Client-Side Browser Tools
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Traditional online converters upload your personal documents and media to third-party servers. OmniTools works completely differently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Strict Client-Side Privacy</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every operation runs locally using your computer&apos;s WebAssembly and JavaScript engine. Your photos, private documents, and passwords never leave your browser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Server Wait Times</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Skip uploading 50MB files over slow connections. Processing happens instantly on your device, saving bandwidth and precious time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">No Paywalls or Hidden Watermarks</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Export clean, high-resolution media and files without surprise subscriptions or ugly watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-Page Monetization Banner */}
      <AdBanner slot="footer-banner" className="mt-14" />

      {/* Frequently Asked Questions */}
      <section className="mt-16 bg-white rounded-2xl border border-slate-200/80 p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-800 text-base mb-1">Are my files, passwords, and photos safe?</h4>
            <p className="text-slate-500 leading-relaxed">
              Yes, 100%. Unlike most file conversion websites, our tools do not upload your media to any server or cloud database. All transformations are executed directly inside your web browser.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-base mb-1">How does OmniTools stay free?</h4>
            <p className="text-slate-500 leading-relaxed">
              We cover development and hosting costs through non-intrusive sponsorships and partner advertisements. We will never sell user data or add paywalls to core functionality.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-base mb-1">Can I use these tools offline?</h4>
            <p className="text-slate-500 leading-relaxed">
              Once a page is loaded, the tools continue running even if your internet connection disconnects, because all code executes locally on your device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading tools...</div>}>
      <HomeContent />
    </Suspense>
  );
}
