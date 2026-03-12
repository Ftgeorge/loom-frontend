import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Platform
} from 'react-native';
import { AppTextInput } from './TextInputs';
import { Colors, Radius, Typography, Shadows } from '@/theme';

interface LocationSuggestionInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    suggestions: string[];
    error?: string;
    containerStyle?: any;
}

export function LocationSuggestionInput({
    label,
    placeholder,
    value,
    onChangeText,
    suggestions,
    error,
    containerStyle
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
        <View style={[{ zIndex: showSuggestions && filteredSuggestions.length > 0 ? 100 : 1 }, containerStyle]}>
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
                <View style={styles.suggestionsContainer}>
                    {filteredSuggestions.map((item, index) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.suggestionItem,
                                index === filteredSuggestions.length - 1 && { borderBottomWidth: 0 }
                            ]}
                            onPress={() => {
                                onChangeText(item);
                                setShowSuggestions(false);
                            }}
                        >
                            <Text style={styles.suggestionText}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    suggestionsContainer: {
        position: 'absolute',
        top: 85, // Adjust based on input height + label
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: Radius.sm,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        ...Shadows.md,
        zIndex: 1000,
        elevation: 10,
    },
    suggestionItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    suggestionText: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.ink,
    }
});
