import { useAppStore } from '@/store';
import { Colors, Radius, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
];

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
    const { selectedCity, setSelectedCity, notifications } = useAppStore();
    const [showPicker, setShowPicker] = useState(false);

    const unread = (notifications || []).filter((n) => !n.read).length;

    return (
        <>
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
                            onPress={() => setShowPicker(true)}
                        >
                            <Ionicons name="location" size={14} color={Colors.primary} />
                            <Text style={[Typography.bodySmall, { fontFamily: 'MontserratAlternates-SemiBold', color: Colors.text, fontSize: 13 }]}>
                                {selectedCity}
                            </Text>
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
                                    backgroundColor: Colors.accent,
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

            <Modal
                visible={showPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPicker(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={{ backgroundColor: Colors.white, borderRadius: Radius.lg, maxHeight: '70%', overflow: 'hidden' }}>
                        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={Typography.h3}>Select Location</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Ionicons name="close" size={24} color={Colors.muted} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={NIGERIAN_STATES}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        padding: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: selectedCity === item ? Colors.primaryLight : 'transparent'
                                    }}
                                    onPress={() => {
                                        setSelectedCity(item);
                                        setShowPicker(false);
                                    }}
                                >
                                    <Text style={[Typography.body, { color: selectedCity === item ? Colors.primary : Colors.text }]}>{item}</Text>
                                    {selectedCity === item && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
