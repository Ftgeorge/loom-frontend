import { artisanApi, jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
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
import { Ionicons } from '@expo/vector-icons';

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

    const firstName = user?.name?.split(' ')[0] || 'TRIAL OPERATIVE';

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <SubAppHeader
                showLocation
                label="OPERATIONAL STATUS: ACTIVE"
                title={`GREETINGS, ${firstName.toUpperCase()}`}
                description="Initialize your service requirements for today's mission."
                onNotification={() => router.push('/notifications')}
                notifPlacement="top"
            />

            <ScrollView
<<<<<<< HEAD
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Active Protocol Banner ─────────────────────────────────────── */}
=======
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Greeting Removed (Now in Header) ───────────────────────── */}

                {/* ─── Active Job Banner ─────────────────────────────────────── */}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                {activeJobs.length > 0 && (
                    <ActiveJobBanner
                        job={activeJobs[0]}
                        onPress={() => router.push({ pathname: '/request-details', params: { id: activeJobs[0].id } })}
                    />
                )}

<<<<<<< HEAD
                {/* ─── Strategic Deployment CTA ────────────────────────────────────────── */}
=======
                {/* ─── Natural Language Search ───────────────────────────────── */}
                {/* <Animated.View entering={FadeInDown.delay(160).springify()}>
                    <NLSearchBar onPress={() => router.push({ pathname: '/search', params: { category: 'all' } })} />
                </Animated.View> */}

                {/* ─── Post a Job CTA ────────────────────────────────────────── */}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                <Animated.View entering={FadeInDown.delay(380).springify()}>
                    <PostJobCTA onPress={() => router.push('/post-job')} />
                </Animated.View>

<<<<<<< HEAD
                {/* ─── Operational Classifications ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(220).springify()} className="mb-14">
=======
                {/* ─── Categories ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(220).springify()} style={{ marginBottom: 48 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    <SectionHeader
                        overline="MISSION CLASSES"
                        title="SPECIFY CATEGORY?"
                        action="EXPAND ALL"
                        onAction={() => router.push('/search')}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
<<<<<<< HEAD
                        className="-mx-8 mt-2"
                        contentContainerStyle={{ paddingHorizontal: 32, gap: 14, paddingBottom: 6 }}
=======
                        style={{ marginHorizontal: -24 }}
                        contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingBottom: 4 }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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

<<<<<<< HEAD
                {/* ─── Local Professional Matrix ──────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(440).springify()}>
                    <View className="flex-row justify-between items-end mb-6 px-1">
                        <View className="flex-1">
                            <View className="flex-row items-center gap-1.5 mb-1.5">
                                <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                <Text className="text-label text-[10px] text-primary tracking-[2px] uppercase font-jakarta-extrabold italic">
                                    PROXIMITY RADAR
                                </Text>
                            </View>
                            <Text className="text-[26px] uppercase italic font-jakarta-extrabold text-ink tracking-tighter">
                                AVAILABLE PROS
=======

                {/* ─── Top Professionals ─────────────────────────────────────── */}
                {/* <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 48 }}>
                    <SectionHeader
                        overline="Top artisans"
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

                {/* ─── Nearby Artisans ──────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(440).springify()}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: 10, fontFamily: 'Inter-SemiBold', color: Colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                                NEARBY
                            </Text>
                            <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans-Bold', color: Colors.ink }}>
                                Available Artisans
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            </Text>
                        </View>

                        {/* Tactical Layout Toggle */}
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
                            title="ZERO OPERATIVES DETECTED"
                            message={`No active professionals localized in ${selectedCity}, ${selectedState}. Calibrate your coordinates to expand the search field.`}
                            actionLabel="RECALIBRATE COORDINATES"
                            onAction={() => router.push('/profile-completion')}
                        />
                    ) : (
<<<<<<< HEAD
                        <View className={viewLayout === 'grid' ? "flex-row flex-wrap gap-4" : "gap-5"}>
=======
                        <View style={viewLayout === 'grid' ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : { gap: 16 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            {artisans.slice(0, 10).map((art, index) => (
                                <Animated.View
                                    key={art.id}
                                    entering={FadeInDown.delay(480 + index * 80).springify()}
<<<<<<< HEAD
                                    className={viewLayout === 'grid' ? "w-[47.6%]" : "w-full"}
=======
                                    style={viewLayout === 'grid' ? { width: '48.2%' } : { width: '100%' }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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

                <View className="mt-16 items-center flex-row justify-center gap-2 opacity-20">
                    <Ionicons name="infinite" size={14} color="#64748B" />
                    <Text className="text-[9px] text-muted uppercase tracking-[3px] font-jakarta-bold italic">Loom Tactical Interface • Stable Branch</Text>
                </View>
            </ScrollView>
        </View>
    );
}
<<<<<<< HEAD


=======
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
