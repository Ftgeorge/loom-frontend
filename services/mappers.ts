import type { Artisan, ArtisanReview, CategoryId, JobRequest } from "@/types";

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
        priceRange: {
            min: Number(row.price_min ?? 5000),
            max: Number(row.price_max ?? 50000),
        },
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
