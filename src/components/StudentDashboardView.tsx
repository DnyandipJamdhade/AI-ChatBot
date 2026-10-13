import React, { useState } from 'react';
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  User,
  Phone,
  HelpCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SAMPLE_STUDENTS, StudentRecord, SubjectAttendance } from '../data/collegeData.ts';
import { calculateAttendance } from '../utils/attendanceCalculator.ts';
import { ActiveTab } from '../types/index.ts';

interface StudentDashboardViewProps {
  currentStudent: StudentRecord;
  setCurrentStudent: (student: StudentRecord) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  currentStudent,
  setCurrentStudent,
  setActiveTab,
}) => {
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendance | null>(null);

  const overallCalc = calculateAttendance(
    currentStudent.overallAttended,
    currentStudent.overallConducted,
    targetPercentage
  );

  const criticalSubjects = currentStudent.subjects.filter((s) => s.percentage < 75);
  const warningSubjects = currentStudent.subjects.filter(
    (s) => s.percentage >= 65 && s.percentage < 75
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Student Profile Header & Record Switcher */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
              {currentStudent.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentStudent.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-cyan-300">
                  Roll No: {currentStudent.rollNo}
                </span>
                <span className="text-xs text-slate-400">PRN: {currentStudent.prn}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {currentStudent.department} · {currentStudent.classYear} ({currentStudent.division})
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Mentor: <strong className="text-slate-700 dark:text-slate-300">{currentStudent.mentor}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Parent Contact: {currentStudent.parentContact}
                </span>
              </div>
            </div>
          </div>

          {/* Student Selector Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Switch Student Record:
            </label>
            <select
              value={currentStudent.rollNo}
              onChange={(e) => {
                const found = SAMPLE_STUDENTS.find((s) => s.rollNo === e.target.value);
                if (found) setCurrentStudent(found);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SAMPLE_STUDENTS.map((std) => (
                <option key={std.rollNo} value={std.rollNo}>
                  Roll {std.rollNo} - {std.name} ({std.overallPercentage}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Selector & Overall Standing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Overall Metrics & Target */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Academic Attendance
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Target:</span>
              <select
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Number(e.target.value))}
                className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400"
              >
                <option value={75}>75% (SPPU)</option>
                <option value={80}>80%</option>
                <option value={85}>85%</option>
                <option value={90}>90%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center transition-colors ${
                  overallCalc.status === 'safe'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : overallCalc.status === 'warning'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-red-500 text-red-500'
                }`}
              >
                <span className="text-2xl font-black">{overallCalc.percentage}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Aggregate</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400">Conducted: </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {overallCalc.totalConducted} lectures
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Attended: </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {overallCalc.attended} lectures
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Missed: </span>
                <strong className="text-red-500">{overallCalc.missed} lectures</strong>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    overallCalc.status === 'safe'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : overallCalc.status === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                  }`}
                >
                  {overallCalc.status === 'safe' && <CheckCircle2 className="w-3 h-3" />}
                  {overallCalc.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                  {overallCalc.status === 'critical' && <XCircle className="w-3 h-3" />}
                  <span>{overallCalc.statusLabel}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Recommendation */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {overallCalc.consecutiveNeeded > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Attendance Shortage Detected</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  You must attend <strong>{overallCalc.consecutiveNeeded} consecutive lectures</strong> to reach the required {targetPercentage}% minimum.
                </p>
                {overallCalc.percentage < 65 && (
                  <p className="text-red-600 dark:text-red-400 text-[11px] font-semibold">
                    Warning: Current attendance is below 65% (Strict Detention risk under SPPU Ordinance 157). Meet your GFM immediately.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-1.5">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Eligible & Term Grant Safe</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  You are currently above {targetPercentage}%. You can safely miss up to <strong>{overallCalc.allowableFutureAbsences} upcoming lectures</strong> without dropping below the target.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weekly Trend Chart */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Semester Attendance Trajectory (Weeks 1 to 7)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Reference: 75% SPPU Cutoff
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentStudent.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '75% Cutoff', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#38bdf8' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Trend analysis helps detect downward slides early.</span>
            <button
              onClick={() => setActiveTab('assistant')}
              className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Ask AI to analyze this trend</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Critical Attention Alert (If any subject <75%) */}
      {criticalSubjects.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 dark:text-red-200 text-sm">
                Immediate Attention Required in {criticalSubjects.length} Subject(s)
              </h4>
              <p className="text-xs text-red-800/80 dark:text-red-300/80 mt-0.5">
                SPPU requires 75% in each individual subject separately. Even if aggregate is safe, subject shortages can prevent Term Grant.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('assistant')}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Ask AI for Shortage Plan
          </button>
        </div>
      )}

      {/* Subject-Wise Attendance Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Subject-Wise Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time course monitoring with individual recovery requirements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentStudent.subjects.map((subj) => {
            const subjCalc = calculateAttendance(subj.attended, subj.conducted, targetPercentage);
            return (
              <div
                key={subj.code}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {subj.code} · {subj.type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {subj.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Faculty: {subj.faculty}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xl font-extrabold ${
                        subj.percentage >= targetPercentage
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : subj.percentage >= 65
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}
                    >
                      {subj.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Attended {subj.attended} of {subj.conducted}
                    </span>
                    <span>Missed {subj.conducted - subj.attended}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subj.percentage >= targetPercentage
                          ? 'bg-emerald-500'
                          : subj.percentage >= 65
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, subj.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Subject recovery requirement */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {subjCalc.consecutiveNeeded > 0 ? (
                    <div className="text-amber-700 dark:text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Need {subjCalc.consecutiveNeeded} consecutive lectures</span>
                      </span>
                      <span className="font-bold">for {targetPercentage}%</span>
                    </div>
                  ) : (
                    <div className="text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Can safely miss {subjCalc.allowableFutureAbsences} classes</span>
                      </span>
                      <span className="font-bold">Safe</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
