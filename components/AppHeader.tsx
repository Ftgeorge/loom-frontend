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
            className="flex-row items-center justify-between px-5 pb-4 bg-background"
            style={{ paddingTop: insets.top + 8 }}
        >
            <View className="flex-row items-center gap-3 flex-1">
                {showBack && (
                    <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.graphite} />
                    </TouchableOpacity>
                )}
                {showLocation && (
                    <TouchableOpacity
                        className="flex-row items-center bg-surface px-4 py-2 rounded-full gap-1.5"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="location" size={16} color={Colors.graphite} />
                        <Text className="text-sm font-semibold text-graphite m-0 tracking-tight">{selectedCity}</Text>
                        <Ionicons name="chevron-down" size={14} color={Colors.muted} />
                    </TouchableOpacity>
                )}
                {title && !showLocation && (
                    <Text className="text-xl font-bold text-graphite tracking-tight m-0">{title}</Text>
                )}
            </View>

            <View className="flex-row items-center gap-5">
                {rightAction}
                {showNotification && (
                    <TouchableOpacity
                        onPress={onNotification}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityLabel="Notifications"
                        className="w-10 h-10 items-center justify-center rounded-full bg-surface"
                    >
                        <Ionicons name="notifications-outline" size={20} color={Colors.graphite} />
                        {unread > 0 && (
                            <View className="absolute top-1.5 right-1.5 bg-red-500 rounded-full min-w-[16px] h-[16px] items-center justify-center px-1 border-2 border-surface">
                                <Text className="text-[9px] font-bold text-white">{unread > 9 ? '9+' : unread}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
