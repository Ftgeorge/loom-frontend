import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
    Platform,
} from 'react-native';

interface AppTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    className?: string;
}

export function AppTextInput({
    label,
    error,
    leftIcon,
    rightIcon,
    style,
    containerStyle,
    className = '',
    onFocus,
    onBlur,
    ...props
}: AppTextInputProps) {
    const [focused, setFocused] = useState(false);

    const getBorderClass = () => {
        if (error) return 'border-error';
        if (focused) return 'border-primary/80';
        return 'border-card-border';
    };

    const getBackgroundClass = () => {
        if (error) return 'bg-error-light';
        if (focused) return 'bg-white';
        return 'bg-canvas';
    };

    const getShadowClass = () => {
        if (focused) return 'shadow-sm shadow-primary/10';
        return '';
    };

    const inputContainerClasses = `flex-row items-center justify-center border-[1.5px] rounded-sm h-[58px] overflow-hidden ${getBorderClass()} ${getBackgroundClass()} ${getShadowClass()}`;

    return (
        <View style={[{ marginBottom: 20, width: '100%' }, containerStyle]} className={className}>
            {label && (
                <Text className={`text-label mb-2 ${focused ? 'text-primary' : 'text-muted'}`}>
                    {label}
                </Text>
            )}

            <View className={inputContainerClasses}>
                {leftIcon && (
                    <View className="justify-center items-center">
                        {leftIcon}
                    </View>
                )}

                <RNTextInput
                    style={[
                        {
                            flex: 1,
                            paddingHorizontal: 16,
                            height: Platform.OS === 'ios' ? 58 : '100%',
                            textAlignVertical: 'center',
                            includeFontPadding: false,
                            paddingTop: 0,
                            paddingBottom: 0,
                            ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
                        },
                        style
                    ]}
                    className="text-body text-ink"
                    placeholderTextColor="#9CA3AF"
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    accessibilityLabel={label}
                    selectionColor="#0F3826"
                    {...props}
                />

                {rightIcon && (
                    <View className="pr-4 justify-center items-center">
                        {rightIcon}
                    </View>
                )}
            </View>

            {error && (
                <Text className="text-label text-error mt-[6px] text-[11px] normal-case tracking-normal">
                    {error}
                </Text>
            )}
        </View>
    );
}

// --- Specialized Inputs ---

export function PasswordInput({ ...props }: Omit<AppTextInputProps, 'rightIcon'>) {
    const [visible, setVisible] = useState(false);
    return (
        <AppTextInput
            {...props}
            secureTextEntry={!visible}
            rightIcon={
                <TouchableOpacity
                    onPress={() => setVisible(!visible)}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons
                        name={visible ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        className="text-muted"
                    />
                </TouchableOpacity>
            }
        />
    );
}

export function PhoneInput(props: Omit<AppTextInputProps, 'leftIcon'>) {
    return (
        <AppTextInput
            {...props}
            keyboardType="phone-pad"
            leftIcon={
                <View className="flex-row items-center pl-4">
                    <Text className="text-body text-text-secondary font-inter-semibold">
                        +234
                    </Text>
                    <View className="w-[1px] h-6 bg-card-border ml-3" />
                </View>
            }
        />
    );
}