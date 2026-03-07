import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const pages = [
    {
        icon: 'scan-outline' as const,
        titleKey: 'onboard1Title' as const,
        descKey: 'onboard1Desc' as const,
        accent: Colors.primary,
        mission: 'FIND PROS'
    },
    {
        icon: 'terminal-outline' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
        accent: Colors.accent,
        mission: 'CONNECT'
    },
    {
        icon: 'shield-checkmark-outline' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
        accent: Colors.success,
        mission: 'TRUSTED'
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
            <LoomThread variant="minimal" opacity={0.2} animated />

            <View style={{ position: 'absolute', top: 64, width: '100%', paddingHorizontal: 32, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[Typography.label, { color: Colors.primary, fontSize: 8 }]}>HOW IT WORKS</Text>
                <TouchableOpacity onPress={handleSkip} style={{ backgroundColor: Colors.gray100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.xs }}>
                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 8 }]}>SKIP</Text>
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
                    <View style={{ width, flex: 1, paddingTop: height * 0.12, paddingHorizontal: 40 }}>
                        <View style={{ alignItems: 'center', marginBottom: 56 }}>
                            <Animated.View
                                entering={FadeInDown.delay(200).springify()}
                                style={{
                                    width: 240,
                                    height: 240,
                                    borderRadius: Radius.md,
                                    backgroundColor: Colors.white,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    ...Shadows.lg,
                                    borderWidth: 1.5,
                                    borderColor: Colors.cardBorder
                                }}
                            >
                                <View style={{
                                    position: 'absolute',
                                    width: 180,
                                    height: 180,
                                    borderRadius: Radius.xs,
                                    borderWidth: 1,
                                    borderColor: item.accent + '20',
                                    transform: [{ rotate: '45deg' }]
                                }} />
                                <Ionicons name={item.icon} size={80} color={item.accent} />

                                <View style={{ position: 'absolute', bottom: -12, backgroundColor: item.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.xs }}>
                                    <Text style={[Typography.label, { color: Colors.white, fontSize: 8 }]}>{item.mission}</Text>
                                </View>
                            </Animated.View>
                        </View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            style={[Typography.h1, { textAlign: 'center', fontSize: 28, marginBottom: 16 }]}
                        >
                            {t(item.titleKey, language)}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
                            style={[Typography.body, { textAlign: 'center', color: Colors.muted, lineHeight: 24 }]}
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

            <View style={{ paddingHorizontal: 32, paddingBottom: 64 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 40 }}>
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                height: 3,
                                borderRadius: 1.5,
                                backgroundColor: i === currentPage ? Colors.primary : Colors.gray200,
                                width: i === currentPage ? 32 : 12,
                            }}
                        />
                    ))}
                </View>

                <PrimaryButton
                    title={currentPage === pages.length - 1 ? "GET STARTED" : "NEXT"}
                    onPress={handleNext}
                    style={{ height: 64, borderRadius: Radius.md }}
                    variant={currentPage === pages.length - 1 ? 'accent' : 'primary'}
                />
            </View>
        </View >
    );
}

