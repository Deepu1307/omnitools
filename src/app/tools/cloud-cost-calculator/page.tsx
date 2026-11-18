'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cloud, 
  ArrowLeft, 
  Sparkles, 
  DollarSign, 
  ExternalLink,
  TrendingDown,
  Info
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function CloudCostCalculatorPage() {
  const [storageTB, setStorageTB] = useState<number>(5);
  const [egressTB, setEgressTB] = useState<number>(2);
  const [readOpsMillions, setReadOpsMillions] = useState<number>(10);
  const [writeOpsMillions, setWriteOpsMillions] = useState<number>(1);

  // Pricing constants (Standard Tiers)
  // AWS S3: ~$0.023/GB storage, ~$0.09/GB egress, $0.0004/1k read, $0.005/1k write
  const awsStorage = storageTB * 1024 * 0.023;
  const awsEgress = egressTB * 1024 * 0.09;
  const awsOps = (readOpsMillions * 1000 * 0.0004) + (writeOpsMillions * 1000 * 0.005);
  const awsTotal = awsStorage + awsEgress + awsOps;

  // Google Cloud Storage: ~$0.020/GB storage, ~$0.12/GB egress, $0.0004/1k read, $0.005/1k write
  const gcpStorage = storageTB * 1024 * 0.020;
  const gcpEgress = egressTB * 1024 * 0.12;
  const gcpOps = (readOpsMillions * 1000 * 0.0004) + (writeOpsMillions * 1000 * 0.005);
  const gcpTotal = gcpStorage + gcpEgress + gcpOps;

  // Azure Blob Hot: ~$0.018/GB storage, ~$0.087/GB egress, $0.0004/1k read, $0.005/1k write
  const azureStorage = storageTB * 1024 * 0.018;
  const azureEgress = egressTB * 1024 * 0.087;
  const azureOps = (readOpsMillions * 1000 * 0.0004) + (writeOpsMillions * 1000 * 0.005);
  const azureTotal = azureStorage + azureEgress + azureOps;

  // Cloudflare R2: ~$0.015/GB storage, $0.00 egress (Zero Egress Fees!), $0.36/million Class B, $4.50/million Class A
  const r2Storage = storageTB * 1024 * 0.015;
  const r2Egress = 0; // Zero egress fees
  const r2Ops = (readOpsMillions * 0.36) + (writeOpsMillions * 4.50);
  const r2Total = r2Storage + r2Egress + r2Ops;

  // Backblaze B2: ~$0.006/GB storage, ~$0.01/GB egress (free egress up to 3x storage)
  const b2Storage = storageTB * 1024 * 0.006;
  const b2FreeEgress = storageTB * 3;
  const b2PaidEgressTB = Math.max(0, egressTB - b2FreeEgress);
  const b2Egress = b2PaidEgressTB * 1024 * 0.01;
  const b2Ops = (readOpsMillions * 0.004) + (writeOpsMillions * 0.005);
  const b2Total = b2Storage + b2Egress + b2Ops;

  const providers = [
    { name: 'Cloudflare R2', total: r2Total, storage: r2Storage, egress: r2Egress, ops: r2Ops, badge: 'Zero Egress Fees' },
    { name: 'Backblaze B2', total: b2Total, storage: b2Storage, egress: b2Egress, ops: b2Ops, badge: 'Lowest Base Storage' },
    { name: 'AWS S3 (Standard)', total: awsTotal, storage: awsStorage, egress: awsEgress, ops: awsOps },
    { name: 'Google Cloud Storage', total: gcpTotal, storage: gcpStorage, egress: gcpEgress, ops: gcpOps },
    { name: 'Azure Blob (Hot)', total: azureTotal, storage: azureStorage, egress: azureEgress, ops: azureOps },
  ].sort((a, b) => a.total - b.total);

  const cheapest = providers[0];
  const mostExpensive = providers[providers.length - 1];
  const potentialSavings = Math.round(mostExpensive.total - cheapest.total);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200/80 mb-3">
          <Cloud className="w-3.5 h-3.5" />
          <span>High CPM Cloud Estimator • 2026 Updated Rates</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cloud Storage & Egress Cost Estimator</h1>
        <p className="text-sm text-slate-500 mt-1">Compare real-world monthly cloud costs across AWS S3, Google Cloud, Azure, and Cloudflare R2.</p>
      </div>

      {/* Savings Highlight */}
      {potentialSavings > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Potential Monthly Savings: ${potentialSavings}/mo</h4>
              <p className="text-xs text-emerald-100">
                Switching egress-heavy workloads to <strong>{cheapest.name}</strong> eliminates up to {Math.round((potentialSavings / mostExpensive.total) * 100)}% of your cloud bill.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Total Storage</span>
            <span>{storageTB} TB ({storageTB * 1024} GB)</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.5"
            value={storageTB}
            onChange={(e) => setStorageTB(parseFloat(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">Total data stored in bucket</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Monthly Egress / Downloads</span>
            <span>{egressTB} TB ({egressTB * 1024} GB)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={egressTB}
            onChange={(e) => setEgressTB(parseFloat(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">Bandwidth sent to the internet or clients</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Read Operations (GET)</span>
            <span>{readOpsMillions} Million / mo</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="50"
            step="0.5"
            value={readOpsMillions}
            onChange={(e) => setReadOpsMillions(parseFloat(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Write Operations (PUT/POST)</span>
            <span>{writeOpsMillions} Million / mo</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.5"
            value={writeOpsMillions}
            onChange={(e) => setWriteOpsMillions(parseFloat(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Comparison Cards / Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Estimated Monthly Breakdown</h3>
        <div className="grid grid-cols-1 gap-4">
          {providers.map((p, index) => (
            <div
              key={p.name}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                index === 0
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-slate-900">{p.name}</h4>
                  {p.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {p.badge}
                    </span>
                  )}
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600 text-white">
                      Lowest Total
                    </span>
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>Storage: <strong>${p.storage.toFixed(2)}</strong></span>
                  <span>Egress: <strong>${p.egress.toFixed(2)}</strong></span>
                  <span>Ops: <strong>${p.ops.toFixed(2)}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">${p.total.toFixed(2)}</span>
                <span className="text-xs text-slate-400 block font-medium">/ month</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
