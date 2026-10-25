import { useStore } from '../../store/useStore';
import { ShieldAlert, BookOpen, HeartPulse, ExternalLink, Lock } from 'lucide-react';

export function Footer() {
  const { setPage } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      {/* Prominent Clinical Disclaimer Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 text-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Important Medical Disclaimer & Safety Governance</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              MediCare AI is an educational clinical guidance prototype designed to explain possible causes, suggest safe home-care, highlight warning signs, and provide general medicine information. <strong>It does NOT prescribe medication, make automated diagnoses, or substitute for a qualified physician or emergency services.</strong> If you believe you have a life-threatening emergency, call 911 (US/Canada), 112/108 (India), or 999 (UK) immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-black text-sm">
                +
              </div>
              <span className="text-white font-extrabold text-base">MediCare AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Responsible, age-adapted health intelligence grounded in reviewed clinical literature from NHS, MedlinePlus, and CDC.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Informed Consent v1.2 Compliant</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setPage('home')} className="hover:text-teal-400 transition-colors">
                  Overview & Triage Flow
                </button>
              </li>
              <li>
                <button onClick={() => setPage('chat')} className="hover:text-teal-400 transition-colors">
                  Symptom Chatbot
                </button>
              </li>
              <li>
                <button onClick={() => setPage('history')} className="hover:text-teal-400 transition-colors">
                  Consultation History
                </button>
              </li>
              <li>
                <button onClick={() => setPage('diary')} className="hover:text-teal-400 transition-colors">
                  Symptom Diary & Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setPage('resources')} className="hover:text-teal-400 transition-colors">
                  Reviewed Medical Library
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Sources */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Accredited Sources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://medlineplus.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <span>MedlinePlus (US NLM)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhs.uk/conditions/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <span>National Health Service (NHS UK)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cdc.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <span>CDC Clinical Guidance</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <span>World Health Organization (WHO)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Patient Rights */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Privacy & Safety</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Your health history is strictly confidential. You retain full control to download your record or purge data at any time.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setPage('privacy')}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                <span>Privacy & Purge Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MediCare AI. Full-Stack Medical Information System.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPage('privacy')} className="hover:text-slate-300">
              Informed Consent
            </button>
            <span>•</span>
            <button onClick={() => setPage('resources')} className="hover:text-slate-300">
              Medical Knowledge Base
            </button>
            <span>•</span>
            <button onClick={() => setPage('admin')} className="hover:text-slate-300">
              Clinical Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
