import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { LoomThread } from '@/components/ui/LoomThread';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        router.back();
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.6} animated />
            <AppHeader title="Schedule Booking" showBack onBack={() => router.back()} showNotification={false} />

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Text style={[Typography.h3, { marginBottom: 16 }]}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 10 }}>
                            {DAYS.map((d) => (
                                <TouchableOpacity
                                    key={d.date}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDate(d.date)}
                                    style={{
                                        width: 70,
                                        height: 90,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: Radius.lg,
                                        backgroundColor: selectedDate === d.date ? Colors.accent : Colors.surface,
                                        borderWidth: 1.5,
                                        borderColor: selectedDate === d.date ? Colors.accent : Colors.cardBorder,
                                        ...Shadows.sm
                                    }}
                                >
                                    <Text style={[Typography.label, {
                                        color: selectedDate === d.date ? Colors.white : Colors.muted,
                                        fontSize: 10,
                                        textTransform: 'none'
                                    }]}>{d.day}</Text>
                                    <Text style={[Typography.h2, {
                                        color: selectedDate === d.date ? Colors.white : Colors.text,
                                        marginVertical: 4
                                    }]}>{d.num}</Text>
                                    <Text style={[Typography.label, {
                                        color: selectedDate === d.date ? Colors.white : Colors.muted,
                                        fontSize: 10,
                                        textTransform: 'none'
                                    }]}>{d.month}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)} style={{ marginTop: 40 }}>
                    <Text style={[Typography.h3, { marginBottom: 16 }]}>Select Time</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {TIME_SLOTS.map((t) => (
                            <TouchableOpacity
                                key={t}
                                activeOpacity={0.8}
                                onPress={() => setSelectedTime(t)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: Radius.full,
                                    backgroundColor: selectedTime === t ? Colors.accentLight : Colors.surface,
                                    borderWidth: 1.5,
                                    borderColor: selectedTime === t ? Colors.accent : Colors.cardBorder,
                                }}
                            >
                                <Text style={[Typography.bodySmall, {
                                    fontFamily: selectedTime === t ? 'MontserratAlternates-SemiBold' : 'MontserratAlternates',
                                    color: selectedTime === t ? Colors.accent : Colors.textSecondary
                                }]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 40 }}>
                    <Text style={[Typography.h3, { marginBottom: 16 }]}>Job Details (Optional)</Text>
                    <View style={{
                        backgroundColor: Colors.surface,
                        borderRadius: Radius.lg,
                        borderWidth: 1.5,
                        borderColor: Colors.cardBorder,
                        padding: 16,
                        minHeight: 120,
                        ...Shadows.sm
                    }}>
                        <TextInput
                            style={[Typography.body, { color: Colors.text, textAlignVertical: 'top' }]}
                            placeholder="Tell the pro more about the job or any gate access codes..."
                            placeholderTextColor={Colors.muted}
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 48 }}>
                    <PrimaryButton
                        title="Confirm Booking"
                        onPress={handleConfirm}
                        loading={loading}
                        disabled={!selectedTime}
                        variant="accent"
                    />
                    <Text style={[Typography.bodySmall, { textAlign: 'center', marginTop: 16, color: Colors.muted }]}>
                        Cancellation is free up to 2 hours before the job.
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
