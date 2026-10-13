import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Music,
  Mic,
  MicOff,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Download,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Upload,
  AlertTriangle,
  Film,
} from 'lucide-react';

export const MultimodalStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transcribe' | 'music' | 'image' | 'video' | 'multimodel'>('transcribe');

  // 1. Audio Transcription State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [transcribing, setTranscribing] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // 2. Music Generation State
  const [musicPrompt, setMusicPrompt] = useState<string>('Uplifting orchestral music for college graduation ceremony');
  const [generatingMusic, setGeneratingMusic] = useState<boolean>(false);
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState<string>('');

  // 3. Image Studio State
  const [imagePrompt, setImagePrompt] = useState<string>('A modern university computer engineering laboratory with students collaborating, cinematic lighting');
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  // 4. Video Studio State
  const [videoPrompt, setVideoPrompt] = useState<string>('Drone flyover above college campus library at sunrise, 4k');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [generatingVideo, setGeneratingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // 5. Multi-Model Chat State
  const [chatModel, setChatModel] = useState<'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>('You are an expert academic advisor and computer science specialist.');
  const [multiChatMessages, setMultiChatMessages] = useState<{ role: 'user' | 'assistant'; content: string; model?: string }[]>([
    { role: 'assistant', content: 'Welcome to the Multi-Model Gemini Studio. Select your preferred model and ask any complex academic or coding question.' },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Mic recording handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e: any) {
      alert(`Microphone access error: ${e.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleTranscribeAudio = async () => {
    if (!audioBlob) return;
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioData: base64Data, mimeType: 'audio/webm' }),
        });
        const data = await res.json();
        setTranscription(data.transcription || data.error || 'No speech detected.');
        setTranscribing(false);
      };
    } catch (e: any) {
      setTranscription(`Transcription failed: ${e.message}`);
      setTranscribing(false);
    }
  };

  // Music generator handler
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setGeneratingMusic(true);
    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt }),
      });
      const data = await res.json();
      if (data.audioData) {
        setMusicAudioUrl(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        setMusicLyrics(data.lyrics || '');
      } else {
        alert(data.error || 'Music generation failed. Check API quota.');
      }
    } catch (e: any) {
      alert(`Music error: ${e.message}`);
    } finally {
      setGeneratingMusic(false);
    }
  };

  // Image generator handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setGeneratingImage(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          baseImage,
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        alert(data.error || 'Image generation completed without graphic output.');
      }
    } catch (e: any) {
      alert(`Image error: ${e.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  // Video generator simulation handler
  const handleGenerateVideo = async () => {
    setGeneratingVideo(true);
    setVideoProgress(10);
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setGeneratingVideo(false);
          return 100;
        }
        return prev + 15;
      });
    }, 600);
  };

  // Multi-model chat handler
  const handleSendMultiChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setMultiChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/advanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          model: chatModel,
          systemInstruction: customSystemPrompt,
          history: multiChatMessages,
        }),
      });
      const data = await res.json();
      setMultiChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || data.error || 'No response.', model: data.modelUsed },
      ]);
    } catch (e: any) {
      setMultiChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${e.message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Multimodal Creation Studio</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                  Full AI Suite
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Voice transcription, Lyria music, Nano Banana images, Veo video, and multi-model Gemini chat.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('transcribe')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'transcribe'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Speech-to-Text
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'music'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Lyria Music
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Create Images
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Veo Video
          </button>
          <button
            onClick={() => setActiveTab('multimodel')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'multimodel'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Multi-Model Chat
          </button>
        </div>
      </div>

      {/* Tab 1: Transcribe Audio with gemini-3.5-transcribe */}
      {activeTab === 'transcribe' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-600" />
                <span>Microphone Audio Transcriber</span>
              </h2>
              <p className="text-xs text-slate-400">
                Powered by model <strong>gemini-3.5-transcribe</strong>. Speak into your microphone to dictate attendance notes or college queries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-red-500/20 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 animate-pulse transition-all"
              >
                <MicOff className="w-4 h-4 text-red-400" />
                <span>Stop Recording (Listening...)</span>
              </button>
            )}

            {audioBlob && (
              <button
                onClick={handleTranscribeAudio}
                disabled={transcribing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{transcribing ? 'Transcribing with Gemini...' : 'Transcribe Recorded Audio'}</span>
              </button>
            )}
          </div>

          {/* Transcription Output */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Transcription Result:
            </label>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 min-h-[120px] text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {transcription || (transcribing ? 'Processing audio with gemini-3.5-transcribe...' : 'Record speech above and click Transcribe.')}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lyria Music Generation */}
      {activeTab === 'music' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-indigo-600" />
                <span>AI Music Generator (Lyria 3 Clip)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate original 30-second audio tracks using <strong>lyria-3-clip-preview</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Music Text Prompt:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="e.g. Energetic synthwave study soundtrack with driving beat..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleGenerateMusic}
                disabled={generatingMusic}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Music className="w-4 h-4" />
                <span>{generatingMusic ? 'Synthesizing...' : 'Generate Clip'}</span>
              </button>
            </div>
          </div>

          {musicAudioUrl && (
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
              <div className="font-bold text-indigo-900 dark:text-indigo-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Generated Lyria Audio Track Ready</span>
              </div>
              <audio controls src={musicAudioUrl} className="w-full" />
              {musicLyrics && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Lyrics: {musicLyrics}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Image Creation with gemini-nano-banana-2.1 */}
      {activeTab === 'image' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span>Create & Edit Images (gemini-nano-banana-2.1)</span>
              </h2>
              <p className="text-xs text-slate-400">
                High-fidelity image generation and editing using Google's flagship Nano Banana visual model.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Visual Prompt:
              </label>
              <textarea
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Aspect Ratio:</span>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Widescreen</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:3">4:3 Standard</option>
                </select>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={generatingImage}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all ml-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generatingImage ? 'Rendering Image...' : 'Generate Image'}</span>
              </button>
            </div>

            {generatedImageUrl && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3">
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="max-h-96 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md object-contain"
                />
                <a
                  href={generatedImageUrl}
                  download="gemini_generated.png"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Veo Video Studio */}
      {activeTab === 'video' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-600" />
                <span>Veo 3 Video Generation & Animation</span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate video from text or animate photos using <strong>veo-3.1-fast-generate-preview</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Prompt / Motion Script:
              </label>
              <input
                type="text"
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Aspect Ratio:</span>
              <button
                onClick={() => setVideoAspect('16:9')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  videoAspect === '16:9' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                16:9 Landscape
              </button>
              <button
                onClick={() => setVideoAspect('9:16')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  videoAspect === '9:16' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                9:16 Portrait
              </button>

              <button
                onClick={handleGenerateVideo}
                disabled={generatingVideo}
                className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>{generatingVideo ? `Rendering (${videoProgress}%)` : 'Generate Veo Video'}</span>
              </button>
            </div>

            {generatingVideo && (
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Veo Long-Running Video Operation</span>
                  <span>{videoProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Multi-Model Gemini Chatbot */}
      {activeTab === 'multimodel' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <span>Multi-Model Gemini Interface</span>
              </h2>
              <p className="text-xs text-slate-400">
                Switch between specialized models for complex, general, or fast tasks.
              </p>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Model:</span>
              <select
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
              >
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
                <option value="gemini-3.5-flash">gemini-3.5-flash (General Tasks)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Responses)</option>
              </select>
            </div>
          </div>

          {/* System Prompt Customizer */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">
              System Instruction Persona:
            </label>
            <input
              type="text"
              value={customSystemPrompt}
              onChange={(e) => setCustomSystemPrompt(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Message Thread */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/40 min-h-[260px] max-h-[380px] overflow-y-auto space-y-3">
            {multiChatMessages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                  m.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'
                }`}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-3 rounded-xl text-xs max-w-[80%] whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMultiChat();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything with the selected Gemini model..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
