import { AppHeader } from '@/components/AppHeader';
import { artisanApi, skillApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function ManageSkillsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mySkills, setMySkills] = useState<{ skill_id: string; name: string }[]>([]);
    const [availableSkills, setAvailableSkills] = useState<{ id: string; name: string }[]>([]);
    const [artisanProfileId, setArtisanProfileId] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const [me, all] = await Promise.all([
                artisanApi.getMeSkills(),
                skillApi.list(),
                artisanApi.meProfile()
            ]);
            setMySkills(me);
            const meIds = new Set(me.map(s => s.skill_id));
            setAvailableSkills(all.filter(s => !meIds.has(s.id)));
            
            if ((all as any).id) {
                 setArtisanProfileId((all as any).id);
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const loadProfile = async () => {
        try {
            const profile: any = await artisanApi.meProfile();
            setArtisanProfileId(profile.id);
        } catch (err) {}
    };

    useEffect(() => {
        loadData();
        loadProfile();
    }, []);

    const handleAddSkill = async (skill: { id: string; name: string }) => {
        if (!artisanProfileId) return;
        setSaving(true);
        try {
            await artisanApi.addSkill(artisanProfileId, skill.name);
            setMySkills(prev => [...prev, { skill_id: skill.id, name: skill.name }]);
            setAvailableSkills(prev => prev.filter(s => s.id !== skill.id));
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to add skill');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        Alert.alert(
            'Remove Skill',
            'Are you sure you want to remove this skill from your profile?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
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
                            Alert.alert('Error', err.message || 'Failed to remove skill');
                        }
                    }
                }
            ]
        );
    };

    if (loading) return (
        <View className="flex-1 bg-background justify-center items-center">
            <ActivityIndicator size="large" color="#078365" />
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <AppHeader
                title="Manage Skills"
                showBack
                onBack={() => router.back()}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                <View className="mb-10">
                    <Text className="text-h3 mb-2 uppercase">Your Skills</Text>
                    <Text className="text-body-sm text-muted mb-4 normal-case">
                        These skills are visible on your profile. Remove those you no longer offer.
                    </Text>
                    
                    <View className="flex-row flex-wrap gap-3">
                        {mySkills.length === 0 ? (
                            <Text className="text-label text-error italic text-[11px] normal-case">You haven&apos;t added any skills yet.</Text>
                        ) : (
                            mySkills.map((skill) => (
                                <Animated.View 
                                    key={skill.skill_id} 
                                    entering={FadeInUp} 
                                    layout={Layout.springify()}
                                >
                                    <View className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full border border-primary/20 gap-2">
                                        <Text className="text-label text-primary text-[13px] uppercase font-jakarta-bold">{skill.name}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveSkill(skill.skill_id)}>
                                            <Ionicons name="close-circle" size={18} color="#078365" />
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))
                        )}
                    </View>
                </View>

                <View>
                    <Text className="text-h3 mb-2 uppercase">Available Skills</Text>
                    <Text className="text-body-sm text-muted mb-4 normal-case">
                        Tap a skill to add it to your profile.
                    </Text>

                    <View className="flex-row flex-wrap gap-3">
                        {availableSkills.map((skill) => (
                            <Animated.View 
                                key={skill.id} 
                                entering={FadeInUp}
                                layout={Layout.springify()}
                            >
                                <TouchableOpacity 
                                    onPress={() => handleAddSkill(skill)}
                                    disabled={saving}
                                    className="flex-row items-center bg-white px-4 py-[10px] rounded-full border border-card-border gap-2 shadow-xs"
                                >
                                    <Ionicons name="add" size={16} color="#64748B" />
                                    <Text className="text-label text-ink text-[13px] uppercase font-jakarta-semibold">{skill.name}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {saving && (
                <View className="absolute inset-0 bg-white/70 justify-center items-center">
                    <ActivityIndicator size="large" color="#078365" />
                </View>
            )}
        </View>
    );
}

