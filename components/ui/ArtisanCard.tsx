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

export const ArtisanCard = React.memo(({ artisan, onPress, horizontal }: ArtisanCardProps) => {
    if (horizontal) {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.white,
                    borderRadius: Radius.md,
                    padding: 20,
                    borderWidth: 1.5,
                    borderColor: Colors.cardBorder,
                    alignItems: 'center',
                    gap: 16,
                    ...Shadows.sm
                }}
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityLabel={`View ${artisan.name}'s profile`}
            >
                <View style={{ position: 'relative' }}>
                    <Avatar name={artisan.name} size={64} />
                    {artisan.verified && (
                        <View style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            backgroundColor: Colors.accent,
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: Colors.white,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ionicons name="checkmark" size={12} color={Colors.white} />
                        </View>
                    )}
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[Typography.h3, { fontSize: 16, color: Colors.primary }]} numberOfLines={1}>{artisan.name.toUpperCase()}</Text>
                        <View style={{
                            backgroundColor: artisan.availability === 'online' ? Colors.success + '10' : Colors.gray100,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4
                        }}>
                            <Text style={[Typography.label, { fontSize: 8, color: artisan.availability === 'online' ? Colors.success : Colors.muted }]}>
                                {artisan.availability === 'online' ? 'SIGNAL ACTIVE' : 'GRID BUSY'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 10 }]} numberOfLines={1}>
                        {artisan.skills.map((s) => s.toUpperCase().replace('_', '/')).join(' • ')}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="star" size={12} color={Colors.accent} />
                            <Text style={[Typography.label, { fontSize: 11, color: Colors.primary }]}>{artisan.rating}</Text>
                        </View>
                        <Text style={{ color: Colors.gray200, fontSize: 10 }}>|</Text>
                        <Text style={[Typography.label, { fontSize: 10, color: Colors.muted }]}>{artisan.distance}KM RANGE</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <View>
                            <Text style={[Typography.label, { fontSize: 8, color: Colors.muted }]}>ESTIMATED YIELD</Text>
                            <Text style={[Typography.h3, { fontSize: 14, color: Colors.primary }]}>
                                {formatNaira(artisan.priceRange.min)}
                            </Text>
                        </View>
                        {artisan.matchScore !== undefined && (
                            <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.xs }}>
                                <Text style={[Typography.label, { color: Colors.white, fontSize: 9 }]}>MATCH {artisan.matchScore}%</Text>
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
                backgroundColor: Colors.white,
                borderRadius: Radius.md,
                padding: 20,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: Colors.cardBorder,
                width: 180,
                ...Shadows.sm
            }}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityLabel={`View ${artisan.name}'s profile`}
        >
            <View style={{ position: 'relative' }}>
                <Avatar name={artisan.name} size={64} />
                {artisan.verified && (
                    <View style={{ position: 'absolute', top: 0, right: -4 }}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />
                    </View>
                )}
            </View>

            <Text style={[Typography.h3, { marginTop: 16, textAlign: 'center', fontSize: 14, color: Colors.primary }]} numberOfLines={1}>
                {artisan.name.toUpperCase()}
            </Text>

            <View style={{ marginTop: 8, marginBottom: 12 }}>
                <RatingStars rating={artisan.rating} size={10} showValue={false} />
            </View>

            <View style={{ width: '100%', borderTopWidth: 1, borderColor: Colors.gray100, paddingTop: 12 }}>
                <Text style={[Typography.label, { fontSize: 8, color: Colors.muted, textAlign: 'center', marginBottom: 4 }]}>
                    STARTING AT
                </Text>
                <Text style={[Typography.h3, { fontSize: 15, color: Colors.primary, textAlign: 'center' }]}>
                    {formatNaira(artisan.priceRange.min).split('.')[0]}
                </Text>
            </View>
        </TouchableOpacity>
    );
});

