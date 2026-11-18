'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Lock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function JwtDebuggerPage() {
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzk4NzU1MjAwfQ.4S_X01L_xYfQvL_SAMPLE_SIGNATURE_ONLY';

  const [tokenInput, setTokenInput] = useState<string>(sampleToken);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const decodePart = (b64url: string) => {
    try {
      let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const json = decodeURIComponent(
        atob(b64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const parseToken = () => {
    const parts = tokenInput.trim().split('.');
    if (parts.length < 2) return null;

    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    const signature = parts[2] || '';

    let isExpired = false;
    let expDateFormatted = '';
    let expiresInSec = 0;

    if (payload && payload.exp) {
      const expMs = payload.exp * 1000;
      isExpired = Date.now() > expMs;
      expDateFormatted = new Date(expMs).toLocaleString();
      expiresInSec = Math.round((expMs - Date.now()) / 1000);
    }

    return { header, payload, signature, isExpired, expDateFormatted, expiresInSec };
  };

  const parsed = parseToken();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>100% Local Decode • Never Transmitted to Servers</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Private JWT Inspector & Decoder</h1>
        <p className="text-sm text-slate-500 mt-1">Safely decode, inspect claims, and check expiration on JSON Web Tokens directly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Encoded Token</span>
            <button
              onClick={() => setTokenInput('')}
              className="text-xs text-slate-400 hover:text-rose-500"
            >
              Clear
            </button>
          </div>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            rows={14}
            placeholder="Paste your JWT token (eyJhbGciOi...) here..."
            className="w-full flex-1 font-mono text-xs p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 break-all leading-relaxed resize-none"
          />

          {parsed && parsed.payload && parsed.payload.exp && (
            <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              parsed.isExpired
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2">
                {parsed.isExpired ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span className="font-semibold">{parsed.isExpired ? 'Token is Expired' : 'Token is Active'}</span>
              </div>
              <span>{parsed.isExpired ? `Expired at: ${parsed.expDateFormatted}` : `Expires: ${parsed.expDateFormatted}`}</span>
            </div>
          )}
        </div>

        {/* Decoded Claims Output */}
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-2">HEADER: Algorithm & Token Type</span>
            <pre className="p-3 bg-slate-900 text-rose-300 rounded-xl font-mono text-xs overflow-auto">
              {parsed?.header ? JSON.stringify(parsed.header, null, 2) : '// Invalid Header'}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">PAYLOAD: Data Claims</span>
              {parsed?.payload && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(parsed.payload, null, 2));
                    setCopiedPayload(true);
                    setTimeout(() => setCopiedPayload(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                </button>
              )}
            </div>
            <pre className="p-3 bg-slate-900 text-indigo-200 rounded-xl font-mono text-xs overflow-auto max-h-64">
              {parsed?.payload ? JSON.stringify(parsed.payload, null, 2) : '// Invalid Payload'}
            </pre>
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
