import { Colors, Typography } from '@/theme';
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
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: Colors.cardBorder + '50',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            accessibilityLabel={`${name}'s avatar`}
        >
            <Text style={{ fontSize, fontWeight: '700', color: Colors.text }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            {Array(fullStars)
                .fill(0)
                .map((_, i) => (
                    <Text key={`f${i}`} style={{ fontSize: size, color: Colors.accent }}>★</Text>
                ))}
            {hasHalf && <Text style={{ fontSize: size, color: Colors.accent }}>★</Text>}
            {Array(emptyStars)
                .fill(0)
                .map((_, i) => (
                    <Text key={`e${i}`} style={{ fontSize: size, color: Colors.cardBorder }}>☆</Text>
                ))}
            {showValue && (
                <Text style={[Typography.label, { color: Colors.primary, marginLeft: 4, textTransform: 'none' }]}>{rating.toFixed(1)}</Text>
            )}
            {count !== undefined && (
                <Text style={[Typography.bodySmall, { fontSize: 10, marginLeft: 2 }]}>({count})</Text>
            )}
        </View>
    );
}
