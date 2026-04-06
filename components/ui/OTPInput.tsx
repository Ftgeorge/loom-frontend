import React, { useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View,
    Platform
} from 'react-native';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
    error?: string;
    className?: string;
}

export function OTPInput({ length = 6, onComplete, error, className = '' }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const refs = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        const newValues = [...values];
        newValues[index] = text;
        setValues(newValues);

        if (text && index < length - 1) {
            refs.current[index + 1]?.focus();
        }

        if (newValues.every((v) => v)) {
            onComplete(newValues.join(''));
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    return (
        <View className={className}>
            <View className="flex-row justify-center gap-[10px]">
                {values.map((val, i) => {
                    const isFocused = focusedIndex === i;
                    const hasError = !!error;

                    const getBorderClass = () => {
                        if (hasError) return 'border-error';
                        if (isFocused) return 'border-primary';
                        return 'border-card-border';
                    };

                    const getBackgroundClass = () => {
                        if (isFocused) return 'bg-white';
                        return 'bg-surface';
                    };

                    return (
                        <TextInput
                            key={i}
                            ref={(r) => { refs.current[i] = r; }}
                            className={`w-[53px] h-[60px] rounded-md border-[1.5px] text-[24px] font-jakarta-bold text-ink text-center shadow-sm ${getBorderClass()} ${getBackgroundClass()}`}
                            style={Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}}
                            value={val}
                            onFocus={() => setFocusedIndex(i)}
                            onBlur={() => setFocusedIndex(null)}
                            onChangeText={(t) => handleChange(t.slice(-1), i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            accessibilityLabel={`Digit ${i + 1}`}
                        />
                    );
                })}
            </View>
            {error && (
                <Text className="text-label text-error mt-3 text-center normal-case text-[11px] tracking-normal">
                    {error}
                </Text>
            )}
        </View>
    );
}


