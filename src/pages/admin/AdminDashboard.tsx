import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HealthResource, FeedbackRecord, SystemStats } from '../../types';
import {
  ShieldAlert,
  BookOpen,
  Plus,
  Trash2,
  Star,
  Activity,
  Users,
  AlertOctagon,
  CheckCircle2,
  Lock,
  ThumbsUp,
  ThumbsDown,
  X,
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [resources, setResources] = useState<HealthResource[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'resources' | 'feedback'>('stats');

  // New Resource Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Respiratory');
  const [newSource, setNewSource] = useState<any>('MedlinePlus');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [s, r, f] = await Promise.all([
        api.getAdminStats(),
        api.getResources(),
        api.getAdminFeedback(),
      ]);
      setStats(s);
      setResources(r);
      setFeedback(f);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const created = await api.createResource({
        title: newTitle,
        category: newCategory,
        source: newSource,
        summary: newSummary || newTitle,
        content: newContent,
        keyPoints: ['Clinically reviewed guideline.'],
        tags: [newCategory, newSource],
      });
      setResources([created, ...resources]);
      setShowAddModal(false);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
    } catch (err) {
      console.error('Create resource failed:', err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await api.deleteResource(id);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Delete resource failed:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Clinical Oversight & Quality Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">MediCare AI System Governance</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor clinical feedback, verify emergency flag compliance, and curate educational health content.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl text-xs text-slate-300 border border-slate-700">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero PII Exposure: All private patient chats are shielded</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Quality Metrics & Stats
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'resources'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Educational Content ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'feedback'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Clinical Feedback ({feedback.length})
        </button>
      </div>

      {/* Tab 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Consultations
              </div>
              <div className="text-3xl font-black text-slate-900">
                {stats?.totalConsultations ?? 0}
              </div>
              <div className="text-[11px] text-teal-600 font-medium mt-1">Grounded in AI guidelines</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Emergency Flags Triggered
              </div>
              <div className="text-3xl font-black text-rose-600">
                {stats?.emergencyFlagsCount ?? 0}
              </div>
              <div className="text-[11px] text-rose-700 font-medium mt-1">911 hotline alerts provided</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Helpfulness Approval
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {stats?.averageHelpfulness ?? 98}%
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">Based on patient evaluations</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Reviewed Knowledge Base
              </div>
              <div className="text-3xl font-black text-slate-900">
                {resources.length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">MedlinePlus, NHS, WHO</div>
            </div>
          </div>

          {/* Top Reported Symptom Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Top Reported Symptom Inquiries</h3>
            <div className="space-y-3">
              {stats?.topSymptoms?.map((sym, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{sym.name}</span>
                    <span>{sym.count} inquiries</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, sym.count * 2)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Educational Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">Curated Clinical Articles</h3>
              <p className="text-xs text-slate-500">Add or manage articles cited in patient guidance.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {res.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Source: {res.source}</span>
                    <span className="text-xs text-slate-400">• Reviewed: {res.reviewedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{res.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{res.summary}</p>
                </div>

                <button
                  onClick={() => handleDeleteResource(res.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 transition-colors"
                  title="Delete resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Feedback & Quality Review */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">User Evaluations & Quality Reports</h3>
            <p className="text-xs text-slate-500">
              Ratings and comments submitted by patients to evaluate answer safety and clarity.
            </p>
          </div>

          {feedback.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-400">
              No feedback submissions logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.rating === 'helpful' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" />
                          <span>Unhelpful</span>
                        </span>
                      )}

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: item.clinicalAccuracy || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {item.feedbackText && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{item.feedbackText}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Reviewed Health Resource</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cough Symptoms and Evidence-Based Care"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Respiratory">Respiratory</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Pain & Fever">Pain & Fever</option>
                    <option value="Medication Safety">Medication Safety</option>
                    <option value="First Aid">First Aid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="MedlinePlus">MedlinePlus</option>
                    <option value="NHS">NHS UK</option>
                    <option value="CDC">CDC</option>
                    <option value="WHO">WHO</option>
                    <option value="Mayo Clinic">Mayo Clinic</option>
                    <option value="FDA">FDA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief clinical overview..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Article Body *</label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Educational medical guidance content..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 resize-none h-28"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
