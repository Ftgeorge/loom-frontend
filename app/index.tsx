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
const LETTER_DELAY = 80;
const TAGLINE_DELAY = 800;
const INDICATOR_DELAY = 1200;

function AnimatedLetter({
  letter,
  index,
}: {
  letter: string;
  index: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * LETTER_DELAY,
      withSpring(1, {
        damping: 15, stiffness: 100, mass: 1,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.7, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [30, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.85, 1]) },
    ],
  }));

  return (
    <Animated.Text
      style={animatedStyle}
      className="font-jakarta-extrabold text-[84px] text-white tracking-[-6px]"
    >
      {letter}
    </Animated.Text>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, user } = useAppStore();

  const taglineOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);

  useEffect(() => {
    taglineOpacity.value = withDelay(
      TAGLINE_DELAY,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) }),
    );

    indicatorOpacity.value = withDelay(
      INDICATOR_DELAY,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
    );

    const timer = setTimeout(() => {
      handleContinue();
    }, 3500);

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
      { translateY: interpolate(taglineOpacity.value, [0, 1], [20, 0]) },
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
          color="#CCFF00" 
          opacity={0.15}
          animated
        />
      </View>

      <View className="items-center z-10">
        <View className="flex-row items-center">
          {LETTERS.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} />
          ))}
        </View>

        <Animated.View style={taglineStyle} className="flex-row items-center gap-3 mt-3">
          <View className="h-[1px] w-5 bg-white/20" />
          <Text className="text-[9px] text-white/50 font-jakarta-bold tracking-[3px] uppercase">
            SERVICES. SIMPLIFIED.
          </Text>
          <View className="h-[1px] w-5 bg-white/20" />
        </Animated.View>
      </View>

      <Animated.View style={indicatorStyle} className="absolute bottom-16 w-full px-10 items-center">
        <ActivityIndicator color="white" size="small" className="mb-5" />
        <Text className="mt-2 text-[8px] text-white/30 font-inter-medium tracking-[2px] uppercase">Loading Content</Text>
      </Animated.View>
    </View>
  );
}




