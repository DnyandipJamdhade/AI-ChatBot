import React from 'react';
import { GraduationCap, ShieldCheck, Heart, ExternalLink, BookOpen } from 'lucide-react';
import { INSTITUTION_INFO } from '../data/collegeData.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-slate-950 text-slate-400 border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & College */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">
                {INSTITUTION_INFO.appName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An intelligent academic tool engineered to calculate attendance shortages,
              predict required consecutive lectures, analyze batch CSV reports, and navigate
              SPPU & SNJB college ordinances with verifiable mathematical precision.
            </p>
            <div className="pt-2 text-xs text-slate-300 space-y-1">
              <div>
                <strong>Institution:</strong> {INSTITUTION_INFO.collegeFullName}
              </div>
              <div>
                <strong>Affiliation:</strong> {INSTITUTION_INFO.affiliation}
              </div>
              <div>
                <strong>Location:</strong> {INSTITUTION_INFO.location}
              </div>
              <div className="text-cyan-400 font-medium pt-1">
                Project Developer: <span className="underline decoration-cyan-500 underline-offset-2">{INSTITUTION_INFO.creator}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Ordinances */}
          <div className="space-y-3 text-xs">
            <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Academic Standards
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">75%</span>
                <span>Mandatory attendance under SPPU Ordinance 157.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">65-74%</span>
                <span>Medical condonation band with valid doctor certificate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&lt;65%</span>
                <span>Strict detention threshold; non-condonable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">Formula:</span>
                <code className="text-cyan-300 font-mono">x = ⌈(p·T - A)/(1-p)⌉</code>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Disclaimers */}
          <div className="space-y-3 text-xs">
            <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Privacy & Disclaimer
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Student data is processed locally and privately. Uploaded CSVs are analyzed in-browser without persistent database leaks.
            </p>
            <p className="text-slate-500 text-[11px] leading-tight">
              Notice: This project is an academic simulation created by Dnyandip for SNJB KBJ COE Chandwad students and staff. Always cross-verify formal notices with your class Guardian Faculty Member (GFM) and Head of Department.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Attendance Information Assistant · SNJB KBJ COE Chandwad.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Engineered with dedication by</span>
            <span className="font-semibold text-slate-200">{INSTITUTION_INFO.creator}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
