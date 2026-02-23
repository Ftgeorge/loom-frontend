import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { fetchArtisans } from '@/services/mockApi';
import type { Artisan } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

const SORT_OPTIONS = ['Best Match', 'Closest', 'Top Rated', 'Lowest Price'];

export default function MatchedArtisansScreen() {
    const router = useRouter();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortIdx, setSortIdx] = useState(0);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchArtisans();
            const withScores = data
                .filter((a) => a.availability === 'online')
                .map((a) => ({ ...a, matchScore: Math.floor(70 + Math.random() * 30) }));
            setArtisans(withScores);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const sorted = [...artisans].sort((a, b) => {
        if (sortIdx === 0) return (b.matchScore || 0) - (a.matchScore || 0);
        if (sortIdx === 1) return a.distance - b.distance;
        if (sortIdx === 2) return b.rating - a.rating;
        return a.priceRange.min - b.priceRange.min;
    });

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Matched Artisans" showBack onBack={() => router.back()} showNotification={false} />

            <FlatList
                data={sorted}
                ListHeaderComponent={
                    <FlatList
                        data={SORT_OPTIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 8 }}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => (
                            <Chip label={item} selected={sortIdx === index} onPress={() => setSortIdx(index)} />
                        )}
                    />
                }
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <ArtisanCard
                        artisan={item}
                        horizontal
                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListEmptyComponent={
                    loading ? <SkeletonList count={4} /> : error ? <ErrorState onRetry={load} /> : null
                }
            />
        </View>
    );
}
