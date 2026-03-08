import { Colors, Radius, Typography } from '@/theme';
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
    TextStyle,
} from 'react-native';

interface AppTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export function AppTextInput({
    label,
    error,
    leftIcon,
    rightIcon,
    style,
    containerStyle,
    onFocus,
    onBlur,
    ...props
}: AppTextInputProps) {
    const [focused, setFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return Colors.error;
        if (focused) return Colors.primary + 'CC';
        return Colors.cardBorder;
    };

    const getBackgroundColor = () => {
        if (error) return Colors.errorLight;
        if (focused) return Colors.white;
        return Colors.canvas;
    };

    return (
        <View style={[{ marginBottom: 20, width: '100%' }, containerStyle]}>
            {label && (
                <Text style={[
                    Typography.label,
                    {
                        marginBottom: 8,
                        color: focused ? Colors.primary : Colors.muted
                    }
                ]}>
                    {label}
                </Text>
            )}

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderRadius: Radius.md,
                    height: 58,
                    borderColor: getBorderColor(),
                    backgroundColor: getBackgroundColor(),
                    overflow: 'hidden',
                    shadowColor: focused ? Colors.primary : 'transparent',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: focused ? 0.12 : 0,
                    shadowRadius: 8,
                }}
            >
                {leftIcon && (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {leftIcon}
                    </View>
                )}

                <RNTextInput
                    style={[
                        {
                            flex: 1,
                            color: Colors.ink,
                            fontFamily: 'Inter-Regular',
                            fontSize: 15,
                            paddingHorizontal: 16,
                            height: Platform.OS === 'ios' ? 58 : '100%',
                            textAlignVertical: 'center',
                            includeFontPadding: false,
                            lineHeight: undefined,
                            paddingTop: 0,
                            paddingBottom: 0,
                            ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
                        },
                        style
                    ]}
                    placeholderTextColor={Colors.muted}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    accessibilityLabel={label}
                    selectionColor={Colors.primary}
                    {...props}
                />

                {rightIcon && (
                    <View style={{ paddingRight: 16, justifyContent: 'center', alignItems: 'center' }}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {error && (
                <Text style={[
                    Typography.label,
                    { color: Colors.error, marginTop: 6, fontSize: 11 }
                ]}>
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
                        color={Colors.muted}
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
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 16
                }}>
                    <Text style={[
                        Typography.body,
                        { color: Colors.textSecondary, fontWeight: '600', lineHeight: undefined }
                    ]}>
                        +234
                    </Text>
                    <View style={{
                        width: 1,
                        height: 24,
                        backgroundColor: Colors.cardBorder,
                        marginLeft: 12
                    }} />
                </View>
            }
        />
    );
}