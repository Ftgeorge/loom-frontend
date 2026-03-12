import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { NIGERIAN_STATES } from '@/utils/locations';

interface SubAppHeaderProps {
    title?: string;
    description?: string;
    label?: string;
    onNotification?: () => void;
    showLocation?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    showNotification?: boolean;
    notifPlacement?: 'top' | 'content';
}

export function SubAppHeader({
    title,
    description,
    label,
    onNotification,
    showLocation,
    showBack,
    onBack,
    showNotification = true,
    notifPlacement = 'content'
}: SubAppHeaderProps) {
    const insets = useSafeAreaInsets();
    const { selectedState, setSelectedState, notifications, user } = useAppStore();
    const [showPicker, setShowPicker] = useState(false);
    const router = useRouter();

    const unread = (notifications || []).filter((n) => !n.read).length;

    const handleStateSelect = (state: string) => {
        if (state !== selectedState) {
            setSelectedState(state);
            setShowPicker(false);
            
            Alert.alert(
                'Update Location',
                `You've switched to ${state}. To see relevant professionals, please update your city and area in your profile.`,
                [
                    { text: 'Later', style: 'cancel' },
                    { 
                        text: 'Update Now', 
                        onPress: () => router.push('/profile-completion') 
                    }
                ]
            );
        } else {
            setShowPicker(false);
        }
    };

    return (
        <>
            <View
                style={{
                    paddingTop: insets.top + 12,
                    paddingHorizontal: 24,
                    paddingBottom: 24,
                }}
            >
                {/* Top Action Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {showBack && (
                            <TouchableOpacity
                                onPress={onBack}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                style={{ padding: 4 }}
                            >
                                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        )}
                        {showLocation ? (
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
                                    {selectedState}
                                </Text>
                                <Ionicons name="chevron-down" size={12} color={Colors.muted} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 1, height: 1 }} />
                        )}
                    </View>

                    {showNotification && notifPlacement === 'top' && (
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

                {/* Content Row */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: notifPlacement === 'content' ? 20 : 0 }}>
                        <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8, letterSpacing: 2 }]}>{label}</Text>
                        <Text style={[Typography.h1, { fontSize: 36, marginBottom: 8, lineHeight: 42 }]}>{title}</Text>
                        <Text style={[Typography.body, { color: Colors.muted }]}>{description}</Text>
                    </View>

                    {showNotification && notifPlacement === 'content' && (
                        <TouchableOpacity
                            onPress={onNotification}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            style={{
                                width: 48,
                                height: 48,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: Radius.md,
                                backgroundColor: Colors.surface,
                                borderWidth: 1,
                                borderColor: Colors.cardBorder,
                                position: 'relative',
                                marginTop: 18,
                                ...Shadows.xs,
                            }}
                        >
                            <Ionicons name="notifications" size={20} color={Colors.ink} />
                            {unread > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: Colors.violet,
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    borderWidth: 2,
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
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,18,12,0.8)', justifyContent: 'center', padding: 32 }}
                    activeOpacity={1}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={{
                        backgroundColor: Colors.white,
                        borderRadius: Radius.lg,
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
                                <Text style={[Typography.label, { fontSize: 10, color: Colors.primary, marginBottom: 4 }]}>Your Location</Text>
                                <Text style={[Typography.h3, { fontSize: 20 }]}>Switch State</Text>
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
                                        backgroundColor: selectedState === item ? Colors.surface : 'transparent'
                                    }}
                                    onPress={() => handleStateSelect(item)}
                                >
                                    <Text style={[Typography.label, {
                                        color: selectedState === item ? Colors.primary : Colors.muted,
                                        fontSize: 12,
                                        fontWeight: selectedState === item ? '800' : '500'
                                    }]}>
                                        {item.toUpperCase()}
                                    </Text>
                                    {selectedState === item && (
                                        <View style={{ backgroundColor: Colors.primary, padding: 4, borderRadius: 10 }}>
                                            <Ionicons name="checkmark" size={12} color={Colors.white} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
