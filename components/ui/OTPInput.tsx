import React, { useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from 'react-native';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
    error?: string;
}

export function OTPInput({ length = 6, onComplete, error }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
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
            <View className="flex-row justify-center gap-2.5">
                {values.map((val, i) => {
                    let cellClass = "w-12 h-14 border-[1.5px] rounded-xl text-2xl font-bold text-olive bg-white text-center ";
                    if (error) {
                        cellClass += "border-red-500 ";
                    } else if (val) {
                        cellClass += "border-sage-200 bg-sage-50 ";
                    } else {
                        cellClass += "border-gray-200 ";
                    }

                    return (
                        <TextInput
                            key={i}
                            ref={(r) => { refs.current[i] = r; }}
                            className={cellClass}
                            value={val}
                            onChangeText={(t) => handleChange(t.slice(-1), i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            accessibilityLabel={`Digit ${i + 1}`}
                        />
                    );
                })}
            </View>
            {error && <Text className="text-xs text-red-500 mt-2 text-center">{error}</Text>}
        </View>
    );
}
