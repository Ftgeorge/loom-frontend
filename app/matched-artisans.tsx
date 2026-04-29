import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { Chip } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { LoomThread } from '@/components/ui/LoomThread';
import { artisanApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import { Colors, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SORT_OPTIONS = ['TACTICAL MATCH', 'ELITE RATING', 'MINIMAL COST'];

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
        return a.baseFee - b.baseFee;
    });

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
            <AppHeader title="MATCHED OPERATIVES" showBack onBack={() => router.back()} showNotification={false} />
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Results" showBack onBack={() => router.back()} showNotification={false} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)

            <FlatList
                data={sorted}
                ListHeaderComponent={
<<<<<<< HEAD
                    <View className="mb-8">
                        <View className="px-8 pt-10">
                            <View className="flex-row items-center gap-2 mb-3">
                                <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION QUERY RESULTS</Text>
                            </View>
                            <Text className="text-h1 text-[40px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">ACTIVE NODES</Text>
                            <Text className="text-[15px] text-ink/60 mt-3 normal-case leading-6 font-jakarta-medium italic">
=======
                    <View>
                        <View style={{ padding: 24, paddingBottom: 0 }}>
                            <Text style={Typography.h2}>Ready to help</Text>
                            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 4 }]}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                {loading
                                    ? 'Scanning sector for available professionals...'
                                    : `${artisans.length} elite operatives verified and available for deployment.`}
                            </Text>
                        </View>
<<<<<<< HEAD
                        
                        <View className="mt-8">
                            <FlatList
                                data={SORT_OPTIONS}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 12, gap: 12 }}
                                keyExtractor={(item) => item}
                                renderItem={({ item, index }) => {
                                    const isSelected = sortIdx === index;
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => setSortIdx(index)}
                                            className={`px-6 py-3.5 rounded-full border-[1.5px] shadow-sm active:scale-95 transition-transform ${
                                                isSelected ? 'bg-primary border-primary shadow-primary/20' : 'bg-white border-card-border/50'
                                            }`}
                                        >
                                            <Text className={`text-[10px] uppercase font-jakarta-extrabold italic tracking-widest ${
                                                isSelected ? 'text-white' : 'text-ink'
                                            }`}>{item}</Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    </View>
                }
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 160 }}
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                renderItem={({ item, index }) => (
                    <Animated.View
<<<<<<< HEAD
                        entering={FadeInDown.delay(index * 100).springify()}
                        className="px-8"
=======
                        entering={FadeInDown.delay(index * 100)}
                        style={{ paddingHorizontal: 24 }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
                ItemSeparatorComponent={() => <View className="h-6" />}
                ListEmptyComponent={
                    loading ? (
                        <View className="px-8 pt-10">
=======
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListEmptyComponent={
                    loading ? (
                        <View style={{ paddingHorizontal: 24 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            <SkeletonList count={4} type="artisan" />
                        </View>
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : (
                        <View className="px-12 pt-20 items-center opacity-30">
                            <Text className="text-h3 text-muted text-center uppercase font-jakarta-extrabold italic tracking-tighter">No Operatives Detected</Text>
                            <Text className="text-body text-center mt-3 normal-case font-jakarta-medium italic">Area sector clear of available service professionals.</Text>
                        </View>
                    )
                }
            />
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Sector Discovery Sync • Secure v4.2</Text>
            </View>
        </View>
    );
}
