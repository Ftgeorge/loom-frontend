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
    StyleSheet,
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
        accent: '#00120C', // Colors.primary
        bgAccent: 'bg-primary',
        textAccent: 'text-primary',
        borderAccent: 'border-primary/20',
        mission: 'DISCOVER'
    },
    {
        icon: 'terminal-outline' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
        accent: '#7DCCFF', // Colors.accent
        bgAccent: 'bg-accent',
        textAccent: 'text-accent',
        borderAccent: 'border-accent/20',
        mission: 'MATCH'
    },
    {
        icon: 'shield-checkmark-outline' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
        accent: '#1AB26C', // Colors.success
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
            <View style={StyleSheet.absoluteFill}>
                <LoomThread variant="dense" scale={1.5} opacity={0.4} animated />
            </View>

            <View className="absolute top-16 w-full px-8 z-10 flex-row justify-between items-center">
                <Text className="text-label text-primary text-[8px] uppercase">STEP {currentPage + 1}</Text>
                <TouchableOpacity onPress={handleSkip} className="bg-gray-100 px-3 py-[6px] rounded-xs">
                    <Text className="text-label text-muted text-[8px] uppercase">SKIP</Text>
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
                        <View className="items-center mb-14">
                            <Animated.View
                                entering={FadeInDown.delay(200).springify()}
                                className="w-[240px] h-[240px] rounded-md bg-white items-center justify-center shadow-lg border-[1.5px] border-card-border"
                            >
                                <View className={`absolute w-[180px] h-[180px] rounded-xs border rotate-45 ${item.borderAccent}`} />
                                <Ionicons name={item.icon} size={80} color={item.accent} />

                                <View className={`absolute -bottom-3 px-3 py-1 rounded-xs ${item.bgAccent}`}>
                                    <Text className="text-label text-white text-[8px] uppercase">{item.mission}</Text>
                                </View>
                            </Animated.View>
                        </View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            className="text-h1 text-center text-[28px] mb-4"
                        >
                            {t(item.titleKey, language)}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
                            className="text-body text-center text-muted leading-6"
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

            <View className="px-8 pb-16">
                <View className="flex-row justify-center gap-[6px] mb-10">
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            className={`h-[3px] rounded-full ${
                                i === currentPage ? 'bg-primary w-8' : 'bg-gray-200 w-3'
                            }`}
                        />
                    ))}
                </View>

                <PrimaryButton
                    title={currentPage === pages.length - 1 ? "Get Started" : "Next"}
                    onPress={handleNext}
                    className="h-16 rounded-md"
                    variant={currentPage === pages.length - 1 ? 'accent' : 'primary'}
                />
            </View>
        </View >
    );
}


