import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { StructuredResponseCard } from '../components/chat/StructuredResponseCard';
import { VoiceInputButton } from '../components/chat/VoiceInputButton';
import {
  Send,
  Plus,
  History,
  ShieldCheck,
  AlertOctagon,
  Languages,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export function ChatPage() {
  const {
    currentUser,
    activeSession,
    activeSessionId,
    activeMessages,
    isLoadingChat,
    sendChatMessage,
    startNewChat,
    chatHistory,
    loadChatHistory,
    loadSession,
    language,
    setLanguage,
    ttsEnabled,
    setTtsEnabled,
    draftSymptom,
    setDraftSymptom,
  } = useStore();

  const [inputMessage, setInputMessage] = useState(draftSymptom || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (draftSymptom) {
      setInputMessage(draftSymptom);
      setDraftSymptom('');
    }
  }, [draftSymptom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isLoadingChat]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isLoadingChat) return;

    setInputMessage('');
    await sendChatMessage(text);
  };

  const handleSelectFollowUp = (question: string) => {
    sendChatMessage(question);
  };

  const samplePrompts = [
    'I have a cough for three days.',
    'Dry cough with slight fever in the evening.',
    'Headache and sensitivity to bright lights.',
    'Sore throat when swallowing, no cough.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Patient Triage Banner */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 mb-4 shadow-2xs flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Patient: {currentUser?.name || 'Guest'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                Age: {currentUser?.age || 22} ({currentUser?.ageGroup || 'adult'})
              </span>
              {currentUser?.allergies && currentUser.allergies.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  Allergies: {currentUser.allergies.join(', ')}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Guidance dynamically adjusted for age-specific contraindications and safety thresholds.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startNewChat()}
            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Grid: History Drawer & Chat Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Left Sidebar: Recent Sessions */}
        <aside className="hidden lg:flex flex-col bg-white rounded-2xl border border-slate-200 p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-teal-600" />
              <span>Past Consultations</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {chatHistory.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No past consultations yet. Start by describing a symptom.
              </div>
            ) : (
              chatHistory.map((session) => {
                const isActive = activeSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isActive
                        ? 'border-teal-500 bg-teal-50/70 text-teal-900 font-semibold shadow-2xs'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold truncate mb-1">{session.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      <span className="uppercase font-mono">{session.language}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Encrypted in transit & confidential</span>
          </div>
        </aside>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeMessages.length === 0 ? (
              <div className="max-w-xl mx-auto py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Welcome to MediCare AI Assistant
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Describe any symptom (e.g. cough, fever, headache, allergies) to receive structured clinical guidance, home-care measures, and safe medicine facts.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left">
                  <strong>Important Notice:</strong> MediCare AI does NOT diagnose conditions or automatically prescribe medications. We help you understand possible causes and know when to consult a clinician.
                </div>

                <div className="pt-2 text-left">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Try one of these clinical prompts:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMessage(prompt);
                          sendChatMessage(prompt);
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 text-xs text-left font-medium transition-all flex items-center justify-between"
                      >
                        <span>"{prompt}"</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    {isUser ? (
                      <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
                        <div className="bg-teal-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div className="text-[10px] text-teal-100 text-right mt-1 opacity-80">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        {msg.structuredData ? (
                          <StructuredResponseCard
                            guidance={msg.structuredData}
                            sessionId={msg.sessionId}
                            messageId={msg.id}
                            createdAt={msg.createdAt}
                            onSelectFollowUp={handleSelectFollowUp}
                          />
                        ) : (
                          <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-4 text-slate-800 text-sm max-w-[90%] leading-relaxed">
                            {msg.content}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* AI Synthesizing Skeleton */}
            {isLoadingChat && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-teal-400/40"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-200 rounded"></div>
                  <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
                </div>
                <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing reviewed medical literature and checking age safety rules...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <div className="border-t border-slate-200 bg-slate-50/60 p-3 sm:p-4 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <VoiceInputButton
                onTranscript={(transcript) => {
                  setInputMessage(transcript);
                }}
              />

              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Describe symptom (e.g. "I have a cough for three days")...`}
                  disabled={isLoadingChat}
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoadingChat}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold p-3 rounded-xl shadow-xs transition-colors flex items-center justify-center shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">
                Consultation in <strong>{language.toUpperCase()}</strong> • Educational triage only
              </span>
              <button
                type="button"
                onClick={() => setInputMessage('I have a cough for three days.')}
                className="underline hover:text-slate-600 shrink-0 ml-2"
              >
                Try sample cough prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
