import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { artisanApi, skillApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, Layout, FadeIn } from 'react-native-reanimated';
import { LoomThread } from '@/components/ui/LoomThread';

export default function ManageSkillsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mySkills, setMySkills] = useState<{ skill_id: string; name: string }[]>([]);
    const [availableSkills, setAvailableSkills] = useState<{ id: string; name: string }[]>([]);
    const [artisanProfileId, setArtisanProfileId] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const [me, all, profile] = await Promise.all([
                artisanApi.getMeSkills(),
                skillApi.list(),
                artisanApi.meProfile()
            ]);
            setMySkills(me);
            // Filter out skills I already have
            const meIds = new Set(me.map(s => s.skill_id));
            setAvailableSkills(all.filter(s => !meIds.has(s.id)));
            
<<<<<<< HEAD
            if (profile?.id) {
                 setArtisanProfileId(profile.id);
=======
            if ((all as any).id) { // This is just to satisfy the Promise.all Destructuring if I returned profile as 3rd
                 setArtisanProfileId((all as any).id);
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            }
        } catch (err: any) {
            Alert.alert('System Error', err.message || 'Failed to load skill matrix');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddSkill = async (skill: { id: string; name: string }) => {
        if (!artisanProfileId) {
            Alert.alert('Protocol Error', 'Artisan profile not found. Please complete identification.');
            return;
        }
        setSaving(true);
        try {
            await artisanApi.addSkill(artisanProfileId, skill.name);
            setMySkills(prev => [...prev, { skill_id: skill.id, name: skill.name }]);
            setAvailableSkills(prev => prev.filter(s => s.id !== skill.id));
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to add resource to profile');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        Alert.alert(
            'REVOKE SPECIALIZATION',
            'Are you sure you want to remove this skill from your profile data?',
            [
                { text: 'CANCEL', style: 'cancel' },
                { 
                    text: 'REVOKE', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await artisanApi.removeSkill(skillId);
                            const removed = mySkills.find(s => s.skill_id === skillId);
                            setMySkills(prev => prev.filter(s => s.skill_id !== skillId));
                            if (removed) {
                                setAvailableSkills(prev => [...prev, { id: removed.skill_id, name: removed.name }].sort((a,b) => a.name.localeCompare(b.name)));
                            }
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to revoke specialization');
                        }
                    }
                }
            ]
        );
    };

    if (loading) return (
<<<<<<< HEAD
        <View className="flex-1 bg-background justify-center items-center">
            <LoomThread variant="minimal" animated opacity={0.3} scale={1.5} />
            <ActivityIndicator size="large" color="#00120C" />
            <Text className="text-label text-ink/40 mt-6 uppercase tracking-[5px] font-jakarta-extrabold italic">SYNCING GRID...</Text>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
        </View>
    );

    return (
<<<<<<< HEAD
        <View className="flex-1 bg-background">
            <View className="absolute inset-0">
                <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
            </View>
=======
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            <AppHeader
                title="SKILL MATRIX"
                showBack
                onBack={() => router.back()}
                showNotification={false}
            />

<<<<<<< HEAD
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 24, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Active Specializations ─────────────────────────────────── */}
                <View className="mb-14">
                    <View className="flex-row items-center gap-2 mb-3 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">ACTIVE SPECIALIZATIONS</Text>
                    </View>
                    <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4 text-ink">YOUR SKILLS</Text>
                    <Text className="text-[15px] text-ink/60 mb-10 normal-case font-jakarta-medium italic">These skills define your professional profile on the Loom grid.</Text>
                    
                    <View className="flex-row flex-wrap gap-4 py-8 px-6 bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl">
                        {mySkills.length === 0 ? (
                            <View className="flex-1 py-8 items-center bg-error/5 rounded-[24px] border border-error/10 border-dashed">
                                <Ionicons name="warning-outline" size={24} color="#EF4444" className="opacity-40" />
                                <Text className="text-label text-error/60 mt-3 uppercase font-jakarta-extrabold italic tracking-widest text-[11px]">No skills detected in profile</Text>
                            </View>
=======
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                <View style={{ marginBottom: 32 }}>
                    <Text style={[Typography.h3, { marginBottom: 8 }]}>Your Skills</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginBottom: 16 }]}>
                        These skills are visible on your profile. Remove those you no longer offer.
                    </Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {mySkills.length === 0 ? (
                            <Text style={[Typography.bodySmall, { fontStyle: 'italic', color: Colors.error }]}>You haven't added any skills yet.</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        ) : (
                            mySkills.map((skill) => (
                                <Animated.View 
                                    key={skill.skill_id} 
                                    entering={FadeInUp.springify()} 
                                    layout={Layout.springify()}
                                >
<<<<<<< HEAD
                                    <View className="flex-row items-center bg-primary/10 px-6 py-3.5 rounded-full border border-primary/20 gap-3 shadow-sm">
                                        <Text className="text-[11px] text-primary uppercase font-jakarta-extrabold italic tracking-widest">{skill.name.toUpperCase()}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveSkill(skill.skill_id)} activeOpacity={0.7}>
                                            <Ionicons name="close-circle-outline" size={20} color="#078365" />
=======
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: Colors.primary + '10',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: Radius.full,
                                        borderWidth: 1,
                                        borderColor: Colors.primary + '30',
                                        gap: 6
                                    }}>
                                        <Text style={[Typography.label, { color: Colors.primary, fontSize: 13 }]}>{skill.name}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveSkill(skill.skill_id)}>
                                            <Ionicons name="close-circle" size={18} color={Colors.primary} />
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))
                        )}
                    </View>
                </View>

                {/* ─── Discovery Matrix ────────────────────────────────────────── */}
                <View>
<<<<<<< HEAD
                    <View className="flex-row items-center gap-2 mb-3 px-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                        <Text className="text-label text-accent tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">GRID DISCOVERY</Text>
                    </View>
                    <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter mb-4 text-ink">AVAILABLE SKILLS</Text>
                    <Text className="text-[15px] text-ink/60 mb-10 normal-case font-jakarta-medium italic">Tap to add new capabilities to your operational identity.</Text>

                    <View className="flex-row flex-wrap gap-4">
=======
                    <Text style={[Typography.h3, { marginBottom: 8 }]}>Available Skills</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginBottom: 16 }]}>
                        Tap a skill to add it to your profile.
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                        {availableSkills.map((skill) => (
                            <Animated.View 
                                key={skill.id} 
                                entering={FadeInUp.delay(50).springify()}
                                layout={Layout.springify()}
                            >
                                <TouchableOpacity 
                                    onPress={() => handleAddSkill(skill)}
                                    disabled={saving}
<<<<<<< HEAD
                                    activeOpacity={0.8}
                                    className="flex-row items-center bg-white px-6 py-4 rounded-3xl border-[1.5px] border-card-border/50 gap-3 shadow-xl active:scale-95 active:bg-gray-50 transition-transform"
                                >
                                    <View className="w-6 h-6 rounded-lg bg-background items-center justify-center border border-card-border/50">
                                        <Ionicons name="add" size={16} color="#00120C" />
                                    </View>
                                    <Text className="text-[12px] text-ink uppercase font-jakarta-extrabold italic tracking-tight">{skill.name.toUpperCase()}</Text>
=======
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: Colors.white,
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: Radius.full,
                                        borderWidth: 1,
                                        borderColor: Colors.cardBorder,
                                        gap: 6,
                                        ...Shadows.xs
                                    }}
                                >
                                    <Ionicons name="add" size={16} color={Colors.muted} />
                                    <Text style={[Typography.label, { color: Colors.ink, fontSize: 13 }]}>{skill.name}</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {saving && (
<<<<<<< HEAD
                <Animated.View 
                    entering={FadeIn}
                    className="absolute inset-0 bg-background/80 justify-center items-center backdrop-blur-md"
                >
                    <View className="w-24 h-24 rounded-[32px] bg-white items-center justify-center shadow-3xl border border-card-border/50">
                        <ActivityIndicator size="small" color="#00120C" />
                    </View>
                    <Text className="text-label text-ink/40 mt-8 uppercase tracking-[5px] font-jakarta-extrabold italic">UPDATING MATRIX...</Text>
                </Animated.View>
=======
                <View style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
            )}
            
            <View className="absolute bottom-12 left-0 right-0 items-center pointer-events-none opacity-20">
                <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Skill Identity Protocol v4.2 • Secure Encryption Active</Text>
            </View>
        </View>
    );
}
