import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// ─── Card ───────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    className?: string;
    onPress?: () => void;
}

export function Card({ children, style, noPadding, className = '', onPress }: CardProps) {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
        <Wrapper
            onPress={onPress}
            activeOpacity={0.8}
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
        </Wrapper>
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
}

export function Chip({ label, selected, onPress, color, icon, small }: ChipProps) {
    const activeColor = color ?? Colors.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                backgroundColor: selected ? activeColor + '15' : Colors.white,
                borderRadius: Radius.full,
                paddingHorizontal: small ? 10 : 16,
                paddingVertical: small ? 6 : 10,
                borderWidth: small ? 1 : 1.5,
                borderColor: selected ? activeColor : Colors.cardBorder,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
            }}
        >
            {icon && <Ionicons name={icon as any} size={small ? 12 : 16} color={selected ? activeColor : Colors.muted} />}
            <Text
                style={[
                    small ? { fontSize: 11 } : Typography.bodySmall,
                    {
                        color: selected ? activeColor : Colors.textSecondary,
                        fontFamily: 'System',
                        fontWeight: selected ? '600' : '400'
                    }
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// ─── Badge ──────────────────────────────────────────────
interface BadgeProps {
    label?: string;
    count?: number;
    color?: string;
    variant?: 'default' | 'verified' | 'success' | 'warn';
}

export function Badge({ label, count, color, variant = 'default' }: BadgeProps) {
    if (variant === 'verified') {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.primaryLight,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: Radius.full,
                gap: 4,
            }}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.primary} />
                <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>Verified Pro</Text>
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
            default: return { bg: Colors.background, text: Colors.textSecondary };
        }
    }

    const { bg, text } = getColors();

    return (
        <View style={{
            backgroundColor: color ? color + '15' : bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: Radius.sm,
        }}>
            <Text style={[Typography.label, { color: color ?? text, fontSize: 11 }]}>{label}</Text>
        </View>
    );
}

