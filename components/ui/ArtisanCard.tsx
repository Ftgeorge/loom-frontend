import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar, RatingStars } from './AvatarRating';
import { Badge } from './CardChipBadge';

interface ArtisanCardProps {
    artisan: Artisan;
    onPress: () => void;
    horizontal?: boolean;
}

export function ArtisanCard({ artisan, onPress, horizontal }: ArtisanCardProps) {
    if (horizontal) {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.lg,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    alignItems: 'center',
                    gap: 16,
                    ...Shadows.sm
                }}
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityLabel={`View ${artisan.name}'s profile`}
            >
                <Avatar name={artisan.name} size={64} />
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[Typography.h3, { fontSize: 18 }]} numberOfLines={1}>{artisan.name}</Text>
                        {artisan.verified && <Badge variant="verified" />}
                    </View>
                    <Text style={[Typography.bodySmall, { color: Colors.muted }]} numberOfLines={1}>
                        {artisan.skills.map((s) => s.replace('_', '/')).join(', ')}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <RatingStars rating={artisan.rating} size={14} count={artisan.reviewCount} />
                        <Text style={{ color: Colors.cardBorder }}>|</Text>
                        <Text style={[Typography.bodySmall, { fontSize: 12 }]}>{artisan.distance}km away</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <Text style={[Typography.h3, { fontSize: 16, color: Colors.text }]}>
                            {formatNaira(artisan.priceRange.min)}
                            <Text style={[Typography.bodySmall, { color: Colors.muted, fontSize: 12 }]}> avg</Text>
                        </Text>
                        {artisan.matchScore !== undefined && (
                            <View style={{ backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
                                <Text style={[Typography.label, { color: Colors.accent, fontSize: 10, textTransform: 'none' }]}>Match {artisan.matchScore}%</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={{
                backgroundColor: Colors.surface,
                borderRadius: Radius.lg,
                padding: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.cardBorder,
                width: 160,
                ...Shadows.md
            }}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`View ${artisan.name}'s profile`}
        >
            <Avatar name={artisan.name} size={72} />
            <Text style={[Typography.h3, { marginTop: 12, textAlign: 'center', fontSize: 16 }]} numberOfLines={1}>{artisan.name}</Text>
            <View style={{ marginTop: 6, marginBottom: 8 }}>
                <RatingStars rating={artisan.rating} size={14} showValue={false} />
            </View>
            <Text style={[Typography.bodySmall, { fontSize: 12, color: Colors.muted, textAlign: 'center' }]} numberOfLines={1}>
                {artisan.skills[0]?.replace('_', '/')}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="location-outline" size={10} color={Colors.muted} />
                <Text style={[Typography.bodySmall, { fontSize: 10, color: Colors.muted }]}>{artisan.distance}km</Text>
            </View>
            {artisan.verified && (
                <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge variant="verified" />
                </View>
            )}
        </TouchableOpacity>
    );
}

