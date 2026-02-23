import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F5F3EF' }, // operis-bg matching React Navigation's prop requirement
                animation: 'slide_from_right',
            }}
        />
    );
}
