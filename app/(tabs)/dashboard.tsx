import { SubAppHeader } from '@/components/AppSubHeader';
import { RequestCard } from '@/components/ui/RequestCard';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan, mapJob, mapEarnings } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
// ... existing imports
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
} from 'react-native-reanimated';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delay, accent }: {
    label: string;
    value: string;
    icon: string;
    delay: number;
    accent?: boolean;
}) {
    return (
        <Animated.View
            entering={FadeInUp.delay(delay).springify()}
            style={{ flex: 1 }}
        >
<<<<<<< HEAD
            <View className={`${
                accent ? "bg-primary border-transparent" : "bg-white border-card-border"
            } rounded-2xl p-5 border shadow-sm`}>
                <View className={`w-10 h-10 rounded-xl items-center justify-center mb-3.5 shadow-sm ${
                    accent ? "bg-white/15" : "bg-background"
                }`}>
                    <Ionicons 
                        name={icon as any} 
                        size={18} 
                        color={accent ? "#FFFFFF" : "#00120C"} 
                    />
                </View>
                <Text className={`text-h1 text-[24px] mb-0.5 font-jakarta-extrabold italic ${
                    accent ? "text-white" : "text-ink"
                }`}>
                    {value}
                </Text>
                <Text className={`text-label text-[9px] tracking-[1.5px] uppercase font-jakarta-bold italic ${
                    accent ? "text-white/60" : "text-muted"
                }`}>
=======
            <View style={{
                backgroundColor: accent ? Colors.primary : Colors.surface,
                borderRadius: Radius.sm,
                padding: 18,
                borderWidth: 1,
                borderColor: accent ? 'transparent' : Colors.cardBorder,
                ...Shadows.sm,
            }}>
                <View style={{
                    width: 36, height: 36,
                    borderRadius: 10,
                    backgroundColor: accent ? 'rgba(255,255,255,0.1)' : Colors.canvas,
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                }}>
                    <Ionicons name={icon as any} size={18} color={accent ? Colors.white : Colors.primary} />
                </View>
                <Text style={[Typography.data, {
                    color: accent ? Colors.white : Colors.ink,
                    fontSize: 22,
                    marginBottom: 4,
                }]}>
                    {value}
                </Text>
                <Text style={[Typography.label, {
                    color: accent ? 'rgba(255,255,255,0.55)' : Colors.muted,
                    fontSize: 9,
                    letterSpacing: 0.8,
                }]}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    {label}
                </Text>
            </View>
        </Animated.View>
    );
}

// ─── Online Toggle ──────────────────────────────────────────────────────────────
function OnlineToggle({ online, onToggle }: { online: boolean; onToggle: () => void }) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(0.92, { damping: 6 }),
            withSpring(1, { damping: 10 })
        );
        onToggle();
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
<<<<<<< HEAD
                className={`flex-row items-center gap-2.5 px-5 py-3 rounded-full border-[1.5px] shadow-sm ${
                    online ? "bg-success/10 border-success/30" : "bg-white border-card-border"
                }`}
            >
                <View className={`w-2.5 h-2.5 rounded-full ${online ? "bg-success shadow-[0_0_8px_rgba(26,178,108,0.6)]" : "bg-muted"}`} />
                <Text className={`text-[12px] font-jakarta-extrabold italic tracking-tight ${online ? "text-success" : "text-muted"}`}>
                    {online ? "CONNECTED" : "OFFLINE"}
=======
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: online ? Colors.successLight : Colors.canvas,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: online ? Colors.success + '60' : Colors.cardBorder,
                }}
            >
                <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: online ? Colors.success : Colors.muted,
                }} />
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans-Bold',
                    color: online ? Colors.success : Colors.muted,
                }}>
                    {online ? "AVAILABLE" : "OFFLINE"}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

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

    const newJobs = React.useMemo(() => jobs.filter(j => j.status === 'submitted'), [jobs]);
    const activeJobs = React.useMemo(() => jobs.filter(j => ['matched', 'scheduled', 'in_progress'].includes(j.status)), [jobs]);

    const firstName = user?.name?.split(' ')[0] || 'TRIAL OPERATIVE';

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
=======
        <View style={{ flex: 1, backgroundColor: Colors.canvas }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <SubAppHeader
                showLocation={false}
                label="COMMAND CENTER"
                title={`MASTER ${firstName.toUpperCase()}`}
                description="Monitor your operational yield and mission queue."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView
<<<<<<< HEAD
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00120C" />}
=======
                contentContainerStyle={{ padding: 24, paddingBottom: 130 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Verification Protocol Banner ──────────────────────────────────── */}
                {verificationStatus !== 'approved' && (
<<<<<<< HEAD
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
=======
                    <Animated.View entering={FadeInUp.springify()} style={{ marginBottom: 20 }}>
                        <TouchableOpacity 
                            onPress={() => router.push('/verification')}
                            activeOpacity={0.9}
                            style={{
                                backgroundColor: verificationStatus === 'pending' ? Colors.warning + '10' : Colors.error + '10',
                                borderRadius: Radius.sm,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: verificationStatus === 'pending' ? Colors.warning + '20' : Colors.error + '20',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12
                            }}
                        >
                            <View style={{ 
                                width: 36, height: 36, borderRadius: 18, 
                                backgroundColor: verificationStatus === 'pending' ? Colors.warning : Colors.error,
                                alignItems: 'center', justifyContent: 'center' 
                            }}>
                                <Ionicons 
                                    name={verificationStatus === 'pending' ? "time-outline" : "alert-circle-outline"} 
                                    size={20} 
                                    color={Colors.white} 
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[Typography.label, { fontSize: 13, color: Colors.ink, fontFamily: 'PlusJakartaSans-Bold' }]}>
                                    {verificationStatus === 'pending' ? "Verification in Progress" : "Complete Your Verification"}
                                </Text>
                                <Text style={[Typography.bodySmall, { color: Colors.muted, fontSize: 11, marginTop: 1 }]}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                    {verificationStatus === 'pending' 
                                        ? "Reviewing your credentials. Operational capacity limited." 
                                        : "Complete your identity profile to unlock tactical features."}
                                </Text>
                            </View>
<<<<<<< HEAD
                            <Ionicons name="chevron-forward" size={18} color="#64748B" />
=======
                            <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        </TouchableOpacity>
                    </Animated.View>
                )}

<<<<<<< HEAD
                {/* ─── Status Control ───────────────────────────────────────────── */}
                <View className="mb-6 flex-row justify-end">
=======
                {/* ─── Status Row ───────────────────────────────────────────── */}
                <View style={{ marginBottom: 32, flexDirection: 'row', justifyContent: 'flex-end' }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    <Animated.View entering={FadeInRight.delay(160).springify()}>
                        <OnlineToggle online={artisanOnline} onToggle={() => setArtisanOnline(!artisanOnline)} />
                    </Animated.View>
                </View>

<<<<<<< HEAD
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
=======
                {/* ─── Earnings Hero Card ───────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 20 }}>
                    <View style={{
                        backgroundColor: Colors.primary,
                        borderRadius: Radius.sm,
                        padding: 24,
                        ...Shadows.brand,
                        overflow: 'hidden',
                    }}>
                        {/* Decorative */}
                        <View style={{ position: 'absolute', right: -30, top: -30, opacity: 0.04 }}>
                            <Ionicons name="wallet" size={200} color={Colors.white} />
                        </View>

                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                            Total Earnings
                        </Text>
                        <Text style={{ fontSize: 38, fontFamily: 'Inter-Bold', color: Colors.white, letterSpacing: -1, marginBottom: 4 }}>
                            ₦{Number(earnings?.totalEarnings ?? 0).toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                            All time · Updated just now
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View>
                                <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                                    This week
                                </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Inter-Bold', color: Colors.white, marginTop: 2 }}>
                                    ₦{Number(earnings?.thisWeek ?? 0).toLocaleString()}
                                </Text>
                            </View>
                            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                            <View>
                                <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                                    Completed
                                </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Inter-Bold', color: Colors.white, marginTop: 2 }}>
                                    {profile?.completedJobs ?? 0} jobs
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

<<<<<<< HEAD
                {/* ─── Operational Metrics ───────────────────────────────────────────── */}
                <View className="flex-row gap-4 mb-12 px-1">
=======
                {/* ─── Stats Row ───────────────────────────────────────────── */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
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
=======
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.muted, marginBottom: 4 }]}>Incoming</Text>
                            <Text style={[Typography.h2, { fontSize: 20 }]}>New Job Requests</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/jobs')}
                            style={{
                                backgroundColor: Colors.canvas,
                                paddingVertical: 6,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.primary }}>
                                All Jobs
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <SkeletonList count={2} type="request" />
                    ) : error ? (
                        <ErrorState onRetry={load} />
                    ) : newJobs.length === 0 ? (
<<<<<<< HEAD
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
=======
                        <View style={{
                            backgroundColor: Colors.surface,
                            borderRadius: Radius.xl,
                            padding: 48,
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            borderColor: Colors.cardBorder,
                        }}>
                            <View style={{
                                width: 60, height: 60, borderRadius: 20,
                                backgroundColor: Colors.canvas,
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <Ionicons name="notifications-off-outline" size={28} color={Colors.muted} />
                            </View>
                            <Text style={[Typography.h3, { textAlign: 'center', marginBottom: 8 }]}>
                                No jobs yet
                            </Text>
                            <Text style={[Typography.body, { textAlign: 'center', fontSize: 14 }]}>
                                Stay online and you&apo;ll be notified when a job comes in.
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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

