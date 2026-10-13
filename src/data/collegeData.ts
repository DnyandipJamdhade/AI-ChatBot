/**
 * Institutional Data & Policies for SNJB KBJ COE Chandwad
 * Created by: Dnyandip
 */

export interface SubjectAttendance {
  code: string;
  name: string;
  faculty: string;
  attended: number;
  conducted: number;
  percentage: number;
  type: 'Theory' | 'Practical';
}

export interface StudentRecord {
  rollNo: string;
  prn: string;
  name: string;
  department: string;
  classYear: string;
  division: string;
  mentor: string;
  parentContact: string;
  overallAttended: number;
  overallConducted: number;
  overallPercentage: number;
  subjects: SubjectAttendance[];
  weeklyTrend: { week: string; percentage: number; attended: number; conducted: number }[];
}

export interface AttendancePolicy {
  id: string;
  title: string;
  category: 'Ordinance' | 'Medical' | 'Detention' | 'Parents' | 'Remedial';
  clause: string;
  summary: string;
  fullText: string;
  marathiSummary: string;
}

export const INSTITUTION_INFO = {
  appName: 'Attendance Information Assistant',
  creator: 'Dnyandip',
  collegeName: 'SNJB KBJ COE Chandwad',
  collegeFullName: "SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, Chandwad",
  affiliation: 'Affiliated to Savitribai Phule Pune University (SPPU), NAAC A Grade',
  location: 'Neminagar, Chandwad, Dist. Nashik, Maharashtra - 423101',
  department: 'Department of Computer Engineering',
  disclaimer:
    'Academic Assistant built for educational analytics. Not an official college registrar portal. Always verify final records with your departmental Guardian Faculty Member (GFM) or HOD.',
};

export const COLLEGE_POLICIES: AttendancePolicy[] = [
  {
    id: 'POL-01',
    title: '75% Mandatory Attendance Rule (SPPU Ordinance 157)',
    category: 'Ordinance',
    clause: 'SPPU Ord. 157 / SNJB-AMC-01',
    summary:
      'Students must maintain a minimum of 75% attendance separately in every theory course and practical laboratory session to obtain Term Grant.',
    marathiSummary:
      'विद्यार्थ्यांना प्रत्येक थिअरी विषय आणि प्रॅक्टिकलमध्ये किमान ७५% उपस्थिती राखणे अनिवार्य आहे. ७५% पेक्षा कमी असल्यास टर्म ग्रँट (परीक्षा पात्रता) धोक्यात येते.',
    fullText:
      'Under Savitribai Phule Pune University Ordinance 157 and SNJB KBJ COE Academic Monitoring Committee guidelines, every registered student is required to attend a minimum of 75% of the total lectures, practicals, tutorials, and seminars conducted in each subject. Failure to maintain 75% overall and subject-wise attendance without granted condonation makes the candidate ineligible for University End-Semester Examinations.',
  },
  {
    id: 'POL-02',
    title: 'Medical Condonation & Extra-Curricular Exemption (65% to 74.99%)',
    category: 'Medical',
    clause: 'SNJB-AMC-MED-04',
    summary:
      'Shortage between 65% and 74.99% may be condoned by the Principal upon HOD recommendation only for genuine hospitalization or certified medical illness.',
    marathiSummary:
      '६५% ते ७४.९९% दरम्यानची तूट वैद्यकीय कारणास्तव (नोंदणीकृत डॉक्टरचे प्रमाणपत्र ३ दिवसात सादर केल्यास) किंवा अधिकृत क्रीडा/तांत्रिक स्पर्धेत सहभागासाठी प्राचार्य स्तरावर माफ केली जाऊ शकते.',
    fullText:
      'A shortage of attendance up to 10% (i.e. attendance between 65.0% and 74.99%) may be condoned on valid medical grounds. The student must submit an application countersigned by parents along with a registered medical practitioner certificate and medical bills to the Guardian Faculty Member (GFM) and Head of Department (HOD) within three (3) working days of resuming college. Participation in official university sports, NSS camps, or youth festivals also qualifies for condonation with prior sanctioned duty leave.',
  },
  {
    id: 'POL-03',
    title: 'Strict Detention for Critical Shortage (<65%)',
    category: 'Detention',
    clause: 'SPPU-DET-08 / SNJB-REG-12',
    summary:
      'Attendance strictly below 65% is non-condonable under any circumstances and results in detention (withholding of Term Grant) for that academic term.',
    marathiSummary:
      '६५% पेक्षा कमी उपस्थिती असल्यास कोणतीही माफी मिळत नाही. विद्यार्थ्याला डिटेन (परीक्षा देण्यास अपात्र) केले जाते आणि पुढील शैक्षणिक वर्षात तो सत्र पुन्हा करावे लागते.',
    fullText:
      'Attendance falling below 65% is strictly non-condonable as per University statutes. Students with less than 65% attendance at the end of the semester shall be declared "Detained" in the Final Defaulter List. Such students will not be granted term completion, will not receive hall tickets for SPPU theory examinations, and must re-register for the term in the subsequent academic session.',
  },
  {
    id: 'POL-04',
    title: 'Monthly Defaulter Display Cycle & Parent Intimation',
    category: 'Parents',
    clause: 'SNJB-AMC-NOT-02',
    summary:
      'Three monthly defaulter lists are published on notice boards and portal. Guardian Faculty Members (GFM) notify parents via SMS/calls.',
    marathiSummary:
      'प्रत्येक महिन्याअखेर डिफॉल्टर यादी (Defaulter List I, II, III) जाहीर केली जाते. जीएफएम शिक्षक पालकांना एसएमएस व फोनद्वारे अनुपस्थितीची माहिती देतात.',
    fullText:
      'The Academic Monitoring Committee publishes Defaulter List I after 30 days, Defaulter List II after 60 days, and Final Defaulter List prior to semester conclusion. Guardian Faculty Members (GFM) contact parents of students having less than 75% attendance. Parents may be summoned to college for an undertaking if attendance continues to slide below 70%.',
  },
  {
    id: 'POL-05',
    title: 'Remedial Attendance Classes & Compensatory Assignments',
    category: 'Remedial',
    clause: 'SNJB-AMC-REM-03',
    summary:
      'Students in the 65%-74.99% warning bracket must complete extra technical assignments and attend scheduled remedial sessions to compensate.',
    marathiSummary:
      '६५% ते ७४% वर्गातील विद्यार्थ्यांना अतिरिक्त गृहपाठ (Assignments) व अतिरिक्त सराव वर्ग पूर्ण करणे बंधनकारक आहे.',
    fullText:
      'Students placed in the warning list (65.0% - 74.99%) are mandated to attend special remedial tutorial sessions conducted beyond standard timetable hours and submit supplementary question bank solutions signed by course teachers before term completion certificates are endorsed.',
  },
];

export const SAMPLE_STUDENTS: StudentRecord[] = [
  {
    rollNo: '22',
    prn: '72201948B',
    name: 'Dnyandip Jamdhade',
    department: 'Computer Engineering',
    classYear: 'TE Comp (Third Year)',
    division: 'Div A',
    mentor: 'Prof. M. A. Sonawane',
    parentContact: '+91 98234 xxxxx',
    overallAttended: 198,
    overallConducted: 240,
    overallPercentage: 82.5,
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems (DBMS)',
        faculty: 'Prof. S. R. Bafna',
        attended: 42,
        conducted: 48,
        percentage: 87.5,
        type: 'Theory',
      },
      {
        code: 'CS302',
        name: 'Theory of Computation (TOC)',
        faculty: 'Prof. R. R. Bhandari',
        attended: 38,
        conducted: 48,
        percentage: 79.17,
        type: 'Theory',
      },
      {
        code: 'CS303',
        name: 'Computer Networks & Security (CNS)',
        faculty: 'Prof. N. P. Dhake',
        attended: 40,
        conducted: 48,
        percentage: 83.33,
        type: 'Theory',
      },
      {
        code: 'CS304',
        name: 'Web Technology (WT)',
        faculty: 'Prof. K. S. Rathod',
        attended: 44,
        conducted: 48,
        percentage: 91.67,
        type: 'Theory',
      },
      {
        code: 'CS305L',
        name: 'DBMS & Network Laboratory',
        faculty: 'Prof. S. R. Bafna / N. P. Dhake',
        attended: 34,
        conducted: 48,
        percentage: 70.83,
        type: 'Practical',
      },
    ],
    weeklyTrend: [
      { week: 'W1', percentage: 90.0, attended: 18, conducted: 20 },
      { week: 'W2', percentage: 85.0, attended: 17, conducted: 20 },
      { week: 'W3', percentage: 80.0, attended: 16, conducted: 20 },
      { week: 'W4', percentage: 82.5, attended: 33, conducted: 40 },
      { week: 'W5', percentage: 84.0, attended: 42, conducted: 50 },
      { week: 'W6', percentage: 81.0, attended: 43, conducted: 53 },
      { week: 'W7', percentage: 82.5, attended: 28, conducted: 37 },
    ],
  },
  {
    rollNo: '15',
    prn: '72201931C',
    name: 'Aarav Patil',
    department: 'Computer Engineering',
    classYear: 'TE Comp (Third Year)',
    division: 'Div A',
    mentor: 'Prof. M. A. Sonawane',
    parentContact: '+91 94221 xxxxx',
    overallAttended: 164,
    overallConducted: 240,
    overallPercentage: 68.33,
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems (DBMS)',
        faculty: 'Prof. S. R. Bafna',
        attended: 32,
        conducted: 48,
        percentage: 66.67,
        type: 'Theory',
      },
      {
        code: 'CS302',
        name: 'Theory of Computation (TOC)',
        faculty: 'Prof. R. R. Bhandari',
        attended: 30,
        conducted: 48,
        percentage: 62.5,
        type: 'Theory',
      },
      {
        code: 'CS303',
        name: 'Computer Networks & Security (CNS)',
        faculty: 'Prof. N. P. Dhake',
        attended: 35,
        conducted: 48,
        percentage: 72.92,
        type: 'Theory',
      },
      {
        code: 'CS304',
        name: 'Web Technology (WT)',
        faculty: 'Prof. K. S. Rathod',
        attended: 36,
        conducted: 48,
        percentage: 75.0,
        type: 'Theory',
      },
      {
        code: 'CS305L',
        name: 'DBMS & Network Laboratory',
        faculty: 'Prof. S. R. Bafna',
        attended: 31,
        conducted: 48,
        percentage: 64.58,
        type: 'Practical',
      },
    ],
    weeklyTrend: [
      { week: 'W1', percentage: 75.0, attended: 15, conducted: 20 },
      { week: 'W2', percentage: 70.0, attended: 14, conducted: 20 },
      { week: 'W3', percentage: 65.0, attended: 13, conducted: 20 },
      { week: 'W4', percentage: 67.5, attended: 27, conducted: 40 },
      { week: 'W5', percentage: 70.0, attended: 35, conducted: 50 },
      { week: 'W6', percentage: 66.0, attended: 35, conducted: 53 },
      { week: 'W7', percentage: 68.3, attended: 25, conducted: 37 },
    ],
  },
  {
    rollNo: '41',
    prn: '72201977D',
    name: 'Pooja Shinde',
    department: 'Computer Engineering',
    classYear: 'TE Comp (Third Year)',
    division: 'Div A',
    mentor: 'Prof. M. A. Sonawane',
    parentContact: '+91 97632 xxxxx',
    overallAttended: 138,
    overallConducted: 240,
    overallPercentage: 57.5,
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems (DBMS)',
        faculty: 'Prof. S. R. Bafna',
        attended: 28,
        conducted: 48,
        percentage: 58.33,
        type: 'Theory',
      },
      {
        code: 'CS302',
        name: 'Theory of Computation (TOC)',
        faculty: 'Prof. R. R. Bhandari',
        attended: 26,
        conducted: 48,
        percentage: 54.17,
        type: 'Theory',
      },
      {
        code: 'CS303',
        name: 'Computer Networks & Security (CNS)',
        faculty: 'Prof. N. P. Dhake',
        attended: 30,
        conducted: 48,
        percentage: 62.5,
        type: 'Theory',
      },
      {
        code: 'CS304',
        name: 'Web Technology (WT)',
        faculty: 'Prof. K. S. Rathod',
        attended: 29,
        conducted: 48,
        percentage: 60.42,
        type: 'Theory',
      },
      {
        code: 'CS305L',
        name: 'DBMS & Network Laboratory',
        faculty: 'Prof. S. R. Bafna',
        attended: 25,
        conducted: 48,
        percentage: 52.08,
        type: 'Practical',
      },
    ],
    weeklyTrend: [
      { week: 'W1', percentage: 60.0, attended: 12, conducted: 20 },
      { week: 'W2', percentage: 55.0, attended: 11, conducted: 20 },
      { week: 'W3', percentage: 50.0, attended: 10, conducted: 20 },
      { week: 'W4', percentage: 57.5, attended: 23, conducted: 40 },
      { week: 'W5', percentage: 60.0, attended: 30, conducted: 50 },
      { week: 'W6', percentage: 56.6, attended: 30, conducted: 53 },
      { week: 'W7', percentage: 57.5, attended: 22, conducted: 37 },
    ],
  },
  {
    rollNo: '07',
    prn: '72201915A',
    name: 'Rohan Deshmukh',
    department: 'Computer Engineering',
    classYear: 'TE Comp (Third Year)',
    division: 'Div A',
    mentor: 'Prof. M. A. Sonawane',
    parentContact: '+91 91580 xxxxx',
    overallAttended: 180,
    overallConducted: 240,
    overallPercentage: 75.0,
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems (DBMS)',
        faculty: 'Prof. S. R. Bafna',
        attended: 37,
        conducted: 48,
        percentage: 77.08,
        type: 'Theory',
      },
      {
        code: 'CS302',
        name: 'Theory of Computation (TOC)',
        faculty: 'Prof. R. R. Bhandari',
        attended: 36,
        conducted: 48,
        percentage: 75.0,
        type: 'Theory',
      },
      {
        code: 'CS303',
        name: 'Computer Networks & Security (CNS)',
        faculty: 'Prof. N. P. Dhake',
        attended: 36,
        conducted: 48,
        percentage: 75.0,
        type: 'Theory',
      },
      {
        code: 'CS304',
        name: 'Web Technology (WT)',
        faculty: 'Prof. K. S. Rathod',
        attended: 36,
        conducted: 48,
        percentage: 75.0,
        type: 'Theory',
      },
      {
        code: 'CS305L',
        name: 'DBMS & Network Laboratory',
        faculty: 'Prof. S. R. Bafna',
        attended: 35,
        conducted: 48,
        percentage: 72.92,
        type: 'Practical',
      },
    ],
    weeklyTrend: [
      { week: 'W1', percentage: 75.0, attended: 15, conducted: 20 },
      { week: 'W2', percentage: 75.0, attended: 15, conducted: 20 },
      { week: 'W3', percentage: 75.0, attended: 15, conducted: 20 },
      { week: 'W4', percentage: 75.0, attended: 30, conducted: 40 },
      { week: 'W5', percentage: 76.0, attended: 38, conducted: 50 },
      { week: 'W6', percentage: 73.5, attended: 39, conducted: 53 },
      { week: 'W7', percentage: 75.0, attended: 28, conducted: 37 },
    ],
  },
  {
    rollNo: '56',
    prn: '72201992E',
    name: 'Tanvi Kulkarni',
    department: 'Computer Engineering',
    classYear: 'TE Comp (Third Year)',
    division: 'Div A',
    mentor: 'Prof. M. A. Sonawane',
    parentContact: '+91 93701 xxxxx',
    overallAttended: 220,
    overallConducted: 240,
    overallPercentage: 91.67,
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems (DBMS)',
        faculty: 'Prof. S. R. Bafna',
        attended: 45,
        conducted: 48,
        percentage: 93.75,
        type: 'Theory',
      },
      {
        code: 'CS302',
        name: 'Theory of Computation (TOC)',
        faculty: 'Prof. R. R. Bhandari',
        attended: 43,
        conducted: 48,
        percentage: 89.58,
        type: 'Theory',
      },
      {
        code: 'CS303',
        name: 'Computer Networks & Security (CNS)',
        faculty: 'Prof. N. P. Dhake',
        attended: 44,
        conducted: 48,
        percentage: 91.67,
        type: 'Theory',
      },
      {
        code: 'CS304',
        name: 'Web Technology (WT)',
        faculty: 'Prof. K. S. Rathod',
        attended: 45,
        conducted: 48,
        percentage: 93.75,
        type: 'Theory',
      },
      {
        code: 'CS305L',
        name: 'DBMS & Network Laboratory',
        faculty: 'Prof. S. R. Bafna',
        attended: 43,
        conducted: 48,
        percentage: 89.58,
        type: 'Practical',
      },
    ],
    weeklyTrend: [
      { week: 'W1', percentage: 95.0, attended: 19, conducted: 20 },
      { week: 'W2', percentage: 90.0, attended: 18, conducted: 20 },
      { week: 'W3', percentage: 90.0, attended: 18, conducted: 20 },
      { week: 'W4', percentage: 92.5, attended: 37, conducted: 40 },
      { week: 'W5', percentage: 92.0, attended: 46, conducted: 50 },
      { week: 'W6', percentage: 90.5, attended: 48, conducted: 53 },
      { week: 'W7', percentage: 91.6, attended: 34, conducted: 37 },
    ],
  },
];

export const SAMPLE_CSV_CONTENT = `Roll No,PRN,Student Name,Subject Code,Subject Name,Attended Classes,Total Conducted,Department
22,72201948B,Dnyandip Jamdhade,CS301,Database Management Systems,42,48,Computer Engineering
22,72201948B,Dnyandip Jamdhade,CS302,Theory of Computation,38,48,Computer Engineering
22,72201948B,Dnyandip Jamdhade,CS303,Computer Networks,40,48,Computer Engineering
22,72201948B,Dnyandip Jamdhade,CS304,Web Technology,44,48,Computer Engineering
15,72201931C,Aarav Patil,CS301,Database Management Systems,32,48,Computer Engineering
15,72201931C,Aarav Patil,CS302,Theory of Computation,30,48,Computer Engineering
15,72201931C,Aarav Patil,CS303,Computer Networks,35,48,Computer Engineering
15,72201931C,Aarav Patil,CS304,Web Technology,36,48,Computer Engineering
41,72201977D,Pooja Shinde,CS301,Database Management Systems,28,48,Computer Engineering
41,72201977D,Pooja Shinde,CS302,Theory of Computation,26,48,Computer Engineering
41,72201977D,Pooja Shinde,CS303,Computer Networks,30,48,Computer Engineering
41,72201977D,Pooja Shinde,CS304,Web Technology,29,48,Computer Engineering
07,72201915A,Rohan Deshmukh,CS301,Database Management Systems,37,48,Computer Engineering
07,72201915A,Rohan Deshmukh,CS302,Theory of Computation,36,48,Computer Engineering
07,72201915A,Rohan Deshmukh,CS303,Computer Networks,36,48,Computer Engineering
07,72201915A,Rohan Deshmukh,CS304,Web Technology,36,48,Computer Engineering
56,72201992E,Tanvi Kulkarni,CS301,Database Management Systems,45,48,Computer Engineering
56,72201992E,Tanvi Kulkarni,CS302,Theory of Computation,43,48,Computer Engineering
56,72201992E,Tanvi Kulkarni,CS303,Computer Networks,44,48,Computer Engineering
56,72201992E,Tanvi Kulkarni,CS304,Web Technology,45,48,Computer Engineering`;
