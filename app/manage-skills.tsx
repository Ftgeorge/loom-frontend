import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/ui/Buttons';
import { Card } from '@/components/ui/CardChipBadge';
import { artisanApi, skillApi } from '@/services/api';
import { Colors, Radius, Shadows, Typography } from '@/theme';
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
            // Filter out skills I already have
            const meIds = new Set(me.map(s => s.skill_id));
            setAvailableSkills(all.filter(s => !meIds.has(s.id)));
            
            if ((all as any).id) { // This is just to satisfy the Promise.all Destructuring if I returned profile as 3rd
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
        <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <AppHeader
                title="Manage Skills"
                showBack
                onBack={() => router.back()}
            />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                <View style={{ marginBottom: 32 }}>
                    <Text style={[Typography.h3, { marginBottom: 8 }]}>Your Skills</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginBottom: 16 }]}>
                        These skills are visible on your profile. Remove those you no longer offer.
                    </Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {mySkills.length === 0 ? (
                            <Text style={[Typography.bodySmall, { fontStyle: 'italic', color: Colors.error }]}>You haven't added any skills yet.</Text>
                        ) : (
                            mySkills.map((skill) => (
                                <Animated.View 
                                    key={skill.skill_id} 
                                    entering={FadeInUp} 
                                    layout={Layout.springify()}
                                >
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
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))
                        )}
                    </View>
                </View>

                <View>
                    <Text style={[Typography.h3, { marginBottom: 8 }]}>Available Skills</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.muted, marginBottom: 16 }]}>
                        Tap a skill to add it to your profile.
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {availableSkills.map((skill) => (
                            <Animated.View 
                                key={skill.id} 
                                entering={FadeInUp}
                                layout={Layout.springify()}
                            >
                                <TouchableOpacity 
                                    onPress={() => handleAddSkill(skill)}
                                    disabled={saving}
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
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {saving && (
                <View style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(255,255,255,0.7)', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
        </View>
    );
}
