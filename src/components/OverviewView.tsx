import React, { useState } from 'react';
import {
  Calculator,
  MessageSquare,
  FileSpreadsheet,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  GraduationCap,
} from 'lucide-react';
import { ActiveTab } from '../types/index.ts';
import { calculateAttendance } from '../utils/attendanceCalculator.ts';
import { INSTITUTION_INFO } from '../data/collegeData.ts';

interface OverviewViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab }) => {
  // Quick test state on the landing overview
  const [quickAttended, setQuickAttended] = useState<number>(36);
  const [quickTotal, setQuickTotal] = useState<number>(48);
  const [quickTarget, setQuickTarget] = useState<number>(75);

  const quickResult = calculateAttendance(quickAttended, quickTotal, quickTarget);

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SNJB KBJ COE Chandwad · AI Academic Solution</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Attendance Information <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Assistant</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Calculate exact attendance percentages, shortage requirements, and allowable absences.
              Powered by verifiable mathematical formulas and Google Gemini AI to navigate SPPU Ordinance 157
              and institutional policies in English and Marathi.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
              >
                <Calculator className="w-4 h-4" />
                <span>Launch Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-xs sm:text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Ask AI Assistant</span>
              </button>

              <button
                onClick={() => setActiveTab('analyzer')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-750 font-medium text-xs sm:text-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Upload CSV Report</span>
              </button>
            </div>

            {/* Creator Attribution */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Created by: <strong className="text-slate-200">{INSTITUTION_INFO.creator}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Institution: <strong className="text-slate-200">{INSTITUTION_INFO.collegeName}</strong></span>
            </div>
          </div>

          {/* Hero Right: Live Interactive Quick Calculator Widget */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Quick Attendance Check
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-300 font-medium">
                Live Formula
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                    Attended (A)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={quickTotal}
                    value={quickAttended}
                    onChange={(e) => setQuickAttended(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                    Conducted (T)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quickTotal}
                    onChange={(e) => setQuickTotal(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Target Requirement
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">
                    {quickTarget}% (SPPU Standard)
                  </span>
                </div>
                <div className="flex gap-2">
                  {[75, 80, 85].map((tgt) => (
                    <button
                      key={tgt}
                      type="button"
                      onClick={() => setQuickTarget(tgt)}
                      className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${
                        quickTarget === tgt
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tgt}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Current Percentage:</span>
                  <span className={`text-base font-extrabold ${
                    quickResult.percentage >= quickTarget
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : quickResult.percentage >= 65
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }`}>
                    {quickResult.percentage}%
                  </span>
                </div>

                {quickResult.consecutiveNeeded > 0 ? (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight text-amber-900 dark:text-amber-200">
                      Must attend <strong className="font-bold underline">{quickResult.consecutiveNeeded} consecutive lectures</strong> to reach {quickTarget}%.
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight text-emerald-900 dark:text-emerald-200">
                      Safe! You can miss up to <strong className="font-bold">{quickResult.allowableFutureAbsences} upcoming classes</strong> and still maintain ≥{quickTarget}%.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Attendance Threshold Guidelines Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Safe Zone (≥ 75%)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Full eligibility for SPPU Semester Exams, Term Grant sanctioned, and eligible for placement drives.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Warning Band (65% - 74.9%)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Medical condonation required. Doctor certificate must be submitted within 3 days. Remedial tasks assigned.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Critical Defaulter (&lt; 65%)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Non-condonable under SPPU Ordinance 157. Detention from university exams and term withholding.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Application Modules & Capabilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built with mathematical rigor, privacy-first analytics, and bilingual AI assistance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('calculator')}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                Attendance Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Deterministic calculation of shortage, consecutive lectures required, and future allowable absences.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 dark:text-cyan-400 flex items-center gap-1 pt-1">
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('assistant')}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AI Chat Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Powered by Gemini 3.8 Flash with tool calling. Answers attendance questions in English and Marathi (मराठी).
              </p>
            </div>
            <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 pt-1">
              <span>Start Conversation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('analyzer')}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Report Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Upload CSV or Excel sheets. Automatic column mapping, validation, charts, and downloadable summaries.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <span>Analyze Sheets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('policies')}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                College Policies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Knowledge base of SPPU Ordinance 157, medical certificates, condonations, and mentor contacts.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-1">
              <span>View Ordinances</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Creator & Institutional About Section */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              <GraduationCap className="w-4 h-4" />
              <span>Institutional Attribution & About</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              About the Attendance Assistant
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This system was conceptualized and built by <strong>{INSTITUTION_INFO.creator}</strong> at <strong>{INSTITUTION_INFO.collegeName}</strong> to solve critical academic transparency challenges. It empowers students with deterministic math to avoid unexpected exam detention, while equipping teachers and mentors with rapid analysis tools.
            </p>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p><strong>Created by:</strong> {INSTITUTION_INFO.creator}</p>
              <p><strong>Institution:</strong> {INSTITUTION_INFO.collegeName}</p>
              <p><strong>Affiliation:</strong> Savitribai Phule Pune University (SPPU)</p>
              <p><strong>Application:</strong> Attendance Information Assistant</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Privacy & Reliability Guarantees</span>
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>No Arithmetic Hallucinations:</strong> All formulas are computed deterministically in TypeScript.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Zero Unauthorized Exposure:</strong> Student records remain private; CSV uploads are processed locally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Bilingual Accessibility:</strong> Direct Marathi language responses for students and parents across Maharashtra.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
