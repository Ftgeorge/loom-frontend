import { Colors, Radius, Shadows, Typography } from '@/theme';
import React, { useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View
} from 'react-native';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
    error?: string;
}

export function OTPInput({ length = 6, onComplete, error }: OTPInputProps) {
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
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                {values.map((val, i) => {
                    const isFocused = focusedIndex === i;
                    const hasError = !!error;

                    return (
                        <TextInput
                            key={i}
                            ref={(r) => { refs.current[i] = r; }}
                            style={[
                                {
                                    width: 48,
                                    height: 60,
                                    borderRadius: Radius.md,
                                    borderWidth: 1.5,
                                    backgroundColor: isFocused ? Colors.white : Colors.surface,
                                    borderColor: hasError ? Colors.error : (isFocused ? Colors.primary : Colors.cardBorder),
                                    fontSize: 24,
                                    fontFamily: 'MontserratAlternates-Bold',
                                    color: Colors.text,
                                    textAlign: 'center',
                                    ...Shadows.sm
                                }
                            ]}
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
                <Text style={[Typography.label, { color: Colors.error, marginTop: 12, textAlign: 'center', fontSize: 11 }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

