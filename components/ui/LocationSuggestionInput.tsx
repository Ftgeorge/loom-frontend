import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { AppTextInput } from './TextInputs';

interface LocationSuggestionInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    suggestions: string[];
    error?: string;
    containerStyle?: any;
    className?: string;
}

export function LocationSuggestionInput({
    label,
    placeholder,
    value,
    onChangeText,
    suggestions,
    error,
    containerStyle,
    className = ''
}: LocationSuggestionInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = useMemo(() => {
        if (!value || value.length < 1) return [];
        return suggestions
            .filter(s => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase())
            .slice(0, 5);
    }, [value, suggestions]);

    return (
        <View 
            style={[containerStyle]} 
            className={`${showSuggestions && filteredSuggestions.length > 0 ? 'z-[100]' : 'z-[1]'} ${className}`}
        >
            <AppTextInput
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => {
                    onChangeText(text);
                    setShowSuggestions(true);
                }}
                error={error}
                onFocus={() => {
                    setIsFocused(true);
                    setShowSuggestions(true);
                }}
                onBlur={() => {
                    setIsFocused(false);
                    // Delay hiding to allow item selection
                    setTimeout(() => setShowSuggestions(false), 200);
                }}
                containerStyle={{ marginBottom: 8 }}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
                <View className="absolute top-[85px] left-0 right-0 bg-surface rounded-sm border-[1px] border-card-border shadow-md z-[1000] elevation-10">
                    {filteredSuggestions.map((item, index) => (
                        <TouchableOpacity
                            key={item}
                            className={`py-[14px] px-4 border-b-[1px] border-divider ${index === filteredSuggestions.length - 1 ? 'border-b-0' : ''}`}
                            onPress={() => {
                                onChangeText(item);
                                setShowSuggestions(false);
                            }}
                        >
                            <Text className="text-body text-ink text-[14px]">
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

