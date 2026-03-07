import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import { Colors, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SORT_OPTIONS = ['Best Match', 'Top Rated', 'Lowest Price'];

export default function MatchedArtisansScreen() {
    const router = useRouter();
    // skill param comes from post-job after a job is created
    const { skill } = useLocalSearchParams<{ skill?: string }>();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortIdx, setSortIdx] = useState(0);

    const load = useCallback(async () => {
        try {
            setError(false);
            // GET /artisans/search?skill=<skill>
            const res = await artisanApi.search({
                skill: skill || 'plumber', // fall back to a common skill
                limit: 20,
            });
            const results = (res.results as any[])
                .map(mapArtisan)
                .filter((a) => a.availability === 'online');
            setArtisans(results);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [skill]);

    useEffect(() => { load(); }, [load]);

    const sorted = [...artisans].sort((a, b) => {
        if (sortIdx === 0) return (b.matchScore || 0) - (a.matchScore || 0);
        if (sortIdx === 1) return b.rating - a.rating;
        return a.priceRange.min - b.priceRange.min;
    });

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Top Matches" showBack onBack={() => router.back()} showNotification={false} />

            <FlatList
                data={sorted}
                ListHeaderComponent={
                    <View>
                        <View style={{ padding: 24, paddingBottom: 0 }}>
                            <Text style={Typography.h2}>Artisans for You</Text>
                            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 4 }]}>
                                {loading
                                    ? 'Finding the best pros...'
                                    : `${artisans.length} pros available right now.`}
                            </Text>
                        </View>
                        <FlatList
                            data={SORT_OPTIONS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, gap: 10 }}
                            keyExtractor={(item) => item}
                            renderItem={({ item, index }) => (
                                <Chip
                                    label={item}
                                    selected={sortIdx === index}
                                    onPress={() => setSortIdx(index)}
                                />
                            )}
                        />
                    </View>
                }
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 100)}
                        style={{ paddingHorizontal: 24 }}
                    >
                        <ArtisanCard
                            artisan={item}
                            horizontal
                            onPress={() =>
                                router.push({ pathname: '/artisan-profile', params: { id: item.id } })
                            }
                        />
                    </Animated.View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListEmptyComponent={
                    loading ? (
                        <View style={{ paddingHorizontal: 24 }}>
                            <SkeletonList count={4} type="artisan" />
                        </View>
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : null
                }
            />
        </View>
    );
}
