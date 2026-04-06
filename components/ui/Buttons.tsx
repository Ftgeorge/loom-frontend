import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    className?: string;
    image?: any;
    variant?: 'primary' | 'secondary' | 'accent' | 'outlined' | 'violet' | 'ghost';
}

export function PrimaryButton({
    title,
    onPress,
    loading,
    disabled,
    style,
    textStyle,
    icon,
    className = '',
    variant = 'primary'
}: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); };
    const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };

    const getVariantClasses = () => {
        if (disabled) return 'bg-gray-200';
        switch (variant) {
            case 'accent': return 'bg-accent';
            case 'secondary': return 'bg-primary-light';
            case 'violet': return 'bg-violet shadow-violet';
            case 'ghost': return 'bg-transparent border-[1.5px] border-card-border';
            case 'outlined': return 'bg-surface border-[1.5px] border-card-border shadow-xs';
            default: return 'bg-primary shadow-brand';
        }
    };

    const getTextColorClass = () => {
        if (disabled) return 'text-gray-400';
        switch (variant) {
            case 'accent':
            case 'violet':
            case 'primary': return 'text-white';
            case 'secondary':
            case 'ghost': return 'text-primary';
            case 'outlined': return 'text-ink';
            default: return 'text-white';
        }
    };

    const containerClasses = `h-[56px] rounded-sm flex-row items-center justify-center px-6 gap-2 ${getVariantClasses()} ${className}`;
    const textClasses = `text-button ${getTextColorClass()}`;

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled || loading}
            style={[style, animatedStyle]}
            className={containerClasses}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#0F3826' : 'white'} />
            ) : (
                <>
                    {icon}
                    <Text className={textClasses} style={textStyle}>
                        {title}
                    </Text>
                </>
            )}
        </AnimatedTouchableOpacity>
    );
}

export function SecondaryButton(props: Props) {
    return <PrimaryButton {...props} variant="secondary" />;
}

export function VioletButton(props: Props) {
    return <PrimaryButton {...props} variant="violet" />;
}

export function OutlinedButton({ title, onPress, loading, disabled, style, textStyle, icon, className = '' }: Props) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
            disabled={disabled || loading}
            activeOpacity={1}
            style={[style, animatedStyle]}
            className={`h-[56px] rounded-sm border-[1.5px] border-card-border flex-row items-center justify-center px-5 gap-2 bg-surface shadow-xs ${className}`}
        >
            {loading ? (
                <ActivityIndicator color="#0F3826" />
            ) : (
                <>
                    {icon}
                    <Text className="text-button text-ink" style={textStyle}>{title}</Text>
                </>
            )}
        </AnimatedTouchableOpacity>
    );
}

export function OauthButton({ title, onPress, loading, image, style, textStyle, className = '' }: Props) {
    return (
        <OutlinedButton
            title={title}
            onPress={onPress}
            loading={loading}
            style={style}
            textStyle={textStyle}
            className={className}
            icon={image && <Image source={image} className="w-[22px] h-[22px]" resizeMode="contain" />}
        />
    );
}

