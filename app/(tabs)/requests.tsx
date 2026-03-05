import { AppHeader } from '@/components/AppHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { jobApi } from '@/services/api';
import { useAppStore } from '@/store';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

const SEGMENTS = ['Active', 'Completed', 'Cancelled'];
const FILTERS = ['active', 'completed', 'cancelled'];

export default function RequestsScreen() {
    const router = useRouter();
    const { jobs, setJobs, language } = useAppStore();
    const [segIdx, setSegIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            // GET /jobs — customer role sees their own requests, filtered by status
            const statusMap: Record<number, string | undefined> = { 0: 'assigned', 1: 'completed', 2: 'cancelled' };
            const res = await jobApi.list({ status: statusMap[segIdx], limit: 30 });
            const mapped = (res.results as any[]).map((row: any) => ({
                id: row.id,
                clientId: row.customer_id,
                clientName: row.customer_email ?? 'You',
                category: (row.title ?? 'other') as any,
                description: row.description,
                budget: 0,
                urgency: 'today' as const,
                location: { area: row.location ?? '', city: '', state: '' },
                status: (row.status === 'open' ? 'submitted'
                    : row.status === 'assigned' ? 'matched'
                        : row.status === 'completed' ? 'completed'
                            : 'cancelled') as any,
                createdAt: row.created_at,
            }));
            setJobs(mapped);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [segIdx]);

    useEffect(() => { setLoading(true); load(); }, [load]);

    return (
        <View className="flex-1 bg-background">
            <AppHeader title={t('requests', language)} onNotification={() => router.push('/notifications')} />

            <View className="px-5 py-4">
                <SegmentedControl segments={SEGMENTS} selected={segIdx} onSelect={setSegIdx} />
            </View>

            {loading ? (
                <View className="p-5"><SkeletonList count={3} type="request" /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : jobs.length === 0 ? (
                <EmptyState
                    icon="document-text-outline"
                    title={t('noRequests', language)}
                    message={t('postFirstJob', language)}
                    actionLabel={t('postJob', language)}
                    onAction={() => router.push('/post-job')}
                />
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
                    renderItem={({ item }) => (
                        <RequestCard
                            job={item}
                            onPress={() => router.push({ pathname: '/request-details', params: { id: item.id } })}
                        />
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                />
            )}
        </View>
    );
}
