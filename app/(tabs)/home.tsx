import { mapArtisan } from '@/services/mappers';
import { AppHeader } from '@/components/AppHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SkeletonHorizontalList, SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { ActiveJobBanner } from '@/components/home/ActiveJobBanner';
import { CategoryPill } from '@/components/home/CategoryPill';
import { NLSearchBar } from '@/components/home/NLSearchBar';
import { PostJobCTA } from '@/components/home/PostJobCTA';
import { SectionHeader } from '@/components/home/SectionHeader';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
} from 'react-native-reanimated';

export default function ClientHomeScreen() {
    const router = useRouter();
    const { user, jobs } = useAppStore();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const res = await artisanApi.list({ limit: 30 });
            setArtisans((res.results as any[]).map(mapArtisan));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = () => { setRefreshing(true); load(); };

    const topRated = React.useMemo(() =>
        artisans
            .filter(a => a.availability === 'online')
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8),
        [artisans]
    );

    const activeJobs = React.useMemo(() =>
        jobs.filter(j => ['matched', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 1),
        [jobs]
    );

    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
            <AppHeader showLocation showNotification onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Greeting ──────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(80).springify()} style={{ marginBottom: 32 }}>
                    <Text style={[Typography.label, { color: Colors.violet, marginBottom: 6 }]}>
                        WELCOME BACK
                    </Text>
                    <Text style={[Typography.display, { fontSize: 34, letterSpacing: -0.8 }]}>
                        Hello, {firstName}
                    </Text>
                    <Text style={[Typography.body, { marginTop: 6 }]}>
                        What can we help you with today?
                    </Text>
                </Animated.View>

                {/* ─── Active Job Banner ─────────────────────────────────────── */}
                {activeJobs.length > 0 && (
                    <ActiveJobBanner
                        job={activeJobs[0]}
                        onPress={() => router.push({ pathname: '/request-details', params: { id: activeJobs[0].id } })}
                    />
                )}

                {/* ─── Natural Language Search ───────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(160).springify()}>
                    <NLSearchBar onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })} />
                </Animated.View>

                {/* ─── Categories ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(220).springify()} style={{ marginBottom: 48 }}>
                    <SectionHeader
                        overline="Categories"
                        title="What type of service?"
                        action="See all"
                        onAction={() => router.push('/search')}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -24 }}
                        contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingBottom: 4 }}
                    >
                        {CATEGORIES.map((cat) => (
                            <CategoryPill
                                key={cat.id}
                                cat={cat}
                                onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* ─── Top Professionals ─────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 48 }}>
                    <SectionHeader
                        overline="Top professionals"
                        title="Highest Rated Near You"
                        action="View all"
                        onAction={() => router.push('/search')}
                    />

                    {loading ? (
                        <SkeletonHorizontalList count={3} />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : (
                        <FlatList
                            data={topRated}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginHorizontal: -24 }}
                            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                            keyExtractor={item => item.id}
                            initialNumToRender={4}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={FadeInRight.delay(340 + index * 80).springify()}>
                                    <ArtisanCard
                                        artisan={item}
                                        featured={index === 0}
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: item.id } })}
                                    />
                                </Animated.View>
                            )}
                        />
                    )}
                </Animated.View>

                {/* ─── Post a Job CTA ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(380).springify()}>
                    <PostJobCTA onPress={() => router.push('/post-job')} />
                </Animated.View>

                {/* ─── Nearby Professionals ──────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(440).springify()}>
                    <SectionHeader overline="Nearby" title="Available Professionals" />
                    {loading ? (
                        <SkeletonList count={3} />
                    ) : (
                        <View style={{ gap: 12 }}>
                            {artisans.slice(0, 5).map((art, index) => (
                                <Animated.View key={art.id} entering={FadeInDown.delay(480 + index * 80).springify()}>
                                    <ArtisanCard
                                        artisan={art}
                                        horizontal
                                        onPress={() => router.push({ pathname: '/artisan-profile', params: { id: art.id } })}
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
