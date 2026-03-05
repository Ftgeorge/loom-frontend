import { Colors, Radius, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface AppTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function AppTextInput({ label, error, leftIcon, rightIcon, style, ...props }: AppTextInputProps) {
    const [focused, setFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return Colors.error;
        if (focused) return Colors.primary;
        return Colors.cardBorder;
    };

    const getBackgroundColor = () => {
        if (error) return Colors.error + '05';
        if (focused) return Colors.white;
        return Colors.surface;
    };

    return (
        <View style={{ marginBottom: 20 }}>
            {label && (
                <Text style={[Typography.label, { marginBottom: 8, color: focused ? Colors.primary : Colors.textSecondary }]}>
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderRadius: Radius.md,
                    minHeight: 58,
                    borderColor: getBorderColor(),
                    backgroundColor: getBackgroundColor(),
                }}
            >
                {leftIcon && <View style={{ paddingLeft: 16 }}>{leftIcon}</View>}
                <RNTextInput
                    style={[
                        Typography.body,
                        {
                            flex: 1,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            color: Colors.text
                        },
                        style
                    ]}
                    placeholderTextColor={Colors.muted}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    accessibilityLabel={label}
                    selectionColor={Colors.primary}
                    {...props}
                />
                {rightIcon && <View style={{ paddingRight: 16 }}>{rightIcon}</View>}
            </View>
            {error && (
                <Text style={[Typography.label, { color: Colors.error, marginTop: 6, fontSize: 11 }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

interface PasswordInputProps extends Omit<AppTextInputProps, 'rightIcon'> { }

export function PasswordInput({ ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);
    return (
        <AppTextInput
            {...props}
            secureTextEntry={!visible}
            rightIcon={
                <TouchableOpacity onPress={() => setVisible(!visible)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                    <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.muted} />
                </TouchableOpacity>
            }
        />
    );
}

interface PhoneInputProps extends Omit<AppTextInputProps, 'leftIcon'> { }

export function PhoneInput(props: PhoneInputProps) {
    return (
        <AppTextInput
            {...props}
            keyboardType="phone-pad"
            leftIcon={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 12 }}>
                    <Text style={[Typography.body, { color: Colors.textSecondary, fontWeight: '600' }]}>+234</Text>
                    <View style={{ width: 1, height: 20, backgroundColor: Colors.cardBorder, marginLeft: 4 }} />
                </View>
            }
        />
    );
}

