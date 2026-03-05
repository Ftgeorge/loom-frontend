import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getArtisanJobSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { ArtisanJobStatus, JobRequest } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function JobDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [job, setJob] = useState<JobRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [artisanStatus, setArtisanStatus] = useState<ArtisanJobStatus>('new');

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!id) return;
            const row = await jobApi.getById(id) as any;
            if (row) {
                setJob(mapJob(row));
                setArtisanStatus('new');
            }
        } catch (err) {
            console.error('[JobDetails] Error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleAccept = async () => {
        if (!id) return;
        try {
            await jobApi.accept(id);
            setArtisanStatus('accepted');
            setJob((j) => j ? { ...j, status: 'matched', artisanStatus: 'accepted' } : null);
            Alert.alert('Success', 'You have accepted this job!');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to accept job');
        }
    };

    const handleDecline = () => {
        Alert.alert('Decline Job', 'Are you sure? This job will be removed from your list.', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Decline', style: 'destructive', onPress: () => router.back() },
        ]);
    };

    const handleStatusUpdate = async (newStatus: ArtisanJobStatus) => {
        setArtisanStatus(newStatus);
        setJob((j) => j ? { ...j, artisanStatus: newStatus } : null);

        // When the artisan marks the job completed, call the real backend
        if (newStatus === 'completed' && id) {
            try {
                await jobApi.complete(id);
            } catch (err: any) {
                Alert.alert('Sync Error', err.message ?? 'Could not mark job complete on server.');
            }
        }
    };

    const statusActions: Record<string, { label: string; next: ArtisanJobStatus }> = {
        accepted: { label: "I'm On My Way", next: 'on_the_way' },
        on_the_way: { label: 'Start Work', next: 'in_progress' },
        in_progress: { label: 'Mark as Completed', next: 'completed' },
    };

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <View style={{ padding: 24 }}><SkeletonList count={3} type="request" /></View>
        </View>
    );

    if (error || !job) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Tracker */}
                {artisanStatus !== 'new' && artisanStatus !== 'declined' && (
                    <Animated.View entering={FadeInDown.delay(100)}>
                        <Card style={{ marginBottom: 24, padding: 20 }}>
                            <Text style={[Typography.h3, { marginBottom: 20 }]}>Job Progress</Text>
                            <StatusTimeline steps={getArtisanJobSteps(artisanStatus)} />
                        </Card>
                    </Animated.View>
                )}

                {/* Job Details */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <Card style={{ padding: 20 }}>
                        <Text style={[Typography.h3, { marginBottom: 20 }]}>Client Request</Text>

                        <DetailItem label="Client Name" value={job.clientName} capitalize />
                        <DetailItem label="Service required" value={job.category} capitalize />
                        <DetailItem label="Job Description" value={job.description} />
                        <DetailItem label="Location" value={`${job.location.area}, ${job.location.city}`} capitalize />
                        <DetailItem label="Agreed Budget" value={formatNaira(job.budget)} />
                        <DetailItem label="Urgency" value={job.urgency.replace('_', ' ')} capitalize />
                    </Card>
                </Animated.View>

                {/* Location Map Placeholder */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            marginTop: 24,
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.lg,
                            borderWidth: 1.5,
                            borderColor: Colors.cardBorder,
                            padding: 24,
                            alignItems: 'center',
                            ...Shadows.sm
                        }}
                    >
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.primaryLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12
                        }}>
                            <Ionicons name="map" size={24} color={Colors.primary} />
                        </View>
                        <Text style={Typography.h3}>Navigate to Client</Text>
                        <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 4 }]}>
                            {job.location.area}, {job.location.city}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 40, gap: 16 }}>
                    {artisanStatus === 'new' && (
                        <View style={{ gap: 12 }}>
                            <PrimaryButton title="Accept Job Request" onPress={handleAccept} />
                            <SecondaryButton title="Decline Request" onPress={handleDecline} />
                        </View>
                    )}

                    {statusActions[artisanStatus] && (
                        <PrimaryButton
                            title={statusActions[artisanStatus].label}
                            onPress={() => handleStatusUpdate(statusActions[artisanStatus].next)}
                        />
                    )}

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <SecondaryButton
                            title="Message"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                            style={{ flex: 1 }}
                        />
                        <SecondaryButton
                            title="Call"
                            onPress={() => { }}
                            style={{ flex: 1 }}
                            icon={<Ionicons name="call-outline" size={18} color={Colors.primary} />}
                        />
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

function DetailItem({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={Typography.label}>{label}</Text>
            <Text style={[Typography.body, {
                marginTop: 4,
                color: Colors.text,
                textTransform: capitalize ? 'capitalize' : 'none'
            }]}>{value}</Text>
        </View>
    );
}
