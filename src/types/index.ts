export type AgeGroup = 'child' | 'adolescent' | 'adult' | 'senior';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  dateOfBirth?: string;
  ageGroup: AgeGroup;
  allergies: string[];
  existingConditions: string[];
  role: 'patient' | 'admin';
  createdAt: string;
}

export interface ConsentRecord {
  userId: string;
  consentType: string;
  consentVersion: string;
  acceptedAt: string;
}

export interface MedicalGuidance {
  summary: string;
  isEmergency: boolean;
  emergencyReason?: string;
  possible_causes: Array<{
    cause: string;
    explanation: string;
    typicalContext: string;
  }>;
  self_care: Array<{
    title: string;
    instruction: string;
    caution?: string;
  }>;
  medicine_information: {
    disclaimer: string;
    categories: Array<{
      categoryName: string;
      commonIngredients: string[];
      purpose: string;
      precautions: string;
      ageRestrictions: string;
    }>;
  };
  follow_up_questions: string[];
  warning_signs: Array<{
    sign: string;
    urgency: 'immediate_emergency' | 'consult_doctor_promptly' | 'monitor';
    action: string;
  }>;
  sources: Array<{
    title: string;
    organization: string;
    url?: string;
  }>;
  ageSpecificNote?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  structuredData?: MedicalGuidance;
  isEmergencyFlagged?: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  symptomSummary: string;
  language: 'en' | 'te' | 'hi' | 'es';
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HealthResource {
  id: string;
  title: string;
  category: 'Respiratory' | 'Digestive' | 'Pain & Fever' | 'Pediatrics' | 'Medication Safety' | 'First Aid' | 'Chronic Care';
  source: 'MedlinePlus' | 'NHS' | 'CDC' | 'WHO' | 'Mayo Clinic' | 'FDA';
  reviewedAt: string;
  summary: string;
  content: string;
  keyPoints: string[];
  tags: string[];
}

export interface FeedbackRecord {
  id: string;
  sessionId: string;
  messageId: string;
  rating: 'helpful' | 'unhelpful';
  clinicalAccuracy: number; // 1-5
  feedbackText: string;
  createdAt: string;
}

export interface SymptomDiaryEntry {
  id: string;
  userId: string;
  symptom: string;
  severity: number; // 1 - 10
  notes: string;
  duration: string;
  status: 'worse' | 'stable' | 'improving' | 'resolved';
  date: string;
}

export interface SystemStats {
  totalConsultations: number;
  totalUsers: number;
  emergencyFlagsCount: number;
  averageHelpfulness: number;
  reviewedResourcesCount: number;
  topSymptoms: Array<{ name: string; count: number }>;
}
