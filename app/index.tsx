import { LoomThread } from '@/components/ui/LoomThread';
import { useAppStore } from "@/store";
import { Colors } from "@/theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";

const LETTERS = ["L", "o", "o", "m"];
const LETTER_DELAY = 100;
const LETTER_DURATION = 1200;
const TAGLINE_DELAY = 1000;
const INDICATOR_DELAY = 1500;

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
      withTiming(1, {
        duration: LETTER_DURATION,
        easing: Easing.bezier(0.16, 1, 0.3, 1), // Custom 'graceful' ease
      }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [30, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  return (
    <Animated.Text
      style={[styles.letter, animatedStyle]}
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
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }),
    );

    indicatorOpacity.value = withDelay(
      INDICATOR_DELAY,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }),
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace(
          user?.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
        );
      } else if (hasCompletedOnboarding) {
        router.replace("/role-selection");
      } else {
        router.replace("/onboarding");
      }
    }, 3500); // Allow animation to settle
    return () => clearTimeout(timer);
  }, []);

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [
      { translateY: interpolate(taglineOpacity.value, [0, 1], [15, 0]) },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Decorative Threads */}
      <View style={StyleSheet.absoluteFill}>
        <LoomThread
          variant="complex"
          color={Colors.accent} // Heritage Bronze
          colorEnd={Colors.accent}
          opacity={0.35}
          scale={1.4}
        />
      </View>

      <View style={styles.center}>
        <View style={styles.wordRow}>
          {LETTERS.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} />
          ))}
        </View>

        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Reliable Artisan Connections
        </Animated.Text>
      </View>

      <Animated.View style={[styles.indicatorWrap, indicatorStyle]}>
        <ActivityIndicator color={Colors.white} size="small" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Deep Forest Green
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    zIndex: 10,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  letter: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 72,
    color: Colors.white,
    letterSpacing: -4,
  },
  tagline: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontFamily: "System",
    fontWeight: "600",
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  indicatorWrap: {
    position: "absolute",
    bottom: 60,
  },
});


