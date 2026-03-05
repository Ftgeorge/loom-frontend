import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/CardChipBadge';
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
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, language, artisanOnline, setArtisanOnline } = useAppStore();
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [profile, setProfile] = useState<Artisan | null>(null);
    const [earnings, setEarnings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            setLoading(true);

            // Fetch everything in parallel
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
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const newJobs = jobs.filter((j) => j.status === 'submitted');
    const activeJobs = jobs.filter((j) => ['matched', 'scheduled', 'in_progress'].includes(j.status));

    const stats = [
        {
            label: 'New Jobs',
            value: `${newJobs.length}`,
            icon: 'mail',
            color: Colors.info
        },
        {
            label: 'Active',
            value: `${activeJobs.length}`,
            icon: 'briefcase',
            color: Colors.primary
        },
        {
            label: 'Rating',
            value: profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : 'N/A',
            icon: 'star',
            color: Colors.warning
        },
        {
            label: 'Earnings',
            value: `₦${Number(earnings?.total_earned ?? 0).toLocaleString()}`,
            icon: 'wallet',
            color: Colors.success
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader showLocation onNotification={() => router.push('/notifications')} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting + Mission Control */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[Typography.h2, { fontSize: 22 }]}>
                            {t('greeting', language)}, {user?.name?.split(' ')[0] || 'there'} 👋
                        </Text>
                        <Text style={[Typography.bodySmall, { marginTop: 4 }]}>Hope you're ready for work today!</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: Colors.surface,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: Radius.full,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                        gap: 8,
                        ...Shadows.sm
                    }}>
                        <Text style={[Typography.label, { fontSize: 10, color: artisanOnline ? Colors.success : Colors.muted }]}>
                            {artisanOnline ? 'ONLINE' : 'OFFLINE'}
                        </Text>
                        <Switch
                            value={artisanOnline}
                            onValueChange={setArtisanOnline}
                            trackColor={{ false: Colors.cardBorder, true: Colors.success + '40' }}
                            thumbColor={artisanOnline ? Colors.success : Colors.muted}
                        />
                    </View>
                </View>

                {/* Performance Grid */}
                {loading ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <View key={i} style={{ width: '47%', height: 100, backgroundColor: Colors.surface, borderRadius: Radius.lg }} />
                        ))}
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                        {stats.map((s, index) => (
                            <Animated.View key={s.label} entering={FadeInUp.delay(index * 100).springify()} style={{ width: '47.5%' }}>
                                <Card style={{ padding: 18, gap: 4 }}>
                                    <View style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: s.color + '10',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 8
                                    }}>
                                        <Ionicons name={s.icon as any} size={20} color={s.color} />
                                    </View>
                                    <Text style={[Typography.h2, { fontSize: 20 }]}>{s.value}</Text>
                                    <Text style={[Typography.bodySmall, { fontSize: 11, color: Colors.muted }]}>{s.label}</Text>
                                </Card>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Job Opportunities Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={[Typography.h3]}>Available Near You</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
                        <Text style={[Typography.label, { color: Colors.primary }]}>View All</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <SkeletonList count={2} type="request" />
                ) : error ? (
                    <ErrorState onRetry={load} />
                ) : newJobs.length === 0 ? (
                    <Card style={{ padding: 40, alignItems: 'center', borderStyle: 'dotted' }}>
                        <Ionicons name="notifications-off-outline" size={48} color={Colors.cardBorder} />
                        <Text style={[Typography.body, { textAlign: 'center', marginTop: 16 }]}>
                            Low jobs right now. Try changing your area!
                        </Text>
                    </Card>
                ) : (
                    <View style={{ gap: 16 }}>
                        {newJobs.slice(0, 4).map((job, index) => (
                            <Animated.View key={job.id} entering={FadeInUp.delay(400 + index * 100)}>
                                <RequestCard
                                    job={job}
                                    isArtisanView
                                    onPress={() => router.push({ pathname: '/job-details', params: { id: job.id } })}
                                />
                            </Animated.View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
