import { Colors } from '@/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: SkeletonProps) {
    const anim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [anim]);

    return (
        <Animated.View
            style={[
                { width: width as any, height, borderRadius, backgroundColor: Colors.gray200, opacity: anim },
                style,
            ]}
        />
    );
}

export function SkeletonCard() {
    return (
        <View className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
            <View className="flex-row gap-4">
                <Skeleton width={56} height={56} borderRadius={28} />
                <View className="flex-1 justify-center">
                    <Skeleton width="70%" height={16} />
                    <Skeleton width="50%" height={12} style={{ marginTop: 8 }} />
                    <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
                </View>
            </View>
        </View>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <View className="gap-4">
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
        </View>
    );
}
