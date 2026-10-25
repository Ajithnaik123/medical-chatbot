import { create } from 'zustand';
import { User, ChatSession, ChatMessage, HealthResource, SymptomDiaryEntry, FeedbackRecord } from '../types';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { initialUsers } from '../data/initialData';

export type PageRoute =
  | 'home'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'chat'
  | 'history'
  | 'diary'
  | 'resources'
  | 'privacy'
  | 'admin'
  | 'profile';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface StoreState {
  // Navigation
  currentPage: PageRoute;
  setPage: (page: PageRoute, params?: { sessionId?: string; symptomPrompt?: string }) => void;

  // User & Profile
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchDemoUser: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;

  // Language & Accessibility
  language: 'en' | 'te' | 'hi' | 'es';
  setLanguage: (lang: 'en' | 'te' | 'hi' | 'es') => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;

  // Chatbot State
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  activeMessages: ChatMessage[];
  isLoadingChat: boolean;
  draftSymptom: string;
  setDraftSymptom: (val: string) => void;
  startNewChat: (initialPrompt?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  sendChatMessage: (content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Chat History
  chatHistory: ChatSession[];
  loadChatHistory: () => Promise<void>;

  // Resources
  resources: HealthResource[];
  selectedCategory: string;
  searchQuery: string;
  loadResources: (params?: { category?: string; search?: string }) => Promise<void>;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;

  // Symptom Diary
  diaryEntries: SymptomDiaryEntry[];
  loadDiary: () => Promise<void>;
  addDiaryEntry: (entry: Partial<SymptomDiaryEntry>) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;

  // Feedback
  submitFeedback: (data: {
    sessionId: string;
    messageId?: string;
    rating: 'helpful' | 'unhelpful';
    clinicalAccuracy?: number;
    feedbackText?: string;
  }) => Promise<void>;

  // Data Purge
  purgeUserData: () => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => {
  const initialUser = typeof window !== 'undefined' ? storage.getCurrentUser() : initialUsers[0];
  const initialLang = typeof window !== 'undefined' ? storage.getLanguage() : 'en';
  const initialTts = typeof window !== 'undefined' ? storage.isTtsEnabled() : false;

  return {
    currentPage: 'home',
    setPage: (page, params) => {
      set({ currentPage: page });
      if (params?.sessionId) {
        get().loadSession(params.sessionId);
      }
      if (params?.symptomPrompt) {
        set({ draftSymptom: params.symptomPrompt });
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    currentUser: initialUser,
    setCurrentUser: (user) => {
      storage.setCurrentUser(user);
      set({ currentUser: user });
    },

    switchDemoUser: (userId) => {
      const target = initialUsers.find((u) => u.id === userId) || initialUsers[0];
      storage.setCurrentUser(target);
      set({ currentUser: target });
      get().addToast(`Switched active profile to ${target.name} (${target.age} yrs - ${target.ageGroup})`, 'info');
      // Refresh user specific history
      get().loadChatHistory();
      get().loadDiary();
    },

    updateUserProfile: async (data) => {
      const user = get().currentUser;
      if (!user) return;
      try {
        const updated = await api.updateProfile(user.id, data);
        get().setCurrentUser(updated);
        get().addToast('Health profile successfully updated', 'success');
      } catch (err: any) {
        get().addToast(err.message || 'Failed to update profile', 'error');
      }
    },

    logout: () => {
      storage.setCurrentUser(null);
      set({
        currentUser: null,
        activeSessionId: null,
        activeSession: null,
        activeMessages: [],
        currentPage: 'home',
      });
      get().addToast('Signed out successfully', 'info');
    },

    language: initialLang,
    setLanguage: (lang) => {
      storage.setLanguage(lang);
      set({ language: lang });
      get().addToast(`Language updated to ${lang.toUpperCase()}`, 'info');
    },

    ttsEnabled: initialTts,
    setTtsEnabled: (enabled) => {
      storage.setTtsEnabled(enabled);
      set({ ttsEnabled: enabled });
      if (!enabled) get().stopSpeaking();
    },

    isSpeaking: false,
    speakText: (text) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        get().addToast('Text-to-speech is not supported on this device/browser', 'warning');
        return;
      }
      window.speechSynthesis.cancel();
      // Clean markdown or html symbols
      const clean = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      const lang = get().language;
      utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.95;

      utterance.onstart = () => set({ isSpeaking: true });
      utterance.onend = () => set({ isSpeaking: false });
      utterance.onerror = () => set({ isSpeaking: false });

      window.speechSynthesis.speak(utterance);
    },

    stopSpeaking: () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      set({ isSpeaking: false });
    },

    activeSessionId: null,
    activeSession: null,
    activeMessages: [],
    isLoadingChat: false,
    draftSymptom: '',
    setDraftSymptom: (val) => set({ draftSymptom: val }),

    startNewChat: async (initialPrompt) => {
      const user = get().currentUser || initialUsers[0];
      const newSessionId = `session_${Date.now()}`;
      set({
        activeSessionId: newSessionId,
        activeSession: {
          id: newSessionId,
          userId: user.id,
          title: initialPrompt ? initialPrompt.slice(0, 40) : 'New Health Consultation',
          symptomSummary: initialPrompt || '',
          language: get().language,
          messageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        activeMessages: [],
        currentPage: 'chat',
      });

      if (initialPrompt) {
        await get().sendChatMessage(initialPrompt);
      }
    },

    loadSession: async (sessionId) => {
      set({ isLoadingChat: true });
      try {
        const data = await api.getChatSession(sessionId, get().currentUser?.id);
        set({
          activeSessionId: data.session.id,
          activeSession: data.session,
          activeMessages: data.messages,
          currentPage: 'chat',
        });
      } catch (err: any) {
        get().addToast('Could not load session', 'error');
      } finally {
        set({ isLoadingChat: false });
      }
    },

    sendChatMessage: async (content) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const user = get().currentUser || initialUsers[0];
      const sessionId = get().activeSessionId || `session_${Date.now()}`;

      // Optimistic user message append
      const tempUserMsg: ChatMessage = {
        id: `msg_user_${Date.now()}`,
        sessionId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        activeMessages: [...state.activeMessages, tempUserMsg],
        isLoadingChat: true,
        activeSessionId: sessionId,
      }));

      try {
        const response = await api.sendChatMessage({
          message: trimmed,
          sessionId,
          userId: user.id,
          language: get().language,
          userProfile: user,
        });

        set((state) => {
          // Replace temp with verified messages
          const filtered = state.activeMessages.filter((m) => m.id !== tempUserMsg.id);
          return {
            activeSession: response.session,
            activeSessionId: response.session.id,
            activeMessages: [...filtered, response.userMessage, response.assistantMessage],
          };
        });

        // If TTS enabled, automatically speak summary
        if (get().ttsEnabled && response.assistantMessage.structuredData?.summary) {
          get().speakText(response.assistantMessage.structuredData.summary);
        }

        // Refresh history in background
        get().loadChatHistory();
      } catch (err: any) {
        get().addToast(err.message || 'Error communicating with MediCare AI', 'error');
      } finally {
        set({ isLoadingChat: false });
      }
    },

    deleteSession: async (sessionId) => {
      try {
        await api.deleteChatSession(sessionId, get().currentUser?.id);
        set((state) => ({
          chatHistory: state.chatHistory.filter((s) => s.id !== sessionId),
          ...(state.activeSessionId === sessionId
            ? { activeSessionId: null, activeSession: null, activeMessages: [] }
            : {}),
        }));
        get().addToast('Conversation deleted permanently', 'info');
      } catch (err: any) {
        get().addToast('Failed to delete conversation', 'error');
      }
    },

    chatHistory: [],
    loadChatHistory: async () => {
      const user = get().currentUser;
      if (!user) return;
      try {
        const history = await api.getChatHistory(user.id);
        set({ chatHistory: history });
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    },

    resources: [],
    selectedCategory: 'all',
    searchQuery: '',
    loadResources: async (params) => {
      try {
        const list = await api.getResources(params);
        set({ resources: list });
      } catch (err) {
        console.error('Failed to load health resources:', err);
      }
    },
    setSelectedCategory: (cat) => {
      set({ selectedCategory: cat });
      get().loadResources({ category: cat, search: get().searchQuery });
    },
    setSearchQuery: (query) => {
      set({ searchQuery: query });
      get().loadResources({ category: get().selectedCategory, search: query });
    },

    diaryEntries: [],
    loadDiary: async () => {
      const user = get().currentUser;
      if (!user) return;
      try {
        const diary = await api.getDiary(user.id);
        set({ diaryEntries: diary });
      } catch (err) {
        console.error('Failed to load diary:', err);
      }
    },

    addDiaryEntry: async (entry) => {
      const user = get().currentUser;
      if (!user) return;
      try {
        const created = await api.addDiaryEntry(user.id, entry);
        set((state) => ({ diaryEntries: [created, ...state.diaryEntries] }));
        get().addToast('Symptom entry saved to diary', 'success');
      } catch (err: any) {
        get().addToast(err.message || 'Failed to save diary entry', 'error');
      }
    },

    deleteDiaryEntry: async (id) => {
      try {
        await api.deleteDiaryEntry(id, get().currentUser?.id);
        set((state) => ({ diaryEntries: state.diaryEntries.filter((d) => d.id !== id) }));
        get().addToast('Entry removed from symptom diary', 'info');
      } catch (err: any) {
        get().addToast('Failed to delete entry', 'error');
      }
    },

    submitFeedback: async (data) => {
      try {
        await api.submitFeedback(data);
        get().addToast('Thank you for your clinical feedback!', 'success');
      } catch (err: any) {
        get().addToast('Could not record feedback', 'error');
      }
    },

    purgeUserData: async () => {
      const user = get().currentUser;
      if (!user) return;
      try {
        const res = await api.purgeHealthData(user.id);
        set({
          chatHistory: [],
          activeSessionId: null,
          activeSession: null,
          activeMessages: [],
          diaryEntries: [],
        });
        get().addToast(res.message, 'success');
      } catch (err: any) {
        get().addToast('Failed to purge data', 'error');
      }
    },

    toasts: [],
    addToast: (message, type = 'success') => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      set((state) => ({
        toasts: [...state.toasts.slice(-3), { id, message, type }],
      }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },
  };
});
