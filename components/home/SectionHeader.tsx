import { Colors, Radius } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    overline: string;
    title: string;
    action?: string;
    onAction?: () => void;
}

export function SectionHeader({ overline, title, action, onAction }: SectionHeaderProps) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 20,
        }}>
            <View>
                <Text style={{
                    fontSize: 10, fontFamily: 'Inter-SemiBold',
                    color: Colors.muted, letterSpacing: 0.8,
                    textTransform: 'uppercase', marginBottom: 4,
                }}>
                    {overline}
                </Text>
                <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans-Bold', color: Colors.ink }}>
                    {title}
                </Text>
            </View>
            {action && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    style={{
                        backgroundColor: Colors.canvas,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: Radius.full,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    <Text style={{ fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.primary }}>
                        {action}
                    </Text>
                    <Ionicons name="chevron-forward" size={11} color={Colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
}
