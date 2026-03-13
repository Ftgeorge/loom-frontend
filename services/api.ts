import AsyncStorage from "@react-native-async-storage/async-storage";
import { RawArtisan, RawUser, RawJob, RawEarnings, RawReview, RawPortfolioItem } from "./mappers";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

// ─── Helpers ─────────────────────────────────────────────
async function getAuthHeader(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem("@loom/token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const authHeaders = await getAuthHeader();
    
    // If body is FormData, don't set Content-Type so browser sets it with boundary
    const isFormData = options.body instanceof FormData;
    
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...authHeaders,
            ...(options.headers as Record<string, string>),
        },
        ...options,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(json.error ?? `Request failed: ${response.status}`);
    }

    return json as T;
}

// ─── User API ────────────────────────────────────────────
export const userApi = {
    /** PATCH /users/me — update basic user profile */
    updateProfile: (data: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        email?: string;
        area?: string;
        city?: string;
        state?: string;
        avatar_url?: string;
        interests?: string[];
    }) =>
        apiFetch<RawUser>("/users/me", {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    /** POST /users/me/avatar — upload profile picture */
    uploadAvatar: (uri: string) => {
        const formData = new FormData();
        const filename = uri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("avatar", {
            uri,
            name: filename,
            type,
        } as any);

        return apiFetch<{ avatar_url: string }>("/users/me/avatar", {
            method: "POST",
            body: formData,
        });
    },
};

// ─── Auth API ─────────────────────────────────────────────
export interface AuthUser {
    id: string;
    email: string;
    role: string;
    name?: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export const authApi = {
    register: (data: {
        email: string;
        password: string;
        role: "customer" | "artisan" | "client";
        name?: string;
        phone?: string;
    }) =>
        apiFetch<{ id: string; email: string; role: string }>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        apiFetch<AuthResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    me: () => apiFetch<{ user: AuthUser }>("/auth/me"),

    requestOtp: (email: string) =>
        apiFetch<{ message: string }>("/auth/request-otp", {
            method: "POST",
            body: JSON.stringify({ email }),
        }),

    verifyOtp: (otp: string) =>
        apiFetch<{ message: string }>("/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify({ otp }),
        }),
};

/** Artisan API */
export const artisanApi = {
    /** GET /artisans — browse all artisans (no skill filter) */
    list: (params?: { 
        limit?: number; 
        offset?: number;
        city?: string;
        state?: string;
        area?: string;
        lat?: number;
        lng?: number;
        interests?: string[];
    }) => {
        const qs = new URLSearchParams();
        if (params?.limit) qs.set("limit", String(params.limit));
        if (params?.offset) qs.set("offset", String(params.offset));
        if (params?.city) qs.set("city", params.city);
        if (params?.state) qs.set("state", params.state);
        if (params?.area) qs.set("area", params.area);
        if (params?.lat) qs.set("lat", String(params.lat));
        if (params?.lng) qs.set("lng", String(params.lng));
        if (params?.interests) {
            params.interests.forEach(i => qs.append("interests", i));
        }

        return apiFetch<{ count: number; limit: number; offset: number; results: RawArtisan[] }>(
            `/artisans?${qs}`
        );
    },

    /** GET /artisans/search?skill=plumber */
    search: (params: { 
        skill: string; 
        limit?: number; 
        offset?: number;
        city?: string;
        state?: string;
        area?: string;
        lat?: number;
        lng?: number;
    }) => {
        const qs = new URLSearchParams({
            skill: params.skill,
        });
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.offset) qs.set("offset", String(params.offset));
        if (params.city) qs.set("city", params.city);
        if (params.state) qs.set("state", params.state);
        if (params.area) qs.set("area", params.area);
        if (params.lat) qs.set("lat", String(params.lat));
        if (params.lng) qs.set("lng", String(params.lng));

        return apiFetch<{ total: number; count: number; limit: number; offset: number; results: RawArtisan[] }>(
            `/artisans/search?${qs}`
        );
    },

    /** GET /artisans/:id — get a single artisan by profile ID */
    getById: (id: string) => apiFetch<RawArtisan>(`/artisans/${id}`),

    /** GET /artisans/me/full — logged-in artisan's own full profile */
    meProfile: () => apiFetch<RawArtisan>("/artisans/me/full"),

    /** GET /artisans/me/earnings — my earnings (artisan only) */
    meEarnings: () =>
        apiFetch<RawEarnings>("/artisans/me/earnings"),

    /** POST /artisans/me/profile — create artisan profile for logged in user */
    createProfile: (data: { bio?: string; yearsOfExperience?: number }) =>
        apiFetch<RawArtisan>(`/artisans/me/profile`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** POST /artisans/:id/skills — add skill to artisan */
    addSkill: (artisanProfileId: string, skillName: string) =>
        apiFetch<any>(`/artisans/${artisanProfileId}/skills`, {
            method: "POST",
            body: JSON.stringify({ skillName }),
        }),

    /** PATCH /artisans/me — update logged-in artisan's profile */
    updateProfile: (data: {
        bio?: string;
        city?: string;
        state?: string;
        area?: string;
        pricing_style?: string;
        price_min?: number;
        price_max?: number;
    }) =>
        apiFetch<RawArtisan>("/artisans/me", {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    /** POST /artisans/portfolio — add showcase item */
    addPortfolioItem: (data: {
        imageUrl: string;
        title: string;
        description?: string;
        ratingId?: string;
    }) =>
        apiFetch<{ id: string }>("/artisans/portfolio", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** DELETE /artisans/portfolio/:id */
    deletePortfolioItem: (id: string) =>
        apiFetch<void>(`/artisans/portfolio/${id}`, { method: "DELETE" }),

    /** Verification */
    getVerification: () => apiFetch<{ status: string }>("/artisans/me/verification"),
    submitVerification: (data: { documentType: string; documentNumber?: string; documentUrl: string }) =>
        apiFetch<{ status: string }>("/artisans/me/verification", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** Skill Management */
    getMeSkills: () => apiFetch<{ skill_id: string; name: string }[]>("/artisans/me/skills"),
    removeSkill: (skillId: string) => apiFetch<void>(`/artisans/me/skills/${skillId}`, { method: "DELETE" }),
};

// ─── Job API ─────────────────────────────────────────────
export const jobApi = {
    /** GET /jobs — list jobs (role-aware: customer sees own, artisan sees open+assigned) */
    list: (params?: { status?: string; limit?: number; offset?: number }) => {
        const qs = new URLSearchParams();
        if (params?.status) qs.set("status", params.status);
        qs.set("limit", String(params?.limit ?? 20));
        qs.set("offset", String(params?.offset ?? 0));
        return apiFetch<{ total: number; count: number; results: RawJob[] }>(`/jobs?${qs}`);
    },

    /** GET /jobs/:id — single job with full detail */
    getById: (id: string) => apiFetch<RawJob>(`/jobs/${id}`),

    /** POST /jobs — create a new job request (customer only) */
    create: (data: {
        description: string;
        skill: string;
        budget?: number;
        location?: string;
        urgency?: string;
    }) =>
        apiFetch<{ id: string; status: string }>("/jobs", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** GET /jobs/:jobId/matches?skill=plumber */
    getMatches: (jobId: string, skill: string) =>
        apiFetch<{ results: RawArtisan[] }>(
            `/jobs/${jobId}/matches?skill=${encodeURIComponent(skill)}`
        ),

    /** POST /jobs/:jobId/assign — assign an artisan (customer only) */
    assign: (jobId: string, artisanProfileId: string) =>
        apiFetch<RawJob>(`/jobs/${jobId}/assign`, {
            method: "POST",
            body: JSON.stringify({ artisanProfileId }),
        }),

    /** POST /jobs/:jobId/accept — accept job (artisan only) */
    accept: (jobId: string) =>
        apiFetch<RawJob>(`/jobs/${jobId}/accept`, { method: "POST" }),

    /** POST /jobs/:jobId/complete — mark job done (artisan only) */
    complete: (jobId: string) =>
        apiFetch<RawJob>(`/jobs/${jobId}/complete`, { method: "POST" }),

    /** POST /jobs/:jobId/cancel — cancel job (customer only) */
    cancel: (jobId: string) =>
        apiFetch<RawJob>(`/jobs/${jobId}/cancel`, { method: "POST" }),

    /** POST /jobs/:jobId/rate — submit a rating (customer only) */
    rate: (jobId: string, data: { rating: number; comment?: string }) =>
        apiFetch<unknown>(`/jobs/${jobId}/rate`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
};

// ─── Thread / Messaging API ───────────────────────────────
export const threadApi = {
    /** GET /threads — list all threads for logged-in user */
    list: () => apiFetch<{ count: number; results: any[] }>("/threads"),

    /** GET /threads/:id/messages */
    getMessages: (threadId: string, params?: { limit?: number; offset?: number }) => {
        const qs = new URLSearchParams({
            limit: String(params?.limit ?? 50),
            offset: String(params?.offset ?? 0),
        });
        return apiFetch<{ count: number; results: any[] }>(
            `/threads/${threadId}/messages?${qs}`
        );
    },

    /** POST /threads — open or get existing thread */
    create: (data: { artisanProfileId: string; jobRequestId?: string }) =>
        apiFetch<{ id: string }>("/threads", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** POST /threads/:id/messages — send a message */
    sendMessage: (threadId: string, text: string) =>
        apiFetch<{ id: string; sent_at: string }>(`/threads/${threadId}/messages`, {
            method: "POST",
            body: JSON.stringify({ text }),
        }),
};

// ─── Notification API ─────────────────────────────────────
export const notificationApi = {
    /** GET /notifications */
    list: (params?: { limit?: number; offset?: number }) => {
        const qs = new URLSearchParams({
            limit: String(params?.limit ?? 30),
            offset: String(params?.offset ?? 0),
        });
        return apiFetch<{ count: number; unread: number; results: any[] }>(
            `/notifications?${qs}`
        );
    },

    /** PATCH /notifications/:id/read */
    markRead: (id: string) =>
        apiFetch<{ id: string; read: boolean }>(`/notifications/${id}/read`, {
            method: "PATCH",
        }),

    /** PATCH /notifications/read-all */
    markAllRead: () =>
        apiFetch<{ message: string }>("/notifications/read-all", { method: "PATCH" }),
};

// ─── Skills API ───────────────────────────────────────────
export const skillApi = {
    /** GET /skills — list all available skill categories */
    list: () => apiFetch<{ id: string; name: string }[]>("/skills"),
};

// ─── Token helpers (used by store) ───────────────────────
export async function saveToken(token: string) {
    await AsyncStorage.setItem("@loom/token", token);
}

export async function clearToken() {
    await AsyncStorage.removeItem("@loom/token");
}

export async function getStoredToken(): Promise<string | null> {
    return AsyncStorage.getItem("@loom/token");
}
