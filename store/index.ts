import type {
    AppNotification,
    Artisan,
    EarningsSummary,
    JobRequest,
    Language,
    Message,
    MessageThread,
    User,
    UserRole
} from '@/types';
import { create } from 'zustand';

// ─── Auth Slice ─────────────────────────────────────────
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    hasCompletedOnboarding: boolean;
    hasSelectedRole: boolean;
}

// ─── App State ──────────────────────────────────────────
interface AppState extends AuthState {
    // Language
    language: Language;
    setLanguage: (lang: Language) => void;

    // Auth
    signIn: (role: UserRole) => void;
    signOut: () => void;
    setOnboardingComplete: () => void;
    setRoleSelected: (role: UserRole) => void;
    switchRole: (role: UserRole) => void;

    // Job Requests
    jobs: JobRequest[];
    setJobs: (jobs: JobRequest[]) => void;
    addJob: (job: JobRequest) => void;
    updateJobStatus: (jobId: string, status: JobRequest['status']) => void;

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
    selectedCity: string;
    setSelectedCity: (city: string) => void;
}

const defaultUser: User = {
    id: 'u1',
    name: 'George',
    phone: '+2348012345678',
    email: 'george@operis.ng',
    role: 'client',
    languagePref: 'en',
    location: { area: 'Wuse 2', city: 'Abuja', state: 'FCT' },
    createdAt: '2026-01-15T10:00:00Z',
};

export const useAppStore = create<AppState>((set, get) => ({
    // Auth
    isAuthenticated: false,
    user: null,
    hasCompletedOnboarding: false,
    hasSelectedRole: false,

    // Language
    language: 'en',
    setLanguage: (lang) =>
        set((s) => ({
            language: lang,
            user: s.user ? { ...s.user, languagePref: lang } : null,
        })),

    // Auth actions
    signIn: (role) =>
        set({
            isAuthenticated: true,
            user: { ...defaultUser, role },
            hasSelectedRole: true,
        }),
    signOut: () =>
        set({
            isAuthenticated: false,
            user: null,
            hasSelectedRole: false,
        }),
    setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
    setRoleSelected: (role) =>
        set({
            hasSelectedRole: true,
            user: { ...defaultUser, role },
        }),
    switchRole: (role) =>
        set((s) => ({
            user: s.user ? { ...s.user, role } : null,
        })),

    // Jobs
    jobs: [],
    setJobs: (jobs) => set({ jobs }),
    addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
    updateJobStatus: (jobId, status) =>
        set((s) => ({
            jobs: s.jobs.map((j) =>
                j.id === jobId ? { ...j, status } : j
            ),
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
                    : t
            ),
        })),

    // Notifications
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    markNotificationRead: (id) =>
        set((s) => ({
            notifications: s.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
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
    selectedCity: 'Abuja',
    setSelectedCity: (city) => set({ selectedCity: city }),
}));
