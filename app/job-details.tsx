import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getArtisanJobSteps } from '@/components/ui/StatusTimeline';
import { fetchJobById, updateJobStatus } from '@/services/mockApi';
import { Colors } from '@/theme';
import type { ArtisanJobStatus, JobRequest } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

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
            const data = await fetchJobById(id || '');
            if (data) {
                setJob(data);
                setArtisanStatus(data.artisanStatus || 'new');
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleAccept = async () => {
        setArtisanStatus('accepted');
        if (id) await updateJobStatus(id, 'matched');
        setJob((j) => j ? { ...j, status: 'matched', artisanStatus: 'accepted' } : null);
    };

    const handleDecline = () => {
        Alert.alert('Decline Job', 'Are you sure? This job will be removed from your list.', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Decline', style: 'destructive', onPress: () => router.back() },
        ]);
    };

    const handleStatusUpdate = (newStatus: ArtisanJobStatus) => {
        setArtisanStatus(newStatus);
        setJob((j) => j ? { ...j, artisanStatus: newStatus } : null);
    };

    const statusActions: Record<string, { label: string; next: ArtisanJobStatus }> = {
        accepted: { label: "I'm On My Way", next: 'on_the_way' },
        on_the_way: { label: 'Start Work', next: 'in_progress' },
        in_progress: { label: 'Mark as Completed', next: 'completed' },
    };

    if (loading) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-5"><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Job Details" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Status Tracker */}
                {artisanStatus !== 'new' && artisanStatus !== 'declined' && (
                    <Card style={{ marginBottom: 20 }}>
                        <Text className="text-lg font-bold mb-4">Job Progress</Text>
                        <StatusTimeline steps={getArtisanJobSteps(artisanStatus)} />
                    </Card>
                )}

                {/* Job Details */}
                <Card>
                    <Text className="text-lg font-bold mb-4">Client Request</Text>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Client</Text>
                        <Text className="text-base font-medium capitalize">{job.clientName}</Text>
                    </View>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Category</Text>
                        <Text className="text-base font-medium capitalize">{job.category}</Text>
                    </View>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Description</Text>
                        <Text className="text-sm text-gray-600">{job.description}</Text>
                    </View>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Location</Text>
                        <Text className="text-base font-medium capitalize">{job.location.area}, {job.location.city}</Text>
                    </View>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Budget</Text>
                        <Text className="text-base font-medium capitalize">{formatNaira(job.budget)}</Text>
                    </View>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Urgency</Text>
                        <Text className="text-base font-medium capitalize">{job.urgency.replace('_', ' ')}</Text>
                    </View>
                </Card>

                {/* Location placeholder */}
                <Card className="mt-5 items-center py-8">
                    <Ionicons name="map-outline" size={40} color={Colors.gray400} />
                    <Text className="text-xs text-gray-400 mt-1">Location preview</Text>
                    <Text className="text-sm text-gray-600 mt-1 font-medium">{job.location.area}, {job.location.city}</Text>
                </Card>

                {/* Actions */}
                <View className="mt-8 gap-4">
                    {artisanStatus === 'new' && (
                        <>
                            <PrimaryButton title="Accept Job" onPress={handleAccept} />
                            <SecondaryButton title="Decline" onPress={handleDecline} />
                        </>
                    )}

                    {statusActions[artisanStatus] && (
                        <PrimaryButton
                            title={statusActions[artisanStatus].label}
                            onPress={() => handleStatusUpdate(statusActions[artisanStatus].next)}
                        />
                    )}

                    <View className="flex-row gap-4">
                        <SecondaryButton
                            title="Message"
                            onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                            style={{ flex: 1 }}
                        />
                        <SecondaryButton title="Call" onPress={() => { }} style={{ flex: 1 }} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
