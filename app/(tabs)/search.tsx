import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { AppTextInput } from '@/components/ui/TextInputs';
import { artisanApi } from '@/services/api';
import { MOCK_ARTISANS } from '@/services/mockApi';
import { Colors, Typography } from '@/theme';
import type { Artisan, CategoryId } from '@/types';
import { CATEGORIES } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Maps backend artisan search results to frontend Artisan shape.
 * The backend returns DB rows; this normalises them.
 */
function normaliseArtisan(row: any): Artisan {
    const id = row.artisan_profile_id ?? row.id ?? row.user_id;
    return {
        id,
        name: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || 'Artisan',
        phone: row.phone ?? '',
        avatar: row.avatar_url ?? undefined,
        skills: row.skills ?? [],
        rating: Number(row.avg_rating ?? 4.5),
        reviewCount: Number(row.ratings_count ?? row.review_count ?? 0),
        verified: Boolean(row.verified),
        distance: Number(row.distance_km ?? 0),
        availability: row.availability ?? 'online',
        priceRange: {
            min: Number(row.price_min ?? 5000),
            max: Number(row.price_max ?? 50000),
        },
        bio: row.bio ?? '',
        location: {
            area: row.area ?? '',
            city: row.city ?? '',
            state: row.state ?? '',
        },
        serviceAreas: row.service_areas ?? [],
        pricingStyle: row.pricing_style ?? 'estimate',
        reviews: [],
        completedJobs: Number(row.completed_jobs ?? 0),
        joinedDate: row.joined_date ?? new Date().toISOString().split('T')[0],
    };
}

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ category?: string }>();
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        params.category && params.category !== 'all' ? params.category : null
    );
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const search = useCallback(async (cat: string | null, q: string) => {
        try {
            setLoading(true);
            setError(false);

            if (cat) {
                // Real backend: GET /artisans/search?skill=<category>
                const res = await artisanApi.search({ skill: cat, limit: 30 });
                const results = (res.results as any[]).map(normaliseArtisan);
                // Client-side filter by free-text query if provided
                const filtered = q
                    ? results.filter(
                        (a) =>
                            a.name.toLowerCase().includes(q.toLowerCase()) ||
                            a.bio.toLowerCase().includes(q.toLowerCase())
                    )
                    : results;
                setArtisans(filtered);
            } else {
                // No category selected — no "list all" endpoint exists.
                // Filter from mock data by free-text query for now.
                const filtered = q
                    ? MOCK_ARTISANS.filter(
                        (a) =>
                            a.name.toLowerCase().includes(q.toLowerCase()) ||
                            a.bio.toLowerCase().includes(q.toLowerCase()) ||
                            a.skills.some((s) => s.toLowerCase().includes(q.toLowerCase()))
                    )
                    : MOCK_ARTISANS;
                setArtisans(filtered as Artisan[]);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce text-query changes
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            search(selectedCategory, query);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [query, selectedCategory, search]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background, paddingTop: insets.top }}>
            <LoomThread variant="minimal" opacity={0.4} />
            <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 }}>
                <Text style={[Typography.h1, { marginBottom: 24 }]}>Explore Pros</Text>
                <AppTextInput
                    placeholder="Search by name, skill or location..."
                    value={query}
                    onChangeText={setQuery}
                    leftIcon={<Ionicons name="search" size={20} color={Colors.muted} />}
                />
            </View>

            <FlatList
                data={artisans}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 24, gap: 16 }}
                ListHeaderComponent={
                    <View style={{ marginBottom: 8 }}>
                        <FlatList
                            data={[{ id: 'all', label: 'All Services' }, ...CATEGORIES]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginHorizontal: -24 }}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 8 }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Chip
                                    label={item.label}
                                    selected={
                                        item.id === 'all' ? !selectedCategory : selectedCategory === item.id
                                    }
                                    onPress={() =>
                                        setSelectedCategory(item.id === 'all' ? null : item.id)
                                    }
                                />
                            )}
                        />

                        {loading ? (
                            <View style={{ marginTop: 24 }}>
                                <SkeletonList count={4} type="artisan" />
                            </View>
                        ) : error ? (
                            <View style={{ marginTop: 24 }}>
                                <ErrorState onRetry={() => search(selectedCategory, query)} />
                            </View>
                        ) : artisans.length === 0 ? (
                            <View style={{ marginTop: 48 }}>
                                <EmptyState
                                    icon="search"
                                    title="No Pros Found"
                                    message={
                                        selectedCategory
                                            ? 'No artisans found for this category yet. Try another.'
                                            : 'Try adjusting your search query.'
                                    }
                                />
                            </View>
                        ) : (
                            <View style={{ marginTop: 16, marginBottom: 8 }}>
                                <Text
                                    style={[
                                        Typography.label,
                                        { fontSize: 10, color: Colors.muted, textTransform: 'none' },
                                    ]}
                                >
                                    Showing {artisans.length} verified{' '}
                                    {artisans.length === 1 ? 'pro' : 'pros'}
                                    {selectedCategory ? ` · ${selectedCategory}` : ''}
                                </Text>
                            </View>
                        )}
                    </View>
                }
                renderItem={({ item, index }) =>
                    loading || error || artisans.length === 0 ? null : (
                        <Animated.View entering={FadeInDown.delay(100 + index * 50)}>
                            <ArtisanCard
                                artisan={item}
                                onPress={() =>
                                    router.push({
                                        pathname: '/artisan-profile',
                                        params: { id: item.id },
                                    })
                                }
                                horizontal
                            />
                        </Animated.View>
                    )
                }
            />
        </View>
    );
}
