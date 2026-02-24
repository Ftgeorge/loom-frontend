import { Colors } from '@/theme';
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

    let wrapperClass = "flex-row items-center border-[1.5px] rounded-xl bg-white min-h-[50px] ";
    if (error) {
        wrapperClass += "border-red-500";
    } else if (focused) {
        wrapperClass += "border-primary/20";
    } else {
        wrapperClass += "border-gray-200";
    }

    return (
        <View className="mb-5">
            {label && <Text className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">{label}</Text>}
            <View className={wrapperClass}>
                {leftIcon && <View className="pl-5">{leftIcon}</View>}
                <RNTextInput
                    className="flex-1 text-base px-5 py-3 text-primary"
                    style={style}
                    placeholderTextColor={Colors.gray400}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    accessibilityLabel={label}
                    {...props}
                />
                {rightIcon && <View className="pr-5">{rightIcon}</View>}
            </View>
            {error && <Text className="text-xs text-red-500 mt-1.5">{error}</Text>}
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
                    <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.gray500} />
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
                <Text className="text-base text-gray-500 pl-5">+234</Text>
            }
        />
    );
}
