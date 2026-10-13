import React, { useState } from 'react';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Info,
  Calendar,
} from 'lucide-react';
import { calculateAttendance, projectRemainingSemester } from '../utils/attendanceCalculator.ts';

export const AttendanceCalculatorView: React.FC = () => {
  const [attended, setAttended] = useState<number>(32);
  const [totalConducted, setTotalConducted] = useState<number>(48);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [futureClasses, setFutureClasses] = useState<number>(24);
  const [showProjection, setShowProjection] = useState<boolean>(true);

  // Validation errors
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAttendedChange = (val: number) => {
    if (val < 0) {
      setInputError('Attended classes cannot be negative.');
      return;
    }
    if (val > totalConducted) {
      setInputError('Attended classes cannot exceed total classes conducted.');
      return;
    }
    setInputError(null);
    setAttended(val);
  };

  const handleTotalChange = (val: number) => {
    if (val < 0) {
      setInputError('Total classes cannot be negative.');
      return;
    }
    if (val < attended) {
      setInputError('Total classes conducted cannot be less than attended classes.');
      return;
    }
    setInputError(null);
    setTotalConducted(val);
  };

  const calculation = calculateAttendance(attended, totalConducted, targetPercentage);
  const projection = projectRemainingSemester(attended, totalConducted, futureClasses, targetPercentage);

  const handleReset = () => {
    setAttended(36);
    setTotalConducted(48);
    setTargetPercentage(75);
    setFutureClasses(24);
    setInputError(null);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Attendance Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic mathematical calculations using SPPU Ordinance 157 guidelines.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {inputError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Input Parameters</span>
          </h2>

          {/* Attended Classes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Classes Attended (A)
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {attended}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(totalConducted, 1)}
              value={attended}
              onChange={(e) => handleAttendedChange(parseInt(e.target.value) || 0)}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={totalConducted}
                value={attended}
                onChange={(e) => handleAttendedChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Total Classes Conducted */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Total Classes Conducted (T)
              </label>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
                {totalConducted}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              value={totalConducted}
              onChange={(e) => handleTotalChange(parseInt(e.target.value) || 1)}
              className="w-full accent-slate-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={totalConducted}
                onChange={(e) => handleTotalChange(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Target Attendance Requirement */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Target Percentage (p)
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {targetPercentage}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[75, 80, 85, 90].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTargetPercentage(t)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    targetPercentage === t
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">Custom Target:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Math.min(100, Math.max(1, parseInt(e.target.value) || 75)))}
                className="w-24 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>SPPU Standard Rule:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              75% attendance is mandatory to earn Term Grant. 65% to 74.9% may be condoned solely for certified medical reasons with approval from the Principal.
            </p>
          </div>
        </div>

        {/* Right Output & Analytics Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Results Display */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Current Attendance Standing
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${
                    calculation.percentage >= targetPercentage
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : calculation.percentage >= 65
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }`}>
                    {calculation.percentage}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    ({calculation.attended} of {calculation.totalConducted} lectures)
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  calculation.status === 'safe'
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : calculation.status === 'warning'
                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}>
                  {calculation.status === 'safe' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {calculation.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {calculation.status === 'critical' && <XCircle className="w-3.5 h-3.5" />}
                  <span>{calculation.statusLabel}</span>
                </span>
              </div>
            </div>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Lectures Missed</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {calculation.missed}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Target Deficit / Surplus</div>
                <div className={`text-lg font-bold mt-0.5 ${
                  calculation.percentage >= targetPercentage ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {calculation.percentage >= targetPercentage ? '+' : ''}
                  {(calculation.percentage - targetPercentage).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">Consecutive Lectures Needed</div>
                <div className="text-lg font-bold text-blue-600 dark:text-cyan-400 mt-0.5">
                  {calculation.isHundredPercentImpossible
                    ? 'Impossible'
                    : calculation.consecutiveNeeded}
                </div>
              </div>
            </div>

            {/* Strategic Action Insight Callout */}
            {calculation.isHundredPercentImpossible ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>100% Target Mathematically Unattainable</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Since you have already missed {calculation.missed} class(es), your attendance ratio (A + x) / (T + x) will strictly approach 100% as x grows large, but can never equal 100.0% in a finite number of additional classes.
                </p>
              </div>
            ) : calculation.consecutiveNeeded > 0 ? (
              <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-100 space-y-2">
                <div className="font-bold text-blue-800 dark:text-cyan-300 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Shortage Recovery Requirement</span>
                </div>
                <p className="leading-relaxed">
                  To reach your target of <strong>{targetPercentage}%</strong>, you must attend the next{' '}
                  <strong className="text-blue-700 dark:text-cyan-300 font-extrabold text-sm underline">
                    {calculation.consecutiveNeeded} consecutive lectures
                  </strong>{' '}
                  without missing any class.
                </p>
                <div className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                  After attending {calculation.consecutiveNeeded} more classes, your attendance will be{' '}
                  <strong>
                    {calculation.attended + calculation.consecutiveNeeded} / {calculation.totalConducted + calculation.consecutiveNeeded} (
                    {(
                      ((calculation.attended + calculation.consecutiveNeeded) /
                        (calculation.totalConducted + calculation.consecutiveNeeded)) *
                      100
                    ).toFixed(2)}
                    %)
                  </strong>
                  .
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-100 space-y-2">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Eligible & Safe Buffer</span>
                </div>
                <p className="leading-relaxed">
                  Your attendance exceeds {targetPercentage}%. You currently have a safety cushion to miss up to{' '}
                  <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                    {calculation.allowableFutureAbsences} upcoming classes
                  </strong>{' '}
                  while still preserving your minimum {targetPercentage}% standing.
                </p>
                <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                  If you miss {calculation.allowableFutureAbsences} classes consecutively, your attendance will be{' '}
                  <strong>
                    {calculation.attended} / {calculation.totalConducted + calculation.allowableFutureAbsences} (
                    {(
                      (calculation.attended /
                        (calculation.totalConducted + calculation.allowableFutureAbsences)) *
                      100
                    ).toFixed(2)}
                    %)
                  </strong>
                  .
                </div>
              </div>
            )}

            {/* Formula Breakdown Details */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Mathematical Proof & Formula Derivation</span>
              </span>
              <div className="font-mono text-[11px] text-blue-600 dark:text-cyan-400 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                {calculation.formulaExplanation.formula}
              </div>
              <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                {calculation.formulaExplanation.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What-If Semester Projection Tool */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Semester End Projection Simulator
                </h3>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Term-End Planning
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimate your final percentage if additional lectures are scheduled before the term ends.
            </p>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Remaining Classes in Semester:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={futureClasses}
                onChange={(e) => setFutureClasses(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Total Classes at Term End</div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {projection.projectedTotal} lectures
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Must Attend (of {futureClasses})</div>
                <div className="text-base font-bold text-blue-600 dark:text-cyan-400">
                  {projection.mustAttend} lectures
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Allowable Future Absences</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {projection.canMiss} lectures
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              {projection.isAchievable ? (
                <span>
                  ✓ Target of {targetPercentage}% is achievable if you attend at least {projection.mustAttend} out of the next {futureClasses} lectures.
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  ✗ Even if you attend all {futureClasses} remaining classes, your final attendance will only reach{' '}
                  {(((calculation.attended + futureClasses) / projection.projectedTotal) * 100).toFixed(2)}%, which is below {targetPercentage}%. Consult your HOD immediately.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
