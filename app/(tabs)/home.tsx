import { artisanApi, jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import type { Artisan } from '@/types';
import { CATEGORIES } from '@/types';
import { useRouter, useFocusEffect } from 'expo-router';
import { mapArtisan, mapJob } from '@/services/mappers';
import { SubAppHeader } from '@/components/AppSubHeader';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ActiveJobBanner } from '@/components/home/ActiveJobBanner';
import { CategoryPill } from '@/components/home/CategoryPill';
import { PostJobCTA } from '@/components/home/PostJobCTA';
import { SectionHeader } from '@/components/home/SectionHeader';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
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
    const [, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

    const load = useCallback(async () => {
        try {
            setError(false);
            const [artRes, jobRes] = await Promise.all([
                artisanApi.list({ 
                    limit: 30,
                    city: selectedCity,
                    state: selectedState,
                    area: user?.location?.area,
                    interests: user?.interests
                }),
                jobApi.list({ status: 'assigned,open', limit: 5 })
            ]);
            
            setArtisans((artRes.results as any[]).map(mapArtisan));
            useAppStore.getState().setJobs((jobRes.results as any[]).map(mapJob));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedState, selectedCity, user?.interests, user?.location?.area]);

    useEffect(() => { load(); }, [load]);
    
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );
    const onRefresh = () => { setRefreshing(true); load(); };

    const activeJobs = React.useMemo(() =>
        jobs.filter(j => ['matched', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 1),
        [jobs]
    );

    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <View className="flex-1 bg-canvas">
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Active Job Banner ─────────────────────────────────────── */}
                {activeJobs.length > 0 && (
                    <ActiveJobBanner
                        job={activeJobs[0]}
                        onPress={() => router.push({ pathname: '/request-details', params: { id: activeJobs[0].id } })}
                    />
                )}

                {/* ─── Post a Job CTA ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(380).springify()}>
                    <PostJobCTA onPress={() => router.push('/post-job')} />
                </Animated.View>

                {/* ─── Categories ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(220).springify()} className="mb-12">
                    <SectionHeader
                        overline="Categories"
                        title="What type of service?"
                        action="See all"
                        onAction={() => router.push('/search')}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="-mx-6"
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

                {/* ─── Nearby Artisans ──────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(440).springify()}>
                    <View className="flex-row justify-between items-center mb-5">
                        <View>
                            <Text className="text-[10px] font-inter-semibold text-muted tracking-[0.8px] uppercase mb-1">
                                NEARBY
                            </Text>
                            <Text className="text-[20px] font-jakarta-bold text-ink">
                                Available Artisans
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
                        <View className={viewLayout === 'grid' ? "flex-row flex-wrap gap-3" : "gap-4"}>
                            {artisans.slice(0, 10).map((art, index) => (
                                <Animated.View
                                    key={art.id}
                                    entering={FadeInDown.delay(480 + index * 80).springify()}
                                    className={viewLayout === 'grid' ? "w-[48.2%]" : "w-full"}
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

