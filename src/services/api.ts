import {
  User,
  ChatSession,
  ChatMessage,
  HealthResource,
  FeedbackRecord,
  SymptomDiaryEntry,
  SystemStats,
} from '../types';

const BASE_URL = '/api';

function getHeaders(userId?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: {
    name: string;
    email: string;
    age: number;
    password?: string;
    allergies?: string[];
    existingConditions?: string[];
    consentVersion?: string;
  }): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getProfile(userId: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) return [];
    return res.json();
  },

  // Chat
  async sendChatMessage(params: {
    message: string;
    sessionId?: string;
    userId: string;
    language: 'en' | 'te' | 'hi' | 'es';
    userProfile?: User;
  }): Promise<{ session: ChatSession; userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(params.userId),
      body: JSON.stringify({
        message: params.message,
        sessionId: params.sessionId,
        language: params.language,
        userProfile: params.userProfile,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Chat guidance failed' }));
      throw new Error(err.error || 'Chat guidance failed');
    }
    return res.json();
  },

  async getChatHistory(userId: string): Promise<ChatSession[]> {
    const res = await fetch(`${BASE_URL}/chat/history`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getChatSession(sessionId: string, userId?: string): Promise<{ session: ChatSession; messages: ChatMessage[] }> {
    const res = await fetch(`${BASE_URL}/chat/${sessionId}`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to retrieve session');
    return res.json();
  },

  async deleteChatSession(sessionId: string, userId?: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/chat/${sessionId}`, {
      method: 'DELETE',
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to delete session');
    return res.json();
  },

  // Resources
  async getResources(params?: { category?: string; search?: string }): Promise<HealthResource[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${BASE_URL}/resources?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  async createResource(data: Partial<HealthResource>): Promise<HealthResource> {
    const res = await fetch(`${BASE_URL}/admin/resources`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create health resource');
    return res.json();
  },

  async deleteResource(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/admin/resources/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete health resource');
    return res.json();
  },

  // Feedback
  async submitFeedback(data: {
    sessionId: string;
    messageId?: string;
    rating: 'helpful' | 'unhelpful';
    clinicalAccuracy?: number;
    feedbackText?: string;
  }): Promise<{ success: boolean; feedback: FeedbackRecord }> {
    const res = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  async getAdminFeedback(): Promise<FeedbackRecord[]> {
    const res = await fetch(`${BASE_URL}/admin/feedback`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminStats(): Promise<SystemStats> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    if (!res.ok) {
      return {
        totalConsultations: 0,
        totalUsers: 0,
        emergencyFlagsCount: 0,
        averageHelpfulness: 98,
        reviewedResourcesCount: 0,
        topSymptoms: [],
      };
    }
    return res.json();
  },

  // Symptom Diary
  async getDiary(userId: string): Promise<SymptomDiaryEntry[]> {
    const res = await fetch(`${BASE_URL}/diary`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async addDiaryEntry(userId: string, data: Partial<SymptomDiaryEntry>): Promise<SymptomDiaryEntry> {
    const res = await fetch(`${BASE_URL}/diary`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create diary entry');
    return res.json();
  },

  async deleteDiaryEntry(id: string, userId?: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/diary/${id}`, {
      method: 'DELETE',
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to delete diary entry');
    return res.json();
  },

  // Privacy & Purge
  async purgeHealthData(userId: string): Promise<{ success: boolean; message: string; purgedSessions: number }> {
    const res = await fetch(`${BASE_URL}/privacy/purge`, {
      method: 'POST',
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to purge data');
    return res.json();
  },
};
