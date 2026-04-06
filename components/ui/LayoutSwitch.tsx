import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity } from "react-native";

type ViewLayoutMode = 'grid' | 'list';

interface LayoutSwitchProps {
    viewLayout: ViewLayoutMode;
    setViewLayout: (layout: ViewLayoutMode) => void;
    className?: string;
}

export default function LayoutSwitch({ viewLayout, setViewLayout, className = '' }: LayoutSwitchProps) {

    return (
        <View className={`flex-row bg-gray-100 rounded-sm p-[3px] border-[1px] border-divider ${className}`}>
            <TouchableOpacity
                onPress={() => setViewLayout('grid')}
                className={`px-[10px] py-[6px] rounded-[8px] ${viewLayout === 'grid' ? 'bg-surface shadow-xs' : 'bg-transparent'}`}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="grid-outline"
                    size={18}
                    className={viewLayout === 'grid' ? 'text-primary' : 'text-muted'}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setViewLayout('list')}
                className={`px-[10px] py-[6px] rounded-[8px] ${viewLayout === 'list' ? 'bg-surface shadow-xs' : 'bg-transparent'}`}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="list-outline"
                    size={18}
                    className={viewLayout === 'list' ? 'text-primary' : 'text-muted'}
                />
            </TouchableOpacity>
        </View>
    )
}