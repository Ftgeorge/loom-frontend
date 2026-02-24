import { AppHeader } from '@/components/AppHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { fetchJobs } from '@/services/mockApi';
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
            const data = await fetchJobs(FILTERS[segIdx]);
            setJobs(data);
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
                <View className="p-5"><SkeletonList count={3} /></View>
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
