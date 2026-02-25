import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentedControlProps {
    segments: string[];
    selected: number;
    onSelect: (index: number) => void;
}

export function SegmentedControl({ segments, selected, onSelect }: SegmentedControlProps) {
    return (
        <View className="flex-row bg-surface rounded-xl p-1">
            {segments.map((seg, i) => {
                const isActive = i === selected;
                return (
                    <TouchableOpacity
                        key={seg}
                        className={`flex-1 py-2.5 items-center rounded-lg ${isActive ? 'bg-graphite' : ''}`}
                        style={isActive ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 } : {}}
                        onPress={() => onSelect(i)}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text className={`text-sm ${isActive ? 'text-white font-semibold' : 'font-medium text-muted'}`}>
                            {seg}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
