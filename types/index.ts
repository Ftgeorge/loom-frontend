// ─── Core Enums ─────────────────────────────────────────
export type UserRole = 'client' | 'artisan';
export type Language = 'en' | 'pidgin' | 'yoruba';

export type JobStatus =
    | 'draft'
    | 'submitted'
    | 'matched'
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export type ArtisanJobStatus =
    | 'new'
    | 'accepted'
    | 'on_the_way'
    | 'in_progress'
    | 'completed'
    | 'declined';

export type Urgency = 'now' | 'today' | 'this_week';

export type PricingStyle = 'fixed' | 'estimate' | 'hourly';

export type NotificationType =
    | 'job_update'
    | 'message'
    | 'booking'
    | 'review'
    | 'system';

// ─── Categories ─────────────────────────────────────────
export const CATEGORIES = [
    { id: 'plumber', label: 'Plumber', icon: 'construct-outline' },
    { id: 'electrician', label: 'Electrician', icon: 'flash-outline' },
    { id: 'carpenter', label: 'Carpenter', icon: 'hammer-outline' },
    { id: 'tailor', label: 'Tailor', icon: 'cut-outline' },
    { id: 'mechanic', label: 'Mechanic', icon: 'settings-outline' },
    { id: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline' },
    { id: 'hair_beauty', label: 'Hair / Beauty', icon: 'heart-outline' },
    { id: 'ac_repair', label: 'AC Repair', icon: 'snow-outline' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

// ─── Location ───────────────────────────────────────────
export interface Location {
    area: string;
    city: string;
    state: string;
    lat?: number;
    lng?: number;
}

// ─── User ───────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: UserRole;
    languagePref: Language;
    avatar?: string;
    location: Location;
    createdAt: string;
}

// ─── Artisan ────────────────────────────────────────────
export interface ArtisanReview {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    tags: string[];
    createdAt: string;
}

export interface Artisan {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    skills: CategoryId[];
    rating: number;
    reviewCount: number;
    verified: boolean;
    distance: number; // km
    availability: 'online' | 'offline' | 'busy';
    priceRange: { min: number; max: number };
    bio: string;
    location: Location;
    serviceAreas: string[];
    pricingStyle: PricingStyle;
    reviews: ArtisanReview[];
    matchScore?: number;
    completedJobs: number;
    joinedDate: string;
}

// ─── Job Request ────────────────────────────────────────
export interface JobRequest {
    id: string;
    clientId: string;
    clientName: string;
    category: CategoryId | 'not_sure';
    description: string;
    budget: number;
    urgency: Urgency;
    location: Location;
    status: JobStatus;
    artisanStatus?: ArtisanJobStatus;
    artisanId?: string;
    artisanName?: string;
    images?: string[];
    createdAt: string;
    scheduledDate?: string;
    scheduledTime?: string;
    completedAt?: string;
}

// ─── Messages ───────────────────────────────────────────
export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    text: string;
    timestamp: string;
    read: boolean;
}

export interface MessageThread {
    id: string;
    participantName: string;
    participantAvatar?: string;
    participantRole: UserRole;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}

// ─── Notifications ──────────────────────────────────────
export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    read: boolean;
    createdAt: string;
    actionRoute?: string;
}

// ─── Earnings ───────────────────────────────────────────
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
    status: 'completed' | 'pending';
}

export interface EarningsSummary {
    totalEarnings: number;
    thisWeek: number;
    thisMonth: number;
    pendingPayments: number;
    weeklyData: { day: string; amount: number }[];
    transactions: Transaction[];
}

// ─── Availability Schedule ──────────────────────────────
export interface TimeSlot {
    start: string; // "09:00"
    end: string; // "17:00"
}

export interface AvailabilitySchedule {
    [day: string]: { available: boolean; slots: TimeSlot[] };
}
