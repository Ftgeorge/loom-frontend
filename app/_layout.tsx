import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import '../global.css';

SplashScreen.preventAutoHideAsync();

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import '../global.css';

SplashScreen.preventAutoHideAsync();

import BackgroundThread from '@/components/ui/BackgroundThread';
import { View } from 'react-native';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    MontserratAlternates: require('../assets/font/MontserratAlternates-Regular.ttf'),
    'MontserratAlternates-Bold': require('../assets/font/MontserratAlternates-Bold.ttf'),
    'MontserratAlternates-Italic': require('../assets/font/MontserratAlternates-Italic.ttf'),
    'MontserratAlternates-BoldItalic': require('../assets/font/MontserratAlternates-BoldItalic.ttf'),
    'MontserratAlternates-Medium': require('../assets/font/MontserratAlternates-Medium.ttf'),
    'MontserratAlternates-SemiBold': require('../assets/font/MontserratAlternates-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkAuthProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <BackgroundThread />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="language-selection" />
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
      </View>
    </ClerkAuthProvider>
  );
}
