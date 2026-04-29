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
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.3} animated scale={1.3} />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <LoomThread variant="minimal" opacity={0.3} animated />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <SubAppHeader
                label="MISSION INITIALIZATION"
                title="SELECT SLOT"
                description="Coordinate the optimal operational window for your service requirement."
                showBack
                onBack={() => router.back()}
                onNotification={() => router.push('/notifications')}
            />

            <ScrollView
<<<<<<< HEAD
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Date Matrix ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View className="flex-row items-center gap-2 mb-6 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">CHOOSE DATE</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6">
                        <View className="flex-row px-6 gap-5">
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            {DAYS.map((d) => (
                                <TouchableOpacity
                                    key={d.date}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedDate(d.date)}
<<<<<<< HEAD
                                    className={`w-[84px] h-[116px] items-center justify-center rounded-[32px] border-[1.5px] shadow-lg transition-transform ${
                                        selectedDate === d.date ? 'bg-primary border-primary shadow-primary/30 -translate-y-1' : 'bg-white border-card-border/50'
                                    }`}
                                >
                                    <Text className={`text-label text-[10px] uppercase font-jakarta-extrabold italic tracking-tight ${
                                        selectedDate === d.date ? 'text-white/60' : 'text-muted'
                                    }`}>{d.day.toUpperCase()}</Text>
                                    <Text className={`text-[32px] my-1 font-jakarta-extrabold italic tracking-tighter ${
                                        selectedDate === d.date ? 'text-white' : 'text-ink'
                                    }`}>{d.num}</Text>
                                    <Text className={`text-label text-[10px] uppercase font-jakarta-extrabold italic tracking-widest ${
                                        selectedDate === d.date ? 'text-accent' : 'text-primary'
                                    }`}>{d.month.toUpperCase()}</Text>
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>

<<<<<<< HEAD
                {/* ─── Time Registry ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-12">
                    <View className="flex-row items-center gap-2 mb-6 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">SELECT TIME</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-4">
=======
                {/* Time Selection */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Ionicons name="time-outline" size={14} color={Colors.primary} />
                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 10 }]}>SELECT TIME</Text>
                    </View>
                    {/* Profile Header Removed (Now in Header) */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        {TIME_SLOTS.map((t) => (
                            <TouchableOpacity
                                key={t}
                                activeOpacity={0.8}
                                onPress={() => setSelectedTime(t)}
<<<<<<< HEAD
                                className={`px-6 py-4 rounded-2xl border-[1.5px] shadow-sm active:scale-[0.95] ${
                                    selectedTime === t ? 'bg-accent border-accent shadow-accent/30' : 'bg-white border-card-border/50'
                                }`}
                            >
                                <Text className={`text-[12px] font-jakarta-extrabold uppercase italic tracking-tighter ${
                                    selectedTime === t ? 'text-white' : 'text-primary'
                                }`}>{t}</Text>
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

<<<<<<< HEAD
                {/* ─── Mission Debrief ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="mt-12">
                    <View className="flex-row items-center gap-2 mb-6 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">MISSION DEBRIEF</Text>
                    </View>
                    <View className="bg-white rounded-[32px] border-[1.5px] border-card-border/50 p-8 min-h-[160px] shadow-2xl">
                        <TextInput
                            className="text-[15px] text-ink font-jakarta-medium italic leading-6 p-0"
                            placeholder="Provide additional mission parameters or special instructions..."
                            placeholderTextColor="#94A3B8"
=======
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
                            placeholder="Tell the artisan:  more about what you need..."
                            placeholderTextColor={Colors.muted}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </Animated.View>

<<<<<<< HEAD
                {/* ─── Final Authorization ────────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-16">
=======
                {/* Protocol Deployment */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                    <PrimaryButton
                        title="AUTHORIZE BOOKING"
                        onPress={handleConfirm}
                        loading={loading}
                        disabled={!selectedTime}
                        variant="accent"
<<<<<<< HEAD
                        className="h-18 rounded-3xl shadow-2xl border border-white/10"
                    />
                    <View className="flex-row items-center justify-center gap-3 mt-10 opacity-30 pointer-events-none">
                        <Ionicons name="shield-checkmark" size={12} color="#22C55E" />
                        <Text className="text-label text-muted text-[9px] uppercase tracking-[4px] font-jakarta-extrabold italic">
                            PROFESSIONAL SERVICE PROTOCOL GUARANTEED
=======
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
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        </Text>
                    </View>
                </Animated.View>
                
                <View className="mt-20 items-center opacity-20 pointer-events-none">
                    <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Logistical Matrix v4.2 • Secure Encryption Active</Text>
                </View>
            </ScrollView>
        </View>
    );
}
