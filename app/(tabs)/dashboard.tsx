import { AppHeader } from '@/components/AppHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan, JobRequest } from '@/types';
import { Ionicons } from '@expo/vector-icons';
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
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
} from 'react-native-reanimated';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delay, accent }: {
    label: string;
    value: string;
    icon: string;
    delay: number;
    accent?: boolean;
}) {
    return (
        <Animated.View
            entering={FadeInUp.delay(delay).springify()}
            style={{ flex: 1 }}
        >
            <View style={{
                backgroundColor: accent ? Colors.primary : Colors.surface,
                borderRadius: Radius.lg,
                padding: 18,
                borderWidth: 1,
                borderColor: accent ? 'transparent' : Colors.cardBorder,
                ...Shadows.sm,
            }}>
                <View style={{
                    width: 36, height: 36,
                    borderRadius: 10,
                    backgroundColor: accent ? 'rgba(255,255,255,0.1)' : Colors.canvas,
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                }}>
                    <Ionicons name={icon as any} size={18} color={accent ? Colors.white : Colors.primary} />
                </View>
                <Text style={[Typography.data, {
                    color: accent ? Colors.white : Colors.ink,
                    fontSize: 22,
                    marginBottom: 4,
                }]}>
                    {value}
                </Text>
                <Text style={[Typography.label, {
                    color: accent ? 'rgba(255,255,255,0.55)' : Colors.muted,
                    fontSize: 9,
                    letterSpacing: 0.8,
                }]}>
                    {label}
                </Text>
            </View>
        </Animated.View>
    );
}

// ─── Online Toggle ──────────────────────────────────────────────────────────────
function OnlineToggle({ online, onToggle }: { online: boolean; onToggle: () => void }) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(0.92, { damping: 6 }),
            withSpring(1, { damping: 10 })
        );
        onToggle();
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: online ? Colors.successLight : Colors.canvas,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: online ? Colors.success + '60' : Colors.cardBorder,
                }}
            >
                <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: online ? Colors.success : Colors.muted,
                }} />
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans-Bold',
                    color: online ? Colors.success : Colors.muted,
                }}>
                    {online ? "I'M IN" : "I'M OUT"}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, artisanOnline, setArtisanOnline } = useAppStore();
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [profile, setProfile] = useState<Artisan | null>(null);
    const [earnings, setEarnings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);

            const [jobsRes, profileRes, earningsRes] = await Promise.all([
                jobApi.list({ limit: 30 }),
                artisanApi.meProfile(),
                artisanApi.meEarnings()
            ]);

            setJobs((jobsRes.results as any[]).map(mapJob));
            if (profileRes) setProfile(mapArtisan(profileRes));
            setEarnings(earningsRes);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);
    const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

    const newJobs = React.useMemo(() => jobs.filter(j => j.status === 'submitted'), [jobs]);
    const activeJobs = React.useMemo(() => jobs.filter(j => ['matched', 'scheduled', 'in_progress'].includes(j.status)), [jobs]);

    const firstName = user?.name?.split(' ')[0] || 'Pro';

    return (
        <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
            <AppHeader showLocation onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Header ──────────────────────────────────────────────── */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <Animated.View entering={FadeInDown.delay(80).springify()}>
                        <Text style={[Typography.label, { color: Colors.violet, marginBottom: 4 }]}>DASHBOARD</Text>
                        <Text style={[Typography.h1, { fontSize: 28 }]}>
                            {firstName}
                        </Text>
                    </Animated.View>
                    <Animated.View entering={FadeInRight.delay(160).springify()}>
                        <OnlineToggle online={artisanOnline} onToggle={() => setArtisanOnline(!artisanOnline)} />
                    </Animated.View>
                </View>

                {/* ─── Earnings Hero Card ───────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 20 }}>
                    <View style={{
                        backgroundColor: Colors.primary,
                        borderRadius: Radius.xl,
                        padding: 24,
                        ...Shadows.brand,
                        overflow: 'hidden',
                    }}>
                        {/* Decorative */}
                        <View style={{ position: 'absolute', right: -30, top: -30, opacity: 0.04 }}>
                            <Ionicons name="wallet" size={200} color={Colors.white} />
                        </View>

                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                            Total Earnings
                        </Text>
                        <Text style={{ fontSize: 38, fontFamily: 'Inter-Bold', color: Colors.white, letterSpacing: -1, marginBottom: 4 }}>
                            ₦{Number(earnings?.total_earned ?? 0).toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                            All time · Updated just now
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View>
                                <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                                    This week
                                </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Inter-Bold', color: Colors.white, marginTop: 2 }}>
                                    ₦{Number(earnings?.this_week ?? 0).toLocaleString()}
                                </Text>
                            </View>
                            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                            <View>
                                <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                                    Completed
                                </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Inter-Bold', color: Colors.white, marginTop: 2 }}>
                                    {earnings?.completed_jobs ?? 0} jobs
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Stats Row ───────────────────────────────────────────── */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
                    <StatCard
                        label="New Jobs"
                        value={`${newJobs.length}`}
                        icon="flash-outline"
                        delay={280}
                        accent
                    />
                    <StatCard
                        label="Active Jobs"
                        value={`${activeJobs.length}`}
                        icon="briefcase-outline"
                        delay={360}
                    />
                    <StatCard
                        label="Rating"
                        value={profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : '5.0'}
                        icon="star-outline"
                        delay={440}
                    />
                </View>

                {/* ─── New Gigs ─────────────────────────────────────────────── */}
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.muted, marginBottom: 4 }]}>Incoming</Text>
                            <Text style={[Typography.h2, { fontSize: 20 }]}>New Job Requests</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/jobs')}
                            style={{
                                backgroundColor: Colors.canvas,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.primary }}>
                                All Jobs
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} type="request" />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : newJobs.length === 0 ? (
                        <View style={{
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.xl,
                            padding: 48,
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            borderColor: Colors.cardBorder,
                        }}>
                            <View style={{
                                width: 60, height: 60, borderRadius: 20,
                                backgroundColor: Colors.canvas,
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <Ionicons name="notifications-off-outline" size={28} color={Colors.muted} />
                            </View>
                            <Text style={[Typography.h3, { textAlign: 'center', marginBottom: 8 }]}>
                                No jobs yet
                            </Text>
                            <Text style={[Typography.body, { textAlign: 'center', fontSize: 14 }]}>
                                Stay online and you'll be notified when a job comes in.
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {newJobs.slice(0, 4).map((job, index) => (
                                <Animated.View key={job.id} entering={FadeInDown.delay(500 + index * 80).springify()}>
                                    <RequestCard
                                        job={job}
                                        isArtisanView
                                        onPress={() => router.push({ pathname: '/job-details', params: { id: job.id } })}
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
