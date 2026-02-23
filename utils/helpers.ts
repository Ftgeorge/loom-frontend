import { z } from 'zod';

// ─── Schemas ────────────────────────────────────────────
export const SignUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(11, 'Enter a valid phone number').regex(/^\+?[0-9]+$/, 'Invalid phone format'),
    email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInSchema = z.object({
    phone: z.string().min(11, 'Enter a valid phone number'),
    password: z.string().min(1, 'Password is required'),
});

export const JobRequestSchema = z.object({
    category: z.string().min(1, 'Select a category'),
    description: z.string().min(10, 'Describe your issue (at least 10 characters)'),
    budget: z.number().min(1000, 'Minimum budget is ₦1,000'),
    urgency: z.enum(['now', 'today', 'this_week']),
    address: z.string().min(3, 'Enter your address'),
});

export const ReviewSchema = z.object({
    rating: z.number().min(1, 'Select a rating').max(5),
    comment: z.string().optional(),
});

// ─── Error mapper ───────────────────────────────────────
export function mapZodErrors(error: z.ZodError<unknown>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const e of error.issues) {
        const path = e.path.join('.');
        if (!errors[path]) errors[path] = e.message;
    }
    return errors;
}

// ─── Helpers ────────────────────────────────────────────
export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
}

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
