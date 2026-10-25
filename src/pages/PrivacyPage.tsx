import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  ShieldCheck,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserX,
  HelpCircle,
} from 'lucide-react';

export function PrivacyPage() {
  const { currentUser, purgeUserData, chatHistory } = useStore();
  const [showConfirmPurge, setShowConfirmPurge] = useState(false);
  const [purging, setPurging] = useState(false);

  const handlePurge = async () => {
    setPurging(true);
    await purgeUserData();
    setPurging(false);
    setShowConfirmPurge(false);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chatHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medicare_health_data_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Patient Rights & Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Privacy Settings & Informed Consent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Review medical AI terms of use, verify active informed consent, download your data archive, or permanently delete all consultation history.
        </p>
      </div>

      {/* Informed Consent Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Informed Consent Status</h3>
              <p className="text-xs text-slate-500">Version 1.2 — Non-Diagnostic Medical AI Use</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active Consent Granted</span>
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            By using MediCare AI under active patient profile <strong>{currentUser?.name || 'Patient'}</strong>, you acknowledge and agree that:
          </p>
          <ul className="space-y-2 pl-4 list-disc text-slate-700">
            <li>
              <strong>Educational Guidance Only:</strong> MediCare AI does not establish a doctor-patient relationship, issue definitive clinical diagnoses, or prescribe regulated prescription pharmaceuticals.
            </li>
            <li>
              <strong>Age Calibration:</strong> You are responsible for ensuring that age information is accurately provided, especially for pediatric patients (under 12) or older adults (65+) where contraindications apply.
            </li>
            <li>
              <strong>Urgent Red Flags:</strong> You agree to immediately contact local emergency medical dispatch (911 / 112 / 108 / 999) if severe chest pain, shortness of breath, or emergency symptoms occur.
            </li>
            <li>
              <strong>No Third-Party Advertising:</strong> Your reported health symptoms are never sold or shared with commercial advertising brokers.
            </li>
          </ul>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Export Your Health Record</h3>
            <p className="text-xs text-slate-500">Download consultation transcripts and symptom diary logs in machine-readable JSON format.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Current archive: <strong>{chatHistory.length}</strong> consultation sessions recorded.
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Archive (JSON)</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Permanent Health Data Purge */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-rose-950">Permanent Health History Purge</h3>
            <p className="text-xs text-rose-800">
              Irreversibly delete all chat sessions, messages, symptom diary entries, and user feedback associated with your account.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-rose-700">
            Once initiated, this action cannot be undone. All clinical triage chats will be erased.
          </div>
          <button
            onClick={() => setShowConfirmPurge(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            Purge All Health Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Permanent Data Wipe</h3>
                <p className="text-xs text-slate-500">This will delete all saved consultations and diary logs.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-3 rounded-xl">
              Are you sure you want to purge all medical guidance sessions for <strong>{currentUser?.name}</strong>? Your account will remain active, but all health conversations will be permanently deleted.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmPurge(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={purging}
                onClick={handlePurge}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-xs"
              >
                {purging ? 'Purging records...' : 'Yes, Permanently Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
