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
                <LoomThread variant="dense" scale={1.2} opacity={0.3} animated />
            </View>

            {/* ─── Tactical Header Control ────────────────────────────────────────── */}
            <View className="absolute top-16 w-full px-8 z-10 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                    <Text className="text-label text-primary text-[10px] uppercase tracking-[2px] font-jakarta-extrabold italic">MISSION STEP {currentPage + 1}</Text>
                </View>
                <TouchableOpacity 
                    onPress={handleSkip} 
                    className="bg-white/90 px-5 py-2.5 rounded-xl border border-card-border shadow-sm active:bg-gray-100"
                >
                    <Text className="text-label text-ink text-[9px] uppercase font-jakarta-extrabold tracking-tight italic">SKIP PROTOCOL</Text>
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
                    <View className="flex-1 px-10" style={{ paddingTop: height * 0.14, width }}>
                        <View className="items-center mb-16">
                            <Animated.View
                                entering={FadeInDown.delay(200).springify()}
                                className="w-[280px] h-[280px] rounded-[48px] bg-white items-center justify-center shadow-2xl border-[1.5px] border-card-border overflow-hidden"
                            >
                                {/* Decorative Identity Shroud */}
                                <View className={`absolute w-[200px] h-[200px] rounded-[32px] border-2 rotate-[35deg] ${item.borderAccent}`} />
                                <View className={`absolute w-[180px] h-[180px] rounded-[24px] border border-dashed rotate-[-15deg] opacity-40 ${item.borderAccent}`} />
                                
                                <Ionicons name={item.icon} size={94} color={item.accent} />

                                <View className={`absolute -bottom-6 px-7 py-3 rounded-2xl shadow-xl border border-white/20 ${item.bgAccent}`}>
                                    <Text className="text-label text-white text-[10px] uppercase tracking-[3px] font-jakarta-extrabold italic">{item.mission}</Text>
                                </View>
                            </Animated.View>
                        </View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            className="text-h1 text-center text-[38px] leading-[42px] mb-8 uppercase italic font-jakarta-extrabold tracking-tighter text-ink"
                        >
                            {t(item.titleKey, language).toUpperCase()}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
                            className="text-body text-center text-ink/60 leading-7 normal-case font-jakarta-medium px-2 italic"
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

            <View className="px-10 pb-16">
                <View className="flex-row justify-center gap-3 mb-14">
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            className={`h-[5px] rounded-full shadow-sm ${
                                i === currentPage ? 'bg-primary w-12' : 'bg-card-border w-4'
                            }`}
                        />
                    ))}
                </View>

                <PrimaryButton
                    title={currentPage === pages.length - 1 ? "INITIALIZE" : "NEXT PHASE"}
                    onPress={handleNext}
                    className="h-18 rounded-2xl shadow-2xl border border-white/10"
                    variant={currentPage === pages.length - 1 ? 'accent' : 'primary'}
                />
                
                <Text className="mt-10 text-center text-[8px] text-ink/30 uppercase tracking-[6px] font-jakarta-extrabold italic">
                    SYSTEM OPERATIONAL • TERMINAL v4.2.0
                </Text>
            </View>
        </View>
    );
}




