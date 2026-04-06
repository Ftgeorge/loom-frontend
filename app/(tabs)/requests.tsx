import { SubAppHeader } from '@/components/AppSubHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SEGMENTS = ['ACTIVE', 'COMPLETED', 'CANCELLED'];

export default function RequestsScreen() {
    const router = useRouter();
    const { jobs, setJobs } = useAppStore();
    const [segIdx, setSegIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);

            const statusMap: Record<number, string | undefined> = {
                0: 'assigned,open', // Active/Assigned or Open
                1: 'completed', // Completed
                2: 'cancelled'  // Cancelled
            };

            const res = await jobApi.list({
                status: statusMap[segIdx],
                limit: 30
            });

            const mapped = (res.results as any[]).map(mapJob);
            setJobs(mapped);
        } catch (err) {
            console.error('[Requests] Error fetching jobs:', err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [segIdx, refreshing, setJobs]);

    useEffect(() => { load(); }, [load]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    return (
        <View className="flex-1 bg-background">
            <LoomThread variant="minimal" opacity={0.2} animated />
            <SubAppHeader
                title="My Bookings"
                label="ACTIVITY"
                description="Keep track of your service requests and appointments."
                onNotification={() => router.push('/notifications')}
            />
            <View className="px-6">
                <SegmentedControl
                    segments={SEGMENTS}
                    selected={segIdx}
                    onSelect={setSegIdx}
                />
            </View>

            {loading ? (
                <View className="p-6"><SkeletonList count={3} type="request" /></View>
            ) : jobs.length === 0 ? (
                <View className="flex-1 justify-center p-6">
                    <View className="p-12 items-center border-dashed bg-white border-card-border rounded-md border-[1.5px]">
                        <Text className="text-h3 text-center text-primary">
                            {segIdx === 0 ? 'NO ACTIVE REQUESTS' : segIdx === 1 ? 'NO COMPLETED REQUESTS' : 'NO CANCELLED REQUESTS'}
                        </Text>
                        <Text className="text-body-sm text-center text-muted mt-3 leading-5">
                            {segIdx === 0
                                ? "You don't have any active service requests right now."
                                : "Your past requests will appear here once you have them."}
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#00120C" />}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                            <RequestCard
                                job={item}
                                onPress={() => router.push({ pathname: '/request-details', params: { id: item.id } })}
                            />
                        </Animated.View>
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                />
            )}
        </View>
    );
}

