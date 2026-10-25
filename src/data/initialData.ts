import { User, HealthResource, ChatSession, ChatMessage, SymptomDiaryEntry, FeedbackRecord } from '../types';

export function getAgeGroup(age: number): 'child' | 'adolescent' | 'adult' | 'senior' {
  if (age < 12) return 'child';
  if (age < 18) return 'adolescent';
  if (age < 65) return 'adult';
  return 'senior';
}

export const initialUsers: User[] = [
  {
    id: 'user_ajith_1',
    name: 'Ajith',
    email: 'ajith@example.com',
    age: 22,
    dateOfBirth: '2004-03-15',
    ageGroup: 'adult',
    allergies: ['Penicillin'],
    existingConditions: ['Mild allergic rhinitis'],
    role: 'patient',
    createdAt: '2026-10-10T08:30:00Z',
  },
  {
    id: 'user_maya_child',
    name: 'Maya Patel (Child)',
    email: 'maya.parent@example.com',
    age: 6,
    dateOfBirth: '2020-05-12',
    ageGroup: 'child',
    allergies: ['Peanuts'],
    existingConditions: [],
    role: 'patient',
    createdAt: '2026-10-15T11:00:00Z',
  },
  {
    id: 'user_robert_senior',
    name: 'Robert Chen (Senior)',
    email: 'robert.chen@example.com',
    age: 72,
    dateOfBirth: '1954-08-20',
    ageGroup: 'senior',
    allergies: ['Sulfa drugs'],
    existingConditions: ['Hypertension', 'Type 2 Diabetes'],
    role: 'patient',
    createdAt: '2026-10-01T09:15:00Z',
  },
  {
    id: 'admin_sarah',
    name: 'Dr. Sarah Vance',
    email: 'admin@medicare.ai',
    age: 38,
    dateOfBirth: '1988-11-04',
    ageGroup: 'adult',
    allergies: [],
    existingConditions: [],
    role: 'admin',
    createdAt: '2026-09-01T00:00:00Z',
  },
];

export const initialHealthResources: HealthResource[] = [
  {
    id: 'res_cough_medlineplus',
    title: 'Cough: Causes, Home Remedies, and When to See a Doctor',
    category: 'Respiratory',
    source: 'MedlinePlus',
    reviewedAt: '2026-09-15',
    summary: 'Comprehensive clinical guide explaining acute vs chronic cough, upper respiratory tract infections, allergic cough, and why coughing is a protective reflex.',
    content: `A cough is an important protective reflex that helps clear secretions and foreign materials from your airways. An acute cough lasts fewer than 3 to 4 weeks and is most commonly caused by viral respiratory infections such as the common cold or influenza. 

Medical evaluation is recommended if a cough lasts more than 3 weeks, is accompanied by shortness of breath, blood in the sputum, high fever, or unexplained weight loss. 

Over-the-counter cough medicines have specific indications; suppressants (antitussives) quiet dry hacking coughs, whereas expectorants thin mucus. However, they do not cure the underlying infection and must be used with careful attention to active ingredients.`,
    keyPoints: [
      'Acute cough usually resolves within 2 to 3 weeks without antibiotics.',
      'Hydration with warm fluids and steam inhalation helps soothe irritated mucosal tissues.',
      'Cough medicines should be matched to whether the cough is dry or productive.',
      'Never ignore shortness of breath or chest pain accompanying a cough.',
    ],
    tags: ['Cough', 'Cold', 'Respiratory', 'OTC Meds', 'Self-Care'],
  },
  {
    id: 'res_honey_infant_warning',
    title: 'Infant Safety Alert: Why Honey Must Never Be Given to Infants Under 1 Year',
    category: 'Pediatrics',
    source: 'WHO',
    reviewedAt: '2026-08-20',
    summary: 'Critical pediatric safety rule: honey contains spores of Clostridium botulinum bacteria which can cause infant botulism in children under 12 months.',
    content: `While honey is recognized by medical bodies including the AAP and WHO as a safe, natural demulcent to soothe cough in children over 1 year of age and adults, it is strictly contraindicated for infants under 12 months old.

Infants under 1 year lack the mature digestive tract flora and gastric acidity required to prevent Clostridium botulinum spores from germinating and producing botulinum neurotoxin. Infant botulism can lead to constipation, weak cry, floppiness (loss of muscle tone), difficulty swallowing, and life-threatening respiratory failure.

For infants under 1 year with a cough or cold, consult a pediatrician. Use saline nasal drops and a cool mist humidifier instead.`,
    keyPoints: [
      'NEVER give honey to infants under 12 months of age in any form or baked item.',
      'Infant botulism causes muscle weakness, lethargy, poor feeding, and breathing failure.',
      'For children 1 year and older, 0.5 to 1 teaspoon of honey can soothe irritated cough receptors.',
    ],
    tags: ['Pediatrics', 'Honey', 'Infant Safety', 'Botulism', 'Warning'],
  },
  {
    id: 'res_fever_rules',
    title: 'Fever Guidelines: When to Treat and When to Seek Immediate Care',
    category: 'Pain & Fever',
    source: 'NHS',
    reviewedAt: '2026-09-02',
    summary: 'Evidence-based advice on body temperature regulation, safe antipyretic usage (Acetaminophen vs Ibuprofen), and red flag symptoms.',
    content: `A fever (body temperature of 38°C / 100.4°F or higher) is an active immune defense mechanism indicating your immune system is responding to an infection. The primary goal of managing a fever is comfort and preventing dehydration, not forcing the temperature to baseline normal.

Safety rules:
1. Acetaminophen (Paracetamol) and Ibuprofen are common over-the-counter antipyretics. Never exceed recommended daily limits due to risks of hepatotoxicity (liver injury) from acetaminophen or gastric bleeding/renal strain from ibuprofen.
2. Never give Aspirin (acetylsalicylic acid) to children or teenagers recovering from viral infections due to the risk of Reye's syndrome, a rare but life-threatening condition affecting the liver and brain.
3. Keep the patient hydrated with water, clear broths, or electrolyte solutions.`,
    keyPoints: [
      'Red flag fever: Temp over 40°C (104°F), stiff neck, confusion, purple rash, or fever lasting >3 days.',
      'Infants under 3 months with a rectal temp of 38°C (100.4°F) require emergency evaluation.',
      'Avoid dual/overlapping cold medications that contain hidden acetaminophen to prevent accidental overdose.',
    ],
    tags: ['Fever', 'Antipyretics', 'Acetaminophen', 'Pediatric Safety', 'Reye Syndrome'],
  },
  {
    id: 'res_cold_flu_triage',
    title: 'Common Cold vs. Influenza vs. COVID-19: Clinical Differentiation',
    category: 'Respiratory',
    source: 'CDC',
    reviewedAt: '2026-10-01',
    summary: 'Differentiating viral respiratory illnesses based on symptom onset speed, fever prominence, muscle aches, and potential complications.',
    content: `Upper respiratory infections share overlapping symptoms, but subtle distinctions guide home care:
- Common Cold: Gradual onset over 1-2 days, dominated by runny/stuffy nose, sneezing, mild sore throat, and low-grade or absent fever.
- Influenza (Flu): Abrupt onset within hours, characterized by high fever, severe fatigue, profound muscle aches, headache, and dry cough.
- COVID-19: Can present similarly to cold or flu; may also involve loss of taste/smell, gastrointestinal upset, or delayed breathing complications around day 5-8.

Antibiotics do NOT treat viral infections (colds, flu). Unnecessary antibiotic use contributes to antibiotic resistance without hastening recovery.`,
    keyPoints: [
      'Flu typically strikes abruptly with high fever and body exhaustion; colds develop gradually.',
      'Antiviral medications for flu (like oseltamivir) work best when initiated within 48 hours of symptom onset for high-risk patients.',
      'Rest and hydration remain the bedrock of viral recovery.',
    ],
    tags: ['Influenza', 'Common Cold', 'Respiratory', 'Virus', 'Triage'],
  },
  {
    id: 'res_otc_safety',
    title: 'Over-the-Counter Medication Safety: Understanding Active Ingredients',
    category: 'Medication Safety',
    source: 'FDA',
    reviewedAt: '2026-07-28',
    summary: "Guidelines on reading 'Drug Facts' labels, avoiding accidental double-dosing of active ingredients, and checking drug-condition interactions.",
    content: `Many multi-symptom cold and flu products combine an analgesic/antipyretic (e.g., acetaminophen), a decongestant (e.g., phenylephrine or pseudoephedrine), an antihistamine (e.g., diphenhydramine), and a cough suppressant (dextromethorphan).

Risks to avoid:
- Accidental Acetaminophen Overdose: Taking a combination cold medicine while also taking single-ingredient Tylenol can exceed the safe 4,000 mg 24-hour ceiling.
- Decongestants & High Blood Pressure: Oral decongestants constrict blood vessels and can cause dangerous spikes in blood pressure for patients with hypertension.
- Drowsiness & Antihistamines: First-generation antihistamines cause sedation and impair driving ability.`,
    keyPoints: [
      "Always check the 'Active Ingredients' box before taking any combination product.",
      'Consult a doctor or pharmacist if you have high blood pressure, diabetes, thyroid disease, or glaucoma before taking decongestants.',
      'Always use the graduated measuring cup or syringe provided with pediatric liquid medications—never a kitchen spoon.',
    ],
    tags: ['Medication Safety', 'Drug Facts', 'Acetaminophen', 'Decongestants', 'Hypertension'],
  },
  {
    id: 'res_headache_red_flags',
    title: 'Headache Red Flags: When Head Pain Is a Medical Emergency',
    category: 'Pain & Fever',
    source: 'Mayo Clinic',
    reviewedAt: '2026-08-14',
    summary: 'Recognizing primary tension and migraine headaches versus secondary headaches requiring immediate neurologic evaluation (SNOOP criteria).',
    content: `Most headaches are benign primary headaches such as tension headaches (band-like pressure) or migraines (throbbing, often unilateral, accompanied by light/sound sensitivity or nausea).

However, specific warning signs (the SNOOP criteria) require prompt emergency intervention:
- Systemic symptoms: Fever, chills, weight loss, or in individuals with active cancer/immunosuppression.
- Neurologic deficits: Confusion, speech difficulty, visual changes, weakness on one side of the body, or numbness.
- Onset: 'Thunderclap' headache reaching maximum agonizing intensity within 60 seconds (requires immediate rule-out of subarachnoid hemorrhage).
- Older age: New onset headache in patients older than 50 years (evaluating for giant cell arteritis).
- Pattern change: Headache substantially different from past headaches, or worsening with coughing/bending.`,
    keyPoints: [
      "A sudden, explosive 'worst headache of your life' is a medical emergency—call emergency services immediately.",
      'Headache with fever and neck stiffness (inability to touch chin to chest) suggests possible meningitis.',
      'Hydration, dim quiet rooms, and ergonomic adjustments relieve common tension headaches.',
    ],
    tags: ['Headache', 'Neurology', 'Red Flags', 'Emergency', 'Migraine'],
  },
];

export const initialChatSessions: ChatSession[] = [
  {
    id: 'session_cough_demo',
    userId: 'user_ajith_1',
    title: 'Cough for three days with throat irritation',
    symptomSummary: 'Dry cough, 3 days duration, throat tickle, mild fatigue',
    language: 'en',
    messageCount: 2,
    createdAt: '2026-10-24T14:20:00Z',
    updatedAt: '2026-10-24T14:21:30Z',
  },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_user_1',
    sessionId: 'session_cough_demo',
    role: 'user',
    content: 'I have a cough for three days.',
    createdAt: '2026-10-24T14:20:00Z',
  },
  {
    id: 'msg_bot_1',
    sessionId: 'session_cough_demo',
    role: 'assistant',
    content: `A cough can have several causes, including a common cold, allergies, or airway irritation. I can provide general health information and safe home-care options, but I cannot determine the exact cause from this symptom alone.

A few questions to help clarify your situation:
- Do you have a fever, chills, or difficulty breathing?
- Is your cough dry and hacking, or are you coughing up mucus/phlegm?
- Do you have any known medical conditions like asthma or acid reflux?
- Are you currently taking any medicines or do you have medication allergies?`,
    structuredData: {
      summary: 'A 3-day cough is commonly an acute symptom of an upper respiratory tract irritation or early viral infection. It serves as a natural reflex to clear airway passages.',
      isEmergency: false,
      possible_causes: [
        {
          cause: 'Common Viral Upper Respiratory Infection (Cold)',
          explanation: 'Viral irritation of the upper airway membranes commonly triggers a dry or slightly productive cough that peaks within 3 to 7 days.',
          typicalContext: 'Often accompanied by mild throat tickle, nasal congestion, or slight fatigue.',
        },
        {
          cause: 'Allergic Rhinitis or Post-Nasal Drip',
          explanation: 'Environmental allergens (dust, pollen, pet dander) cause secretions to drip down the back of the throat, stimulating persistent coughing.',
          typicalContext: 'Frequent throat clearing, itchy eyes, dry cough usually worse when lying flat.',
        },
        {
          cause: 'Airway Hyperreactivity or Early Bronchial Irritation',
          explanation: 'In individuals with airway sensitivity or mild asthma, cold air, dry air, or pollutants can trigger bronchospasm and coughing.',
          typicalContext: 'Dry coughing spells, especially in dry air or during physical exertion.',
        },
      ],
      self_care: [
        {
          title: 'Hydration and Warm Fluids',
          instruction: 'Drink ample fluids throughout the day. Warm herbal tea, clear broths, or warm water with lemon help thin secretions and coat irritated pharyngeal tissues.',
        },
        {
          title: 'Natural Honey Demulcent',
          instruction: 'For adults and children older than 1 year, 1 to 2 teaspoons of pure honey can naturally soothe cough receptors and reduce nocturnal coughing.',
          caution: 'CRITICAL: Never administer honey to an infant under 12 months old due to the risk of fatal infant botulism.',
        },
        {
          title: 'Steam Inhalation and Cool-Mist Humidifier',
          instruction: 'Use a cool-mist humidifier in the bedroom or take a warm, steamy shower to moisturize dry bronchial passages.',
        },
        {
          title: 'Elevate Head During Sleep',
          instruction: 'Prop up your head with an extra pillow to prevent post-nasal secretions from pooling at the back of your throat overnight.',
        },
      ],
      medicine_information: {
        disclaimer: 'The following is general educational information on common over-the-counter (OTC) active ingredients. MediCare AI does NOT prescribe medications; suitability depends on your specific medical history, age, and existing prescriptions. Consult a licensed pharmacist or physician before starting any medication.',
        categories: [
          {
            categoryName: 'Cough Suppressants (Antitussives)',
            commonIngredients: ['Dextromethorphan (DM)'],
            purpose: 'Temporarily quiets dry, non-productive coughs that interfere with sleep or rest.',
            precautions: 'Do not use with MAO inhibitors or for productive coughs where clearing mucus is necessary.',
            ageRestrictions: 'Not recommended for young children under 6 years without pediatric guidance.',
          },
          {
            categoryName: 'Expectorants',
            commonIngredients: ['Guaifenesin'],
            purpose: 'Helps thin and loosen mucus in the airways so coughing is more productive.',
            precautions: 'Must be accompanied by drinking plenty of water to be effective.',
            ageRestrictions: 'Consult pediatric dosing for children.',
          },
          {
            categoryName: 'Throat Lozenges / Demulcents',
            commonIngredients: ['Pectin', 'Menthol', 'Eucalyptus'],
            purpose: 'Provides localized temporary numbing or soothing for throat tickle.',
            precautions: 'Choking hazard in toddlers and very young children.',
            ageRestrictions: 'Safe for older children and adults.',
          },
        ],
      },
      follow_up_questions: [
        'Do you have a fever or chills?',
        'Are you experiencing any shortness of breath or wheezing?',
        'Is your cough dry, or are you bringing up colored phlegm?',
        'Do you have a history of allergies or asthma?',
      ],
      warning_signs: [
        {
          sign: 'Severe difficulty breathing, gasping, or blue/grey tint around lips or fingernails',
          urgency: 'immediate_emergency',
          action: 'Call 911 or visit the nearest Emergency Department immediately.',
        },
        {
          sign: 'Coughing up blood or rust-colored sputum',
          urgency: 'consult_doctor_promptly',
          action: 'Seek prompt in-person medical evaluation.',
        },
        {
          sign: 'Chest pain or pressure while breathing',
          urgency: 'immediate_emergency',
          action: 'Requires urgent medical assessment to rule out cardiac or pulmonary complications.',
        },
        {
          sign: 'High fever over 102°F (38.9°C) that does not respond to antipyretics or persists over 3 days',
          urgency: 'consult_doctor_promptly',
          action: 'Schedule an appointment with your healthcare provider.',
        },
      ],
      sources: [
        {
          title: 'Cough: MedlinePlus Medical Encyclopedia',
          organization: 'U.S. National Library of Medicine (MedlinePlus)',
          url: 'https://medlineplus.gov/cough.html',
        },
        {
          title: 'Cough Symptoms & Self-Care Guide',
          organization: 'National Health Service (NHS)',
          url: 'https://www.nhs.uk/conditions/cough/',
        },
        {
          title: 'Infant Botulism & Honey Warning',
          organization: 'World Health Organization (WHO)',
          url: 'https://www.who.int/news-room/fact-sheets/detail/botulism',
        },
      ],
      ageSpecificNote: 'For a 22-year-old adult, standard adult self-care and hydration guidelines apply. Always verify allergies (e.g. penicillin) with your treating clinician.',
    },
    createdAt: '2026-10-24T14:21:30Z',
  },
];

export const initialSymptomDiary: SymptomDiaryEntry[] = [
  {
    id: 'diary_1',
    userId: 'user_ajith_1',
    symptom: 'Dry cough with throat tickle',
    severity: 4,
    notes: 'Started Thursday evening after being in air conditioning. Warm tea with lemon provided good relief.',
    duration: '3 days',
    status: 'improving',
    date: '2026-10-24',
  },
  {
    id: 'diary_2',
    userId: 'user_ajith_1',
    symptom: 'Nasal congestion & mild sinus pressure',
    severity: 3,
    notes: 'Mild stuffiness in the morning, cleared up after hot shower.',
    duration: '2 days',
    status: 'stable',
    date: '2026-10-23',
  },
];

export const initialFeedback: FeedbackRecord[] = [
  {
    id: 'fb_1',
    sessionId: 'session_cough_demo',
    messageId: 'msg_bot_1',
    rating: 'helpful',
    clinicalAccuracy: 5,
    feedbackText: 'Clear differentiation between dry and productive cough, and emphasized the honey safety rule clearly.',
    createdAt: '2026-10-24T14:25:00Z',
  },
];
