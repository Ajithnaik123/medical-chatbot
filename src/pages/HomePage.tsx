import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Heart,
  Pill,
  Sparkles,
  BookOpen,
  CalendarHeart,
  Activity,
  Mic,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function HomePage() {
  const { setPage, startNewChat, currentUser, switchDemoUser } = useStore();
  const [symptomInput, setSymptomInput] = useState('');

  const quickSymptoms = [
    'I have a cough for three days.',
    'Throat irritation and mild fever.',
    'Tension headache with screen fatigue.',
    'Stuffy nose and seasonal sneezing.',
  ];

  const handleStartConsultation = (promptText?: string) => {
    const text = promptText || symptomInput.trim();
    if (text) {
      startNewChat(text);
    } else {
      setPage('chat');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Clinical Information & Triage Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Health Guidance <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
              Without Auto-Prescription
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Describe your symptoms to receive structured medical guidance: explore non-diagnostic causes, evidence-based home care, age-adapted warnings, and safe medicine facts grounded in MedlinePlus and NHS sources.
          </p>

          {/* Interactive Symptom Input Box */}
          <div className="max-w-3xl mx-auto mt-8 bg-white/10 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-2xl shadow-teal-950/50">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartConsultation()}
                  placeholder="e.g. 'I have a cough for three days' or 'Throat irritation'..."
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base px-4 py-3.5 rounded-xl border-none focus:outline-hidden focus:ring-2 focus:ring-teal-400 shadow-inner"
                />
              </div>
              <button
                type="button"
                onClick={() => handleStartConsultation()}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Check Symptoms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium">Quick examples:</span>
              {quickSymptoms.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStartConsultation(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Active Profile Indicator */}
          {currentUser && (
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>
                Active Patient Profile: <strong>{currentUser.name}</strong>, {currentUser.age} yrs ({currentUser.ageGroup})
              </span>
              <button
                onClick={() => setPage('profile')}
                className="underline hover:text-white transition-colors text-teal-400 ml-1"
              >
                Change details
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Safety Philosophy Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-teal-50 via-white to-sky-50 border border-teal-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Our Clinical Safety Promise</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Why MediCare AI Does NOT Automatically Prescribe Medicines
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A single symptom like a cough can originate from a viral cold, post-nasal drip, environmental allergies, asthma, or bacterial infection. <strong>Automatically writing a drug prescription based on symptom keywords is clinically dangerous.</strong> MediCare AI provides verified health facts, asks clarifying follow-ups, highlights red flags, and explains active ingredients safely.
              </p>
            </div>
            <button
              onClick={() => setPage('chat')}
              className="shrink-0 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
            >
              Start Consultation
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How MediCare AI Works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            A responsible 4-step workflow designed to evaluate your symptoms with age-calibrated medical safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900">Step 1 — User Login</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log in with your name and age. Age-based rules calibrate safety thresholds for pediatric patients, adults, and seniors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-700 font-medium">
              Example: Name: Ajith, Age: 22
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900">Step 2 — Describe Symptoms</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Type or speak symptoms with voice input. MediCare AI poses targeted follow-up questions regarding duration, fever, and breathlessness.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-sky-700 font-medium">
              "I have a cough for three days"
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900">Step 3 — AI Health Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receives structured guidance: possible non-diagnostic causes, home care, OTC facts, contraindications, and emergency warning signs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
              Structured JSON output
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900">Step 4 — Save & Track</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Revisit past consultations in chat history, log symptom changes in your symptom diary, or purge records under privacy settings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-700 font-medium">
              Export or purge anytime
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Features Built for Patient Safety
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Everything you need for responsible, educational health evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Age-Calibrated Safeguards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Differentiates guidelines for infants, children, adults, and seniors. Specifically prevents contraindications like honey in infants or aspirin in teenagers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Natural Care & Home Remedies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides evidence-backed, non-pharmaceutical home interventions: hydration, steam inhalation, throat soothing, and head elevation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">General Medicine Information</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explains active ingredients (e.g. Dextromethorphan, Guaifenesin, Acetaminophen), precautions, and why suitability requires pharmacist review.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Emergency Warning Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time screening for red flags like chest tightness, severe respiratory distress, or blue lips with direct emergency hotline connections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Voice Input & Audio Reader</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hands-free accessibility with speech recognition microphone and text-to-speech audio reader in English, Telugu, Hindi, and Spanish.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Symptom Diary & History</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track symptom progression over days with 1-10 severity metrics and review past chat transcripts at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Patient Persona Switcher Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Try Different Patient Demographic Profiles</h3>
              <p className="text-xs text-slate-500">
                Observe how MediCare AI dynamically alters medication warnings and guidance based on age and health history.
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-200">
              Interactive Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => switchDemoUser('user_ajith_1')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentUser?.id === 'user_ajith_1'
                  ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Ajith</span>
                <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  22 yrs • Adult
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Allergic to Penicillin. Active young adult profile experiencing seasonal respiratory irritation.
              </p>
            </div>

            <div
              onClick={() => switchDemoUser('user_maya_child')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentUser?.id === 'user_maya_child'
                  ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Maya Patel</span>
                <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                  6 yrs • Child
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Pediatric dosing safeguards apply. Strict warnings on pediatric cough medicines and aspirin.
              </p>
            </div>

            <div
              onClick={() => switchDemoUser('user_robert_senior')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentUser?.id === 'user_robert_senior'
                  ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Robert Chen</span>
                <span className="text-[10px] uppercase font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                  72 yrs • Senior
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Hypertension & Diabetes. High risk for decongestants and NSAID drug interactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
