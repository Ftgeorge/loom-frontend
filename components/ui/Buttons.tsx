import { Colors, Radius, Shadows, Typography } from '@/theme';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
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

    const getStyles = () => {
        if (disabled) return {
            bg: Colors.gray200,
            text: Colors.gray400,
            border: 'transparent',
        };
        switch (variant) {
            case 'accent': return { bg: Colors.accent, text: Colors.white, border: 'transparent' };
            case 'secondary': return { bg: Colors.primaryLight, text: Colors.primary, border: 'transparent' };
            case 'violet': return { bg: Colors.violet, text: Colors.white, border: 'transparent' };
            case 'ghost': return { bg: 'transparent', text: Colors.primary, border: Colors.cardBorder };
            case 'outlined': return { bg: Colors.surface, text: Colors.ink, border: Colors.cardBorder };
            default: return { bg: Colors.primary, text: Colors.white, border: 'transparent' };
        }
    };

    const getShadow = () => {
        if (disabled) return {};
        switch (variant) {
            case 'violet': return Shadows.violet;
            case 'primary': return Shadows.brand;
            default: return Shadows.md;
        }
    };

    const { bg, text, border } = getStyles();

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                {
                    backgroundColor: bg,
                    borderRadius: Radius.md,
                    height: 56,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                    gap: 8,
                    borderWidth: border !== 'transparent' ? 1.5 : 0,
                    borderColor: border !== 'transparent' ? border : undefined,
                    ...getShadow(),
                },
                style,
                animatedStyle
            ]}
            className={className}
        >
            {loading ? (
                <ActivityIndicator color={text} />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            Typography.button,
                            { color: text },
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

export function VioletButton(props: Props) {
    return <PrimaryButton {...props} variant="violet" />;
}

export function OutlinedButton({ title, onPress, loading, disabled, style, textStyle, icon }: Props) {
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
                    gap: 8,
                    backgroundColor: Colors.surface,
                    ...Shadows.xs,
                },
                style,
                animatedStyle,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={[Typography.button, { color: Colors.ink }, textStyle]}>{title}</Text>
                </>
            )}
        </AnimatedTouchableOpacity>
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
            icon={image && <Image source={image} style={{ width: 22, height: 22 }} resizeMode="contain" />}
        />
    );
}
