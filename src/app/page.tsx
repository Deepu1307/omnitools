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
  ShieldAlert,
  Scan,
  Crop,
  Share2,
  Type,
  Split,
  Scale,
  Activity,
  Flame,
  Receipt,
  BadgePercent,
  MessageSquare,
  FileImage,
  PenTool,
  Stamp,
  RotateCw,
  Star,
  Briefcase,
  Calculator,
  UserCheck
} from 'lucide-react';
import { TOOLS, Tool, PROFESSIONS, Profession } from '@/types/tools';
import AdBanner from '@/components/AdBanner';

function HomeContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'categories' | 'professions'>('categories');
  const [shortcutKey, setShortcutKey] = useState<string>('⌘K');
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform);
      setShortcutKey(isApple ? '⌘K' : 'Ctrl K');
      try {
        const saved = localStorage.getItem('omnitools_favorites');
        if (saved) setBookmarkedToolIds(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const toggleBookmark = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedToolIds((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem('omnitools_favorites', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const categories = [
    { id: 'all', label: 'All Tools', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'popular', label: 'Popular', icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> },
    { id: 'daily', label: 'Daily Essentials', icon: <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> },
    { id: 'business', label: 'Business & Local', icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'health', label: 'Health & Fitness', icon: <Activity className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'media', label: 'Image & Video', icon: <ImageIcon className="w-3.5 h-3.5 text-sky-500" /> },
    { id: 'pdf', label: 'PDF Utilities', icon: <FileText className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'calculator', label: 'Finance & Calc', icon: <Calculator className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'security', label: 'Security & Dev', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> },
  ];

  // Reactively sync category and profession whenever URL query params change
  useEffect(() => {
    const prof = searchParams.get('profession');
    const cat = searchParams.get('category');

    if (prof && PROFESSIONS.some((p) => p.id === prof)) {
      setViewMode('professions');
      setSelectedProfession(prof);
    } else if (cat && categories.some((c) => c.id === cat)) {
      setViewMode('categories');
      setSelectedCategory(cat);
    } else if (!cat && !prof) {
      setSelectedCategory('all');
      setSelectedProfession('all');
    }
  }, [searchParams]);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (viewMode === 'professions') {
      if (selectedProfession === 'all') return true;
      return tool.professions?.includes(selectedProfession as Profession);
    }

    // Category mode
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return tool.isPopular;
    if (selectedCategory === 'daily') return tool.badge?.includes('Daily') || tool.category === 'text';
    if (selectedCategory === 'business') return tool.category === 'business';
    if (selectedCategory === 'health') return tool.category === 'health';
    if (selectedCategory === 'security') return tool.category === 'security' || tool.category === 'developer';
    return tool.category === selectedCategory;
  });

  const activeProfessionMeta = PROFESSIONS.find((p) => p.id === selectedProfession);
  const bookmarkedTools = TOOLS.filter((t) => bookmarkedToolIds.includes(t.id));

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
      case 'ScanIcon': return <Scan className="w-6 h-6 text-emerald-600" />;
      case 'CropIcon': return <Crop className="w-6 h-6 text-sky-600" />;
      case 'Share2Icon': return <Share2 className="w-6 h-6 text-rose-600" />;
      case 'TypeIcon': return <Type className="w-6 h-6 text-indigo-600" />;
      case 'SplitIcon': return <Split className="w-6 h-6 text-purple-600" />;
      case 'ScaleIcon': return <Scale className="w-6 h-6 text-emerald-600" />;
      case 'ActivityIcon': return <Activity className="w-6 h-6 text-emerald-600" />;
      case 'FlameIcon': return <Flame className="w-6 h-6 text-amber-600" />;
      case 'ReceiptIcon': return <Receipt className="w-6 h-6 text-indigo-600" />;
      case 'BadgePercentIcon': return <BadgePercent className="w-6 h-6 text-emerald-600" />;
      case 'MessageSquareIcon': return <MessageSquare className="w-6 h-6 text-emerald-600" />;
      case 'FileImageIcon': return <FileImage className="w-6 h-6 text-indigo-600" />;
      case 'PenToolIcon': return <PenTool className="w-6 h-6 text-indigo-600" />;
      case 'StampIcon': return <Stamp className="w-6 h-6 text-amber-600" />;
      case 'RotateCwIcon': return <RotateCw className="w-6 h-6 text-sky-600" />;
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
              {shortcutKey}
            </kbd>
          </div>
        </div>

        {/* View Mode Switcher: Categories vs. Profession Suites */}
        <div id="tools" className="mt-8 mb-4 inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-2xs scroll-mt-24">
          <button
            onClick={() => {
              setViewMode('categories');
              const url = new URL(window.location.href);
              url.searchParams.delete('profession');
              window.history.pushState({}, '', url.toString());
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'categories'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse by Utility</span>
          </button>
          <button
            onClick={() => {
              setViewMode('professions');
              const url = new URL(window.location.href);
              url.searchParams.delete('category');
              window.history.pushState({}, '', url.toString());
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'professions'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Browse by Profession Suite</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
              NEW
            </span>
          </button>
        </div>

        {/* Filter Pills: Categories Mode */}
        {viewMode === 'categories' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const url = new URL(window.location.href);
                  if (cat.id === 'all') url.searchParams.delete('category');
                  else url.searchParams.set('category', cat.id);
                  window.history.pushState({}, '', url.toString());
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filter Pills: Professions Mode */}
        {viewMode === 'professions' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <button
              onClick={() => {
                setSelectedProfession('all');
                const url = new URL(window.location.href);
                url.searchParams.delete('profession');
                window.history.pushState({}, '', url.toString());
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedProfession === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>🌐</span>
              <span>All Professions</span>
            </button>
            {PROFESSIONS.map((prof) => (
              <button
                key={prof.id}
                onClick={() => {
                  setSelectedProfession(prof.id);
                  const url = new URL(window.location.href);
                  url.searchParams.set('profession', prof.id);
                  window.history.pushState({}, '', url.toString());
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedProfession === prof.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{prof.emoji}</span>
                <span>{prof.shortLabel}</span>
              </button>
            ))}
          </div>
        )}

        {/* Active Profession Showcase Header Banner */}
        {viewMode === 'professions' && activeProfessionMeta && selectedProfession !== 'all' && (
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white text-left max-w-2xl mx-auto shadow-sm border border-slate-800">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="text-3xl p-2 rounded-xl bg-white/10 shrink-0">{activeProfessionMeta.emoji}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeProfessionMeta.name}</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {activeProfessionMeta.tagline}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeProfessionMeta.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Monetization / Partner Banner */}
      <AdBanner slot="top-banner" />

      {/* Tools Grid */}
      <div className="mt-8">
        {/* Pinned Favorites Row (If any bookmarked) */}
        {bookmarkedTools.length > 0 && searchQuery === '' && selectedCategory === 'all' && selectedProfession === 'all' && (
          <div className="mb-10 p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">My Pinned Quick-Access Tools</h3>
                <span className="text-xs font-medium text-slate-500">({bookmarkedTools.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">Stored privately in your browser</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedTools.map((tool) => (
                <Link
                  key={`pinned-${tool.id}`}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50">
                      {getToolIcon(tool.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(e, tool.id)}
                    className="text-amber-500 hover:text-slate-300 p-1 transition-colors"
                    title="Unpin tool"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {viewMode === 'professions'
              ? (selectedProfession === 'all' ? 'All Professional Tool Suites' : `${activeProfessionMeta?.emoji} ${activeProfessionMeta?.name} Suite`)
              : (selectedCategory === 'all' ? 'All Free Tools' : `${categories.find(c => c.id === selectedCategory)?.label}`)}
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
                setSelectedProfession('all');
                const url = new URL(window.location.href);
                url.searchParams.delete('category');
                url.searchParams.delete('profession');
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
                    <div className="flex items-center gap-1.5">
                      {tool.badge && (
                        <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                          {tool.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleBookmark(e, tool.id)}
                        title={bookmarkedToolIds.includes(tool.id) ? 'Remove from favorites' : 'Pin to favorites'}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-amber-500 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${bookmarkedToolIds.includes(tool.id) ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    </div>
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
