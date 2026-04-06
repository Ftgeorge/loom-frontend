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
import { Ionicons } from '@expo/vector-icons';

const SEGMENTS = ['ACTIVE', 'COMPLETED', 'CANCELLED'];

export default function RequestsScreen() {
    const router = useRouter();
    const { jobs, setJobs } = useAppStore();
    const [segIdx, setSegIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);

            const statusMap: Record<number, string | undefined> = {
                0: 'assigned,open',
                1: 'completed',
                2: 'cancelled'
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, [load]);

    return (
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated />
            </View>
            <SubAppHeader
                label="ACTIVITY TRACKER"
                title="MY BOOKINGS"
                description="Monitor your service requests and operational deployments."
                onNotification={() => router.push('/notifications')}
            />
            
            <View className="px-6 py-6 border-b border-card-border/30 bg-white/50 backdrop-blur-xl">
                <SegmentedControl
                    segments={SEGMENTS}
                    selected={segIdx}
                    onSelect={setSegIdx}
                />
            </View>

            {loading ? (
                <View className="p-7"><SkeletonList count={3} type="request" /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : jobs.length === 0 ? (
                <View className="flex-1 justify-center p-7">
                    <View className="p-16 items-center border-[2px] border-dashed bg-white border-card-border rounded-[32px] shadow-inner text-center">
                        <View className="w-20 h-20 bg-background rounded-3xl items-center justify-center mb-6 shadow-sm border border-card-border">
                            <Ionicons 
                                name={segIdx === 0 ? "time-outline" : segIdx === 1 ? "checkmark-done-outline" : "close-circle-outline"} 
                                size={42} 
                                color="#94A3B8" 
                            />
                        </View>
                        <Text className="text-h3 text-center text-ink uppercase font-jakarta-extrabold italic tracking-tight">
                            {segIdx === 0 ? 'NO ACTIVE REQUESTS' : segIdx === 1 ? 'NO COMPLETED REQUESTS' : 'NO CANCELLED REQUESTS'}
                        </Text>
                        <Text className="text-body text-center text-ink/50 mt-4 leading-5 font-jakarta-medium max-w-[240px]">
                            {segIdx === 0
                                ? "You don't have any active service requests deployed at the moment."
                                : "Your past request logs will appear here once they are processed."}
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />
                    }
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
            
            <View className="absolute bottom-10 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">End of Log • Encrypted v4.2</Text>
            </View>
        </View>
    );
}


