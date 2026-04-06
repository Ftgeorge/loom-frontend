import { useAppStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { NIGERIAN_STATES } from '@/utils/locations';

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
    const router = useRouter();
    const { selectedState, setSelectedState, notifications } = useAppStore();
    const [showPicker, setShowPicker] = useState(false);

    const unread = (notifications || []).filter((n) => !n.read).length;

    const handleStateSelect = (state: string) => {
        if (state !== selectedState) {
            setSelectedState(state);
            setShowPicker(false);
            
            Alert.alert(
                'Update Location',
                `You've switched to ${state}. Please update your city and area to see the best artisans matching your new location.`,
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
                style={{ paddingTop: insets.top + 12 }}
                className="flex-row items-center justify-between px-6 pb-4 bg-canvas border-b-[1px] border-divider"
            >
                <View className="flex-row items-center gap-3 flex-1">
                    {showBack && (
                        <TouchableOpacity
                            onPress={onBack}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            className="p-1"
                        >
                            <Ionicons name="arrow-back" size={24} className="text-primary" />
                        </TouchableOpacity>
                    )}
                    {showLocation && (
                        <TouchableOpacity
                            className="flex-row items-center bg-surface px-3 py-2 rounded-full gap-[6px] border-[1px] border-card-border shadow-xs"
                            activeOpacity={0.8}
                            onPress={() => setShowPicker(true)}
                        >
                            <Ionicons name="location" size={12} className="text-primary" />
                            <Text className="text-[12px] font-inter-semibold text-ink">
                                {selectedState}
                            </Text>
                            <Ionicons name="chevron-down" size={12} className="text-muted" />
                        </TouchableOpacity>
                    )}
                    {title && !showLocation && (
                        <Text className="text-[16px] font-jakarta-semibold text-ink flex-1" numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                </View>

                <View className="flex-row items-center gap-3">
                    {rightAction}
                    {showNotification && (
                        <TouchableOpacity
                            onPress={onNotification}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            className="w-10 h-10 items-center justify-center rounded-sm bg-surface border-[1px] border-card-border relative shadow-xs"
                        >
                            <Ionicons name="notifications" size={18} className="text-ink" />
                            {unread > 0 && (
                                <View className="absolute top-[6px] right-[6px] bg-violet w-2 h-2 rounded-full border-[1.5px] border-surface" />
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
                    className="flex-1 bg-black/80 justify-center p-8"
                    onPress={() => setShowPicker(false)}
                >
                    <View className="bg-white rounded-lg max-h-[70%] overflow-hidden border-[2px] border-primary shadow-lg">
                        <View className="p-6 border-b-[1.5px] border-card-border flex-row items-center justify-between bg-surface">
                            <View>
                                <Text className="text-label text-[10px] text-primary mb-1">Your City</Text>
                                <Text className="text-h3 text-[20px]">Where are you?</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowPicker(false)} className="p-2">
                                <Ionicons name="close" size={24} className="text-primary" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={NIGERIAN_STATES}
                            keyExtractor={(item) => item}
                            contentContainerStyle={{ paddingVertical: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`p-[18px] flex-row items-center justify-between ${selectedState === item ? 'bg-surface' : 'bg-transparent'}`}
                                    onPress={() => handleStateSelect(item)}
                                >
                                    <Text className={`text-label text-[12px] normal-case tracking-normal ${selectedState === item ? 'text-primary font-jakarta-bold' : 'text-muted font-jakarta-medium'}`}>
                                        {item.toUpperCase()}
                                    </Text>
                                    {selectedState === item && (
                                        <View className="bg-primary p-1 rounded-sm">
                                            <Ionicons name="checkmark" size={12} color="white" />
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

