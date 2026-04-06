import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

// ─── Base Skeleton Pulse ─────────────────────────────────
interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
    className?: string;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style, className = '' }: SkeletonProps) {
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
                    opacity: anim,
                },
                style,
            ]}
            className={`bg-card-border ${className}`}
        />
    );
}

// ─── Artisan Card Skeleton (Horizontal - for home screen) ─
export function SkeletonArtisanCardHorizontal() {
    return (
        <View className="w-[220px] bg-surface rounded-md p-4 border-[1px] border-card-border shadow-sm">
            {/* Avatar + Badge row */}
            <View className="flex-row items-center mb-3">
                <Skeleton width={52} height={52} borderRadius={26} />
                <View className="flex-1 ml-3">
                    <Skeleton width="70%" height={14} className="mb-[6px]" />
                    <Skeleton width="50%" height={11} />
                </View>
            </View>
            {/* Skill chip */}
            <Skeleton width="40%" height={24} borderRadius={12} className="mb-3" />
            {/* Rating row */}
            <View className="flex-row gap-2">
                <Skeleton width="45%" height={11} />
                <Skeleton width="30%" height={11} />
            </View>
        </View>
    );
}

// ─── Artisan Card Skeleton (Vertical - for search / near-you) ─
export function SkeletonArtisanCard() {
    return (
        <View className="bg-surface rounded-md p-4 border-[1px] border-card-border mb-3 shadow-sm">
            <View className="flex-row gap-[14px]">
                {/* Avatar */}
                <Skeleton width={56} height={56} borderRadius={28} />
                <View className="flex-1 justify-center">
                    <Skeleton width="65%" height={15} className="mb-[7px]" />
                    <Skeleton width="45%" height={12} className="mb-[6px]" />
                    <Skeleton width="35%" height={12} />
                </View>
            </View>
            {/* Bottom row: price + availability */}
            <View className="flex-row gap-2 mt-[14px]">
                <Skeleton width="50%" height={28} className="rounded-sm" />
                <Skeleton width="35%" height={28} className="rounded-sm" />
            </View>
        </View>
    );
}

// ─── Job / Request Card Skeleton ─────────────────────────
export function SkeletonRequestCard() {
    return (
        <View className="bg-surface rounded-md p-[18px] border-[1px] border-card-border mb-3 shadow-sm">
            {/* Header row: category + status badge */}
            <View className="flex-row justify-between mb-3">
                <Skeleton width="40%" height={14} />
                <Skeleton width={72} height={24} borderRadius={12} />
            </View>
            {/* Description lines */}
            <Skeleton width="100%" height={12} className="mb-[6px]" />
            <Skeleton width="80%" height={12} className="mb-4" />
            {/* Footer: budget + time */}
            <View className="flex-row gap-3">
                <Skeleton width="30%" height={12} />
                <Skeleton width="25%" height={12} />
            </View>
        </View>
    );
}

// ─── Message Thread Skeleton ─────────────────────────────
export function SkeletonMessageThread() {
    return (
        <View className="flex-row items-center p-4 bg-surface border-b-[1px] border-card-border gap-[14px]">
            <Skeleton width={52} height={52} borderRadius={26} />
            <View className="flex-1">
                <View className="flex-row justify-between mb-2">
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
        <View className="flex-row items-start p-4 gap-[14px] border-b-[1px] border-card-border">
            <Skeleton width={44} height={44} borderRadius={22} />
            <View className="flex-1">
                <Skeleton width="55%" height={14} className="mb-2" />
                <Skeleton width="90%" height={11} className="mb-[5px]" />
                <Skeleton width="70%" height={11} className="mb-2" />
                <Skeleton width="30%" height={10} />
            </View>
        </View>
    );
}

// ─── Profile Skeleton ────────────────────────────────────
export function SkeletonProfile() {
    return (
        <View className="p-6">
            {/* Avatar + Name */}
            <View className="items-center mb-8">
                <Skeleton width={96} height={96} borderRadius={48} className="mb-[14px]" />
                <Skeleton width={160} height={18} className="mb-2" />
                <Skeleton width={120} height={13} />
            </View>
            {/* Stats row */}
            <View className="flex-row justify-around mb-8">
                {[0, 1, 2].map((i) => (
                    <View key={i} className="items-center gap-[6px]">
                        <Skeleton width={48} height={20} />
                        <Skeleton width={64} height={11} />
                    </View>
                ))}
            </View>
            {/* Settings rows */}
            {[0, 1, 2, 3].map((i) => (
                <View key={i} className="flex-row justify-between items-center py-4 border-b-[1px] border-card-border">
                    <View className="flex-row gap-[14px] items-center">
                        <Skeleton width={36} height={36} className="rounded-xs" />
                        <Skeleton width={120} height={14} />
                    </View>
                    <Skeleton width={20} height={20} className="rounded-xs" />
                </View>
            ))}
        </View>
    );
}

// ─── Dashboard Skeleton (Artisan) ────────────────────────
export function SkeletonDashboard() {
    return (
        <View className="p-6">
            {/* Earnings card */}
            <View className="bg-primary rounded-md p-5 mb-6">
                <Skeleton width="40%" height={12} className="mb-3 opacity-40 rounded-[4px]" />
                <Skeleton width="60%" height={32} className="mb-2 opacity-40 rounded-[6px]" />
                <Skeleton width="40%" height={11} className="opacity-30 rounded-[4px]" />
            </View>
            {/* Stats grid */}
            <View className="flex-row gap-3 mb-6">
                {[0, 1].map((i) => (
                    <View key={i} className="flex-1 bg-surface rounded-xs p-4 border-[1px] border-card-border">
                        <Skeleton width="60%" height={11} className="mb-2" />
                        <Skeleton width="80%" height={22} />
                    </View>
                ))}
            </View>
            {/* Recent job rows */}
            <Skeleton width="45%" height={16} className="mb-4" />
            {[0, 1, 2].map((i) => (
                <SkeletonRequestCard key={i} />
            ))}
        </View>
    );
}

// ─── Category Grid Skeleton ──────────────────────────────
export function SkeletonCategoryGrid() {
    return (
        <View className="flex-row flex-wrap gap-3 justify-between">
            {Array(8).fill(0).map((_, i) => (
                <View key={i} className="w-[22%] aspect-square bg-surface rounded-xs items-center justify-center gap-2 border-[1px] border-card-border">
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
        <View className="flex-row gap-4">
            {Array(count).fill(0).map((_, i) => (
                <SkeletonArtisanCardHorizontal key={i} />
            ))}
        </View>
    );
}

