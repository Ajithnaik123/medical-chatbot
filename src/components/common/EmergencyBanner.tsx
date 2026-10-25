import { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ChevronRight, ShieldAlert } from 'lucide-react';

export function EmergencyBanner() {
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-rose-600 text-white text-xs md:text-sm font-medium py-2 px-4 shadow-sm border-b border-rose-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-100" />
            <p className="truncate">
              <strong className="font-semibold">Medical Emergency Notice:</strong> If you are experiencing severe difficulty breathing, crushing chest pain, or sudden weakness, call emergency services immediately.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Numbers</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white p-1 rounded transition-colors"
              title="Dismiss warning banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Immediate Emergency Hotlines</h3>
                  <p className="text-xs text-slate-500">Free, 24/7 confidential clinical triage</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-700 tracking-wider uppercase">United States & Canada</div>
                  <div className="text-base font-bold text-slate-900">911 (Emergency) • 988 (Crisis Line)</div>
                  <div className="text-xs text-slate-600">Poison Help: 1-800-222-1222</div>
                </div>
                <span className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-600 tracking-wider uppercase">India</div>
                  <div className="text-base font-bold text-slate-900">112 (National Emergency) • 108 (Ambulance)</div>
                  <div className="text-xs text-slate-600">Health Helpline: 104</div>
                </div>
                <span className="px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-600 tracking-wider uppercase">United Kingdom</div>
                  <div className="text-base font-bold text-slate-900">999 (Life-threatening) • 111 (Urgent NHS)</div>
                </div>
                <span className="px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-600 tracking-wider uppercase">European Union & International</div>
                  <div className="text-base font-bold text-slate-900">112 (Universal EU Emergency)</div>
                </div>
                <span className="px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 mb-5 leading-relaxed">
              <strong>Clinical Protocol:</strong> MediCare AI is an informational tool and does not provide emergency medical services or replace certified ambulance dispatchers.
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors"
            >
              Close Emergency Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
