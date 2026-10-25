import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  CalendarHeart,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function SymptomDiaryPage() {
  const { diaryEntries, loadDiary, addDiaryEntry, deleteDiaryEntry, currentUser } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(4);
  const [duration, setDuration] = useState('3 days');
  const [status, setStatus] = useState<'improving' | 'stable' | 'worse' | 'resolved'>('improving');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadDiary();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    await addDiaryEntry({
      symptom: symptom.trim(),
      severity,
      duration,
      status,
      notes,
    });

    setSymptom('');
    setNotes('');
    setShowAddModal(false);
  };

  const activeEntries = diaryEntries.filter((d) => d.status !== 'resolved');
  const avgSeverity =
    activeEntries.length > 0
      ? (activeEntries.reduce((sum, d) => sum + d.severity, 0) / activeEntries.length).toFixed(1)
      : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarHeart className="w-4 h-4" />
            <span>Personal Health Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Symptom Diary & Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor how symptoms evolve over days to provide accurate timelines when seeing your doctor.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Symptom</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Active Logged Symptoms
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeEntries.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Currently tracked health concerns</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Average Severity (1-10)
          </div>
          <div className="text-2xl font-extrabold text-teal-700">{avgSeverity} / 10</div>
          <div className="text-[11px] text-slate-500 mt-1">Mild to moderate range</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Patient Profile
          </div>
          <div className="text-sm font-bold text-slate-900">
            {currentUser?.name || 'Guest'} ({currentUser?.age}y)
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {currentUser?.existingConditions.length ? currentUser.existingConditions.join(', ') : 'No chronic conditions reported'}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Timeline of Reported Symptoms
        </h3>

        {diaryEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <CalendarHeart className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Symptom Diary Entries Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Track how your cough, fever, or pain changes day by day. Click below to add your first log.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
            >
              Log First Symptom
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {diaryEntries.map((entry) => {
              const isImproving = entry.status === 'improving';
              const isWorse = entry.status === 'worse';
              const isResolved = entry.status === 'resolved';

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{entry.symptom}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isImproving
                            ? 'bg-emerald-100 text-emerald-800'
                            : isWorse
                            ? 'bg-rose-100 text-rose-800'
                            : isResolved
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                      <span className="text-xs text-slate-400">• Duration: {entry.duration}</span>
                      <span className="text-xs text-slate-400">• Logged: {entry.date}</span>
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {entry.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Severity</div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-lg text-slate-900">{entry.severity}</span>
                        <span className="text-xs text-slate-400">/ 10</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteDiaryEntry(entry.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Log Symptom Progression
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Symptom Name
                </label>
                <input
                  type="text"
                  required
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g. Dry cough, Throat soreness, Fever..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Severity (1 to 10)</label>
                  <span className="font-bold text-sm text-teal-700">{severity}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 days"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="improving">Improving</option>
                    <option value="stable">Stable</option>
                    <option value="worse">Worsening</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observations, Triggers, & Relief Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Worse in cold air, soothed by warm tea..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 resize-none h-20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
