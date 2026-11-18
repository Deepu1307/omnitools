'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Key, 
  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  Lock
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function PasswordGeneratorPage() {
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  // Passphrase settings
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');

  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const sampleWords = [
    'amber', 'brave', 'cedar', 'drift', 'eagle', 'frost', 'glade', 'haven', 'ivory', 'jovial',
    'karma', 'lunar', 'mystic', 'noble', 'ocean', 'prism', 'quest', 'river', 'solar', 'tidal',
    'umbra', 'vivid', 'whisper', 'xenon', 'yield', 'zenith', 'beacon', 'clover', 'dynamo', 'echo'
  ];

  const generate = () => {
    if (mode === 'passphrase') {
      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const randIndex = Math.floor(Math.random() * sampleWords.length);
        words.push(sampleWords[randIndex]);
      }
      setGeneratedResult(words.join(separator));
      return;
    }

    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    // Cryptographically secure random values
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charset[array[i] % charset.length];
    }
    setGeneratedResult(res);
  };

  useEffect(() => {
    generate();
  }, [mode, length, includeUpper, includeLower, includeNumbers, includeSymbols, wordCount, separator]);

  // Entropy calculation
  const calculateEntropy = () => {
    let poolSize = 0;
    if (mode === 'passphrase') {
      poolSize = sampleWords.length;
      return Math.round(wordCount * Math.log2(poolSize));
    }

    if (includeLower) poolSize += 26;
    if (includeUpper) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;

    return Math.round(length * Math.log2(Math.max(2, poolSize)));
  };

  const entropy = calculateEntropy();

  const getStrengthLabel = (e: number) => {
    if (e < 45) return { label: 'Weak', color: 'text-rose-500 bg-rose-50 border-rose-200', time: 'A few seconds' };
    if (e < 65) return { label: 'Moderate', color: 'text-amber-500 bg-amber-50 border-amber-200', time: 'A few hours' };
    if (e < 85) return { label: 'Strong', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', time: 'Several centuries' };
    return { label: 'Unbreakable', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', time: 'Millions of years' };
  };

  const strength = getStrengthLabel(entropy);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
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
          <Lock className="w-3.5 h-3.5" />
          <span>Crypto Secure • Web Crypto API • Never Sent Online</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Password & Passphrase Generator</h1>
        <p className="text-sm text-slate-500 mt-1">Generate strong passwords or memorable multi-word passphrases with entropy analysis.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Result Box with Copy and Refresh */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900 rounded-2xl text-white gap-4">
          <span className="font-mono text-base sm:text-xl font-bold tracking-wide break-all select-all px-2">
            {generatedResult}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generate}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength & Entropy Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className={`p-4 rounded-xl border ${strength.color}`}>
            <span className="text-[11px] font-semibold uppercase block">Entropy Rating</span>
            <span className="font-bold text-lg">{strength.label} ({entropy} bits)</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Crack Time (Supercomputer)</span>
            <span className="font-bold text-slate-800 text-lg">{strength.time}</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Character Length</span>
            <span className="font-bold text-slate-800 text-lg">{generatedResult.length} characters</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('password')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'password' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Random Character Password
            </button>
            <button
              onClick={() => setMode('passphrase')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'passphrase' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Memorable Passphrase (Diceware)
            </button>
          </div>

          {mode === 'password' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Password Length</span>
                  <span>{length} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Number of Words</span>
                  <span>{wordCount} words</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Word Separator</label>
                <div className="flex gap-2">
                  {['-', '_', '.', ' ', '#'].map((sep) => (
                    <button
                      key={sep}
                      onClick={() => setSeparator(sep)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold ${
                        separator === sep ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sep === ' ' ? 'space' : sep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
