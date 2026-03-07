import { Colors, Radius, Typography } from '@/theme';
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
    variant?: 'primary' | 'secondary' | 'accent' | 'outlined';
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

    const handlePressIn = () => { scale.value = withSpring(0.97); };
    const handlePressOut = () => { scale.value = withSpring(1); };

    const getBgColor = () => {
        if (disabled) return '#CBD5E1'; // Slate 300
        if (variant === 'accent') return Colors.accent;
        if (variant === 'secondary') return Colors.primaryLight;
        return Colors.primary;
    };

    const getTextColor = () => {
        if (variant === 'secondary') return Colors.primary;
        return Colors.white;
    };

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                {
                    backgroundColor: getBgColor(),
                    borderRadius: Radius.md,
                    height: 56,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                },
                style,
                animatedStyle
            ]}
            className={className}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' ? Colors.primary : Colors.white} />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            Typography.button,
                            { color: getTextColor() },
                            textStyle
                        ]}
                    >
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

export function OutlinedButton({ title, onPress, loading, disabled, style, textStyle, icon, className = '' }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                {
                    height: 56,
                    borderRadius: Radius.md,
                    borderWidth: 1.5,
                    borderColor: Colors.cardBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                },
                style
            ]}
            className={className}
        >
            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={[Typography.button, { color: Colors.text }, textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

export function OauthButton({ title, onPress, loading, image, style, textStyle }: Props) {
    return (
        <OutlinedButton
            title={title}
            onPress={onPress}
            loading={loading}
            style={style}
            textStyle={textStyle}
            icon={image && <Image source={image} style={{ width: 22, height: 22, marginRight: 12 }} resizeMode="contain" />}
        />
    );
}

