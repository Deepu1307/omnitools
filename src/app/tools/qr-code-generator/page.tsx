'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  QrCode, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Wifi, 
  Globe, 
  Type, 
  Sliders 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function QrCodeGeneratorPage() {
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'text'>('url');
  const [urlInput, setUrlInput] = useState<string>('https://omnitools.io');
  const [textInput, setTextInput] = useState<string>('Hello from OmniTools!');
  
  // WiFi fields
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Customization
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(320);

  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const getPayload = (): string => {
    if (qrType === 'url') return urlInput || 'https://';
    if (qrType === 'text') return textInput;
    if (qrType === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
    }
    return '';
  };

  const generateQRCode = async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const url = await QRCode.toDataURL(payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, fgColor, bgColor, qrSize]);

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Copied to clipboard is not supported in this browser.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>High Resolution • Vector SVG & PNG • 100% Free</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Custom QR Code Studio</h1>
        <p className="text-sm text-slate-500 mt-1">Generate custom-styled QR codes for websites, WiFi credentials, and text with custom colors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          {/* Type Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">QR Code Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setQrType('url')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  qrType === 'url' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website URL</span>
              </button>
              <button
                onClick={() => setQrType('wifi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  qrType === 'wifi' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>WiFi Network</span>
              </button>
              <button
                onClick={() => setQrType('text')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  qrType === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Plain Text</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          {qrType === 'url' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Destination Website URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Home-WiFi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Security</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e: any) => setWifiEncryption(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Message or Plain Text</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={3}
                placeholder="Enter text..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Color & Styling Customization */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Color & Styling</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-600 block mb-1">Pattern Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{fgColor}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-600 block mb-1">Background Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="md:col-span-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">Live Preview</span>
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="w-48 h-48 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-300 text-xs">
                  Generating...
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-6">
            {dataUrl && (
              <>
                <a
                  href={dataUrl}
                  download="omnitools-qrcode.png"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG (High-Res)</span>
                </a>

                <button
                  onClick={handleCopyImage}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
