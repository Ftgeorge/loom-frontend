import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import type { Artisan } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SORT_OPTIONS = ['Best for you', 'Best ratings', 'Lowest cost'];

export default function MatchedArtisansScreen() {
    const router = useRouter();
    const { skill } = useLocalSearchParams<{ skill?: string }>();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortIdx, setSortIdx] = useState(0);

    const load = useCallback(async () => {
        try {
            setError(false);
            const res = await artisanApi.search({
                skill: skill || 'plumber',
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
        return a.baseFee - b.baseFee;
    });

    return (
        <View className="flex-1 bg-background">
            <AppHeader title="Results" showBack onBack={() => router.back()} showNotification={false} />

            <FlatList
                data={sorted}
                ListHeaderComponent={
                    <View>
                        <View className="px-6 pt-6">
                            <Text className="text-h2 uppercase">Ready to help</Text>
                            <Text className="text-body-sm text-muted mt-1 normal-case leading-5">
                                {loading
                                    ? 'Searching...'
                                    : `${artisans.length} pros ready now.`}
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
                                    label={item.toUpperCase()}
                                    selected={sortIdx === index}
                                    onPress={() => setSortIdx(index)}
                                    className="px-6 py-3 rounded-full"
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
                        className="px-6"
                    >
                        <ArtisanCard
                            artisan={item}
                            list
                            onPress={() =>
                                router.push({ pathname: '/artisan-profile', params: { id: item.id } })
                            }
                        />
                    </Animated.View>
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListEmptyComponent={
                    loading ? (
                        <View className="px-6">
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

