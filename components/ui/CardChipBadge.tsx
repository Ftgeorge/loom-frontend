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

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.97, { damping: 15 }); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 15 }); };

    const getBaseClasses = () => {
        let classes = 'rounded-md shadow-sm border-[1px]';
        if (dark) classes += ' bg-primary border-white/5';
        else if (glass) classes += ' bg-glass border-white/50';
        else classes += ' bg-surface border-card-border';
        
        if (!noPadding) classes += ' p-[18px]';
        return classes;
    };

    if (onPress) {
        return (
            <AnimatedTouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[style, animatedStyle]}
                className={`${getBaseClasses()} ${className}`}
            >
                {children}
            </AnimatedTouchableOpacity>
        );
    }

    return (
        <Animated.View style={style} className={`${getBaseClasses()} ${className}`}>
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
    className?: string;
    violet?: boolean;
}

export function Chip({ label, selected, onPress, color, icon, small, containerStyle, className = '', violet }: ChipProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { if (onPress) scale.value = withSpring(0.94, { damping: 14 }); };
    const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 14 }); };

    const getContainerClasses = () => {
        let classes = 'rounded-xs border-[1px] flex-row items-center gap-[5px] shadow-xs';
        
        if (small) classes += ' px-[10px] py-[6px]';
        else classes += ' px-4 py-[10px]';

        if (selected) {
            if (violet) classes += ' bg-violet border-violet';
            else classes += ' bg-primary border-primary';
        } else {
            classes += ' bg-surface border-card-border';
        }

        return classes;
    };

    const getTextClasses = () => {
        let classes = 'font-inter-semibold';
        if (small) classes += ' text-[11px]';
        else classes += ' text-[13px]';

        if (selected) classes += ' text-white';
        else classes += ' text-text-secondary';

        return classes;
    };

    // If a custom color is passed, we use an inline style for the background/border
    const dynamicStyle = color && selected ? { backgroundColor: color, borderColor: color } : {};

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            activeOpacity={1}
            style={[containerStyle, dynamicStyle, animatedStyle]}
            className={`${getContainerClasses()} ${className}`}
        >
            {icon && (
                <Ionicons 
                    name={icon as any} 
                    size={small ? 12 : 14} 
                    className={selected ? 'text-white' : 'text-muted'} 
                />
            )}
            <Text className={getTextClasses()}>
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
    className?: string;
    variant?: 'default' | 'verified' | 'success' | 'warn' | 'accent' | 'violet';
}

export function Badge({ label, count, color, className = '', variant = 'default' }: BadgeProps) {
    // Premium "Loom Verified" badge — metallic violet
    if (variant === 'verified') {
        return (
            <View className={`flex-row items-center bg-violet-light px-[10px] py-1 rounded-[20px] border-[1px] border-violet/30 gap-[5px] ${className}`}>
                <Ionicons name="shield-checkmark" size={11} className="text-violet" />
                <Text className="text-[9px] font-jakarta-bold text-violet tracking-[0.4px] uppercase">Loom Verified</Text>
            </View>
        );
    }

    if (count !== undefined) {
        return (
            <View className={`bg-error rounded-[12px] min-w-[20px] h-5 items-center justify-center px-[5px] ${className}`}>
                <Text className="text-[10px] font-inter-bold text-white">
                    {count > 99 ? '99+' : count}
                </Text>
            </View>
        );
    }

    const getVariantClasses = () => {
        switch (variant) {
            case 'success': return 'bg-success-light text-success';
            case 'warn': return 'bg-warning-light text-warning';
            case 'accent': return 'bg-accent-light text-accent';
            case 'violet': return 'bg-violet-light text-violet';
            default: return 'bg-gray-100 text-text-secondary';
        }
    };

    const variantClasses = getVariantClasses();
    const bgClass = variantClasses.split(' ')[0];
    const textClass = variantClasses.split(' ')[1];

    return (
        <View 
            style={color ? { backgroundColor: color + '15' } : {}}
            className={`${bgClass} px-2 py-1 rounded-[20px] ${className}`}
        >
            <Text 
                style={color ? { color } : {}}
                className={`text-[10px] font-inter-semibold ${textClass}`}
            >
                {label}
            </Text>
        </View>
    );
}

