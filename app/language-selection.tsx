import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { languageNames, t } from '@/i18n';
import { useAppStore } from '@/store';
import { Language } from '@/types';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES: Language[] = ['en', 'pidgin', 'yoruba'];

export default function LanguageSelectionScreen() {
    const router = useRouter();
    const { language, setLanguage } = useAppStore();
    const [selected, setSelected] = useState<Language>(language);

    const handleContinue = () => {
        setLanguage(selected);
        router.replace('/role-selection');
    };

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="dense" animated opacity={0.4} scale={1.5} />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" animated opacity={0.3} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 100, paddingBottom: 150, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
<<<<<<< HEAD
                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 px-1">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] font-jakarta-extrabold italic uppercase">LOCALIZATION</Text>
                    </View>
                    <Text className="text-h1 text-[46px] leading-[50px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">
                        CHOOSE YOUR{"\n"}LANGUAGE
                    </Text>
                    <Text className="text-[15px] text-ink/60 mt-6 leading-6 font-jakarta-medium max-w-[280px] italic">
                        Select your preferred mode of communication within the ecosystem terminal.
                    </Text>
                </Animated.View>

                <View className="gap-6 mb-12">
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = selected === lang;
                        return (
                            <Animated.View key={lang} entering={FadeInDown.delay(150 + index * 100).springify()}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setSelected(lang)}
                                    className={`flex-row items-center justify-between p-7 rounded-[32px] border-[1.5px] shadow-lg transition-transform ${
                                        isSelected ? 'border-primary bg-white shadow-2xl -translate-y-1' : 'border-card-border/50 bg-white/40'
                                    }`}
                                >
                                    <View className="flex-row items-center gap-5">
                                        <View className={`w-12 h-12 rounded-2xl items-center justify-center border shadow-sm ${
                                            isSelected ? 'bg-primary border-primary/20 shadow-primary/30' : 'bg-background border-card-border'
                                        }`}>
                                            <Ionicons 
                                                name="language-outline" 
                                                size={22} 
                                                color={isSelected ? 'white' : '#94A3B8'} 
                                            />
                                        </View>
                                        <Text className={`text-[22px] uppercase italic font-jakarta-extrabold tracking-tight ${
                                            isSelected ? 'text-ink' : 'text-ink/30'
                                        }`}>
                                            {languageNames[lang].toUpperCase()}
                                        </Text>
                                    </View>
                                    
                                    <View className={`w-7 h-7 rounded-full border-[1.5px] items-center justify-center ${
                                        isSelected ? 'border-primary bg-primary/10' : 'border-card-border'
                                    }`}>
                                        {isSelected && (
                                            <View className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm shadow-primary" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                <Animated.View entering={FadeInUp.delay(500).springify()} className="pb-16 pt-10">
=======
                <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 48 }}>
                    <Text style={[Typography.label, { color: Colors.primary, marginBottom: 12 }]}>LANGUAGE</Text>
                    <Text style={[Typography.h1, { fontSize: 32, lineHeight: 38 }]}>
                        Choose your language
                    </Text>
                    <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 12, lineHeight: 22 }]}>
                        Pick the language you want to use.
                    </Text>
                </Animated.View>

                <View style={{ gap: 16, flex: 1 }}>
                    {LANGUAGES.map((lang, index) => (
                        <Animated.View key={lang} entering={FadeInDown.delay(150 + index * 100).springify()}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setSelected(lang)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 24,
                                    borderRadius: Radius.md,
                                    borderWidth: 1.5,
                                    borderColor: selected === lang ? Colors.primary : Colors.cardBorder,
                                    backgroundColor: selected === lang ? Colors.white : Colors.surface,
                                    ...Shadows.sm
                                }}
                            >
                                <Text style={[
                                    Typography.h3,
                                    { color: selected === lang ? Colors.primary : Colors.muted, fontSize: 18 }
                                ]}>
                                    {languageNames[lang]}
                                </Text>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: Radius.xs,
                                    borderWidth: 2,
                                    borderColor: selected === lang ? Colors.primary : Colors.gray200,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selected === lang ? Colors.primaryLight : 'transparent'
                                }}>
                                    {selected === lang && (
                                        <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: Colors.primary }} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInUp.delay(500).springify()} style={{ paddingBottom: 40, paddingTop: 24 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    <PrimaryButton
                        title="INITIALIZE PROFILE"
                        onPress={handleContinue}
<<<<<<< HEAD
                        className="h-18 rounded-2xl shadow-2xl border border-white/10"
=======
                        style={{ height: 64, borderRadius: Radius.md }}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    />
                    
                    <View className="mt-10 items-center flex-row justify-center gap-2.5 opacity-30">
                        <Ionicons name="shield-checkmark" size={12} color="#64748B" />
                        <Text className="text-[9px] text-muted uppercase tracking-[4px] font-jakarta-bold italic">Encryption Active • Secure v4.2</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View >
    );
}
<<<<<<< HEAD



=======
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
