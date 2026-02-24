import { AppHeader } from '@/components/AppHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchJobs } from '@/services/mockApi';
import { useAppStore } from '@/store';
import type { JobRequest } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

const SEGMENTS = ['New', 'Active', 'Completed'];

export default function JobsScreen() {
    const router = useRouter();
    const { language } = useAppStore();
    const [segIdx, setSegIdx] = useState(0);
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            setLoading(true);
            const data = await fetchJobs();
            setJobs(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = jobs.filter((j) => {
        if (segIdx === 0) return j.status === 'submitted';
        if (segIdx === 1) return ['matched', 'scheduled', 'in_progress'].includes(j.status);
        return j.status === 'completed';
    });

    return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('jobs', language)} onNotification={() => router.push('/notifications')} />

            <View className="px-5 py-4">
                <SegmentedControl segments={SEGMENTS} selected={segIdx} onSelect={setSegIdx} />
            </View>

            {loading ? (
                <View className="p-5"><SkeletonList count={3} /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : filtered.length === 0 ? (
                <EmptyState icon="briefcase-outline" title="No jobs here" message="New job requests will appear when clients post them." />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <RequestCard
                            job={item}
                            isArtisanView
                            onPress={() => router.push({ pathname: '/job-details', params: { id: item.id } })}
                        />
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                />
            )}
        </View>
    );
}
