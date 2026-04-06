import { LoomThread } from '@/components/ui/LoomThread';
import { PrimaryButton } from '@/components/ui/Buttons';
import { languageNames } from '@/i18n';
import { useAppStore } from '@/store';
import { Language } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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
            <LoomThread variant="minimal" animated opacity={0.3} />

            <ScrollView
                contentContainerStyle={{ padding: 32, paddingTop: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-12">
                    <Text className="text-label text-primary mb-3">LANGUAGE</Text>
                    <Text className="text-h1 text-[32px] leading-[38px]">
                        Choose your language
                    </Text>
                    <Text className="text-body text-ink/70 mt-3 leading-[22px]">
                        Pick the language you want to use.
                    </Text>
                </Animated.View>

                <View className="gap-4 flex-1">
                    {LANGUAGES.map((lang, index) => (
                        <Animated.View key={lang} entering={FadeInDown.delay(150 + index * 100).springify()}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setSelected(lang)}
                                className={`flex-row items-center justify-between p-6 rounded-md border-[1.5px] shadow-sm ${
                                    selected === lang ? 'border-primary bg-white' : 'border-card-border bg-surface'
                                }`}
                            >
                                <Text className={`text-h3 text-[18px] ${
                                    selected === lang ? 'text-primary' : 'text-muted'
                                }`}>
                                    {languageNames[lang]}
                                </Text>
                                <View className={`w-6 h-6 rounded-xs border-2 items-center justify-center ${
                                    selected === lang ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}>
                                    {selected === lang && (
                                        <View className="w-[10px] h-[10px] rounded-[2px] bg-primary" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInUp.delay(500).springify()} className="pb-10 pt-6">
                    <PrimaryButton
                        title="CONTINUE"
                        onPress={handleContinue}
                        className="h-16 rounded-md"
                    />
                </Animated.View>
            </ScrollView>
        </View >
    );
}

