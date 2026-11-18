'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  MessageSquare, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Phone,
  QrCode
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function WhatsAppLinkGeneratorPage() {
  const [countryCode, setCountryCode] = useState<string>('1');
  const [phoneNumber, setPhoneNumber] = useState<string>('5551234567');
  const [message, setMessage] = useState<string>(
    'Hi! I would like to inquire about your services and book an appointment.'
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate clean wa.me link
  const cleanPhone = (countryCode + phoneNumber).replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : '';

  useEffect(() => {
    if (waLink) {
      QRCode.toDataURL(waLink, { width: 280, margin: 2, errorCorrectionLevel: 'H' })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [waLink]);

  const handleCopy = () => {
    navigator.clipboard.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Local Business & Orders • Click-to-Chat & QR Code</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">WhatsApp Direct Chat & QR Link Maker</h1>
        <p className="text-sm text-slate-500 mt-1">Generate click-to-chat WhatsApp links and printable QR codes with pre-filled messages for customer orders and bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Business Phone & Message</h3>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              WhatsApp Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative w-28">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">+</span>
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Code"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Phone number without 0"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Include country code without '+' or special characters.</span>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Pre-filled Customer Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="E.g. Hi, I would like to book a table for 2 people tonight..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-800 leading-relaxed focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">When users click your link, this message automatically opens in their WhatsApp.</span>
          </div>

          {/* Quick Preview Links */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Chat Link'}</span>
            </button>

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* QR Code & Counter Display */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Counter / Print QR Code</span>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="WhatsApp Chat QR Code"
                  className="w-44 h-44 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-slate-300 text-xs">Generating...</div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-3 max-w-xs">
              Print this QR code on shop menus, business cards, receipts, or table counters for instant customer WhatsApp chats.
            </p>
          </div>

          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="whatsapp-chat-qrcode.png"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR Code</span>
            </a>
          )}
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
