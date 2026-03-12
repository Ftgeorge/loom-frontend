import type {
  AppNotification,
  Artisan,
  EarningsSummary,
  JobRequest,
  Language,
  Message,
  MessageThread,
  User,
  UserRole,
} from "@/types";
import type { ThemeMode } from "@/theme";
import { clearToken, saveToken } from "@/services/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Auth Slice ─────────────────────────────────────────
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  hasCompletedOnboarding: boolean;
  hasSelectedRole: boolean;
  /** JWT token for API calls (stored in AsyncStorage, mirrored here) */
  token: string | null;
  isEmailVerified: boolean;
}

// ─── App State ──────────────────────────────────────────
interface AppState extends AuthState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Auth
  signIn: (role: UserRole, userData?: Partial<User>, token?: string) => void;
  signOut: () => void;
  setOnboardingComplete: () => void;
  setRoleSelected: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  setEmailVerified: (verified: boolean) => void;

  // Job Requests
  jobs: JobRequest[];
  setJobs: (jobs: JobRequest[]) => void;
  addJob: (job: JobRequest) => void;
  updateJobStatus: (jobId: string, status: JobRequest["status"]) => void;

  // Artisans
  artisans: Artisan[];
  setArtisans: (artisans: Artisan[]) => void;
  savedArtisans: string[]; // artisan IDs
  toggleSavedArtisan: (id: string) => void;

  // Messages
  threads: MessageThread[];
  setThreads: (threads: MessageThread[]) => void;
  addMessage: (threadId: string, message: Message) => void;

  // Notifications
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Earnings (artisan)
  earnings: EarningsSummary | null;
  setEarnings: (earnings: EarningsSummary) => void;

  // Artisan status
  artisanOnline: boolean;
  setArtisanOnline: (online: boolean) => void;

  // Location
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Theme
  themeMode: ThemeMode | 'system';
  setThemeMode: (mode: ThemeMode | 'system') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      user: null,
      hasCompletedOnboarding: false,
      hasSelectedRole: false,
      token: null,
      isEmailVerified: false,

      // Language
      language: "en",
      setLanguage: (lang) =>
        set((s) => ({
          language: lang,
          user: s.user ? { ...s.user, languagePref: lang } : null,
        })),

      // Auth actions
      signIn: (role, userData, token) => {
        if (token) {
          saveToken(token).catch(console.error);
        }

        const user = { ...(userData as User), role };

        set({
          isAuthenticated: true,
          user,
          hasSelectedRole: true,
          token: token ?? null,
          selectedState: user.location?.state || "Lagos",
          selectedCity: user.location?.city || "Ikeja",
        });
      },

      signOut: () => {
        clearToken().catch(console.error);
        set({
          isAuthenticated: false,
          user: null,
          hasSelectedRole: false,
          token: null,
          isEmailVerified: false,
        });
      },

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),

      setRoleSelected: (role) =>
        set({
          hasSelectedRole: true,
          user: { role } as User,
        }),

      switchRole: (role) =>
        set((s) => ({
          user: s.user ? { ...s.user, role } : null,
        })),

      setEmailVerified: (verified) => set({ isEmailVerified: verified }),

      // Jobs
      jobs: [],
      setJobs: (jobs) => set({ jobs }),
      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      updateJobStatus: (jobId, status) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
        })),

      // Artisans
      artisans: [],
      setArtisans: (artisans) => set({ artisans }),
      savedArtisans: [],
      toggleSavedArtisan: (id) =>
        set((s) => ({
          savedArtisans: s.savedArtisans.includes(id)
            ? s.savedArtisans.filter((a) => a !== id)
            : [...s.savedArtisans, id],
        })),

      // Messages
      threads: [],
      setThreads: (threads) => set({ threads }),
      addMessage: (threadId, message) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                ...t,
                messages: [...t.messages, message],
                lastMessage: message.text,
                lastMessageTime: message.timestamp,
              }
              : t,
          ),
        })),

      // Notifications
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Earnings
      earnings: null,
      setEarnings: (earnings) => set({ earnings }),

      // Artisan online status
      artisanOnline: true,
      setArtisanOnline: (online) => set({ artisanOnline: online }),

      // Location
      selectedState: "Lagos",
      setSelectedState: (state) => set({ selectedState: state }),
      selectedCity: "Ikeja",
      setSelectedCity: (city) => set({ selectedCity: city }),

      // Theme
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "loom-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
