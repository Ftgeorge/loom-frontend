import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getJobStatusSteps } from '@/components/ui/StatusTimeline';
import { fetchJobById, updateJobStatus } from '@/services/mockApi';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import type { JobRequest } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RequestDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateJobStatus: updateStoreJob } = useAppStore();
    const [job, setJob] = useState<JobRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await fetchJobById(id || '');
            if (data) setJob(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleCancel = () => {
        Alert.alert('Cancel Request', 'Are you sure you want to cancel this request?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    if (id) {
                        await updateJobStatus(id, 'cancelled');
                        updateStoreJob(id, 'cancelled');
                        setJob((j) => j ? { ...j, status: 'cancelled' } : null);
                    }
                },
            },
        ]);
    };

    if (loading) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-5"><SkeletonList count={3} /></View>
        </View>
    );

    if (error || !job) return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View className="flex-1 bg-operis-bg">
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Status Timeline */}
                {job.status !== 'cancelled' && (
                    <Card style={{ marginBottom: 20 }}>
                        <Text className="text-lg font-bold mb-4">Status</Text>
                        <StatusTimeline steps={getJobStatusSteps(job.status)} />
                    </Card>
                )}

                {/* Details */}
                <Card>
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Category</Text>
                        <Text className="text-base font-medium capitalize">{job.category === 'not_sure' ? 'Not Sure' : job.category}</Text>
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
                    <View className="mb-4">
                        <Text className="text-xs text-gray-500">Submitted</Text>
                        <Text className="text-base font-medium capitalize">{formatDate(job.createdAt)}</Text>
                    </View>
                    {job.scheduledDate && (
                        <View className="mb-4">
                            <Text className="text-xs text-gray-500">Scheduled</Text>
                            <Text className="text-base font-medium capitalize">{job.scheduledDate} at {job.scheduledTime}</Text>
                        </View>
                    )}
                </Card>

                {/* Artisan info */}
                {job.artisanName && (
                    <Card className="mt-5">
                        <Text className="text-lg font-bold mb-4">Artisan</Text>
                        <TouchableOpacity
                            className="flex-row items-center gap-4"
                            onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                        >
                            <View className="w-10 h-10 rounded-full bg-sage-200 items-center justify-center">
                                <Text className="font-bold text-olive">{job.artisanName[0]}</Text>
                            </View>
                            <Text className="text-base font-semibold flex-1">{job.artisanName}</Text>
                            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                        </TouchableOpacity>
                    </Card>
                )}

                {/* Actions */}
                <View className="mt-8 gap-4">
                    {job.artisanName && (
                        <View className="flex-row gap-4">
                            <SecondaryButton
                                title="Message"
                                onPress={() => router.push({ pathname: '/chat', params: { threadId: 't1' } })}
                                style={{ flex: 1 }}
                            />
                            <SecondaryButton title="Call" onPress={() => { }} style={{ flex: 1 }} />
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="Rate & Review"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity className="items-center p-4" onPress={handleCancel}>
                            <Text className="text-base text-red-500 font-medium">Cancel Request</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
