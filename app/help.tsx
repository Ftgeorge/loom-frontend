import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { AppTextInput } from '@/components/ui/TextInputs';
import { Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const FAQ_ITEMS = [
    {
        q: 'How do I find an artisan?',
        a: 'Use the Search tab to browse artisans by category, or post a job request and we\'ll match you with the best artisans near you.',
    },
    {
        q: 'How does payment work?',
        a: 'Payment is handled directly between you and the artisan. We recommend agreeing on a price before the job starts. In-app payment coming soon!',
    },
    {
        q: 'Can I switch between Client and Artisan?',
        a: 'Yes! Go to Settings → Switch Role. You can toggle between Client and Artisan modes anytime.',
    },
    {
        q: 'How are artisans verified?',
        a: 'Artisans can submit their ID for verification. Verified artisans have a green badge on their profile.',
    },
    {
        q: 'Wetin happen if I no dey satisfied?',
        a: 'You can rate and review the artisan after the job. If you have an issue, contact our support team and we go help you.',
    },
    {
        q: 'Is Operis available outside Abuja?',
        a: 'Currently we operate in Abuja, Lagos, and Port Harcourt. More cities dey come soon!',
    },
];

export default function HelpScreen() {
    const router = useRouter();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [contactMsg, setContactMsg] = useState('');

    return (
        <View className="flex-1 bg-background">
            <AppHeader title="Help & Support" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <Text className="text-2xl font-bold mb-5">Frequently Asked Questions</Text>

                {FAQ_ITEMS.map((item, i) => (
                    <Card key={i} className="mb-2" noPadding>
                        <TouchableOpacity
                            className="flex-row justify-between items-center p-5"
                            onPress={() => setExpanded(expanded === i ? null : i)}
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-medium flex-1 mr-2">{item.q}</Text>
                            <Ionicons
                                name={expanded === i ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={Colors.gray500}
                            />
                        </TouchableOpacity>
                        {expanded === i && (
                            <View className="px-5 pb-5">
                                <Text className="text-sm text-gray-600 leading-[22px]">{item.a}</Text>
                            </View>
                        )}
                    </Card>
                ))}

                <Text className="text-2xl font-bold mt-10 mb-5">Contact Support</Text>
                <AppTextInput
                    placeholder="Describe your issue..."
                    value={contactMsg}
                    onChangeText={setContactMsg}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
                <PrimaryButton
                    title="Send Message"
                    onPress={() => {
                        setContactMsg('');
                    }}
                    disabled={!contactMsg.trim()}
                    style={{ marginTop: 16 }}
                />

                <View className="mt-8 gap-4">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="mail-outline" size={18} color={Colors.gray500} />
                        <Text className="text-base text-gray-600">support@operis.ng</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="call-outline" size={18} color={Colors.gray500} />
                        <Text className="text-base text-gray-600">+234 901 234 5678</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
