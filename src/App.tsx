import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { OverviewView } from './components/OverviewView.tsx';
import { AttendanceCalculatorView } from './components/AttendanceCalculatorView.tsx';
import { StudentDashboardView } from './components/StudentDashboardView.tsx';
import { AIChatAssistantView } from './components/AIChatAssistantView.tsx';
import { AttendanceReportAnalyzerView } from './components/AttendanceReportAnalyzerView.tsx';
import { TeacherDashboardView } from './components/TeacherDashboardView.tsx';
import { AdminDashboardView } from './components/AdminDashboardView.tsx';
import { CollegePoliciesView } from './components/CollegePoliciesView.tsx';
import { AutomatedTestsView } from './components/AutomatedTestsView.tsx';
import { BioscienceLabView } from './components/BioscienceLabView.tsx';
import { MultimodalStudioView } from './components/MultimodalStudioView.tsx';
import { Role, ActiveTab } from './types/index.ts';
import { SAMPLE_STUDENTS, StudentRecord } from './data/collegeData.ts';
import { testFirestoreConnection } from './utils/firebase.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [role, setRole] = useState<Role>('student');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentRecord>(SAMPLE_STUDENTS[0]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <OverviewView setActiveTab={setActiveTab} />
            {/* Student Live Dashboard Preview */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Student Academic Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live authenticated student standing and subject tracking.
                  </p>
                </div>
              </div>
              <StudentDashboardView
                currentStudent={currentStudent}
                setCurrentStudent={setCurrentStudent}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        )}

        {activeTab === 'calculator' && <AttendanceCalculatorView />}

        {activeTab === 'assistant' && (
          <AIChatAssistantView currentStudent={currentStudent} />
        )}

        {activeTab === 'analyzer' && <AttendanceReportAnalyzerView />}

        {activeTab === 'science' && <BioscienceLabView />}

        {activeTab === 'multimodal' && <MultimodalStudioView />}

        {activeTab === 'policies' && <CollegePoliciesView />}

        {activeTab === 'teacher' && <TeacherDashboardView />}

        {activeTab === 'admin' && <AdminDashboardView />}

        {activeTab === 'tests' && <AutomatedTestsView />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
