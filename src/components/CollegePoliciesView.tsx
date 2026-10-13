import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Languages,
} from 'lucide-react';
import { COLLEGE_POLICIES, AttendancePolicy, INSTITUTION_INFO } from '../data/collegeData.ts';

export const CollegePoliciesView: React.FC = () => {
  const [policies, setPolicies] = useState<AttendancePolicy[]>(COLLEGE_POLICIES);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lang, setLang] = useState<'en' | 'mr'>('en');
  const [expandedId, setExpandedId] = useState<string | null>('POL-01');

  const categories = ['All', 'Ordinance', 'Medical', 'Detention', 'Parents', 'Remedial'];

  const filtered = policies.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.marathiSummary.toLowerCase().includes(search.toLowerCase()) ||
      p.fullText.toLowerCase().includes(search.toLowerCase()) ||
      p.clause.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    {
      q: 'What happens if my overall attendance is 76%, but one subject is 68%?',
      qMr: 'माझी एकूण उपस्थिती ७६% आहे, पण एका विषयात ६८% असल्यास काय होईल?',
      a: 'Under SPPU Ordinance 157, attendance criteria must be satisfied for each individual course and practical separately. A shortage in any individual course requires condonation or extra remedial assignments endorsed by the subject teacher before the Term Grant is confirmed.',
      aMr: 'पुणे विद्यापीठ नियमांनुसार प्रत्येक विषयात स्वतंत्रपणे ७५% उपस्थिती आवश्यक असते. एखाद्या विषयात तूट असल्यास विषय शिक्षकांची संमती व अतिरिक्त गृहपाठ पूर्ण करणे आवश्यक आहे.',
    },
    {
      q: 'Within how many days must a medical certificate be submitted?',
      qMr: 'वैद्यकीय प्रमाणपत्र किती दिवसांत सादर करावे लागते?',
      a: 'The medical certificate and leave application must be submitted within three (3) working days of resuming college after illness, countersigned by parents and verified by the Guardian Faculty Member (GFM) and HOD.',
      aMr: 'कॉलेज सुरू झाल्यानंतर ३ कामकाजाच्या दिवसांत पालकांची स्वाक्षरी असलेले वैद्यकीय प्रमाणपत्र जीएफएम व विभागप्रमुखांकडे सादर करणे बंधनकारक आहे.',
    },
    {
      q: 'Can attendance below 65% be condoned under any circumstances?',
      qMr: '६५% पेक्षा कमी उपस्थिती कोणत्याही परिस्थितीत माफ होऊ शकते का?',
      a: 'No. Attendance below 65.0% is strictly non-condonable as per University statutes. Students with less than 65% are declared detained and cannot appear for end-semester university examinations.',
      aMr: 'नाही. ६५% पेक्षा कमी उपस्थिती असल्यास विद्यापीठ नियमांनुसार कोणतीही सवलत मिळत नाही व विद्यार्थ्याला डिटेन केले जाते.',
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Institutional Knowledge Base & Ordinances
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Savitribai Phule Pune University (SPPU) & {INSTITUTION_INFO.collegeName} Guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              lang === 'en'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('mr')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              lang === 'mr'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search policies (e.g. medical, 75%, detention)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Accordions */}
      <div className="space-y-4">
        {filtered.map((pol) => {
          const isExpanded = expandedId === pol.id;
          return (
            <div
              key={pol.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : pol.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 font-mono">
                      {pol.clause}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Category: {pol.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {pol.title}
                  </h3>
                </div>

                <div className="text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                  {/* Summary Callout */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-slate-800 dark:text-slate-200 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white mb-1">
                      {lang === 'mr' ? 'थोडक्यात माहिती (Summary):' : 'Executive Summary:'}
                    </strong>
                    {lang === 'mr' ? pol.marathiSummary : pol.summary}
                  </div>

                  {/* Full Text Clause */}
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Full Institutional Ordinance Text
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px] bg-slate-50/40 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      {pol.fullText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Frequently Answered Policy Inquiries</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 space-y-1 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                Q: {lang === 'mr' ? faq.qMr : faq.q}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                {lang === 'mr' ? faq.aMr : faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
