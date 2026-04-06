import React from 'react';
import { View, Text } from 'react-native';

interface DetailItemProps {
    label: string;
    value: string;
    isDescription?: boolean;
    isPrice?: boolean;
    isUrgency?: boolean;
    className?: string;
}

export function DetailItem({ 
    label, 
    value, 
    isDescription, 
    isPrice, 
    isUrgency,
    className = ""
}: DetailItemProps) {
    return (
        <View className={`mb-10 ${className}`}>
            <Text className="text-label text-[10px] text-muted mb-3 uppercase tracking-[3px] font-jakarta-extrabold italic">{label}</Text>
            <Text className={`text-ink ${
                isPrice ? 'text-[22px] font-jakarta-extrabold italic tracking-tight text-primary' : 
                isUrgency ? 'text-[18px] font-jakarta-extrabold italic tracking-tighter text-accent' :
                isDescription ? 'text-[15px] font-jakarta-medium italic leading-6' :
                'text-[18px] font-jakarta-extrabold italic tracking-tighter'
            } uppercase`}>
                {value}
            </Text>
        </View>
    );
}
