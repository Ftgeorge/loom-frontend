import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, StretchInY } from 'react-native-reanimated';

export default function EarningsScreen() {
    const router = useRouter();
    const { language, setEarnings, earnings } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            const data = await artisanApi.meEarnings();
            const totalEarned = Number(data.total_earned || 0);
            const pendingPayout = Number(data.pending_payout || 0);
            
            // Map transactions from backend TransactionRow to frontend Transaction
            const txs = (data.transactions || []).map((t: any) => ({
                id: t.id,
                description: t.description,
                amount: Number(t.amount),
                date: t.created_at,
                type: t.type,
                status: t.status
            }));

            setEarnings({
                totalEarnings: totalEarned,
                thisWeek: totalEarned, // For now, use total as we don't have weekly split yet
                thisMonth: totalEarned,
                pendingPayments: pendingPayout,
                weeklyData: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => ({
                    day,
                    amount: 0, // Should be calculated if we add temporal queries
                })),
                transactions: txs,
            });
        } catch (err) {
            console.error("Earnings load error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [setEarnings]);

    useEffect(() => { load(); }, [load]);

    const maxBar = React.useMemo(() => earnings ? Math.max(...earnings.weeklyData.map((d) => d.amount), 1) : 1, [earnings]);

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <SubAppHeader label="FINANCIALS" title="Earnings" description="Loading your financial data..." onNotification={() => router.push('/notifications')} />
            <View style={{ padding: 24 }}><SkeletonList count={4} /></View>
        </View>
    );

    if (error || !earnings) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <SubAppHeader label="FINANCIALS" title="Earnings" description="Something went wrong." onNotification={() => router.push('/notifications')} />
            <ErrorState onRetry={load} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.2} animated />
            <SubAppHeader
                label="FINANCIALS"
                title="My Earnings"
                description="Track your revenue and manage your payouts."
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                {/* Balance Hub */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Card style={{
                        backgroundColor: Colors.white,
                        padding: 32,
                        borderRadius: Radius.sm,
                        borderWidth: 1.5,
                        borderColor: Colors.cardBorder,
                        ...Shadows.md
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary }} />
                                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 9, letterSpacing: 1.2 }]}>AVAILABLE BALANCE</Text>
                                </View>
                                <Text 
                                    style={[Typography.display, { color: Colors.primary, fontSize: 36, fontWeight: '800' }]}
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                >
                                    {formatNaira(earnings.totalEarnings)}
                                </Text>
                            </View>
                            <View style={{ 
                                width: 52, 
                                height: 52, 
                                borderRadius: Radius.md, 
                                backgroundColor: Colors.surface,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: Colors.cardBorder
                            }}>
                                <Ionicons name="wallet" size={26} color={Colors.primary} />
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 32,
                            paddingTop: 24,
                            borderTopWidth: 1,
                            borderTopColor: Colors.divider,
                            justifyContent: 'space-between'
                        }}>
                            <View>
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 8 }]}>WEEKLY REVENUE</Text>
                                <Text style={[Typography.h3, { color: Colors.primary, marginTop: 4, fontSize: 16 }]}>{formatNaira(earnings.thisWeek)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[Typography.label, { color: Colors.muted, fontSize: 8 }]}>PENDING PAYOUT</Text>
                                <Text style={[Typography.h3, { color: Colors.accent, marginTop: 4, fontSize: 16 }]}>{formatNaira(earnings.pendingPayments)}</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Balance Hub Actions */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginTop: 24 }}>
                    <PrimaryButton
                        title="WITHDRAW FUNDS"
                        onPress={() => { }}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.sm, ...Shadows.md }}
                        icon={<Ionicons name="paper-plane" size={20} color={Colors.white} />}
                    />
                </Animated.View>

                {/* Velocity Visualization */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 48, marginBottom: 20 }}>
                        <View>
                            <Text style={[Typography.label, { color: Colors.primary, marginBottom: 4 }]}>EARNINGS OVERVIEW</Text>
                            <Text style={[Typography.h3, { fontSize: 20 }]}>Performance</Text>
                        </View>
                        <View style={{ backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                            <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>THIS WEEK</Text>
                        </View>
                    </View>

                    <Card style={{ paddingVertical: 28, paddingHorizontal: 20, marginBottom: 24, borderRadius: Radius.sm, backgroundColor: Colors.white, borderColor: Colors.cardBorder }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' }}>
                            {earnings.weeklyData.map((d, i) => (
                                <View key={`${d.day}-${i}`} style={{ alignItems: 'center', flex: 1 }}>
                                    <Animated.View
                                        entering={StretchInY.delay(400 + i * 50)}
                                        style={{
                                            backgroundColor: i === 4 ? Colors.accent : Colors.primary,
                                            borderRadius: 3,
                                            width: 14,
                                            height: `${Math.max((d.amount / maxBar) * 100, 8)}%`,
                                            opacity: i === 4 ? 1 : 0.12
                                        }}
                                    />
                                    <Text style={[Typography.label, { fontSize: 8, color: Colors.muted, marginTop: 12 }]}>{d.day}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                </Animated.View>

                {/* Activity Ledger */}
                <View style={{ marginTop: 40 }}>
                    <Text style={[Typography.label, { color: Colors.primary, marginBottom: 12 }]}>PAYMENT HISTORY</Text>
                    {earnings.transactions.length === 0 ? (
                        <Card style={{ padding: 48, alignItems: 'center', backgroundColor: Colors.surface, borderStyle: 'dashed', borderColor: Colors.cardBorder, borderRadius: Radius.sm }}>
                            <Ionicons name="receipt-outline" size={32} color={Colors.muted} />
                            <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 16 }]}>NO TRANSACTIONS YET</Text>
                        </Card>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {earnings.transactions.map((tx, index) => (
                                <Animated.View key={tx.id} entering={FadeInUp.delay(500 + index * 100).springify()}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 16,
                                            padding: 20,
                                            backgroundColor: Colors.white,
                                            borderRadius: Radius.sm,
                                            borderWidth: 1.5,
                                            borderColor: Colors.cardBorder,
                                            ...Shadows.sm
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: Radius.xs,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: tx.type === 'credit' ? Colors.surface : Colors.surface,
                                                borderWidth: 1,
                                                borderColor: Colors.cardBorder
                                            }}
                                        >
                                            <Ionicons
                                                name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                color={tx.type === 'credit' ? Colors.primary : Colors.accent}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[Typography.body, { color: Colors.text, fontWeight: '700', fontSize: 14 }]} numberOfLines={1}>{tx.description}</Text>
                                            <Text style={[Typography.label, { color: Colors.muted, fontSize: 9, marginTop: 4, textTransform: 'none' }]}>{formatDate(tx.date)}</Text>
                                        </View>
                                        <Text style={[Typography.h3, { color: tx.type === 'credit' ? Colors.primary : Colors.accent, fontSize: 16 }]}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
