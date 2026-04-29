import { Colors, Radius, Shadows } from '@/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

// ─── Base Skeleton Pulse ─────────────────────────────────
interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: SkeletonProps) {
    const anim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [anim]);

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: Colors.cardBorder,
                    opacity: anim,
                },
                style,
            ]}
        />
    );
}

// ─── Artisan Card Skeleton (Horizontal - for home screen) ─
export function SkeletonArtisanCardHorizontal() {
    return (
        <View style={{
            width: 220,
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            ...Shadows.sm,
        }}>
            {/* Avatar + Badge row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Skeleton width={52} height={52} borderRadius={26} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Skeleton width="70%" height={14} style={{ marginBottom: 6 }} />
                    <Skeleton width="50%" height={11} />
                </View>
            </View>
            {/* Skill chip */}
            <Skeleton width="40%" height={24} borderRadius={12} style={{ marginBottom: 12 }} />
            {/* Rating row */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <Skeleton width="45%" height={11} />
                <Skeleton width="30%" height={11} />
            </View>
        </View>
    );
}

// ─── Artisan Card Skeleton (Vertical - for search / near-you) ─
export function SkeletonArtisanCard() {
    return (
        <View style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            marginBottom: 12,
            ...Shadows.sm,
        }}>
            <View style={{ flexDirection: 'row', gap: 14 }}>
                {/* Avatar */}
                <Skeleton width={56} height={56} borderRadius={28} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Skeleton width="65%" height={15} style={{ marginBottom: 7 }} />
                    <Skeleton width="45%" height={12} style={{ marginBottom: 6 }} />
                    <Skeleton width="35%" height={12} />
                </View>
            </View>
            {/* Bottom row: price + availability */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <Skeleton width="50%" height={28} borderRadius={Radius.sm} />
                <Skeleton width="35%" height={28} borderRadius={Radius.sm} />
            </View>
        </View>
    );
}

// ─── Job / Request Card Skeleton ─────────────────────────
export function SkeletonRequestCard() {
    return (
        <View style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            padding: 18,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            marginBottom: 12,
            ...Shadows.sm,
        }}>
            {/* Header row: category + status badge */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Skeleton width="40%" height={14} />
                <Skeleton width={72} height={24} borderRadius={12} />
            </View>
            {/* Description lines */}
            <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
            <Skeleton width="80%" height={12} style={{ marginBottom: 16 }} />
            {/* Footer: budget + time */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <Skeleton width="30%" height={12} />
                <Skeleton width="25%" height={12} />
            </View>
        </View>
    );
}

// ─── Message Thread Skeleton ─────────────────────────────
export function SkeletonMessageThread() {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: Colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: Colors.cardBorder,
            gap: 14,
        }}>
            <Skeleton width={52} height={52} borderRadius={26} />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Skeleton width="40%" height={14} />
                    <Skeleton width={48} height={11} />
                </View>
                <Skeleton width="75%" height={11} />
            </View>
        </View>
    );
}

// ─── Notification Skeleton ───────────────────────────────
export function SkeletonNotification() {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 16,
            gap: 14,
            borderBottomWidth: 1,
            borderBottomColor: Colors.cardBorder,
        }}>
            <Skeleton width={44} height={44} borderRadius={22} />
            <View style={{ flex: 1 }}>
                <Skeleton width="55%" height={14} style={{ marginBottom: 8 }} />
                <Skeleton width="90%" height={11} style={{ marginBottom: 5 }} />
                <Skeleton width="70%" height={11} style={{ marginBottom: 8 }} />
                <Skeleton width="30%" height={10} />
            </View>
        </View>
    );
}

// ─── Profile Skeleton ────────────────────────────────────
export function SkeletonProfile() {
    return (
        <View style={{ padding: 24 }}>
            {/* Avatar + Name */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Skeleton width={96} height={96} borderRadius={48} style={{ marginBottom: 14 }} />
                <Skeleton width={160} height={18} style={{ marginBottom: 8 }} />
                <Skeleton width={120} height={13} />
            </View>
            {/* Stats row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 }}>
                {[0, 1, 2].map((i) => (
                    <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                        <Skeleton width={48} height={20} />
                        <Skeleton width={64} height={11} />
                    </View>
                ))}
            </View>
            {/* Settings rows */}
            {[0, 1, 2, 3].map((i) => (
                <View key={i} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.cardBorder,
                }}>
                    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                        <Skeleton width={36} height={36} borderRadius={8} />
                        <Skeleton width={120} height={14} />
                    </View>
                    <Skeleton width={20} height={20} borderRadius={4} />
                </View>
            ))}
        </View>
    );
}

// ─── Dashboard Skeleton (Artisan) ────────────────────────
export function SkeletonDashboard() {
    return (
        <View style={{ padding: 24 }}>
            {/* Earnings card */}
            <View style={{
                backgroundColor: Colors.primary,
                borderRadius: Radius.lg,
                padding: 20,
                marginBottom: 24,
            }}>
                <Skeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 12, opacity: 0.4 }} />
                <Skeleton width="60%" height={32} borderRadius={6} style={{ marginBottom: 8, opacity: 0.4 }} />
                <Skeleton width="40%" height={11} borderRadius={4} style={{ opacity: 0.3 }} />
            </View>
            {/* Stats grid */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                {[0, 1].map((i) => (
                    <View key={i} style={{
                        flex: 1,
                        backgroundColor: Colors.surface,
                        borderRadius: Radius.md,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                    }}>
                        <Skeleton width="60%" height={11} style={{ marginBottom: 8 }} />
                        <Skeleton width="80%" height={22} />
                    </View>
                ))}
            </View>
            {/* Recent job rows */}
            <Skeleton width="45%" height={16} style={{ marginBottom: 16 }} />
            {[0, 1, 2].map((i) => (
                <SkeletonRequestCard key={i} />
            ))}
        </View>
    );
}

// ─── Category Grid Skeleton ──────────────────────────────
export function SkeletonCategoryGrid() {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
            {Array(8).fill(0).map((_, i) => (
                <View key={i} style={{
                    width: '22%',
                    aspectRatio: 1,
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                }}>
                    <Skeleton width={36} height={36} borderRadius={18} />
                    <Skeleton width="80%" height={9} />
                </View>
            ))}
        </View>
    );
}

// ─── Convenience list wrappers ───────────────────────────
export function SkeletonList({ count = 3, type = 'artisan' }: { count?: number; type?: 'artisan' | 'request' | 'message' | 'notification' }) {
    const renderItem = (i: number) => {
        switch (type) {
            case 'request': return <SkeletonRequestCard key={i} />;
            case 'message': return <SkeletonMessageThread key={i} />;
            case 'notification': return <SkeletonNotification key={i} />;
            default: return <SkeletonArtisanCard key={i} />;
        }
    };

    return (
        <View>
            {Array(count).fill(0).map((_, i) => renderItem(i))}
        </View>
    );
}

export function SkeletonHorizontalList({ count = 3 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 16 }}>
            {Array(count).fill(0).map((_, i) => (
                <SkeletonArtisanCardHorizontal key={i} />
            ))}
        </View>
    );
}
