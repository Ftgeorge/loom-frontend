import { Colors, Radius, Shadows, Typography } from '@/theme';
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
                borderRadius: Radius.md, // Sharper, more premium
                backgroundColor: Colors.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.primary + '20',
                ...Shadows.sm
            }}
            accessibilityLabel={`${name}'s avatar`}
        >
            <Text style={[Typography.h3, { fontSize, color: Colors.primary, fontWeight: '800' }]}>
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
            <View style={{ flexDirection: 'row', gap: 1 }}>
                {Array(fullStars)
                    .fill(0)
                    .map((_, i) => (
                        <Text key={`f${i}`} style={{ fontSize: size, color: Colors.accent }}>★</Text>
                    ))}
                {hasHalf && <Text style={{ fontSize: size, color: Colors.accent }}>★</Text>}
                {Array(emptyStars)
                    .fill(0)
                    .map((_, i) => (
                        <Text key={`e${i}`} style={{ fontSize: size, color: Colors.gray300 }}>☆</Text>
                    ))}
            </View>
            {showValue && (
                <Text style={[Typography.label, { color: Colors.text, marginLeft: 6, textTransform: 'none', fontSize: 13 }]}>{rating.toFixed(1)}</Text>
            )}
            {count !== undefined && (
                <Text style={[Typography.bodySmall, { fontSize: 11, color: Colors.muted, marginLeft: 2 }]}>({count})</Text>
            )}
        </View>
    );
}
