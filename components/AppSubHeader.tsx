import { useAppStore } from '@/store';
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
    className?: string;
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
    notifPlacement = 'content',
    className = ''
}: SubAppHeaderProps) {
    const insets = useSafeAreaInsets();
    const { selectedState, setSelectedState, notifications } = useAppStore();
    const [showPicker, setShowPicker] = useState(false);
    const router = useRouter();

    const unread = (notifications || []).filter((n) => !n.read).length;

    const handleStateSelect = (state: string) => {
        if (state !== selectedState) {
            setSelectedState(state);
            setShowPicker(false);
            
            Alert.alert(
                'Update Location',
                `You've switched to ${state}. To see relevant artisans, please update your city and area in your profile.`,
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
        <View className={className}>
            <View
                style={{ paddingTop: insets.top + 12 }}
                className="px-6 pb-6"
            >
                {/* Top Action Row */}
                <View className="flex-row items-center justify-between mb-5">
                    <View className="flex-row items-center gap-3">
                        {showBack && (
                            <TouchableOpacity
                                onPress={onBack}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                className="p-1"
                            >
                                <Ionicons name="arrow-back" size={24} className="text-primary" />
                            </TouchableOpacity>
                        )}
                        {showLocation ? (
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
                        ) : (
                            <View className="w-[1px] h-[1px]" />
                        )}
                    </View>

                    {showNotification && notifPlacement === 'top' && (
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

                {/* Content Row */}
                <View className="flex-row items-start justify-between">
                    <View className={`flex-1 ${notifPlacement === 'content' ? 'mr-5' : 'mr-0'}`}>
                        <Text className="text-label text-primary mb-2 tracking-[2px]">{label}</Text>
                        <Text className="text-h1 text-[36px] mb-2 leading-[42px]">{title}</Text>
                        <Text className="text-body text-muted">{description}</Text>
                    </View>

                    {showNotification && notifPlacement === 'content' && (
                        <TouchableOpacity
                            onPress={onNotification}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            className="w-12 h-12 items-center justify-center rounded-sm bg-surface border-[1px] border-card-border relative mt-[18px] shadow-xs"
                        >
                            <Ionicons name="notifications" size={20} className="text-ink" />
                            {unread > 0 && (
                                <View className="absolute top-2 right-2 bg-violet w-[10px] h-[10px] rounded-full border-[2px] border-surface" />
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
                    className="flex-1 bg-black/80 justify-center p-8"
                    activeOpacity={1}
                    onPress={() => setShowPicker(false)}
                >
                    <View className="bg-white rounded-lg max-h-[70%] overflow-hidden border-[2px] border-primary shadow-lg">
                        <View className="p-6 border-b-[1.5px] border-card-border flex-row items-center justify-between bg-surface">
                            <View>
                                <Text className="text-label text-[10px] text-primary mb-1">Your Location</Text>
                                <Text className="text-h3 text-[20px]">Switch State</Text>
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
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

