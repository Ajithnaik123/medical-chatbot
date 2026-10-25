import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  initialUsers,
  initialHealthResources,
  initialChatSessions,
  initialChatMessages,
  initialSymptomDiary,
  initialFeedback,
  getAgeGroup,
} from './src/data/initialData';
import {
  User,
  HealthResource,
  ChatSession,
  ChatMessage,
  SymptomDiaryEntry,
  FeedbackRecord,
  MedicalGuidance,
  ConsentRecord,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent state
let users: User[] = [...initialUsers];
let consents: ConsentRecord[] = [
  {
    userId: 'user_ajith_1',
    consentType: 'medical_ai_educational_consent',
    consentVersion: 'v1.2',
    acceptedAt: '2026-10-10T08:30:00Z',
  },
];
let chatSessions: ChatSession[] = [...initialChatSessions];
let chatMessages: ChatMessage[] = [...initialChatMessages];
let healthResources: HealthResource[] = [...initialHealthResources];
let symptomDiary: SymptomDiaryEntry[] = [...initialSymptomDiary];
let feedbackRecords: FeedbackRecord[] = [...initialFeedback];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Emergency keyword detector for instant server-side triage safety
const EMERGENCY_KEYWORDS = [
  'cannot breathe',
  'severe difficulty breathing',
  'gasping for air',
  'blue lips',
  'blue fingers',
  'crushing chest pain',
  'chest pressure radiating',
  'passed out',
  'unconscious',
  'coughing up large amounts of blood',
  'sudden numbness',
  'facial drooping',
  'sudden paralysis',
  'stiff neck with high fever and rash',
  'anaphylaxis',
  'throat closing up',
  'severe allergic reaction',
  'suicide',
  'kill myself',
  'want to end it all',
];

function detectEmergency(text: string): { isEmergency: boolean; reason?: string } {
  const lower = text.toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        isEmergency: true,
        reason: `Potential critical medical emergency detected: "${kw}". Immediate emergency services (911 or local emergency department) required.`,
      };
    }
  }
  return { isEmergency: false };
}

// Fallback high-fidelity clinical response generator
function generateClinicalFallback(
  symptom: string,
  user: User,
  language: 'en' | 'te' | 'hi' | 'es'
): MedicalGuidance {
  const isChild = user.age < 12;
  const isSenior = user.age >= 65;
  const symLower = symptom.toLowerCase();

  const isCough = symLower.includes('cough') || symLower.includes('khasi') || symLower.includes('daggu');
  const isFever = symLower.includes('fever') || symLower.includes('bukhar') || symLower.includes('jwaram') || symLower.includes('temp');
  const isHeadache = symLower.includes('headache') || symLower.includes('head') || symLower.includes('sar dard') || symLower.includes('talanopi');

  let summary = `Regarding your symptom "${symptom}": In a ${user.age}-year-old ${user.ageGroup}, this is often a symptom of an underlying temporary irritation, viral infection, or physiological response. This information is purely educational and does not constitute a clinical diagnosis.`;
  
  if (language === 'te') {
    summary = `మీరు పేర్కొన్న లక్షణం "${symptom}" గురించిన సమాచారం: ${user.age} సంవత్సరాల వయస్సులో, ఇది సాధారణంగా తాత్కాలిక ఇన్ఫెక్షన్ లేదా అలర్జీ వల్ల కావచ్చు. ఇది సమాచార ప్రయోజనాల కొరకు మాత్రమే, డాక్టర్ సలహాకు ప్రత్యామ్నాయం కాదు.`;
  } else if (language === 'hi') {
    summary = `आपके लक्षण "${symptom}" के बारे में: ${user.age} वर्ष की आयु में यह सामान्यतः मौसमी संक्रमण, एलर्जी या गले की सूजन का संकेत हो सकता है। यह केवल सामान्य स्वास्थ्य मार्गदर्शन है, कोई चिकित्सीय निदान नहीं।`;
  } else if (language === 'es') {
    summary = `Respecto a su síntoma "${symptom}": a los ${user.age} años de edad, comúnmente es un síntoma de una irritación temporal o infección viral respiratoria. Esto es solo con fines informativos y no sustituye la evaluación médica.`;
  }

  let possibleCauses = [
    {
      cause: isCough ? 'Acute Viral Upper Respiratory Infection' : isHeadache ? 'Tension Headache or Dehydration' : 'Viral Infection Response',
      explanation: isCough
        ? 'Common cold or viral illness causing mucosal airway inflammation.'
        : isHeadache
        ? 'Muscle tension around head, neck, eye strain, or insufficient fluid intake.'
        : 'The immune system releasing inflammatory cytokines to fight pathogens.',
      typicalContext: 'Mild to moderate discomfort usually lasting a few days.',
    },
    {
      cause: isCough ? 'Environmental Allergy or Post-Nasal Drip' : 'Sinus Irritation or Environmental Stress',
      explanation: 'Airway or mucous membrane hyperreactivity in response to irritants or allergens.',
      typicalContext: 'Triggered by changes in weather, dust, pollen, or dry indoor air.',
    },
    {
      cause: 'Temporary Fatigue or Mild Airway Inflammation',
      explanation: 'Body signaling the need for rest and recuperation.',
      typicalContext: 'Associated with disrupted sleep, strenuous activity, or recent viral exposure.',
    },
  ];

  let selfCare = [
    {
      title: 'Rest and Hydration',
      instruction: 'Drink plenty of water, warm herbal teas, or clear broths. Adequate hydration thins secretions and supports cellular immunity.',
    },
    {
      title: isChild ? 'Saline Drops & Humidifier (Child Safety)' : 'Warm Steam & Honey Demulcent',
      instruction: isChild
        ? user.age >= 1
          ? 'Use saline nasal mist and cool humidifier. For children 1 year and older, 0.5 to 1 teaspoon of honey can soothe cough.'
          : 'Use saline nasal drops and suction bulb. NEVER give honey to an infant under 12 months.'
        : 'Warm fluids with 1-2 teaspoons of honey soothe throat receptors. Inhaling steam from a shower loosens airway mucus.',
      caution: user.age < 1
        ? 'STRICT WARNING: Honey is contraindicated in infants under 12 months due to infant botulism risk.'
        : undefined,
    },
    {
      title: 'Adequate Sleep and Head Elevation',
      instruction: 'Sleep with an extra pillow to elevate your head and prevent post-nasal drip from triggering nighttime irritation.',
    },
  ];

  let medicineCategories = [
    {
      categoryName: isCough ? 'Antitussives & Expectorants' : 'Analgesics / Antipyretics',
      commonIngredients: isCough ? ['Dextromethorphan (DM)', 'Guaifenesin'] : ['Acetaminophen', 'Ibuprofen'],
      purpose: isCough
        ? 'Dextromethorphan temporarily quiets dry coughs; Guaifenesin thins airway mucus.'
        : 'Reduces discomfort and manages elevated body temperature.',
      precautions: isSenior
        ? 'Older adults should consult a doctor before taking NSAIDs (like Ibuprofen) due to kidney, stomach, and blood pressure interactions.'
        : isChild
        ? 'Always use weight-based pediatric dosing with the measuring dispenser provided. NEVER administer Aspirin to children due to Reye’s syndrome risk.'
        : 'Do not combine multiple multi-symptom products containing Acetaminophen to avoid liver toxicity.',
      ageRestrictions: isChild ? 'Requires pediatric formulation and dosage based on child’s exact weight.' : 'Standard adult OTC guidelines apply.',
    },
    {
      categoryName: 'Soothing Demulcents & Throat Lozenges',
      commonIngredients: ['Pectin', 'Menthol', 'Zinc Gluconate'],
      purpose: 'Coat mucous membranes and provide temporary local comfort.',
      precautions: 'Hard lozenges pose a choking hazard for children under 5 years.',
      ageRestrictions: 'Suitable for adults and supervised older children.',
    },
  ];

  let followUpQuestions = [
    'How many days have you been experiencing this symptom?',
    'Do you have an elevated temperature (fever) or chills?',
    'Are you experiencing any shortness of breath or pain when breathing?',
    'Are you currently taking any prescription medications or do you have known allergies?',
  ];

  let warningSigns = [
    {
      sign: 'Severe difficulty breathing, persistent chest tightness, or cyanosis (blue lips/face)',
      urgency: 'immediate_emergency' as const,
      action: 'Call emergency services (911 / 112 / 108) or go to the nearest emergency room immediately.',
    },
    {
      sign: 'High fever (>103°F / 39.4°C) or fever not responding to antipyretics for >72 hours',
      urgency: 'consult_doctor_promptly' as const,
      action: 'Contact a healthcare provider for an in-person clinical exam.',
    },
    {
      sign: 'Inability to keep liquids down, severe dizziness, or signs of dehydration',
      urgency: 'consult_doctor_promptly' as const,
      action: 'Seek medical evaluation for hydration and clinical assessment.',
    },
  ];

  let sources = [
    {
      title: 'MedlinePlus Medical Encyclopedia: Symptom Overview',
      organization: 'U.S. National Library of Medicine',
      url: 'https://medlineplus.gov/',
    },
    {
      title: 'NHS Health A to Z: Clinical Guidance & Triage',
      organization: 'National Health Service (NHS UK)',
      url: 'https://www.nhs.uk/conditions/',
    },
    {
      title: 'CDC Respiratory & Viral Illness Guidance',
      organization: 'Centers for Disease Control and Prevention',
      url: 'https://www.cdc.gov/',
    },
  ];

  return {
    summary,
    isEmergency: false,
    possible_causes: possibleCauses,
    self_care: selfCare,
    medicine_information: {
      disclaimer: 'MediCare AI provides general pharmaceutical reference info for education. We do NOT prescribe medication. Suitability, safety, and dosing must be confirmed with a licensed physician or pharmacist.',
      categories: medicineCategories,
    },
    follow_up_questions: followUpQuestions,
    warning_signs: warningSigns,
    sources,
    ageSpecificNote: isChild
      ? 'Pediatric Alert: Children have sensitive metabolic pathways. Never guess doses or extrapolate adult medication.'
      : isSenior
      ? 'Geriatric Care Note: Older adults often have altered renal clearance and multiple medications. Watch for drug-drug interactions.'
      : `Personalized note for age ${user.age}: Follow safe adult guidelines and monitor hydration closely.`,
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      service: 'MediCare AI Clinical Assistant API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      aiConnected: !!ai,
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, age, password, dateOfBirth, allergies, existingConditions, consentVersion } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 0 || numAge > 125) {
      return res.status(400).json({ error: 'Please enter a valid age.' });
    }

    // Check if user already exists
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age: numAge,
      dateOfBirth: dateOfBirth || undefined,
      ageGroup: getAgeGroup(numAge),
      allergies: Array.isArray(allergies) ? allergies : [],
      existingConditions: Array.isArray(existingConditions) ? existingConditions : [],
      role: email.toLowerCase().includes('admin') ? 'admin' : 'patient',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Save consent
    consents.push({
      userId: newUser.id,
      consentType: 'medical_ai_educational_consent',
      consentVersion: consentVersion || 'v1.2',
      acceptedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      user: newUser,
      token: `medicare_jwt_${newUser.id}_${Date.now()}`,
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-provision demo patient if user enters new email for smooth preview
      const isAjith = email.toLowerCase().includes('ajith');
      user = {
        id: `user_${Date.now()}`,
        name: isAjith ? 'Ajith' : email.split('@')[0],
        email: email.toLowerCase(),
        age: isAjith ? 22 : 28,
        ageGroup: isAjith ? 'adult' : 'adult',
        allergies: isAjith ? ['Penicillin'] : [],
        existingConditions: isAjith ? ['Mild allergic rhinitis'] : [],
        role: email.toLowerCase().includes('admin') ? 'admin' : 'patient',
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      consents.push({
        userId: user.id,
        consentType: 'medical_ai_educational_consent',
        consentVersion: 'v1.2',
        acceptedAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      user,
      token: `medicare_jwt_${user.id}_${Date.now()}`,
    });
  });

  // Auth: Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Get current user profile
  app.get('/api/users/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const user = users.find((u) => u.id === userId) || users[0];
    res.json(user);
  });

  // Update profile
  app.patch('/api/users/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, age, allergies, existingConditions, dateOfBirth } = req.body;
    const updated = { ...users[idx] };

    if (name) updated.name = name;
    if (age !== undefined) {
      const num = parseInt(age, 10);
      if (!isNaN(num)) {
        updated.age = num;
        updated.ageGroup = getAgeGroup(num);
      }
    }
    if (dateOfBirth) updated.dateOfBirth = dateOfBirth;
    if (Array.isArray(allergies)) updated.allergies = allergies;
    if (Array.isArray(existingConditions)) updated.existingConditions = existingConditions;

    users[idx] = updated;
    res.json(updated);
  });

  // List users (for demo switching)
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(users);
  });

  // Submit symptom and get AI Medical Chatbot Response
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, sessionId, language = 'en', userProfile } = req.body;
      const userId = (req.headers['x-user-id'] as string) || (userProfile?.id ?? 'user_ajith_1');
      const activeUser = users.find((u) => u.id === userId) || userProfile || users[0];

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message content is required.' });
      }

      // Step 1: Emergency Red Flag Screening
      const emergencyCheck = detectEmergency(message);

      // Manage or create chat session
      let session = chatSessions.find((s) => s.id === sessionId);
      const isNewSession = !session;
      if (!session) {
        const titleWords = message.split(' ').slice(0, 6).join(' ');
        session = {
          id: sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId: activeUser.id,
          title: titleWords.length > 0 ? titleWords : 'Medical Symptom Consultation',
          symptomSummary: message.slice(0, 100),
          language: (language as 'en' | 'te' | 'hi' | 'es') || 'en',
          messageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        chatSessions.unshift(session);
      } else {
        session.updatedAt = new Date().toISOString();
        session.messageCount += 1;
      }

      // Record user message
      const userMessageId = `msg_user_${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMessageId,
        sessionId: session.id,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      chatMessages.push(userMsg);

      // Handle Emergency Immediate Alert
      if (emergencyCheck.isEmergency) {
        const emergencyGuidance: MedicalGuidance = {
          summary: `CRITICAL SAFETY ALERT: Based on your input, symptoms such as difficulty breathing, crushing chest pain, or sudden severe symptoms require immediate emergency evaluation.`,
          isEmergency: true,
          emergencyReason: emergencyCheck.reason,
          possible_causes: [
            {
              cause: 'Potential Acute Medical Emergency',
              explanation: 'Symptoms like severe breathing compromise or cardiac-type distress cannot wait for outpatient or online guidance.',
              typicalContext: 'Sudden onset or rapid deterioration.',
            },
          ],
          self_care: [
            {
              title: 'Stop Exertion Immediately',
              instruction: 'Sit or lie down in a comfortable position, loosen tight clothing around your neck and chest.',
            },
            {
              title: 'Do Not Drive Yourself',
              instruction: 'Have someone else call emergency medical services (911 / 112 / 108) or an ambulance.',
            },
          ],
          medicine_information: {
            disclaimer: 'Do NOT attempt to treat acute emergency breathing or chest pain with over-the-counter home medications without emergency dispatch guidance.',
            categories: [],
          },
          follow_up_questions: [
            'Have you called emergency services (911)?',
            'Is someone with you right now?',
          ],
          warning_signs: [
            {
              sign: emergencyCheck.reason || 'Critical Red Flag Symptom Detected',
              urgency: 'immediate_emergency',
              action: 'Call 911 immediately or proceed to the nearest emergency department.',
            },
          ],
          sources: [
            {
              title: 'CDC Emergency Warning Signs',
              organization: 'Centers for Disease Control and Prevention',
              url: 'https://www.cdc.gov/',
            },
            {
              title: 'NHS 999 / 111 Emergency Triage',
              organization: 'National Health Service',
              url: 'https://www.nhs.uk/',
            },
          ],
          ageSpecificNote: `Emergency triage priority for a ${activeUser.age}-year-old ${activeUser.ageGroup}.`,
        };

        const botMsg: ChatMessage = {
          id: `msg_bot_${Date.now()}`,
          sessionId: session.id,
          role: 'assistant',
          content: `URGENT MEDICAL WARNING: Your described symptom indicates a potential medical emergency. Please seek immediate medical help or call 911 immediately.`,
          structuredData: emergencyGuidance,
          isEmergencyFlagged: true,
          createdAt: new Date().toISOString(),
        };
        chatMessages.push(botMsg);
        session.messageCount += 1;

        return res.json({
          session,
          userMessage: userMsg,
          assistantMessage: botMsg,
        });
      }

      // Step 2 & 3: Generate AI Response using Gemini API with structured JSON output
      let structuredGuidance: MedicalGuidance | null = null;
      let textContent = '';

      if (ai) {
        try {
          const systemInstruction = `You are MediCare AI, a clinical medical information assistant designed to provide safe, responsible, structured health guidance.
CRITICAL SAFETY & MEDICAL RULES:
1. NON-DIAGNOSTIC: You must NEVER diagnose the user or make definitive statements like "You have bronchitis". Explain possible causes in understandable language as non-diagnostic possibilities.
2. NO AUTOMATIC PRESCRIPTION: Do NOT prescribe medications or specify drug dosages. Explain general medicine categories (e.g. Antitussives, Expectorants, Analgesics), their active ingredients (e.g. Dextromethorphan, Guaifenesin, Acetaminophen), their uses, safety precautions, and why suitability depends on age and clinical history.
3. AGE-BASED SAFEGUARDS:
   - Patient Name: "${activeUser.name}"
   - Patient Age: ${activeUser.age} (${activeUser.ageGroup})
   - Known Allergies: ${activeUser.allergies.join(', ') || 'None reported'}
   - Existing Conditions: ${activeUser.existingConditions.join(', ') || 'None reported'}
   - If user is under 1 year old: Honey is STRICTLY CONTRAINDICATED due to infant botulism. Do not recommend adult cough medicines.
   - If user is under 19: Warn against Aspirin due to Reye's syndrome.
   - If user is an older adult (65+): Warn about NSAID risks (kidneys/stomach) and decongestant interactions with blood pressure.
4. NATURAL CARE: Suggest safe home-care methods (hydration, steam, elevating head, honey if age > 1 year).
5. WARNING SIGNS: Clearly list warning signs (severe shortness of breath, blue lips, high fever >3 days) requiring immediate emergency medical care.
6. SOURCES: Reference trusted medical sources (MedlinePlus, NHS, WHO, CDC, Mayo Clinic).
7. LANGUAGE: Respond in the requested language: ${language} (en: English, te: Telugu, hi: Hindi, es: Spanish). Keep medical terminology understandable.

You must return valid JSON matching the requested schema.`;

          const prompt = `The user reports: "${message}".
Please provide comprehensive, empathetic, structured medical health guidance for a ${activeUser.age}-year-old ${activeUser.ageGroup}.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: {
                    type: Type.STRING,
                    description: 'Empathetic, clear, non-diagnostic overview of the symptom.',
                  },
                  isEmergency: {
                    type: Type.BOOLEAN,
                    description: 'Whether immediate emergency care is warranted.',
                  },
                  possible_causes: {
                    type: Type.ARRAY,
                    description: 'Possible non-diagnostic causes with context.',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        cause: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        typicalContext: { type: Type.STRING },
                      },
                      required: ['cause', 'explanation', 'typicalContext'],
                    },
                  },
                  self_care: {
                    type: Type.ARRAY,
                    description: 'Evidence-based home and natural care measures.',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        instruction: { type: Type.STRING },
                        caution: { type: Type.STRING },
                      },
                      required: ['title', 'instruction'],
                    },
                  },
                  medicine_information: {
                    type: Type.OBJECT,
                    properties: {
                      disclaimer: { type: Type.STRING },
                      categories: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            categoryName: { type: Type.STRING },
                            commonIngredients: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING },
                            },
                            purpose: { type: Type.STRING },
                            precautions: { type: Type.STRING },
                            ageRestrictions: { type: Type.STRING },
                          },
                          required: ['categoryName', 'commonIngredients', 'purpose', 'precautions', 'ageRestrictions'],
                        },
                      },
                    },
                    required: ['disclaimer', 'categories'],
                  },
                  follow_up_questions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Relevant follow-up questions to clarify duration, severity, fever, etc.',
                  },
                  warning_signs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        sign: { type: Type.STRING },
                        urgency: {
                          type: Type.STRING,
                          description: 'immediate_emergency | consult_doctor_promptly | monitor',
                        },
                        action: { type: Type.STRING },
                      },
                      required: ['sign', 'urgency', 'action'],
                    },
                  },
                  sources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        organization: { type: Type.STRING },
                        url: { type: Type.STRING },
                      },
                      required: ['title', 'organization'],
                    },
                  },
                  ageSpecificNote: {
                    type: Type.STRING,
                    description: 'Specific safety note customized to patient age and existing conditions.',
                  },
                },
                required: [
                  'summary',
                  'isEmergency',
                  'possible_causes',
                  'self_care',
                  'medicine_information',
                  'follow_up_questions',
                  'warning_signs',
                  'sources',
                ],
              },
            },
          });

          const rawText = response.text || '';
          structuredGuidance = JSON.parse(rawText) as MedicalGuidance;
          textContent = structuredGuidance.summary;
        } catch (geminiError) {
          console.error('Gemini API call failed or returned unparseable JSON, using clinical fallback:', geminiError);
          structuredGuidance = null;
        }
      }

      // If Gemini wasn't configured or failed, use high-fidelity clinical fallback
      if (!structuredGuidance) {
        structuredGuidance = generateClinicalFallback(message, activeUser, language as 'en' | 'te' | 'hi' | 'es');
        textContent = structuredGuidance.summary;
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sessionId: session.id,
        role: 'assistant',
        content: textContent,
        structuredData: structuredGuidance,
        isEmergencyFlagged: structuredGuidance.isEmergency,
        createdAt: new Date().toISOString(),
      };

      chatMessages.push(botMsg);
      session.messageCount += 1;

      res.json({
        session,
        userMessage: userMsg,
        assistantMessage: botMsg,
      });
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      res.status(500).json({ error: 'Failed to process medical guidance request: ' + (err.message || 'Server error') });
    }
  });

  // Chat History: List sessions for user
  app.get('/api/chat/history', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const userSessions = chatSessions.filter((s) => !userId || s.userId === userId);
    res.json(userSessions);
  });

  // Get specific conversation with all messages
  app.get('/api/chat/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const session = chatSessions.find((s) => s.id === id);
    if (!session) {
      return res.status(404).json({ error: 'Chat conversation not found' });
    }

    const messages = chatMessages.filter((m) => m.sessionId === id);
    res.json({ session, messages });
  });

  // Delete conversation
  app.delete('/api/chat/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    chatSessions = chatSessions.filter((s) => s.id !== id);
    chatMessages = chatMessages.filter((m) => m.sessionId !== id);
    feedbackRecords = feedbackRecords.filter((f) => f.sessionId !== id);
    res.json({ success: true, deletedSessionId: id });
  });

  // Health Resources: List reviewed resources
  app.get('/api/resources', (req: Request, res: Response) => {
    const { category, search } = req.query;
    let list = [...healthResources];

    if (category && typeof category === 'string' && category !== 'all') {
      list = list.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  // Admin: Create resource
  app.post('/api/admin/resources', (req: Request, res: Response) => {
    const { title, category, source, summary, content, keyPoints, tags } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const newResource: HealthResource = {
      id: `res_${Date.now()}`,
      title,
      category,
      source: source || 'Reviewed Clinical Panel',
      reviewedAt: new Date().toISOString().split('T')[0],
      summary: summary || title,
      content,
      keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
      tags: Array.isArray(tags) ? tags : ['Clinical Guidance'],
    };

    healthResources.unshift(newResource);
    res.status(201).json(newResource);
  });

  // Admin: Delete resource
  app.delete('/api/admin/resources/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    healthResources = healthResources.filter((r) => r.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // Feedback: Submit chatbot response feedback
  app.post('/api/feedback', (req: Request, res: Response) => {
    const { sessionId, messageId, rating, clinicalAccuracy, feedbackText } = req.body;
    if (!sessionId || !rating) {
      return res.status(400).json({ error: 'Session ID and rating are required' });
    }

    const newFeedback: FeedbackRecord = {
      id: `fb_${Date.now()}`,
      sessionId,
      messageId: messageId || 'general',
      rating,
      clinicalAccuracy: clinicalAccuracy || 5,
      feedbackText: feedbackText || '',
      createdAt: new Date().toISOString(),
    };

    feedbackRecords.unshift(newFeedback);
    res.status(201).json({ success: true, feedback: newFeedback });
  });

  // Admin: Review feedback
  app.get('/api/admin/feedback', (req: Request, res: Response) => {
    res.json(feedbackRecords);
  });

  // Admin: System Quality & Safety Stats
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const emergencyFlagsCount = chatMessages.filter((m) => m.isEmergencyFlagged).length;
    const helpfulRatings = feedbackRecords.filter((f) => f.rating === 'helpful').length;
    const totalRatings = feedbackRecords.length;
    const averageHelpfulness = totalRatings > 0 ? Math.round((helpfulRatings / totalRatings) * 100) : 98;

    res.json({
      totalConsultations: chatSessions.length,
      totalUsers: users.length,
      emergencyFlagsCount,
      averageHelpfulness,
      reviewedResourcesCount: healthResources.length,
      topSymptoms: [
        { name: 'Cough & Throat Irritation', count: 48 },
        { name: 'Fever & Chills', count: 35 },
        { name: 'Headache & Tension', count: 29 },
        { name: 'Nasal Congestion & Sinus', count: 24 },
        { name: 'Allergy Symptoms', count: 18 },
      ],
    });
  });

  // Symptom Diary: List entries
  app.get('/api/diary', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const list = symptomDiary.filter((d) => !userId || d.userId === userId);
    res.json(list);
  });

  // Symptom Diary: Create entry
  app.post('/api/diary', (req: Request, res: Response) => {
    const { symptom, severity, notes, duration, status } = req.body;
    const userId = (req.headers['x-user-id'] as string) || 'user_ajith_1';

    if (!symptom) {
      return res.status(400).json({ error: 'Symptom name is required' });
    }

    const newEntry: SymptomDiaryEntry = {
      id: `diary_${Date.now()}`,
      userId,
      symptom,
      severity: Math.min(10, Math.max(1, parseInt(severity, 10) || 5)),
      notes: notes || '',
      duration: duration || '1 day',
      status: status || 'stable',
      date: new Date().toISOString().split('T')[0],
    };

    symptomDiary.unshift(newEntry);
    res.status(201).json(newEntry);
  });

  // Symptom Diary: Delete entry
  app.delete('/api/diary/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    symptomDiary = symptomDiary.filter((d) => d.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // Privacy: Purge user data
  app.post('/api/privacy/purge', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const userSessions = chatSessions.filter((s) => s.userId === userId).map((s) => s.id);
    chatSessions = chatSessions.filter((s) => s.userId !== userId);
    chatMessages = chatMessages.filter((m) => !userSessions.includes(m.sessionId));
    symptomDiary = symptomDiary.filter((d) => d.userId !== userId);
    feedbackRecords = feedbackRecords.filter((f) => !userSessions.includes(f.sessionId));

    res.json({
      success: true,
      message: 'All health history, chat logs, and symptom diary entries have been permanently purged.',
      purgedSessions: userSessions.length,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediCare AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
