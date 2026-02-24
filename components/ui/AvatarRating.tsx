import { getInitials } from '@/utils/helpers';
import React from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
    name: string;
    size?: number;
    uri?: string;
}

export function Avatar({ name, size = 48, uri }: AvatarProps) {
    const fontSize = size * 0.38;

    return (
        <View
            className="bg-primary/10 items-center justify-center"
            style={{ width: size, height: size, borderRadius: size / 2 }}
            accessibilityLabel={`${name}'s avatar`}
        >
            <Text className="text-primary font-bold" style={{ fontSize }}>
                {getInitials(name)}
            </Text>
        </View>
    );
}

interface RatingStarsProps {
    rating: number;
    size?: number;
    showValue?: boolean;
    count?: number;
}

export function RatingStars({ rating, size = 16, showValue = true, count }: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <View className="flex-row items-center gap-[1px]">
            {Array(fullStars)
                .fill(0)
                .map((_, i) => (
                    <Text key={`f${i}`} className="text-accent" style={{ fontSize: size }}>★</Text>
                ))}
            {hasHalf && <Text className="text-accent" style={{ fontSize: size }}>★</Text>}
            {Array(emptyStars)
                .fill(0)
                .map((_, i) => (
                    <Text key={`e${i}`} className="text-gray-300" style={{ fontSize: size }}>☆</Text>
                ))}
            {showValue && (
                <Text className="text-sm font-semibold text-primary ml-1">{rating.toFixed(1)}</Text>
            )}
            {count !== undefined && (
                <Text className="text-xs text-gray-500 ml-0.5">({count})</Text>
            )}
        </View>
    );
}
