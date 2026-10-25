import { useState } from 'react';
import { MedicalGuidance } from '../../types';
import { useStore } from '../../store/useStore';
import { FeedbackModal } from './FeedbackModal';
import {
  ShieldAlert,
  AlertOctagon,
  Sparkles,
  HeartHandshake,
  Pill,
  HelpCircle,
  ExternalLink,
  Volume2,
  VolumeX,
  ThumbsUp,
  AlertTriangle,
  Info,
  CheckCircle,
  Send,
  Baby,
} from 'lucide-react';

interface StructuredResponseCardProps {
  guidance: MedicalGuidance;
  sessionId: string;
  messageId: string;
  createdAt: string;
  onSelectFollowUp?: (question: string) => void;
}

export function StructuredResponseCard({
  guidance,
  sessionId,
  messageId,
  createdAt,
  onSelectFollowUp,
}: StructuredResponseCardProps) {
  const { speakText, stopSpeaking, isSpeaking } = useStore();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'causes' | 'selfcare' | 'meds' | 'warnings'>('overview');

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const summaryText = `${guidance.summary}. Possible causes include: ${guidance.possible_causes.map((c) => c.cause).join(', ')}. Key self care: ${guidance.self_care.map((s) => s.title).join(', ')}. Please remember, this is general health information, not a medical diagnosis.`;
      speakText(summaryText);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-100 overflow-hidden my-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top Header */}
      <div className="bg-slate-50/90 border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            +
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900">MediCare AI Clinical Guidance</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Non-Diagnostic
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Grounded in reviewed medical literature
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleSpeechToggle}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Read summary aloud using text-to-speech"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          {/* Rate Feedback Button */}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Rate this response for clinical quality"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if Red Flag Detected */}
      {guidance.isEmergency && (
        <div className="bg-rose-50 border-b border-rose-200 p-4 text-rose-950 flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-rose-800 uppercase tracking-wide">
              Potential Critical Emergency Warning
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {guidance.emergencyReason || 'Your described symptoms may indicate an urgent medical situation. Do not rely on chat. Call 911 (US), 112/108 (India), 999 (UK), or proceed to the nearest emergency department immediately.'}
            </p>
          </div>
        </div>
      )}

      {/* Age Specific Safety Ribbon */}
      {guidance.ageSpecificNote && (
        <div className="bg-sky-50 border-b border-sky-100 px-4 py-2 text-xs text-sky-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{guidance.ageSpecificNote}</span>
        </div>
      )}

      {/* Summary Box */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Overview</span>
        </h4>
        <p className="text-slate-800 text-sm leading-relaxed font-normal">
          {guidance.summary}
        </p>

        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Safety Rule:</strong> MediCare AI provides structured medical facts to help you converse with your doctor. It does not issue a final diagnosis or individual prescription.
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-700 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>At a Glance</span>
        </button>
        <button
          onClick={() => setActiveTab('causes')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'causes'
              ? 'border-teal-600 text-teal-700 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Possible Causes ({guidance.possible_causes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('selfcare')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'selfcare'
              ? 'border-teal-600 text-teal-700 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
          <span>Home & Natural Care ({guidance.self_care.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'meds'
              ? 'border-teal-600 text-teal-700 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-blue-600" />
          <span>Medicine Information</span>
        </button>
        <button
          onClick={() => setActiveTab('warnings')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'warnings'
              ? 'border-rose-600 text-rose-700 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Warning Signs ({guidance.warning_signs.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-5">
        {/* Tab 1: Overview Summary Grid */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Quick highlight cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Causes snapshot */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Potential Non-Diagnostic Causes</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {guidance.possible_causes.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        <strong className="font-semibold text-slate-900">{c.cause}:</strong>{' '}
                        {c.explanation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Home care snapshot */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Safe Home-Care</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {guidance.self_care.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-slate-900">{s.title}:</strong> {s.instruction}
                        {s.caution && (
                          <div className="text-[11px] font-semibold text-rose-700 mt-0.5">
                            ⚠️ {s.caution}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Medicine Safety Notice */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start gap-3">
              <Pill className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 space-y-1">
                <div className="font-bold text-blue-900">General Medicine Safety Rules</div>
                <p className="leading-relaxed">
                  Over-the-counter options target specific symptoms (e.g. cough suppressants vs expectorants), but suitability depends on age, kidney/liver function, and drug allergies. Check the 'Medicine Information' tab for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Possible Causes */}
        {activeTab === 'causes' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">
              The following are plausible clinical explanations for your symptoms. Only a licensed doctor can provide a definitive medical diagnosis.
            </div>
            <div className="grid grid-cols-1 gap-3">
              {guidance.possible_causes.map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors">
                  <div className="font-bold text-sm text-slate-900 mb-1">{c.cause}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{c.explanation}</p>
                  <div className="text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                    <strong>Typical Presentation:</strong> {c.typicalContext}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Self-Care & Natural Remedies */}
        {activeTab === 'selfcare' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">
              Safe, non-pharmacological measures to soothe symptoms and support recovery:
            </div>
            <div className="space-y-3">
              {guidance.self_care.map((s, i) => (
                <div key={i} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <h5 className="font-bold text-sm text-slate-900">{s.title}</h5>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{s.instruction}</p>
                  {s.caution && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{s.caution}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Medicine Information */}
        {activeTab === 'meds' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Mandatory Safety Disclaimer:</strong> {guidance.medicine_information.disclaimer}
            </div>

            <div className="space-y-3">
              {guidance.medicine_information.categories.map((cat, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <h5 className="font-bold text-sm text-slate-900">{cat.categoryName}</h5>
                    <div className="flex items-center gap-1">
                      {cat.commonIngredients.map((ing, j) => (
                        <span key={j} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    <strong>Clinical Purpose:</strong> {cat.purpose}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div className="text-amber-800 bg-amber-50/60 p-2 rounded-lg">
                      <strong>Precautions:</strong> {cat.precautions}
                    </div>
                    <div className="text-blue-800 bg-blue-50/60 p-2 rounded-lg">
                      <strong>Age Guidance:</strong> {cat.ageRestrictions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Warning Signs & Red Flags */}
        {activeTab === 'warnings' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">
              If any of these red flag signs appear, do not hesitate to seek prompt medical attention:
            </div>
            <div className="space-y-2.5">
              {guidance.warning_signs.map((w, i) => {
                const isEmergency = w.urgency === 'immediate_emergency';
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isEmergency ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-amber-50/70 border-amber-300 text-amber-950'
                    }`}
                  >
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isEmergency ? 'text-rose-600' : 'text-amber-600'}`} />
                    <div className="space-y-1">
                      <div className="font-bold text-xs">
                        {w.sign}{' '}
                        <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${isEmergency ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}`}>
                          {w.urgency.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs opacity-90">
                        <strong>Required Action:</strong> {w.action}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clarifying Follow-Up Questions (Interactive Quick Chips) */}
        {guidance.follow_up_questions && guidance.follow_up_questions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Questions That Help Clarify Your Condition (Click to Ask):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {guidance.follow_up_questions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectFollowUp?.(q)}
                  className="text-left text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-all flex items-center gap-1.5 group"
                >
                  <span>{q}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Verified Medical Sources */}
        {guidance.sources && guidance.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Reviewed References:</span>
            {guidance.sources.map((src, i) => (
              <a
                key={i}
                href={src.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <span>{src.organization}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        sessionId={sessionId}
        messageId={messageId}
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
