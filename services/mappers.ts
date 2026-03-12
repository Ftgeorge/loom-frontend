import type { User, Artisan, ArtisanPortfolioItem, ArtisanReview, CategoryId, JobRequest } from "@/types";

/**
 * Maps backend user row to frontend User shape.
 */
export function mapUser(row: any): User {
    return {
        id: row.id,
        name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || row.email || "User",
        email: row.email,
        phone: row.phone ?? "",
        role: row.role === 'customer' ? 'client' : row.role,
        avatar: row.avatar_url ?? undefined,
        languagePref: row.language_pref ?? 'en',
        interests: row.interests ?? [],
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
export function mapArtisan(row: any): Artisan {
    const id = row.artisan_profile_id ?? row.id ?? row.user_id;
    return {
        id,
        name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || row.name || "Artisan",
        phone: row.phone ?? "",
        avatar: row.avatar_url ?? undefined,
        skills: row.skills ?? [],
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
        pricingStyle: row.pricing_style ?? "estimate",
        reviews: (row.reviews as any[] || []).map(mapReview),
        completedJobs: Number(row.completed_jobs ?? row.jobs_completed ?? 0),
        joinedDate: row.joined_date ?? row.created_at ?? new Date().toISOString().split("T")[0],
        matchScore: row.match_score ? Math.floor(row.match_score) : undefined,
        portfolio: (row.portfolio as any[] || []).map(mapPortfolioItem),
        userId: row.user_id || "",
    };
}

/**
 * Maps backend review row to frontend ArtisanReview shape.
 */
export function mapReview(r: any): ArtisanReview {
    return {
        id: r.id,
        clientName: r.customer_name ?? "Client",
        rating: Number(r.rating ?? 0),
        comment: r.comment ?? "",
        tags: Array.isArray(r.tags) ? r.tags : [],
        createdAt: r.created_at,
    };
}

export function mapPortfolioItem(p: any): ArtisanPortfolioItem {
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
export function mapJob(row: any): JobRequest {
    return {
        id: row.id,
        clientId: row.customer_id,
        clientName: row.customer_email ?? row.customer_name ?? "Client",
        category: (row.title ?? "not_sure") as CategoryId | "not_sure",
        description: row.description,
        budget: Number(row.budget ?? 0),
        urgency: (row.urgency ?? "today") as any,
        location: {
            area: row.location?.split(",")[0]?.trim() ?? row.location ?? "",
            city: row.location?.split(",")[1]?.trim() ?? "",
            state: "",
        },
        status: mapJobStatus(row.status),
        artisanId: row.assigned_artisan_id,
        createdAt: row.created_at,
        completedAt: row.completed_at,
        ratingId: row.rating_id,
        ratingValue: row.rating_value ? Number(row.rating_value) : undefined,
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
