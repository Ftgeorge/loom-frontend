import { LoomThread } from '@/components/ui/LoomThread';
import { useAppStore } from "@/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from "react-native-reanimated";

const LETTERS = ["L", "o", "o", "m"];
import { AnimatedLetter } from '@/components/splash/AnimatedLetter';

const TAGLINE_DELAY = 800;
const INDICATOR_DELAY = 1200;

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, user } = useAppStore();

  const taglineOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);

  useEffect(() => {
    taglineOpacity.value = withDelay(
      TAGLINE_DELAY,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }),
    );

    indicatorOpacity.value = withDelay(
      INDICATOR_DELAY,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }),
    );

    const timer = setTimeout(() => {
      handleContinue();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (isAuthenticated) {
      router.replace(
        user?.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
      );
    } else if (hasCompletedOnboarding) {
      router.replace("/role-selection");
    } else {
      router.replace("/onboarding");
    }
  };

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [
      { translateY: interpolate(taglineOpacity.value, [0, 1], [30, 0]) },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
  }));

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <View className="absolute inset-0">
        <LoomThread
          variant="complex"
          color="#FFFFFF" 
          opacity={0.18}
          animated
        />
      </View>

      <View className="items-center z-20">
        <View className="flex-row items-center mb-4">
          {LETTERS.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} />
          ))}
        </View>

        <Animated.View style={taglineStyle}>
          <View className="flex-row items-center gap-4">
            <View className="h-[1.5px] w-6 bg-white/30 rounded-full" />
            <Text className="text-[10px] text-white font-jakarta-extrabold tracking-[6px] uppercase italic text-center">
              SERVICES SIMPLIFIED
            </Text>
            <View className="h-[1.5px] w-6 bg-white/30 rounded-full" />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={indicatorStyle} className="absolute bottom-24 w-full px-12 items-center flex-row justify-center gap-4 z-10">
        <ActivityIndicator color="white" size="small" />
        <Text className="text-[9px] text-white/40 font-jakarta-extrabold italic tracking-[4px] uppercase">
          Initializing Frequency
        </Text>
      </Animated.View>
      
      <View className="absolute bottom-12 items-center opacity-10">
          <Text className="text-[8px] text-white tracking-[2px] font-jakarta-bold italic">LOOM ECOSYSTEM v4.2 PROTOTYPE</Text>
      </View>
    </View>
  );
}





