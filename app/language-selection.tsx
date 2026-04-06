import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { languageNames } from '@/i18n';
import { useAppStore } from '@/store';
import { Language } from '@/types';
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
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" animated opacity={0.3} />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 32, paddingTop: 120, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 px-1">
                    <Text className="text-label text-primary mb-3 tracking-[2px] uppercase font-jakarta-extrabold italic">LOCALIZATION</Text>
                    <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter">
                        CHOOSE YOUR{"\n"}LANGUAGE
                    </Text>
                    <Text className="text-body text-ink/70 mt-5 leading-[24px] font-jakarta-medium max-w-[280px]">
                        Select your preferred mode of communication within the ecosystem.
                    </Text>
                </Animated.View>

                <View className="gap-6 flex-1">
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = selected === lang;
                        return (
                            <Animated.View key={lang} entering={FadeInDown.delay(150 + index * 100).springify()}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => setSelected(lang)}
                                    className={`flex-row items-center justify-between p-7 rounded-[28px] border-[1.5px] shadow-sm ${
                                        isSelected ? 'border-primary bg-white shadow-xl translate-y-[-2px]' : 'border-card-border bg-surface'
                                    }`}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View className={`w-10 h-10 rounded-xl items-center justify-center border ${
                                            isSelected ? 'bg-primary border-primary/20 shadow-md' : 'bg-white border-card-border'
                                        }`}>
                                            <Ionicons 
                                                name="language" 
                                                size={20} 
                                                color={isSelected ? 'white' : '#94A3B8'} 
                                            />
                                        </View>
                                        <Text className={`text-h3 text-[20px] uppercase italic font-jakarta-extrabold tracking-tight ${
                                            isSelected ? 'text-primary' : 'text-muted'
                                        }`}>
                                            {languageNames[lang]}
                                        </Text>
                                    </View>
                                    
                                    <View className={`w-8 h-8 rounded-full border-[1.5px] items-center justify-center ${
                                        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                                    }`}>
                                        {isSelected && (
                                            <View className="w-4 h-4 rounded-full bg-primary shadow-sm" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                <Animated.View entering={FadeInUp.delay(500).springify()} className="pb-12 pt-8">
                    <PrimaryButton
                        title="INITIALIZE PROFILE"
                        onPress={handleContinue}
                        className="h-16 rounded-[20px] shadow-2xl border border-primary/10"
                    />
                    
                    <View className="mt-8 items-center flex-row justify-center gap-2 opacity-40">
                        <Ionicons name="lock-closed" size={12} color="#64748B" />
                        <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold">Encryption Active • Stable v1.0</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View >
    );
}


