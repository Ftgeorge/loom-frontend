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
import { Ionicons } from '@expo/vector-icons';

const SEGMENTS = ['INCOMING', 'ACTIVE', 'HISTORY'];

export default function JobsScreen() {
    const router = useRouter();
    const [segIdx, setSegIdx] = useState(0);
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
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
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated />
            </View>
            <SubAppHeader
                label="OPERATIONAL LOG"
                title="SERVICE JOBS"
                description="Manage your incoming mission requests and active contracts."
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
            ) : filtered.length === 0 ? (
                <View className="flex-1 justify-center p-7">
                    <View className="p-16 items-center border-[2px] border-dashed bg-white border-card-border rounded-[32px] shadow-inner">
                        <View className="w-20 h-20 bg-background rounded-3xl items-center justify-center mb-6 shadow-sm border border-card-border">
                            <Ionicons 
                                name={segIdx === 0 ? "radio-outline" : segIdx === 1 ? "flash-outline" : "archive-outline"} 
                                size={42} 
                                color="#94A3B8" 
                            />
                        </View>
                        <Text className="text-h3 text-center text-ink uppercase font-jakarta-extrabold italic tracking-tight">
                            {segIdx === 0 ? 'NO MISSION REQUESTS' : segIdx === 1 ? 'ZERO ACTIVE JOBS' : 'EMPTY HISTORY LOG'}
                        </Text>
                        <Text className="text-body text-center text-ink/50 mt-4 leading-5 font-jakarta-medium max-w-[240px]">
                            {segIdx === 0
                                ? 'Your transmission frequency is clear. We will alert you when a mission is available.'
                                : segIdx === 1
                                    ? 'You have no operations currently deployed in the field.'
                                    : 'Your operational history is currently unpopulated.'}
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
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
            
            <View className="absolute bottom-10 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">End of Log • Encrypted v4.2</Text>
            </View>
        </View>
    );
}


