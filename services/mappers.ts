import type { 
    User, 
    Artisan, 
    ArtisanPortfolioItem, 
    ArtisanReview, 
    CategoryId, 
    JobRequest, 
    Urgency, 
    EarningsSummary 
} from "@/types";

/**
 * Interface representing the raw user data from backend
 */
export interface RawUser {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    role: string;
    avatar_url?: string;
    language_pref?: string;
    interests?: string[];
    city?: string;
    state?: string;
    area?: string;
    lat?: string | number;
    lng?: string | number;
    created_at?: string;
}

/**
 * Interface representing raw artisan data from backend
 */
export interface RawArtisan extends RawUser {
    artisan_profile_id?: string;
    user_id: string;
    name?: string;
    skills?: string[];
    avg_rating?: string | number;
    ratings_count?: string | number;
    review_count?: string | number;
    verified?: boolean | number;
    distance_km?: string | number;
    availability?: 'online' | 'offline' | 'busy';
    base_fee?: string | number;
    price_per_hour?: string | number;
    bio?: string;
    service_areas?: string[];
    pricing_style?: 'fixed' | 'estimate' | 'hourly';
    reviews?: any[]; 
    portfolio?: any[]; 
    completed_jobs?: string | number;
    jobs_completed?: string | number;
    joined_date?: string;
    match_score?: number;
}

export interface RawReview {
    id: string;
    customer_name?: string;
    rating?: string | number;
    comment?: string;
    tags?: string[];
    created_at: string;
}

export interface RawPortfolioItem {
    id: string;
    image_url?: string;
    title?: string;
    description?: string;
    created_at: string;
    rating?: string | number;
    comment?: string;
    customer_name?: string;
}

export interface RawJob {
    id: string;
    customer_id: string;
    customer_first_name?: string;
    customer_last_name?: string;
    customer_email?: string;
    title?: string;
    description: string;
    budget?: string | number;
    urgency?: string;
    location?: string;
    status: string;
    payment_status?: string;
    assigned_artisan_id?: string;
    artisan_first_name?: string;
    artisan_last_name?: string;
    created_at: string;
    completed_at?: string;
    rating_id?: string;
    rating_value?: string | number;
}

export interface RawEarnings {
    artisan_profile_id: string;
    total_earned: string | number;
    jobs_completed: number;
    pending_payout: string | number;
    total_withdrawn: string | number;
    transactions: any[];
}

/**
 * Maps backend user row to frontend User shape.
 */
export function mapUser(row: RawUser): User {
    return {
        id: row.id,
        name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || row.email || "User",
        email: row.email,
        phone: row.phone ?? "",
        role: (row.role === 'customer' ? 'client' : row.role) as User['role'],
        avatar: row.avatar_url ?? undefined,
        languagePref: (row.language_pref ?? 'en') as User['languagePref'],
        interests: (row.interests ?? []) as CategoryId[],
        location: (row.city || row.state || row.area) ? {
            city: row.city ?? "",
            state: row.state ?? "",
            area: row.area ?? "",
            lat: row.lat ? Number(row.lat) : undefined,
            lng: row.lng ? Number(row.lng) : undefined,
        } : undefined,
        createdAt: row.created_at || new Date().toISOString(),
    };
}

/**
 * Maps backend artisan profile row to frontend Artisan shape.
 */
export function mapArtisan(row: RawArtisan): Artisan {
    const id = row.artisan_profile_id ?? row.id ?? row.user_id;
    return {
        id,
        name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || row.name || "Artisan",
        phone: row.phone ?? "",
        avatar: row.avatar_url ?? undefined,
        skills: (row.skills ?? []) as CategoryId[],
        rating: Number(row.avg_rating ?? 0),
        reviewCount: Number(row.ratings_count ?? row.review_count ?? 0),
        verified: Boolean(row.verified),
        distance: Number(row.distance_km ?? 0),
        availability: row.availability ?? "online",
        baseFee: Number(row.base_fee ?? 5000),
        pricePerHour: row.price_per_hour ? Number(row.price_per_hour) : undefined,
        bio: row.bio ?? "",
        location: {
            area: row.area ?? "",
            city: row.city ?? "",
            state: row.state ?? "",
        },
        serviceAreas: row.service_areas ?? [],
        pricingStyle: (row.pricing_style ?? "estimate") as Artisan['pricingStyle'],
        reviews: (row.reviews ?? []).map(mapReview),
        completedJobs: Number(row.completed_jobs ?? row.jobs_completed ?? 0),
        joinedDate: row.joined_date ?? row.created_at ?? new Date().toISOString().split("T")[0],
        matchScore: row.match_score ? Math.floor(row.match_score) : undefined,
        portfolio: (row.portfolio ?? []).map(mapPortfolioItem),
        userId: row.user_id || "",
    };
}

/**
 * Maps backend review row to frontend ArtisanReview shape.
 */
export function mapReview(r: RawReview): ArtisanReview {
    return {
        id: r.id,
        clientName: r.customer_name ?? "Client",
        rating: Number(r.rating ?? 0),
        comment: r.comment ?? "",
        tags: Array.isArray(r.tags) ? r.tags : [],
        createdAt: r.created_at,
    };
}

export function mapPortfolioItem(p: RawPortfolioItem): ArtisanPortfolioItem {
    return {
        id: p.id,
        imageUrl: p.image_url || "",
        title: p.title || "",
        description: p.description || "",
        createdAt: p.created_at,
        rating: p.rating ? Number(p.rating) : undefined,
        comment: p.comment || undefined,
        customerName: p.customer_name || undefined,
    };
}

/**
 * Maps backend job row to frontend JobRequest shape.
 */
export function mapJob(row: RawJob): JobRequest {
    return {
        id: row.id,
        clientId: row.customer_id,
        clientName: `${row.customer_first_name ?? ""} ${row.customer_last_name ?? ""}`.trim() || row.customer_email || "Client",
        category: (row.title ?? "not_sure") as CategoryId | "not_sure",
        description: row.description,
        budget: Number(row.budget ?? 0),
        urgency: (row.urgency ?? "today") as Urgency,
        location: {
            area: row.location?.split(",")[0]?.trim() ?? row.location ?? "",
            city: row.location?.split(",")[1]?.trim() ?? "",
            state: "",
        },
        status: mapJobStatus(row.status),
        artisanId: row.assigned_artisan_id,
        artisanName: row.artisan_first_name ? `${row.artisan_first_name} ${row.artisan_last_name ?? ""}`.trim() : undefined,
        createdAt: row.created_at,
        completedAt: row.completed_at,
        paymentStatus: (row.payment_status || 'unpaid') as any,
        ratingId: row.rating_id,
        ratingValue: row.rating_value ? Number(row.rating_value) : undefined,
    };
}

export function mapEarnings(row: RawEarnings): EarningsSummary {
    return {
        totalEarnings: Number(row.total_earned ?? 0),
        thisWeek: 0,
        thisMonth: 0,
        pendingPayments: Number(row.pending_payout ?? 0),
        weeklyData: [],
        transactions: (row.transactions ?? []).map((t: any) => ({
            id: t.id,
            description: t.description || "Transaction",
            amount: Number(t.amount || 0),
            date: t.created_at || new Date().toISOString(),
            type: t.type || 'credit',
            status: t.status || 'completed'
        }))
    };
}

function mapJobStatus(status: string): JobRequest["status"] {
    switch (status) {
        case "open": return "submitted";
        case "assigned": return "matched";
        case "completed": return "completed";
        case "cancelled": return "cancelled";
        default: return "submitted";
    }
}
