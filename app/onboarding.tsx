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
<<<<<<< HEAD
        accent: '#00120C',
        bgAccent: 'bg-primary',
        textAccent: 'text-primary',
        borderAccent: 'border-primary/20',
=======
        accent: Colors.primary,
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
        mission: 'DISCOVER'
    },
    {
        icon: 'terminal-outline' as const,
        titleKey: 'onboard2Title' as const,
        descKey: 'onboard2Desc' as const,
<<<<<<< HEAD
        accent: '#7DCCFF',
        bgAccent: 'bg-accent',
        textAccent: 'text-accent',
        borderAccent: 'border-accent/20',
=======
        accent: Colors.accent,
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
        mission: 'MATCH'
    },
    {
        icon: 'shield-checkmark-outline' as const,
        titleKey: 'onboard3Title' as const,
        descKey: 'onboard3Desc' as const,
<<<<<<< HEAD
        accent: '#1AB26C',
        bgAccent: 'bg-success',
        textAccent: 'text-success',
        borderAccent: 'border-success/20',
=======
        accent: Colors.success,
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
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
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={StyleSheet.absoluteFill}>
                <LoomThread variant="dense" scale={1.5} opacity={0.4} animated />
            </View>

            <View style={{ position: 'absolute', top: 64, width: '100%', paddingHorizontal: 32, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[Typography.label, { color: Colors.primary, fontSize: 8 }]}>STEP {currentPage + 1}</Text>
                <TouchableOpacity onPress={handleSkip} style={{ backgroundColor: Colors.gray100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.xs }}>
                    <Text style={[Typography.label, { color: Colors.muted, fontSize: 8 }]}>SKIP</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </View>
                            </Animated.View>
                        </View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
<<<<<<< HEAD
                            className="text-h1 text-center text-[38px] leading-[42px] mb-8 uppercase italic font-jakarta-extrabold tracking-tighter text-ink"
=======
                            style={[Typography.h1, { textAlign: 'center', fontSize: 28, marginBottom: 16 }]}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        >
                            {t(item.titleKey, language).toUpperCase()}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).springify()}
<<<<<<< HEAD
                            className="text-body text-center text-ink/60 leading-7 normal-case font-jakarta-medium px-2 italic"
=======
                            style={[Typography.body, { textAlign: 'center', color: Colors.muted, lineHeight: 24 }]}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        >
                            {t(item.descKey, language)}
                        </Animated.Text>
                    </View>
                )}
            />

<<<<<<< HEAD
            <View className="px-10 pb-16">
                <View className="flex-row justify-center gap-3 mb-14">
                    {pages.map((_, i) => (
                        <View
                            key={i}
                            className={`h-[5px] rounded-full shadow-sm ${
                                i === currentPage ? 'bg-primary w-12' : 'bg-card-border w-4'
                            }`}
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        />
                    ))}
                </View>

                <PrimaryButton
                    title={currentPage === pages.length - 1 ? "INITIALIZE" : "NEXT PHASE"}
                    onPress={handleNext}
<<<<<<< HEAD
                    className="h-18 rounded-2xl shadow-2xl border border-white/10"
=======
                    style={{ height: 64, borderRadius: Radius.md }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    variant={currentPage === pages.length - 1 ? 'accent' : 'primary'}
                />
                
                <Text className="mt-10 text-center text-[8px] text-ink/30 uppercase tracking-[6px] font-jakarta-extrabold italic">
                    SYSTEM OPERATIONAL • TERMINAL v4.2.0
                </Text>
            </View>
        </View>
    );
}

<<<<<<< HEAD



=======
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
