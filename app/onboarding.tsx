import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
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
        icon: 'scan-outline' as const,
        titleKey: 'onboard1Title' as const,
        descKey: 'onboard1Desc' as const,
        accent: '#00120C',
        bgAccent: 'bg-primary',
        textAccent: 'text-primary',
        borderAccent: 'border-primary/20',
        mission: 'DISCOVER'
    },
    {
        icon: 'terminal-outline' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
        accent: '#7DCCFF',
        bgAccent: 'bg-accent',
        textAccent: 'text-accent',
        borderAccent: 'border-accent/20',
        mission: 'MATCH'
    },
    {
        icon: 'shield-checkmark-outline' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
        accent: '#1AB26C',
        bgAccent: 'bg-success',
        textAccent: 'text-success',
        borderAccent: 'border-success/20',
        mission: 'TRUST'
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
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="dense" scale={1.5} opacity={0.4} animated />
            </View>

            <View className="absolute top-16 w-full px-8 z-10 flex-row justify-between items-center">
                <Text className="text-label text-primary text-[8px] uppercase tracking-widest font-jakarta-extrabold italic">MISSION STEP {currentPage + 1}</Text>
                <TouchableOpacity onPress={handleSkip} className="bg-gray-100/80 px-4 py-2 rounded-xs border border-card-border shadow-xs">
                    <Text className="text-label text-muted text-[8px] uppercase font-jakarta-bold tracking-tight">SKIP PROTOCOL</Text>
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
                renderItem={({ item }) => (
                    <View className="flex-1 px-10" style={{ paddingTop: height * 0.12, width }}>
                        <View className="items-center mb-16">
                            <Animated.View
                                entering={FadeInDown.delay(200).springify()}
                                className="w-[260px] h-[260px] rounded-2xl bg-white items-center justify-center shadow-2xl border-[1.5px] border-card-border"
                            >
                                <View className={`absolute w-[190px] h-[190px] rounded-lg border rotate-45 ${item.borderAccent}`} />
                                <Ionicons name={item.icon} size={88} color={item.accent} />

                                <View className={`absolute -bottom-4 px-5 py-2 rounded-lg shadow-md ${item.bgAccent}`}>
                                    <Text className="text-label text-white text-[9px] uppercase tracking-widest font-jakarta-extrabold">{item.mission}</Text>
                                </View>
                            </Animated.View>
                        </View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            className="text-h1 text-center text-[32px] mb-6 uppercase italic font-jakarta-extrabold tracking-tight"
                        >
                            {t(item.titleKey, language)}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
                            className="text-body text-center text-muted leading-7 normal-case font-jakarta-medium px-4"
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

            <View className="px-8 pb-16">
                <View className="flex-row justify-center gap-2 mb-12">
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            className={`h-1 rounded-full shadow-sm ${
                                i === currentPage ? 'bg-primary w-10' : 'bg-gray-200 w-3'
                            }`}
                        />
                    ))}
                </View>

                <PrimaryButton
                    title={currentPage === pages.length - 1 ? "INITIALIZE" : "NEXT PHASE"}
                    onPress={handleNext}
                    className="h-16 rounded-xl shadow-xl"
                    variant={currentPage === pages.length - 1 ? 'accent' : 'primary'}
                />
                
                <Text className="mt-8 text-center text-[8px] text-muted uppercase tracking-widest opacity-40 font-jakarta-bold">
                    System Version 2.0.4 • Loom Marketplace
                </Text>
            </View>
        </View>
    );
}



