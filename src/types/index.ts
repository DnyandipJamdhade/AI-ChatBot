export type Role = 'student' | 'teacher' | 'admin';

export type ActiveTab =
  | 'overview'
  | 'calculator'
  | 'assistant'
  | 'analyzer'
  | 'policies'
  | 'teacher'
  | 'admin'
  | 'tests'
  | 'science'
  | 'multimodal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolUsed?: string;
  toolResult?: any;
  source?: 'gemini-ai' | 'deterministic-assistant';
}

export interface CSVRow {
  rollNo: string;
  prn?: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  attended: number;
  totalConducted: number;
  department?: string;
  percentage?: number;
  status?: 'safe' | 'warning' | 'critical';
  consecutiveNeeded?: number;
}

export interface CSVAnalysisSummary {
  totalRecords: number;
  uniqueStudents: number;
  uniqueSubjects: number;
  overallAttendanceAverage: number;
  safeCount: number;
  warningCount: number;
  criticalCount: number;
  subjectsSummary: {
    code: string;
    name: string;
    totalAttended: number;
    totalConducted: number;
    averagePercentage: number;
    studentCount: number;
    defaultersCount: number;
  }[];
  studentSummaries: {
    rollNo: string;
    name: string;
    totalAttended: number;
    totalConducted: number;
    percentage: number;
    status: 'safe' | 'warning' | 'critical';
    consecutiveNeeded: number;
    defaulterSubjects: string[];
  }[];
}
