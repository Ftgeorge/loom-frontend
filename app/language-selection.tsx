import { PrimaryButton } from '@/components/ui/Buttons';
import { languageNames, t } from '@/i18n';
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
        <View className="flex-1 bg-background pt-20 px-6">
            <Animated.View entering={FadeInDown.delay(100)} className="mb-10">
                <Text className="text-[32px] font-extrabold tracking-tight text-graphite mb-3">
                    {t('language', selected)}
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                    Choose your preferred language for using the app. You can always change this later in settings.
                </Text>
            </Animated.View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="gap-4">
                    {LANGUAGES.map((lang, index) => (
                        <Animated.View key={lang} entering={FadeInDown.delay(150 + index * 100).springify()}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setSelected(lang)}
                                className={`flex-row items-center justify-between p-6 rounded-[20px] border-[1.5px] ${selected === lang
                                    ? 'border-graphite bg-surface shadow-sm'
                                    : 'border-transparent bg-surface'
                                    }`}
                            >
                                <Text className={`text-lg font-bold ${selected === lang ? 'text-graphite' : 'text-muted'
                                    }`}>
                                    {languageNames[lang]}
                                </Text>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selected === lang ? 'border-graphite' : 'border-surface bg-background'
                                    }`}>
                                    {selected === lang && <View className="w-3 h-3 rounded-full bg-graphite" />}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            <Animated.View entering={FadeInUp.delay(500)} className="pb-12 pt-4">
                <PrimaryButton
                    title={t('confirm', selected)}
                    onPress={handleContinue}
                    className="w-full bg-graphite"
                />
            </Animated.View>
        </View >
    );
}
