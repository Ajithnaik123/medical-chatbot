import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  History,
  MessageSquare,
  Trash2,
  Download,
  ExternalLink,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export function HistoryPage() {
  const { chatHistory, loadChatHistory, deleteSession, loadSession, setPage, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadChatHistory();
  }, []);

  const filtered = chatHistory.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.symptomSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chatHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medicare_consultations_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Consultation Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Past Medical Health Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Revisit prior symptoms, guidance recommendations, and home-care instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && (
            <button
              onClick={handleExportAll}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All (JSON)</span>
            </button>
          )}
          <button
            onClick={() => setPage('chat')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            New Symptom Check
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search past symptoms (e.g. cough, fever)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>

      {/* History Session Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No Consultations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm ? 'No previous sessions match your search query.' : 'You have not logged any health consultations yet.'}
            </p>
          </div>
          <button
            onClick={() => setPage('chat')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Start a Symptom Consultation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    Language: {session.language}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{session.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {session.symptomSummary || 'Medical consultation regarding reported symptom.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => loadSession(session.id)}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Resume / View</span>
                  <ChevronRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => deleteSession(session.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete this conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Note */}
      <div className="p-4 rounded-xl bg-slate-100/70 text-slate-600 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
        <span>
          Looking to erase all records? Visit the{' '}
          <button onClick={() => setPage('privacy')} className="text-teal-700 underline font-semibold">
            Privacy & Purge Settings
          </button>{' '}
          to permanently wipe all consultation transcripts and diary logs.
        </span>
      </div>
    </div>
  );
}
