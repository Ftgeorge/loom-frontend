import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { RequestCard } from '@/components/ui/RequestCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
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
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, language, artisanOnline, setArtisanOnline } = useAppStore();
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

            const mappedJobs = (jobsRes.results as any[]).map(mapJob);
            setJobs(mappedJobs);

            if (profileRes) {
                setProfile(mapArtisan(profileRes));
            }

            setEarnings(earningsRes);
        } catch (err) {
            console.error('[Dashboard] Error fetching data:', err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, [load]);

    const newJobs = React.useMemo(() => jobs.filter((j) => j.status === 'submitted'), [jobs]);
    const activeJobs = React.useMemo(() => jobs.filter((j) => ['matched', 'scheduled', 'in_progress'].includes(j.status)), [jobs]);

    const stats = React.useMemo(() => [
        {
            label: 'NEW JOBS',
            value: `${newJobs.length}`,
            icon: 'flash-outline',
            color: Colors.accent
        },
        {
            label: 'ACTIVE JOBS',
            value: `${activeJobs.length}`,
            icon: 'briefcase-outline',
            color: Colors.primary
        },
        {
            label: 'MY RATING',
            value: profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : '5.0',
            icon: 'star-outline',
            color: Colors.primary
        },
        {
            label: 'TOTAL EARNINGS',
            value: `₦${Number(earnings?.total_earned ?? 0).toLocaleString()}`,
            icon: 'wallet-outline',
            color: Colors.primary
        },
    ], [newJobs.length, activeJobs.length, profile?.rating, earnings?.total_earned]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader showLocation onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Mission Control: Operative Status */}
                <View style={{ marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Animated.View entering={FadeInDown.delay(100).springify()}>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>WELCOME BACK</Text>
                            <Text style={[Typography.h1, { fontSize: 26 }]}>
                                {user?.name?.split(' ')[0].toUpperCase() || 'PRO'}
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInRight.delay(200).springify()}>
                            <TouchableOpacity
                                onPress={() => setArtisanOnline(!artisanOnline)}
                                style={{
                                    backgroundColor: artisanOnline ? Colors.white : Colors.surface,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: Radius.xs,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    borderWidth: 1.5,
                                    borderColor: artisanOnline ? Colors.primary : Colors.cardBorder,
                                    ...Shadows.sm
                                }}
                            >
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: artisanOnline ? Colors.primary : Colors.muted
                                }} />
                                <Text style={[Typography.label, { color: artisanOnline ? Colors.primary : Colors.muted, fontSize: 10 }]}>
                                    {artisanOnline ? 'ONLINE' : 'OFFLINE'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>

                {/* Performance Ledger */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
                    {stats.map((s, index) => (
                        <Animated.View key={s.label} entering={FadeInUp.delay(300 + index * 100).springify()} style={{ width: '48%' }}>
                            <Card style={{
                                padding: 20,
                                backgroundColor: Colors.white,
                                borderColor: Colors.cardBorder,
                                borderRadius: Radius.md,
                                ...Shadows.sm
                            }}>
                                <View style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: Radius.xs,
                                    backgroundColor: Colors.surface,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: Colors.cardBorder
                                }}>
                                    <Ionicons name={s.icon as any} size={16} color={Colors.primary} />
                                </View>
                                <Text style={[Typography.h1, { fontSize: 20, color: Colors.text, marginBottom: 4 }]}>{s.value}</Text>
                                <Text style={[Typography.label, { fontSize: 8, color: Colors.muted, letterSpacing: 1 }]}>{s.label}</Text>
                            </Card>
                        </Animated.View>
                    ))}
                </View>

                {/* Lead Ledger */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>NEW LEADS</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>Job Requests</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/jobs')}
                            style={{ padding: 8, backgroundColor: Colors.white, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.cardBorder }}
                        >
                            <Text style={[Typography.label, { color: Colors.accent, fontSize: 9 }]}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} type="request" />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : newJobs.length === 0 ? (
                        <Card style={{ padding: 48, alignItems: 'center', borderStyle: 'dashed', backgroundColor: Colors.surface, borderColor: Colors.cardBorder, borderRadius: Radius.md }}>
                            <Ionicons name="notifications-off-outline" size={32} color={Colors.muted} />
                            <Text style={[Typography.h3, { textAlign: 'center', marginTop: 20, color: Colors.primary }]}>
                                NO NEW JOBS
                            </Text>
                            <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted, marginTop: 8, lineHeight: 18 }]}>
                                Waiting for new job requests in your area. Keep your status online to receive alerts.
                            </Text>
                        </Card>
                    ) : (
                        <View style={{ gap: 16 }}>
                            {newJobs.slice(0, 4).map((job, index) => (
                                <Animated.View key={job.id} entering={FadeInUp.delay(500 + index * 100)}>
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
