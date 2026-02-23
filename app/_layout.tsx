import { Colors } from '@/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="artisan-profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="booking" options={{ presentation: 'card' }} />
        <Stack.Screen name="post-job" options={{ presentation: 'card' }} />
        <Stack.Screen name="request-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="job-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="chat" options={{ presentation: 'card' }} />
        <Stack.Screen name="rate-review" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="help" options={{ presentation: 'card' }} />
        <Stack.Screen name="artisan-onboarding" options={{ presentation: 'card' }} />
        <Stack.Screen name="matched-artisans" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
