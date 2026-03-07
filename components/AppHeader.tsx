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
                    backgroundColor: Colors.background,
                    paddingTop: insets.top + 12,
                    borderBottomWidth: 1.5,
                    borderBottomColor: Colors.cardBorder + '80'
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
                                backgroundColor: Colors.white,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: Radius.xs,
                                gap: 8,
                                borderWidth: 1.5,
                                borderColor: Colors.cardBorder,
                                ...Shadows.sm
                            }}
                            activeOpacity={0.8}
                            onPress={() => setShowPicker(true)}
                        >
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent }} />
                            <Text style={[Typography.label, { color: Colors.primary, fontSize: 10, fontWeight: '700' }]}>
                                {selectedCity.toUpperCase()}
                            </Text>
                            <Ionicons name="chevron-down" size={12} color={Colors.primary} />
                        </TouchableOpacity>
                    )}
                    {title && !showLocation && (
                        <Text style={[Typography.label, { flex: 1, fontSize: 13, color: Colors.primary, letterSpacing: 1 }]} numberOfLines={1}>
                            {title.toUpperCase()}
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
                                borderRadius: Radius.xs,
                                backgroundColor: Colors.white,
                                borderWidth: 1.5,
                                borderColor: Colors.cardBorder,
                                position: 'relative'
                            }}
                        >
                            <Ionicons name="notifications" size={18} color={Colors.primary} />
                            {unread > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    backgroundColor: Colors.accent,
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    borderWidth: 2,
                                    borderColor: Colors.white,
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
                                <Text style={[Typography.label, { fontSize: 10, color: Colors.primary, marginBottom: 4 }]}>LOCATION BEACON</Text>
                                <Text style={[Typography.h3, { fontSize: 20 }]}>Select Sector</Text>
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
