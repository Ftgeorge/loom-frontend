import { AppHeader } from '@/components/AppHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { jobApi } from '@/services/api';
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
            // GET /jobs — artisan role sees open + their assigned jobs
            const res = await jobApi.list({ limit: 50 });
            const mapped = (res.results as any[]).map((row: any): JobRequest => ({
                id: row.id,
                clientId: row.customer_id,
                clientName: row.customer_email ?? 'Client',
                category: (row.title ?? 'other') as any,
                description: row.description,
                budget: 0,
                urgency: 'today',
                location: { area: row.location ?? '', city: '', state: '' },
                status: row.status === 'open' ? 'submitted'
                    : row.status === 'assigned' ? 'matched'
                        : row.status === 'completed' ? 'completed'
                            : 'cancelled',
                createdAt: row.created_at,
            }));
            setJobs(mapped);
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
                <View className="p-5"><SkeletonList count={3} type="request" /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : filtered.length === 0 ? (
                <EmptyState icon="briefcase-outline" title="No jobs yet" message="New job requests will appear here when clients post them." />
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
