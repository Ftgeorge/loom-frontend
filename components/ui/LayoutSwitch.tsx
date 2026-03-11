import { Colors, Shadows } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity } from "react-native";

type ViewLayoutMode = 'grid' | 'list';

interface LayoutSwitchProps {
    viewLayout: ViewLayoutMode;
    setViewLayout: (layout: ViewLayoutMode) => void;
}

export default function LayoutSwitch({ viewLayout, setViewLayout }: LayoutSwitchProps) {

    return (
        <>
            <View style={{
                flexDirection: 'row',
                backgroundColor: Colors.gray100,
                borderRadius: 10,
                padding: 3,
                borderWidth: 1,
                borderColor: Colors.divider,
            }}>
                <TouchableOpacity
                    onPress={() => setViewLayout('grid')}
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        backgroundColor: viewLayout === 'grid' ? Colors.surface : 'transparent',
                        borderRadius: 8,
                        ... (viewLayout === 'grid' ? Shadows.xs : {}),
                    }}
                >
                    <Ionicons
                        name="grid-outline"
                        size={18}
                        color={viewLayout === 'grid' ? Colors.primary : Colors.muted}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setViewLayout('list')}
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        backgroundColor: viewLayout === 'list' ? Colors.surface : 'transparent',
                        borderRadius: 8,
                        ... (viewLayout === 'list' ? Shadows.xs : {}),
                    }}
                >
                    <Ionicons
                        name="list-outline"
                        size={18}
                        color={viewLayout === 'list' ? Colors.primary : Colors.muted}
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}