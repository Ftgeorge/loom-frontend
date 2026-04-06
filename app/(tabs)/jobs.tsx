import { SubAppHeader } from '@/components/AppSubHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import type { JobRequest } from '@/types';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SEGMENTS = ['INCOMING', 'ACTIVE', 'HISTORY'];

export default function JobsScreen() {
    const router = useRouter();
    const [segIdx, setSegIdx] = useState(0);
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);
            const res = await jobApi.list({ limit: 50 });
            const mapped = (res.results as any[]).map(mapJob);
            setJobs(mapped);
        } catch (err) {
            console.error('[Jobs] Error fetching jobs:', err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const filtered = jobs.filter((j) => {
        if (segIdx === 0) return j.status === 'submitted' || j.status === 'matched';
        if (segIdx === 1) return ['accepted', 'on_the_way', 'in_progress'].includes(j.status);
        return j.status === 'completed' || j.status === 'cancelled';
    });

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            <SubAppHeader
                label="JOB LIST"
                title="Service Jobs"
                description="Manage your incoming, active and past completed jobs."
                onNotification={() => router.push('/notifications')}
            />

            <View className="px-6 py-5">
                <SegmentedControl
                    segments={SEGMENTS}
                    selected={segIdx}
                    onSelect={setSegIdx}
                />
            </View>

            {loading ? (
                <View className="p-6"><SkeletonList count={3} type="request" /></View>
            ) : filtered.length === 0 ? (
                <View className="flex-1 justify-center p-6">
                    <View className="p-12 items-center border-[1.5px] border-dashed bg-surface border-card-border rounded-md">
                        <Text className="text-h3 text-center text-primary uppercase">
                            {segIdx === 0 ? 'NO NEW REQUESTS' : segIdx === 1 ? 'NO ACTIVE JOBS' : 'NO JOB HISTORY'}
                        </Text>
                        <Text className="text-body-sm text-center text-muted mt-3 leading-5">
                            {segIdx === 0
                                ? 'You have no new job requests at the moment. We will notify you when a new job arrives.'
                                : segIdx === 1
                                    ? 'You do not have any jobs currently in progress.'
                                    : 'You have not completed any jobs yet.'}
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                load();
                            }}
                            tintColor="#00120C"
                        />
                    }
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                            <RequestCard
                                job={item}
                                isArtisanView
                                onPress={() => router.push({ pathname: '/job-details', params: { id: item.id } })}
                            />
                        </Animated.View>
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                />
            )}
        </View>
    );
}

