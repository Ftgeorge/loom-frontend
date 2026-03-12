import { SubAppHeader } from '@/components/AppSubHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { RequestCard } from '@/components/ui/RequestCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
import type { JobRequest } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SEGMENTS = ['INCOMING', 'ACTIVE', 'HISTORY'];

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
            const res = await jobApi.list({ limit: 50 });
            const mapped = (res.results as any[]).map(mapJob);
            setJobs(mapped);
        } catch (err) {
            console.error('[Jobs] Error fetching jobs:', err);
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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <SubAppHeader
                label="JOB LIST"
                title="Service Jobs"
                description="Manage your incoming, active and past completed jobs."
                onNotification={() => router.push('/notifications')}
            />

            <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
                <SegmentedControl
                    segments={SEGMENTS}
                    selected={segIdx}
                    onSelect={setSegIdx}
                />
            </View>

            {loading ? (
                <View style={{ padding: 24 }}><SkeletonList count={3} type="request" /></View>
            ) : error ? (
                <ErrorState onRetry={load} />
            ) : filtered.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
                    <View style={{
                        padding: 48,
                        alignItems: 'center',
                        borderStyle: 'dashed',
                        backgroundColor: Colors.surface,
                        borderColor: Colors.cardBorder,
                        borderRadius: Radius.md,
                        borderWidth: 1.5
                    }}>
                        <Text style={[Typography.h3, { textAlign: 'center', color: Colors.primary }]}>
                            {segIdx === 0 ? 'NO NEW REQUESTS' : segIdx === 1 ? 'NO ACTIVE JOBS' : 'NO JOB HISTORY'}
                        </Text>
                        <Text style={[Typography.bodySmall, { textAlign: 'center', color: Colors.muted, marginTop: 12, lineHeight: 20 }]}>
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
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                            <RequestCard
                                job={item}
                                isArtisanView
                                onPress={() => router.push({ pathname: '/job-details', params: { id: item.id } })}
                            />
                        </Animated.View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                />
            )}
        </View>
    );
}
