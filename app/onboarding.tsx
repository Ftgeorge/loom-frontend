import { PrimaryButton } from '@/components/ui/Buttons';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors, Typography } from '@/theme';
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
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const pages = [
    {
        icon: 'search-sharp' as const,
        titleKey: 'onboard1Title' as const,
        descKey: 'onboard1Desc' as const,
        accent: Colors.primary,
    },
    {
        icon: 'chatbubbles-sharp' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
        accent: Colors.accent,
    },
    {
        icon: 'shield-checkmark-sharp' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
        accent: Colors.success,
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
            router.replace('/language-selection');
        }
    };

    const handleSkip = () => {
        setOnboardingComplete();
        router.replace('/language-selection');
    };

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const page = Math.round(e.nativeEvent.contentOffset.x / width);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            {/* Header / Skip */}
            <View style={{ position: 'absolute', top: 60, width: '100%', paddingHorizontal: 24, zIndex: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={[Typography.bodySmall, { color: Colors.muted }]}>{t('skip', language)}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={listRef}
                data={pages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                keyExtractor={(_, i) => `${i}`}
                renderItem={({ item, index }) => (
                    <View style={{ width, flex: 1, paddingTop: height * 0.15, paddingHorizontal: 32 }}>
                        {/* Visual Group */}
                        <View style={{ alignItems: 'center', marginBottom: 64 }}>
                            <Animated.View
                                entering={FadeInDown.delay(200).springify().damping(12)}
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100,
                                    backgroundColor: item.accent + '10',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {/* Background organic shape */}
                                <View style={{
                                    position: 'absolute',
                                    width: 160,
                                    height: 160,
                                    borderRadius: 80,
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    borderColor: item.accent + '30'
                                }} />
                                <Ionicons name={item.icon} size={80} color={item.accent} />
                            </Animated.View>
                        </View>

                        {/* Content Group */}
                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            style={[Typography.h1, { textAlign: 'center', marginBottom: 16 }]}
                        >
                            {t(item.titleKey, language)}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
                            style={[Typography.body, { textAlign: 'center', lineHeight: 26, paddingHorizontal: 12 }]}
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

            {/* Footer */}
            <View style={{ paddingHorizontal: 32, paddingBottom: 64 }}>
                {/* Pagination Dots */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: i === currentPage ? Colors.primary : Colors.cardBorder,
                                width: i === currentPage ? 24 : 6,
                            }}
                        />
                    ))}
                </View>

                {/* Main Action */}
                <PrimaryButton
                    title={currentPage === pages.length - 1 ? t('getStarted', language) : t('next', language)}
                    onPress={handleNext}
                    style={{ width: '100%' }}
                />
            </View>
        </View>
    );
}

