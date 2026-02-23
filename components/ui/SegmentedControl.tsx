import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentedControlProps {
    segments: string[];
    selected: number;
    onSelect: (index: number) => void;
}

export function SegmentedControl({ segments, selected, onSelect }: SegmentedControlProps) {
    return (
        <View className="flex-row bg-gray-100 rounded-xl p-[3px]">
            {segments.map((seg, i) => {
                const isActive = i === selected;
                return (
                    <TouchableOpacity
                        key={seg}
                        className={`flex-1 py-2.5 items-center rounded-lg ${isActive ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] elevation-2' : ''}`}
                        onPress={() => onSelect(i)}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text className={`text-sm ${isActive ? 'text-olive font-semibold' : 'font-medium text-gray-500'}`}>
                            {seg}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
