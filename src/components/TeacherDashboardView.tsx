import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Send,
  Users,
  BookOpen,
} from 'lucide-react';
import { SAMPLE_STUDENTS, StudentRecord, INSTITUTION_INFO } from '../data/collegeData.ts';
import { calculateAttendance } from '../utils/attendanceCalculator.ts';

export const TeacherDashboardView: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(SAMPLE_STUDENTS);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'defaulters' | 'critical' | 'safe'>('defaulters');
  const [selectedStudentForNotice, setSelectedStudentForNotice] = useState<StudentRecord | null>(
    SAMPLE_STUDENTS[1] // Aarav Patil by default
  );
  const [noticeLang, setNoticeLang] = useState<'en' | 'mr'>('en');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const totalStudents = students.length;
  const defaulters = students.filter((s) => s.overallPercentage < 75);
  const critical = students.filter((s) => s.overallPercentage < 65);
  const safe = students.filter((s) => s.overallPercentage >= 75);
  const classAvg = (
    students.reduce((acc, curr) => acc + curr.overallPercentage, 0) / totalStudents
  ).toFixed(1);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search);
    if (!matchesSearch) return false;
    if (filter === 'defaulters') return s.overallPercentage < 75;
    if (filter === 'critical') return s.overallPercentage < 65;
    if (filter === 'safe') return s.overallPercentage >= 75;
    return true;
  });

  // Parent Alert Message Template
  const generateNoticeText = (std: StudentRecord, lang: 'en' | 'mr') => {
    const calc = calculateAttendance(std.overallAttended, std.overallConducted, 75);
    if (lang === 'mr') {
      return `आदरणीय पालक,\n\n${INSTITUTION_INFO.collegeFullName} (संगणक अभियांत्रिकी विभाग) तर्फे सूचित करण्यात येते की आपले पाल्य ${std.name} (रोल नं: ${std.rollNo}) याची चालू उपस्थिती केवळ ${std.overallPercentage}% आहे, जी सावित्रीबाई फुले पुणे विद्यापीठाच्या (SPPU) नियमानुसार अनिवार्य असलेल्या ७५% पेक्षा कमी आहे.\n\nविद्यार्थ्याला ७५% उपस्थिती गाठण्यासाठी पुढील सलग ${calc.consecutiveNeeded} तास उपस्थित राहणे आवश्यक आहे. उपस्थिती ६५% पेक्षा खाली गेल्यास टर्म ग्रांट रोखली जाऊ शकते.\n\nकृपया त्वरित वर्गशिक्षक (GFM) / विभागप्रमुखांशी (HOD) संपर्क साधावा.\n\n- संगणक अभियांत्रिकी विभाग, SNJB KBJ COE Chandwad`;
    }
    return `Dear Parent,\n\nThis is to notify from ${INSTITUTION_INFO.collegeFullName} (Dept of Computer Engineering) that your ward ${std.name} (Roll No: ${std.rollNo}) has an attendance of ${std.overallPercentage}%, which is below the mandatory 75% required under Savitribai Phule Pune University (SPPU) Ordinance 157.\n\nThe student must attend ${calc.consecutiveNeeded} consecutive lectures to regain eligibility. A drop below 65% carries strict detention risk.\n\nPlease discuss this with your ward and contact the Guardian Faculty Member (GFM) immediately.\n\n- Department of Computer Engineering, SNJB KBJ COE Chandwad`;
  };

  const currentNotice = selectedStudentForNotice
    ? generateNoticeText(selectedStudentForNotice, noticeLang)
    : '';

  const handleCopyNotice = () => {
    if (!currentNotice) return;
    navigator.clipboard.writeText(currentNotice);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Teacher & Faculty Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Class: <strong>TE Computer Engineering (Div A)</strong> · Semester VI · Academic Year 2026-27
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            Guardian Faculty Member (GFM) Console
          </span>
        </div>
      </div>

      {/* Class Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalStudents}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Class Average</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-1">
            {classAvg}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Defaulters (&lt; 75%)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {defaulters.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Critical (&lt; 65%)</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500 mt-1">
            {critical.length}
          </div>
        </div>
      </div>

      {/* Main Grid: Student Table and Parent Alert Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Students Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Division Attendance Roster
              </h2>
              <p className="text-xs text-slate-400">
                Click any student to draft an automated Parent Alert notice.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilter('defaulters')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filter === 'defaulters'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Defaulters ({defaulters.length})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                All ({totalStudents})
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Attended</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((s) => {
                  const isSelected = selectedStudentForNotice?.rollNo === s.rollNo;
                  return (
                    <tr
                      key={s.rollNo}
                      onClick={() => setSelectedStudentForNotice(s)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/40'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {s.rollNo}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {s.overallAttended}/{s.overallConducted}
                      </td>
                      <td className="py-3 px-3 font-bold text-sm">
                        <span
                          className={
                            s.overallPercentage >= 75
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : s.overallPercentage >= 65
                              ? 'text-amber-500'
                              : 'text-red-500'
                          }
                        >
                          {s.overallPercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.overallPercentage >= 75
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                              : s.overallPercentage >= 65
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                              : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {s.overallPercentage >= 75 ? 'Safe' : s.overallPercentage >= 65 ? 'Warning' : 'Critical'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentForNotice(s);
                          }}
                          className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Automated Parent Notice Generator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Parent Alert Notice Generator</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official GFM communication for defaulters.
              </p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setNoticeLang('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                  noticeLang === 'en'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setNoticeLang('mr')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                  noticeLang === 'mr'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          {selectedStudentForNotice ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedStudentForNotice.name} (Roll {selectedStudentForNotice.rollNo})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Parent: {selectedStudentForNotice.parentContact}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-sm ${
                      selectedStudentForNotice.overallPercentage >= 75
                        ? 'text-emerald-600'
                        : selectedStudentForNotice.overallPercentage >= 65
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}
                  >
                    {selectedStudentForNotice.overallPercentage}%
                  </span>
                </div>
              </div>

              {/* Notice Textarea Preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Ready-to-Send SMS / WhatsApp Notice Draft:
                </label>
                <textarea
                  readOnly
                  rows={8}
                  value={currentNotice}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed focus:outline-none resize-none font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyNotice}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  {copiedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotice ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a student from the left table to generate their parent alert notice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
