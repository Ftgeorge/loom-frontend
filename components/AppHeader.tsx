import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
    title?: string;
    showLocation?: boolean;
    showNotification?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    onNotification?: () => void;
    rightAction?: React.ReactNode;
}

export function AppHeader({
    title,
    showLocation,
    showNotification = true,
    showBack,
    onBack,
    onNotification,
    rightAction,
}: AppHeaderProps) {
    const insets = useSafeAreaInsets();
    const { selectedCity, notifications } = useAppStore();
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <View
            className="flex-row items-center justify-between px-5 pb-4 bg-operis-bg border-b border-operis-border"
            style={{ paddingTop: insets.top + 8 }}
        >
            <View className="flex-row items-center gap-3 flex-1">
                {showBack && (
                    <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.deepOlive} />
                    </TouchableOpacity>
                )}
                {showLocation && (
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="location" size={18} color={Colors.accent} />
                        <Text className="text-lg font-semibold text-olive m-0">{selectedCity}</Text>
                        <Ionicons name="chevron-down" size={16} color="#71717A" />
                    </View>
                )}
                {title && !showLocation && (
                    <Text className="text-xl font-bold text-olive m-0">{title}</Text>
                )}
            </View>

            <View className="flex-row items-center gap-5">
                {rightAction}
                {showNotification && (
                    <TouchableOpacity
                        onPress={onNotification}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityLabel="Notifications"
                    >
                        <Ionicons name="notifications-outline" size={24} color={Colors.deepOlive} />
                        {unread > 0 && (
                            <View className="absolute -top-1 -right-1.5 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                                <Text className="text-[10px] font-bold text-white">{unread > 9 ? '9+' : unread}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
