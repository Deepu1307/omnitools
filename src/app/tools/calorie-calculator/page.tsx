'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Dumbbell, 
  TrendingDown, 
  TrendingUp,
  Info 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [activity, setActivity] = useState<number>(1.375); // 1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 very active

  // Mifflin-St Jeor Formula
  const calculateCalories = () => {
    const safeWeight = Math.max(1, weightKg || 70);
    const safeHeight = Math.max(1, heightCm || 170);
    const safeAge = Math.max(1, age || 25);

    let bmr = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const tdee = Math.max(800, Math.round(bmr * activity));
    const weightLoss = tdee - 500;
    const muscleGain = tdee + 300;

    // Macro grams for weight loss (40% carbs, 30% protein, 30% fat)
    const proteinGrams = Math.round((tdee * 0.3) / 4);
    const carbGrams = Math.round((tdee * 0.4) / 4);
    const fatGrams = Math.round((tdee * 0.3) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      weightLoss: Math.max(1200, weightLoss),
      muscleGain,
      proteinGrams,
      carbGrams,
      fatGrams,
    };
  };

  const stats = calculateCalories();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>Mifflin-St Jeor Scientific Formula • TDEE & Macros</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daily Calorie & TDEE Macro Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">Calculate your Total Daily Energy Expenditure (TDEE) and exact calories for fat loss or muscle building.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Your Profile</h3>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGender('male')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  gender === 'male' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  gender === 'female' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value={1.2}>Sedentary (Desk Job, Little Exercise)</option>
              <option value={1.375}>Light Exercise (1-2 days/week)</option>
              <option value={1.55}>Moderate Exercise (3-5 days/week)</option>
              <option value={1.725}>Very Active (6-7 heavy workouts/week)</option>
            </select>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Maintenance Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Daily Maintenance Calories (TDEE)</span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span>{stats.tdee.toLocaleString()}</span>
              <span className="text-lg text-amber-300 font-medium">calories / day</span>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Your Basal Metabolic Rate (BMR) is <strong>{stats.bmr} kcal</strong> (calories burned by your body at complete rest).
            </p>
          </div>

          {/* Goal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Fat Loss Deficit</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.weightLoss.toLocaleString()} kcal</span>
                <span className="text-[11px] text-slate-400">500 kcal deficit (~0.5 kg loss per week)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Muscle Gain Surplus</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.muscleGain.toLocaleString()} kcal</span>
                <span className="text-[11px] text-slate-400">300 kcal lean building surplus</span>
              </div>
            </div>
          </div>

          {/* Macro Gram Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Recommended Daily Macronutrients</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-[11px] font-bold text-indigo-700 uppercase block">Protein</span>
                <span className="text-xl font-black text-indigo-950 mt-0.5 block">{stats.proteinGrams}g</span>
                <span className="text-[10px] text-slate-400">30% total</span>
              </div>
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl">
                <span className="text-[11px] font-bold text-sky-700 uppercase block">Carbs</span>
                <span className="text-xl font-black text-sky-950 mt-0.5 block">{stats.carbGrams}g</span>
                <span className="text-[10px] text-slate-400">40% total</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-[11px] font-bold text-amber-700 uppercase block">Fats</span>
                <span className="text-xl font-black text-amber-950 mt-0.5 block">{stats.fatGrams}g</span>
                <span className="text-[10px] text-slate-400">30% total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
