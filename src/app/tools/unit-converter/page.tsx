'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Ruler, 
  Thermometer, 
  HardDrive, 
  Gauge, 
  Layers 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital' | 'speed';

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>('m');

  // Length definitions in base meters
  const lengthUnits: Record<string, { name: string; toBase: (v: number) => number; fromBase: (b: number) => number }> = {
    m: { name: 'Meters (m)', toBase: (v) => v, fromBase: (b) => b },
    km: { name: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
    cm: { name: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (b) => b * 100 },
    mm: { name: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
    in: { name: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
    ft: { name: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
    yd: { name: 'Yards (yd)', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
    mi: { name: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
  };

  // Weight definitions in base grams
  const weightUnits: Record<string, { name: string; toBase: (v: number) => number; fromBase: (b: number) => number }> = {
    kg: { name: 'Kilograms (kg)', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
    g: { name: 'Grams (g)', toBase: (v) => v, fromBase: (b) => b },
    lb: { name: 'Pounds (lbs)', toBase: (v) => v * 453.59237, fromBase: (b) => b / 453.59237 },
    oz: { name: 'Ounces (oz)', toBase: (v) => v * 28.3495, fromBase: (b) => b / 28.3495 },
    t: { name: 'Metric Tons (t)', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
  };

  // Temperature conversions
  const tempUnits: Record<string, { name: string; toC: (v: number) => number; fromC: (c: number) => number }> = {
    c: { name: 'Celsius (°C)', toC: (v) => v, fromC: (c) => c },
    f: { name: 'Fahrenheit (°F)', toC: (v) => ((v - 32) * 5) / 9, fromC: (c) => (c * 9) / 5 + 32 },
    k: { name: 'Kelvin (K)', toC: (v) => v - 273.15, fromC: (c) => c + 273.15 },
  };

  // Digital Storage in bytes
  const digitalUnits: Record<string, { name: string; toBase: (v: number) => number; fromBase: (b: number) => number }> = {
    b: { name: 'Bytes (B)', toBase: (v) => v, fromBase: (b) => b },
    kb: { name: 'Kilobytes (KB)', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
    mb: { name: 'Megabytes (MB)', toBase: (v) => v * Math.pow(1024, 2), fromBase: (b) => b / Math.pow(1024, 2) },
    gb: { name: 'Gigabytes (GB)', toBase: (v) => v * Math.pow(1024, 3), fromBase: (b) => b / Math.pow(1024, 3) },
    tb: { name: 'Terabytes (TB)', toBase: (v) => v * Math.pow(1024, 4), fromBase: (b) => b / Math.pow(1024, 4) },
  };

  // Speed in km/h
  const speedUnits: Record<string, { name: string; toBase: (v: number) => number; fromBase: (b: number) => number }> = {
    kmh: { name: 'Kilometers per hour (km/h)', toBase: (v) => v, fromBase: (b) => b },
    mph: { name: 'Miles per hour (mph)', toBase: (v) => v * 1.60934, fromBase: (b) => b / 1.60934 },
    ms: { name: 'Meters per second (m/s)', toBase: (v) => v * 3.6, fromBase: (b) => b / 3.6 },
    kn: { name: 'Knots (kn)', toBase: (v) => v * 1.852, fromBase: (b) => b / 1.852 },
  };

  const getConversions = () => {
    if (category === 'length') {
      const base = lengthUnits[fromUnit]?.toBase(inputValue) ?? inputValue;
      return Object.entries(lengthUnits).map(([key, u]) => ({
        unit: u.name,
        value: parseFloat(u.fromBase(base).toFixed(4)),
      }));
    }
    if (category === 'weight') {
      const base = weightUnits[fromUnit]?.toBase(inputValue) ?? inputValue;
      return Object.entries(weightUnits).map(([key, u]) => ({
        unit: u.name,
        value: parseFloat(u.fromBase(base).toFixed(4)),
      }));
    }
    if (category === 'temperature') {
      const c = tempUnits[fromUnit]?.toC(inputValue) ?? inputValue;
      return Object.entries(tempUnits).map(([key, u]) => ({
        unit: u.name,
        value: parseFloat(u.fromC(c).toFixed(2)),
      }));
    }
    if (category === 'digital') {
      const base = digitalUnits[fromUnit]?.toBase(inputValue) ?? inputValue;
      return Object.entries(digitalUnits).map(([key, u]) => ({
        unit: u.name,
        value: parseFloat(u.fromBase(base).toFixed(4)),
      }));
    }
    if (category === 'speed') {
      const base = speedUnits[fromUnit]?.toBase(inputValue) ?? inputValue;
      return Object.entries(speedUnits).map(([key, u]) => ({
        unit: u.name,
        value: parseFloat(u.fromBase(base).toFixed(4)),
      }));
    }
    return [];
  };

  const conversions = getConversions();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Everyday Utility • Instant Multi-Unit Conversions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Instant Universal Unit Converter</h1>
        <p className="text-sm text-slate-500 mt-1">Convert units for length, weight, temperature, and digital data in real-time.</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'length', label: 'Length', icon: Ruler },
          { id: 'weight', label: 'Weight', icon: Scale },
          { id: 'temperature', label: 'Temperature', icon: Thermometer },
          { id: 'digital', label: 'Digital Data', icon: HardDrive },
          { id: 'speed', label: 'Speed', icon: Gauge },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id as UnitCategory);
                if (c.id === 'length') setFromUnit('m');
                else if (c.id === 'weight') setFromUnit('kg');
                else if (c.id === 'temperature') setFromUnit('c');
                else if (c.id === 'digital') setFromUnit('mb');
                else if (c.id === 'speed') setFromUnit('kmh');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                category === c.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Convert From</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {category === 'length' && Object.entries(lengthUnits).map(([k, u]) => <option key={k} value={k}>{u.name}</option>)}
            {category === 'weight' && Object.entries(weightUnits).map(([k, u]) => <option key={k} value={k}>{u.name}</option>)}
            {category === 'temperature' && Object.entries(tempUnits).map(([k, u]) => <option key={k} value={k}>{u.name}</option>)}
            {category === 'digital' && Object.entries(digitalUnits).map(([k, u]) => <option key={k} value={k}>{u.name}</option>)}
            {category === 'speed' && Object.entries(speedUnits).map(([k, u]) => <option key={k} value={k}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">All Equivalent Measurements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conversions.map((conv, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs"
            >
              <span className="text-xs font-medium text-slate-500">{conv.unit}</span>
              <span className="text-lg font-black text-slate-900">{conv.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
