import { mapArtisan } from '@/services/mappers';
import { SubAppHeader } from '@/components/AppSubHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { Ionicons } from '@expo/vector-icons';
import { ActiveJobBanner } from '@/components/home/ActiveJobBanner';
import { CategoryPill } from '@/components/home/CategoryPill';
import { PostJobCTA } from '@/components/home/PostJobCTA';
import { SectionHeader } from '@/components/home/SectionHeader';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
} from 'react-native-reanimated';
import LayoutSwitch from '@/components/ui/LayoutSwitch';
import { LoomThread } from '@/components/ui/LoomThread';
import { EmptyState } from '@/components/ui/StateComponents';

export default function ClientHomeScreen() {
    const router = useRouter();
    const { user, jobs, selectedState, selectedCity } = useAppStore();
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

    const load = useCallback(async () => {
        try {
            setError(false);
            const res = await artisanApi.list({ 
                limit: 30,
                city: selectedCity,
                state: selectedState,
                area: user?.location?.area,
                interests: user?.interests
            });
            setArtisans((res.results as any[]).map(mapArtisan));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedState, selectedCity, user?.interests, user?.location?.area]);

    useEffect(() => { load(); }, [load]);
    const onRefresh = () => { setRefreshing(true); load(); };

    const activeJobs = React.useMemo(() =>
        jobs.filter(j => ['matched', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 1),
        [jobs]
    );

    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                showLocation
                label="WELCOME BACK"
                title={`Hello, ${firstName}`}
                description="What can we help you with today?"
                onNotification={() => router.push('/notifications')}
                notifPlacement="top"
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Greeting Removed (Now in Header) ───────────────────────── */}

                {/* ─── Active Job Banner ─────────────────────────────────────── */}
                {activeJobs.length > 0 && (
                    <ActiveJobBanner
                        job={activeJobs[0]}
                        onPress={() => router.push({ pathname: '/request-details', params: { id: activeJobs[0].id } })}
                    />
                )}

                {/* ─── Natural Language Search ───────────────────────────────── */}
                {/* <Animated.View entering={FadeInDown.delay(160).springify()}>
                    <NLSearchBar onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })} />
                </Animated.View> */}

                {/* ─── Post a Job CTA ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(380).springify()}>
                    <PostJobCTA onPress={() => router.push('/post-job')} />
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
                {/* <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 48 }}>
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
                </Animated.View> */}

                {/* ─── Nearby Professionals ──────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(440).springify()}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: 10, fontFamily: 'Inter-SemiBold', color: Colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                                NEARBY
                            </Text>
                            <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans-Bold', color: Colors.ink }}>
                                Available Professionals
                            </Text>
                        </View>

                        {/* Layout Switch */}
                        <LayoutSwitch
                        viewLayout={viewLayout}
                        setViewLayout={setViewLayout}
                        />
                    </View>

                    {loading ? (
                        <SkeletonList count={4} />
                    ) : artisans.length === 0 ? (
                        <EmptyState 
                            icon="location-outline"
                            title="No professionals nearby"
                            message={`We couldn't find any artisans in ${selectedCity}, ${selectedState}. Try switching your location to see more results.`}
                            actionLabel="Update Location"
                            onAction={() => router.push('/profile-completion')}
                        />
                    ) : (
                        <View style={viewLayout === 'grid' ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : { gap: 16 }}>
                            {artisans.slice(0, 10).map((art, index) => (
                                <Animated.View
                                    key={art.id}
                                    entering={FadeInDown.delay(480 + index * 80).springify()}
                                    style={viewLayout === 'grid' ? { width: '48.2%' } : { width: '100%' }}
                                >
                                    <ArtisanCard
                                        artisan={art}
                                        grid={viewLayout === 'grid'}
                                        list={viewLayout === 'list'}
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
