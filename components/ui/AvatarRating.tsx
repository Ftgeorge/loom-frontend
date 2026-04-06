import { getInitials } from '@/utils/helpers';
import React from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
    name: string;
    size?: number;
    uri?: string;
    className?: string;
}

export function Avatar({ name, size = 48, uri, className = '' }: AvatarProps) {
    const fontSize = size * 0.38;

    return (
        <View
            style={{ width: size, height: size }}
            className={`rounded-md bg-primary-light items-center justify-center border-[1px] border-primary/20 shadow-sm ${className}`}
            accessibilityLabel={`${name}'s avatar`}
        >
            <Text 
                style={{ fontSize }}
                className="font-jakarta-bold text-primary"
            >
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
    className?: string;
}

export function RatingStars({ rating, size = 16, showValue = true, count, className = '' }: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <View className={`flex-row items-center gap-[2px] ${className}`}>
            <View className="flex-row gap-[1px]">
                {Array(fullStars)
                    .fill(0)
                    .map((_, i) => (
                        <Text key={`f${i}`} style={{ fontSize: size }} className="text-accent">★</Text>
                    ))}
                {hasHalf && <Text style={{ fontSize: size }} className="text-accent">★</Text>}
                {Array(emptyStars)
                    .fill(0)
                    .map((_, i) => (
                        <Text key={`e${i}`} style={{ fontSize: size }} className="text-gray-300">☆</Text>
                    ))}
            </View>
            {showValue && (
                <Text className="text-label text-text-primary ml-[6px] normal-case text-[13px] tracking-normal">
                    {rating.toFixed(1)}
                </Text>
            )}
            {count !== undefined && (
                <Text className="text-body-sm text-muted ml-[2px] text-[11px]">
                    ({count})
                </Text>
            )}
        </View>
    );
}

