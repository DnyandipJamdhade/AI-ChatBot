import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { calculateAttendance, projectRemainingSemester } from './src/utils/attendanceCalculator.ts';
import { COLLEGE_POLICIES, SAMPLE_STUDENTS, INSTITUTION_INFO } from './src/data/collegeData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client (Server-Side Only)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Function Declarations for Gemini Tool Calling
const calculateAttendanceDeclaration: FunctionDeclaration = {
  name: 'calculate_attendance',
  description: 'Calculates attendance percentage, missed classes, and status relative to a target percentage.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      attended: { type: Type.NUMBER, description: 'Number of classes attended' },
      totalConducted: { type: Type.NUMBER, description: 'Total number of classes conducted' },
      targetPercentage: { type: Type.NUMBER, description: 'Target attendance percentage, default 75' },
    },
    required: ['attended', 'totalConducted'],
  },
};

const calculateRequiredClassesDeclaration: FunctionDeclaration = {
  name: 'calculate_required_classes',
  description: 'Calculates minimum consecutive additional classes required to reach a target attendance percentage using the formula x = max(0, ceil((p*T - A)/(1-p))).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      attended: { type: Type.NUMBER, description: 'Classes attended' },
      totalConducted: { type: Type.NUMBER, description: 'Total classes conducted' },
      targetPercentage: { type: Type.NUMBER, description: 'Target percentage (e.g. 75)' },
    },
    required: ['attended', 'totalConducted', 'targetPercentage'],
  },
};

const calculateAllowableFutureAbsencesDeclaration: FunctionDeclaration = {
  name: 'calculate_allowable_future_absences',
  description: 'Calculates how many future consecutive classes a student can safely miss while maintaining their target attendance percentage.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      attended: { type: Type.NUMBER, description: 'Classes attended' },
      totalConducted: { type: Type.NUMBER, description: 'Total classes conducted' },
      targetPercentage: { type: Type.NUMBER, description: 'Target percentage (default 75)' },
    },
    required: ['attended', 'totalConducted'],
  },
};

const searchAttendancePolicyDeclaration: FunctionDeclaration = {
  name: 'search_attendance_policy',
  description: 'Searches official SNJB KBJ COE Chandwad and SPPU attendance policies, including 75% rule, medical condonation (65-74%), detention rules (<65%), and parent intimation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'Search term or topic such as medical, detention, 75%, condonation, remedial' },
    },
    required: ['query'],
  },
};

const getAuthorizedStudentAttendanceDeclaration: FunctionDeclaration = {
  name: 'get_authorized_student_attendance',
  description: 'Retrieves authorized student attendance record by roll number or student name.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      identifier: { type: Type.STRING, description: 'Roll number or student name (e.g. 22 or Dnyandip Jamdhade)' },
    },
    required: ['identifier'],
  },
};

// Deterministic Tool Handlers
function executeTool(name: string, args: any) {
  switch (name) {
    case 'calculate_attendance': {
      const res = calculateAttendance(args.attended, args.totalConducted, args.targetPercentage || 75);
      return res;
    }
    case 'calculate_required_classes': {
      const res = calculateAttendance(args.attended, args.totalConducted, args.targetPercentage || 75);
      return {
        consecutiveNeeded: res.consecutiveNeeded,
        isHundredPercentImpossible: res.isHundredPercentImpossible,
        percentage: res.percentage,
        formulaExplanation: res.formulaExplanation,
      };
    }
    case 'calculate_allowable_future_absences': {
      const res = calculateAttendance(args.attended, args.totalConducted, args.targetPercentage || 75);
      return {
        allowableFutureAbsences: res.allowableFutureAbsences,
        percentage: res.percentage,
        status: res.status,
      };
    }
    case 'search_attendance_policy': {
      const q = (args.query || '').toLowerCase();
      const matched = COLLEGE_POLICIES.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.fullText.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      return matched.length > 0 ? matched : COLLEGE_POLICIES;
    }
    case 'get_authorized_student_attendance': {
      const id = String(args.identifier || '').toLowerCase();
      const student = SAMPLE_STUDENTS.find(
        (s) => s.rollNo.toLowerCase() === id || s.name.toLowerCase().includes(id)
      );
      if (!student) {
        return { error: `Student with identifier "${args.identifier}" not found in authorized sample records.` };
      }
      return student;
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// 1. API: System Status
app.get('/api/system-status', (_req, res) => {
  res.json({
    status: 'online',
    appName: INSTITUTION_INFO.appName,
    institution: INSTITUTION_INFO.collegeName,
    creator: INSTITUTION_INFO.creator,
    geminiConfigured: !!apiKey,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// 2. API: Deterministic Calculator Endpoint
app.post('/api/calculate', (req, res) => {
  try {
    const { attended, totalConducted, targetPercentage, remainingClasses } = req.body;
    if (attended === undefined || totalConducted === undefined) {
      return res.status(400).json({ error: 'Missing required parameters: attended and totalConducted.' });
    }
    const result = calculateAttendance(Number(attended), Number(totalConducted), Number(targetPercentage || 75));

    let projection = null;
    if (remainingClasses !== undefined && Number(remainingClasses) > 0) {
      projection = projectRemainingSemester(Number(attended), Number(totalConducted), Number(remainingClasses), Number(targetPercentage || 75));
    }

    return res.json({ ...result, projection });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Calculation error' });
  }
});

// 3. API: Policies List
app.get('/api/policies', (_req, res) => {
  res.json({
    institution: INSTITUTION_INFO,
    policies: COLLEGE_POLICIES,
  });
});

// 4. API: Sample Student Records
app.get('/api/sample-data', (_req, res) => {
  res.json({
    institution: INSTITUTION_INFO,
    students: SAMPLE_STUDENTS,
  });
});

// 5. API: AI Chat Assistant with Gemini 3.8 Flash & Deterministic Fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, currentStudent, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const isMarathi =
      language === 'mr' ||
      message.includes('मराठी') ||
      message.toLowerCase().includes('marathi') ||
      /[\u0900-\u097F]/.test(message);

    // Build system instructions with strict anti-hallucination and mathematical rules
    const systemInstruction = `You are the official Attendance Information Assistant for SNJB KBJ COE Chandwad (SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, Chandwad), created by Dnyandip.
Institution Context: Affiliated to Savitribai Phule Pune University (SPPU), NAAC A Grade accredited.
Current Active Student Record: ${
      currentStudent
        ? `Roll No: ${currentStudent.rollNo}, Name: ${currentStudent.name}, Dept: ${currentStudent.department}, Attended: ${currentStudent.overallAttended}/${currentStudent.overallConducted} (${currentStudent.overallPercentage}%). Subjects: ${JSON.stringify(
            currentStudent.subjects?.map((s: any) => `${s.name}: ${s.attended}/${s.conducted} (${s.percentage}%)`)
          )}`
        : 'Demonstration / General mode'
    }

Institutional Attendance Rules:
1. Minimum 75% attendance is strictly mandatory in every theory course and practical under SPPU Ordinance 157.
2. Condonation up to 10% (between 65.0% and 74.99%) is permissible strictly on certified medical grounds (registered doctor certificate submitted within 3 working days to GFM/HOD) or official university sports/NSS duty.
3. Attendance below 65.0% is treated as Critical Defaulter and is non-condonable under SPPU statutes. The student will be detained and barred from University End-Semester exams.
4. Monthly Defaulter Lists I, II, and Final are published, and Guardian Faculty Members (GFM) notify parents.

Mathematical Rules:
- For required consecutive classes to reach target percentage p:
  Formula: x = max(0, ceil((p*T - A)/(1-p)))
- For 100% target: If student has missed any class (A < T), mathematically explain that reaching 100% is impossible in any finite number of classes.
- For allowable future absences cushion when current % >= target:
  y = floor((A - p*T)/p)
- Never invent fictional attendance records. Never hallucinate fake grades or marks.
- Support both English and Marathi (मराठी) when requested.
- Keep tone professional, academic, supportive, and clear.`;

    // Attempt Gemini call if API key is present
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            ...(history || []).map((h: any) => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
          ],
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature for high precision and consistent calculations
            tools: [
              {
                functionDeclarations: [
                  calculateAttendanceDeclaration,
                  calculateRequiredClassesDeclaration,
                  calculateAllowableFutureAbsencesDeclaration,
                  searchAttendancePolicyDeclaration,
                  getAuthorizedStudentAttendanceDeclaration,
                ],
              },
            ],
          },
        });

        // Check if model returned function calls
        const functionCalls = response.functionCalls;
        if (functionCalls && functionCalls.length > 0) {
          const toolCall = functionCalls[0];
          const toolResult = executeTool(toolCall.name || '', toolCall.args);

          // Second round to generate natural language explanation of tool result
          const followUp = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              { role: 'user', parts: [{ text: message }] },
              {
                role: 'model',
                parts: [
                  {
                    functionCall: {
                      name: toolCall.name,
                      args: toolCall.args,
                    },
                  },
                ],
              },
              {
                role: 'user',
                parts: [
                  {
                    text: `Tool ${toolCall.name} returned: ${JSON.stringify(
                      toolResult
                    )}. Now answer the user's question clearly with step-by-step numbers and polite guidance in ${
                      isMarathi ? 'Marathi (मराठी)' : 'English'
                    }.`,
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });

          return res.json({
            reply: followUp.text || 'Calculation completed successfully.',
            toolUsed: toolCall.name,
            toolResult,
            source: 'gemini-ai',
          });
        }

        const reply = response.text;
        return res.json({
          reply: reply || 'Could not generate a response.',
          source: 'gemini-ai',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call warning, falling back to deterministic assistant:', geminiError?.message);
        // Fall through to deterministic response engine
      }
    }

    // Deterministic Rule-Based & Semantic Fallback Engine (Reliable, Zero-Failure)
    const lower = message.toLowerCase();
    let reply = '';
    let toolUsed = '';
    let toolResult: any = null;

    // Check for calculation intent with numbers: e.g. "attended 35 out of 45", "35/45", "calculate attendance"
    const numbersMatch = lower.match(/(\d+)\s*(?:out of|\/|\s+of\s+)\s*(\d+)/i) || lower.match(/attended\s*(\d+).*?total\s*(\d+)/i);
    if (numbersMatch || lower.includes('calculate') || lower.includes('percentage') || lower.includes('कॅल्क्युलेट')) {
      let attended = currentStudent ? currentStudent.overallAttended : 35;
      let total = currentStudent ? currentStudent.overallConducted : 48;
      if (numbersMatch) {
        attended = parseInt(numbersMatch[1], 10);
        total = parseInt(numbersMatch[2], 10);
      }
      const calc = calculateAttendance(attended, total, 75);
      toolUsed = 'calculate_attendance';
      toolResult = calc;

      if (isMarathi) {
        reply = `**उपस्थिती विश्लेषण (Attendance Calculation):**\n\n` +
          `- **एकूण झालेले तास:** ${calc.totalConducted}\n` +
          `- **उपस्थित तास:** ${calc.attended}\n` +
          `- **गैरहजर तास:** ${calc.missed}\n` +
          `- **चालू उपस्थिती:** **${calc.percentage}%**\n` +
          `- **स्थिती:** ${calc.status === 'safe' ? 'सुरक्षित (७५% पेक्षा जास्त)' : calc.status === 'warning' ? 'सावधान (६५% ते ७५% वैद्यकीय कक्षेत)' : 'धोकादायक डिफॉल्टर (<६५%)'}\n\n`;

        if (calc.consecutiveNeeded > 0) {
          reply += `🎯 **७५% गाठण्यासाठी:** तुम्हाला पुढील सलग **${calc.consecutiveNeeded}** तास न चुकता उपस्थित राहावे लागेल.\n\nसूत्र: $x = \\lceil (0.75 \\times ${calc.totalConducted} - ${calc.attended}) \\div (1 - 0.75) \\rceil = ${calc.consecutiveNeeded}$`;
        } else {
          reply += `✅ **अभिनंदन!** तुमची उपस्थिती ७५% पेक्षा जास्त आहे. तुम्ही पुढील **${calc.allowableFutureAbsences}** तास गैरहजर राहिलात तरी उपस्थिती ७५% राहील.`;
        }
      } else {
        reply = `**Attendance Analysis & Breakdown:**\n\n` +
          `- **Total Lectures Conducted:** ${calc.totalConducted}\n` +
          `- **Lectures Attended:** ${calc.attended}\n` +
          `- **Lectures Missed:** ${calc.missed}\n` +
          `- **Current Attendance Percentage:** **${calc.percentage}%**\n` +
          `- **Academic Status:** **${calc.statusLabel}**\n\n`;

        if (calc.consecutiveNeeded > 0) {
          reply += `🎯 **Required Classes:** You need to attend **${calc.consecutiveNeeded} consecutive upcoming lectures** to reach the mandatory 75% threshold.\n\n` +
            `*Formula:*\n` +
            `$$x = \\left\\lceil \\frac{p \\cdot T - A}{1 - p} \\right\\rceil = \\left\\lceil \\frac{0.75 \\times ${calc.totalConducted} - ${calc.attended}}{0.25} \\right\\rceil = ${calc.consecutiveNeeded}$$\n\n` +
            `*Verification:* $(${calc.attended} + ${calc.consecutiveNeeded}) / (${calc.totalConducted} + ${calc.consecutiveNeeded}) = ${(((calc.attended + calc.consecutiveNeeded) / (calc.totalConducted + calc.consecutiveNeeded)) * 100).toFixed(2)}\\%$`;
        } else {
          reply += `✅ **Target Achieved!** Your attendance is above 75%.\n` +
            `- **Safety Cushion:** You can safely miss up to **${calc.allowableFutureAbsences}** future lectures while remaining at or above 75%.`;
        }
      }
    } else if (lower.includes('rule') || lower.includes('policy') || lower.includes('medical') || lower.includes('detention') || lower.includes('नियम')) {
      toolUsed = 'search_attendance_policy';
      toolResult = COLLEGE_POLICIES;

      if (isMarathi) {
        reply = `**एसएनजेबी केबीजे अभियांत्रिकी महाविद्यालय आणि पुणे विद्यापीठ उपस्थिती नियम:**\n\n` +
          `१. **किमान ७५% नियम (SPPU Ordinance 157):** प्रत्येक थिअरी व प्रॅक्टिकलमध्ये किमान ७५% उपस्थिती अनिवार्य आहे.\n` +
          `२. **वैद्यकीय सवलत (६५% ते ७४.९%):** गंभीर आजारपण असल्यास नोंदणीकृत डॉक्टरांचे प्रमाणपत्र कॉलेज सुरू झाल्यानंतर ३ कामकाजाच्या दिवसांत HOD कडे सादर केल्यास प्राचार्य स्तरावर सूट मिळू शकते.\n` +
          `३. **डिटेन्शन (<६५%):** ६५% पेक्षा कमी उपस्थिती असल्यास कोणतीही सूट मिळत नाही, विद्यार्थ्याला सत्र परीक्षा देण्यास अपात्र (Detained) ठरवले जाते.\n` +
          `४. **पालक संपर्क:** प्रत्येक महिन्याला डिफॉल्टर यादी प्रसिद्ध केली जाते व पालकांना कळवले जाते.`;
      } else {
        reply = `**Key Institutional Attendance Policies (SNJB KBJ COE Chandwad & SPPU):**\n\n` +
          `1. **75% Minimum Requirement (SPPU Ord. 157):** Mandatory in all theory and practical subjects for Term Grant.\n` +
          `2. **Medical Condonation (65% to 74.99%):** Shortage can be condoned by the Principal upon HOD recommendation on valid medical grounds, provided a doctor certificate is submitted within 3 working days of resuming classes.\n` +
          `3. **Strict Detention (<65%):** Non-condonable. Students with <65% are detained from University End-Semester examinations.\n` +
          `4. **Defaulter Reporting:** Monthly Defaulter Lists I & II are displayed, and Guardian Faculty Members (GFM) notify parents via SMS.`;
      }
    } else if (lower.includes('subject') || lower.includes('low') || lower.includes('attention') || lower.includes('विषय')) {
      if (currentStudent && currentStudent.subjects) {
        const sorted = [...currentStudent.subjects].sort((a: any, b: any) => a.percentage - b.percentage);
        const lowest = sorted[0];
        const critical = sorted.filter((s: any) => s.percentage < 75);

        if (isMarathi) {
          reply = `**विषयवार उपस्थिती विश्लेषण (${currentStudent.name}):**\n\n` +
            `- **सर्वात कमी उपस्थिती असलेला विषय:** **${lowest.name}** (${lowest.percentage}% - ${lowest.attended}/${lowest.conducted})\n` +
            `- **७५% पेक्षा कमी असलेले विषय:** ${critical.length} विषय\n\n` +
            critical
              .map((s: any) => {
                const req = calculateAttendance(s.attended, s.conducted, 75).consecutiveNeeded;
                return `• **${s.name}:** ${s.percentage}% (${s.attended}/${s.conducted}) ➔ ७५% गाठण्यासाठी आणखी **${req}** तास हवेत.`;
              })
              .join('\n');
        } else {
          reply = `**Subject-Wise Attendance Review for ${currentStudent.name}:**\n\n` +
            `- **Lowest Attendance Subject:** **${lowest.name}** (${lowest.percentage}% - ${lowest.attended}/${lowest.conducted})\n` +
            `- **Subjects Requiring Immediate Attention (<75%):** ${critical.length} subject(s)\n\n` +
            critical
              .map((s: any) => {
                const req = calculateAttendance(s.attended, s.conducted, 75).consecutiveNeeded;
                return `• **${s.name}:** ${s.percentage}% (${s.attended}/${s.conducted}) ➔ Need **${req} consecutive classes** to hit 75%.`;
              })
              .join('\n');
        }
      } else {
        reply = isMarathi
          ? `कृपया तुमचा विद्यार्थी रोल नंबर निवडा किंवा "35 out of 45" असे तास सांगा.`
          : `Please select a student record from the dropdown or provide your subject attended and conducted lecture counts to evaluate.`;
      }
    } else {
      // General overview
      if (isMarathi) {
        reply = `मी **अटेंडन्स इन्फॉर्मेशन असिस्टंट** आहे, ज्याची निर्मिती **ज्ञानदीप (Dnyandip)** यांनी **SNJB KBJ COE Chandwad** साठी केली आहे.\n\nमी खालील प्रश्नांची उत्तरे देऊ शकतो:\n1. माझी सध्याची उपस्थिती टक्केवारी मोजा.\n2. ७५% उपस्थिती गाठण्यासाठी किती तास बसावे लागेल?\n3. कोणत्या विषयात उपस्थिती कमी आहे?\n4. कॉलेजचे वैद्यकीय सवलतीचे व गैरहजेरीचे नियम काय आहेत?\n5. अपलोड केलेल्या अहवालाचे विश्लेषण करा.`;
      } else {
        reply = `Hello! I am your **Attendance Information Assistant** for **SNJB KBJ COE Chandwad**, created by **Dnyandip**.\n\nI can help you with:\n1. Calculating exact attendance percentage and missed lectures.\n2. Finding how many consecutive classes you must attend to reach 75% or 80%.\n3. Checking how many upcoming classes you can safely miss.\n4. Analyzing subject shortages and identifying critical subjects.\n5. Explaining SPPU Ordinance 157 and SNJB medical condonation rules.\n6. Answering in both English and Marathi (मराठी).`;
      }
    }

    return res.json({
      reply,
      toolUsed,
      toolResult,
      source: 'deterministic-assistant',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// 6. Science API Endpoints (Proteins, AlphaFold, Genomics, Chemistry)
app.get('/api/science/alphafold/:id', async (req, res) => {
  try {
    const accession = req.params.id.trim();
    const response = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${encodeURIComponent(accession)}`, {
      headers: { 'User-Agent': 'AcademicBioAssistant/1.0 (SNJB KBJ COE Chandwad)' },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `AlphaFold API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AlphaFold fetch failed' });
  }
});

app.get('/api/science/uniprot', async (req, res) => {
  try {
    const query = String(req.query.query || 'insulin').trim();
    const response = await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}&size=5&format=json`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `UniProt API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'UniProt search failed' });
  }
});

app.get('/api/science/pubchem', async (req, res) => {
  try {
    const name = String(req.query.name || 'aspirin').trim();
    const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `PubChem API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'PubChem search failed' });
  }
});

// 7. Audio Transcription using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required (base64 string).' });
    }
    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini client is not configured on this server.' });
    }

    const cleanBase64 = audioData.includes(',') ? audioData.split(',')[1] : audioData;
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: cleanBase64,
            },
          },
          { text: 'Transcribe this spoken audio accurately. Output the verbatim transcription text.' },
        ],
      },
    });

    res.json({ transcription: response.text || '' });
  } catch (err: any) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: err.message || 'Audio transcription failed' });
  }
});

// 8. Image Creation & Editing using gemini-nano-banana-2.1 or gemini-3.1-flash-lite-image
app.post('/api/image/generate', async (req, res) => {
  try {
    const { prompt, baseImage, mimeType, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }
    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini client is not configured on this server.' });
    }

    const modelName = 'gemini-nano-banana-2.1';
    const parts: any[] = [{ text: prompt }];

    if (baseImage) {
      const cleanData = baseImage.includes(',') ? baseImage.split(',')[1] : baseImage;
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanData,
        },
      });
    }

    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
          imageSize: '1K',
        },
      },
    });

    let imageUrl = '';
    let textOutput = '';

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textOutput += part.text;
      }
    }

    res.json({ imageUrl, text: textOutput });
  } catch (err: any) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: err.message || 'Image generation failed' });
  }
});

// 9. Music Generation using lyria-3-clip-preview
app.post('/api/music/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Music prompt is required.' });
    }
    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini client is not configured on this server.' });
    }

    const response = await aiClient.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({ audioData: audioBase64, mimeType, lyrics });
  } catch (err: any) {
    console.error('Music generation error:', err);
    res.status(500).json({ error: err.message || 'Music generation failed' });
  }
});

// 10. Multi-Model Chatbot (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite)
app.post('/api/gemini/advanced-chat', async (req, res) => {
  try {
    const { message, model, systemInstruction, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini client is not configured on this server.' });
    }

    const selectedModel = model || 'gemini-3.5-flash';
    const response = await aiClient.models.generateContent({
      model: selectedModel,
      contents: [
        ...(history || []).map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: systemInstruction || 'You are an advanced academic and scientific reasoning assistant.',
      },
    });

    res.json({ reply: response.text || '', modelUsed: selectedModel });
  } catch (err: any) {
    console.error('Advanced chat error:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// Configure Vite middleware or static serving
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
