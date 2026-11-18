'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Sparkles, Share2, ArrowLeft, Cake, Heart, Award } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculateAgeDetails = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      setStats(null);
      return;
    }

    // Exact years, months, days
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total difference in milliseconds
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Day of the week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayOfWeek = daysOfWeek[birth.getDay()];

    // Next Birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac sign
    const getZodiac = (day: number, month: number) => {
      const z = [
        { sign: 'Capricorn', start: [1, 1], end: [1, 19] },
        { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
        { sign: 'Capricorn', start: [12, 22], end: [12, 31] },
      ];
      const match = z.find(({ start, end }) => {
        if (month === start[0] && day >= start[1]) return true;
        if (month === end[0] && day <= end[1]) return true;
        return false;
      });
      return match ? match.sign : 'Capricorn';
    };
    const zodiac = getZodiac(birth.getDate(), birth.getMonth() + 1);

    // 10,000 days milestone
    const tenThousandDaysDate = new Date(birth.getTime() + 10000 * 24 * 60 * 60 * 1000);
    const tenThousandDaysFormatted = tenThousandDaysDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    setStats({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthDayOfWeek,
      daysUntilNextBday,
      zodiac,
      tenThousandDaysFormatted,
    });
  };

  useEffect(() => {
    calculateAgeDetails();
  }, [birthDate, targetDate]);

  const handleCopySummary = () => {
    if (!stats) return;
    const text = `I am ${stats.years} years, ${stats.months} months, and ${stats.days} days old (${stats.totalDays.toLocaleString()} total days)! Calculated at OmniTools.io`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Exact Age & Milestone Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">Calculate your exact age in years, days, hours, and find upcoming milestones.</p>
        </div>
        {stats && (
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copied to Clipboard!' : 'Share Results'}</span>
          </button>
        )}
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Calculate Age As Of
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* In-tool Ad Placement */}
      <AdBanner slot="in-tool" />

      {/* Results Section */}
      {stats && (
        <div className="space-y-6">
          {/* Hero Result Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Current Exact Age</span>
            <div className="mt-2 text-3xl sm:text-5xl font-black tracking-tight flex flex-wrap items-baseline gap-3">
              <span>{stats.years} <span className="text-lg sm:text-2xl font-medium text-indigo-200">years</span></span>
              <span>{stats.months} <span className="text-lg sm:text-2xl font-medium text-indigo-200">months</span></span>
              <span>{stats.days} <span className="text-lg sm:text-2xl font-medium text-indigo-200">days</span></span>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-indigo-100">
              Born on a <strong className="text-white">{stats.birthDayOfWeek}</strong> • Zodiac Sign: <strong className="text-white">{stats.zodiac}</strong>
            </p>
          </div>

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase">Total Days</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDays.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase">Total Weeks</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalWeeks.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase">Total Hours</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalHours.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase">Total Minutes</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalMinutes.toLocaleString()}</p>
            </div>
          </div>

          {/* Birthday & Milestone Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <Cake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Next Birthday Countdown</h4>
                <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.daysUntilNextBday} days</p>
                <p className="text-xs text-slate-500 mt-0.5">Until your {stats.years + 1}th birthday celebration!</p>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">10,000 Days Milestone</h4>
                <p className="text-lg font-bold text-emerald-800 mt-1">{stats.tenThousandDaysFormatted}</p>
                <p className="text-xs text-slate-500 mt-0.5">The exact date when you achieve 10,000 days of life.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
