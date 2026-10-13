import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Trash2,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Languages,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage } from '../types/index.ts';
import { StudentRecord } from '../data/collegeData.ts';

interface AIChatAssistantViewProps {
  currentStudent: StudentRecord;
}

export const AIChatAssistantView: React.FC<AIChatAssistantViewProps> = ({
  currentStudent,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I am the **Attendance Information Assistant** for **SNJB KBJ COE Chandwad**, created by **Dnyandip**.\n\nI can calculate your attendance shortage, tell you how many consecutive lectures you need to reach 75%, identify critical subjects, explain medical condonation policies under SPPU Ordinance 157, and answer in **English** or **मराठी (Marathi)**.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'deterministic-assistant',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const starterQuestions = [
    { en: 'Calculate my overall attendance', mr: 'माझी एकूण उपस्थिती टक्केवारी मोजा' },
    { en: 'How many classes must I attend to reach 75%?', mr: '७५% गाठण्यासाठी मला किती तास बसावे लागेल?' },
    { en: 'Which subjects need immediate attention?', mr: 'कोणत्या विषयांत उपस्थितीची गंभीर तूट आहे?' },
    { en: 'Explain medical condonation rules under SPPU 157', mr: 'वैद्यकीय सवलतीचे (Medical Condonation) नियम सांगा' },
    { en: 'How many classes can I safely miss?', mr: 'मी किती तास सुरक्षितपणे गैरहजर राहू शकतो?' },
    { en: 'Explain this in Marathi (मराठीत सांगा)', mr: 'माझी उपस्थिती मराठीत समजावून सांगा' },
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          currentStudent,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Calculation completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: data.toolUsed,
        toolResult: data.toolResult,
        source: data.source || 'gemini-ai',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Unable to reach the assistant server. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: language === 'mr'
          ? `नमस्कार! संभाषण रिसेट झाले आहे. तुम्ही मला उपस्थिती, ७५% नियम किंवा विषयांच्या तुटीबद्दल विचारू शकता.`
          : `Chat reset. Feel free to ask any attendance or policy question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Attendance Assistant</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Gemini 3.8 Flash
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active Student: <strong>{currentStudent.name}</strong> (Roll {currentStudent.rollNo} · {currentStudent.overallPercentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Language & Clear */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                language === 'mr'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>

          <button
            onClick={handleClear}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Starter Questions */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {starterQuestions.map((q, idx) => {
            const prompt = language === 'mr' ? q.mr : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all text-left shadow-xs"
              >
                {prompt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-cyan-600 to-blue-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-750'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Metadata & Actions */}
                <div
                  className={`flex items-center gap-2 text-[11px] text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>·</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      {msg.toolUsed && (
                        <>
                          <span>·</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 font-mono">
                            tool: {msg.toolUsed}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-400">Computing attendance & institutional rules...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 font-semibold underline hover:no-underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === 'mr'
              ? 'तुमचा उपस्थिती प्रश्न विचारा... (उदा. मला ७५% साठी किती तास लागतील?)'
              : 'Ask attendance question... (e.g. How many classes to reach 75%?)'
          }
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
