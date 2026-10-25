import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { HealthResource } from '../types';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Tag,
  X,
  Building2,
  Calendar,
} from 'lucide-react';

export function ResourcesPage() {
  const {
    resources,
    loadResources,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [activeResource, setActiveResource] = useState<HealthResource | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'Respiratory', label: 'Respiratory & Cough' },
    { id: 'Pediatrics', label: 'Pediatric Safety' },
    { id: 'Pain & Fever', label: 'Pain & Fever' },
    { id: 'Medication Safety', label: 'Medication Safety' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Clinical Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Reviewed Health Resources & Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Educational medical articles reviewed against evidence-based sources including MedlinePlus, NHS, WHO, and the CDC.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviewed topics (e.g. cough, fever, honey)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resources.map((res) => (
          <div
            key={res.id}
            onClick={() => setActiveResource(res)}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {res.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{res.source}</span>
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                {res.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {res.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {res.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
              <span>Read Clinical Guide</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Reader Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {activeResource.category}
                  </span>
                  <span className="text-xs text-slate-500">Source: {activeResource.source}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activeResource.title}</h2>
                <div className="text-[11px] text-slate-400">
                  Last Clinical Review: {activeResource.reviewedAt}
                </div>
              </div>

              <button
                onClick={() => setActiveResource(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                {activeResource.summary}
              </div>

              <div className="whitespace-pre-line text-slate-800">
                {activeResource.content}
              </div>

              {activeResource.keyPoints && activeResource.keyPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                  <div className="font-bold text-xs text-teal-900 uppercase tracking-wider">
                    Key Clinical Takeaways:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeResource.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Peer-reviewed clinical educational content</span>
              </div>
              <button
                onClick={() => setActiveResource(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
