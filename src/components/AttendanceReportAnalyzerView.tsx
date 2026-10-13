import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  BarChart3,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { CSVRow, CSVAnalysisSummary } from '../types/index.ts';
import { calculateAttendance } from '../utils/attendanceCalculator.ts';
import { SAMPLE_CSV_CONTENT } from '../data/collegeData.ts';

export const AttendanceReportAnalyzerView: React.FC = () => {
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [analysis, setAnalysis] = useState<CSVAnalysisSummary | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Function to process and analyze raw rows
  const processRows = (rawRows: any[], sourceName: string) => {
    const errors: string[] = [];
    const validRows: CSVRow[] = [];

    rawRows.forEach((row, idx) => {
      // Find keys case-insensitively or via common aliases
      const getVal = (aliases: string[]) => {
        for (const key of Object.keys(row)) {
          const cleanKey = key.trim().toLowerCase();
          for (const a of aliases) {
            if (cleanKey.includes(a.toLowerCase())) return row[key];
          }
        }
        return '';
      };

      const rollNo = String(getVal(['roll', 'rno', 'id']) || idx + 1).trim();
      const studentName = String(getVal(['name', 'student', 'candidate']) || `Student ${rollNo}`).trim();
      const subjectCode = String(getVal(['code', 'sub_code', 'course_code']) || 'CS301').trim();
      const subjectName = String(getVal(['subject', 'course', 'sub_name', 'sub']) || 'Subject Course').trim();
      const attendedRaw = Number(getVal(['attended', 'present', 'att']) || 0);
      const conductedRaw = Number(getVal(['conducted', 'total', 'held', 'tot']) || 0);
      const prn = String(getVal(['prn', 'reg']) || '').trim();

      if (conductedRaw <= 0) {
        errors.push(`Row ${idx + 1}: Total conducted classes cannot be 0.`);
      }
      if (attendedRaw > conductedRaw) {
        errors.push(`Row ${idx + 1}: Attended classes (${attendedRaw}) exceed total conducted (${conductedRaw}). Clamped to total.`);
      }

      const safeAttended = Math.min(attendedRaw, Math.max(0, conductedRaw));
      const calc = calculateAttendance(safeAttended, conductedRaw, 75);

      validRows.push({
        rollNo,
        prn,
        studentName,
        subjectCode,
        subjectName,
        attended: safeAttended,
        totalConducted: conductedRaw,
        percentage: calc.percentage,
        status: calc.status,
        consecutiveNeeded: calc.consecutiveNeeded,
      });
    });

    setValidationErrors(errors);
    setParsedRows(validRows);
    setFileName(sourceName);

    // Compute Aggregated Analytics
    const studentMap = new Map<string, {
      rollNo: string;
      name: string;
      attended: number;
      conducted: number;
      defaulterSubjects: string[];
    }>();

    const subjectMap = new Map<string, {
      code: string;
      name: string;
      attended: number;
      conducted: number;
      studentCount: number;
      defaultersCount: number;
    }>();

    validRows.forEach((r) => {
      // Aggregate Student
      const sKey = r.rollNo;
      if (!studentMap.has(sKey)) {
        studentMap.set(sKey, {
          rollNo: r.rollNo,
          name: r.studentName,
          attended: 0,
          conducted: 0,
          defaulterSubjects: [],
        });
      }
      const sData = studentMap.get(sKey)!;
      sData.attended += r.attended;
      sData.conducted += r.totalConducted;
      if ((r.percentage || 0) < 75) {
        sData.defaulterSubjects.push(`${r.subjectName} (${r.percentage}%)`);
      }

      // Aggregate Subject
      const subKey = r.subjectCode;
      if (!subjectMap.has(subKey)) {
        subjectMap.set(subKey, {
          code: r.subjectCode,
          name: r.subjectName,
          attended: 0,
          conducted: 0,
          studentCount: 0,
          defaultersCount: 0,
        });
      }
      const subData = subjectMap.get(subKey)!;
      subData.attended += r.attended;
      subData.conducted += r.totalConducted;
      subData.studentCount += 1;
      if ((r.percentage || 0) < 75) {
        subData.defaultersCount += 1;
      }
    });

    const studentSummaries = Array.from(studentMap.values()).map((s) => {
      const calc = calculateAttendance(s.attended, s.conducted, 75);
      return {
        rollNo: s.rollNo,
        name: s.name,
        totalAttended: s.attended,
        totalConducted: s.conducted,
        percentage: calc.percentage,
        status: calc.status,
        consecutiveNeeded: calc.consecutiveNeeded,
        defaulterSubjects: s.defaulterSubjects,
      };
    });

    const subjectsSummary = Array.from(subjectMap.values()).map((sub) => {
      const avgPct = sub.conducted > 0 ? Number(((sub.attended / sub.conducted) * 100).toFixed(2)) : 0;
      return {
        code: sub.code,
        name: sub.name,
        totalAttended: sub.attended,
        totalConducted: sub.conducted,
        averagePercentage: avgPct,
        studentCount: sub.studentCount,
        defaultersCount: sub.defaultersCount,
      };
    });

    const safeCount = studentSummaries.filter((s) => s.status === 'safe').length;
    const warningCount = studentSummaries.filter((s) => s.status === 'warning').length;
    const criticalCount = studentSummaries.filter((s) => s.status === 'critical').length;
    const overallAvg =
      studentSummaries.length > 0
        ? Number(
            (
              studentSummaries.reduce((acc, curr) => acc + curr.percentage, 0) /
              studentSummaries.length
            ).toFixed(2)
          )
        : 0;

    setAnalysis({
      totalRecords: validRows.length,
      uniqueStudents: studentSummaries.length,
      uniqueSubjects: subjectsSummary.length,
      overallAttendanceAverage: overallAvg,
      safeCount,
      warningCount,
      criticalCount,
      subjectsSummary,
      studentSummaries,
    });
  };

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processRows(results.data, file.name);
      },
      error: (err) => {
        setValidationErrors([`File parse error: ${err.message}`]);
      },
    });
  };

  // Load Built-In Demonstration Data
  const handleLoadSample = () => {
    Papa.parse(SAMPLE_CSV_CONTENT, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processRows(results.data, 'SNJB_TE_Comp_Attendance_Report.csv');
      },
    });
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SNJB_Attendance_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Analysis Report
  const handleExportAnalysis = () => {
    if (!analysis) return;
    const exportData = analysis.studentSummaries.map((s) => ({
      'Roll No': s.rollNo,
      'Student Name': s.name,
      'Attended Classes': s.totalAttended,
      'Total Conducted': s.totalConducted,
      'Attendance Percentage': `${s.percentage}%`,
      'Academic Status': s.status.toUpperCase(),
      'Consecutive Classes Needed for 75%': s.consecutiveNeeded,
      'Defaulter Subjects': s.defaulterSubjects.join('; ') || 'None',
    }));

    const csvStr = Papa.unparse(exportData);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_Analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Students List
  const filteredStudents = (analysis?.studentSummaries || []).filter((s) => {
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Attendance Report Analyzer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload institutional attendance CSV or Excel exports for automated defaulter detection and aggregate charting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Download CSV Template</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Sample SNJB CSV</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-3 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <label className="cursor-pointer">
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Choose a CSV file
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400"> or drag and drop</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-slate-400 mt-1">
            Accepts CSV format with columns: Roll No, Student Name, Subject, Attended, Conducted.
          </p>
        </div>
        {fileName && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Loaded: {fileName}</span>
          </div>
        )}
      </div>

      {/* Validation Warnings */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Dataset Validation Notices ({validationErrors.length})</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-amber-700 dark:text-amber-300 space-y-0.5">
            {validationErrors.slice(0, 4).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Output Dashboard */}
      {analysis && (
        <div className="space-y-8">
          {/* Top Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">Total Enrolled Students</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {analysis.uniqueStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">Class Average Attendance</span>
              <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-1">
                {analysis.overallAttendanceAverage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">Eligible (≥ 75%)</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {analysis.safeCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">Total Defaulters (&lt; 75%)</span>
              <div className="text-2xl font-bold text-red-500 mt-1">
                {analysis.warningCount + analysis.criticalCount}
              </div>
            </div>
          </div>

          {/* Visual Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Subject Attendance Average */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Subject-Wise Class Averages
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Target: 75%</span>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.subjectsSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Avg Attendance']}
                    />
                    <Bar dataKey="averagePercentage" radius={[4, 4, 0, 0]}>
                      {analysis.subjectsSummary.map((sub, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={sub.averagePercentage >= 75 ? '#10b981' : '#f59e0b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Breakdown Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Defaulter Classification Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Safe Standing (≥ 75%)
                    </span>
                    <span className="font-bold">{analysis.safeCount} students</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${(analysis.safeCount / analysis.uniqueStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-amber-500">
                      Warning Condonation Band (65% - 74.9%)
                    </span>
                    <span className="font-bold">{analysis.warningCount} students</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${(analysis.warningCount / analysis.uniqueStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-red-500">
                      Critical Detention Bracket (&lt; 65%)
                    </span>
                    <span className="font-bold">{analysis.criticalCount} students</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(analysis.criticalCount / analysis.uniqueStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleExportAnalysis}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Full Defaulter Analysis (CSV)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student Aggregated Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Student Attendance Roster
                </h3>
                <p className="text-xs text-slate-400">
                  Showing {filteredStudents.length} of {analysis.uniqueStudents} students
                </p>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search roll or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                  {(['all', 'safe', 'warning', 'critical'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                        filterStatus === st
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Attended / Total</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Recovery Needed</th>
                    <th className="py-3 px-4">Defaulter Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((s) => (
                    <tr key={s.rollNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {s.rollNo}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {s.totalAttended} / {s.totalConducted}
                      </td>
                      <td className="py-3 px-4 font-bold text-sm">
                        <span
                          className={
                            s.percentage >= 75
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : s.percentage >= 65
                              ? 'text-amber-500'
                              : 'text-red-500'
                          }
                        >
                          {s.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'safe'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                              : s.status === 'warning'
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                              : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {s.status === 'safe' && <CheckCircle2 className="w-3 h-3" />}
                          {s.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                          {s.status === 'critical' && <XCircle className="w-3 h-3" />}
                          <span className="capitalize">{s.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {s.consecutiveNeeded > 0 ? (
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {s.consecutiveNeeded} lectures
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Eligible
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {s.defaulterSubjects.length > 0 ? (
                          <span className="text-red-500 font-medium">
                            {s.defaulterSubjects.join(', ')}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
