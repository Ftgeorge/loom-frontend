import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { LoomThread } from '@/components/ui/LoomThread';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/StateComponents';
import { t } from '@/i18n';
import { artisanApi } from '@/services/api';
import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
import { formatDate, formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, StretchInY } from 'react-native-reanimated';

export default function EarningsScreen() {
    const { language, setEarnings, earnings } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        try {
            setError(false);
            // GET /artisans/me/earnings
            const data = await artisanApi.meEarnings();
            const totalEarned = Number(data.total_earned);
            const pendingPayout = Number(data.pending_payout);
            // Map to the EarningsSummary shape the UI expects
            setEarnings({
                totalEarnings: totalEarned,
                thisWeek: 0,       // no per-period endpoint yet
                thisMonth: 0,
                pendingPayments: pendingPayout,
                weeklyData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
                    day,
                    amount: 0,
                })),
                transactions: [],  // no transactions list endpoint yet
            });
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [setEarnings]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title={t('earnings', language)} showNotification={false} />
            <View style={{ padding: 20 }}><SkeletonList count={4} /></View>
        </View>
    );

    if (error || !earnings) return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader title={t('earnings', language)} showNotification={false} />
            <ErrorState onRetry={load} />
        </View>
    );

    const maxBar = Math.max(...earnings.weeklyData.map((d) => d.amount), 1);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <AppHeader title={t('earnings', language)} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Total Earnings Card */}
                <Animated.View entering={FadeInDown.springify()}>
                    <Card style={{ backgroundColor: Colors.primary, padding: 32, borderRadius: Radius.lg }}>
                        <Text style={[Typography.label, { color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 }]}>Total Earnings</Text>
                        <Text style={[Typography.h1, { fontSize: 40, color: Colors.white, marginVertical: 8, fontWeight: '700' }]}>{formatNaira(earnings.totalEarnings)}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 24, gap: 24 }}>
                            <View>
                                <Text style={[Typography.label, { color: 'rgba(255,255,255,0.5)', fontSize: 10 }]}>This Week</Text>
                                <Text style={[Typography.h3, { color: Colors.white, marginTop: 4 }]}>{formatNaira(earnings.thisWeek)}</Text>
                            </View>
                            <View>
                                <Text style={[Typography.label, { color: 'rgba(255,255,255,0.5)', fontSize: 10 }]}>This Month</Text>
                                <Text style={[Typography.h3, { color: Colors.white, marginTop: 4 }]}>{formatNaira(earnings.thisMonth)}</Text>
                            </View>
                            <View>
                                <Text style={[Typography.label, { color: 'rgba(255,255,255,0.5)', fontSize: 10 }]}>Pending</Text>
                                <Text style={[Typography.h3, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                                    {formatNaira(earnings.pendingPayments)}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Weekly Chart */}
                <Animated.View entering={FadeInUp.delay(200).springify()}>
                    <Text style={[Typography.h3, { marginTop: 32, marginBottom: 16 }]}>Weekly Performance</Text>
                    <Card style={{ paddingVertical: 20, paddingHorizontal: 16, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' }}>
                            {earnings.weeklyData.map((d, i) => (
                                <Animated.View entering={StretchInY.delay(300 + i * 100)} key={d.day} style={{ alignItems: 'center', flex: 1 }}>
                                    <View style={{ width: 28, height: 100, justifyContent: 'flex-end' }}>
                                        <View
                                            style={{
                                                backgroundColor: Colors.primary + '20',
                                                borderRadius: Radius.xs,
                                                minHeight: 4,
                                                width: '100%',
                                                height: `${Math.max((d.amount / maxBar) * 100, 4)}%`
                                            }}
                                        />
                                    </View>
                                    <Text style={[Typography.label, { marginTop: 8, fontSize: 10, textTransform: 'none' }]}>{d.day}</Text>
                                </Animated.View>
                            ))}
                        </View>
                    </Card>
                </Animated.View>

                {/* Withdrawal Button */}
                <PrimaryButton
                    title="Withdraw Funds"
                    onPress={() => { }}
                    variant="accent"
                    icon={<Ionicons name="arrow-down-circle-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />}
                    style={{ marginVertical: 24 }}
                />

                {/* Transactions */}
                <Animated.View entering={FadeInUp.delay(500)}>
                    <Text style={[Typography.h3, { marginTop: 24, marginBottom: 16 }]}>Recent Transactions</Text>
                    {earnings.transactions.map((tx, index) => (
                        <Animated.View key={tx.id} entering={FadeInUp.delay(700 + index * 100).springify()} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder, paddingVertical: 16 }}>
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: Radius.full,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: tx.type === 'credit' ? Colors.success + '15' : Colors.error + '10'
                                }}
                            >
                                <Ionicons
                                    name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                    size={18}
                                    color={tx.type === 'credit' ? Colors.success : Colors.error}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[Typography.body, { color: Colors.text, fontWeight: '600' }]} numberOfLines={1}>{tx.description}</Text>
                                <Text style={[Typography.bodySmall, { color: Colors.muted, marginTop: 2 }]}>{formatDate(tx.date)}</Text>
                            </View>
                            <Text style={[Typography.h3, { color: tx.type === 'credit' ? Colors.success : Colors.error }]}>
                                {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                            </Text>
                        </Animated.View>
                    ))}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
