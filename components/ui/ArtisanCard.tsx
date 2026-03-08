import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { formatNaira } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Avatar } from './AvatarRating';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Maps an artisan's primary skill to our local craft photo
const SKILL_IMAGES: Record<string, any> = {
    plumber: require('../../assets/images/cat_plumber.png'),
    electrician: require('../../assets/images/cat_electrician.png'),
    carpenter: require('../../assets/images/cat_carpenter.png'),
    tailor: require('../../assets/images/cat_tailor.png'),
    mechanic: require('../../assets/images/cat_mechanic.png'),
    cleaning: require('../../assets/images/cat_cleaning.png'),
    hair_beauty: require('../../assets/images/cat_hair_beauty.png'),
    ac_repair: require('../../assets/images/cat_ac_repair.png'),
};

function getSkillImage(skills: string[]) {
    for (const s of skills) {
        if (SKILL_IMAGES[s]) return SKILL_IMAGES[s];
    }
    return require('../../assets/images/artisan.jpg'); // fallback
}

interface ArtisanCardProps {
    artisan: Artisan;
    onPress: () => void;
    horizontal?: boolean;
    featured?: boolean;
}

// ─── Verified Badge ────────────────────────────────────────────────────────────
function LoomVerifiedBadge() {
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: Colors.violetLight,
            borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
            borderWidth: 1, borderColor: Colors.violet + '30',
        }}>
            <Ionicons name="shield-checkmark" size={10} color={Colors.violet} />
            <Text style={{
                fontSize: 8, fontFamily: 'PlusJakartaSans-Bold',
                color: Colors.violet, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>Verified</Text>
        </View>
    );
}

// ─── Online Status Dot ─────────────────────────────────────────────────────────
function OnlineDot({ online }: { online: boolean }) {
    return (
        <View style={{
            width: 10, height: 10, borderRadius: 5,
            backgroundColor: online ? Colors.success : Colors.muted,
            borderWidth: 2, borderColor: 'white',
        }} />
    );
}

// ─── Rating row ────────────────────────────────────────────────────────────────
function RatingRow({ rating, distance, verified }: { rating: number; distance: number; verified: boolean }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.ink }}>
                    {rating.toFixed(1)}
                </Text>
            </View>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.gray300 }} />
            <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.muted }}>
                {distance}km away
            </Text>
            {verified && <LoomVerifiedBadge />}
        </View>
    );
}

export const ArtisanCard = React.memo(({ artisan, onPress, horizontal, featured }: ArtisanCardProps) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15 }); };
    const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

    const craftImage = getSkillImage(artisan.skills);
    const primarySkill = artisan.skills[0]?.replace(/_/g, ' ') ?? 'Artisan';

    // ─── Horizontal / Nearby list card ──────────────────────────────────────────
    if (horizontal) {
        return (
            <AnimatedTouchableOpacity
                style={[{
                    flexDirection: 'row',
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.lg,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    alignItems: 'center',
                    ...Shadows.sm,
                }, animatedStyle]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                accessibilityLabel={`View ${artisan.name}'s profile`}
            >
                {/* Left photo strip */}
                <ImageBackground
                    source={craftImage}
                    style={{ width: 76, height: 90 }}
                    resizeMode="cover"
                >
                    <View style={{
                        ...StyleSheet_absoluteFill,
                        backgroundColor: 'rgba(0,0,0,0.30)',
                    }} />
                    {/* Online dot pinned bottom-right */}
                    <View style={{
                        position: 'absolute', bottom: 8, right: 8,
                    }}>
                        <OnlineDot online={artisan.availability === 'online'} />
                    </View>
                </ImageBackground>

                {/* Info */}
                <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[Typography.h3, { fontSize: 14 }]} numberOfLines={1}>
                            {artisan.name}
                        </Text>
                        <View style={{
                            backgroundColor: artisan.availability === 'online' ? Colors.successLight : Colors.gray100,
                            borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2,
                            flexDirection: 'row', alignItems: 'center', gap: 4,
                        }}>
                            <View style={{
                                width: 5, height: 5, borderRadius: 3,
                                backgroundColor: artisan.availability === 'online' ? Colors.success : Colors.muted,
                            }} />
                            <Text style={{
                                fontSize: 9, fontFamily: 'Inter-SemiBold',
                                color: artisan.availability === 'online' ? Colors.success : Colors.muted,
                            }}>
                                {artisan.availability === 'online' ? 'Online' : 'Busy'}
                            </Text>
                        </View>
                    </View>

                    <Text style={[Typography.bodySmall, { color: Colors.muted, fontSize: 12 }]} numberOfLines={1}>
                        {artisan.skills.map(s => s.replace(/_/g, ' ')).join(' · ')}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <RatingRow rating={artisan.rating} distance={artisan.distance} verified={artisan.verified} />
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.ink }}>
                            From {formatNaira(artisan.priceRange.min)}
                        </Text>
                    </View>
                </View>
            </AnimatedTouchableOpacity>
        );
    }

    // ─── Featured Card — hero photo header (like the category pills) ─────────────
    if (featured) {
        return (
            <AnimatedTouchableOpacity
                style={[{
                    borderRadius: Radius.xl,
                    overflow: 'hidden',
                    width: 200,
                    ...Shadows.violet,
                    borderWidth: 1.5,
                    borderColor: Colors.violet + '30',
                }, animatedStyle]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Photo hero — top 110px */}
                <ImageBackground
                    source={craftImage}
                    style={{ width: '100%', height: 110 }}
                    resizeMode="cover"
                >
                    <View style={{ ...StyleSheet_absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)' }} />

                    {/* BEST MATCH chip */}
                    <View style={{
                        position: 'absolute', top: 10, left: 10,
                        flexDirection: 'row', alignItems: 'center', gap: 4,
                        backgroundColor: Colors.violet,
                        paddingHorizontal: 8, paddingVertical: 4,
                        borderRadius: 20,
                    }}>
                        <Ionicons name="sparkles" size={9} color="white" />
                        <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'white', letterSpacing: 0.4 }}>
                            BEST MATCH
                        </Text>
                    </View>

                    {/* Avatar pinned bottom-left, half-over the fold */}
                    <View style={{
                        position: 'absolute', bottom: -22, left: 14,
                        borderRadius: 22, borderWidth: 3, borderColor: Colors.surface,
                        width: 44, height: 44, overflow: 'hidden',
                    }}>
                        <Avatar name={artisan.name} size={44} />
                    </View>

                    {/* Online dot */}
                    <View style={{ position: 'absolute', bottom: -16, left: 44 }}>
                        <OnlineDot online={artisan.availability === 'online'} />
                    </View>
                </ImageBackground>

                {/* Info panel */}
                <View style={{ backgroundColor: Colors.surface, paddingHorizontal: 14, paddingTop: 28, paddingBottom: 16 }}>
                    <Text style={[Typography.h3, { fontSize: 15, marginBottom: 2 }]} numberOfLines={1}>
                        {artisan.name}
                    </Text>
                    <Text style={[Typography.bodySmall, { fontSize: 11, marginBottom: 10 }]} numberOfLines={1}>
                        {primarySkill}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                        <Ionicons name="star" size={11} color="#F59E0B" />
                        <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.ink }}>
                            {artisan.rating.toFixed(1)}
                        </Text>
                        {artisan.verified && <LoomVerifiedBadge />}
                    </View>

                    <View style={{
                        borderTopWidth: 1, borderTopColor: Colors.divider,
                        paddingTop: 10,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <View>
                            <Text style={{ fontSize: 9, fontFamily: 'Inter-Regular', color: Colors.muted, marginBottom: 2 }}>
                                from
                            </Text>
                            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: Colors.ink }}>
                                {formatNaira(artisan.priceRange.min).split('.')[0]}
                            </Text>
                        </View>
                        {artisan.matchScore !== undefined && (
                            <View style={{
                                backgroundColor: Colors.violet,
                                paddingHorizontal: 10, paddingVertical: 5,
                                borderRadius: 20,
                            }}>
                                <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: Colors.white }}>
                                    {artisan.matchScore}%
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </AnimatedTouchableOpacity>
        );
    }

    // ─── Standard Vertical Card (horizontal scroll list) ──────────────────────
    return (
        <AnimatedTouchableOpacity
            style={[{
                borderRadius: Radius.lg,
                overflow: 'hidden',
                width: 170,
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.cardBorder,
                ...Shadows.sm,
            }, animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            accessibilityLabel={`View ${artisan.name}'s profile`}
        >
            {/* Photo strip */}
            <ImageBackground
                source={craftImage}
                style={{ width: '100%', height: 88 }}
                resizeMode="cover"
            >
                <View style={{ ...StyleSheet_absoluteFill, backgroundColor: 'rgba(0,0,0,0.32)' }} />
                {/* Skill label bottom-left */}
                <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
                    <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans-Bold', color: 'white', textTransform: 'capitalize' }}>
                        {primarySkill}
                    </Text>
                </View>
                {/* Online dot */}
                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                    <OnlineDot online={artisan.availability === 'online'} />
                </View>
            </ImageBackground>

            {/* Info */}
            <View style={{ padding: 12, gap: 6 }}>
                <Text style={[Typography.h3, { fontSize: 14 }]} numberOfLines={1}>
                    {artisan.name}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="star" size={10} color="#F59E0B" />
                    <Text style={{ fontSize: 11, fontFamily: 'Inter-SemiBold', color: Colors.ink }}>
                        {artisan.rating.toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.muted }}>
                        · {artisan.distance}km
                    </Text>
                </View>

                {artisan.verified && <LoomVerifiedBadge />}

                <View style={{
                    borderTopWidth: 1, borderTopColor: Colors.divider,
                    paddingTop: 8, marginTop: 2,
                }}>
                    <Text style={{ fontSize: 9, fontFamily: 'Inter-Regular', color: Colors.muted, marginBottom: 2 }}>
                        starting at
                    </Text>
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: Colors.ink }}>
                        {formatNaira(artisan.priceRange.min).split('.')[0]}
                    </Text>
                </View>
            </View>
        </AnimatedTouchableOpacity>
    );
});

// Inline absoluteFill helper (avoids importing StyleSheet just for this)
const StyleSheet_absoluteFill = {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
};
