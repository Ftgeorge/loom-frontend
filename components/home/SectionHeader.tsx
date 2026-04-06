import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    overline: string;
    title: string;
    action?: string;
    onAction?: () => void;
    className?: string;
}

export function SectionHeader({ overline, title, action, onAction, className = '' }: SectionHeaderProps) {
    return (
        <View className={`flex-row items-end justify-between mb-5 ${className}`}>
            <View>
                <Text className="text-[10px] font-inter-semibold text-muted tracking-[0.8px] uppercase mb-1">
                    {overline}
                </Text>
                <Text className="text-[20px] font-jakarta-bold text-ink">
                    {title}
                </Text>
            </View>
            {action && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    className="py-[6px] flex-row items-center gap-1"
                >
                    <Text className="text-[12px] font-inter-semibold text-primary">
                        {action}
                    </Text>
                    <Ionicons name="chevron-forward" size={11} className="text-primary" />
                </TouchableOpacity>
            )}
        </View>
    );
}

