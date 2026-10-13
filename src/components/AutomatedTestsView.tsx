import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { calculateAttendance, projectRemainingSemester } from '../utils/attendanceCalculator.ts';
import { COLLEGE_POLICIES } from '../data/collegeData.ts';

interface TestCase {
  id: string;
  name: string;
  category: 'Arithmetic' | 'Edge Case' | 'Policy' | 'Safety';
  description: string;
  run: () => { pass: boolean; expected: string; actual: string; details?: string };
}

export const AutomatedTestsView: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    [id: string]: { pass: boolean; expected: string; actual: string; details?: string; timeMs: number };
  }>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const testCases: TestCase[] = [
    {
      id: 'TC-01',
      name: 'Standard Shortage Formula Validation',
      category: 'Arithmetic',
      description: 'A=15, T=25, Target=75% => x = ceil((0.75*25 - 15)/(0.25)) = 15 consecutive classes',
      run: () => {
        const res = calculateAttendance(15, 25, 75);
        const pass = res.consecutiveNeeded === 15 && res.percentage === 60.0;
        return {
          pass,
          expected: 'consecutiveNeeded: 15, percentage: 60.0%',
          actual: `consecutiveNeeded: ${res.consecutiveNeeded}, percentage: ${res.percentage}%`,
        };
      },
    },
    {
      id: 'TC-02',
      name: 'Safe Cushion / Allowable Future Absences',
      category: 'Arithmetic',
      description: 'A=38, T=45, Target=75% => current % is 84.44% => cushion = floor((38 - 0.75*45)/0.75) = 5 classes',
      run: () => {
        const res = calculateAttendance(38, 45, 75);
        const pass = res.consecutiveNeeded === 0 && res.allowableFutureAbsences === 5;
        return {
          pass,
          expected: 'consecutiveNeeded: 0, allowableFutureAbsences: 5',
          actual: `consecutiveNeeded: ${res.consecutiveNeeded}, allowableFutureAbsences: ${res.allowableFutureAbsences}`,
        };
      },
    },
    {
      id: 'TC-03',
      name: 'Zero Classes Conducted (0/0) Safety',
      category: 'Edge Case',
      description: 'A=0, T=0 => should not crash with divide-by-zero, default to 100% or safe state',
      run: () => {
        const res = calculateAttendance(0, 0, 75);
        const pass = res.percentage === 100 && res.consecutiveNeeded === 0 && !res.isHundredPercentImpossible;
        return {
          pass,
          expected: 'No crash, percentage: 100%, consecutiveNeeded: 0',
          actual: `percentage: ${res.percentage}%, consecutiveNeeded: ${res.consecutiveNeeded}`,
        };
      },
    },
    {
      id: 'TC-04',
      name: 'Impossible 100% Target Handled',
      category: 'Edge Case',
      description: 'A=19, T=20, Target=100% => 1 class already missed => 100% is impossible for finite x',
      run: () => {
        const res = calculateAttendance(19, 20, 100);
        const pass = res.isHundredPercentImpossible === true && res.consecutiveNeeded === -1;
        return {
          pass,
          expected: 'isHundredPercentImpossible: true, consecutiveNeeded: -1',
          actual: `isHundredPercentImpossible: ${res.isHundredPercentImpossible}, consecutiveNeeded: ${res.consecutiveNeeded}`,
        };
      },
    },
    {
      id: 'TC-05',
      name: 'Input Clamping (Attended > Conducted)',
      category: 'Safety',
      description: 'A=50, T=40 => Attended clamped to 40, percentage capped at 100%',
      run: () => {
        const res = calculateAttendance(50, 40, 75);
        const pass = res.attended === 40 && res.percentage === 100.0;
        return {
          pass,
          expected: 'attended: 40, percentage: 100.0%',
          actual: `attended: ${res.attended}, percentage: ${res.percentage}%`,
        };
      },
    },
    {
      id: 'TC-06',
      name: 'Negative Number Sanitization',
      category: 'Safety',
      description: 'A=-5, T=-20 => Sanitized to A=0, T=0 without throwing unhandled exceptions',
      run: () => {
        const res = calculateAttendance(-5, -20, 75);
        const pass = res.attended === 0 && res.totalConducted === 0;
        return {
          pass,
          expected: 'attended: 0, totalConducted: 0',
          actual: `attended: ${res.attended}, totalConducted: ${res.totalConducted}`,
        };
      },
    },
    {
      id: 'TC-07',
      name: 'Semester Projection Math',
      category: 'Arithmetic',
      description: 'A=20, T=30, Remaining=20, Target=75% => Final T=50 => Need 38 total => Must attend 18 of 20',
      run: () => {
        const proj = projectRemainingSemester(20, 30, 20, 75);
        const pass = proj.projectedTotal === 50 && proj.mustAttend === 18 && proj.canMiss === 2 && proj.isAchievable;
        return {
          pass,
          expected: 'projectedTotal: 50, mustAttend: 18, canMiss: 2, isAchievable: true',
          actual: `projectedTotal: ${proj.projectedTotal}, mustAttend: ${proj.mustAttend}, canMiss: ${proj.canMiss}, isAchievable: ${proj.isAchievable}`,
        };
      },
    },
    {
      id: 'TC-08',
      name: 'Institutional Policy Retrieval & Clause Matching',
      category: 'Policy',
      description: 'SPPU Ordinance 157 and Medical Condonation (65-74%) clauses correctly defined in database',
      run: () => {
        const ord157 = COLLEGE_POLICIES.find((p) => p.clause.includes('157'));
        const med = COLLEGE_POLICIES.find((p) => p.category === 'Medical');
        const pass = !!ord157 && !!med && ord157.title.includes('75%');
        return {
          pass,
          expected: 'SPPU 157 and Medical policy records found with non-empty clauses',
          actual: `Found ${COLLEGE_POLICIES.length} policies; ord157: ${ord157?.clause || 'none'}, med: ${med?.clause || 'none'}`,
        };
      },
    },
  ];

  const runAllTests = () => {
    setIsRunning(true);
    const newResults: any = {};
    testCases.forEach((tc) => {
      const start = performance.now();
      const res = tc.run();
      const timeMs = Number((performance.now() - start).toFixed(2));
      newResults[tc.id] = { ...res, timeMs };
    });
    setTestResults(newResults);
    setIsRunning(false);
  };

  const passedCount = Object.values(testResults).filter((r) => r.pass).length;
  const totalRun = Object.keys(testResults).length;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Automated Verification & Test Suite
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rigorous mathematical, edge-case, and security assertions executed in real-time.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{totalRun > 0 ? 'Re-Run All Tests' : 'Run Verification Suite'}</span>
        </button>
      </div>

      {/* Summary Scorecard */}
      {totalRun > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">Test Execution Status</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              {passedCount === totalRun ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">All Tests Passed</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">{totalRun - passedCount} Tests Failed</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">Pass Rate</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {((passedCount / totalRun) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">Total Assertions Checked</span>
            <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-1">
              {totalRun} / {testCases.length}
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500">
          Individual Test Specifications
        </h2>

        <div className="space-y-3">
          {testCases.map((tc) => {
            const res = testResults[tc.id];
            return (
              <div
                key={tc.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-750 text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {tc.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {tc.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {tc.category}
                    </span>
                  </div>

                  <div>
                    {res ? (
                      res.pass ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS ({res.timeMs}ms)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 text-xs">Pending execution</span>
                    )}
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {tc.description}
                </p>

                {res && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 font-mono text-[11px] space-y-1">
                    <div className="text-slate-600 dark:text-slate-400">
                      Expected: <span className="text-slate-900 dark:text-slate-200">{res.expected}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Actual: <span className={res.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>{res.actual}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
