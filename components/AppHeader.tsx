import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
                    backgroundColor: Colors.canvas,
                    paddingTop: insets.top + 12,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.divider,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={onBack}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            style={{ padding: 4 }}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )}
                    {showLocation && (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.surface,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: Radius.full,
                                gap: 6,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                ...Shadows.xs
                            }}
                            activeOpacity={0.8}
                            onPress={() => setShowPicker(true)}
                        >
                            <Ionicons name="location" size={12} color={Colors.primary} />
                            <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.ink }}>
                                {selectedCity}
                            </Text>
                            <Ionicons name="chevron-down" size={12} color={Colors.muted} />
                        </TouchableOpacity>
                    )}
                    {title && !showLocation && (
                        <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans-SemiBold', color: Colors.ink, flex: 1 }} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {rightAction}
                    {showNotification && (
                        <TouchableOpacity
                            onPress={onNotification}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: Radius.md,
                                backgroundColor: Colors.surface,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                position: 'relative',
                                ...Shadows.xs,
                            }}
                        >
                            <Ionicons name="notifications" size={18} color={Colors.ink} />
                            {unread > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: 6,
                                    right: 6,
                                    backgroundColor: Colors.violet,
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    borderWidth: 1.5,
                                    borderColor: Colors.surface,
                                }} />
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
                    style={{ flex: 1, backgroundColor: 'rgba(0,18,12,0.8)', justifyContent: 'center', padding: 32 }}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={{
                        backgroundColor: Colors.white,
                        borderRadius: Radius.md,
                        maxHeight: '70%',
                        overflow: 'hidden',
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        ...Shadows.lg
                    }}>
                        <View style={{
                            padding: 24,
                            borderBottomWidth: 1.5,
                            borderBottomColor: Colors.cardBorder,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: Colors.surface
                        }}>
                            <View>
                                <Text style={[Typography.label, { fontSize: 10, color: Colors.violet, marginBottom: 4 }]}>Your City</Text>
                                <Text style={[Typography.h3, { fontSize: 20 }]}>Where are you?</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowPicker(false)} style={{ padding: 8 }}>
                                <Ionicons name="close" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={NIGERIAN_STATES}
                            keyExtractor={(item) => item}
                            contentContainerStyle={{ paddingVertical: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        padding: 18,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: selectedCity === item ? Colors.surface : 'transparent'
                                    }}
                                    onPress={() => {
                                        setSelectedCity(item);
                                        setShowPicker(false);
                                    }}
                                >
                                    <Text style={[Typography.label, {
                                        color: selectedCity === item ? Colors.primary : Colors.muted,
                                        fontSize: 12,
                                        fontWeight: selectedCity === item ? '800' : '500'
                                    }]}>
                                        {item.toUpperCase()}
                                    </Text>
                                    {selectedCity === item && (
                                        <View style={{ backgroundColor: Colors.primary, padding: 4, borderRadius: 10 }}>
                                            <Ionicons name="checkmark" size={12} color={Colors.white} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
