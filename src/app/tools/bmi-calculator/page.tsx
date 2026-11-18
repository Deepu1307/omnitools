'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Scale, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function BmiCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Metric inputs
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Imperial inputs
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(155);

  const calculateBmi = () => {
    let hMeters = 0;
    let wKg = 0;

    if (unitSystem === 'metric') {
      hMeters = heightCm / 100;
      wKg = weightKg;
    } else {
      const totalInches = heightFeet * 12 + heightInches;
      hMeters = totalInches * 0.0254;
      wKg = weightLbs * 0.45359237;
    }

    if (hMeters <= 0 || wKg <= 0) return null;

    const bmi = parseFloat((wKg / (hMeters * hMeters)).toFixed(1));

    // Ideal weight range for BMI 18.5 - 24.9
    const minIdealKg = 18.5 * (hMeters * hMeters);
    const maxIdealKg = 24.9 * (hMeters * hMeters);

    let category = '';
    let categoryColor = '';
    let gaugePercent = 0;

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-sky-600 bg-sky-50 border-sky-200';
      gaugePercent = Math.min(25, (bmi / 18.5) * 25);
    } else if (bmi <= 24.9) {
      category = 'Normal / Healthy Weight';
      categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      gaugePercent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
    } else if (bmi <= 29.9) {
      category = 'Overweight';
      categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
      gaugePercent = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
    } else {
      category = 'Obese';
      categoryColor = 'text-rose-700 bg-rose-50 border-rose-200';
      gaugePercent = Math.min(100, 75 + ((bmi - 30) / 15) * 25);
    }

    return {
      bmi,
      category,
      categoryColor,
      gaugePercent,
      minIdeal: unitSystem === 'metric' ? `${minIdealKg.toFixed(1)} kg` : `${(minIdealKg * 2.20462).toFixed(1)} lbs`,
      maxIdeal: unitSystem === 'metric' ? `${maxIdealKg.toFixed(1)} kg` : `${(maxIdealKg * 2.20462).toFixed(1)} lbs`,
    };
  };

  const result = calculateBmi();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Health & Wellness • WHO Adult Guidelines</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">BMI & Ideal Body Weight Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">Check your Body Mass Index (BMI), healthy weight target range, and wellness category.</p>
      </div>

      {/* Unit System Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            unitSystem === 'metric' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Metric (cm, kg)
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            unitSystem === 'imperial' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Imperial (feet, inches, lbs)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Your Measurements</h3>

          {unitSystem === 'metric' ? (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-base font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-base font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Height (Feet & Inches)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={heightFeet}
                    placeholder="Feet"
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-base font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    value={heightInches}
                    placeholder="Inches"
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-base font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-base font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Card */}
        {result ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Your BMI Score</span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-black text-slate-900 tracking-tight">{result.bmi}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${result.categoryColor}`}>
                  {result.category}
                </span>
              </div>

              {/* Gauge Meter */}
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Underweight</span>
                  <span className="text-emerald-600">Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex relative">
                  <div className="w-1/4 h-full bg-sky-400" />
                  <div className="w-1/4 h-full bg-emerald-500" />
                  <div className="w-1/4 h-full bg-amber-400" />
                  <div className="w-1/4 h-full bg-rose-500" />
                  {/* Indicator pin */}
                  <div
                    style={{ left: `${result.gaugePercent}%` }}
                    className="absolute top-0 bottom-0 w-2 bg-slate-950 rounded-full border border-white shadow -translate-x-1/2 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Ideal Weight Goal */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Healthy Weight Target</span>
              <p className="text-base font-bold text-emerald-950">
                {result.minIdeal} — {result.maxIdeal}
              </p>
              <p className="text-xs text-emerald-700">Recommended healthy body weight range based on your height.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <Scale className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">Enter valid height and weight measurements to view your BMI score.</p>
          </div>
        )}
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
