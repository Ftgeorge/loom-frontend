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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" animated opacity={0.3} />

            <ScrollView
                contentContainerStyle={{ padding: 32, paddingTop: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
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
                    <PrimaryButton
                        title="CONTINUE"
                        onPress={handleContinue}
                        style={{ height: 64, borderRadius: Radius.md }}
                    />
                </Animated.View>
            </ScrollView>
        </View >
    );
}
