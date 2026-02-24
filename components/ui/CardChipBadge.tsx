import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

// ─── Card ───────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    className?: string;
}

export function Card({ children, style, noPadding, className = '' }: CardProps) {
    return (
        <View
            className={`bg-surface rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${noPadding ? '' : 'p-5'} ${className}`}
            style={style}
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
    small?: boolean;
}

export function Chip({ label, selected, onPress, color, small }: ChipProps) {
    const Wrapper = onPress ? require('react-native').TouchableOpacity : View;

    // Fallbacks for dynamic sizing/colors
    const sizeClasses = small ? 'px-3 py-1' : 'px-4 py-2';
    const textSizeClasses = small ? 'text-xs' : 'text-sm';

    let containerClass = `rounded-full ${sizeClasses} `;
    let textClass = `font-medium ${textSizeClasses} `;

    // Colors
    if (selected) {
        if (!color) containerClass += 'bg-primary/10 ';
        textClass += 'text-primary';
    } else {
        containerClass += 'bg-gray-100 ';
        textClass += 'text-gray-600';
    }

    return (
        <Wrapper
            className={containerClass}
            style={selected && color ? { backgroundColor: color } : undefined}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole={onPress ? 'button' : undefined}
        >
            <Text className={textClass}>
                {label}
            </Text>
        </Wrapper>
    );
}

// ─── Badge ──────────────────────────────────────────────
interface BadgeProps {
    label?: string;
    count?: number;
    color?: string;
    variant?: 'default' | 'verified' | 'status';
}

export function Badge({ label, count, color, variant = 'default' }: BadgeProps) {
    if (variant === 'verified') {
        return (
            <View className="flex-row items-center bg-primary/40 px-3 py-1 rounded-full gap-1">
                <Text className="text-[10px] text-primary font-bold">✓</Text>
                <Text className="text-[11px] text-primary font-semibold">Verified</Text>
            </View>
        );
    }

    if (count !== undefined) {
        return (
            <View
                className="bg-red-500 rounded-full min-w-[20px] h-[20px] items-center justify-center px-1.5"
                style={color ? { backgroundColor: color } : undefined}
            >
                <Text className="text-[11px] text-white font-bold">{count > 99 ? '99+' : count}</Text>
            </View>
        );
    }

    return (
        <View
            className="bg-primary/10 px-3 py-1 rounded-md"
            style={color ? { backgroundColor: color } : undefined}
        >
            <Text className="text-xs text-primary font-semibold">{label}</Text>
        </View>
    );
}
