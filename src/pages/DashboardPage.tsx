import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  Activity,
  MessageSquare,
  History,
  CalendarHeart,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  User,
  Heart,
  ChevronRight,
  Plus,
} from 'lucide-react';

export function DashboardPage() {
  const {
    currentUser,
    setPage,
    chatHistory,
    loadChatHistory,
    diaryEntries,
    loadDiary,
    startNewChat,
    loadSession,
  } = useStore();

  const [quickPrompt, setQuickPrompt] = useState('');

  useEffect(() => {
    loadChatHistory();
    loadDiary();
  }, []);

  const handleStartConsultation = () => {
    const text = quickPrompt.trim();
    if (text) {
      startNewChat(text);
    } else {
      setPage('chat');
    }
  };

  const activeDiaryItems = diaryEntries.filter((d) => d.status !== 'resolved');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Welcome Card */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.15),transparent)] pointer-events-none"></div>

        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Triage Profile: {currentUser?.ageGroup?.toUpperCase()}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {currentUser?.name || 'Patient'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Your safety calibration is tuned for <strong>{currentUser?.age || 22} years old</strong>.
            {currentUser?.allergies && currentUser.allergies.length > 0 && (
              <span> Recorded allergies: {currentUser.allergies.join(', ')}.</span>
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setPage('chat')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Describe New Symptoms</span>
            </button>
            <button
              onClick={() => setPage('diary')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <CalendarHeart className="w-4 h-4 text-teal-300" />
              <span>Symptom Diary</span>
            </button>
          </div>
        </div>

        <div className="z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full md:w-auto shrink-0 space-y-2 text-xs">
          <div className="text-slate-300 font-medium">Quick Health Metrics:</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Past Consultations:</span>
            <span className="font-bold text-white text-sm">{chatHistory.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Tracked Symptoms:</span>
            <span className="font-bold text-white text-sm">{activeDiaryItems.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Consent v1.2:</span>
            <span className="font-bold text-emerald-400 text-xs">Active</span>
          </div>
        </div>
      </div>

      {/* Fast Symptom Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          What symptoms are you experiencing today?
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartConsultation()}
            placeholder="e.g. 'I have a cough for three days' or 'Throat scratchiness'..."
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            onClick={handleStartConsultation}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Consult MediCare AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Recent Consultations & Active Symptom Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <span>Recent Consultations</span>
              </h3>
              <button
                onClick={() => setPage('history')}
                className="text-xs text-teal-700 hover:underline font-semibold"
              >
                View all ({chatHistory.length})
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No previous sessions yet. Type a symptom above to get started.
                </div>
              ) : (
                chatHistory.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-[80%]">
                      <div className="font-semibold text-xs text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                        {session.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.messageCount} messages
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setPage('chat')}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>Start Fresh Consultation</span>
          </button>
        </div>

        {/* Active Symptom Diary snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CalendarHeart className="w-4 h-4 text-rose-500" />
                <span>Symptom Tracker Snapshot</span>
              </h3>
              <button
                onClick={() => setPage('diary')}
                className="text-xs text-teal-700 hover:underline font-semibold"
              >
                Open Diary
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {activeDiaryItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No active symptoms currently tracked in your diary.
                </div>
              ) : (
                activeDiaryItems.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{d.symptom}</div>
                      <div className="text-[11px] text-slate-400">
                        Duration: {d.duration} • Status: <span className="capitalize">{d.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Sev: {d.severity}/10
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setPage('diary')}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-500" />
            <span>Log Symptom in Diary</span>
          </button>
        </div>
      </div>
    </div>
  );
}
