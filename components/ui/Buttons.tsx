import { Colors } from '@/theme';
import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface Props {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
    className?: string;
}

export function PrimaryButton({ title, onPress, loading, disabled, style, textStyle, icon, className = '' }: Props) {
    return (
        <TouchableOpacity
            className={`py-3.5 px-6 rounded-xl flex-row items-center justify-center gap-2 min-h-[50px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${disabled || loading ? 'bg-gray-300' : 'bg-primary'} ${className}`}
            style={style}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
                <>
                    {icon}
                    <Text className="text-base font-bold text-white" style={textStyle}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

export function SecondaryButton({ title, onPress, loading, disabled, style, textStyle, icon, className = '' }: Props) {
    return (
        <TouchableOpacity
            className={`bg-transparent py-3.5 px-6 rounded-xl flex-row items-center justify-center gap-2 min-h-[50px] border-[1.5px] ${disabled || loading ? 'border-gray-300' : 'border-primary'} ${className}`}
            style={style}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            {loading ? (
                <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
                <>
                    {icon}
                    <Text
                        className={`text-base font-bold ${disabled || loading ? 'text-gray-400' : 'text-primary'}`}
                        style={textStyle}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
