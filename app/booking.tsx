import { SubAppHeader } from '@/components/AppSubHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { artisanApi, jobApi } from '@/services/api';
import { mapArtisan } from '@/services/mappers';
import { useAppStore } from '@/store';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import type { Artisan } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM',
];

const DAYS = (() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push({
            date: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en', { weekday: 'short' }),
            num: d.getDate(),
            month: d.toLocaleDateString('en', { month: 'short' }),
        });
    }
    return days;
})();

export default function BookingScreen() {
    const router = useRouter();
    const { artisanId } = useLocalSearchParams<{ artisanId: string }>();
    const { user } = useAppStore();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (artisanId) {
            artisanApi.getById(artisanId).then(res => {
                setArtisan(mapArtisan(res));
            }).catch(console.error);
        }
    }, [artisanId]);

    const handleConfirm = async () => {
        if (!artisan) return;
        setLoading(true);
        try {
            // 1. Create Job Request
            const jobRes = await jobApi.create({
                description: notes || `Service booking with ${artisan.name}`,
                skill: artisan.skills[0] || 'general',
                budget: 0,
                urgency: 'today',
                location: `${user?.location?.area}, ${user?.location?.city}`
            });

            // 2. Assign to this specific artisan
            await jobApi.assign(jobRes.id, artisan.id);

            router.push('/(tabs)/requests');
        } catch (err: any) {
            console.error("[Booking] Error:", err);
            const msg = err.details 
                ? `${err.message}: ${JSON.stringify(err.details)}` 
                : err.message || "Unable to complete booking.";
            Alert.alert("Booking Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
            <SubAppHeader
                label="BOOKING"
                title="Select Slot"
                description="Choose a date and time that works best for your service."
                showBack
                onBack={() => router.back()}
                onNotification={() => {}}
            />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Protocol Header */}
                {/* Content Removed (Now in Header) */}

                {/* Date Selection */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>CHOOSE DATE</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 12 }}>
                            {DAYS.map((d) => (
                                <TouchableOpacity
                                    key={d.date}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDate(d.date)}
                                    style={{
                                        width: 72,
                                        height: 100,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: Radius.md,
                                        backgroundColor: selectedDate === d.date ? Colors.primary : Colors.white,
                                        borderWidth: 1.5,
                                        borderColor: selectedDate === d.date ? Colors.primary : Colors.cardBorder,
                                        ...Shadows.sm
                                    }}
                                >
                                    <View style={{
                                        position: 'absolute',
                                        top: 8,
                                        width: 12,
                                        height: 1,
                                        backgroundColor: selectedDate === d.date ? Colors.accent : Colors.cardBorder,
                                    }} />
                                    <Text style={[Typography.label, {
                                        color: selectedDate === d.date ? 'rgba(255,255,255,0.6)' : Colors.muted,
                                        fontSize: 9,
                                        textTransform: 'uppercase'
                                    }]}>{d.day}</Text>
                                    <Text style={[Typography.h2, {
                                        color: selectedDate === d.date ? Colors.white : Colors.text,
                                        fontSize: 24,
                                        marginVertical: 4
                                    }]}>{d.num}</Text>
                                    <Text style={[Typography.label, {
                                        color: selectedDate === d.date ? Colors.accent : Colors.primary,
                                        fontSize: 9,
                                        fontWeight: '800'
                                    }]}>{d.month.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Time Selection */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Ionicons name="time-outline" size={14} color={Colors.primary} />
                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>SELECT TIME</Text>
                    </View>
                    {/* Profile Header Removed (Now in Header) */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {TIME_SLOTS.map((t) => (
                            <TouchableOpacity
                                key={t}
                                activeOpacity={0.8}
                                onPress={() => setSelectedTime(t)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: Radius.xs,
                                    backgroundColor: selectedTime === t ? Colors.accent : Colors.white,
                                    borderWidth: 1.5,
                                    borderColor: selectedTime === t ? Colors.accent : Colors.cardBorder,
                                    ...Shadows.sm
                                }}
                            >
                                <Text style={[Typography.label, {
                                    fontSize: 10,
                                    color: selectedTime === t ? Colors.white : Colors.primary,
                                    fontWeight: '800'
                                }]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Mission Data */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>SERVICE DETAILS</Text>
                    </View>
                    <View style={{
                        backgroundColor: Colors.white,
                        borderRadius: Radius.md,
                        borderWidth: 1.5,
                        borderColor: Colors.cardBorder,
                        padding: 16,
                        minHeight: 140,
                        ...Shadows.sm
                    }}>
                        <TextInput
                            style={[Typography.body, { color: Colors.text, textAlignVertical: 'top', fontSize: 14 }]}
                            placeholder="Tell the pro more about what you need..."
                            placeholderTextColor={Colors.muted}
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </Animated.View>

                {/* Protocol Deployment */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48 }}>
                    <PrimaryButton
                        title="CONFIRM BOOKING"
                        onPress={handleConfirm}
                        loading={loading}
                        disabled={!selectedTime}
                        variant="accent"
                        style={{ height: 64, borderRadius: Radius.md, ...Shadows.md }}
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 20
                    }}>
                        <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
                        <Text style={[Typography.label, { textAlign: 'center', color: Colors.muted, fontSize: 8, textTransform: 'none' }]}>
                            PROFESSIONAL SERVICE GUARANTEED
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
