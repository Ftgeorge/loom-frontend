import { SubAppHeader } from '@/components/AppSubHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob, mapEarnings } from '@/services/mappers';
import { useAppStore } from '@/store';
import type { Artisan, JobRequest, EarningsSummary } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
} from 'react-native-reanimated';

import { StatCard } from '@/components/dashboard/StatCard';
import { OnlineToggle } from '@/components/dashboard/OnlineToggle';

export default function ArtisanDashboard() {
    const router = useRouter();
    const { user, artisanOnline, setArtisanOnline } = useAppStore();
    const [jobs, setJobs] = useState<JobRequest[]>([]);
    const [profile, setProfile] = useState<Artisan | null>(null);
    const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setError(false);
            if (!refreshing) setLoading(true);

            const [jobsRes, profileRes, earningsRes, verifyRes] = await Promise.all([
                jobApi.list({ limit: 30 }),
                artisanApi.meProfile(),
                artisanApi.meEarnings(),
                artisanApi.getVerification().catch(() => null)
            ]);

            setJobs(((jobsRes.results || []) as any[]).map(mapJob));
            if (profileRes) setProfile(mapArtisan(profileRes));
            setEarnings(mapEarnings(earningsRes));
            setVerificationStatus(verifyRes?.status || 'unverified');
        } catch (err) {
            console.error('[Dashboard] Error loading data:', err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => { load(); }, [load]);
    const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

    const newJobs = React.useMemo(() => jobs.filter(j => j.status === 'submitted' || j.status === 'matched'), [jobs]);
    const activeJobs = React.useMemo(() => jobs.filter(j => ['accepted', 'on_the_way', 'in_progress'].includes(j.status)), [jobs]);

    const firstName = user?.name?.split(' ')[0] || 'TRIAL OPERATIVE';

    return (
        <View className="flex-1 bg-background">
            <SubAppHeader
                showLocation={false}
                label="COMMAND CENTER"
                title={`MASTER ${firstName.toUpperCase()}`}
                description="Monitor your operational yield and mission queue."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Verification Protocol Banner ──────────────────────────────────── */}
                {verificationStatus !== 'approved' && (
                    <Animated.View entering={FadeInUp.springify()} className="mb-6">
                        <TouchableOpacity 
                            onPress={() => router.push('/verification')}
                            activeOpacity={0.9}
                            className={`flex-row items-center gap-4 p-5 rounded-2xl border-[1.5px] shadow-sm ${
                                verificationStatus === 'pending' ? 'bg-warning/10 border-warning/30' : 'bg-destructive/10 border-destructive/30'
                            }`}
                        >
                            <View className={`w-11 h-11 rounded-2xl items-center justify-center shadow-sm ${
                                verificationStatus === 'pending' ? 'bg-warning' : 'bg-destructive'
                            }`}>
                                <Ionicons 
                                    name={verificationStatus === 'pending' ? "radio-outline" : "alert-circle-outline"} 
                                    size={24} 
                                    color="white" 
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-h3 text-ink text-[15px] font-jakarta-extrabold italic uppercase">
                                    {verificationStatus === 'pending' ? "Verification Pending" : "Identity Incomplete"}
                                </Text>
                                <Text className="text-body-sm text-ink/60 text-[12px] mt-1 font-jakarta-medium leading-4">
                                    {verificationStatus === 'pending' 
                                        ? "Reviewing your credentials. Operational capacity limited." 
                                        : "Complete your identity profile to unlock tactical features."}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* ─── Status Control ───────────────────────────────────────────── */}
                <View className="mb-6 flex-row justify-end">
                    <Animated.View entering={FadeInRight.delay(160).springify()}>
                        <OnlineToggle online={artisanOnline} onToggle={() => setArtisanOnline(!artisanOnline)} />
                    </Animated.View>
                </View>

                {/* ─── Financial Yield Hero Card ───────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-6">
                    <View className="bg-primary rounded-[28px] p-7 shadow-2xl overflow-hidden border border-primary/20">
                        {/* High-Impact Decorative Overlay */}
                        <View className="absolute -right-12 -top-12 opacity-10">
                            <Ionicons name="stats-chart" size={240} color="white" />
                        </View>

                        <View className="flex-row items-center gap-2 mb-3">
                            <Ionicons name="cash-outline" size={12} color="white" className="opacity-60" />
                            <Text className="text-label text-[10px] font-jakarta-extrabold text-white/60 tracking-[2.5px] uppercase italic">
                                CUMULATIVE YIELD
                            </Text>
                        </View>
                        <Text className="text-h1 text-[44px] font-jakarta-extrabold italic text-white tracking-[-1.5px] mb-1">
                            ₦{Number(earnings?.totalEarnings ?? 0).toLocaleString()}
                        </Text>
                        <Text className="text-body-sm font-jakarta-bold text-white/40 mb-8 uppercase tracking-widest text-[10px]">
                            REAL-TIME AUDITED • SYNCED NOW
                        </Text>

                        <View className="flex-row gap-8 items-center">
                            <View>
                                <Text className="text-label text-[9px] font-jakarta-extrabold text-white/40 tracking-[1px] uppercase italic mb-1">
                                    WEEKLY CYCLE
                                </Text>
                                <Text className="text-h2 text-[20px] font-jakarta-extrabold italic text-white">
                                    ₦{Number(earnings?.thisWeek ?? 0).toLocaleString()}
                                </Text>
                            </View>
                            <View className="w-[1px] h-10 bg-white/10" />
                            <View>
                                <Text className="text-label text-[9px] font-jakarta-extrabold text-white/40 tracking-[1px] uppercase italic mb-1">
                                    MISSIONS
                                </Text>
                                <Text className="text-h2 text-[20px] font-jakarta-extrabold italic text-white">
                                    {profile?.completedJobs ?? 0} SUCCESS
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Operational Metrics ───────────────────────────────────────────── */}
                <View className="flex-row gap-4 mb-12 px-1">
                    <StatCard
                        label="INCOMING"
                        value={`${newJobs.length}`}
                        icon="flash"
                        delay={280}
                        accent
                    />
                    <StatCard
                        label="ACTIVE"
                        value={`${activeJobs.length}`}
                        icon="cog"
                        delay={360}
                    />
                    <StatCard
                        label="VERDICT"
                        value={profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : '5.0'}
                        icon="ribbon"
                        delay={440}
                    />
                </View>

                {/* ─── Mission Queue ─────────────────────────────────────────────── */}
                <View>
                    <View className="flex-row justify-between items-end mb-6 px-1">
                        <View className="flex-1">
                            <View className="flex-row items-center gap-1.5 mb-1.5">
                                <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                <Text className="text-label text-[10px] text-primary tracking-[2px] uppercase font-jakarta-extrabold italic">
                                    REQUEST TERMINAL
                                </Text>
                            </View>
                            <Text className="text-[26px] uppercase italic font-jakarta-extrabold text-ink tracking-tighter">
                                MISSION QUEUE
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/jobs')}
                            className="bg-white px-4 py-2 rounded-xl border border-card-border shadow-sm active:bg-gray-50"
                        >
                            <Text className="text-[11px] font-jakarta-extrabold text-primary italic uppercase tracking-tighter">
                                FULL LOGS
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} type="request" />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : newJobs.length === 0 ? (
                        <View className="bg-white rounded-[28px] p-12 items-center border-[2px] border-dashed border-card-border shadow-inner">
                            <View className="w-20 h-20 rounded-[30px] bg-background items-center justify-center mb-6 shadow-sm border border-card-border">
                                <Ionicons name="radio-outline" size={42} color="#94A3B8" />
                            </View>
                            <Text className="text-h3 text-center mb-2 uppercase font-jakarta-extrabold italic text-ink/80">
                                NO FREQUENCIES DETECTED
                            </Text>
                            <Text className="text-body text-center text-[14px] text-ink/50 max-w-[260px] font-jakarta-medium">
                                Maintain active status to capture localized job transmissions.
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-4">
                            {newJobs.slice(0, 4).map((job, index) => (
                                <Animated.View key={job.id} entering={FadeInDown.delay(500 + index * 80).springify()}>
                                    <RequestCard
                                        job={job}
                                        isArtisanView
                                        onPress={() => router.push({ pathname: '/job-details', params: { id: job.id } })}
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
                
                <View className="mt-16 items-center flex-row justify-center gap-2 opacity-20">
                    <Ionicons name="shield-checkmark" size={14} color="#64748B" />
                    <Text className="text-[9px] text-muted uppercase tracking-[3px] font-jakarta-bold italic">Command Interface Encrypted • Auth v3.2</Text>
                </View>
            </ScrollView>
        </View>
    );
}

