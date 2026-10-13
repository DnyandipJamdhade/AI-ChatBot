import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Settings,
  Sliders,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Clock,
  Database,
  Cpu,
} from 'lucide-react';
import { COLLEGE_POLICIES, AttendancePolicy, INSTITUTION_INFO } from '../data/collegeData.ts';

export const AdminDashboardView: React.FC = () => {
  const [minThreshold, setMinThreshold] = useState<number>(75);
  const [medFloor, setMedFloor] = useState<number>(65);
  const [alertThreshold, setAlertThreshold] = useState<number>(70);
  const [policies, setPolicies] = useState<AttendancePolicy[]>(COLLEGE_POLICIES);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Simulated Audit Log
  const [auditLogs, setAuditLogs] = useState<{ id: string; action: string; time: string; admin: string }[]>([
    { id: '1', action: 'System initialized with SPPU Ordinance 157 baselines', time: '10:00 AM', admin: 'Dnyandip (SuperAdmin)' },
    { id: '2', action: 'Loaded synthetic TE Computer Engineering Division A dataset', time: '10:15 AM', admin: 'Dnyandip (SuperAdmin)' },
    { id: '3', action: 'Verified Gemini 3.8 Flash model connectivity & tool routing', time: '10:30 AM', admin: 'System Engine' },
  ]);

  useEffect(() => {
    fetch('/api/system-status')
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch((err) => console.error('Status fetch error:', err));
  }, []);

  const handleSaveThresholds = () => {
    setAuditLogs((prev) => [
      {
        id: Date.now().toString(),
        action: `Adjusted thresholds: Min=${minThreshold}%, MedicalFloor=${medFloor}%, Alert=${alertThreshold}%`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        admin: 'Dnyandip (SuperAdmin)',
      },
      ...prev,
    ]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Institutional Administrator Console
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {INSTITUTION_INFO.collegeName} · Academic Regulations & System Audit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Administrator Authorized</span>
          </span>
        </div>
      </div>

      {/* System Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Reasoning Engine</span>
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {systemStatus?.model || 'gemini-3.8-flash'}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active · Deterministic Tool Routing Enabled
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Data Isolation & Privacy</span>
            <Database className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            Private In-Memory / Client
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            FERPA / Student Privacy Guard Active
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Institutional Lead</span>
            <Settings className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {INSTITUTION_INFO.creator}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {INSTITUTION_INFO.collegeName}
          </div>
        </div>
      </div>

      {/* Main Grid: Threshold Controls and Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configurable Thresholds */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Configurable Attendance Thresholds</span>
            </h2>
            <span className="text-xs text-slate-400">Institutional Policy</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Minimum Mandatory Attendance (SPPU Standard)
                </label>
                <span className="font-bold text-blue-600 dark:text-cyan-400 text-sm">
                  {minThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Baseline percentage required across each course for term completion grant.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Medical Condonation Floor
                </label>
                <span className="font-bold text-amber-500 text-sm">
                  {medFloor}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="74"
                value={medFloor}
                onChange={(e) => setMedFloor(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Shortages down to this percentage can be condoned with genuine medical certificates.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Parent Alert Trigger Level
                </label>
                <span className="font-bold text-red-500 text-sm">
                  {alertThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="80"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-red-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically flags students for GFM parent intimation via SMS/WhatsApp.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSaveThresholds}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Institutional Thresholds</span>
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved & Logged!</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Administrative Audit Log */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Administrative Audit Trail</span>
            </h2>
            <span className="text-xs text-slate-400">Security Log</span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 text-xs space-y-1"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {log.action}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Authorized User: {log.admin}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
