import { AppHeader } from '@/components/AppHeader';
import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { StatusTimeline, getJobStatusSteps } from '@/components/ui/StatusTimeline';
import { jobApi } from '@/services/api';
import { mapJob } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { JobRequest } from '@/types';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DetailItem } from '@/components/ui/DetailItem';

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
            if (!id) return;
            const row = await jobApi.getById(id) as any;
            if (row) {
                setJob(mapJob(row));
            }
        } catch (err) {
            console.error('[RequestDetails] Load error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleCancel = () => {
        Alert.alert('CANCEL REQUEST', 'Are you sure you want to cancel this request?', [
            { text: 'NO, GO BACK', style: 'cancel' },
            {
                text: 'YES, CANCEL',
                style: 'destructive',
                onPress: async () => {
                    if (id) {
                        try {
                            await jobApi.cancel(id);
                            updateStoreJob(id, 'cancelled');
                            setJob((j) => j ? { ...j, status: 'cancelled' } : null);
                        } catch (err: any) {
                            Alert.alert('System Error', err.message || 'Failed to cancel request');
                        }
                    }
                },
            },
        ]);
    };

    if (loading) return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.4} scale={1.3} />
            </View>
            <AppHeader title="REQUEST LOG" showBack onBack={() => router.back()} showNotification={false} />
            <View className="p-6"><SkeletonList count={3} /></View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.4} />
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
            <View style={{ padding: 24 }}><SkeletonList count={3} /></View>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
        </View>
    );

    if (error || !job) return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <AppHeader title="REQUEST LOG" showBack onBack={() => router.back()} showNotification={false} />
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title="Request Details" showBack onBack={() => router.back()} showNotification={false} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <ErrorState onRetry={load} />
        </View>
    );

    const isTerminated = job.status === 'cancelled';

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
            <AppHeader title="MISSION LOG" showBack onBack={() => router.back()} showNotification={false} />
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <AppHeader title="Mission Log" showBack onBack={() => router.back()} showNotification={false} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
<<<<<<< HEAD
                {/* ─── Service Identity ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.springify()} className="mb-10 px-1">
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION PARAMETERS</Text>
                    </View>
                    <Text className="text-h1 text-[40px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">{job.category.replace('_', ' / ')}</Text>
                    <View className="flex-row items-center gap-4 mt-6">
                        <View className={`px-4 py-2 rounded-xl border shadow-sm ${
                            isTerminated ? 'bg-error/10 border-error/20' : 'bg-success/10 border-success/20'
                        }`}>
                            <Text className={`text-label text-[11px] font-jakarta-extrabold uppercase tracking-widest italic ${
                                isTerminated ? 'text-error' : 'text-success'
                            }`}>
                                {isTerminated ? 'CANCELLED' : 'ACTIVE'}
                            </Text>
                        </View>
                        <Text className="text-label text-ink/30 text-[10px] uppercase font-jakarta-extrabold italic tracking-[2px]">REF: {job.id.substring(0, 8)}</Text>
=======
                {/* Service Identity */}
                <Animated.View entering={FadeInDown.springify()} style={{ marginBottom: 40 }}>
                    <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8, letterSpacing: 2 }]}>SERVICE TYPE</Text>
                    <Text style={[Typography.h1, { fontSize: 32 }]}>{job.category.toUpperCase().replace('_', ' / ')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
                        <View style={{
                            backgroundColor: isTerminated ? Colors.error + '10' : Colors.success + '10',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: Radius.xs,
                            borderWidth: 1,
                            borderColor: isTerminated ? Colors.error : Colors.success
                        }}>
                            <Text style={[Typography.label, { color: isTerminated ? Colors.error : Colors.success, fontSize: 10, fontWeight: '900' }]}>
                                {isTerminated ? 'CANCELLED' : 'ACTIVE'}
                            </Text>
                        </View>
                        <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]}>REF: {job.id.substring(0, 8).toUpperCase()}</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    </View>
                </Animated.View>

                {/* ─── Status Timeline ───────────────────────────────────────────── */}
                {!isTerminated && (
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
<<<<<<< HEAD
                        <View className="mb-10 p-8 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[38px]">
                            <Text className="text-label text-ink/40 mb-8 uppercase tracking-[5px] text-[10px] font-jakarta-extrabold italic">MISSION PROGRESS</Text>
=======
                        <Card style={{ marginBottom: 24, padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 20 }]}>PROGRESS TRACKER</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            <StatusTimeline steps={getJobStatusSteps(job.status)} />
                        </View>
                    </Animated.View>
                )}

                {/* ─── Operational Intel ────────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
<<<<<<< HEAD
                    <View className="p-10 bg-white border-[1.5px] border-card-border shadow-2xl rounded-[42px]">
                        <Text className="text-label text-primary mb-10 uppercase tracking-[6px] text-[11px] font-jakarta-extrabold italic">CORE INTEL</Text>
=======
                    <Card style={{ padding: 24, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.cardBorder, ...Shadows.sm }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 24 }]}>DETAILS</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)

                        <DetailItem label="TARGET AREA" value={job.location.area.toUpperCase()} />
                        <DetailItem label="OPERATION DEBRIEF" value={job.description} isDescription />
                        <DetailItem label="MISSION CREDITS" value={formatNaira(job.budget)} isPrice />
                        <DetailItem label="URGENCY LEVEL" value={job.urgency.toUpperCase().replace('_', ' ')} isUrgency />
                        <DetailItem label="INITIALIZED AT" value={formatDate(job.createdAt).toUpperCase()} />
                    </View>
                </Animated.View>

                {/* ─── Operative Assigned ────────────────────────────────────────── */}
                {job.artisanName && (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
<<<<<<< HEAD
                        <View className="mt-10 p-8 bg-ink shadow-3xl rounded-[42px] border border-white/10 overflow-hidden">
                             {/* Decorative Background Thread */}
                            <View className="absolute -top-10 -right-10 opacity-10">
                                <Ionicons name="shield-checkmark" size={180} color="white" />
                            </View>

                            <Text className="text-label text-white/40 mb-8 uppercase tracking-[6px] text-[10px] font-jakarta-extrabold italic">OPERATIVE ASSIGNED</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                className="flex-row items-center gap-5 bg-white/10 p-6 rounded-[32px] border border-white/20 shadow-inner backdrop-blur-md active:scale-[0.98]"
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center border border-white/40 shadow-sm">
                                    <Text className="text-h3 text-ink uppercase font-jakarta-extrabold text-[20px]">{job.artisanName[0]}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[18px] font-jakarta-extrabold text-white uppercase italic tracking-tighter" numberOfLines={1}>{job.artisanName}</Text>
                                    <Text className="text-label text-primary mt-1.5 text-[10px] uppercase font-jakarta-extrabold tracking-[3px] italic">VIEW PROFILE</Text>
                                </View>
                                <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20">
                                    <Ionicons name="chevron-forward" size={20} color="white" />
                                </View>
=======
                        <Card style={{ marginTop: 24, padding: 24, backgroundColor: Colors.primary, ...Shadows.md }}>
                            <Text style={[Typography.label, { color: Colors.white, marginBottom: 20, opacity: 0.6 }]}>ARTISAN ASSIGNED</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: 16,
                                    borderRadius: Radius.md,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.2)'
                                }}
                                onPress={() => job.artisanId && router.push({ pathname: '/artisan-profile', params: { id: job.artisanId } })}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: Radius.xs,
                                    backgroundColor: Colors.white,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={[Typography.h3, { color: Colors.primary }]}>{job.artisanName[0].toUpperCase()}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[Typography.h3, { color: Colors.white }]}>{job.artisanName.toUpperCase()}</Text>
                                    <Text style={[Typography.label, { color: Colors.accent, fontSize: 8, marginTop: 4 }]}>VIEW PROFILE</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.white} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

<<<<<<< HEAD
                {/* ─── Authorization Actions ─────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-12 gap-6 px-1">
                    {job.artisanName && (
                        <View className="flex-row gap-5">
                            <TouchableOpacity
=======
                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48, gap: 16 }}>
                    {job.artisanName && (
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <SecondaryButton
                                title="MESSAGE"
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                onPress={async () => {
                                    try {
                                        const { threadApi } = await import('@/services/api');
                                        if (!job.artisanId) return Alert.alert('Stay Tuned', 'An artisan will be matched to your request soon.');
                                        const res = await threadApi.create({ 
                                            artisanProfileId: job.artisanId,
                                            jobRequestId: job.id 
                                        });
                                        router.push({ pathname: '/chat', params: { threadId: res.id } });
                                    } catch (err) {
                                        console.error('[RequestDetails] Chat error:', err);
                                        Alert.alert('Error', 'Unable to start chat at this time.');
                                    }
                                }}
<<<<<<< HEAD
                                className="flex-1 h-18 rounded-[24px] border-[2.5px] border-primary bg-white items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00120C" />
                                <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">MESSAGE</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={() => Alert.alert("Voice Link", "Initializing secure encrypted line...")}
                                className="flex-1 h-18 rounded-[24px] border-[2.5px] border-primary bg-white items-center justify-center flex-row gap-3 shadow-lg active:bg-gray-50"
                            >
                                <Ionicons name="call-outline" size={20} color="#00120C" />
                                <Text className="text-primary font-jakarta-extrabold uppercase italic tracking-tighter text-[13px]">CALL</Text>
                            </TouchableOpacity>
=======
                                style={{ flex: 1, height: 64, borderRadius: Radius.md, borderColor: Colors.primary, borderWidth: 1.5 }}
                                textStyle={[Typography.label, { color: Colors.primary }]}
                            />
                            <SecondaryButton
                                title="CALL"
                                onPress={() => { }}
                                style={{ flex: 1, height: 64, borderRadius: Radius.md, borderColor: Colors.primary, borderWidth: 1.5 }}
                                textStyle={[Typography.label, { color: Colors.primary }]}
                                icon={<Ionicons name="call" size={18} color={Colors.primary} />}
                            />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        </View>
                    )}

                    {job.status === 'completed' && (
                        <PrimaryButton
                            title="RATE & REVIEW OPERATIVE"
                            onPress={() => router.push({ pathname: '/rate-review', params: { jobId: job.id } })}
                            variant="accent"
<<<<<<< HEAD
                            className="h-18 rounded-[24px] shadow-2xl border border-white/10"
=======
                            style={{ height: 64, borderRadius: Radius.md }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        />
                    )}

                    {!['completed', 'cancelled'].includes(job.status) && (
                        <TouchableOpacity
<<<<<<< HEAD
                            className="items-center justify-center p-6 rounded-[24px] border-[2px] border-error/30 mt-4 bg-white/50 shadow-sm active:bg-error/10"
                            onPress={handleCancel}
                        >
                            <Text className="text-[12px] text-error font-jakarta-extrabold tracking-[4px] uppercase italic">CANCEL MISSION PROTOCOL</Text>
=======
                            style={{
                                alignItems: 'center',
                                padding: 20,
                                borderRadius: Radius.md,
                                borderWidth: 1.5,
                                borderColor: Colors.error,
                                marginTop: 12,
                                backgroundColor: Colors.white
                            }}
                            onPress={handleCancel}
                        >
                            <Text style={[Typography.label, { color: Colors.error, fontWeight: '900', letterSpacing: 1 }]}>CANCEL REQUEST</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        </TouchableOpacity>
                    )}
                </Animated.View>
                
                <View className="mt-16 items-center opacity-20 pointer-events-none">
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Operational Report Log • Secure v4.2</Text>
                </View>
            </ScrollView>
        </View>
    );
}
<<<<<<< HEAD
=======

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted, marginBottom: 8 }]}>{label}</Text>
            <Text style={[Typography.body, {
                color: Colors.primary,
                fontWeight: '700',
                fontSize: 15,
                lineHeight: 22
            }]}>{value}</Text>
        </View>
    );
}

>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
