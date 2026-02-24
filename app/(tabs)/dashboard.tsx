import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/CardChipBadge';
import { RequestCard } from '@/components/ui/RequestCard';
import { Skeleton, SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchJobs } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { JobRequest } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    Switch,
    Text,
    View,
} from 'react-native';

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, language, artisanOnline, setArtisanOnline } = useAppStore();
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchJobs();
            setJobs(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const newJobs = jobs.filter((j) => j.status === 'submitted');
    const activeJobs = jobs.filter((j) => ['matched', 'scheduled', 'in_progress'].includes(j.status));

    const stats = [
        { label: t('newRequests', language), value: `${newJobs.length}`, icon: 'mail-unread-outline', color: Colors.info },
        { label: t('activeJobs', language), value: `${activeJobs.length}`, icon: 'briefcase-outline', color: Colors.accent },
        { label: t('yourRating', language), value: '4.8', icon: 'star-outline', color: Colors.warning },
        { label: t('totalEarnings', language), value: formatNaira(485000), icon: 'wallet-outline', color: Colors.success },
    ];

    return (
        <View className="flex-1 bg-background">
            <AppHeader showLocation onNotification={() => router.push('/notifications')} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Greeting + Online Toggle */}
                <View className="flex-row items-center mb-6">
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-primary">
                            {t('greeting', language)}, {user?.name} 👋
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-gray-500">
                            {artisanOnline ? t('goOffline', language) : t('goOnline', language)}
                        </Text>
                        <Switch
                            value={artisanOnline}
                            onValueChange={setArtisanOnline}
                            trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </View>

                {/* Stats Grid */}
                {loading ? (
                    <View className="flex-row flex-wrap gap-4 mb-5">
                        {[1, 2, 3, 4].map((i) => (
                            <View key={i} className="w-[47%] items-center" style={{ padding: 20, backgroundColor: 'white', borderRadius: 16 }}>
                                <Skeleton width={40} height={40} borderRadius={20} />
                                <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="flex-row flex-wrap gap-4 mb-5">
                        {stats.map((s) => (
                            <Card key={s.label} className="w-[47%] gap-1">
                                <View
                                    className="w-10 h-10 rounded-[20px] items-center justify-center"
                                    style={{ backgroundColor: s.color + '20' }}
                                >
                                    <Ionicons name={s.icon as any} size={22} color={s.color} />
                                </View>
                                <Text className="text-xl font-bold text-primary mt-1">{s.value}</Text>
                                <Text className="text-xs text-gray-500">{s.label}</Text>
                            </Card>
                        ))}
                    </View>
                )}

                {/* New Job Requests */}
                <Text className="text-lg font-bold text-primary mb-4">New Job Requests Near You</Text>
                {loading ? (
                    <SkeletonList count={2} />
                ) : error ? (
                    <ErrorState onRetry={load} />
                ) : newJobs.length === 0 ? (
                    <View className="p-8 items-center">
                        <Text className="text-base text-gray-400 text-center">No new requests right now. Check back soon!</Text>
                    </View>
                ) : (
                    <View className="gap-4">
                        {newJobs.slice(0, 5).map((job) => (
                            <RequestCard
                                key={job.id}
                                job={job}
                                isArtisanView
                                onPress={() => router.push({ pathname: '/job-details', params: { id: job.id } })}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
