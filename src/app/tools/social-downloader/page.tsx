'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Film,
  Music,
  Video
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function SocialDownloaderPage() {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedMedia, setExtractedMedia] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const detectPlatform = (url: string) => {
    if (url.includes('instagram.com')) return { name: 'Instagram Reel / Post', color: 'bg-rose-500' };
    if (url.includes('tiktok.com')) return { name: 'TikTok Video', color: 'bg-black' };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { name: 'YouTube Shorts', color: 'bg-red-600' };
    if (url.includes('twitter.com') || url.includes('x.com')) return { name: 'Twitter / X Clip', color: 'bg-slate-900' };
    if (url.includes('facebook.com') || url.includes('fb.watch')) return { name: 'Facebook Video', color: 'bg-blue-600' };
    return null;
  };

  const platform = detectPlatform(urlInput);

  const handleFetchMedia = () => {
    if (!urlInput || !urlInput.startsWith('http')) {
      setError('Please paste a valid public social media URL.');
      return;
    }

    setError('');
    setIsExtracting(true);

    // Simulate high-speed extraction engine
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedMedia({
        title: 'High-Definition Social Video Clip (Watermark Free)',
        platform: platform ? platform.name : 'Social Media Video',
        duration: '0:34',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        formats: [
          { quality: '1080p Full HD (MP4)', size: '14.2 MB', noWatermark: true },
          { quality: '720p HD (MP4)', size: '8.4 MB', noWatermark: true },
          { quality: 'Audio Only (MP3 320kbps)', size: '1.8 MB', isAudio: true }
        ]
      });
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 mb-3">
          <Share2 className="w-3.5 h-3.5" />
          <span>High-Speed Social Media Saver • No Watermark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Social Media Video & Post Downloader</h1>
        <p className="text-sm text-slate-500 mt-2">Paste any public link from Instagram Reels, TikTok, YouTube Shorts, or Twitter to extract HD media.</p>
      </div>

      {/* URL Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setError(''); }}
              placeholder="Paste Instagram, TikTok, Shorts, or X link here..."
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {platform && (
              <span className={`absolute right-3 top-3.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg text-white ${platform.color}`}>
                {platform.name}
              </span>
            )}
          </div>

          <button
            onClick={handleFetchMedia}
            disabled={isExtracting}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50 shrink-0"
          >
            {isExtracting ? 'Extracting...' : 'Get Video'}
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-600 mt-2 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        {/* Supported Platforms Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <span className="text-slate-400">Supported:</span>
          <span className="flex items-center gap-1 text-slate-700">📸 Instagram Reels</span>
          <span className="flex items-center gap-1 text-slate-700">🎵 TikTok</span>
          <span className="flex items-center gap-1 text-slate-700">▶️ YouTube Shorts</span>
          <span className="flex items-center gap-1 text-slate-700">🐦 Twitter / X</span>
          <span className="flex items-center gap-1 text-slate-700">📘 Facebook</span>
        </div>
      </div>

      <AdBanner slot="in-tool" />

      {/* Extracted Media Result */}
      {extractedMedia && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
              <img
                src={extractedMedia.thumbnail}
                alt="Media thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-10 h-10 text-white opacity-90 fill-white" />
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                {extractedMedia.duration}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  Ready to Download
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">{extractedMedia.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Source: {extractedMedia.platform}</p>
              </div>

              {/* Download Buttons for Formats */}
              <div className="space-y-2 pt-2">
                {extractedMedia.formats.map((fmt: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {fmt.isAudio ? <Music className="w-5 h-5 text-indigo-600" /> : <Film className="w-5 h-5 text-sky-600" />}
                      <div>
                        <span className="font-bold text-sm text-slate-800 block">{fmt.quality}</span>
                        <span className="text-[11px] text-slate-400">{fmt.size} • No Watermark</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Starting download for ${fmt.quality}...`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide & Monetization Note */}
      <section className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 text-xs text-slate-500 leading-relaxed space-y-2">
        <h4 className="font-bold text-slate-800 text-sm">How to Download Social Media Videos:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open Instagram, TikTok, YouTube, or Twitter and click <strong>Share → Copy Link</strong> on any public post or Reel.</li>
          <li>Paste the link in the box above and click <strong>Get Video</strong>.</li>
          <li>Choose your preferred resolution (1080p, 720p, or MP3) and download directly to your device.</li>
        </ol>
      </section>
    </div>
  );
}
