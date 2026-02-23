import { PrimaryButton } from '@/components/ui/Buttons';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const pages = [
    {
        icon: 'search-outline' as const,
        titleKey: 'onboard1Title' as const,
        descKey: 'onboard1Desc' as const,
        color: Colors.softSage,
    },
    {
        icon: 'chatbubble-ellipses-outline' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
        color: Colors.accent,
    },
    {
        icon: 'shield-checkmark-outline' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
        color: Colors.softSageDark,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const listRef = useRef<FlatList>(null);
    const { setOnboardingComplete, language } = useAppStore();

    const handleNext = () => {
        if (currentPage < pages.length - 1) {
            listRef.current?.scrollToOffset({ offset: (currentPage + 1) * width, animated: true });
            setCurrentPage(currentPage + 1);
        } else {
            setOnboardingComplete();
            router.replace('/role-selection');
        }
    };

    const handleSkip = () => {
        setOnboardingComplete();
        router.replace('/role-selection');
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const page = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentPage(page);
    };

    return (
        <View className="flex-1 bg-operis-bg">
            <TouchableOpacity className="absolute top-[60px] right-6 z-10 p-2" onPress={handleSkip}>
                <Text className="text-base text-gray-500 font-medium">{t('skip', language)}</Text>
            </TouchableOpacity>

            <FlatList
                ref={listRef}
                data={pages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, i) => `${i}`}
                renderItem={({ item }) => (
                    <View className="flex-1 items-center justify-center px-10" style={{ width }}>
                        <View
                            className="w-[140px] h-[140px] rounded-[70px] items-center justify-center mb-10"
                            style={{ backgroundColor: item.color + '25' }}
                        >
                            <Ionicons name={item.icon} size={64} color={item.color} />
                        </View>
                        <Text className="text-[28px] font-bold text-center mb-6 text-black">{t(item.titleKey, language)}</Text>
                        <Text className="text-base text-gray-500 text-center leading-6">{t(item.descKey, language)}</Text>
                    </View>
                )}
            />

            <View className="px-8 pb-12 items-center gap-8">
                <View className="flex-row gap-2">
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            className={`h-2 rounded-full ${i === currentPage ? 'w-6 bg-olive' : 'w-2 bg-gray-300'}`}
                        />
                    ))}
                </View>
                <PrimaryButton
                    title={currentPage === pages.length - 1 ? t('getStarted', language) : t('next', language)}
                    onPress={handleNext}
                    className="w-full"
                />
            </View>
        </View>
    );
}
