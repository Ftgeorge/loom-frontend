import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// ─── Card ───────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    className?: string;
    onPress?: () => void;
}

export function Card({ children, style, noPadding, className = '', onPress }: CardProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.98); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1); };

    if (onPress) {
        return (
            <AnimatedTouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[
                    {
                        backgroundColor: Colors.surface,
                        borderRadius: Radius.md,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                        padding: noPadding ? 0 : 20,
                        ...Shadows.sm,
                    },
                    style,
                    animatedStyle
                ]}
                className={className}
            >
                {children}
            </AnimatedTouchableOpacity>
        );
    }

    return (
        <View
            style={[
                {
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    padding: noPadding ? 0 : 20,
                    ...Shadows.sm,
                },
                style,
            ]}
            className={className}
        >
            {children}
        </View>
    );
}

// ─── Chip ───────────────────────────────────────────────
interface ChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    color?: string;
    icon?: string;
    small?: boolean;
    containerStyle?: ViewStyle;
}

export function Chip({ label, selected, onPress, color, icon, small, containerStyle }: ChipProps) {
    const activeColor = color ?? Colors.primary;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.95); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1); };

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            activeOpacity={1}
            style={[
                {
                    backgroundColor: selected ? activeColor : Colors.white,
                    borderRadius: Radius.md,
                    paddingHorizontal: small ? 10 : 16,
                    paddingVertical: small ? 6 : 10,
                    borderWidth: 1,
                    borderColor: selected ? activeColor : Colors.cardBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    ...Shadows.sm
                },
                containerStyle,
                animatedStyle
            ]}
        >
            {icon && <Ionicons name={icon as any} size={small ? 12 : 16} color={selected ? Colors.white : Colors.primary} />}
            <Text
                style={[
                    small ? { fontSize: 11 } : Typography.bodySmall,
                    {
                        color: selected ? Colors.white : Colors.textSecondary,
                        fontFamily: Typography.label.fontFamily,
                        fontWeight: selected ? '700' : '500'
                    }
                ]}
            >
                {label}
            </Text>
        </AnimatedTouchableOpacity>
    );
}

// ─── Badge ──────────────────────────────────────────────
interface BadgeProps {
    label?: string;
    count?: number;
    color?: string;
    variant?: 'default' | 'verified' | 'success' | 'warn' | 'accent';
}

export function Badge({ label, count, color, variant = 'default' }: BadgeProps) {
    if (variant === 'verified') {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.accentLight,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: Radius.sm,
                borderWidth: 1,
                borderColor: Colors.accent,
                gap: 6,
            }}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.accent} />
                <Text style={[Typography.label, { color: Colors.accent, fontSize: 10, fontWeight: '800' }]}>VERIFIED</Text>
            </View>
        );
    }

    if (count !== undefined) {
        return (
            <View style={{
                backgroundColor: Colors.error,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
            }}>
                <Text style={{ fontSize: 10, color: Colors.white, fontWeight: 'bold' }}>{count > 99 ? '99+' : count}</Text>
            </View>
        );
    }

    const getColors = () => {
        switch (variant) {
            case 'success': return { bg: Colors.success + '15', text: Colors.success };
            case 'warn': return { bg: Colors.warning + '15', text: Colors.warning };
            case 'accent': return { bg: Colors.accentLight, text: Colors.accent };
            default: return { bg: Colors.gray100, text: Colors.textSecondary };
        }
    }

    const { bg, text } = getColors();

    return (
        <View style={{
            backgroundColor: color ? color + '15' : bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: Radius.xs,
        }}>
            <Text style={[Typography.label, { color: color ?? text, fontSize: 9 }]}>{label}</Text>
        </View>
    );
}

