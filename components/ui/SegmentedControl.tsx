import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentedControlProps {
    segments: string[];
    selected: number;
    onSelect: (index: number) => void;
    className?: string;
}

export function SegmentedControl({ segments, selected, onSelect, className = '' }: SegmentedControlProps) {
    return (
        <View className={`flex-row bg-gray-100 rounded-md p-1 ${className}`}>
            {segments.map((seg, i) => {
                const isActive = i === selected;
                return (
                    <TouchableOpacity
                        key={seg}
                        className={`flex-1 py-2.5 items-center rounded-[8px] ${isActive ? 'bg-surface shadow-xs' : 'bg-transparent'}`}
                        onPress={() => onSelect(i)}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text className={`text-[14px] ${isActive ? 'text-primary font-inter-semibold' : 'font-inter-medium text-muted'}`}>
                            {seg}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

