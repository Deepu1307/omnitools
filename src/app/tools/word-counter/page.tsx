'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Type, 
  ArrowLeft, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Trash2, 
  AlignLeft,
  Volume2,
  FileCheck
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function WordCounterPage() {
  const [text, setText] = useState<string>(
    'OmniTools provides fast, private, client-side tools for everyday users. You can count words, transform text formatting, and check social media limits in real-time.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Stats calculation
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (200 words/min) and speaking time (130 words/min)
  const readingTimeMinutes = (words / 200).toFixed(1);
  const speakingTimeMinutes = (words / 130).toFixed(1);

  // Social media character limits
  const twitterLimit = 280;
  const linkedinLimit = 3000;
  const instagramLimit = 2200;

  // Transformations
  const toTitleCase = () => {
    const res = text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
    setText(res);
  };

  const toSentenceCase = () => {
    const res = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(res);
  };

  const toCamelCase = () => {
    const res = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    setText(res);
  };

  const toSnakeCase = () => {
    const res = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    setText(res);
  };

  const cleanExtraSpaces = () => {
    const res = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
    setText(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
          <Type className="w-3.5 h-3.5" />
          <span>Everyday Essential • Real-Time Stats & Case Formatter</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smart Word Counter & Text Formatter</h1>
        <p className="text-sm text-slate-500 mt-1">Instant word, character, sentence count, reading time estimates, and one-click text case transformations.</p>
      </div>

      {/* Main Stats Header Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Words</span>
          <span className="text-2xl font-black text-indigo-600">{words.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Characters</span>
          <span className="text-2xl font-black text-slate-800">{charsWithSpaces.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">No Spaces</span>
          <span className="text-2xl font-black text-slate-800">{charsNoSpaces.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Sentences</span>
          <span className="text-2xl font-black text-slate-800">{sentences}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Paragraphs</span>
          <span className="text-2xl font-black text-slate-800">{paragraphs}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => setText('')}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            placeholder="Type or paste your text here to count words and transform formatting..."
            className="w-full flex-1 text-sm p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none text-slate-800"
          />

          {/* Quick Case Formatter Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">1-Click Formatters:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setText(text.toUpperCase())}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setText(text.toLowerCase())}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                lowercase
              </button>
              <button
                onClick={toTitleCase}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Title Case
              </button>
              <button
                onClick={toSentenceCase}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Sentence case
              </button>
              <button
                onClick={toCamelCase}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                camelCase
              </button>
              <button
                onClick={toSnakeCase}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                snake_case
              </button>
              <button
                onClick={cleanExtraSpaces}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
              >
                Clean Spaces
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Reading Time & Social Limits */}
        <div className="space-y-6">
          {/* Reading & Speaking Estimates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Time Estimates</h4>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Reading Time</span>
                <span className="font-bold text-slate-900 text-base">{readingTimeMinutes} min</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Speaking Time</span>
                <span className="font-bold text-slate-900 text-base">{speakingTimeMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Social Character Limits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Social Media Limits</h4>

            {/* Twitter */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Twitter / X</span>
                <span className={charsWithSpaces > twitterLimit ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {charsWithSpaces} / {twitterLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (charsWithSpaces / twitterLimit) * 100)}%` }}
                  className={`h-full transition-all ${charsWithSpaces > twitterLimit ? 'bg-rose-500' : 'bg-sky-500'}`}
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>LinkedIn Post</span>
                <span className={charsWithSpaces > linkedinLimit ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {charsWithSpaces} / {linkedinLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (charsWithSpaces / linkedinLimit) * 100)}%` }}
                  className={`h-full transition-all ${charsWithSpaces > linkedinLimit ? 'bg-rose-500' : 'bg-blue-600'}`}
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Instagram Caption</span>
                <span className={charsWithSpaces > instagramLimit ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {charsWithSpaces} / {instagramLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (charsWithSpaces / instagramLimit) * 100)}%` }}
                  className={`h-full transition-all ${charsWithSpaces > instagramLimit ? 'bg-rose-500' : 'bg-rose-500'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
