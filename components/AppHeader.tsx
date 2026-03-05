import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
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

    // Safety check for store
    const store = useAppStore();
    const selectedCity = store?.selectedCity || "Abuja";
    const notifications = store?.notifications || [];
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 24,
                paddingBottom: 16,
                backgroundColor: Colors.background,
                paddingTop: insets.top + 12,
                borderBottomWidth: 1,
                borderBottomColor: Colors.cardBorder + '50'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                {showBack && (
                    <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                )}
                {showLocation && (
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.white,
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: Radius.full,
                            gap: 6,
                            borderWidth: 1,
                            borderColor: Colors.cardBorder,
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="location" size={14} color={Colors.primary} />
                        <Text style={[Typography.bodySmall, { fontFamily: 'MontserratAlternates-SemiBold', color: Colors.text, fontSize: 13 }]}>{selectedCity}</Text>
                        <Ionicons name="chevron-down" size={12} color={Colors.muted} />
                    </TouchableOpacity>
                )}
                {title && !showLocation && (
                    <Text style={[Typography.h2, { flex: 1, fontSize: 18 }]} numberOfLines={1}>{title}</Text>
                )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {rightAction}
                {showNotification && (
                    <TouchableOpacity
                        onPress={onNotification}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: Radius.full,
                            backgroundColor: Colors.white,
                            borderWidth: 1,
                            borderColor: Colors.cardBorder,
                        }}
                    >
                        <Ionicons name="notifications-outline" size={20} color={Colors.text} />
                        {unread > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: Colors.accent, // High visibility notification dot
                                borderRadius: 6,
                                minWidth: 12,
                                height: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: Colors.white,
                            }}>
                                <Text style={{ fontSize: 0, opacity: 0 }}>{unread}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
