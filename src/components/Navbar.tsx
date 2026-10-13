import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calculator,
  MessageSquare,
  FileSpreadsheet,
  BookOpen,
  UserCheck,
  ShieldAlert,
  FlaskConical,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Dna,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Role, ActiveTab } from '../types/index.ts';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, FirebaseUser, syncUserProfile } from '../utils/firebase.ts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  darkMode,
  setDarkMode,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u) {
        await syncUserProfile(u, role);
      }
    });
    return () => unsub();
  }, [role]);

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(res.user, role);
    } catch (e: any) {
      console.warn('Google Sign-In notice:', e.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      console.error('Sign out error:', e);
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Report Analyzer', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'science', label: 'Science Lab', icon: <Dna className="w-4 h-4" /> },
    { id: 'multimodal', label: 'AI Studio', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'policies', label: 'College Policies', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tests', label: 'Test Suite', icon: <FlaskConical className="w-4 h-4" /> },
  ];

  if (role === 'teacher') {
    navItems.splice(4, 0, {
      id: 'teacher',
      label: 'Teacher Portal',
      icon: <UserCheck className="w-4 h-4" />,
    });
  } else if (role === 'admin') {
    navItems.splice(4, 0, {
      id: 'admin',
      label: 'Admin Console',
      icon: <ShieldAlert className="w-4 h-4" />,
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b transition-colors bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800">
      {/* Top Academic Sub-Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-slate-200">SNJB KBJ COE Chandwad</span>
          <span className="text-slate-400 hidden sm:inline">· SPPU Affiliated (NAAC 'A' Grade)</span>
          <span className="text-slate-500 hidden md:inline">· Dept. of Computer Engineering</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span>Created by: <strong className="text-cyan-300 font-semibold">Dnyandip</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-400">Academic Project</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Attendance Information Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SNJB KBJ COE Chandwad · AI & Policy Advisor
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher & Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Google Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                  {currentUser.displayName?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-500 p-0.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
                title="Sign in with Google"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Google Login</span>
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Switch User Role"
              >
                <span className="text-slate-400">Role:</span>
                <span className="capitalize font-semibold text-blue-600 dark:text-cyan-400">
                  {role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    Switch Access Role
                  </div>
                  <button
                    onClick={() => {
                      setRole('student');
                      if (activeTab === 'teacher' || activeTab === 'admin') setActiveTab('overview');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      role === 'student' ? 'text-blue-600 dark:text-cyan-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Student View</span>
                    {role === 'student' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>}
                  </button>
                  <button
                    onClick={() => {
                      setRole('teacher');
                      setActiveTab('teacher');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      role === 'teacher' ? 'text-blue-600 dark:text-cyan-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Teacher / Faculty</span>
                    {role === 'teacher' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>}
                  </button>
                  <button
                    onClick={() => {
                      setRole('admin');
                      setActiveTab('admin');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      role === 'admin' ? 'text-blue-600 dark:text-cyan-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Administrator</span>
                    {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-md transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
