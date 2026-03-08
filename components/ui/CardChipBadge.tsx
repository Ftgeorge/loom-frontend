import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    className?: string;
    onPress?: () => void;
    glass?: boolean;    // Glassmorphism variant
    dark?: boolean;     // Dark card variant
}

export function Card({ children, style, noPadding, className = '', onPress, glass, dark }: CardProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const baseStyle: ViewStyle = {
        backgroundColor: dark ? Colors.primary : glass ? Colors.glass : Colors.surface,
        borderRadius: Radius.lg,
        borderWidth: glass ? 1 : 1,
        borderColor: glass ? 'rgba(255,255,255,0.5)' : dark ? 'rgba(255,255,255,0.06)' : Colors.cardBorder,
        padding: noPadding ? 0 : 18,
        ...Shadows.sm,
    };

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.97, { damping: 15 }); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 15 }); };

    if (onPress) {
        return (
            <AnimatedTouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[baseStyle, style, animatedStyle]}
                className={className}
            >
                {children}
            </AnimatedTouchableOpacity>
        );
    }

    return (
        <Animated.View style={[baseStyle, style]} className={className}>
            {children}
        </Animated.View>
    );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
interface ChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    color?: string;
    icon?: string;
    small?: boolean;
    containerStyle?: ViewStyle;
    violet?: boolean;
}

export function Chip({ label, selected, onPress, color, icon, small, containerStyle, violet }: ChipProps) {
    const activeColor = violet ? Colors.violet : (color ?? Colors.primary);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.94, { damping: 14 }); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 14 }); };

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            activeOpacity={1}
            style={[
                {
                    backgroundColor: selected
                        ? (violet ? Colors.violet : activeColor)
                        : (violet && selected ? Colors.violetLight : Colors.surface),
                    borderRadius: Radius.full,
                    paddingHorizontal: small ? 10 : 16,
                    paddingVertical: small ? 6 : 10,
                    borderWidth: 1,
                    borderColor: selected
                        ? (violet ? Colors.violet : activeColor)
                        : Colors.cardBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    ...Shadows.xs,
                },
                containerStyle,
                animatedStyle
            ]}
        >
            {icon && <Ionicons name={icon as any} size={small ? 12 : 14} color={selected ? Colors.white : Colors.muted} />}
            <Text
                style={{
                    fontSize: small ? 11 : 13,
                    fontFamily: 'Inter-SemiBold',
                    color: selected ? Colors.white : Colors.textSecondary,
                }}
            >
                {label}
            </Text>
        </AnimatedTouchableOpacity>
    );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
    label?: string;
    count?: number;
    color?: string;
    variant?: 'default' | 'verified' | 'success' | 'warn' | 'accent' | 'violet';
}

export function Badge({ label, count, color, variant = 'default' }: BadgeProps) {
    // Premium "Loom Verified" badge — metallic violet
    if (variant === 'verified') {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.violetLight,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: Colors.violet + '30',
                gap: 5,
            }}>
                <Ionicons name="shield-checkmark" size={11} color={Colors.violet} />
                <Text style={{
                    fontSize: 9,
                    fontFamily: 'PlusJakartaSans-Bold',
                    color: Colors.violet,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase' as const,
                }}>Loom Verified</Text>
            </View>
        );
    }

    if (count !== undefined) {
        return (
            <View style={{
                backgroundColor: Colors.error,
                borderRadius: 12,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5,
            }}>
                <Text style={{ fontSize: 10, fontFamily: 'Inter-Bold', color: Colors.white }}>
                    {count > 99 ? '99+' : count}
                </Text>
            </View>
        );
    }

    const getColors = () => {
        switch (variant) {
            case 'success': return { bg: Colors.successLight, text: Colors.success };
            case 'warn': return { bg: Colors.warningLight, text: Colors.warning };
            case 'accent': return { bg: Colors.accentLight, text: Colors.accent };
            case 'violet': return { bg: Colors.violetLight, text: Colors.violet };
            default: return { bg: Colors.gray100, text: Colors.textSecondary };
        }
    };

    const { bg, text } = getColors();

    return (
        <View style={{
            backgroundColor: color ? color + '15' : bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 20,
        }}>
            <Text style={{
                fontSize: 10,
                fontFamily: 'Inter-SemiBold',
                color: color ?? text,
            }}>
                {label}
            </Text>
        </View>
    );
}
