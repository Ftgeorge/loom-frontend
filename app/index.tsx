import { LoomThread } from '@/components/ui/LoomThread';
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";

const { width } = Dimensions.get('window');

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
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [40, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.5, 1]) },
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
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) }),
    );

    indicatorOpacity.value = withDelay(
      INDICATOR_DELAY,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }),
    );

    // Auto-navigation timer (3.5 seconds)
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
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <LoomThread
          variant="complex"
          color={Colors.accent}
          opacity={0.15}
          animated
        />
      </View>

      <View style={styles.center}>
        <View style={styles.wordRow}>
          {LETTERS.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} />
          ))}
        </View>

        <Animated.View style={[styles.taglineBox, taglineStyle]}>
          <View style={styles.labelLine} />
          <Text style={styles.tagline}>
            PROFESSIONAL SERVICES. SIMPLIFIED.
          </Text>
          <View style={styles.labelLine} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, indicatorStyle]}>
        <ActivityIndicator color={Colors.white} size="small" style={{ marginBottom: 20 }} />
        <Text style={styles.version}>PREPARING YOUR EXPERIENCE...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
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
    fontFamily: "MontserratAlternates-Bold",
    fontSize: 84,
    color: Colors.white,
    letterSpacing: -6,
  },
  taglineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  labelLine: {
    height: 1,
    width: 20,
    backgroundColor: Colors.accent,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 9,
    color: Colors.accent,
    fontFamily: "MontserratAlternates-Bold",
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footer: {
    position: "absolute",
    bottom: 64,
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.white,
    height: 64,
    width: '100%',
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    ...Shadows.lg,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "MontserratAlternates-Bold",
    letterSpacing: 1,
  },
  btnIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    marginTop: 24,
    fontSize: 8,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: "MontserratAlternates-Medium",
    letterSpacing: 2,
  }
});


