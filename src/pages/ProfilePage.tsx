import { useState } from 'react';
import { useStore } from '../store/useStore';
import { getAgeGroup } from '../data/initialData';
import {
  User,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Plus,
  X,
  Save,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export function ProfilePage() {
  const { currentUser, updateUserProfile } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState(currentUser?.age?.toString() || '22');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth || '');
  const [allergies, setAllergies] = useState<string[]>(currentUser?.allergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [existingConditions, setExistingConditions] = useState<string[]>(
    currentUser?.existingConditions || []
  );
  const [newCondition, setNewCondition] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedAge = parseInt(age, 10) || 22;
  const currentAgeGroup = getAgeGroup(parsedAge);

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (item: string) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const handleAddCondition = () => {
    if (newCondition.trim() && !existingConditions.includes(newCondition.trim())) {
      setExistingConditions([...existingConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (item: string) => {
    setExistingConditions(existingConditions.filter((c) => c !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateUserProfile({
      name: name.trim(),
      age: parsedAge,
      dateOfBirth: dateOfBirth || undefined,
      allergies,
      existingConditions,
    });
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Patient Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Health Profile & Demographic Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ensure your age, medication allergies, and medical background are up-to-date so MediCare AI applies correct safety precautions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Demographics Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Patient Identification & Age</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 capitalize border border-teal-200">
              {currentAgeGroup} Profile
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ajith"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="125"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Email</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Age Group Clinical Notes */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">
              Active Clinical Safety Protocols for {currentAgeGroup.toUpperCase()}:
            </div>
            {currentAgeGroup === 'child' && (
              <p>
                Pediatric guidelines active: Strict warnings on adult cough syrups, honey contraindications for infants under 12 months, and prohibition of aspirin due to Reye's syndrome.
              </p>
            )}
            {currentAgeGroup === 'adult' && (
              <p>
                Standard adult guidelines active: Emphasizing non-diagnostic causes, home care, hydration, and over-the-counter precautions.
              </p>
            )}
            {currentAgeGroup === 'senior' && (
              <p>
                Geriatric guidelines active: Added precautions for kidney/liver clearance, avoiding NSAIDs with cardiovascular risks, and avoiding decongestants with hypertension.
              </p>
            )}
            {currentAgeGroup === 'adolescent' && (
              <p>
                Adolescent guidelines active: Clear warnings against aspirin during viral infections and weight-dependent dosing checks.
              </p>
            )}
          </div>
        </div>

        {/* Medication Allergies Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base text-slate-900">Known Drug & Medication Allergies</h3>
          </div>
          <p className="text-xs text-slate-500">
            List any known drug hypersensitivities (e.g. Penicillin, Sulfa drugs, NSAIDs, Cephalosporins).
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
              placeholder="e.g. Penicillin, Amoxicillin..."
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={handleAddAllergy}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {allergies.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No drug allergies recorded.</span>
            ) : (
              allergies.map((allg, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{allg}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(allg)}
                    className="text-rose-400 hover:text-rose-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Existing Medical Conditions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-slate-900">Existing Medical Conditions</h3>
          </div>
          <p className="text-xs text-slate-500">
            Conditions like Asthma, Hypertension, Diabetes, or GERD that influence symptom assessment and OTC medicine safety.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
              placeholder="e.g. Asthma, Hypertension, Acid Reflux..."
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={handleAddCondition}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {existingConditions.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No medical conditions recorded.</span>
            ) : (
              existingConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(cond)}
                    className="text-teal-400 hover:text-teal-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Health Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
